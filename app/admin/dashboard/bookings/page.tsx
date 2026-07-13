"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAdmin } from "../../../../hooks/useAdmin";
import { 
  CalendarDays, 
  Search, 
  Filter, 
  UserPlus, 
  Phone,
  CheckCircle2,
  XCircle,
  Clock
} from "lucide-react";

// --- TYPES & INTERFACES ---
type BookingStatus = "Confirmed" | "Pending" | "Cancelled";

interface BookingData {
  id: string;
  name: string;
  phone: string;
  expectedCheckIn: string;
  roomPreference: string;
  advancePaid: number;
  status: BookingStatus;
  notes: string;
}

// --- MOCK DATA ---
const MOCK_BOOKINGS: BookingData[] = [
  { id: "b1", name: "Suresh Kumar", phone: "+91 98765 11111", expectedCheckIn: "18 Jul 2026", roomPreference: "102 (3-Seater)", advancePaid: 2000, status: "Confirmed", notes: "Joining next week." },
  { id: "b2", name: "Karan Singh", phone: "+91 98765 22222", expectedCheckIn: "25 Jul 2026", roomPreference: "Any 2-Seater", advancePaid: 0, status: "Pending", notes: "Visiting tomorrow to finalize." },
  { id: "b3", name: "Pooja Sharma", phone: "+91 98765 33333", expectedCheckIn: "01 Aug 2026", roomPreference: "205 (Block B)", advancePaid: 5000, status: "Confirmed", notes: "Full advance paid." },
  { id: "b4", name: "Rahul Verma", phone: "+91 98765 44444", expectedCheckIn: "10 Jul 2026", roomPreference: "Ground Floor", advancePaid: 1000, status: "Cancelled", notes: "Plans changed, advance refunded." },
];

export default function BookingsManagement() {
  const { user, isAdmin, loading } = useAdmin();
  const router = useRouter();

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"All" | BookingStatus>("All");

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
  const filteredBookings = MOCK_BOOKINGS.filter(booking => {
    const matchesSearch = 
      booking.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      booking.phone.includes(searchQuery);
    
    const matchesStatus = statusFilter === "All" || booking.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6 h-full flex flex-col">
      
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-xl shadow-sm border border-gray-100 shrink-0">
        <div>
          <h2 className="text-xl font-bold text-[#1A2744]">Advance Bookings</h2>
          <p className="text-sm text-gray-500">Manage upcoming check-ins and reservations</p>
        </div>
        
        <button className="flex items-center justify-center gap-2 bg-[#1A2744] text-white px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-[#1A2744]/90 transition-colors">
          <CalendarDays size={18} />
          New Booking
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
            placeholder="Search by name or phone..."
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
              onChange={(e) => setStatusFilter(e.target.value as "All" | BookingStatus)}
              className="pl-10 pr-8 py-2.5 bg-white border border-gray-200 rounded-lg text-sm appearance-none focus:outline-none focus:ring-2 focus:ring-[#C9973A]/50 focus:border-[#C9973A] transition-all shadow-sm cursor-pointer"
            >
              <option value="All">All Statuses</option>
              <option value="Confirmed">Confirmed</option>
              <option value="Pending">Pending</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>
        </div>
      </div>

      {/* Bookings Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 flex-1 overflow-hidden flex flex-col">
        <div className="overflow-x-auto flex-1">
          <table className="w-full text-sm text-left whitespace-nowrap">
            <thead className="text-gray-500 bg-gray-50 border-b border-gray-100 sticky top-0 z-10">
              <tr>
                <th className="px-6 py-4 font-medium">Guest Info</th>
                <th className="px-6 py-4 font-medium">Expected Check-in</th>
                <th className="px-6 py-4 font-medium">Room Pref.</th>
                <th className="px-6 py-4 font-medium">Advance Paid</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredBookings.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                    No bookings found matching your search.
                  </td>
                </tr>
              ) : (
                filteredBookings.map((booking) => (
                  <tr key={booking.id} className="hover:bg-gray-50/50 transition-colors group">
                    <td className="px-6 py-4">
                      <p className="font-semibold text-gray-900">{booking.name}</p>
                      <div className="flex items-center gap-1 mt-0.5 text-xs text-gray-500">
                        <Phone size={12} /> {booking.phone}
                      </div>
                    </td>
                    <td className="px-6 py-4 font-medium text-[#1A2744]">
                      {booking.expectedCheckIn}
                    </td>
                    <td className="px-6 py-4 text-gray-600">
                      {booking.roomPreference}
                    </td>
                    <td className="px-6 py-4">
                      {booking.advancePaid > 0 ? (
                        <span className="font-semibold text-green-600">₹{booking.advancePaid.toLocaleString('en-IN')}</span>
                      ) : (
                        <span className="text-gray-400">₹0</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium flex items-center gap-1.5 w-fit ${
                        booking.status === "Confirmed" ? "bg-green-50 text-green-700 border border-green-100" : 
                        booking.status === "Pending" ? "bg-yellow-50 text-yellow-700 border border-yellow-100" : 
                        "bg-red-50 text-red-700 border border-red-100"
                      }`}>
                        {booking.status === "Confirmed" && <CheckCircle2 size={14} />}
                        {booking.status === "Pending" && <Clock size={14} />}
                        {booking.status === "Cancelled" && <XCircle size={14} />}
                        {booking.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      {booking.status !== "Cancelled" && (
                        <button className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-50 hover:bg-[#1A2744] hover:text-white text-gray-700 text-xs font-medium rounded border border-gray-200 transition-colors ml-auto">
                          <UserPlus size={14} />
                          Move In
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}