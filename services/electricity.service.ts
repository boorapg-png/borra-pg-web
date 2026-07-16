import { collection, doc, writeBatch, getDocs, query, where, orderBy, limit } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { ElectricityReading, Bill } from "@/types";

export const electricityService = {
  getLastReading: async (roomId: string): Promise<number> => {
    const q = query(
      collection(db, "electricityReadings"), 
      where("roomId", "==", roomId),
      orderBy("recordedAt", "desc"),
      limit(1)
    );
    const snap = await getDocs(q);
    if (snap.empty) return 0;
    return snap.docs[0].data().currentReading;
  },

  saveReading: async (data: Omit<ElectricityReading, "id" | "totalAmount" | "unitsConsumed">): Promise<string> => {
    const batch = writeBatch(db);
    
    const unitsConsumed = data.currentReading - data.previousReading;
    const totalAmount = unitsConsumed * data.ratePerUnit;
    
    const readingRef = doc(collection(db, "electricityReadings"));
    batch.set(readingRef, {
      ...data,
      id: readingRef.id,
      unitsConsumed,
      totalAmount
    });

    for (const split of data.tenantSplits) {
      const billsSnap = await getDocs(
        query(collection(db, "bills"), where("tenantId", "==", split.tenantId), where("month", "==", data.month))
      );
      
      if (!billsSnap.empty) {
        const billDoc = billsSnap.docs[0];
        const billData = billDoc.data() as Bill;
        
        const newElectricityAmount = billData.electricityAmount + split.amount;
        const newTotalAmount = billData.rentAmount + newElectricityAmount + billData.otherCharges;
        const newBalance = newTotalAmount - billData.amountPaid;
        
        batch.update(billDoc.ref, {
          electricityAmount: newElectricityAmount,
          totalAmount: newTotalAmount,
          balance: newBalance
        });
      }
    }

    await batch.commit();
    return readingRef.id;
  }
};