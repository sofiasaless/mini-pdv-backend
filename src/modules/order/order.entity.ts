import { BaseEntity } from '../../common/base/base.entity';
import { MenuItem } from '../menu-item/menu-item.entity';

export enum OrderStatus {
  FREE = 'Livre',
  OCCUPIED = 'Ocupada',
  CLOSED = 'Fechada',
}

export interface OrderItemSnapshot extends Pick<MenuItem, 'price' | 'title'> {
  id: string;
  quantity: number;
  createdAt: Date;
}

export class Order extends BaseEntity {
  orderItemSnapshot: OrderItemSnapshot[];
  status: OrderStatus;
  isPaid: boolean;
  restaurantTableRef: string;
}