import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { validate as isUUID } from 'uuid';
import { ProductImage } from './entities/product-image.entity';
import { Product } from './entities/product.entity';
import { User } from 'src/users/entities/user.entity';
import {
  CreateProductDto,
  UpdateProductDto,
  PaginationProductsDto,
} from './dtos';

@Injectable()
export class ProductsService {
  private readonly logger = new Logger('ProductsService');

  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,

    @InjectRepository(ProductImage)
    private readonly productImageRepository: Repository<ProductImage>,

    private readonly dataSource: DataSource,
  ) {}

  async create(createProductDto: CreateProductDto, user: User) {
    try {
      const { images = [], ...productDetails } = createProductDto;

      const product = this.productRepository.create({
        ...productDetails,
        user,
        images: images.map((image) =>
          this.productImageRepository.create({ url: image }),
        ),
      });
      await this.productRepository.save(product);
      return {
        ...product,
        images,
      };
    } catch (error) {
      this.handleDBExceptions(error);
    }
  }

  async findAll(paginatioProductsDto: PaginationProductsDto) {
    const { take = 12, page = 1, gender = '' } = paginatioProductsDto;

    try {
      const [products, totalItems] = await this.productRepository.findAndCount({
        take,
        skip: (page - 1) * take,
        where: {
          ...(gender && { gender }),
        },
        relations: {
          images: true,
        },
      });

      return {
        currentPage: page,
        totalPages: Math.ceil(totalItems / take),
        products: products.map((product) => ({
          ...product,
          category: product.category.name,
          images: product.images.map((image) => image.url),
        })),
      };
    } catch (error) {
      this.handleDBExceptions(error);
    }
  }

  async findOne(term: string) {
    try {
      let product: Product;
      if (isUUID(term)) {
        product = await this.productRepository.findOneBy({ id: term });
      } else {
        const queryBuilder = this.productRepository.createQueryBuilder('prod');
        product = await queryBuilder
          .where('LOWER(title) = LOWER(:title) or LOWER(slug) = LOWER(:slug)', {
            title: term,
            slug: term,
          })
          .leftJoinAndSelect('prod.images', 'prodImages')
          .getOne();
      }
      if (!product)
        throw new NotFoundException(`Product with term: "${term}" not found`);
      return product;
    } catch (error) {
      this.handleDBExceptions(error);
    }
  }

  async findOnePlain(term: string) {
    const { images = [], ...product } = await this.findOne(term);
    return {
      ...product,
      images: images.map((img) => img.url),
    };
  }

  async update(id: string, updateProductDto: UpdateProductDto, user: User) {
    const { images, ...productDetails } = updateProductDto;

    const product = await this.productRepository.preload({
      id,
      ...productDetails,
    });

    if (!product)
      throw new NotFoundException(`Product with id: ${id} not found`);

    //TODO: Query Runner
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      if (images) {
        await queryRunner.manager.delete(ProductImage, { product: { id } });
        product.images = images.map((image) =>
          this.productImageRepository.create({ url: image }),
        );
      }

      product.user = user;
      await queryRunner.manager.save(product);

      await queryRunner.commitTransaction();
      await queryRunner.release();

      return this.findOnePlain(id);
    } catch (error) {
      await queryRunner.rollbackTransaction();
      await queryRunner.release();
      this.handleDBExceptions(error);
    }
  }

  async remove(id: string) {
    try {
      const product = await this.findOne(id);
      await this.productRepository.remove(product);
      return `Product with id: "${id}" was deleted succesfully`;
    } catch (error) {
      this.handleDBExceptions(error);
    }
  }

  async removeAll() {
    const query = this.productRepository.createQueryBuilder('product');
    try {
      return await query.delete().where({}).execute();
    } catch (error) {
      this.handleDBExceptions(error);
    }
  }

  private handleDBExceptions(error: any) {
    if (error.status === 404) {
      throw new NotFoundException(error.response.message);
    }
    if (error.code === '23505') {
      throw new BadRequestException(error.detail);
    }
    this.logger.error(error);
    console.log(error);
    throw new InternalServerErrorException(
      'Unexpected error, check server logs',
    );
  }
}
