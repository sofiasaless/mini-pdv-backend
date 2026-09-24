import { BaseService } from "../../common/base/base.service";
import { Collections } from "../../common/enum/collections.enum";
import { hashPassword } from "../../common/functions/bcrypt.functions";
import { idToDocumentReference } from "../../common/functions/firebase.functions";
import { User } from "./user.entity";

export class UserService extends BaseService<User> {
  constructor() {
    super(Collections.USER);
  }

  async create(data: Omit<User, "id" | "createdAt">): Promise<User> {
    const docRef = this.setup().doc();
    const hashed = await hashPassword(data.password);
    const entity = {
      ...data,
      password: hashed,
      id: docRef.id,
      restaurantRef: idToDocumentReference(
        data.restaurantRef as string,
        Collections.RESTAURANTS,
      ),
      createdAt: new Date(),
    };
    await docRef.set(entity);
    return entity;
  }
}

export const userService = new UserService();
