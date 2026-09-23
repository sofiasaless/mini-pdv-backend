import { BaseEntity } from '../../common/base/base.entity';

export class Restaurant extends BaseEntity {
  name: string;
  email: string;
  address: string;
}