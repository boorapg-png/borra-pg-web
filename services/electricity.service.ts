import { collection, doc, writeBatch, getDocs, query, where, orderBy, limit } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { ElectricityReading, Bill } from "@/types";

// Local extension so we don't have to edit types/index.ts again!
interface ExtendedBill extends Bill {
  electricityAmount?: number;
  rentAmount?: number;
  otherCharges?: number;
}

export const electricityService = {
  getLastReading: async (roomId: string): Promise<number> => {
    const q = query(
      collection(db, "electricityReadings"), 
      where("roomId", "==", roomId),
      // FIX 1: Changed "recordedAt" to "readingDate" to strictly match your DB schema
      orderBy("readingDate", "desc"), 
      limit(1)
    );
    const snap = await getDocs(q);
    if (snap.empty) return 0;
    return snap.docs[0].data().currentReading || 0;
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

    // FIX 2: Added "|| []" so the loop never crashes if there are no splits
    for (const split of data.tenantSplits || []) {
      const billsSnap = await getDocs(
        query(collection(db, "bills"), where("tenantId", "==", split.tenantId), where("month", "==", data.month))
      );
      
      if (!billsSnap.empty) {
        const billDoc = billsSnap.docs[0];
        
        // FIX 3: Cast as ExtendedBill and added fallback zeroes to prevent NaN calculation crashes
        const billData = billDoc.data() as ExtendedBill;
        
        const currentElectricity = billData.electricityAmount || 0;
        const currentRent = billData.rentAmount || 0;
        const currentOther = billData.otherCharges || 0;
        
        const newElectricityAmount = currentElectricity + split.amount;
        const newTotalAmount = currentRent + newElectricityAmount + currentOther;
        const newBalance = newTotalAmount - (billData.amountPaid || 0);
        
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