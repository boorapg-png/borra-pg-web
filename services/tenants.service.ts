import { collection, doc, writeBatch, getDocs, query, where, Timestamp } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db, storage } from "@/lib/firebase";
import { Tenant } from "@/types";

type TenantInput = Omit<Tenant, "id" | "createdAt">;

export const tenantService = {
  add: async (tenantData: TenantInput): Promise<string> => {
    const docRef = doc(collection(db, "tenants"));
    const batch = writeBatch(db);

    batch.set(docRef, {
      ...tenantData,
      id: docRef.id,
      createdAt: Timestamp.now()
    });

    // Mark the assigned bed as occupied
    const bedId = tenantData.accommodation.bedId;
    const roomId = tenantData.accommodation.roomId;
    
    if (bedId) {
      batch.update(doc(db, "beds", bedId), {
        currentTenantId: docRef.id,
        status: "occupied"
      });

      // Recalculate Room status based on how many beds are occupied
      const bedsSnap = await getDocs(query(collection(db, "beds"), where("roomId", "==", roomId)));
      let occupiedCount = 1; // Includes the one we just occupied
      let totalCount = bedsSnap.size;
      
      bedsSnap.forEach((bedDoc) => {
        if (bedDoc.id !== bedId && bedDoc.data().status === "occupied") {
          occupiedCount++;
        }
      });

      let newRoomStatus = "partial";
      if (occupiedCount === totalCount) newRoomStatus = "occupied";
      if (occupiedCount === 0) newRoomStatus = "available";

      batch.update(doc(db, "rooms", roomId), {
        status: newRoomStatus
      });
    }

    await batch.commit();
    return docRef.id;
  },

  update: async (id: string, data: Partial<Tenant>): Promise<void> => {
    const batch = writeBatch(db);
    batch.update(doc(db, "tenants", id), data);
    await batch.commit();
  },

  uploadDocument: async (tenantId: string, file: File): Promise<string> => {
    const timestamp = Date.now();
    const storageRef = ref(storage, `documents/${tenantId}/id_document_${timestamp}`);
    await uploadBytes(storageRef, file);
    return await getDownloadURL(storageRef);
  },

  delete: async (tenantId: string, bedId?: string, roomId?: string): Promise<void> => {
    const batch = writeBatch(db);
    
    batch.delete(doc(db, "tenants", tenantId));

    if (bedId && roomId) {
      batch.update(doc(db, "beds", bedId), {
        currentTenantId: null,
        status: "available"
      });

      // Recalculate room status after removing tenant
      const bedsSnap = await getDocs(query(collection(db, "beds"), where("roomId", "==", roomId)));
      let occupiedCount = 0;
      
      bedsSnap.forEach((bedDoc) => {
        if (bedDoc.id !== bedId && bedDoc.data().status === "occupied") {
          occupiedCount++;
        }
      });

      let newRoomStatus = "partial";
      if (occupiedCount === bedsSnap.size) newRoomStatus = "occupied";
      if (occupiedCount === 0) newRoomStatus = "available";

      batch.update(doc(db, "rooms", roomId), {
        status: newRoomStatus
      });
    }

    await batch.commit();
  }
};