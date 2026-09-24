import { IsInt, IsNotEmpty, IsOptional, IsString, Min } from 'class-validator';

export class CreateRestaurantTableDto {
  @IsString()
  @IsNotEmpty()
  restaurantRef: string;

  @IsInt()
  @Min(1)
  number: number;
}

export class UpdateRestaurantTableDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  restaurantRef?: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  number?: number;
}