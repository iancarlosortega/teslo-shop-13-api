import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Country } from './entities/country.entity';
import { CreateCountryDto } from './dtos/create-country.dto';

@Injectable()
export class CountriesService {
  private readonly logger = new Logger('CountriesService');

  constructor(
    @InjectRepository(Country)
    private readonly countryRepository: Repository<Country>,
  ) {}

  async create(createCountryDto: CreateCountryDto) {
    try {
      const country = this.countryRepository.create(createCountryDto);
      return await this.countryRepository.save(country);
    } catch (error) {
      this.handleDBExceptions(error);
    }
  }

  async findAll() {
    try {
      return await this.countryRepository.find();
    } catch (error) {
      this.handleDBExceptions(error);
    }
  }

  async findOne(id: string) {
    try {
      const country = await this.countryRepository.findOneBy({ id });
      if (!country) {
        throw new NotFoundException('Country not found');
      }
      return country;
    } catch (error) {
      this.handleDBExceptions(error);
    }
  }

  async removeAll() {
    const query = this.countryRepository.createQueryBuilder('country');
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
