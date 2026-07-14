"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAdmin } from "../../../../hooks/useAdmin";
import { 
  IndianRupee, Receipt, ShoppingCart, Zap, Wrench, Users, 
  FileText, CheckCircle2, TrendingDown, Edit2, Trash2, X, Plus
} from "lucide-react";

// --- TYPES ---
type ExpenseCategory = "Groceries" | "Utilities" | "Maintenance" | "Staff" | "Other";

interface Expense {
  id: string;
  date: string;
  description: string;
  category: ExpenseCategory;
  amount: number;
}

const CATEGORIES: ExpenseCategory[] = ["Groceries", "Utilities", "Maintenance", "Staff", "Other"];

export default function ExpensesManagement() {
  const { user, isAdmin, loading } = useAdmin();
  const router = useRouter();

  // --- STATE ---
  const [expenses, setExpenses] = useState<Expense[]>([
    { id: "EXP_001", date: "2026-07-14", description: "Weekly Vegetables & Dairy", category: "Groceries", amount: 4500 },
    { id: "EXP_002", date: "2026-07-13", description: "Plumbing Repair - Block A", category: "Maintenance", amount: 1500 },
  ]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);

  useEffect(() => {
    if (!loading && (!user || !isAdmin)) router.push("/admin/login");
  }, [user, isAdmin, loading, router]);

  // --- HANDLERS ---
  const handleDelete = (id: string) => {
    if (confirm("Delete this expense record?")) {
      setExpenses(expenses.filter(e => e.id !== id));
    }
  };

  const handleSave = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const newExpense: Expense = {
      id: editingExpense ? editingExpense.id : Math.random().toString(36).substr(2, 9),
      description: formData.get("description") as string,
      category: formData.get("category") as ExpenseCategory,
      amount: parseFloat(formData.get("amount") as string),
      date: formData.get("date") as string,
    };

    if (editingExpense) {
      setExpenses(expenses.map(e => e.id === editingExpense.id ? newExpense : e));
    } else {
      setExpenses([...expenses, newExpense]);
    }
    setIsModalOpen(false);
    setEditingExpense(null);
  };

  if (loading) return <div className="p-10 text-center">Loading...</div>;
  if (!user || !isAdmin) return null;

  return (
    <div className="space-y-6 h-full flex flex-col">
      {/* Header */}
      <div className="flex justify-between items-center bg-white p-5 rounded-xl shadow-sm border border-gray-100">
        <div>
          <h2 className="text-xl font-bold text-[#1A2744]">Expenses Tracking</h2>
        </div>
        <button 
          onClick={() => { setEditingExpense(null); setIsModalOpen(true); }}
          className="bg-[#1A2744] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#1A2744]/90 flex items-center gap-2"
        >
          <Plus size={18} /> Log New Expense
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 flex-1 overflow-auto">
        <table className="w-full text-sm text-left">
          <thead className="text-gray-500 bg-gray-50 border-b border-gray-100">
            <tr>
              <th className="px-6 py-4 font-medium">Description</th>
              <th className="px-6 py-4 font-medium">Category</th>
              <th className="px-6 py-4 font-medium">Date</th>
              <th className="px-6 py-4 font-medium text-right">Amount</th>
              <th className="px-6 py-4 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {expenses.map((expense) => (
              <tr key={expense.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 font-medium">{expense.description}</td>
                <td className="px-6 py-4 text-gray-600">{expense.category}</td>
                <td className="px-6 py-4 text-gray-600">{expense.date}</td>
                <td className="px-6 py-4 text-right font-semibold text-red-600">₹{expense.amount.toLocaleString('en-IN')}</td>
                <td className="px-6 py-4 text-right flex justify-end gap-2">
                  <button onClick={() => { setEditingExpense(expense); setIsModalOpen(true); }} className="text-gray-400 hover:text-[#C9973A]"><Edit2 size={16} /></button>
                  <button onClick={() => handleDelete(expense.id)} className="text-gray-400 hover:text-red-600"><Trash2 size={16} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl w-full max-w-md p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-lg">{editingExpense ? "Edit Expense" : "Log Expense"}</h3>
              <button onClick={() => setIsModalOpen(false)}><X size={20} /></button>
            </div>
            <form onSubmit={handleSave} className="space-y-4">
              <input name="description" defaultValue={editingExpense?.description} placeholder="Description" className="w-full p-2 border rounded" required />
              <select name="category" defaultValue={editingExpense?.category} className="w-full p-2 border rounded" required>
                {CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
              </select>
              <input type="number" name="amount" defaultValue={editingExpense?.amount} placeholder="Amount (₹)" className="w-full p-2 border rounded" required />
              <input type="date" name="date" defaultValue={editingExpense?.date} className="w-full p-2 border rounded" required />
              <button type="submit" className="w-full bg-[#1A2744] text-white py-2 rounded-lg font-bold">Save Expense</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}