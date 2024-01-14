import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CountriesService } from './countries.service';
import { CountriesController } from './countries.controller';
import { Country } from './entities/country.entity';

@Module({
  providers: [CountriesService],
  controllers: [CountriesController],
  imports: [TypeOrmModule.forFeature([Country])],
  exports: [CountriesService],
})
export class CountriesModule {}
