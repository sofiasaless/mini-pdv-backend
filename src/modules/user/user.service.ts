import { BaseService } from '../../common/base/base.service';
import { Collections } from '../../common/enum/collections.enum';
import { hashPassword } from '../../common/functions/bcrypt.functions';
import { User } from './user.entity';

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
      createdAt: new Date(),
    };
    await docRef.set(entity);
    return entity;
  }

  async findByNameAndRestaurant(
    name: string,
    restaurantId: string,
  ): Promise<User | undefined> {
    const snapshot = await this.setup()
      .where('name', '==', name)
      .where('restaurantRef', '==', restaurantId)
      .limit(1)
      .get();
    const doc = snapshot.docs[0];
    return doc ? this.mapDoc(doc) : undefined;
  }

  sanitize(user: User): Omit<User, 'password'> {
    const safeUser = { ...user } as Partial<User>;
    delete safeUser.password;
    return safeUser as Omit<User, 'password'>;
  }
}

export const userService = new UserService();
