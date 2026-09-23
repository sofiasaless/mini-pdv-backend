import { Timestamp } from 'firebase-admin/firestore';
import { BaseService } from '../../common/base/base.service';
import { Order } from './order.entity';
import { Collections } from '../../common/enum/collections.enum';

export class OrderService extends BaseService<Order> {
  constructor() {
    super(Collections.ORDERS);
  }

  protected mapDoc(doc: FirebaseFirestore.DocumentSnapshot): Order {
    const order = super.mapDoc(doc);
    order.orderItemSnapshot = (order.orderItemSnapshot ?? []).map((item) => ({
      ...item,
      createdAt:
        (item.createdAt as unknown as Timestamp)?.toDate?.() ?? item.createdAt,
    }));
    return order;
  }
}

export const orderService = new OrderService();