// types/index.ts

export interface Admin {
  uid: string;
  email: string;
  role: "admin";
}

export interface Tenant {
  uid: string;
  personalInfo: {
    name: string;
    dob: string;
    aadhaar: string;
    phone: string;
    email: string;
    homeAddress: string;
    emergencyContact: string;
  };
  roomInfo: {
    roomNumber: string;
    floor: string;
    type: "Single" | "Double" | "Triple";
    ac: boolean;
    rentAmount: number;
    securityDeposit: number;
    moveInDate: string;
  };
  status: "active" | "vacated";
  createdAt: Date;
  documents: {
    name: string;
    url: string;
    uploadedAt: Date;
  }[];
}

export interface PaymentRecord {
  id?: string;
  month: string; // e.g. "2024-06"
  amount: number;
  paymentDate: Date;
  paymentMode: "cash" | "upi" | "bank" | "cheque";
  notes: string;
  recordedAt: Date;
  recordedBy: string; // Admin UID
}

export interface Expense {
  id?: string;
  category: "Maintenance" | "Electricity" | "Water" | "Salary" | "Food/Canteen" | "Renovation" | "Miscellaneous" | "Other";
  amount: number;
  date: Date;
  description: string;
  receiptUrl: string | null;
  addedBy: string; // Admin UID
}