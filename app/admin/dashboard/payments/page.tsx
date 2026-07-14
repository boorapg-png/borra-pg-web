"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAdmin } from "../../../../hooks/useAdmin";
import { 
  IndianRupee, Smartphone, Banknote, CreditCard, Receipt, 
  Edit2, Trash2, X, Plus, Search
} from "lucide-react";

// --- TYPES ---
type PaymentMethod = "UPI" | "Cash" | "Bank Transfer";

interface Payment {
  id: string;
  tenantName: string;
  room: string;
  amount: number;
  date: string;
  method: PaymentMethod;
  referenceId: string;
}

export default function PaymentsManagement() {
  const { user, isAdmin, loading } = useAdmin();
  const router = useRouter();

  // --- STATE ---
  const [payments, setPayments] = useState<Payment[]>([
    { id: "p1", tenantName: "Aman Singh", room: "102", amount: 5000, date: "2026-07-14", method: "UPI", referenceId: "UPI123456789" },
    { id: "p2", tenantName: "Sandeep Verma", room: "104", amount: 6000, date: "2026-07-13", method: "Bank Transfer", referenceId: "IMPS9876543" },
  ]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPayment, setEditingPayment] = useState<Payment | null>(null);

  useEffect(() => {
    if (!loading && (!user || !isAdmin)) router.push("/admin/login");
  }, [user, isAdmin, loading, router]);

  // --- HANDLERS ---
  const handleDelete = (id: string) => {
    if (confirm("Delete this payment record?")) {
      setPayments(payments.filter(p => p.id !== id));
    }
  };

  const handleSave = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const newPayment: Payment = {
      id: editingPayment ? editingPayment.id : Math.random().toString(36).substr(2, 9),
      tenantName: formData.get("tenantName") as string,
      room: formData.get("room") as string,
      amount: parseFloat(formData.get("amount") as string),
      date: formData.get("date") as string,
      method: formData.get("method") as PaymentMethod,
      referenceId: formData.get("referenceId") as string,
    };

    if (editingPayment) {
      setPayments(payments.map(p => p.id === editingPayment.id ? newPayment : p));
    } else {
      setPayments([...payments, newPayment]);
    }
    setIsModalOpen(false);
    setEditingPayment(null);
  };

  if (loading) return <div className="p-10 text-center">Loading...</div>;
  if (!user || !isAdmin) return null;

  return (
    <div className="space-y-6 h-full flex flex-col">
      <div className="flex justify-between items-center bg-white p-5 rounded-xl shadow-sm border border-gray-100">
        <div>
          <h2 className="text-xl font-bold text-[#1A2744]">Payments & Collections</h2>
        </div>
        <button 
          onClick={() => { setEditingPayment(null); setIsModalOpen(true); }}
          className="bg-[#1A2744] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#1A2744]/90 flex items-center gap-2"
        >
          <Plus size={18} /> Record New Payment
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 flex-1 overflow-auto">
        <table className="w-full text-sm text-left">
          <thead className="text-gray-500 bg-gray-50 border-b border-gray-100">
            <tr>
              <th className="px-6 py-4 font-medium">Tenant</th>
              <th className="px-6 py-4 font-medium">Method</th>
              <th className="px-6 py-4 font-medium">Date</th>
              <th className="px-6 py-4 font-medium text-right">Amount</th>
              <th className="px-6 py-4 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {payments.map((payment) => (
              <tr key={payment.id} className="hover:bg-gray-50">
                <td className="px-6 py-4">
                  <p className="font-semibold">{payment.tenantName}</p>
                  <p className="text-xs text-gray-500">Room {payment.room}</p>
                </td>
                <td className="px-6 py-4 text-gray-600">{payment.method}</td>
                <td className="px-6 py-4 text-gray-600">{payment.date}</td>
                <td className="px-6 py-4 text-right font-semibold text-green-600">+₹{payment.amount.toLocaleString('en-IN')}</td>
                <td className="px-6 py-4 text-right flex justify-end gap-2">
                  <button onClick={() => { setEditingPayment(payment); setIsModalOpen(true); }} className="text-gray-400 hover:text-[#C9973A]"><Edit2 size={16} /></button>
                  <button onClick={() => handleDelete(payment.id)} className="text-gray-400 hover:text-red-600"><Trash2 size={16} /></button>
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
              <h3 className="font-bold text-lg">{editingPayment ? "Edit Payment" : "Record Payment"}</h3>
              <button onClick={() => setIsModalOpen(false)}><X size={20} /></button>
            </div>
            <form onSubmit={handleSave} className="space-y-4">
              <input name="tenantName" defaultValue={editingPayment?.tenantName} placeholder="Tenant Name" className="w-full p-2 border rounded" required />
              <input name="room" defaultValue={editingPayment?.room} placeholder="Room Number" className="w-full p-2 border rounded" required />
              <input type="number" name="amount" defaultValue={editingPayment?.amount} placeholder="Amount" className="w-full p-2 border rounded" required />
              <input type="date" name="date" defaultValue={editingPayment?.date} className="w-full p-2 border rounded" required />
              <select name="method" defaultValue={editingPayment?.method} className="w-full p-2 border rounded">
                <option value="UPI">UPI</option>
                <option value="Cash">Cash</option>
                <option value="Bank Transfer">Bank Transfer</option>
              </select>
              <input name="referenceId" defaultValue={editingPayment?.referenceId} placeholder="Ref ID / UTR" className="w-full p-2 border rounded" />
              <button type="submit" className="w-full bg-[#1A2744] text-white py-2 rounded-lg font-bold">Save Payment</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}