import { DocumentReference } from 'firebase-admin/firestore';
import { BaseEntity } from '../../common/base/base.entity';

export enum UserRole {
  WAITER = 'Garçom',
  MANAGER = 'Gerente',
}

export class User extends BaseEntity {
  name: string;
  password: string;
  type: UserRole;
  restaurantRef: string | DocumentReference;
}