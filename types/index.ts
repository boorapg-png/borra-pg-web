export interface Tenant {
  id: string;
  name: string;
  phone: string;
  dob: string;
  gender: "Male" | "Female" | "Other";
  aadhaarNumber: string;
  emergencyContact: string; // Suggested addition
  status: "active" | "inactive";
  joiningDate: Timestamp;
  leavingDate: Timestamp | null;
  documentStatus: "completed" | "pending";
  documentUrl?: string; // To store the uploaded ID file
  paymentStatus: "paid" | "pending" | "overdue";
  accommodation: {
    buildingId: string;
    floorId: string;
    roomId: string;
    bedId: string;
  };
  createdAt: Timestamp;
}
export interface Expense {
  id: string;
  category: "Maintenance" | "Salary" | "Electricity" | "Groceries" | "Water" | "Other";
  amount: number;
  description: string;
  date: Timestamp;
  recordedBy: string;
}