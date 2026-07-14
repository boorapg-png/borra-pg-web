"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAdmin } from "../../../../hooks/useAdmin";
import { 
  Search, Filter, UserPlus, MoreVertical, Edit2, Trash2, X, Save,
  Phone, Mail, MapPin, User, FileText, IndianRupee, Bed
} from "lucide-react";

// --- TYPES ---
interface Tenant {
  id: string;
  name: string;
  phone: string;
  aadhaarNumber: string; // Placeholder for secure storage
  occupation: string;
  address: string;
  room: string;
  moveInDate: string;
  status: "Active" | "On Notice" | "Past";
}

export default function TenantsManagement() {
  const { user, isAdmin, loading } = useAdmin();
  const router = useRouter();

  // --- STATE ---
  const [tenants, setTenants] = useState<Tenant[]>([
    { id: "1", name: "Rahul Kumar", phone: "+91 98765 43210", aadhaarNumber: "XXXX-XXXX-XXXX", occupation: "Software Engineer", address: "Delhi, India", room: "101", moveInDate: "2026-01-01", status: "Active" },
  ]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTenant, setEditingTenant] = useState<Tenant | null>(null);

  useEffect(() => {
    if (!loading && (!user || !isAdmin)) router.push("/admin/login");
  }, [user, isAdmin, loading, router]);

  // --- HANDLERS ---
  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this tenant? This action cannot be undone.")) {
      setTenants(tenants.filter(t => t.id !== id));
    }
  };

  const handleSave = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const newTenant: Tenant = {
      id: editingTenant ? editingTenant.id : Math.random().toString(36).substr(2, 9),
      name: formData.get("name") as string,
      phone: formData.get("phone") as string,
      aadhaarNumber: formData.get("aadhaar") as string, // [Aadhaar Redacted] in practice
      occupation: formData.get("occupation") as string,
      address: formData.get("address") as string,
      room: formData.get("room") as string,
      moveInDate: formData.get("moveInDate") as string,
      status: formData.get("status") as any,
    };

    if (editingTenant) {
      setTenants(tenants.map(t => t.id === editingTenant.id ? newTenant : t));
    } else {
      setTenants([...tenants, newTenant]);
    }
    setIsModalOpen(false);
    setEditingTenant(null);
  };

  if (loading) return <div className="p-10 text-center">Loading...</div>;
  if (!user || !isAdmin) return null;

  return (
    <div className="space-y-6 h-full flex flex-col">
      <div className="flex justify-between items-center bg-white p-5 rounded-xl shadow-sm border border-gray-100">
        <div>
          <h2 className="text-xl font-bold text-[#1A2744]">Tenants Directory</h2>
        </div>
        <button 
          onClick={() => { setEditingTenant(null); setIsModalOpen(true); }}
          className="bg-[#1A2744] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#1A2744]/90 flex items-center gap-2"
        >
          <UserPlus size={18} /> Add Tenant
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 flex-1 overflow-auto">
        <table className="w-full text-sm text-left">
          <thead className="text-gray-500 bg-gray-50 border-b border-gray-100">
            <tr>
              <th className="px-6 py-4 font-medium">Tenant</th>
              <th className="px-6 py-4 font-medium">Room</th>
              <th className="px-6 py-4 font-medium">Status</th>
              <th className="px-6 py-4 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {tenants.map((tenant) => (
              <tr key={tenant.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 font-medium">{tenant.name}</td>
                <td className="px-6 py-4 text-gray-600">{tenant.room}</td>
                <td className="px-6 py-4">
                  <span className="px-2 py-1 bg-blue-50 text-blue-700 rounded text-xs">{tenant.status}</span>
                </td>
                <td className="px-6 py-4 text-right flex justify-end gap-2">
                  <button onClick={() => { setEditingTenant(tenant); setIsModalOpen(true); }} className="text-gray-400 hover:text-[#C9973A]"><Edit2 size={16} /></button>
                  <button onClick={() => handleDelete(tenant.id)} className="text-gray-400 hover:text-red-600"><Trash2 size={16} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl w-full max-w-lg p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-lg">{editingTenant ? "Edit Tenant" : "New Tenant"}</h3>
              <button onClick={() => setIsModalOpen(false)}><X size={20} /></button>
            </div>
            <form onSubmit={handleSave} className="space-y-4">
              <input name="name" defaultValue={editingTenant?.name} placeholder="Full Name" className="w-full p-2 border rounded" required />
              <input name="phone" defaultValue={editingTenant?.phone} placeholder="Phone" className="w-full p-2 border rounded" required />
              <input name="aadhaar" defaultValue={editingTenant?.aadhaarNumber} placeholder="Aadhaar Number (e.g., [Aadhaar Redacted])" className="w-full p-2 border rounded" required />
              <input name="occupation" defaultValue={editingTenant?.occupation} placeholder="Occupation" className="w-full p-2 border rounded" />
              <input name="address" defaultValue={editingTenant?.address} placeholder="Permanent Address" className="w-full p-2 border rounded" />
              <input name="room" defaultValue={editingTenant?.room} placeholder="Allotted Room" className="w-full p-2 border rounded" />
              <input type="date" name="moveInDate" defaultValue={editingTenant?.moveInDate} className="w-full p-2 border rounded" />
              <select name="status" defaultValue={editingTenant?.status} className="w-full p-2 border rounded">
                <option value="Active">Active</option>
                <option value="On Notice">On Notice</option>
                <option value="Past">Past</option>
              </select>
              <button type="submit" className="w-full bg-[#1A2744] text-white py-2 rounded-lg font-bold">Save Details</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}