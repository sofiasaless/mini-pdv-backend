import { IsInt, IsOptional, Min } from 'class-validator';

export class CreateRestaurantTableDto {
  @IsInt()
  @Min(1)
  number: number;
}

export class CreateManyRestaurantTableDto {
  @IsInt()
  @Min(1)
  quantity: number;
}

export class UpdateRestaurantTableDto {
  @IsOptional()
  @IsInt()
  @Min(1)
  number?: number;
}
