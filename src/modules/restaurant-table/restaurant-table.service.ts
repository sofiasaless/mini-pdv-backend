import { BaseService } from '../../common/base/base.service';
import { Collections } from '../../common/enum/collections.enum';
import { RestaurantTable } from './restaurant-table.entity';

export class RestaurantTableService extends BaseService<RestaurantTable> {
  constructor() {
    super(Collections.RESTAURANT_TABLES);
  }

  async createMany(
    quantity: number,
    restaurantRef: string,
  ): Promise<RestaurantTable[]> {
    const tables = Array.from({ length: quantity }, (_, index) => ({
      restaurantRef,
      number: index + 1,
    }));

    return Promise.all(tables.map((table) => this.create(table)));
  }
}

export const restaurantTableService = new RestaurantTableService();