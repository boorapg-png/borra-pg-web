import { Timestamp } from "firebase/firestore";

// ─── PROPERTY MANAGEMENT TYPES ───

export interface Building {
  id: string;
  name: string;
  address?: string;
  totalFloors?: number;
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
}

export interface Floor {
  id: string;
  buildingId: string;
  name: string; 
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
}

export interface Room {
  id: string;
  floorId: string;
  buildingId: string;
  roomNumber: string; 
  number: string;     
  type: "Single" | "Double" | "Triple"; 
  capacity: number;
  status: "available" | "occupied" | "maintenance" | "partial";
  bedsTotal: number;    
  pricePerBed: number;
  ac: boolean;
  attachedBath: boolean;
  meterNumber?: string;
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
}

export interface Bed {
  id: string;
  roomId: string;
  status: "available" | "occupied" | "maintenance";
  tenantId?: string | null;
  currentTenantId?: string | null; 
  bedLabel: string;
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
}

// ─── TENANT TYPES ───

export interface Tenant {
  id: string;
  name: string;
  email?: string;
  phone: string;
  dob: string;
  gender: "Male" | "Female" | "Other";
  aadhaarNumber: string;
  emergencyContact: string; 
  address?: string; 
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
    bedLabel: string;     
    buildingName: string; 
  };
  createdAt: Timestamp;
  updatedAt?: Timestamp;
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
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
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
  createdAt?: Timestamp;
}

export interface Expense {
  id: string;
  category: "Maintenance" | "Salary" | "Electricity" | "Groceries" | "Water" | "Other";
  amount: number;
  description: string;
  date: Timestamp;
  recordedBy: string;
  createdAt?: Timestamp;
}

export type PaymentRecord = Payment;

// ─── SYSTEM SETTINGS TYPES ───

export interface GlobalSettings {
  electricityRatePerUnit: number;
  rateHistory?: unknown[];     
  gracePeriodDays?: number;    
  lateFeeEnabled?: boolean;    
  waterCharge?: number;
  maintenanceFee?: number;
  lateFeeAmount?: number;
  noticePeriodDays?: number;
  lockInPeriodMonths?: number;
  updatedBy?: string;
  updatedAt?: Timestamp;
}

// ─── UTILITIES & ELECTRICITY TYPES ───

export interface ElectricityReading {
  id: string;
  roomId: string;
  roomNumber: string;
  meterNumber?: string;
  previousReading: number;
  currentReading: number;
  unitsConsumed: number;
  ratePerUnit: number;
  totalAmount: number;
  readingDate: Timestamp;
  month: string; 
  isBilled: boolean;
  recordedBy: string;
  // <--- Added tenantSplits to fix the build error!
  tenantSplits?: {
    tenantId: string;
    amount: number;
    tenantName?: string;
  }[];
  createdAt?: Timestamp;
}

// ─── STAFF TYPES ───

export interface Staff {
  id: string;
  name: string;
  role: "Manager" | "Cook" | "Cleaner" | "Security" | "Maintenance" | "Other";
  phone: string;
  salary: number;
  joiningDate: Timestamp;
  status: "active" | "inactive";
  shift?: string;
  notes?: string;
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
}