"use client";
import { useState, useEffect } from "react";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { GlobalSettings } from "@/types";

const defaultSettings: GlobalSettings = {
  electricityRatePerUnit: 8.5,
  rateHistory: [],
  noticePeriodDays: 30,
  gracePeriodDays: 7,
  lateFeeEnabled: false,
  lateFeeAmount: 0
};

export const useSettings = () => {
  const [settings, setSettings] = useState<GlobalSettings>(defaultSettings);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onSnapshot(doc(db, "settings", "global"), (docSnap) => {
      if (docSnap.exists()) {
        setSettings(docSnap.data() as GlobalSettings);
      } else {
        setSettings(defaultSettings);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  return { settings, loading };
};