"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAdmin } from "../../../../hooks/useAdmin";
import { 
  Search, 
  Filter, 
  UserPlus, 
  MoreVertical, 
  Phone,
  Mail,
  Eye,
  FileText,
  IndianRupee
} from "lucide-react";

// --- TYPES & INTERFACES ---
type RentStatus = "Paid" | "Pending" | "Overdue";
type TenantStatus = "Active" | "On Notice" | "Past";

interface TenantData {
  id: string;
  name: string;
  phone: string;
  email: string;
  room: string;
  building: string;
  moveInDate: string;
  rentStatus: RentStatus;
  status: TenantStatus;
  balance: number;
}

// --- MOCK DATA ---
const MOCK_TENANTS: TenantData[] = [
  { id: "t1", name: "Rahul Kumar", phone: "+91 98765 43210", email: "rahul.k@email.com", room: "101", building: "Block A", moveInDate: "01 Jan 2026", rentStatus: "Overdue", status: "Active", balance: 5500 },
  { id: "t2", name: "Aman Singh", phone: "+91 98765 43211", email: "aman.s@email.com", room: "102", building: "Block A", moveInDate: "15 Feb 2026", rentStatus: "Paid", status: "Active", balance: 0 },
  { id: "t3", name: "Vikram Gupta", phone: "+91 98765 43212", email: "vikram.g@email.com", room: "102", building: "Block A", moveInDate: "10 Mar 2026", rentStatus: "Pending", status: "Active", balance: 5000 },
  { id: "t4", name: "Sandeep Verma", phone: "+91 98765 43213", email: "sandeep.v@email.com", room: "104", building: "Block A", moveInDate: "20 Aug 2025", rentStatus: "Paid", status: "On Notice", balance: 0 },
  { id: "t5", name: "Amit Singh", phone: "+91 98765 43214", email: "amit.s@email.com", room: "205", building: "Block B", moveInDate: "05 May 2026", rentStatus: "Overdue", status: "Active", balance: 6200 },
  { id: "t6", name: "Deepak Sharma", phone: "+91 98765 43215", email: "deepak.sh@email.com", room: "201", building: "Block A", moveInDate: "12 Apr 2026", rentStatus: "Paid", status: "Active", balance: 0 },
];

export default function TenantsManagement() {
  const { user, isAdmin, loading } = useAdmin();
  const router = useRouter();

  // Search and Filter State
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"All" | TenantStatus>("All");

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

  // Filter Logic
  const filteredTenants = MOCK_TENANTS.filter(tenant => {
    const matchesSearch = 
      tenant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tenant.room.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tenant.phone.includes(searchQuery);
    
    const matchesStatus = statusFilter === "All" || tenant.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6 h-full flex flex-col">
      
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-xl shadow-sm border border-gray-100 shrink-0">
        <div>
          <h2 className="text-xl font-bold text-[#1A2744]">Tenants Directory</h2>
          <p className="text-sm text-gray-500">Manage all current and past residents</p>
        </div>
        
        <button className="flex items-center justify-center gap-2 bg-[#1A2744] text-white px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-[#1A2744]/90 transition-colors">
          <UserPlus size={18} />
          Add New Tenant
        </button>
      </div>

      {/* Toolbar: Search & Filters */}
      <div className="flex flex-col sm:flex-row gap-4 shrink-0">
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search size={18} className="text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search by name, room, or phone..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#C9973A]/50 focus:border-[#C9973A] transition-all shadow-sm"
          />
        </div>
        
        <div className="flex items-center gap-2">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Filter size={18} className="text-gray-400" />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as "All" | TenantStatus)}
              className="pl-10 pr-8 py-2.5 bg-white border border-gray-200 rounded-lg text-sm appearance-none focus:outline-none focus:ring-2 focus:ring-[#C9973A]/50 focus:border-[#C9973A] transition-all shadow-sm cursor-pointer"
            >
              <option value="All">All Statuses</option>
              <option value="Active">Active</option>
              <option value="On Notice">On Notice</option>
              <option value="Past">Past</option>
            </select>
          </div>
        </div>
      </div>

      {/* Tenants Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 flex-1 overflow-hidden flex flex-col">
        <div className="overflow-x-auto flex-1">
          <table className="w-full text-sm text-left whitespace-nowrap">
            <thead className="text-gray-500 bg-gray-50 border-b border-gray-100 sticky top-0 z-10">
              <tr>
                <th className="px-6 py-4 font-medium">Tenant Info</th>
                <th className="px-6 py-4 font-medium">Room</th>
                <th className="px-6 py-4 font-medium">Move-in Date</th>
                <th className="px-6 py-4 font-medium">Rent Status</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredTenants.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                    No tenants found matching your search criteria.
                  </td>
                </tr>
              ) : (
                filteredTenants.map((tenant) => (
                  <tr key={tenant.id} className="hover:bg-gray-50/50 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-[#1A2744]/5 text-[#1A2744] flex items-center justify-center font-bold text-sm border border-gray-100">
                          {tenant.name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">{tenant.name}</p>
                          <div className="flex items-center gap-3 mt-0.5">
                            <span className="text-xs text-gray-500 flex items-center gap-1">
                              <Phone size={12} /> {tenant.phone}
                            </span>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-semibold text-gray-900">{tenant.room}</p>
                      <p className="text-xs text-gray-500">{tenant.building}</p>
                    </td>
                    <td className="px-6 py-4 text-gray-600">
                      {tenant.moveInDate}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-1 items-start">
                        <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider ${
                          tenant.rentStatus === "Paid" ? "bg-green-50 text-green-700 border border-green-100" : 
                          tenant.rentStatus === "Overdue" ? "bg-red-50 text-red-700 border border-red-100" : 
                          "bg-yellow-50 text-yellow-700 border border-yellow-100"
                        }`}>
                          {tenant.rentStatus}
                        </span>
                        {tenant.balance > 0 && (
                          <span className="text-xs font-semibold text-red-600">
                            ₹{tenant.balance.toLocaleString('en-IN')} due
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                        tenant.status === "Active" ? "bg-blue-50 text-blue-700" : 
                        tenant.status === "On Notice" ? "bg-orange-50 text-orange-700" : 
                        "bg-gray-100 text-gray-700"
                      }`}>
                        {tenant.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button className="p-1.5 text-gray-400 hover:text-[#C9973A] hover:bg-[#C9973A]/10 rounded-md transition-colors" title="View Profile">
                          <Eye size={18} />
                        </button>
                        <button className="p-1.5 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-md transition-colors" title="Record Payment">
                          <IndianRupee size={18} />
                        </button>
                        <button className="p-1.5 text-gray-400 hover:text-[#1A2744] hover:bg-gray-100 rounded-md transition-colors" title="More Options">
                          <MoreVertical size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        
        {/* Simple Pagination Footer */}
        <div className="p-4 border-t border-gray-100 bg-white flex items-center justify-between text-sm text-gray-500">
          <p>Showing <span className="font-medium text-gray-900">{filteredTenants.length}</span> tenants</p>
        </div>
      </div>
    </div>
  );
}