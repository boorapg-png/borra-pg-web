"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAdmin } from "../../../../hooks/useAdmin";
import { 
  IndianRupee, 
  CreditCard, 
  Banknote, 
  Smartphone, 
  Receipt,
  Search,
  CheckCircle2
} from "lucide-react";

// --- TYPES & INTERFACES ---
interface Transaction {
  id: string;
  tenantName: string;
  room: string;
  amount: number;
  date: string;
  method: "UPI" | "Cash" | "Bank Transfer";
  referenceId?: string;
}

// --- MOCK DATA ---
const RECENT_TRANSACTIONS: Transaction[] = [
  { id: "txn_001", tenantName: "Aman Singh", room: "102", amount: 5000, date: "Today, 10:30 AM", method: "UPI", referenceId: "UPI123456789" },
  { id: "txn_002", tenantName: "Sandeep Verma", room: "104", amount: 6000, date: "Yesterday, 04:15 PM", method: "Bank Transfer", referenceId: "IMPS9876543" },
  { id: "txn_003", tenantName: "Deepak Sharma", room: "201", amount: 6000, date: "12 Jul 2026", method: "Cash" },
  { id: "txn_004", tenantName: "Rohan", room: "201", amount: 6000, date: "11 Jul 2026", method: "UPI", referenceId: "UPI987123654" },
];

export default function PaymentsManagement() {
  const { user, isAdmin, loading } = useAdmin();
  const router = useRouter();
  
  const [paymentMethod, setPaymentMethod] = useState<"UPI" | "Cash" | "Bank Transfer">("UPI");

  // Protect route
  useEffect(() => {
    if (!loading && (!user || !isAdmin)) {
      router.push("/admin/login");
    }
  }, [user, isAdmin, loading, router]);

  if (loading) {
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <div className="animate-pulse w-12 h-12 border-4 border-[#C9973A] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!user || !isAdmin) return null;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
        <h2 className="text-xl font-bold text-[#1A2744]">Payments & Collection</h2>
        <p className="text-sm text-gray-500">Record new payments and view recent transaction history</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Record Payment Form (Takes up 1 column) */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 lg:col-span-1 h-fit">
          <div className="flex items-center gap-2 mb-6">
            <Receipt className="text-[#C9973A]" size={20} />
            <h3 className="font-bold text-[#1A2744]">Record Payment</h3>
          </div>

          <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
            {/* Tenant Search */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Select Tenant</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search size={16} className="text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search tenant or room..."
                  className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#C9973A]/50 focus:border-[#C9973A]"
                />
              </div>
            </div>

            {/* Amount */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Amount (₹)</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <IndianRupee size={16} className="text-gray-400" />
                </div>
                <input
                  type="number"
                  placeholder="0.00"
                  className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#C9973A]/50 focus:border-[#C9973A]"
                />
              </div>
            </div>

            {/* Payment Method Selector */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Payment Method</label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setPaymentMethod("UPI")}
                  className={`flex flex-col items-center justify-center py-3 border rounded-lg text-xs font-medium transition-colors ${
                    paymentMethod === "UPI" ? "border-[#C9973A] bg-[#C9973A]/10 text-[#C9973A]" : "border-gray-200 text-gray-500 hover:bg-gray-50"
                  }`}
                >
                  <Smartphone size={20} className="mb-1" />
                  UPI
                </button>
                <button
                  type="button"
                  onClick={() => setPaymentMethod("Cash")}
                  className={`flex flex-col items-center justify-center py-3 border rounded-lg text-xs font-medium transition-colors ${
                    paymentMethod === "Cash" ? "border-[#C9973A] bg-[#C9973A]/10 text-[#C9973A]" : "border-gray-200 text-gray-500 hover:bg-gray-50"
                  }`}
                >
                  <Banknote size={20} className="mb-1" />
                  Cash
                </button>
                <button
                  type="button"
                  onClick={() => setPaymentMethod("Bank Transfer")}
                  className={`flex flex-col items-center justify-center py-3 border rounded-lg text-xs font-medium transition-colors ${
                    paymentMethod === "Bank Transfer" ? "border-[#C9973A] bg-[#C9973A]/10 text-[#C9973A]" : "border-gray-200 text-gray-500 hover:bg-gray-50"
                  }`}
                >
                  <CreditCard size={20} className="mb-1" />
                  Bank
                </button>
              </div>
            </div>

            {/* Reference ID (Conditional) */}
            {paymentMethod !== "Cash" && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Transaction ID / UTR</label>
                <input
                  type="text"
                  placeholder={`Enter ${paymentMethod} reference`}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#C9973A]/50 focus:border-[#C9973A]"
                />
              </div>
            )}

            <button
              type="button"
              className="w-full bg-[#1A2744] text-white py-2.5 rounded-lg text-sm font-medium hover:bg-[#1A2744]/90 transition-colors mt-2 flex items-center justify-center gap-2"
            >
              <CheckCircle2 size={18} />
              Confirm Payment
            </button>
          </form>
        </div>

        {/* Recent Transactions (Takes up 2 columns) */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 lg:col-span-2">
          <h3 className="font-bold text-[#1A2744] mb-6">Recent Transactions</h3>
          
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-gray-500 border-b border-gray-100">
                <tr>
                  <th className="pb-3 font-medium">Tenant</th>
                  <th className="pb-3 font-medium">Amount</th>
                  <th className="pb-3 font-medium">Method</th>
                  <th className="pb-3 font-medium">Date</th>
                </tr>
              </thead>
              <tbody>
                {RECENT_TRANSACTIONS.map((txn) => (
                  <tr key={txn.id} className="border-b border-gray-50 last:border-0 hover:bg-gray-50/50 transition-colors">
                    <td className="py-4">
                      <p className="font-semibold text-gray-900">{txn.tenantName}</p>
                      <p className="text-xs text-gray-500">Room {txn.room}</p>
                    </td>
                    <td className="py-4">
                      <span className="font-semibold text-green-600">+₹{txn.amount.toLocaleString('en-IN')}</span>
                    </td>
                    <td className="py-4">
                      <div className="flex items-center gap-1.5">
                        {txn.method === "UPI" && <Smartphone size={14} className="text-gray-400" />}
                        {txn.method === "Cash" && <Banknote size={14} className="text-gray-400" />}
                        {txn.method === "Bank Transfer" && <CreditCard size={14} className="text-gray-400" />}
                        <span className="text-gray-700">{txn.method}</span>
                      </div>
                      {txn.referenceId && (
                        <p className="text-[10px] text-gray-400 font-mono mt-0.5">{txn.referenceId}</p>
                      )}
                    </td>
                    <td className="py-4 text-gray-600">
                      {txn.date}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          <div className="mt-4 pt-4 border-t border-gray-100 text-center">
            <button className="text-[#C9973A] hover:underline font-medium text-sm">
              View All Transactions →
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}