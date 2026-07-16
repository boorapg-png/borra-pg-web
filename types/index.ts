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
  roomNumber: string; 
  number: string;     
  type: string; 
  capacity: number;
  status: "available" | "occupied" | "maintenance" | "partial";
  bedsTotal: number;    
  pricePerBed: number;
  ac: boolean;
  attachedBath: boolean;
  meterNumber?: string;
}

export interface Bed {
  id: string;
  roomId: string;
  status: "available" | "occupied" | "maintenance";
  tenantId?: string | null;
  currentTenantId?: string | null; // <--- Fixes your build error
  bedLabel: string;
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

// ─── FINANCIAL TYPES ───

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