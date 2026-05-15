import { IsString, IsNotEmpty, IsNumber, IsPositive, IsInt, Min, IsArray, IsUUID, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateProductDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  slug: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @Type(() => Number)
  @IsNumber()
  @IsPositive()
  price: number;

  @IsString()
  @IsNotEmpty()
  brand: string;

  @Type(() => Number)
  @IsInt()
  @Min(0)
  stock: number;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  images?: string[];

  @IsUUID()
  categoryId: string;
}
