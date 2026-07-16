"use client";
import { useState, useEffect } from "react";
import { collection, query, where, onSnapshot, orderBy } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Bill } from "@/types";

export const useBillsForMonth = (month: string) => {
  const [bills, setBills] = useState<Bill[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!month) return;
    const q = query(collection(db, "bills"), where("month", "==", month));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setBills(snapshot.docs.map(doc => doc.data() as Bill));
      setLoading(false);
    });
    return () => unsubscribe();
  }, [month]);

  return { bills, loading };
};

export const useTenantBills = (tenantId: string) => {
  const [bills, setBills] = useState<Bill[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!tenantId) return;
    const q = query(collection(db, "bills"), where("tenantId", "==", tenantId), orderBy("dueDate", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setBills(snapshot.docs.map(doc => doc.data() as Bill));
      setLoading(false);
    });
    return () => unsubscribe();
  }, [tenantId]);

  return { bills, loading };
};

export const usePendingDues = () => {
  const [bills, setBills] = useState<Bill[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalDues, setTotalDues] = useState(0);

  useEffect(() => {
    const q = query(collection(db, "bills"), where("status", "in", ["pending", "partial", "overdue"]));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetchedBills = snapshot.docs.map(doc => doc.data() as Bill);
      setBills(fetchedBills);
      setTotalDues(fetchedBills.reduce((acc, curr) => acc + curr.balance, 0));
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  return { bills, loading, totalDues };
};