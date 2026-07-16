"use client";

import React, { useState } from "react";
import { 
  FileText, AlertCircle, Receipt, Search, IndianRupee, 
  CheckCircle2, Loader2, Calendar, X 
} from "lucide-react";
import { Timestamp } from "firebase/firestore";
import { usePendingDues } from "@/hooks/useBills";
import { paymentService } from "@/services/payments.service";
import { Bill } from "@/types";

const INR = (n: number) => "₹" + n.toLocaleString("en-IN");

export default function PaymentsPage() {
  const { bills: pendingBills, loading, totalDues } = usePendingDues();
  const [searchTerm, setSearchTerm] = useState("");
  const [paymentModalBill, setPaymentModalBill] = useState<Bill | null>(null);
  const [showGenerateModal, setShowGenerateModal] = useState(false);

  // Filter bills by tenant name or month
  const filteredBills = pendingBills.filter(bill => 
    bill.tenantName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    bill.month.includes(searchTerm)
  );

  if (loading) return <div className="h-full flex items-center justify-center text-navy"><Loader2 className="animate-spin" size={32} /></div>;

  return (
    <div className="flex flex-col h-full space-y-6">
      {/* Header & Main Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-navy">Billing & Payments</h1>
          <p className="text-sm text-gray-500 mt-1">Manage active invoices and collect pending rent</p>
        </div>
        <button
          onClick={() => setShowGenerateModal(true)}
          className="flex items-center gap-2 bg-navy text-white px-4 py-2.5 rounded-lg text-sm font-semibold hover:bg-navy/90 transition-colors shadow-sm"
        >
          <FileText size={18} /> Generate Monthly Bills
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center">
            <AlertCircle className="text-red-600" size={24} />
          </div>
          <div>
            <div className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Total Pending Dues</div>
            <div className="text-2xl font-bold text-red-600 mt-1">{INR(totalDues)}</div>
          </div>
        </div>
        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-amber-50 flex items-center justify-center">
            <Receipt className="text-amber-600" size={24} />
          </div>
          <div>
            <div className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Unpaid Invoices</div>
            <div className="text-2xl font-bold text-gray-800 mt-1">{pendingBills.length}</div>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
        <div className="relative max-w-md">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input 
            type="text" 
            placeholder="Search pending bills by tenant or month..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-gold focus:outline-none transition-colors"
          />
        </div>
      </div>

      {/* Data Table */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm flex-1 overflow-hidden flex flex-col">
        <div className="overflow-x-auto flex-1">
          <table className="w-full text-sm text-left whitespace-nowrap">
            <thead className="text-xs text-gray-500 bg-gray-50 border-b border-gray-200 uppercase tracking-wider sticky top-0 z-10">
              <tr>
                <th className="px-6 py-4">Tenant</th>
                <th className="px-6 py-4">Month</th>
                <th className="px-6 py-4 text-right">Total Bill</th>
                <th className="px-6 py-4 text-right">Balance Due</th>
                <th className="px-6 py-4 text-center">Status</th>
                <th className="px-6 py-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredBills.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-16 text-center">
                    <CheckCircle2 size={40} className="mx-auto mb-3 text-green-400" />
                    <p className="font-bold text-gray-700 text-lg">All caught up!</p>
                    <p className="text-sm text-gray-500 mt-1">There are no pending dues right now.</p>
                  </td>
                </tr>
              ) : (
                filteredBills.map((bill) => (
                  <tr key={bill.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4 font-bold text-navy">{bill.tenantName}</td>
                    <td className="px-6 py-4 flex items-center gap-2 text-gray-600 font-medium">
                      <Calendar size={14} className="text-gray-400"/> {bill.month}
                    </td>
                    <td className="px-6 py-4 text-right font-medium text-gray-700">{INR(bill.totalAmount)}</td>
                    <td className="px-6 py-4 text-right font-bold text-red-600">{INR(bill.balance)}</td>
                    <td className="px-6 py-4 text-center">
                      <span className={`inline-flex px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider ${
                        bill.status === 'partial' ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-700'
                      }`}>
                        {bill.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button 
                        onClick={() => setPaymentModalBill(bill)}
                        className="text-xs font-semibold bg-navy text-white px-3 py-2 rounded-md hover:bg-navy/90 transition-colors"
                      >
                        Record Payment
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODALS */}
      {showGenerateModal && <GenerateBillsModal onClose={() => setShowGenerateModal(false)} />}
      {paymentModalBill && <RecordPaymentModal bill={paymentModalBill} onClose={() => setPaymentModalBill(null)} />}
    </div>
  );
}

// ─── MODAL COMPONENTS (Keep these in the same file) ───

function GenerateBillsModal({ onClose }: { onClose: () => void }) {
  const [month, setMonth] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!month) return;
    setIsGenerating(true);
    try {
      await paymentService.generateMonthlyBills(month);
      onClose();
    } catch (error) {
      alert("Failed to generate bills.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden" onClick={e => e.stopPropagation()}>
        <div className="p-6 border-b border-gray-100 flex justify-between items-center">
          <h2 className="text-lg font-bold text-navy flex items-center gap-2">
            <FileText size={20} className="text-gold" /> Generate Bills
          </h2>
          <button onClick={onClose}><X size={20} className="text-gray-400 hover:text-gray-700" /></button>
        </div>
        <form onSubmit={handleGenerate} className="p-6 space-y-6">
          <p className="text-sm text-gray-500">Creates rent invoices for all active tenants for the selected month.</p>
          <input 
            type="month" required value={month} onChange={(e) => setMonth(e.target.value)} disabled={isGenerating} 
            className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-gold focus:outline-none" 
          />
          <button type="submit" disabled={!month || isGenerating} className="w-full py-2.5 bg-navy text-white rounded-lg font-semibold flex justify-center items-center gap-2">
            {isGenerating ? <Loader2 size={16} className="animate-spin" /> : "Generate Now"}
          </button>
        </form>
      </div>
    </div>
  );
}

function RecordPaymentModal({ bill, onClose }: { bill: Bill, onClose: () => void }) {
  const [amount, setAmount] = useState(bill.balance.toString());
  const [mode, setMode] = useState<"cash" | "upi" | "bank_transfer">("upi");
  const [isSaving, setIsSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await paymentService.recordPayment({
        tenantId: bill.tenantId, tenantName: bill.tenantName, billId: bill.id,
        buildingId: bill.buildingId, month: bill.month, amount: parseFloat(amount),
        paymentDate: Timestamp.now(), paymentMode: mode, recordedBy: "Admin",
      });
      onClose();
    } catch (error) {
      alert("Failed to record payment.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden" onClick={e => e.stopPropagation()}>
        <div className="p-6 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
          <div>
            <h2 className="text-lg font-bold text-navy flex items-center gap-2"><IndianRupee size={20} className="text-gold" /> Record Payment</h2>
            <p className="text-sm text-gray-600 mt-1">{bill.tenantName} • {bill.month}</p>
          </div>
          <button onClick={onClose}><X size={20} className="text-gray-400 hover:text-gray-700" /></button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="flex justify-between items-center bg-red-50 p-3 rounded-lg border border-red-100 mb-4">
            <span className="text-xs font-semibold text-red-600 uppercase">Balance Due:</span>
            <span className="text-lg font-bold text-red-600">{INR(bill.balance)}</span>
          </div>
          <input 
            type="number" required max={bill.balance} value={amount} onChange={(e) => setAmount(e.target.value)} 
            className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-gold focus:outline-none" 
            placeholder="Amount"
          />
          <select value={mode} onChange={(e) => setMode(e.target.value as any)} className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm bg-white focus:ring-2 focus:ring-gold focus:outline-none">
            <option value="upi">UPI</option>
            <option value="cash">Cash</option>
            <option value="bank_transfer">Bank Transfer</option>
          </select>
          <button type="submit" disabled={isSaving} className="w-full py-2.5 bg-green-600 text-white rounded-lg font-semibold flex justify-center items-center gap-2 mt-4">
            {isSaving ? <Loader2 size={16} className="animate-spin" /> : "Confirm Payment"}
          </button>
        </form>
      </div>
    </div>
  );
}