import { IsString, IsOptional, IsNumber, IsEnum } from 'class-validator';
import { Type } from 'class-transformer';

export enum SortOrder {
  PRICE_ASC = 'price_asc',
  PRICE_DESC = 'price_desc',
  NEWEST = 'newest',
}

export class QueryProductDto {
  @IsString()
  @IsOptional()
  search?: string;

  @IsString()
  @IsOptional()
  brand?: string;

  @IsString()
  @IsOptional()
  categoryId?: string;

  @Type(() => Number)
  @IsNumber()
  @IsOptional()
  minPrice?: number;

  @Type(() => Number)
  @IsNumber()
  @IsOptional()
  maxPrice?: number;

  @IsEnum(SortOrder)
  @IsOptional()
  sort?: SortOrder;
}
