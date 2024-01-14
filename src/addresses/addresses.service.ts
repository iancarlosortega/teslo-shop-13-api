import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Address } from './entities/address.entity';
import { CountriesService } from 'src/countries/countries.service';
import { UsersService } from 'src/users/users.service';
import { CreateAddressDto } from './dto/create-address.dto';

type AddressWithoutId = Omit<Address, 'id'>;

@Injectable()
export class AddressesService {
  private readonly logger = new Logger('AddressesService');

  constructor(
    @InjectRepository(Address)
    private readonly addressRepository: Repository<Address>,
    private readonly countriesService: CountriesService,
    private readonly usersService: UsersService,
  ) {}

  async createOrReplace(createAddressDto: CreateAddressDto) {
    try {
      const {
        user: userId,
        country: countryId,
        ...addressDetails
      } = createAddressDto;
      const country = await this.countriesService.findOne(countryId);
      const user = await this.usersService.findOne(userId);
      const address = {
        ...addressDetails,
        country,
        user,
      };

      const storedAddress = await this.findByUser(userId);

      if (!storedAddress) {
        const newAddress = await this.create(address);
        return newAddress;
      }

      const updatedAddress = await this.update(storedAddress.id, address);

      return updatedAddress;
    } catch (error) {
      this.handleDBExceptions(error);
    }
  }

  async create(newAddress: AddressWithoutId) {
    try {
      const address = this.addressRepository.create(newAddress);
      return this.addressRepository.save(address);
    } catch (error) {
      this.handleDBExceptions(error);
    }
  }

  findAll() {
    return this.addressRepository.find();
  }

  async findOne(id: string) {
    try {
      const address = await this.findByUser(id);
      if (!address) {
        throw new NotFoundException('Address not found');
      }
      return address;
    } catch (error) {
      this.handleDBExceptions(error);
    }
  }

  async findByUser(userId: string) {
    try {
      const address = await this.addressRepository.findOne({
        where: {
          user: {
            id: userId,
          },
        },
      });
      return address;
    } catch (error) {
      this.handleDBExceptions(error);
    }
  }

  async update(id: string, newAddress: AddressWithoutId) {
    try {
      const address = await this.findOne(id);
      return this.addressRepository.save({
        ...address,
        ...newAddress,
      });
    } catch (error) {
      this.handleDBExceptions(error);
    }
  }

  async remove(userId: string) {
    try {
      const address = await this.findByUser(userId);
      if (!address) {
        throw new NotFoundException('Address not found');
      }
      return this.addressRepository.remove(address);
    } catch (error) {
      this.handleDBExceptions(error);
    }
  }

  async removeAll() {
    const query = this.addressRepository.createQueryBuilder('address');
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
