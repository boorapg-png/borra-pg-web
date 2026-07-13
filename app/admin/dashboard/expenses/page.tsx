"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAdmin } from "../../../../hooks/useAdmin";
import { 
  IndianRupee, 
  Receipt, 
  ShoppingCart, 
  Zap, 
  Wrench, 
  Users, 
  FileText,
  CheckCircle2,
  TrendingDown
} from "lucide-react";

// --- TYPES & INTERFACES ---
type ExpenseCategory = "Groceries" | "Utilities" | "Maintenance" | "Staff" | "Other";

interface Expense {
  id: string;
  date: string;
  description: string;
  category: ExpenseCategory;
  amount: number;
  recordedBy: string;
}

// --- MOCK DATA ---
const RECENT_EXPENSES: Expense[] = [
  { id: "EXP_001", date: "14 Jul 2026", description: "Weekly Vegetables & Dairy", category: "Groceries", amount: 4500, recordedBy: "Admin" },
  { id: "EXP_002", date: "13 Jul 2026", description: "Plumbing Repair - Block A", category: "Maintenance", amount: 1500, recordedBy: "Admin" },
  { id: "EXP_003", date: "10 Jul 2026", description: "Electricity Bill (June)", category: "Utilities", amount: 12400, recordedBy: "Admin" },
  { id: "EXP_004", date: "01 Jul 2026", description: "Cook Salary", category: "Staff", amount: 18000, recordedBy: "Admin" },
  { id: "EXP_005", date: "28 Jun 2026", description: "Cleaning Supplies", category: "Other", amount: 850, recordedBy: "Admin" },
];

const CATEGORIES: ExpenseCategory[] = ["Groceries", "Utilities", "Maintenance", "Staff", "Other"];

// Helper function for category icons
const getCategoryIcon = (category: ExpenseCategory) => {
  switch (category) {
    case "Groceries": return <ShoppingCart size={16} className="text-orange-500" />;
    case "Utilities": return <Zap size={16} className="text-yellow-500" />;
    case "Maintenance": return <Wrench size={16} className="text-blue-500" />;
    case "Staff": return <Users size={16} className="text-purple-500" />;
    default: return <FileText size={16} className="text-gray-500" />;
  }
};

export default function ExpensesManagement() {
  const { user, isAdmin, loading } = useAdmin();
  const router = useRouter();

  const [category, setCategory] = useState<ExpenseCategory>("Groceries");

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
      <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-[#1A2744]">Expenses Tracking</h2>
          <p className="text-sm text-gray-500">Log outgoing payments and monitor your operational costs</p>
        </div>
        <div className="flex items-center gap-2 bg-red-50 text-red-700 px-4 py-2 rounded-lg font-medium border border-red-100">
          <TrendingDown size={18} />
          Total this month: ₹36,400
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Record Expense Form (1 column) */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 lg:col-span-1 h-fit">
          <div className="flex items-center gap-2 mb-6">
            <Receipt className="text-[#1A2744]" size={20} />
            <h3 className="font-bold text-[#1A2744]">Log New Expense</h3>
          </div>

          <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
            
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
                  className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#C9973A]/50 focus:border-[#C9973A]"
                />
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <input
                type="text"
                placeholder="e.g., Weekly vegetables"
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#C9973A]/50 focus:border-[#C9973A]"
              />
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as ExpenseCategory)}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm appearance-none focus:outline-none focus:ring-2 focus:ring-[#C9973A]/50 focus:border-[#C9973A] bg-white cursor-pointer"
              >
                {CATEGORIES.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            {/* Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
              <input
                type="date"
                defaultValue={new Date().toISOString().split('T')[0]}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#C9973A]/50 focus:border-[#C9973A]"
              />
            </div>

            <button
              type="button"
              className="w-full bg-[#1A2744] text-white py-3 rounded-lg text-sm font-medium hover:bg-[#1A2744]/90 transition-colors mt-2 flex items-center justify-center gap-2"
            >
              <CheckCircle2 size={18} />
              Save Expense
            </button>
          </form>
        </div>

        {/* Recent Expenses Table (2 columns) */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 lg:col-span-2">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-bold text-[#1A2744]">Recent Expenses</h3>
            <button className="text-sm font-medium text-[#C9973A] hover:underline">View Monthly Report</button>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-gray-500 border-b border-gray-100">
                <tr>
                  <th className="pb-3 font-medium">Description</th>
                  <th className="pb-3 font-medium">Category</th>
                  <th className="pb-3 font-medium">Date</th>
                  <th className="pb-3 font-medium text-right">Amount</th>
                </tr>
              </thead>
              <tbody>
                {RECENT_EXPENSES.map((expense) => (
                  <tr key={expense.id} className="border-b border-gray-50 last:border-0 hover:bg-gray-50/50 transition-colors">
                    <td className="py-4">
                      <p className="font-semibold text-gray-900">{expense.description}</p>
                    </td>
                    <td className="py-4">
                      <div className="flex items-center gap-2 px-2.5 py-1 bg-gray-50 rounded-md w-fit border border-gray-100">
                        {getCategoryIcon(expense.category)}
                        <span className="text-xs font-medium text-gray-700">{expense.category}</span>
                      </div>
                    </td>
                    <td className="py-4 text-gray-600">
                      {expense.date}
                    </td>
                    <td className="py-4 text-right">
                      <span className="font-semibold text-red-600">₹{expense.amount.toLocaleString('en-IN')}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}