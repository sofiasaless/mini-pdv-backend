import { BaseService } from "../../common/base/base.service";
import { Collections } from "../../common/enum/collections.enum";
import { orderService } from "../order/order.service";
import { RestaurantTableResponde } from "./dto/restaurant-table.dto";
import { RestaurantTable } from "./restaurant-table.entity";

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

  async listByRestaurant(restaurantId: string): Promise<RestaurantTable[]> {
    const snapshot = await this.setup()
      .where('restaurantRef', '==', restaurantId)
      .orderBy('createdAt', 'desc')
      .get();

    const findOrder = async (restaurantTableId: string) => {
      return await orderService.findByRestaurantTableId(restaurantTableId);
    }

    const tables: RestaurantTableResponde[] = []
    await Promise.all(
      snapshot.docs.map(async (doc) => {
        tables.push({
          ...this.mapDoc(doc),
          order: await findOrder(doc.id),
        })
      })
    )

    return tables;
  }

  async findById(id: string): Promise<RestaurantTableResponde | undefined> {
    const table = await this.setup().doc(id).get();
    if (!table.exists) {
      return undefined;
    }
    const order = await orderService.findByRestaurantTableId(id);

    return {
      ...this.mapDoc(table),
      order: order ?? undefined,
    }
  }
}

export const restaurantTableService = new RestaurantTableService();
