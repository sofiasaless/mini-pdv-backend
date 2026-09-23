import { BaseService } from "../../common/base/base.service";
import { Collections } from "../../common/enum/collections.enum";
import { Restaurant } from "./restaurant.entity";

export class RestaurantService extends BaseService<Restaurant> {
  constructor() {
    super(Collections.RESTAURANTS);
  }
}

export const restaurantService = new RestaurantService();
