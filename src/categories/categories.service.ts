import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from './entities/category.entity';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { PaginationDto } from 'src/common/dtos/pagination.dto';

@Injectable()
export class CategoriesService {
  private logger = new Logger('CategoriesService');

  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) {}

  async create(createCategoryDto: CreateCategoryDto) {
    try {
      const category = this.categoryRepository.create(createCategoryDto);
      return await this.categoryRepository.save(category);
    } catch (error) {
      this.handleDBExceptions(error);
    }
  }

  async findAllWithPagination(paginatioDto: PaginationDto) {
    const { limit = 10, offset = 0 } = paginatioDto;

    try {
      const [totalItems, results] = await this.categoryRepository.findAndCount({
        take: limit,
        skip: offset,
      });

      return {
        totalItems,
        results,
      };
    } catch (error) {
      this.handleDBExceptions(error);
    }
  }

  findAll() {
    try {
      return this.categoryRepository.find({});
    } catch (error) {
      this.handleDBExceptions(error);
    }
  }

  findOne(id: string) {
    try {
      const category = this.categoryRepository.findOneBy({ id });
      if (!category) {
        throw new NotFoundException('Category not found');
      }
      return category;
    } catch (error) {
      this.handleDBExceptions(error);
    }
  }

  async update(id: string, updateCategoryDto: UpdateCategoryDto) {
    const category = await this.findOne(id);
    return this.categoryRepository.save({
      ...category,
      ...updateCategoryDto,
    });
  }

  async remove(id: string) {
    const category = await this.findOne(id);
    return this.categoryRepository.remove(category);
  }

  async removeAll() {
    const query = this.categoryRepository.createQueryBuilder('category');
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
