import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EnvConfiguration } from 'config/app.config';
import { JoiValidationSchema } from 'config/joi.validation';
import { ProductsModule } from './products/products.module';
import { CategoriesModule } from './categories/categories.module';
import { SeedModule } from './seed/seed.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { CountriesModule } from './countries/countries.module';
import { AddressesModule } from './addresses/addresses.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [EnvConfiguration],
      validationSchema: JoiValidationSchema,
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: +process.env.DB_PORT,
      database: process.env.DB_NAME,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      autoLoadEntities: true,
      synchronize: true,
      ssl: process.env.STAGE === 'prod',
      extra: {
        ssl:
          process.env.STAGE === 'prod'
            ? {
                rejectUnauthorized: false,
              }
            : null,
      },
    }),
    AuthModule,
    UsersModule,
    CategoriesModule,
    ProductsModule,
    SeedModule,
    CountriesModule,
    AddressesModule,
  ],
})
export class AppModule {}
