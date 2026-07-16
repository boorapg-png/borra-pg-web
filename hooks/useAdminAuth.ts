"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { onAuthStateChanged, User } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";
import { Tenant } from "@/types";

export const useAdminAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        // Check if this UID exists in the 'admins' collection
        const adminDoc = await getDoc(doc(db, "admins", firebaseUser.uid));
        if (adminDoc.exists()) {
          setUser(firebaseUser);
          setIsAdmin(true);
        } else {
          router.push("/login"); // Redirect unauthorized users
        }
      } else {
        router.push("/login"); // Redirect logged-out users
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, [router]);

  return { user, isAdmin, loading };
};

export const useTenantAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [tenant, setTenant] = useState<Tenant | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser);
        const tenantDoc = await getDoc(doc(db, "tenants", firebaseUser.uid));
        if (tenantDoc.exists()) {
          setTenant(tenantDoc.data() as Tenant);
        } else {
          setTenant(null);
        }
      } else {
        router.push("/login"); // Update this to your tenant login path if different
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, [router]);

  return { user, tenant, loading };
};