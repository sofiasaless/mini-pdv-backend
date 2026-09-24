import { Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsDate,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
  ValidateNested,
} from 'class-validator';
import { OrderStatus } from '../order.entity';

export class OrderItemSnapshotDto {
  @IsString()
  @IsNotEmpty()
  id: string;

  @IsString()
  @IsNotEmpty()
  title: string;

  @IsNumber()
  @Min(0)
  price: number;

  @IsInt()
  @Min(1)
  quantity: number;

  @Type(() => Date)
  @IsDate()
  createdAt: Date;
}

export class CreateOrderDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OrderItemSnapshotDto)
  orderItemSnapshot: OrderItemSnapshotDto[];

  @IsEnum(OrderStatus)
  status: OrderStatus;

  @IsBoolean()
  isPaid: boolean;

  @IsString()
  @IsNotEmpty()
  restaurantTableRef: string;
}

export class UpdateOrderDto {
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OrderItemSnapshotDto)
  orderItemSnapshot?: OrderItemSnapshotDto[];

  @IsOptional()
  @IsEnum(OrderStatus)
  status?: OrderStatus;

  @IsOptional()
  @IsBoolean()
  isPaid?: boolean;
}

export class UpdateOrderItemsDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OrderItemSnapshotDto)
  orderItemSnapshot: OrderItemSnapshotDto[]
}