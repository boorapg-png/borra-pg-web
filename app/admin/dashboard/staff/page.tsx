"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAdmin } from "../../../../hooks/useAdmin";
import { 
  UserPlus, 
  Search, 
  Phone, 
  ShieldCheck, 
  ChefHat, 
  Broom, 
  Briefcase,
  Clock,
  IndianRupee
} from "lucide-react";

// --- TYPES & INTERFACES ---
type StaffRole = "Manager" | "Cook" | "Housekeeping" | "Security";

interface StaffData {
  id: string;
  name: string;
  role: StaffRole;
  phone: string;
  shift: string;
  salary: number;
  status: "Active" | "On Leave";
}

// --- MOCK DATA ---
const MOCK_STAFF: StaffData[] = [
  { id: "s1", name: "Rajesh Kumar", role: "Manager", phone: "+91 98765 00001", shift: "09:00 AM - 06:00 PM", salary: 25000, status: "Active" },
  { id: "s2", name: "Sunita Devi", role: "Cook", phone: "+91 98765 00002", shift: "06:00 AM - 03:00 PM", salary: 18000, status: "Active" },
  { id: "s3", name: "Ramesh Bhai", role: "Housekeeping", phone: "+91 98765 00003", shift: "08:00 AM - 05:00 PM", salary: 12000, status: "Active" },
  { id: "s4", name: "Bahadur Singh", role: "Security", phone: "+91 98765 00004", shift: "08:00 PM - 08:00 AM", salary: 15000, status: "Active" },
  { id: "s5", name: "Anita", role: "Housekeeping", phone: "+91 98765 00005", shift: "08:00 AM - 05:00 PM", salary: 12000, status: "On Leave" },
];

// Helper to render the correct icon based on role
const getRoleIcon = (role: StaffRole) => {
  switch (role) {
    case "Manager": return <Briefcase size={20} className="text-blue-600" />;
    case "Cook": return <ChefHat size={20} className="text-orange-600" />;
    case "Housekeeping": return <Broom size={20} className="text-teal-600" />;
    case "Security": return <ShieldCheck size={20} className="text-red-600" />;
    default: return <Briefcase size={20} className="text-gray-600" />;
  }
};

export default function StaffManagement() {
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

  const filteredStaff = MOCK_STAFF.filter(staff => 
    staff.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    staff.role.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 h-full flex flex-col">
      
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-xl shadow-sm border border-gray-100">
        <div>
          <h2 className="text-xl font-bold text-[#1A2744]">Staff Directory</h2>
          <p className="text-sm text-gray-500">Manage your team, shifts, and payroll</p>
        </div>
        
        <button className="flex items-center justify-center gap-2 bg-[#1A2744] text-white px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-[#1A2744]/90 transition-colors">
          <UserPlus size={18} />
          Add Staff Member
        </button>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search size={18} className="text-gray-400" />
        </div>
        <input
          type="text"
          placeholder="Search by name or role..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full max-w-md pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#C9973A]/50 focus:border-[#C9973A] transition-all shadow-sm"
        />
      </div>

      {/* Staff Profile Cards Grid */}
      {filteredStaff.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
          <p className="text-gray-500">No staff members found matching your search.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredStaff.map((staff) => (
            <div key={staff.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
              {/* Card Header */}
              <div className="p-5 border-b border-gray-50 flex justify-between items-start">
                <div className="flex gap-3">
                  <div className="w-12 h-12 rounded-full bg-gray-50 flex items-center justify-center border border-gray-100 shrink-0">
                    {getRoleIcon(staff.role)}
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900">{staff.name}</h3>
                    <p className="text-xs font-medium text-gray-500">{staff.role}</p>
                  </div>
                </div>
                <span className={`px-2 py-1 text-[10px] font-bold uppercase tracking-wider rounded ${
                  staff.status === "Active" ? "bg-green-50 text-green-700" : "bg-orange-50 text-orange-700"
                }`}>
                  {staff.status}
                </span>
              </div>

              {/* Card Body */}
              <div className="p-5 space-y-4">
                <div className="flex items-center gap-3 text-sm text-gray-600">
                  <Phone size={16} className="text-gray-400" />
                  <span>{staff.phone}</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-600">
                  <Clock size={16} className="text-gray-400" />
                  <span>{staff.shift}</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-600">
                  <IndianRupee size={16} className="text-gray-400" />
                  <span className="font-medium text-gray-900">₹{staff.salary.toLocaleString('en-IN')}/mo</span>
                </div>
              </div>

              {/* Card Footer */}
              <div className="bg-gray-50 p-4 border-t border-gray-100 flex gap-2">
                <button className="flex-1 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg text-xs font-medium hover:bg-gray-100 transition-colors">
                  Edit Profile
                </button>
                <button className="flex-1 py-2 bg-white border border-gray-200 text-[#C9973A] rounded-lg text-xs font-medium hover:bg-[#C9973A]/10 transition-colors">
                  Pay Salary
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}