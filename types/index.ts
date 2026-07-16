import { Timestamp } from "firebase/firestore";

// ─── PROPERTY MANAGEMENT TYPES ───

export interface Building {
  id: string;
  name: string;
  address?: string;
  totalFloors?: number;
}

export interface Floor {
  id: string;
  buildingId: string;
  name: string; 
}

export interface Room {
  id: string;
  floorId: string;
  buildingId: string;
  roomNumber: string; // Used by your database
  number: string;     // Explicitly added for the UI (fixes line 329 error)
  type: string; 
  capacity: number;
  status: "available" | "occupied" | "maintenance" | "partial"; // Explicitly added for the UI (fixes line 143 error)
}

export interface Bed {
  id: string;
  roomId: string;
  status: "available" | "occupied" | "maintenance";
  tenantId?: string | null;
}

// ─── TENANT TYPES ───

export interface Tenant {
  id: string;
  name: string;
  phone: string;
  dob: string;
  gender: "Male" | "Female" | "Other";
  aadhaarNumber: string;
  emergencyContact: string; 
  status: "active" | "inactive" | "on_notice";
  joiningDate: Timestamp;
  leavingDate: Timestamp | null;
  documentStatus: "completed" | "pending";
  documentUrl?: string; 
  paymentStatus: "paid" | "pending" | "overdue";
  accommodation: {
    buildingId: string;
    floorId: string;
    roomId: string;
    bedId: string;
    roomNumber: string;
  };
  createdAt: Timestamp;
}

// ─── FINANCIAL TYPES (BILLS, PAYMENTS, EXPENSES) ───

export interface Bill {
  id: string;
  tenantId: string;
  tenantName: string;
  buildingId: string;
  month: string;
  totalAmount: number;
  amountPaid: number;
  balance: number;
  status: "paid" | "partial" | "pending";
  dueDate: Timestamp;
}

export interface Payment {
  id: string;
  tenantId: string;
  tenantName: string;
  billId: string;
  buildingId: string;
  month: string;
  amount: number;
  paymentDate: Timestamp;
  paymentMode: "cash" | "upi" | "bank_transfer";
  notes?: string;
  recordedBy: string;
  receiptNumber?: string;
}

export interface Expense {
  id: string;
  category: "Maintenance" | "Salary" | "Electricity" | "Groceries" | "Water" | "Other";
  amount: number;
  description: string;
  date: Timestamp;
  recordedBy: string;
}