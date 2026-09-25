import { db } from '../../config/firebase';
import { BaseEntity } from './base.entity';

export class BaseService<T extends BaseEntity> {
  private COLLECTION: string = '';

  constructor(collection: string) {
    this.COLLECTION = collection;
  }

  setup() {
    return db.collection(this.COLLECTION);
  }

  getDb() {
    return db;
  }

  async list(): Promise<T[]> {
    const snapshot = await this.setup().orderBy('createdAt', 'desc').get();
    return snapshot.docs.map((doc) => this.mapDoc(doc));
  }

  async listByRestaurant(restaurantId: string): Promise<T[]> {
    const snapshot = await this.setup()
      .where('restaurantRef', '==', restaurantId)
      .orderBy('createdAt', 'desc')
      .get();
    return snapshot.docs.map((doc) => this.mapDoc(doc));
  }

  async findById(id: string): Promise<T | undefined> {
    const doc = await this.setup().doc(id).get();
    if (!doc.exists) return undefined;
    return this.mapDoc(doc);
  }

  async findByIdScoped(
    id: string,
    restaurantId: string,
  ): Promise<T | undefined> {
    const entity = await this.findById(id);
    if (
      !entity ||
      (entity as T & { restaurantRef?: string }).restaurantRef !== restaurantId
    ) {
      return undefined;
    }
    return entity;
  }

  async create(data: Omit<T, 'id' | 'createdAt'>): Promise<T> {
    const docRef = this.setup().doc();
    const entity = { ...data, id: docRef.id, createdAt: new Date() } as T;
    await docRef.set(entity);
    return entity;
  }

  async update(
    id: string,
    data: Partial<Omit<T, 'id' | 'createdAt'>>
  ): Promise<T | undefined> {
    const docRef = this.setup().doc(id);
    const snapshot = await docRef.get();
    if (!snapshot.exists) return undefined;

    if (Object.keys(data).length > 0) {
      await docRef.update(data);
    }

    const updated = await docRef.get();
    return this.mapDoc(updated);
  }

  async updateScoped(
    id: string,
    restaurantId: string,
    data: Partial<Omit<T, 'id' | 'createdAt'>>,
  ): Promise<T | undefined> {
    const entity = await this.findByIdScoped(id, restaurantId);
    if (!entity) return undefined;
    return this.update(id, data);
  }

  async remove(id: string): Promise<boolean> {
    const docRef = this.setup().doc(id);
    const snapshot = await docRef.get();
    if (!snapshot.exists) return false;
    await docRef.delete();
    return true;
  }

  async removeScoped(id: string, restaurantId: string): Promise<boolean> {
    const entity = await this.findByIdScoped(id, restaurantId);
    if (!entity) return false;
    return this.remove(id);
  }

  protected mapDoc(doc: FirebaseFirestore.DocumentSnapshot): T {
    const data = doc.data()!;
    return {
      ...data,
      id: doc.id,
      createdAt: data.createdAt?.toDate?.() ?? data.createdAt,
    } as T;
  }
}
