"use client";
import { useState, useEffect } from "react";
import { collection, query, orderBy, onSnapshot, where, doc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Tenant } from "@/types";

export const useTenants = (statusFilter?: string[]) => {
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let q = query(collection(db, "tenants"), orderBy("createdAt", "desc"));
    
    if (statusFilter && statusFilter.length > 0) {
      q = query(collection(db, "tenants"), where("status", "in", statusFilter), orderBy("createdAt", "desc"));
    }

    const unsubscribe = onSnapshot(q, 
      (snapshot) => {
        setTenants(snapshot.docs.map(d => d.data() as Tenant));
        setLoading(false);
      },
      (err) => {
        setError(err.message);
        setLoading(false);
      }
    );
    return () => unsubscribe();
  }, [JSON.stringify(statusFilter)]); // Re-run if filter changes

  return { tenants, loading, error };
};

export const useTenant = (id: string) => {
  const [tenant, setTenant] = useState<Tenant | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    const unsubscribe = onSnapshot(doc(db, "tenants", id), (docSnap) => {
      if (docSnap.exists()) {
        setTenant(docSnap.data() as Tenant);
      } else {
        setTenant(null);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, [id]);

  return { tenant, loading };
};