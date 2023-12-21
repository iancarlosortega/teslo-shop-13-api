import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsOptional, IsString, MinLength } from 'class-validator';

export class UpdateUserDto {
  @ApiProperty({
    example: 'Ian Carlos Ortega',
    description: 'User full name',
    minLength: 3,
  })
  @IsOptional()
  @IsString()
  @MinLength(3)
  fullName: string;

  @ApiProperty({
    example: 'iancarlosortegaleon@gmail.com',
    description: 'Must be a valid email format',
  })
  @IsOptional()
  @IsString()
  @IsEmail()
  email: string;
}
