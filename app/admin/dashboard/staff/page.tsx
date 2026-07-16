"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAdmin } from "../../../../hooks/useAdmin";
import { Edit2, Trash2, X, Plus, Loader2 } from "lucide-react";
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, serverTimestamp, Timestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Staff } from "@/types";

const ROLES: Staff["role"][] = ["Manager", "Cook", "Cleaner", "Security", "Maintenance", "Other"];

// Helper to safely convert Firestore Timestamp to YYYY-MM-DD for the HTML date input
const toDateInput = (timestamp?: Timestamp | any) => {
  if (!timestamp) return "";
  if (timestamp.toDate) return timestamp.toDate().toISOString().split('T')[0];
  return ""; 
};

export default function StaffManagement() {
  const { user, isAdmin, loading: authLoading } = useAdmin();
  const router = useRouter();

  // --- STATE ---
  const [staffList, setStaffList] = useState<Staff[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStaff, setEditingStaff] = useState<Staff | null>(null);
  
  // Loading states
  const [dataLoading, setDataLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // --- AUTH CHECK ---
  useEffect(() => {
    if (!authLoading && (!user || !isAdmin)) router.push("/admin/login");
  }, [user, isAdmin, authLoading, router]);

  // --- FETCH DATA ---
  useEffect(() => {
    const fetchStaff = async () => {
      if (user && isAdmin) {
        try {
          const snap = await getDocs(collection(db, "staff"));
          const fetchedStaff = snap.docs.map(d => ({
            id: d.id,
            ...d.data()
          })) as Staff[];
          setStaffList(fetchedStaff);
        } catch (error) {
          console.error("Error fetching staff:", error);
        } finally {
          setDataLoading(false);
        }
      }
    };
    fetchStaff();
  }, [user, isAdmin]);

  // --- HANDLERS ---
  const handleDelete = async (id: string) => {
    if (confirm("Delete this staff member's record permanently?")) {
      try {
        await deleteDoc(doc(db, "staff", id));
        setStaffList(staffList.filter(s => s.id !== id));
      } catch (error) {
        console.error("Error deleting staff:", error);
        alert("Failed to delete staff member.");
      }
    }
  };

  const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSaving(true);
    
    const formData = new FormData(e.currentTarget);
    const dateStr = formData.get("joiningDate") as string;
    
    const staffPayload = {
      name: formData.get("name") as string,
      role: formData.get("role") as Staff["role"],
      phone: formData.get("phone") as string,
      shift: formData.get("shift") as string,
      salary: parseFloat(formData.get("salary") as string) || 0,
      status: formData.get("status") as Staff["status"],
      joiningDate: dateStr ? Timestamp.fromDate(new Date(dateStr)) : Timestamp.now(),
      notes: formData.get("notes") as string,
      updatedAt: serverTimestamp(),
    };

    try {
      if (editingStaff) {
        // Update existing
        await updateDoc(doc(db, "staff", editingStaff.id), staffPayload);
        setStaffList(staffList.map(s => 
          s.id === editingStaff.id ? { ...s, ...staffPayload, id: s.id } as Staff : s
        ));
      } else {
        // Create new
        const docRef = await addDoc(collection(db, "staff"), {
          ...staffPayload,
          createdAt: serverTimestamp()
        });
        setStaffList([...staffList, { ...staffPayload, id: docRef.id } as Staff]);
      }
      
      setIsModalOpen(false);
      setEditingStaff(null);
    } catch (error) {
      console.error("Error saving staff:", error);
      alert("Failed to save staff details.");
    } finally {
      setIsSaving(false);
    }
  };

  if (authLoading) return <div className="p-10 text-center text-navy font-semibold animate-pulse">Authenticating...</div>;
  if (!user || !isAdmin) return null;

  return (
    <div className="space-y-6 h-full flex flex-col">
      <div className="flex justify-between items-center bg-white p-5 rounded-xl shadow-sm border border-gray-100">
        <div>
          <h2 className="text-xl font-bold text-[#1A2744]">Staff Directory</h2>
        </div>
        <button 
          onClick={() => { setEditingStaff(null); setIsModalOpen(true); }}
          className="bg-[#1A2744] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#1A2744]/90 flex items-center gap-2 transition-colors"
        >
          <Plus size={18} /> Add Staff Member
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 flex-1 overflow-auto">
        {dataLoading ? (
          <div className="flex justify-center items-center h-48 text-navy">
            <Loader2 className="animate-spin" size={32} />
          </div>
        ) : (
          <table className="w-full text-sm text-left">
            <thead className="text-gray-500 bg-gray-50 border-b border-gray-100 sticky top-0">
              <tr>
                <th className="px-6 py-4 font-medium">Name</th>
                <th className="px-6 py-4 font-medium">Role</th>
                <th className="px-6 py-4 font-medium">Salary</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {staffList.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                    No staff members found. Add one to get started.
                  </td>
                </tr>
              ) : (
                staffList.map((s) => (
                  <tr key={s.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 font-semibold text-navy">
                      <div>{s.name}</div>
                      <div className="text-xs text-gray-500 font-normal">{s.phone}</div>
                    </td>
                    <td className="px-6 py-4 text-gray-700">
                      <div>{s.role}</div>
                      <div className="text-xs text-gray-500">{s.shift}</div>
                    </td>
                    <td className="px-6 py-4 font-bold text-green-700">₹{s.salary.toLocaleString('en-IN')}/mo</td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-md text-xs font-bold uppercase tracking-wider ${
                        s.status === "active" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600"
                      }`}>{s.status}</span>
                    </td>
                    <td className="px-6 py-4 text-right flex justify-end gap-3">
                      <button onClick={() => { setEditingStaff(s); setIsModalOpen(true); }} className="text-gray-400 hover:text-navy transition-colors p-1">
                        <Edit2 size={16} />
                      </button>
                      <button onClick={() => handleDelete(s.id)} className="text-gray-400 hover:text-red-600 transition-colors p-1">
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden">
            <div className="flex justify-between items-center p-5 border-b border-gray-100">
              <h3 className="font-bold text-lg text-navy">{editingStaff ? "Edit Staff" : "Add Staff"}</h3>
              <button onClick={() => setIsModalOpen(false)} disabled={isSaving} className="text-gray-400 hover:text-gray-700 p-1">
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleSave} className="p-5 space-y-4">
              <div>
                <label className="text-xs font-semibold text-gray-600 uppercase mb-1 block">Full Name</label>
                <input name="name" defaultValue={editingStaff?.name} placeholder="e.g. Ramesh Singh" className="w-full p-2.5 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-gold focus:outline-none" required disabled={isSaving} />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-gray-600 uppercase mb-1 block">Role</label>
                  <select name="role" defaultValue={editingStaff?.role || "Cleaner"} className="w-full p-2.5 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-gold focus:outline-none bg-white" required disabled={isSaving}>
                    {ROLES.map(r => <option key={r} value={r}>{r}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-600 uppercase mb-1 block">Phone Number</label>
                  <input name="phone" defaultValue={editingStaff?.phone} placeholder="+91 XXXXX XXXXX" className="w-full p-2.5 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-gold focus:outline-none" required disabled={isSaving} />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-gray-600 uppercase mb-1 block">Shift Timing</label>
                  <input name="shift" defaultValue={editingStaff?.shift} placeholder="e.g. 9 AM - 6 PM" className="w-full p-2.5 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-gold focus:outline-none" disabled={isSaving} />
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-600 uppercase mb-1 block">Monthly Salary (₹)</label>
                  <input type="number" name="salary" defaultValue={editingStaff?.salary} placeholder="15000" className="w-full p-2.5 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-gold focus:outline-none" required disabled={isSaving} />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-gray-600 uppercase mb-1 block">Joining Date</label>
                  <input type="date" name="joiningDate" defaultValue={toDateInput(editingStaff?.joiningDate)} className="w-full p-2.5 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-gold focus:outline-none" required disabled={isSaving} />
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-600 uppercase mb-1 block">Status</label>
                  <select name="status" defaultValue={editingStaff?.status || "active"} className="w-full p-2.5 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-gold focus:outline-none bg-white" disabled={isSaving}>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-gray-600 uppercase mb-1 block">Notes (Optional)</label>
                <input name="notes" defaultValue={editingStaff?.notes} placeholder="Any specific details..." className="w-full p-2.5 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-gold focus:outline-none" disabled={isSaving} />
              </div>

              <div className="pt-2">
                <button type="submit" disabled={isSaving} className="w-full bg-[#1A2744] text-white py-3 rounded-lg font-bold hover:bg-[#1A2744]/90 transition-colors flex justify-center items-center gap-2 disabled:opacity-70">
                  {isSaving ? <><Loader2 size={18} className="animate-spin" /> Saving...</> : "Save Staff"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}