"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAdmin } from "../../../../hooks/useAdmin";
import { Edit2, Trash2, X, Plus, Loader2 } from "lucide-react";
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";

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
  const { user, isAdmin, loading: authLoading } = useAdmin();
  const router = useRouter();

  // --- STATE ---
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBooking, setEditingBooking] = useState<Booking | null>(null);
  
  // Loading states
  const [dataLoading, setDataLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // --- AUTH CHECK ---
  useEffect(() => {
    if (!authLoading && (!user || !isAdmin)) router.push("/admin/login");
  }, [user, isAdmin, authLoading, router]);

  // --- FETCH DATA ---
  useEffect(() => {
    const fetchBookings = async () => {
      if (user && isAdmin) {
        try {
          const snap = await getDocs(collection(db, "bookings"));
          const fetchedBookings = snap.docs.map(d => ({
            id: d.id,
            ...d.data()
          })) as Booking[];
          setBookings(fetchedBookings);
        } catch (error) {
          console.error("Error fetching bookings:", error);
        } finally {
          setDataLoading(false);
        }
      }
    };
    fetchBookings();
  }, [user, isAdmin]);

  // --- HANDLERS ---
  const handleDelete = async (id: string) => {
    if (confirm("Delete this booking record permanently?")) {
      try {
        await deleteDoc(doc(db, "bookings", id));
        // Remove from local UI state
        setBookings(bookings.filter(b => b.id !== id));
      } catch (error) {
        console.error("Error deleting booking:", error);
        alert("Failed to delete booking.");
      }
    }
  };

  const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSaving(true);
    
    const formData = new FormData(e.currentTarget);
    const bookingPayload = {
      name: formData.get("name") as string,
      phone: formData.get("phone") as string,
      expectedCheckIn: formData.get("expectedCheckIn") as string,
      roomPreference: formData.get("roomPreference") as string,
      advancePaid: parseFloat(formData.get("advancePaid") as string) || 0,
      status: formData.get("status") as BookingStatus,
      notes: formData.get("notes") as string,
      updatedAt: serverTimestamp(),
    };

    try {
      if (editingBooking) {
        // Update existing record in Firebase
        await updateDoc(doc(db, "bookings", editingBooking.id), bookingPayload);
        // Update local UI state
        setBookings(bookings.map(b => 
          b.id === editingBooking.id ? { ...b, ...bookingPayload, id: b.id } : b
        ));
      } else {
        // Create new record in Firebase
        const docRef = await addDoc(collection(db, "bookings"), {
          ...bookingPayload,
          createdAt: serverTimestamp()
        });
        // Add to local UI state
        setBookings([...bookings, { ...bookingPayload, id: docRef.id }]);
      }
      
      setIsModalOpen(false);
      setEditingBooking(null);
    } catch (error) {
      console.error("Error saving booking:", error);
      alert("Failed to save booking details.");
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
          <h2 className="text-xl font-bold text-[#1A2744]">Advance Bookings</h2>
        </div>
        <button 
          onClick={() => { setEditingBooking(null); setIsModalOpen(true); }}
          className="bg-[#1A2744] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#1A2744]/90 flex items-center gap-2 transition-colors"
        >
          <Plus size={18} /> New Booking
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
                <th className="px-6 py-4 font-medium">Guest Info</th>
                <th className="px-6 py-4 font-medium">Check-in</th>
                <th className="px-6 py-4 font-medium">Advance</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {bookings.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                    No active advance bookings found.
                  </td>
                </tr>
              ) : (
                bookings.map((booking) => (
                  <tr key={booking.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <p className="font-semibold text-navy">{booking.name}</p>
                      <p className="text-xs text-gray-500">{booking.phone}</p>
                    </td>
                    <td className="px-6 py-4 font-medium text-gray-700">{booking.expectedCheckIn}</td>
                    <td className="px-6 py-4 font-bold text-green-600">₹{booking.advancePaid.toLocaleString('en-IN')}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-md text-xs font-bold uppercase tracking-wider ${
                        booking.status === "Confirmed" ? "bg-green-100 text-green-700" : 
                        booking.status === "Pending" ? "bg-amber-100 text-amber-700" : 
                        "bg-red-100 text-red-700"
                      }`}>{booking.status}</span>
                    </td>
                    <td className="px-6 py-4 text-right flex justify-end gap-3">
                      <button 
                        onClick={() => { setEditingBooking(booking); setIsModalOpen(true); }} 
                        className="text-gray-400 hover:text-navy transition-colors p-1"
                        title="Edit Booking"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button 
                        onClick={() => handleDelete(booking.id)} 
                        className="text-gray-400 hover:text-red-600 transition-colors p-1"
                        title="Delete Booking"
                      >
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
              <h3 className="font-bold text-lg text-navy">{editingBooking ? "Edit Booking Details" : "Register New Booking"}</h3>
              <button onClick={() => setIsModalOpen(false)} disabled={isSaving} className="text-gray-400 hover:text-gray-700 p-1">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleSave} className="p-5 space-y-4">
              <div>
                <label className="text-xs font-semibold text-gray-600 uppercase mb-1 block">Guest Name</label>
                <input name="name" defaultValue={editingBooking?.name} placeholder="Full Name" className="w-full p-2.5 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-gold focus:outline-none" required disabled={isSaving} />
              </div>
              
              <div>
                <label className="text-xs font-semibold text-gray-600 uppercase mb-1 block">Phone Number</label>
                <input name="phone" defaultValue={editingBooking?.phone} placeholder="+91 XXXXX XXXXX" className="w-full p-2.5 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-gold focus:outline-none" required disabled={isSaving} />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-gray-600 uppercase mb-1 block">Check-in Date</label>
                  <input type="date" name="expectedCheckIn" defaultValue={editingBooking?.expectedCheckIn} className="w-full p-2.5 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-gold focus:outline-none" required disabled={isSaving} />
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-600 uppercase mb-1 block">Advance Paid (₹)</label>
                  <input type="number" name="advancePaid" defaultValue={editingBooking?.advancePaid} placeholder="0" className="w-full p-2.5 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-gold focus:outline-none font-bold text-green-700" disabled={isSaving} />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-gray-600 uppercase mb-1 block">Room Preference</label>
                  <input name="roomPreference" defaultValue={editingBooking?.roomPreference} placeholder="e.g. Single AC" className="w-full p-2.5 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-gold focus:outline-none" disabled={isSaving} />
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-600 uppercase mb-1 block">Status</label>
                  <select name="status" defaultValue={editingBooking?.status || "Pending"} className="w-full p-2.5 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-gold focus:outline-none bg-white" disabled={isSaving}>
                    <option value="Pending">Pending</option>
                    <option value="Confirmed">Confirmed</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-gray-600 uppercase mb-1 block">Additional Notes</label>
                <textarea name="notes" defaultValue={editingBooking?.notes} placeholder="Any special requests or details..." className="w-full p-2.5 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-gold focus:outline-none min-h-[80px]" disabled={isSaving} />
              </div>

              <div className="pt-2">
                <button type="submit" disabled={isSaving} className="w-full bg-[#1A2744] text-white py-3 rounded-lg font-bold hover:bg-[#1A2744]/90 transition-colors flex justify-center items-center gap-2 disabled:opacity-70">
                  {isSaving ? <><Loader2 size={18} className="animate-spin" /> Saving...</> : "Save Booking"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}