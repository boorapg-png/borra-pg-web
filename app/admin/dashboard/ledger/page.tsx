"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAdmin } from "../../../../hooks/useAdmin";
import { 
  Download, 
  Search, 
  Filter, 
  ArrowUpRight, 
  ArrowDownLeft,
  Calendar
} from "lucide-react";

// --- TYPES & INTERFACES ---
type TransactionType = "Credit" | "Debit";

interface LedgerEntry {
  id: string;
  date: string;
  description: string;
  category: string;
  type: TransactionType;
  amount: number;
  runningBalance: number;
}

// --- MOCK DATA ---
const LEDGER_ENTRIES: LedgerEntry[] = [
  { id: "L001", date: "14 Jul 2026, 10:30 AM", description: "Rent Payment - Aman Singh (Room 102)", category: "Rent", type: "Credit", amount: 5000, runningBalance: 125500 },
  { id: "L002", date: "13 Jul 2026, 04:15 PM", description: "Rent Payment - Sandeep Verma (Room 104)", category: "Rent", type: "Credit", amount: 6000, runningBalance: 120500 },
  { id: "L003", date: "13 Jul 2026, 02:00 PM", description: "Plumbing Repairs - Block A", category: "Maintenance", type: "Debit", amount: 1500, runningBalance: 114500 },
  { id: "L004", date: "12 Jul 2026, 11:20 AM", description: "Rent Payment - Deepak Sharma (Room 201)", category: "Rent", type: "Credit", amount: 6000, runningBalance: 116000 },
  { id: "L005", date: "11 Jul 2026, 09:00 AM", description: "Rent Payment - Rohan (Room 201)", category: "Rent", type: "Credit", amount: 6000, runningBalance: 110000 },
  { id: "L006", date: "10 Jul 2026, 03:45 PM", description: "Electricity Bill - June", category: "Utilities", type: "Debit", amount: 12400, runningBalance: 104000 },
];

export default function LedgerManagement() {
  const { user, isAdmin, loading } = useAdmin();
  const router = useRouter();

  const [searchQuery, setSearchQuery] = useState("");

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
    <div className="space-y-6 h-full flex flex-col">
      
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-xl shadow-sm border border-gray-100 shrink-0">
        <div>
          <h2 className="text-xl font-bold text-[#1A2744]">Master Ledger</h2>
          <p className="text-sm text-gray-500">Track all credits, debits, and running balances</p>
        </div>
        
        <button className="flex items-center justify-center gap-2 bg-white border-2 border-gray-200 text-gray-700 px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-gray-50 hover:border-gray-300 transition-colors">
          <Download size={18} />
          Export CSV
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 shrink-0">
        <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500 mb-1">Total Credits (This Month)</p>
            <h4 className="text-2xl font-bold text-green-600">₹1,45,000</h4>
          </div>
          <div className="p-3 rounded-lg bg-green-50 text-green-600">
            <ArrowDownLeft size={24} />
          </div>
        </div>
        <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500 mb-1">Total Debits (This Month)</p>
            <h4 className="text-2xl font-bold text-red-600">₹19,500</h4>
          </div>
          <div className="p-3 rounded-lg bg-red-50 text-red-600">
            <ArrowUpRight size={24} />
          </div>
        </div>
        <div className="bg-[#1A2744] p-5 rounded-xl shadow-sm border border-[#1A2744] flex items-center justify-between text-white">
          <div>
            <p className="text-sm font-medium text-gray-300 mb-1">Net Balance</p>
            <h4 className="text-2xl font-bold text-[#C9973A]">₹1,25,500</h4>
          </div>
        </div>
      </div>

      {/* Toolbar: Search & Filters */}
      <div className="flex flex-col sm:flex-row gap-4 shrink-0">
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search size={18} className="text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search descriptions or categories..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#C9973A]/50 focus:border-[#C9973A] transition-all shadow-sm"
          />
        </div>
        
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 shadow-sm transition-colors">
            <Calendar size={18} className="text-gray-400" />
            Select Month
          </button>
          <button className="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 shadow-sm transition-colors">
            <Filter size={18} className="text-gray-400" />
            Filter
          </button>
        </div>
      </div>

      {/* Ledger Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 flex-1 overflow-hidden flex flex-col">
        <div className="overflow-x-auto flex-1">
          <table className="w-full text-sm text-left whitespace-nowrap">
            <thead className="text-gray-500 bg-gray-50 border-b border-gray-100 sticky top-0 z-10">
              <tr>
                <th className="px-6 py-4 font-medium">Date & Time</th>
                <th className="px-6 py-4 font-medium">Description</th>
                <th className="px-6 py-4 font-medium">Category</th>
                <th className="px-6 py-4 font-medium text-right">Debit (Out)</th>
                <th className="px-6 py-4 font-medium text-right">Credit (In)</th>
                <th className="px-6 py-4 font-medium text-right bg-gray-50">Balance</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {LEDGER_ENTRIES.map((entry) => (
                <tr key={entry.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4 text-gray-500 font-medium">
                    {entry.date}
                  </td>
                  <td className="px-6 py-4">
                    <p className="font-semibold text-gray-900">{entry.description}</p>
                    <p className="text-xs text-gray-400 font-mono mt-0.5">TXN-{entry.id}</p>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-2.5 py-1 bg-gray-100 text-gray-600 rounded-md text-xs font-medium">
                      {entry.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    {entry.type === "Debit" ? (
                      <span className="font-semibold text-red-600">-₹{entry.amount.toLocaleString('en-IN')}</span>
                    ) : (
                      <span className="text-gray-300">-</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right">
                    {entry.type === "Credit" ? (
                      <span className="font-semibold text-green-600">+₹{entry.amount.toLocaleString('en-IN')}</span>
                    ) : (
                      <span className="text-gray-300">-</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right font-bold text-[#1A2744] bg-gray-50/50 border-l border-gray-50">
                    ₹{entry.runningBalance.toLocaleString('en-IN')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}