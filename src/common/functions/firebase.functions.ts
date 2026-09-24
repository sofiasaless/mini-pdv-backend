import { db } from "../../config/firebase";
import { Collections } from "../enum/collections.enum";

export const idToDocumentReference = (id: string, collection: Collections) => {
  return db.collection(collection).doc(id);
}