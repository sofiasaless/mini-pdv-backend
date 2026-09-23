import { BaseService } from '../../common/base/base.service';
import { Collections } from '../../common/enum/collections.enum';
import { User } from './user.entity';

export class UserService extends BaseService<User> {
  constructor() {
    super(Collections.USER);
  }
}

export const userService = new UserService();