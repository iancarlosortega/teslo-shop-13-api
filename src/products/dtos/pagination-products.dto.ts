import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsOptional, Min } from 'class-validator';

export class PaginationProductsDto {
  @ApiProperty({
    example: 5,
    description: 'Page number',
    default: 0,
    minimum: 0,
  })
  @IsOptional()
  @Min(1)
  @Type(() => Number)
  page?: number;

  @ApiProperty({
    example: 10,
    description: 'Number of rows user needs',
    default: 10,
    minimum: 0,
  })
  @IsOptional()
  @Min(0)
  @Type(() => Number)
  take?: number;

  @ApiProperty({
    example: 'men',
    description: 'Gender of the product',
  })
  @IsOptional()
  gender?: string;
}
