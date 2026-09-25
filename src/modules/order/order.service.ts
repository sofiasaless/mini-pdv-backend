import { FieldValue, Timestamp } from "firebase-admin/firestore";
import { BaseService } from "../../common/base/base.service";
import { Collections } from "../../common/enum/collections.enum";
import {
  CreateOrderDto,
  UpdateOrderItemsDto
} from "./dto/order.dto";
import { Order, OrderStatus } from "./order.entity";

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

  async create(data: CreateOrderDto): Promise<Order> {
    const previousOrder = await this.setup()
      .where("restaurantTableRef", "==", data.restaurantTableRef)
      .where("isPaid", "==", false)
      .get();

    if (previousOrder.size != 0) {
      throw new Error("Mesa com pedido pendente.");
    }

    const docRef = this.setup().doc();
    const entity = { ...data, id: docRef.id, createdAt: new Date() };
    await docRef.set(entity);
    return entity;
  }

  async addOrderItem(id: string, data: UpdateOrderItemsDto) {
    await this.setup()
      .doc(id)
      .update({
        orderItemSnapshot: FieldValue.arrayUnion(...data.orderItemSnapshot),
      });
  }

  async removeOrderItem(id: string, data: UpdateOrderItemsDto) {
    await this.setup()
      .doc(id)
      .update({
        orderItemSnapshot: FieldValue.arrayRemove(...data.orderItemSnapshot),
      });
  }

  async closeOrder(id: string) {
    await this.setup().doc(id).update(<Partial<Order>>{
      isPaid: true,
      status: OrderStatus.FREE,
    })
  }

  async findByRestaurantTableId(
    restaurantTableId: string,
  ): Promise<Order | undefined> {
    const snapshot = await this.setup()
      .where("restaurantTableRef", "==", restaurantTableId)
      .where("isPaid", "==", false)
      .get();

    return snapshot.docs[0] ? this.mapDoc(snapshot.docs[0]) : undefined;
  }
}

export const orderService = new OrderService();
