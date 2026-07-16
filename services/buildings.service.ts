import { collection, doc, writeBatch, getDocs, query, where, Timestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";

export const buildingService = {
  add: async (name: string): Promise<string> => {
    const docRef = doc(collection(db, "buildings"));
    const batch = writeBatch(db);
    batch.set(docRef, {
      id: docRef.id,
      name,
      createdAt: Timestamp.now()
    });
    await batch.commit();
    return docRef.id;
  },

  update: async (id: string, name: string): Promise<void> => {
    const batch = writeBatch(db);
    batch.update(doc(db, "buildings", id), { name });
    await batch.commit();
  },

  delete: async (id: string): Promise<void> => {
    const batch = writeBatch(db);

    // Using the flat schema design (everything has buildingId), we can query efficiently
    const floorsSnap = await getDocs(query(collection(db, "floors"), where("buildingId", "==", id)));
    const roomsSnap = await getDocs(query(collection(db, "rooms"), where("buildingId", "==", id)));
    const bedsSnap = await getDocs(query(collection(db, "beds"), where("buildingId", "==", id)));

    bedsSnap.forEach((docSnap) => batch.delete(docSnap.ref));
    roomsSnap.forEach((docSnap) => batch.delete(docSnap.ref));
    floorsSnap.forEach((docSnap) => batch.delete(docSnap.ref));
    batch.delete(doc(db, "buildings", id));

    await batch.commit(); // Deletes everything in one single atomic transaction
  }
};