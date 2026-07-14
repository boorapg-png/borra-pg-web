"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAdmin } from "../../../../hooks/useAdmin";
import { 
  UserPlus, Search, Phone, ShieldCheck, ChefHat, Brush, 
  Briefcase, Clock, IndianRupee, Edit2, Trash2, X, Plus
} from "lucide-react";

// --- TYPES ---
type StaffRole = "Manager" | "Cook" | "Housekeeping" | "Security";

interface Staff {
  id: string;
  name: string;
  role: StaffRole;
  phone: string;
  shift: string;
  salary: number;
  status: "Active" | "On Leave";
}

const ROLES: StaffRole[] = ["Manager", "Cook", "Housekeeping", "Security"];

export default function StaffManagement() {
  const { user, isAdmin, loading } = useAdmin();
  const router = useRouter();

  // --- STATE ---
  const [staff, setStaff] = useState<Staff[]>([
    { id: "s1", name: "Rajesh Kumar", role: "Manager", phone: "+91 98765 00001", shift: "09:00 AM - 06:00 PM", salary: 25000, status: "Active" },
    { id: "s2", name: "Sunita Devi", role: "Cook", phone: "+91 98765 00002", shift: "06:00 AM - 03:00 PM", salary: 18000, status: "Active" },
  ]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStaff, setEditingStaff] = useState<Staff | null>(null);

  useEffect(() => {
    if (!loading && (!user || !isAdmin)) router.push("/admin/login");
  }, [user, isAdmin, loading, router]);

  // --- HANDLERS ---
  const handleDelete = (id: string) => {
    if (confirm("Delete this staff member's record?")) {
      setStaff(staff.filter(s => s.id !== id));
    }
  };

  const handleSave = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const newStaff: Staff = {
      id: editingStaff ? editingStaff.id : Math.random().toString(36).substr(2, 9),
      name: formData.get("name") as string,
      role: formData.get("role") as StaffRole,
      phone: formData.get("phone") as string,
      shift: formData.get("shift") as string,
      salary: parseFloat(formData.get("salary") as string),
      status: formData.get("status") as "Active" | "On Leave",
    };

    if (editingStaff) {
      setStaff(staff.map(s => s.id === editingStaff.id ? newStaff : s));
    } else {
      setStaff([...staff, newStaff]);
    }
    setIsModalOpen(false);
    setEditingStaff(null);
  };

  if (loading) return <div className="p-10 text-center">Loading...</div>;
  if (!user || !isAdmin) return null;

  return (
    <div className="space-y-6 h-full flex flex-col">
      <div className="flex justify-between items-center bg-white p-5 rounded-xl shadow-sm border border-gray-100">
        <div>
          <h2 className="text-xl font-bold text-[#1A2744]">Staff Directory</h2>
        </div>
        <button 
          onClick={() => { setEditingStaff(null); setIsModalOpen(true); }}
          className="bg-[#1A2744] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#1A2744]/90 flex items-center gap-2"
        >
          <Plus size={18} /> Add Staff Member
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 flex-1 overflow-auto">
        <table className="w-full text-sm text-left">
          <thead className="text-gray-500 bg-gray-50 border-b border-gray-100">
            <tr>
              <th className="px-6 py-4 font-medium">Name</th>
              <th className="px-6 py-4 font-medium">Role</th>
              <th className="px-6 py-4 font-medium">Salary</th>
              <th className="px-6 py-4 font-medium">Status</th>
              <th className="px-6 py-4 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {staff.map((s) => (
              <tr key={s.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 font-semibold">{s.name}</td>
                <td className="px-6 py-4 text-gray-600">{s.role}</td>
                <td className="px-6 py-4 text-gray-600">₹{s.salary.toLocaleString('en-IN')}/mo</td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded text-xs ${s.status === "Active" ? "bg-green-50 text-green-700" : "bg-orange-50 text-orange-700"}`}>{s.status}</span>
                </td>
                <td className="px-6 py-4 text-right flex justify-end gap-2">
                  <button onClick={() => { setEditingStaff(s); setIsModalOpen(true); }} className="text-gray-400 hover:text-[#C9973A]"><Edit2 size={16} /></button>
                  <button onClick={() => handleDelete(s.id)} className="text-gray-400 hover:text-red-600"><Trash2 size={16} /></button>
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
              <h3 className="font-bold text-lg">{editingStaff ? "Edit Staff" : "Add Staff"}</h3>
              <button onClick={() => setIsModalOpen(false)}><X size={20} /></button>
            </div>
            <form onSubmit={handleSave} className="space-y-4">
              <input name="name" defaultValue={editingStaff?.name} placeholder="Full Name" className="w-full p-2 border rounded" required />
              <select name="role" defaultValue={editingStaff?.role} className="w-full p-2 border rounded" required>
                {ROLES.map(r => <option key={r} value={r}>{r}</option>)}
              </select>
              <input name="phone" defaultValue={editingStaff?.phone} placeholder="Phone" className="w-full p-2 border rounded" required />
              <input name="shift" defaultValue={editingStaff?.shift} placeholder="Shift Timing" className="w-full p-2 border rounded" required />
              <input type="number" name="salary" defaultValue={editingStaff?.salary} placeholder="Salary" className="w-full p-2 border rounded" required />
              <select name="status" defaultValue={editingStaff?.status} className="w-full p-2 border rounded">
                <option value="Active">Active</option>
                <option value="On Leave">On Leave</option>
              </select>
              <button type="submit" className="w-full bg-[#1A2744] text-white py-2 rounded-lg font-bold">Save Staff</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}