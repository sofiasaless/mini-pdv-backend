import { BaseService } from "../../common/base/base.service";
import { Collections } from "../../common/enum/collections.enum";
import { authService } from "../auth/auth.service";
import { UserRole } from "../user/user.entity";
import { userService } from "../user/user.service";
import { CreateRestaurantDto, UpdateRestaurantDto } from "./dto/restaurant.dto";
import { Restaurant } from "./restaurant.entity";

export class RestaurantService extends BaseService<Restaurant> {
  constructor() {
    super(Collections.RESTAURANTS);
  }

  async createOne(payload: CreateRestaurantDto) {
    const { password, ...data } = payload;

    const auth = await authService.createUser({
      email: payload.email,
      password: payload.password,
    });

    const docRef = this.setup().doc();
    const enterpriseCreated = {
      ...data,
      id: auth.uid,
      createdAt: new Date(),
    };
    await docRef.set(enterpriseCreated);

    const firstManager = await userService.create({
      name: "Gerente1",
      password: "1234",
      type: UserRole.MANAGER,
      restaurantRef: enterpriseCreated.id,
    });

    return {
      enterprise: enterpriseCreated,
      manager: firstManager,
    };
  }

  async update(
    id: string,
    data: Partial<UpdateRestaurantDto>,
  ): Promise<Restaurant | undefined> {
    const docRef = this.setup().doc(id);
    const snapshot = await docRef.get();
    if (!snapshot.exists) return undefined;

    if (Object.keys(data).length > 0) {
      await docRef.update(data);
    }

    const updated = await docRef.get();
    return this.mapDoc(updated);
  }
}

export const restaurantService = new RestaurantService();
