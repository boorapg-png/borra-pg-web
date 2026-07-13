"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAdmin } from "../../../../hooks/useAdmin";
import { 
  Building2, 
  Layers, 
  Users, 
  Bed, 
  X, 
  CheckCircle2, 
  Clock, 
  User,
  ChevronRight
} from "lucide-react";

// --- TYPES & INTERFACES ---
type BedStatus = "Available" | "Occupied" | "Reserved";

interface BedData {
  id: string;
  status: BedStatus;
  tenantName?: string;
  dueDate?: string;
}

interface RoomData {
  id: string;
  number: string;
  floor: string;
  building: string;
  type: string;
  price: number;
  beds: BedData[];
}

// --- MOCK DATA ---
const MOCK_ROOMS: RoomData[] = [
  {
    id: "r1", number: "101", floor: "Ground", building: "Block A", type: "2-Seater", price: 6000,
    beds: [
      { id: "b1", status: "Occupied", tenantName: "Rahul Kumar", dueDate: "5th Aug" },
      { id: "b2", status: "Available" }
    ]
  },
  {
    id: "r2", number: "102", floor: "Ground", building: "Block A", type: "3-Seater", price: 5000,
    beds: [
      { id: "b3", status: "Occupied", tenantName: "Aman Singh" },
      { id: "b4", status: "Occupied", tenantName: "Vikram Gupta" },
      { id: "b5", status: "Reserved", tenantName: "Suresh (Joining 12th)" }
    ]
  },
  {
    id: "r3", number: "103", floor: "Ground", building: "Block A", type: "2-Seater", price: 6000,
    beds: [
      { id: "b6", status: "Available" },
      { id: "b7", status: "Available" }
    ]
  },
  {
    id: "r4", number: "201", floor: "First", building: "Block A", type: "2-Seater", price: 6000,
    beds: [
      { id: "b8", status: "Occupied", tenantName: "Deepak" },
      { id: "b9", status: "Occupied", tenantName: "Rohan" }
    ]
  },
  {
    id: "r5", number: "101", floor: "Ground", building: "Block B", type: "2-Seater", price: 6500,
    beds: [
      { id: "b10", status: "Available" },
      { id: "b11", status: "Available" }
    ]
  }
];

const BUILDINGS = ["Block A", "Block B"];
const FLOORS = ["Ground", "First", "Second"];

export default function BuildingManagement() {
  const { user, isAdmin, loading } = useAdmin();
  const router = useRouter();

  // State for filtering and interactivity
  const [selectedBuilding, setSelectedBuilding] = useState(BUILDINGS[0]);
  const [selectedFloor, setSelectedFloor] = useState(FLOORS[0]);
  const [selectedRoom, setSelectedRoom] = useState<RoomData | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

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

  // Filter rooms based on current tabs
  const displayedRooms = MOCK_ROOMS.filter(
    (room) => room.building === selectedBuilding && room.floor === selectedFloor
  );

  const openDrawer = (room: RoomData) => {
    setSelectedRoom(room);
    setIsDrawerOpen(true);
  };

  const closeDrawer = () => {
    setIsDrawerOpen(false);
    setTimeout(() => setSelectedRoom(null), 300); // Wait for slide animation
  };

  return (
    <div className="space-y-6 relative h-full">
      
      {/* Header & Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-5 rounded-xl shadow-sm border border-gray-100">
        <div>
          <h2 className="text-xl font-bold text-[#1A2744]">Building Map</h2>
          <p className="text-sm text-gray-500">Manage rooms, beds, and occupancy status</p>
        </div>
        
        <div className="flex gap-3">
          <button className="bg-[#1A2744] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#1A2744]/90 transition-colors">
            + Add Room
          </button>
        </div>
      </div>

      {/* Selectors (Buildings & Floors) */}
      <div className="flex flex-col lg:flex-row gap-6">
        
        {/* Building Tabs */}
        <div className="bg-white p-2 rounded-xl shadow-sm border border-gray-100 flex gap-2">
          {BUILDINGS.map(building => (
            <button
              key={building}
              onClick={() => setSelectedBuilding(building)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                selectedBuilding === building 
                  ? "bg-[#C9973A]/10 text-[#C9973A]" 
                  : "text-gray-500 hover:bg-gray-50"
              }`}
            >
              <Building2 size={16} />
              {building}
            </button>
          ))}
        </div>

        {/* Floor Pills */}
        <div className="bg-white p-2 rounded-xl shadow-sm border border-gray-100 flex gap-2 overflow-x-auto">
          {FLOORS.map(floor => (
            <button
              key={floor}
              onClick={() => setSelectedFloor(floor)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
                selectedFloor === floor 
                  ? "bg-[#1A2744] text-white" 
                  : "text-gray-500 hover:bg-gray-50"
              }`}
            >
              <Layers size={16} />
              {floor} Floor
            </button>
          ))}
        </div>
      </div>

      {/* Room Grid */}
      {displayedRooms.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
          <Bed className="mx-auto h-12 w-12 text-gray-300 mb-3" />
          <h3 className="text-lg font-medium text-gray-900">No rooms found</h3>
          <p className="text-gray-500 text-sm mt-1">There are no rooms configured for this floor yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6">
          {displayedRooms.map(room => {
            const occupiedCount = room.beds.filter(b => b.status === "Occupied").length;
            const isFull = occupiedCount === room.beds.length;
            const isEmpty = occupiedCount === 0 && room.beds.every(b => b.status === "Available");

            return (
              <div 
                key={room.id} 
                onClick={() => openDrawer(room)}
                className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 hover:border-[#C9973A] hover:shadow-md transition-all cursor-pointer group"
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-2xl font-bold text-[#1A2744] group-hover:text-[#C9973A] transition-colors">
                      {room.number}
                    </h3>
                    <p className="text-xs text-gray-500 font-medium">{room.type}</p>
                  </div>
                  <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider ${
                    isFull ? "bg-red-50 text-red-700 border border-red-100" : 
                    isEmpty ? "bg-green-50 text-green-700 border border-green-100" : 
                    "bg-orange-50 text-orange-700 border border-orange-100"
                  }`}>
                    {isFull ? "Full" : isEmpty ? "Empty" : "Partial"}
                  </span>
                </div>

                {/* Bed Indicators */}
                <div className="flex gap-2 mb-6">
                  {room.beds.map((bed, index) => (
                    <div 
                      key={bed.id}
                      title={bed.status}
                      className={`flex-1 h-2 rounded-full ${
                        bed.status === "Available" ? "bg-green-400" :
                        bed.status === "Occupied" ? "bg-red-400" : "bg-yellow-400"
                      }`}
                    />
                  ))}
                </div>

                <div className="flex justify-between items-center text-sm border-t border-gray-50 pt-4">
                  <div className="flex items-center gap-1.5 text-gray-500">
                    <Users size={16} />
                    <span>{occupiedCount} / {room.beds.length}</span>
                  </div>
                  <div className="font-semibold text-gray-900">
                    ₹{room.price.toLocaleString('en-IN')}<span className="text-xs text-gray-500 font-normal">/bed</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* --- SLIDE-OVER DRAWER --- */}
      
      {/* Backdrop */}
      {isDrawerOpen && (
        <div 
          className="fixed inset-0 bg-[#1A2744]/20 backdrop-blur-sm z-40 transition-opacity"
          onClick={closeDrawer}
        />
      )}

      {/* Drawer Panel */}
      <div 
        className={`fixed inset-y-0 right-0 w-full max-w-md bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out flex flex-col ${
          isDrawerOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {selectedRoom && (
          <>
            {/* Drawer Header */}
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50">
              <div>
                <h3 className="text-xl font-bold text-[#1A2744]">Room {selectedRoom.number}</h3>
                <p className="text-xs text-gray-500">{selectedRoom.building} • {selectedRoom.floor} Floor</p>
              </div>
              <button 
                onClick={closeDrawer}
                className="p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-200 rounded-full transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Drawer Content */}
            <div className="flex-1 overflow-y-auto p-6">
              
              <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                  <p className="text-xs text-gray-500 mb-1">Room Type</p>
                  <p className="font-semibold text-gray-900">{selectedRoom.type}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                  <p className="text-xs text-gray-500 mb-1">Price per Bed</p>
                  <p className="font-semibold text-gray-900">₹{selectedRoom.price.toLocaleString('en-IN')}</p>
                </div>
              </div>

              <h4 className="font-bold text-[#1A2744] mb-4 border-b border-gray-100 pb-2">Bed Status</h4>
              
              <div className="space-y-3">
                {selectedRoom.beds.map((bed, index) => (
                  <div key={bed.id} className="border border-gray-100 rounded-xl p-4 hover:border-[#C9973A]/30 transition-colors">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex items-center gap-2">
                        <div className={`w-2.5 h-2.5 rounded-full ${
                          bed.status === "Available" ? "bg-green-500" :
                          bed.status === "Occupied" ? "bg-red-500" : "bg-yellow-500"
                        }`} />
                        <span className="font-semibold text-gray-900">Bed {index + 1}</span>
                      </div>
                      <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded ${
                        bed.status === "Available" ? "bg-green-50 text-green-700" :
                        bed.status === "Occupied" ? "bg-red-50 text-red-700" : "bg-yellow-50 text-yellow-700"
                      }`}>
                        {bed.status}
                      </span>
                    </div>

                    {bed.status === "Occupied" && bed.tenantName && (
                      <div className="mt-3 pl-4 border-l-2 border-gray-100">
                        <div className="flex items-center gap-2 text-sm text-gray-700 mb-1">
                          <User size={14} className="text-gray-400" />
                          {bed.tenantName}
                        </div>
                        {bed.dueDate && (
                          <div className="flex items-center gap-2 text-xs text-gray-500">
                            <Clock size={14} className="text-red-400" />
                            Next due: {bed.dueDate}
                          </div>
                        )}
                      </div>
                    )}

                    {bed.status === "Available" && (
                      <button className="mt-3 w-full py-2 bg-gray-50 hover:bg-green-50 hover:text-green-700 text-gray-600 text-sm font-medium rounded-lg border border-gray-100 transition-colors flex items-center justify-center gap-2">
                        <CheckCircle2 size={16} />
                        Assign Tenant
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Drawer Footer */}
            <div className="p-6 border-t border-gray-100 bg-gray-50">
              <button className="w-full flex items-center justify-center gap-2 py-3 bg-white border-2 border-[#1A2744] text-[#1A2744] rounded-xl font-bold hover:bg-[#1A2744] hover:text-white transition-all">
                Edit Room Settings
                <ChevronRight size={18} />
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}