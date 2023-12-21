import { Injectable } from '@nestjs/common';
import { CategoriesService } from 'src/categories/categories.service';
import { ProductsService } from 'src/products/products.service';
import { UsersService } from 'src/users/users.service';
import { User } from 'src/users/entities/user.entity';
import { initialData } from './data/seed-data';

@Injectable()
export class SeedService {
  constructor(
    private readonly usersService: UsersService,
    private readonly categoriesService: CategoriesService,
    private readonly productsService: ProductsService,
  ) {}

  async runSeed() {
    await this.deleteAllTables();
    await this.insertCategories();
    const adminUser = await this.insertUsers();
    await this.insertProducts(adminUser);
    return 'Seed executed succesfully';
  }

  private async insertCategories() {
    const seedCategories = initialData.categories;
    const insertPromises = [];

    seedCategories.forEach((category) => {
      insertPromises.push(
        this.categoriesService.create({
          name: category,
        }),
      );
    });

    await Promise.all(insertPromises);
  }

  private async insertUsers() {
    const seedUsers = initialData.users;
    const insertPromises = [];

    seedUsers.forEach((user) => {
      insertPromises.push(this.usersService.create(user));
    });

    const users = await Promise.all(insertPromises);
    return users[0];
  }

  private async insertProducts(user: User) {
    const seedProducts = initialData.products;
    const insertPromises = [];

    const categories = await this.categoriesService.findAll();

    seedProducts.forEach((product) => {
      const categoryId = categories.find(
        (category) =>
          category.name.toLowerCase() === product.type.toLowerCase(),
      ).id;

      insertPromises.push(
        this.productsService.create(
          {
            ...product,
            categoryId,
          },
          user,
        ),
      );
    });

    await Promise.all(insertPromises);
  }

  private async deleteAllTables() {
    await this.usersService.removeAll();
    await this.categoriesService.removeAll();
    await this.productsService.removeAll();
  }
}
