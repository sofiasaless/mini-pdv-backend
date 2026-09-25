import { BaseEntity } from '../../common/base/base.entity';

export class MenuItem extends BaseEntity {
  restaurantRef: string;
  title: string;
  price: number;
}
