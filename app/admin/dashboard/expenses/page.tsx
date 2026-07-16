"use client";

import React, { useState } from "react";
import { Loader2, Plus, Receipt, TrendingDown, Trash2, X, Search } from "lucide-react";
import { Timestamp } from "firebase/firestore";
import { useExpenses } from "@/hooks/useExpenses";
import { expenseService } from "@/services/expenses.service";
import { Expense } from "@/types";

const INR = (n: number) => "₹" + n.toLocaleString("en-IN");

export default function ExpensesPage() {
  const { expenses, loading } = useExpenses();
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);

  // Calculate current month's expenses
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  
  const thisMonthExpenses = expenses.filter(e => {
    const d = e.date.toDate();
    return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
  });

  const totalThisMonth = thisMonthExpenses.reduce((sum, e) => sum + e.amount, 0);

  const filteredExpenses = expenses.filter(e => 
    e.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    e.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this expense record?")) {
      await expenseService.delete(id);
    }
  };

  if (loading) return <div className="h-full flex items-center justify-center text-navy"><Loader2 className="animate-spin" size={32} /></div>;

  return (
    <div className="flex flex-col h-full space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-navy">Expenses</h1>
          <p className="text-sm text-gray-500 mt-1">Track your property's operational outflow</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 bg-navy text-white px-4 py-2.5 rounded-lg text-sm font-semibold hover:bg-navy/90 transition-colors shadow-sm"
        >
          <Plus size={18} /> Log New Expense
        </button>
      </div>

      {/* KPI Card */}
      <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex items-center gap-5 max-w-sm">
        <div className="w-14 h-14 rounded-full bg-red-50 flex items-center justify-center">
          <TrendingDown className="text-red-600" size={28} />
        </div>
        <div>
          <div className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Outflow This Month</div>
          <div className="text-3xl font-bold text-gray-900 mt-1">{INR(totalThisMonth)}</div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
        <div className="relative max-w-md">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input 
            type="text" 
            placeholder="Search expenses by description or category..." 
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
            <thead className="text-xs text-gray-500 bg-gray-50 border-b border-gray-200 uppercase tracking-wider sticky top-0">
              <tr>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4">Category</th>
                <th className="px-6 py-4">Description</th>
                <th className="px-6 py-4 text-right">Amount</th>
                <th className="px-6 py-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredExpenses.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                    <Receipt size={32} className="mx-auto mb-3 text-gray-300" />
                    <p className="font-medium">No expenses logged yet.</p>
                  </td>
                </tr>
              ) : (
                filteredExpenses.map((exp) => (
                  <tr key={exp.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4 text-gray-600 font-medium">{exp.date.toDate().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</td>
                    <td className="px-6 py-4">
                      <span className="bg-gray-100 text-gray-700 px-2.5 py-1 rounded-md text-xs font-bold uppercase">{exp.category}</span>
                    </td>
                    <td className="px-6 py-4 text-gray-800">{exp.description}</td>
                    <td className="px-6 py-4 text-right font-bold text-red-600">{INR(exp.amount)}</td>
                    <td className="px-6 py-4 text-right">
                      <button onClick={() => handleDelete(exp.id)} className="text-gray-400 hover:text-red-600 p-1.5 rounded-md hover:bg-red-50 transition-colors">
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showAddModal && <AddExpenseModal onClose={() => setShowAddModal(false)} />}
    </div>
  );
}

// ─── ADD EXPENSE MODAL ───
function AddExpenseModal({ onClose }: { onClose: () => void }) {
  const [isSaving, setIsSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    
    const formData = new FormData(e.target as HTMLFormElement);
    
    try {
      await expenseService.add({
        amount: parseFloat(formData.get("amount") as string),
        category: formData.get("category") as any,
        description: formData.get("description") as string,
        date: Timestamp.fromDate(new Date(formData.get("date") as string)),
        recordedBy: "Admin"
      });
      onClose();
    } catch (error) {
      alert("Failed to save expense.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden" onClick={e => e.stopPropagation()}>
        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
          <h2 className="text-lg font-bold text-navy flex items-center gap-2">Log New Expense</h2>
          <button onClick={onClose}><X size={20} className="text-gray-400 hover:text-gray-700" /></button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="text-xs font-semibold text-gray-600 uppercase mb-1 block">Category</label>
            <select name="category" required className="w-full px-3 py-2.5 border rounded-lg text-sm bg-white focus:ring-2 focus:ring-gold outline-none">
              <option value="Maintenance">Maintenance & Repairs</option>
              <option value="Electricity">Electricity Bill</option>
              <option value="Water">Water Bill</option>
              <option value="Salary">Staff Salary</option>
              <option value="Groceries">Groceries / Food</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div>
            <label className="text-xs font-semibold text-gray-600 uppercase mb-1 block">Description</label>
            <input name="description" type="text" required placeholder="e.g. Plumber for Room 101" className="w-full px-3 py-2.5 border rounded-lg text-sm focus:ring-2 focus:ring-gold outline-none" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-gray-600 uppercase mb-1 block">Amount (₹)</label>
              <input name="amount" type="number" required placeholder="0" className="w-full px-3 py-2.5 border rounded-lg text-sm focus:ring-2 focus:ring-gold outline-none" />
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-600 uppercase mb-1 block">Date</label>
              <input name="date" type="date" required defaultValue={new Date().toISOString().split('T')[0]} className="w-full px-3 py-2.5 border rounded-lg text-sm focus:ring-2 focus:ring-gold outline-none" />
            </div>
          </div>

          <button type="submit" disabled={isSaving} className="w-full py-2.5 bg-navy text-white rounded-lg font-bold text-sm mt-4 flex justify-center items-center">
            {isSaving ? <Loader2 size={16} className="animate-spin" /> : "Save Expense"}
          </button>
        </form>
      </div>
    </div>
  );
}