import { doc, getDoc, setDoc, Timestamp } from "firebase/firestore";
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

export const settingsService = {
  getSettings: async (): Promise<GlobalSettings> => {
    const docRef = doc(db, "settings", "global");
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return docSnap.data() as GlobalSettings;
    }
    return defaultSettings;
  },

  updateElectricityRate: async (newRate: number): Promise<void> => {
    const docRef = doc(db, "settings", "global");
    const docSnap = await getDoc(docRef);
    let currentData = defaultSettings;
    
    if (docSnap.exists()) {
      currentData = docSnap.data() as GlobalSettings;
    }
    
    const newHistory = [
      ...currentData.rateHistory,
      { rate: currentData.electricityRatePerUnit, effectiveFrom: Timestamp.now() }
    ];
    
    const updatedSettings = {
      ...currentData,
      electricityRatePerUnit: newRate,
      rateHistory: newHistory
    };
    
    await setDoc(docRef, updatedSettings, { merge: true });
  },

  updateSettings: async (data: Partial<GlobalSettings>): Promise<void> => {
    const docRef = doc(db, "settings", "global");
    await setDoc(docRef, data, { merge: true });
  }
};import { doc, getDoc, setDoc, Timestamp } from "firebase/firestore";
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

export const settingsService = {
  getSettings: async (): Promise<GlobalSettings> => {
    const docRef = doc(db, "settings", "global");
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return docSnap.data() as GlobalSettings;
    }
    return defaultSettings;
  },

  updateElectricityRate: async (newRate: number): Promise<void> => {
    const docRef = doc(db, "settings", "global");
    const docSnap = await getDoc(docRef);
    let currentData = defaultSettings;
    
    if (docSnap.exists()) {
      currentData = docSnap.data() as GlobalSettings;
    }
    
    const newHistory = [
      ...currentData.rateHistory,
      { rate: currentData.electricityRatePerUnit, effectiveFrom: Timestamp.now() }
    ];
    
    const updatedSettings = {
      ...currentData,
      electricityRatePerUnit: newRate,
      rateHistory: newHistory
    };
    
    await setDoc(docRef, updatedSettings, { merge: true });
  },

  updateSettings: async (data: Partial<GlobalSettings>): Promise<void> => {
    const docRef = doc(db, "settings", "global");
    await setDoc(docRef, data, { merge: true });
  }
};