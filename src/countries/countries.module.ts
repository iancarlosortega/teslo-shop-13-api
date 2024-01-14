import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CountriesService } from './countries.service';
import { Country } from './entities/country.entity';

@Module({
  providers: [CountriesService],
  imports: [TypeOrmModule.forFeature([Country])],
  exports: [CountriesService],
})
export class CountriesModule {}
