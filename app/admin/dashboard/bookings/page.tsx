"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAdmin } from "../../../../hooks/useAdmin";
import { Edit2, Trash2, X, Plus } from "lucide-react";

// --- TYPES ---
type BookingStatus = "Confirmed" | "Pending" | "Cancelled";

interface Booking {
  id: string;
  name: string;
  phone: string;
  expectedCheckIn: string;
  roomPreference: string;
  advancePaid: number;
  status: BookingStatus;
  notes: string;
}

export default function BookingsManagement() {
  const { user, isAdmin, loading } = useAdmin();
  const router = useRouter();

  // --- STATE ---
  const [bookings, setBookings] = useState<Booking[]>([
    { id: "b1", name: "Suresh Kumar", phone: "+91 98765 11111", expectedCheckIn: "2026-07-18", roomPreference: "102 (3-Seater)", advancePaid: 2000, status: "Confirmed", notes: "Joining next week." },
    { id: "b2", name: "Karan Singh", phone: "+91 98765 22222", expectedCheckIn: "2026-07-25", roomPreference: "Any 2-Seater", advancePaid: 0, status: "Pending", notes: "Visiting tomorrow." },
  ]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBooking, setEditingBooking] = useState<Booking | null>(null);

  useEffect(() => {
    if (!loading && (!user || !isAdmin)) router.push("/admin/login");
  }, [user, isAdmin, loading, router]);

  // --- HANDLERS ---
  const handleDelete = (id: string) => {
    if (confirm("Delete this booking record?")) {
      setBookings(bookings.filter(b => b.id !== id));
    }
  };

  const handleSave = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const newBooking: Booking = {
      id: editingBooking ? editingBooking.id : Math.random().toString(36).substring(2, 11),
      name: formData.get("name") as string,
      phone: formData.get("phone") as string,
      expectedCheckIn: formData.get("expectedCheckIn") as string,
      roomPreference: formData.get("roomPreference") as string,
      advancePaid: parseFloat(formData.get("advancePaid") as string),
      status: formData.get("status") as BookingStatus,
      notes: formData.get("notes") as string,
    };

    if (editingBooking) {
      setBookings(bookings.map(b => b.id === editingBooking.id ? newBooking : b));
    } else {
      setBookings([...bookings, newBooking]);
    }
    setIsModalOpen(false);
    setEditingBooking(null);
  };

  if (loading) return <div className="p-10 text-center">Loading...</div>;
  if (!user || !isAdmin) return null;

  return (
    <div className="space-y-6 h-full flex flex-col">
      <div className="flex justify-between items-center bg-white p-5 rounded-xl shadow-sm border border-gray-100">
        <div>
          <h2 className="text-xl font-bold text-[#1A2744]">Advance Bookings</h2>
        </div>
        <button 
          onClick={() => { setEditingBooking(null); setIsModalOpen(true); }}
          className="bg-[#1A2744] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#1A2744]/90 flex items-center gap-2"
        >
          <Plus size={18} /> New Booking
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 flex-1 overflow-auto">
        <table className="w-full text-sm text-left">
          <thead className="text-gray-500 bg-gray-50 border-b border-gray-100">
            <tr>
              <th className="px-6 py-4 font-medium">Guest Info</th>
              <th className="px-6 py-4 font-medium">Check-in</th>
              <th className="px-6 py-4 font-medium">Advance</th>
              <th className="px-6 py-4 font-medium">Status</th>
              <th className="px-6 py-4 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {bookings.map((booking) => (
              <tr key={booking.id} className="hover:bg-gray-50">
                <td className="px-6 py-4">
                  <p className="font-semibold">{booking.name}</p>
                  <p className="text-xs text-gray-500">{booking.phone}</p>
                </td>
                <td className="px-6 py-4">{booking.expectedCheckIn}</td>
                <td className="px-6 py-4 font-semibold text-green-600">₹{booking.advancePaid.toLocaleString('en-IN')}</td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded text-xs ${
                    booking.status === "Confirmed" ? "bg-green-50 text-green-700" : "bg-yellow-50 text-yellow-700"
                  }`}>{booking.status}</span>
                </td>
                <td className="px-6 py-4 text-right flex justify-end gap-2">
                  <button onClick={() => { setEditingBooking(booking); setIsModalOpen(true); }} className="text-gray-400 hover:text-[#C9973A]"><Edit2 size={16} /></button>
                  <button onClick={() => handleDelete(booking.id)} className="text-gray-400 hover:text-red-600"><Trash2 size={16} /></button>
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
              <h3 className="font-bold text-lg">{editingBooking ? "Edit Booking" : "New Booking"}</h3>
              <button onClick={() => setIsModalOpen(false)}><X size={20} /></button>
            </div>
            <form onSubmit={handleSave} className="space-y-4">
              <input name="name" defaultValue={editingBooking?.name} placeholder="Guest Name" className="w-full p-2 border rounded" required />
              <input name="phone" defaultValue={editingBooking?.phone} placeholder="Phone" className="w-full p-2 border rounded" required />
              <input type="date" name="expectedCheckIn" defaultValue={editingBooking?.expectedCheckIn} className="w-full p-2 border rounded" required />
              <input name="roomPreference" defaultValue={editingBooking?.roomPreference} placeholder="Room Pref." className="w-full p-2 border rounded" />
              <input type="number" name="advancePaid" defaultValue={editingBooking?.advancePaid} placeholder="Advance Amount" className="w-full p-2 border rounded" />
              <select name="status" defaultValue={editingBooking?.status} className="w-full p-2 border rounded">
                <option value="Confirmed">Confirmed</option>
                <option value="Pending">Pending</option>
                <option value="Cancelled">Cancelled</option>
              </select>
              <textarea name="notes" defaultValue={editingBooking?.notes} placeholder="Notes" className="w-full p-2 border rounded" />
              <button type="submit" className="w-full bg-[#1A2744] text-white py-2 rounded-lg font-bold">Save Booking</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}