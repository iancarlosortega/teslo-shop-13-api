import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsOptional, IsPositive, Min } from 'class-validator';

export class PaginationDto {
  @IsOptional()
  @IsPositive()
  //TODO: Tranformar string a number
  @Type(() => Number)
  //TODO: Documentar DTOs
  @ApiProperty({
    default: 10,
    description: 'How many rows do you need',
  })
  limit?: number;

  @IsOptional()
  @IsPositive()
  @Min(0)
  @Type(() => Number)
  @ApiProperty({
    default: 10,
    description: 'How many rows do you want to skip',
  })
  offset?: number;
}
