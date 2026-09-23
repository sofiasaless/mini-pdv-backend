import { BaseService } from '../../common/base/base.service';
import { Collections } from '../../common/enum/collections.enum';
import { RestaurantTable } from './restaurant-table.entity';

export class RestaurantTableService extends BaseService<RestaurantTable> {
  constructor() {
    super(Collections.RESTAURANT_TABLES);
  }
}

export const restaurantTableService = new RestaurantTableService();