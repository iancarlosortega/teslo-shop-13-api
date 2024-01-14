import { Module } from '@nestjs/common';
import { UsersModule } from 'src/users/users.module';
import { CategoriesModule } from 'src/categories/categories.module';
import { ProductsModule } from 'src/products/products.module';
import { CountriesModule } from 'src/countries/countries.module';
import { SeedService } from './seed.service';
import { SeedController } from './seed.controller';

@Module({
  controllers: [SeedController],
  providers: [SeedService],
  imports: [CategoriesModule, ProductsModule, UsersModule, CountriesModule],
})
export class SeedModule {}
