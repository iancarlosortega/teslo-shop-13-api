import { IsOptional, IsString, IsUUID } from 'class-validator';

export class CreateAddressDto {
  @IsString()
  firstName: string;

  @IsString()
  lastName: string;

  @IsString()
  address: string;

  @IsString()
  @IsOptional()
  address2: string;

  @IsString()
  postalCode: string;

  @IsString()
  city: string;

  @IsString()
  phone: string;

  @IsString()
  @IsUUID()
  country: string;

  @IsString()
  @IsUUID()
  user: string;
}
