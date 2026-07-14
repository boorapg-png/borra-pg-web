"use client";

import React, { useState } from "react";
import { 
  Building2, Layers, Users, Bed, X, Plus, Edit2, Trash2, Save 
} from "lucide-react";

// --- TYPES ---
interface BedData {
  id: string;
  status: "Available" | "Occupied" | "Reserved";
}

interface Room {
  id: string;
  number: string;
  floor: string;
  building: string;
  type: string;
  price: number;
  beds: BedData[];
}

export default function BuildingManagement() {
  const [rooms, setRooms] = useState<Room[]>([
    { id: "r1", number: "101", floor: "Ground", building: "Block A", type: "2-Seater", price: 6000, beds: [{id: 'b1', status: 'Occupied'}, {id: 'b2', status: 'Available'}] },
    { id: "r2", number: "102", floor: "Ground", building: "Block A", type: "3-Seater", price: 5000, beds: [{id: 'b3', status: 'Occupied'}, {id: 'b4', status: 'Occupied'}, {id: 'b5', status: 'Reserved'}] }
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRoom, setEditingRoom] = useState<Room | null>(null);

  // --- HANDLERS ---
  const handleDelete = (id: string) => {
    if (confirm("Delete this room and all associated data?")) {
      setRooms(rooms.filter(r => r.id !== id));
    }
  };

  const handleSave = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const newRoom: Room = {
      id: editingRoom ? editingRoom.id : Math.random().toString(36).substr(2, 9),
      number: formData.get("number") as string,
      floor: formData.get("floor") as string,
      building: formData.get("building") as string,
      type: formData.get("type") as string,
      price: parseFloat(formData.get("price") as string),
      beds: editingRoom ? editingRoom.beds : [{id: 'new', status: 'Available'}] // Simplified for demo
    };

    if (editingRoom) {
      setRooms(rooms.map(r => r.id === editingRoom.id ? newRoom : r));
    } else {
      setRooms([...rooms, newRoom]);
    }
    setIsModalOpen(false);
    setEditingRoom(null);
  };

  return (
    <div className="space-y-6 h-full flex flex-col">
      {/* Header */}
      <div className="flex justify-between items-center bg-white p-5 rounded-xl shadow-sm border border-gray-100">
        <div>
          <h2 className="text-xl font-bold text-[#1A2744]">Building Map</h2>
          <p className="text-sm text-gray-500">Manage your property inventory</p>
        </div>
        <button 
          onClick={() => { setEditingRoom(null); setIsModalOpen(true); }}
          className="bg-[#1A2744] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#1A2744]/90 flex items-center gap-2"
        >
          <Plus size={18} /> Add Room
        </button>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {rooms.map(room => (
          <div key={room.id} className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm relative group">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-2xl font-bold text-[#1A2744]">{room.number}</h3>
              <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={() => { setEditingRoom(room); setIsModalOpen(true); }} className="text-gray-400 hover:text-[#C9973A]"><Edit2 size={16} /></button>
                <button onClick={() => handleDelete(room.id)} className="text-gray-400 hover:text-red-600"><Trash2 size={16} /></button>
              </div>
            </div>
            <p className="text-sm text-gray-500 mb-2">{room.type} • {room.building}</p>
            <p className="font-semibold text-lg text-gray-900">₹{room.price.toLocaleString('en-IN')}</p>
          </div>
        ))}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl w-full max-w-md p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-lg">{editingRoom ? "Edit Room" : "Add Room"}</h3>
              <button onClick={() => setIsModalOpen(false)}><X size={20} /></button>
            </div>
            <form onSubmit={handleSave} className="space-y-4">
              <input name="number" defaultValue={editingRoom?.number} placeholder="Room Number" className="w-full p-2 border rounded" required />
              <input name="building" defaultValue={editingRoom?.building} placeholder="Building Name" className="w-full p-2 border rounded" required />
              <input name="floor" defaultValue={editingRoom?.floor} placeholder="Floor" className="w-full p-2 border rounded" required />
              <input name="type" defaultValue={editingRoom?.type} placeholder="Room Type (e.g. 2-Seater)" className="w-full p-2 border rounded" required />
              <input type="number" name="price" defaultValue={editingRoom?.price} placeholder="Price per Bed" className="w-full p-2 border rounded" required />
              <button type="submit" className="w-full bg-[#1A2744] text-white py-2 rounded-lg font-bold">Save Room</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}