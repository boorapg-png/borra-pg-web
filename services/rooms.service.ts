import { collection, doc, writeBatch, getDocs, query, where, Timestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Room } from "@/types";

type RoomInput = Omit<Room, "bedsTotal" | "createdAt" | "id">;

export const roomService = {
  add: async (data: RoomInput): Promise<string> => {
    const bedsTotal = data.type === "Single" ? 1 : data.type === "Double" ? 2 : 3;
    const roomRef = doc(collection(db, "rooms"));
    const batch = writeBatch(db);

    batch.set(roomRef, {
      ...data,
      id: roomRef.id,
      bedsTotal,
      createdAt: Timestamp.now()
    });

    const labels: ("A" | "B" | "C")[] = ["A", "B", "C"];
    for (let i = 0; i < bedsTotal; i++) {
      const bedRef = doc(collection(db, "beds"));
      batch.set(bedRef, {
        id: bedRef.id,
        roomId: roomRef.id,
        buildingId: data.buildingId,
        bedLabel: labels[i],
        currentTenantId: null,
        status: "available"
      });
    }

    await batch.commit();
    return roomRef.id;
  },

  update: async (id: string, data: Partial<Omit<Room, "bedsTotal" | "id">>): Promise<void> => {
    const batch = writeBatch(db);
    batch.update(doc(db, "rooms", id), data);
    await batch.commit();
  },

  delete: async (id: string): Promise<void> => {
    const batch = writeBatch(db);
    const bedsSnap = await getDocs(query(collection(db, "beds"), where("roomId", "==", id)));
    
    bedsSnap.forEach((bedDoc) => batch.delete(bedDoc.ref));
    batch.delete(doc(db, "rooms", id));

    await batch.commit();
  }
};