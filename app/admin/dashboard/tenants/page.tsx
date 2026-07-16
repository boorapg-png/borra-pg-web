"use client";

import React, { useState, useEffect, useMemo } from "react";
import { 
  Users, Plus, Search, Edit2, Trash2, X, ChevronDown, ChevronUp, 
  CheckCircle2, AlertCircle, Loader2, Home
} from "lucide-react";
import { collection, query, where, getDocs, Timestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useTenants } from "@/hooks/useTenants";
import { useBuildings, useRooms } from "@/hooks/useBuildings";
import { tenantService } from "@/services/tenants.service";
import { Tenant, Bed } from "@/types";

// ─── HELPER FUNCTIONS ───
const calculateAge = (dobString: string) => {
  if (!dobString) return "-";
  const today = new Date();
  const birthDate = new Date(dobString);
  let age = today.getFullYear() - birthDate.getFullYear();
  const m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) age--;
  return age;
};

const formatDate = (timestamp: Timestamp | null) => {
  if (!timestamp) return "-";
  return timestamp.toDate().toLocaleDateString("en-IN", { day: '2-digit', month: 'short', year: 'numeric' });
};

const toDateInput = (timestamp?: Timestamp | null) => {
  if (!timestamp) return "";
  return timestamp.toDate().toISOString().split('T')[0];
};

type SortField = keyof Tenant | "age" | "room";
type SortDirection = "asc" | "desc";

// ─── ROOT COMPONENT ───
export default function TenantManagement() {
  const { tenants, loading: tLoading } = useTenants();
  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState<SortField>("createdAt");
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");
  
  const [modal, setModal] = useState<{ type: "add" | "edit"; tenant?: Tenant } | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  // ─── SEARCH & SORT LOGIC ───
  const filteredAndSortedTenants = useMemo(() => {
    let result = [...tenants];

    // Search
    if (searchTerm) {
      const lowerSearch = searchTerm.toLowerCase();
      result = result.filter(t => 
        t.name.toLowerCase().includes(lowerSearch) || 
        t.phone.includes(searchTerm) ||
        t.aadhaarNumber.includes(searchTerm) ||
        t.accommodation.roomNumber.toLowerCase().includes(lowerSearch)
      );
    }

    // Sort
    result.sort((a, b) => {
      let aValue: string | number = "";
      let bValue: string | number = "";

      if (sortField === "age") {
        aValue = calculateAge(a.dob) as number;
        bValue = calculateAge(b.dob) as number;
      } else if (sortField === "room") {
        aValue = a.accommodation.roomNumber;
        bValue = b.accommodation.roomNumber;
      } else if (a[sortField as keyof Tenant] instanceof Timestamp) {
        aValue = (a[sortField as keyof Tenant] as unknown as Timestamp).toMillis();
        bValue = (b[sortField as keyof Tenant] as unknown as Timestamp).toMillis();
      } else {
        aValue = String(a[sortField as keyof Tenant]);
        bValue = String(b[sortField as keyof Tenant]);
      }

      if (aValue < bValue) return sortDirection === "asc" ? -1 : 1;
      if (aValue > bValue) return sortDirection === "asc" ? 1 : -1;
      return 0;
    });

    return result;
  }, [tenants, searchTerm, sortField, sortDirection]);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) return <div className="w-4 h-4" />; 
    return sortDirection === "asc" ? <ChevronUp size={16} /> : <ChevronDown size={16} />;
  };

  // ─── ACTIONS ───
  const handleDelete = async (t: Tenant) => {
    try {
      await tenantService.delete(t.id, t.accommodation.bedId, t.accommodation.roomId);
      setConfirmDelete(null);
    } catch (error) {
      console.error("Error deleting tenant:", error);
      alert("Failed to delete tenant.");
    }
  };

  if (tLoading) {
    return <div className="h-full flex items-center justify-center text-navy"><Loader2 className="animate-spin" size={32} /></div>;
  }

  return (
    <div className="flex flex-col h-full space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-navy">Tenant Directory</h1>
          <p className="text-sm text-gray-500 mt-1">Manage your paying guests, documents, and room assignments</p>
        </div>
        <button
          onClick={() => setModal({ type: "add" })}
          className="flex items-center gap-2 bg-navy text-white px-4 py-2.5 rounded-lg text-sm font-semibold hover:bg-navy/90 transition-colors shrink-0"
        >
          <Plus size={18} /> Add New Tenant
        </button>
      </div>

      {/* Controls (Search) */}
      <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex items-center gap-3">
        <div className="relative flex-1 max-w-md">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input 
            type="text" 
            placeholder="Search by Name, Phone, Aadhaar, or Room..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-gold focus:outline-none transition-colors"
          />
        </div>
        <div className="text-sm font-medium text-gray-500 ml-auto">
          {filteredAndSortedTenants.length} Tenant(s) found
        </div>
      </div>

      {/* Data Table */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm flex-1 overflow-hidden flex flex-col">
        <div className="overflow-x-auto flex-1">
          <table className="w-full text-sm text-left whitespace-nowrap">
            <thead className="text-xs text-gray-500 bg-gray-50 border-b border-gray-200 uppercase tracking-wider sticky top-0 z-10">
              <tr>
                <th className="px-6 py-4 cursor-pointer hover:bg-gray-100" onClick={() => handleSort("name")}>
                  <div className="flex items-center gap-1">Tenant <SortIcon field="name" /></div>
                </th>
                <th className="px-6 py-4 cursor-pointer hover:bg-gray-100" onClick={() => handleSort("room")}>
                  <div className="flex items-center gap-1">Room/Bed <SortIcon field="room" /></div>
                </th>
                <th className="px-6 py-4 cursor-pointer hover:bg-gray-100" onClick={() => handleSort("age")}>
                  <div className="flex items-center gap-1">Demographics <SortIcon field="age" /></div>
                </th>
                <th className="px-6 py-4">Aadhaar No.</th>
                <th className="px-6 py-4 cursor-pointer hover:bg-gray-100" onClick={() => handleSort("joiningDate")}>
                  <div className="flex items-center gap-1">Timeline <SortIcon field="joiningDate" /></div>
                </th>
                <th className="px-6 py-4 cursor-pointer hover:bg-gray-100" onClick={() => handleSort("status")}>
                  <div className="flex items-center gap-1">Status <SortIcon field="status" /></div>
                </th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredAndSortedTenants.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-gray-500">
                    <Users size={32} className="mx-auto mb-3 text-gray-300" />
                    <p className="font-medium text-base">No tenants found</p>
                    <p className="text-xs mt-1">Adjust your search or add a new tenant.</p>
                  </td>
                </tr>
              ) : (
                filteredAndSortedTenants.map((t) => (
                  <tr key={t.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-bold text-navy">{t.name}</div>
                      <div className="text-gray-500 text-xs mt-0.5">{t.phone}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-semibold flex items-center gap-1.5 text-gray-800">
                        <Home size={14} className="text-gray-400" /> {t.accommodation.roomNumber}
                      </div>
                      <div className="text-xs text-gray-500 mt-0.5 ml-5">Bed {t.accommodation.bedLabel} • {t.accommodation.buildingName}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-medium text-gray-800">{calculateAge(t.dob)} yrs</div>
                      <div className="text-xs text-gray-500 mt-0.5">{t.gender}</div>
                    </td>
                    <td className="px-6 py-4 font-mono text-gray-600 text-xs">
                      {t.aadhaarNumber}
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-green-700 text-xs font-semibold flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span> In: {formatDate(t.joiningDate)}
                      </div>
                      {t.leavingDate && (
                        <div className="text-red-600 text-xs mt-1 flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span> Out: {formatDate(t.leavingDate)}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 space-y-1.5">
                      {/* Operational Status */}
                      <div>
                        <span className={`inline-flex px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${t.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-600'}`}>
                          {t.status}
                        </span>
                      </div>
                      {/* Document Status */}
                      <div className="flex items-center gap-1 text-[11px] font-medium">
                        {t.documentStatus === 'completed' 
                          ? <><CheckCircle2 size={12} className="text-green-600" /> <span className="text-green-700">Docs OK</span></>
                          : <><AlertCircle size={12} className="text-amber-500" /> <span className="text-amber-700">Docs Pending</span></>}
                      </div>
                      {/* Payment Status */}
                      <div className="flex items-center gap-1 text-[11px] font-medium">
                        {t.paymentStatus === 'paid' && <span className="text-green-700">Rent Paid</span>}
                        {t.paymentStatus === 'pending' && <span className="text-amber-600">Rent Pending</span>}
                        {t.paymentStatus === 'overdue' && <span className="text-red-600 font-bold">Rent Overdue</span>}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button onClick={() => setModal({ type: "edit", tenant: t })} className="p-1.5 text-gray-400 hover:text-navy hover:bg-gray-100 rounded transition-colors">
                          <Edit2 size={16} />
                        </button>
                        {confirmDelete === t.id ? (
                          <div className="flex items-center gap-1.5 text-xs text-red-600 bg-red-50 px-2 py-1 rounded border border-red-100">
                            <span className="font-semibold">Sure?</span>
                            <button onClick={() => handleDelete(t)} className="font-bold hover:underline">Yes</button>
                            <span className="text-red-300">/</span>
                            <button onClick={() => setConfirmDelete(null)} className="font-bold hover:underline">No</button>
                          </div>
                        ) : (
                          <button onClick={() => setConfirmDelete(t.id)} className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors">
                            <Trash2 size={16} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL WRAPPER */}
      {modal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setModal(null)}>
          <div className="bg-white rounded-2xl w-full max-w-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 shrink-0">
              <h2 className="text-lg font-bold text-navy">
                {modal.type === "add" ? "Register New Tenant" : "Edit Tenant Details"}
              </h2>
              <button onClick={() => setModal(null)} className="text-gray-400 hover:text-gray-700 transition-colors p-1">
                <X size={20} />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto">
              <TenantForm 
                initialData={modal.tenant} 
                onSuccess={() => setModal(null)} 
                onCancel={() => setModal(null)} 
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── TENANT FORM COMPONENT ───
function TenantForm({ initialData, onSuccess, onCancel }: { initialData?: Tenant, onSuccess: () => void, onCancel: () => void }) {
  const [isSaving, setIsSaving] = useState(false);
  const { buildings } = useBuildings();
  
  // Form State
  const [formData, setFormData] = useState({
    name: initialData?.name || "",
    phone: initialData?.phone || "",
    dob: initialData?.dob || "",
    gender: initialData?.gender || "Male",
    aadhaarNumber: initialData?.aadhaarNumber || "",
    emergencyContact: initialData?.emergencyContact || "",
    status: initialData?.status || "active",
    documentStatus: initialData?.documentStatus || "pending",
    paymentStatus: initialData?.paymentStatus || "pending",
    joiningDate: toDateInput(initialData?.joiningDate) || new Date().toISOString().split('T')[0],
    leavingDate: toDateInput(initialData?.leavingDate) || "",
    buildingId: initialData?.accommodation.buildingId || "",
    roomId: initialData?.accommodation.roomId || "",
    bedId: initialData?.accommodation.bedId || ""
  });

  // Dynamic Room/Bed Fetching
  const { rooms } = useRooms(formData.buildingId || null);
  const [availableBeds, setAvailableBeds] = useState<Bed[]>([]);

  // When room changes, fetch beds for that room
  useEffect(() => {
    if (!formData.roomId) {
      setAvailableBeds([]);
      return;
    }
    const fetchBeds = async () => {
      // Fetch available beds OR the bed currently assigned to this tenant
      const bedsSnap = await getDocs(query(collection(db, "beds"), where("roomId", "==", formData.roomId)));
      const beds = bedsSnap.docs.map(d => d.data() as Bed);
      
      const validBeds = beds.filter(b => b.status === "available" || b.id === initialData?.accommodation.bedId);
      setAvailableBeds(validBeds);
      
      // Auto-clear bed selection if the old bed isn't in this room
      if (initialData?.accommodation.roomId !== formData.roomId && validBeds.length > 0) {
        setFormData(prev => ({ ...prev, bedId: validBeds[0].id }));
      }
    };
    fetchBeds();
  }, [formData.roomId, initialData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      // Get names for denormalization
      const selectedBuilding = buildings.find(b => b.id === formData.buildingId);
      const selectedRoom = rooms.find(r => r.id === formData.roomId);
      const selectedBed = availableBeds.find(b => b.id === formData.bedId);

      if (!selectedBuilding || !selectedRoom || !selectedBed) {
        alert("Please select a complete room assignment (Building, Room, and Bed).");
        setIsSaving(false);
        return;
      }

      const tenantPayload = {
        name: formData.name.trim(),
        phone: formData.phone.trim(),
        dob: formData.dob,
        gender: formData.gender as "Male" | "Female" | "Other",
        aadhaarNumber: formData.aadhaarNumber.trim(),
        emergencyContact: formData.emergencyContact.trim(),
        status: formData.status as "active" | "inactive" | "on_notice",
        documentStatus: formData.documentStatus as "completed" | "pending",
        paymentStatus: formData.paymentStatus as "paid" | "pending" | "overdue",
        joiningDate: Timestamp.fromDate(new Date(formData.joiningDate)),
        leavingDate: formData.leavingDate ? Timestamp.fromDate(new Date(formData.leavingDate)) : null,
        accommodation: {
          buildingId: selectedBuilding.id,
          buildingName: selectedBuilding.name,
          floorId: selectedRoom.floorId,
          roomId: selectedRoom.id,
          roomNumber: selectedRoom.number,
          bedId: selectedBed.id,
          bedLabel: selectedBed.bedLabel,
        }
      };

      if (initialData) {
        await tenantService.update(initialData.id, tenantPayload);
      } else {
        await tenantService.add(tenantPayload);
      }
      onSuccess();
    } catch (error) {
      console.error("Save error:", error);
      alert("Error saving tenant details.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* 1. Personal Details */}
      <section>
        <h3 className="text-sm font-bold text-navy border-b border-gray-100 pb-2 mb-4 flex items-center gap-2">
          <Users size={16} className="text-gold" /> Personal Details
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1 block">Full Name</label>
            <input required name="name" value={formData.name} onChange={handleChange} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-gold focus:outline-none" />
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1 block">Phone Number</label>
            <input required name="phone" value={formData.phone} onChange={handleChange} placeholder="e.g. 9876543210" className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-gold focus:outline-none" />
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1 block">Gender</label>
            <select name="gender" value={formData.gender} onChange={handleChange} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-gold focus:outline-none bg-white">
              <option>Male</option>
              <option>Female</option>
              <option>Other</option>
            </select>
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1 block">Date of Birth</label>
            <input required type="date" name="dob" value={formData.dob} onChange={handleChange} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-gold focus:outline-none" />
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1 block">Aadhaar Number</label>
            <input required name="aadhaarNumber" value={formData.aadhaarNumber} onChange={handleChange} placeholder="XXXX XXXX XXXX" className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-gold focus:outline-none font-mono" />
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1 block">Emergency Contact (Name & No)</label>
            <input required name="emergencyContact" value={formData.emergencyContact} onChange={handleChange} placeholder="Parent/Guardian Details" className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-gold focus:outline-none" />
          </div>
        </div>
      </section>

      {/* 2. Accommodation & Status */}
      <section>
        <h3 className="text-sm font-bold text-navy border-b border-gray-100 pb-2 mb-4 flex items-center gap-2">
          <Home size={16} className="text-gold" /> Room Assignment & Stay
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1 block">Building</label>
            <select required name="buildingId" value={formData.buildingId} onChange={handleChange} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-gold focus:outline-none bg-white">
              <option value="">Select Building</option>
              {buildings.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
            </select>
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1 block">Room</label>
            <select required name="roomId" value={formData.roomId} onChange={handleChange} disabled={!formData.buildingId} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-gold focus:outline-none bg-white disabled:bg-gray-50">
              <option value="">Select Room</option>
              {rooms.map(r => <option key={r.id} value={r.id}>Room {r.number} ({r.type})</option>)}
            </select>
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1 block">Bed Assignment</label>
            <select required name="bedId" value={formData.bedId} onChange={handleChange} disabled={!formData.roomId || availableBeds.length === 0} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-gold focus:outline-none bg-white disabled:bg-gray-50">
              <option value="">{availableBeds.length === 0 && formData.roomId ? "No Beds Available" : "Select Bed"}</option>
              {availableBeds.map(b => <option key={b.id} value={b.id}>Bed {b.bedLabel}</option>)}
            </select>
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1 block">Joining Date</label>
            <input required type="date" name="joiningDate" value={formData.joiningDate} onChange={handleChange} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-gold focus:outline-none" />
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1 block flex justify-between">Leaving Date <span className="text-gray-400 lowercase normal-case">(optional)</span></label>
            <input type="date" name="leavingDate" value={formData.leavingDate} onChange={handleChange} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-gold focus:outline-none" />
          </div>
        </div>
      </section>

      {/* 3. Admin Checklists */}
      <section className="bg-gray-50 p-4 rounded-xl border border-gray-200">
        <h3 className="text-sm font-bold text-navy mb-4 flex items-center gap-2">
          <CheckCircle2 size={16} className="text-gold" /> Admin Checklists
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1 block">Document Status</label>
            <select name="documentStatus" value={formData.documentStatus} onChange={handleChange} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-gold focus:outline-none bg-white">
              <option value="pending">Pending Verification</option>
              <option value="completed">Documents Completed</option>
            </select>
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1 block">Rent Payment Status</label>
            <select name="paymentStatus" value={formData.paymentStatus} onChange={handleChange} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-gold focus:outline-none bg-white">
              <option value="pending">Pending</option>
              <option value="paid">Paid</option>
              <option value="overdue">Overdue</option>
            </select>
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1 block">Tenant Account</label>
            <select name="status" value={formData.status} onChange={handleChange} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-gold focus:outline-none bg-white">
              <option value="active">Active (Staying)</option>
              <option value="inactive">Inactive (Vacated)</option>
            </select>
          </div>
        </div>
      </section>

      {/* Buttons */}
      <div className="flex gap-3 pt-4 border-t border-gray-100">
        <button type="button" onClick={onCancel} disabled={isSaving} className="flex-1 px-4 py-3 border border-gray-200 text-gray-700 rounded-lg text-sm font-semibold hover:bg-gray-50 transition-colors disabled:opacity-50">
          Cancel
        </button>
        <button type="submit" disabled={isSaving} className="flex-1 px-4 py-3 bg-navy text-white rounded-lg text-sm font-semibold hover:bg-navy/90 transition-colors disabled:opacity-50 flex justify-center items-center gap-2">
          {isSaving ? <><Loader2 size={16} className="animate-spin" /> Saving...</> : "Save Tenant Details"}
        </button>
      </div>
    </form>
  );
}