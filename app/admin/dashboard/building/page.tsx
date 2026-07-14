"use client";

import React, { useState } from "react";
import { 
  Building2, Layers, Bed, Plus, Edit2, Trash2, X, PlusCircle 
} from "lucide-react";

// --- TYPES ---
interface Room {
  id: string;
  number: string;
  floor: string;
  building: string;
  type: string;
  price: number;
}

export default function BuildingManagement() {
  const [rooms, setRooms] = useState<Room[]>([
    { id: "r1", number: "101", floor: "Ground", building: "Block A", type: "2-Seater", price: 6000 },
    { id: "r2", number: "102", floor: "Ground", building: "Block A", type: "3-Seater", price: 5000 },
    { id: "r3", number: "201", floor: "First", building: "Block A", type: "2-Seater", price: 6500 },
    { id: "r4", number: "201", floor: "Ground", building: "Block B", type: "Single", price: 8000 },
  ]);

  const [activeBuilding, setActiveBuilding] = useState("Block A");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRoom, setEditingRoom] = useState<Room | null>(null);

  // --- LOGIC ---
  const buildings = Array.from(new Set(rooms.map(r => r.building)));
  const floors = ["Ground", "First", "Second", "Third"]; // Extend as needed

  const filteredRooms = rooms.filter(r => r.building === activeBuilding);

  const handleDelete = (id: string) => {
    if (confirm("Delete this room?")) {
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
    };

    if (editingRoom) {
      setRooms(rooms.map(r => r.id === editingRoom.id ? newRoom : r));
    } else {
      setRooms([...rooms, newRoom]);
    }
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6 h-full flex flex-col">
      {/* Header */}
      <div className="flex justify-between items-center bg-white p-5 rounded-xl shadow-sm border border-gray-100">
        <div>
          <h2 className="text-xl font-bold text-[#1A2744]">Property Inventory</h2>
        </div>
        <button onClick={() => { setEditingRoom(null); setIsModalOpen(true); }} className="bg-[#1A2744] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#1A2744]/90 flex items-center gap-2">
          <Plus size={18} /> Add New Room
        </button>
      </div>

      {/* Building Tabs */}
      <div className="flex gap-2 border-b border-gray-200">
        {buildings.map(b => (
          <button 
            key={b} 
            onClick={() => setActiveBuilding(b)}
            className={`px-6 py-2 font-medium text-sm border-b-2 transition-colors ${activeBuilding === b ? "border-[#C9973A] text-[#C9973A]" : "border-transparent text-gray-500 hover:text-gray-800"}`}
          >
            {b}
          </button>
        ))}
      </div>

      {/* Hierarchy View */}
      <div className="space-y-8">
        {floors.map(floor => {
          const roomsOnFloor = filteredRooms.filter(r => r.floor === floor);
          if (roomsOnFloor.length === 0) return null;

          return (
            <div key={floor}>
              <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                <Layers size={16} /> {floor} Floor
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-4 gap-4">
                {roomsOnFloor.map(room => (
                  <div key={room.id} className="bg-white p-4 rounded-lg border border-gray-100 shadow-sm flex justify-between items-center group">
                    <div>
                      <h4 className="font-bold text-lg text-[#1A2744]">Room {room.number}</h4>
                      <p className="text-xs text-gray-500">{room.type} • ₹{room.price}</p>
                    </div>
                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => { setEditingRoom(room); setIsModalOpen(true); }} className="text-gray-400 hover:text-[#C9973A]"><Edit2 size={16} /></button>
                      <button onClick={() => handleDelete(room.id)} className="text-gray-400 hover:text-red-600"><Trash2 size={16} /></button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl w-full max-w-md p-6">
            <h3 className="font-bold text-lg mb-4">{editingRoom ? "Edit Room" : "Add Room"}</h3>
            <form onSubmit={handleSave} className="space-y-4">
              <input name="building" defaultValue={editingRoom?.building || activeBuilding} placeholder="Building Name" className="w-full p-2 border rounded" required />
              <input name="floor" defaultValue={editingRoom?.floor} placeholder="Floor (e.g. Ground)" className="w-full p-2 border rounded" required />
              <input name="number" defaultValue={editingRoom?.number} placeholder="Room Number" className="w-full p-2 border rounded" required />
              <input name="type" defaultValue={editingRoom?.type} placeholder="Room Type" className="w-full p-2 border rounded" required />
              <input type="number" name="price" defaultValue={editingRoom?.price} placeholder="Price" className="w-full p-2 border rounded" required />
              <button type="submit" className="w-full bg-[#1A2744] text-white py-2 rounded-lg font-bold">Save Changes</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}