"use client";

import React, { useState } from "react";
import { Loader2, ChevronRight, X, Search, History, Plus } from "lucide-react";
import { Timestamp } from "firebase/firestore";
import { useTenants } from "@/hooks/useTenants";
import { useTenantPayments } from "@/hooks/usePayments";
import { paymentService } from "@/services/payments.service";
import { Tenant } from "@/types";

const INR = (n: number) => "₹" + n.toLocaleString("en-IN");

export default function LedgerPage() {
  // Fetching ALL tenants for the ledger, not just active ones
  const { tenants, loading } = useTenants(); 
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTenant, setSelectedTenant] = useState<Tenant | null>(null);

  const filteredTenants = tenants.filter(t => 
    t.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    t.accommodation.roomNumber.includes(searchTerm)
  );

  if (loading) return <div className="h-full flex items-center justify-center text-navy"><Loader2 className="animate-spin" size={32} /></div>;

  return (
    <div className="flex flex-col h-full space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-navy">Tenant Ledger</h1>
        <p className="text-sm text-gray-500 mt-1">View payment history and add manual adjustments for any tenant.</p>
      </div>

      {/* Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
        <div className="relative max-w-md">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input 
            type="text" 
            placeholder="Search by tenant name or room number..." 
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
                <th className="px-6 py-4">Tenant Name</th>
                <th className="px-6 py-4">Room & Phone</th>
                <th className="px-6 py-4">Current Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredTenants.length === 0 ? (
                 <tr>
                 <td colSpan={4} className="px-6 py-12 text-center text-gray-500">
                   <History size={32} className="mx-auto mb-3 text-gray-300" />
                   <p className="font-medium">No tenants found.</p>
                 </td>
               </tr>
              ) : (
                filteredTenants.map(t => (
                  <tr key={t.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4 font-bold text-navy">{t.name}</td>
                    <td className="px-6 py-4">
                      <div className="font-semibold text-gray-700">Room {t.accommodation.roomNumber}</div>
                      <div className="text-xs text-gray-500 mt-0.5">{t.phone}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider ${
                        t.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-600'
                      }`}>
                        {t.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button 
                        onClick={() => setSelectedTenant(t)} 
                        className="text-sm font-semibold bg-gray-100 text-navy px-3 py-1.5 rounded-md hover:bg-gray-200 transition-colors inline-flex items-center gap-1"
                      >
                        View Ledger <ChevronRight size={14} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {selectedTenant && (
        <LedgerModal tenant={selectedTenant} onClose={() => setSelectedTenant(null)} />
      )}
    </div>
  );
}

// ─── LEDGER MODAL (History & Manual Entry) ───

function LedgerModal({ tenant, onClose }: { tenant: Tenant, onClose: () => void }) {
  const { payments } = useTenantPayments(tenant.id);
  const [isAdding, setIsAdding] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const handleManualPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    const formData = new FormData(e.target as HTMLFormElement);
    const amount = parseFloat(formData.get("amount") as string);
    const date = new Date(formData.get("date") as string);
    const month = (formData.get("month") as string);
    const mode = (formData.get("mode") as string);
    
    try {
      await paymentService.recordPayment({
          tenantId: tenant.id,
          tenantName: tenant.name,
          billId: "MANUAL_ENTRY", // Uses stub logic in service
          buildingId: tenant.accommodation.buildingId,
          month: month,
          amount,
          paymentDate: Timestamp.fromDate(date),
          paymentMode: mode as any,
          notes: "Manual ledger entry",
          recordedBy: "Admin"
      });
      setIsAdding(false);
    } catch (error) {
      alert("Error saving manual entry");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl flex flex-col max-h-[90vh]" onClick={e => e.stopPropagation()}>
        
        {/* Modal Header */}
        <div className="p-6 border-b border-gray-100 bg-gray-50 flex justify-between items-center rounded-t-2xl shrink-0">
          <div>
            <h2 className="font-bold text-lg text-navy">{tenant.name}'s Ledger</h2>
            <p className="text-sm text-gray-500">Room {tenant.accommodation.roomNumber}</p>
          </div>
          <button onClick={onClose}><X size={20} className="text-gray-400 hover:text-gray-700"/></button>
        </div>
        
        <div className="p-6 overflow-y-auto flex-1">
          {/* Add Manual Payment Trigger */}
          {!isAdding ? (
            <button 
              onClick={() => setIsAdding(true)} 
              className="w-full bg-navy/5 border border-navy/20 text-navy py-3 rounded-lg font-bold text-sm hover:bg-navy/10 transition-colors flex justify-center items-center gap-2 mb-6"
            >
              <Plus size={16} /> Add Manual Payment Entry
            </button>
          ) : (
            <div className="mb-6 border border-gray-200 rounded-xl p-4 bg-gray-50">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-sm text-gray-700">New Manual Entry</h3>
                <button onClick={() => setIsAdding(false)} className="text-xs font-semibold text-gray-500 hover:text-red-500">Cancel</button>
              </div>
              <form onSubmit={handleManualPayment} className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <input name="amount" type="number" placeholder="₹ Amount" className="p-2 border border-gray-200 rounded text-sm focus:ring-2 focus:ring-gold outline-none" required />
                  <input name="date" type="date" className="p-2 border border-gray-200 rounded text-sm focus:ring-2 focus:ring-gold outline-none" required />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <input name="month" type="month" className="p-2 border border-gray-200 rounded text-sm focus:ring-2 focus:ring-gold outline-none" required />
                  <select name="mode" className="p-2 border border-gray-200 rounded text-sm bg-white focus:ring-2 focus:ring-gold outline-none">
                    <option value="cash">Cash</option>
                    <option value="upi">UPI</option>
                    <option value="bank_transfer">Bank Transfer</option>
                  </select>
                </div>
                <button type="submit" disabled={isSaving} className="w-full bg-green-600 text-white py-2.5 rounded-lg font-bold text-sm hover:bg-green-700 transition-colors flex justify-center items-center">
                  {isSaving ? <Loader2 size={16} className="animate-spin" /> : "Save Entry to Ledger"}
                </button>
              </form>
            </div>
          )}

          {/* History List */}
          <div>
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Transaction History</h3>
            <div className="space-y-3">
              {payments.length === 0 ? (
                <div className="text-center py-8 text-gray-400 text-sm border-2 border-dashed border-gray-100 rounded-xl">
                  No payment history found.
                </div>
              ) : (
                payments.map(p => (
                  <div key={p.id} className="flex justify-between items-center p-4 border border-gray-100 rounded-xl hover:bg-gray-50 transition-colors">
                    <div>
                      <div className="font-bold text-green-700 text-lg">{INR(p.amount)}</div>
                      <div className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                        <Calendar size={12} /> Paid on {p.paymentDate.toDate().toLocaleDateString("en-IN")}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-[10px] font-bold text-gray-500 uppercase tracking-wide">{p.paymentMode}</div>
                      <div className="text-xs font-mono text-gray-400 mt-1">{p.month}</div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}