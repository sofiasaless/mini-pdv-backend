import { IsInt, IsOptional, Min } from 'class-validator';
import { RestaurantTable } from '../restaurant-table.entity';
import { Order } from '../../order/order.entity';

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

export interface RestaurantTableResponde extends RestaurantTable {
  order: undefined | Order;
}