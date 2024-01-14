import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AddressesService } from './addresses.service';
import { CountriesModule } from 'src/countries/countries.module';
import { UsersModule } from 'src/users/users.module';
import { AddressesController } from './addresses.controller';
import { Address } from './entities/address.entity';

@Module({
  controllers: [AddressesController],
  providers: [AddressesService],
  imports: [TypeOrmModule.forFeature([Address]), CountriesModule, UsersModule],
})
export class AddressesModule {}
