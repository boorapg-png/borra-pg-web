import { collection, doc, writeBatch, getDocs, query, where, getDoc, Timestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Bill, Payment } from "@/types";

export const paymentService = {
  generateMonthlyBills: async (month: string): Promise<void> => {
    const batch = writeBatch(db);
    
    const activeTenantsSnap = await getDocs(query(collection(db, "tenants"), where("status", "in", ["active", "on_notice"])));
    
    for (const tenantDoc of activeTenantsSnap.docs) {
      const tenant = tenantDoc.data();
      
      const existingBillsSnap = await getDocs(
        query(collection(db, "bills"), where("tenantId", "==", tenant.id), where("month", "==", month))
      );
      
      // Only generate if a bill doesn't already exist for this month
      if (existingBillsSnap.empty) {
        const billRef = doc(collection(db, "bills"));
        const [yearStr, monthStr] = month.split("-");
        const dueDate = new Date(parseInt(yearStr), parseInt(monthStr) - 1, 1);
        
        batch.set(billRef, {
          id: billRef.id,
          tenantId: tenant.id,
          tenantName: tenant.personalInfo.name,
          buildingId: tenant.accommodation.buildingId,
          month,
          rentAmount: tenant.financial.monthlyRent,
          electricityAmount: 0,
          otherCharges: 0,
          totalAmount: tenant.financial.monthlyRent,
          amountPaid: 0,
          balance: tenant.financial.monthlyRent,
          status: "pending",
          dueDate: Timestamp.fromDate(dueDate),
          generatedAt: Timestamp.now()
        } as Bill);
      }
    }
    await batch.commit();
  },

  recordPayment: async (data: Omit<Payment, "id" | "receiptNumber">): Promise<string> => {
    const batch = writeBatch(db);
    
    // Auto-generate receipt sequence
    const counterRef = doc(db, "settings", "receiptCounter");
    const counterDoc = await getDoc(counterRef);
    let sequence = 1;
    if (counterDoc.exists()) {
      sequence = (counterDoc.data().count || 0) + 1;
    }
    batch.set(counterRef, { count: sequence }, { merge: true });
    
    const year = new Date().getFullYear();
    const receiptNumber = `BP-${year}-${sequence.toString().padStart(4, "0")}`;
    
    const paymentRef = doc(collection(db, "payments"));
    batch.set(paymentRef, {
      ...data,
      id: paymentRef.id,
      receiptNumber
    });

    const billRef = doc(db, "bills", data.billId);
    const billDoc = await getDoc(billRef);
    if (billDoc.exists()) {
      const billData = billDoc.data() as Bill;
      const newAmountPaid = billData.amountPaid + data.amount;
      const newBalance = billData.totalAmount - newAmountPaid;
      let newStatus = billData.status;
      if (newBalance <= 0) newStatus = "paid";
      else if (newAmountPaid > 0) newStatus = "partial";
      
      batch.update(billRef, {
        amountPaid: newAmountPaid,
        balance: newBalance,
        status: newStatus
      });
    }

    await batch.commit();
    return receiptNumber;
  },

  getBillsForMonth: async (month: string): Promise<Bill[]> => {
    const snap = await getDocs(query(collection(db, "bills"), where("month", "==", month)));
    return snap.docs.map(doc => doc.data() as Bill);
  },

  getPendingBills: async (tenantId: string): Promise<Bill[]> => {
    const snap = await getDocs(query(collection(db, "bills"), where("tenantId", "==", tenantId), where("status", "!=", "paid")));
    return snap.docs.map(doc => doc.data() as Bill);
  }
};