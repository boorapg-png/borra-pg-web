import { collection, doc, writeBatch, getDocs, query, where, Timestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";

export const floorService = {
  add: async (buildingId: string, name: string): Promise<string> => {
    const floorsSnap = await getDocs(query(collection(db, "floors"), where("buildingId", "==", buildingId)));
    const order = floorsSnap.size; // Automatically orders floors sequentially

    const docRef = doc(collection(db, "floors"));
    const batch = writeBatch(db);
    batch.set(docRef, {
      id: docRef.id,
      buildingId,
      name,
      order,
      createdAt: Timestamp.now()
    });
    await batch.commit();
    return docRef.id;
  },

  update: async (id: string, name: string): Promise<void> => {
    const batch = writeBatch(db);
    batch.update(doc(db, "floors", id), { name });
    await batch.commit();
  },

  delete: async (id: string): Promise<void> => {
    const batch = writeBatch(db);

    const roomsSnap = await getDocs(query(collection(db, "rooms"), where("floorId", "==", id)));
    for (const roomDoc of roomsSnap.docs) {
      const bedsSnap = await getDocs(query(collection(db, "beds"), where("roomId", "==", roomDoc.id)));
      bedsSnap.forEach((bedDoc) => batch.delete(bedDoc.ref));
      batch.delete(roomDoc.ref);
    }
    batch.delete(doc(db, "floors", id));

    await batch.commit();
  }
};