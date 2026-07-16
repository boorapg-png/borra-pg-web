"use client";
import { useState, useEffect } from "react";
import { collection, query, where, onSnapshot, orderBy } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Payment } from "@/types";

export const useTenantPayments = (tenantId: string | null) => {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!tenantId) {
      setPayments([]);
      setLoading(false);
      return;
    }
    const q = query(
      collection(db, "payments"), 
      where("tenantId", "==", tenantId), 
      orderBy("paymentDate", "desc")
    );
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setPayments(snapshot.docs.map(doc => doc.data() as Payment));
      setLoading(false);
    });
    return () => unsubscribe();
  }, [tenantId]);

  return { payments, loading };
};