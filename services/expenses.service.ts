import { collection, doc, writeBatch, Timestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Expense } from "@/types";

export const expenseService = {
  add: async (data: Omit<Expense, "id">): Promise<string> => {
    const batch = writeBatch(db);
    const docRef = doc(collection(db, "expenses"));
    
    batch.set(docRef, { ...data, id: docRef.id });
    await batch.commit();
    
    return docRef.id;
  },

  delete: async (id: string): Promise<void> => {
    const batch = writeBatch(db);
    batch.delete(doc(db, "expenses", id));
    await batch.commit();
  }
};