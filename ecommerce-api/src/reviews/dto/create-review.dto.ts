import { IsInt, Min, Max, IsString, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateReviewDto {
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(5)
  rating: number;

  @IsString()
  @IsOptional()
  comment?: string;
}
