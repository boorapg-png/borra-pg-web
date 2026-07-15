"use client";

import React, { useState } from "react";
import {
  Building2,
  Layers,
  Bed,
  Plus,
  Edit2,
  Trash2,
  X,
  ChevronDown,
  ChevronRight,
  Zap,
  Wind,
  Bath
} from "lucide-react";

// ─── TYPES

interface Building {
  id: string;
  name: string;
}

interface Floor {
  id: string;
  buildingId: string;
  name: string;
  order: number;
}

interface Room {
  id: string;
  buildingId: string;
  floorId: string;
  number: string;
  type: "Single" | "Double" | "Triple";
  bedsTotal: number;
  pricePerBed: number;
  status: "available" | "occupied" | "partial" | "maintenance";
  ac: boolean;
  attachedBath: boolean;
  meterNumber: string;
}

type ModalState =
  | { type: "add-building" }
  | { type: "edit-building"; building: Building }
  | { type: "add-floor"; buildingId: string }
  | { type: "edit-floor"; floor: Floor }
  | { type: "add-room"; buildingId: string; floorId: string }
  | { type: "edit-room"; room: Room }
  | null;

// ─── HELPERS

const uid = () => Math.random().toString(36).slice(2, 9);
const INR = (n: number) => "₹" + n.toLocaleString("en-IN");
const bedCount = (type: "Single" | "Double" | "Triple") =>
  type === "Single" ? 1 : type === "Double" ? 2 : 3;

// ─── SEED DATA

const initialBuildings: Building[] = [
  { id: "b1", name: "Block A" },
  { id: "b2", name: "Block B" },
];

const initialFloors: Floor[] = [
  { id: "f1", buildingId: "b1", name: "Ground Floor", order: 0 },
  { id: "f2", buildingId: "b1", name: "1st Floor", order: 1 },
  { id: "f3", buildingId: "b2", name: "Ground Floor", order: 0 },
];

const initialRooms: Room[] = [
  {
    id: "r1",
    buildingId: "b1",
    floorId: "f1",
    number: "101",
    type: "Double",
    bedsTotal: 2,
    pricePerBed: 6000,
    status: "partial",
    ac: true,
    attachedBath: true,
    meterNumber: "M-101",
  },
  {
    id: "r2",
    buildingId: "b1",
    floorId: "f1",
    number: "102",
    type: "Single",
    bedsTotal: 1,
    pricePerBed: 8000,
    status: "occupied",
    ac: false,
    attachedBath: true,
    meterNumber: "M-102",
  },
  {
    id: "r3",
    buildingId: "b1",
    floorId: "f2",
    number: "201",
    type: "Triple",
    bedsTotal: 3,
    pricePerBed: 5000,
    status: "available",
    ac: true,
    attachedBath: false,
    meterNumber: "M-201",
  },
  {
    id: "r4",
    buildingId: "b2",
    floorId: "f3",
    number: "101",
    type: "Double",
    bedsTotal: 2,
    pricePerBed: 5500,
    status: "maintenance",
    ac: false,
    attachedBath: false,
    meterNumber: "M-101B",
  },
];

// ─── ROOT COMPONENT

export default function BuildingManagement() {
  const [buildings, setBuildings] = useState<Building[]>(initialBuildings);
  const [floors, setFloors] = useState<Floor[]>(initialFloors);
  const [rooms, setRooms] = useState<Room[]>(initialRooms);
  const [activeBuilding, setActiveBuilding] = useState<string>("b1");
  const [collapsedFloors, setCollapsedFloors] = useState<Set<string>>(new Set());
  const [modal, setModal] = useState<ModalState>(null);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  // CRUD Actions
  const saveBuilding = (name: string, id?: string) => {
    if (id) {
      setBuildings((prev) => prev.map((b) => (b.id === id ? { ...b, name } : b)));
    } else {
      const newId = uid();
      setBuildings((prev) => [...prev, { id: newId, name }]);
      setActiveBuilding(newId);
    }
    setModal(null);
  };

  const deleteBuilding = (id: string) => {
    const floorsToDelete = floors.filter((f) => f.buildingId === id).map((f) => f.id);
    setBuildings((prev) => prev.filter((b) => b.id !== id));
    setFloors((prev) => prev.filter((f) => f.buildingId !== id));
    setRooms((prev) => prev.filter((r) => !floorsToDelete.includes(r.floorId)));
    setConfirmDelete(null);
    const remaining = buildings.filter((b) => b.id !== id);
    if (activeBuilding === id) setActiveBuilding(remaining.length > 0 ? remaining[0].id : "");
  };

  const saveFloor = (name: string, buildingId: string, id?: string) => {
    if (id) {
      setFloors((prev) => prev.map((f) => (f.id === id ? { ...f, name } : f)));
    } else {
      const bFloors = floors.filter((f) => f.buildingId === buildingId);
      const nextOrder = bFloors.length > 0 ? Math.max(...bFloors.map((f) => f.order)) + 1 : 0;
      setFloors((prev) => [...prev, { id: uid(), buildingId, name, order: nextOrder }]);
    }
    setModal(null);
  };

  const deleteFloor = (id: string) => {
    setFloors((prev) => prev.filter((f) => f.id !== id));
    setRooms((prev) => prev.filter((r) => r.floorId !== id));
    setConfirmDelete(null);
  };

  const saveRoom = (data: Partial<Room>, id?: string) => {
    const bedsTotal = bedCount(data.type as "Single" | "Double" | "Triple");
    if (id) {
      // FIX: Removed 'as any' to satisfy TypeScript strict mode
      setRooms((prev) => prev.map((r) => (r.id === id ? ({ ...r, ...data, bedsTotal } as Room) : r)));
    } else {
      setRooms((prev) => [...prev, { ...data, id: uid(), bedsTotal } as Room]);
    }
    setModal(null);
  };

  const deleteRoom = (id: string) => {
    setRooms((prev) => prev.filter((r) => r.id !== id));
    setConfirmDelete(null);
  };

  const toggleFloorCollapse = (floorId: string) => {
    setCollapsedFloors((prev) => {
      const next = new Set(prev);
      if (next.has(floorId)) next.delete(floorId);
      else next.add(floorId);
      return next;
    });
  };

  const currentBuilding = buildings.find((b) => b.id === activeBuilding);
  const currentFloors = floors.filter((f) => f.buildingId === activeBuilding).sort((a, b) => a.order - b.order);
  const currentRooms = rooms.filter((r) => r.buildingId === activeBuilding);

  const getStatusColor = (status: Room["status"]) => {
    switch (status) {
      case "available":
        return "bg-green-100 text-green-700";
      case "occupied":
        return "bg-red-100 text-red-700";
      case "partial":
        return "bg-amber-100 text-amber-700";
      case "maintenance":
        return "bg-gray-100 text-gray-500";
    }
  };

  return (
    <div className="flex flex-col h-full space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-navy">Building Management</h1>
          <p className="text-sm text-gray-500 mt-1">Manage buildings, floors and rooms</p>
        </div>
        <button
          onClick={() => setModal({ type: "add-building" })}
          className="flex items-center gap-2 bg-navy text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-navy/90 transition-colors"
        >
          <Plus size={16} />
          Add Building
        </button>
      </div>

      {buildings.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-12 bg-white rounded-xl border border-gray-200 shadow-sm flex-1">
          <Building2 size={48} className="text-gray-300 mb-4" />
          <h3 className="text-lg font-bold text-gray-700 mb-2">No buildings yet</h3>
          <p className="text-sm text-gray-500 mb-6 text-center max-w-sm">
            Start by adding your first building to manage floors and rooms.
          </p>
          <button
            onClick={() => setModal({ type: "add-building" })}
            className="flex items-center gap-2 bg-navy text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-navy/90"
          >
            <Plus size={16} /> Add Building
          </button>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm flex-1 flex flex-col overflow-hidden">
          {/* Building Tabs */}
          <div className="flex overflow-x-auto border-b border-gray-200">
            {buildings.map((b) => {
              const bRooms = rooms.filter((r) => r.buildingId === b.id);
              const bBeds = bRooms.reduce((acc, r) => acc + r.bedsTotal, 0);
              const isActive = activeBuilding === b.id;
              return (
                <button
                  key={b.id}
                  onClick={() => setActiveBuilding(b.id)}
                  className={`flex flex-col items-start px-6 py-3 border-b-2 transition-colors whitespace-nowrap min-w-35 ${
                    isActive ? "border-gold bg-gold/5 text-gold" : "border-transparent text-gray-500 hover:bg-gray-50"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Building2 size={16} className={isActive ? "text-gold" : "text-gray-400"} />
                    <span className={`font-semibold ${isActive ? "text-gold" : "text-gray-700"}`}>{b.name}</span>
                    <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${isActive ? "bg-gold text-white" : "bg-gray-100 text-gray-500"}`}>
                      {bRooms.length}
                    </span>
                  </div>
                  <span className={`text-xs mt-1 ${isActive ? "text-gold/80" : "text-gray-400"}`}>
                    {bBeds} beds total
                  </span>
                </button>
              );
            })}
          </div>

          {/* Building Body */}
          {currentBuilding && (
            <div className="p-6 flex-1 overflow-y-auto">
              {/* Building Header Controls */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
                <div className="text-gray-600 text-sm font-medium">
                  {currentFloors.length} floor(s) · {currentRooms.length} room(s)
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setModal({ type: "edit-building", building: currentBuilding })}
                    className="text-sm font-medium text-gray-600 hover:text-navy flex items-center gap-1.5 px-3 py-1.5 rounded-md hover:bg-gray-50 transition-colors"
                  >
                    <Edit2 size={14} /> Rename
                  </button>
                  {confirmDelete === `building-${currentBuilding.id}` ? (
                    <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 px-3 py-1.5 rounded-md">
                      <span className="font-semibold">Delete building + all floors & rooms?</span>
                      <button onClick={() => deleteBuilding(currentBuilding.id)} className="font-bold hover:underline ml-1">Yes</button>
                      <span className="text-red-300">|</span>
                      <button onClick={() => setConfirmDelete(null)} className="font-bold hover:underline">No</button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setConfirmDelete(`building-${currentBuilding.id}`)}
                      className="text-sm font-medium text-red-600 hover:text-red-700 flex items-center gap-1.5 px-3 py-1.5 rounded-md hover:bg-red-50 transition-colors"
                    >
                      <Trash2 size={14} /> Delete Building
                    </button>
                  )}
                </div>
              </div>

              {/* Floors List */}
              <div className="space-y-6">
                {currentFloors.length === 0 ? (
                  <div className="border-2 border-dashed border-gray-200 rounded-xl p-8 flex flex-col items-center justify-center text-gray-500">
                    <Layers size={32} className="mb-3 text-gray-300" />
                    <p className="font-medium text-sm">No floors added yet</p>
                  </div>
                ) : (
                  currentFloors.map((floor) => {
                    const floorRooms = currentRooms.filter((r) => r.floorId === floor.id);
                    const isCollapsed = collapsedFloors.has(floor.id);
                    const isFloorConfirmingDelete = confirmDelete === `floor-${floor.id}`;

                    return (
                      <div key={floor.id} className="border border-gray-200 rounded-xl overflow-hidden">
                        {/* FLOOR HEADER */}
                        <div className="bg-gray-50 px-4 py-3 border-b border-gray-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                          <div
                            className="flex items-center gap-2 cursor-pointer select-none group"
                            onClick={() => toggleFloorCollapse(floor.id)}
                          >
                            <div className="text-gray-400 group-hover:text-gray-600 transition-colors">
                              {isCollapsed ? <ChevronRight size={18} /> : <ChevronDown size={18} />}
                            </div>
                            <Layers size={16} className="text-gray-500" />
                            <h3 className="font-bold text-gray-800 text-sm uppercase tracking-wide">{floor.name}</h3>
                            <span className="text-gray-500 text-xs font-medium">({floorRooms.length} rooms)</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => setModal({ type: "add-room", buildingId: currentBuilding.id, floorId: floor.id })}
                              className="text-xs font-semibold bg-navy text-white px-3 py-1.5 rounded flex items-center gap-1 hover:bg-navy/90 transition-colors"
                            >
                              <Plus size={14} /> Add Room
                            </button>
                            <button
                              onClick={() => setModal({ type: "edit-floor", floor })}
                              className="p-1.5 text-gray-400 hover:text-navy hover:bg-gray-200 rounded transition-colors"
                            >
                              <Edit2 size={14} />
                            </button>
                            {isFloorConfirmingDelete ? (
                              <div className="flex items-center gap-1.5 text-xs text-red-600 bg-red-100 px-2 py-1 rounded">
                                <span className="font-semibold">Sure?</span>
                                <button onClick={() => deleteFloor(floor.id)} className="hover:underline font-bold">Yes</button>
                                <span>/</span>
                                <button onClick={() => setConfirmDelete(null)} className="hover:underline font-bold">No</button>
                              </div>
                            ) : (
                              <button
                                onClick={() => setConfirmDelete(`floor-${floor.id}`)}
                                className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                              >
                                <Trash2 size={14} />
                              </button>
                            )}
                          </div>
                        </div>

                        {/* FLOOR BODY */}
                        {!isCollapsed && (
                          <div className="p-4 bg-white">
                            {floorRooms.length === 0 ? (
                              <div className="text-center py-6 text-sm text-gray-500">
                                <button
                                  onClick={() => setModal({ type: "add-room", buildingId: currentBuilding.id, floorId: floor.id })}
                                  className="text-gold hover:underline font-semibold"
                                >
                                  Add the first room
                                </button>
                              </div>
                            ) : (
                              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                                {floorRooms.map((room) => {
                                  const isRoomConfirmingDelete = confirmDelete === `room-${room.id}`;
                                  return (
                                    <div key={room.id} className="border border-gray-200 rounded-lg shadow-sm flex flex-col bg-white">
                                      <div className="p-4 flex-1">
                                        <div className="flex justify-between items-start mb-3">
                                          <h4 className="text-lg font-bold text-navy">Room {room.number}</h4>
                                          <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-md ${getStatusColor(room.status)}`}>
                                            {room.status}
                                          </span>
                                        </div>
                                        <div className="flex items-center gap-2 text-sm text-gray-600 mb-2 font-medium">
                                          <Bed size={16} className="text-gray-400" />
                                          {room.type} · {room.bedsTotal} beds
                                        </div>
                                        <div className="text-lg font-bold text-gold mb-4">
                                          {INR(room.pricePerBed)} <span className="text-xs font-medium text-gray-500">/bed/month</span>
                                        </div>
                                        <div className="flex flex-wrap gap-2">
                                          {room.ac && (
                                            <span className="flex items-center gap-1 text-[10px] font-semibold text-blue-700 bg-blue-50 px-2 py-1 rounded border border-blue-100">
                                              <Wind size={12} /> AC
                                            </span>
                                          )}
                                          {room.attachedBath && (
                                            <span className="flex items-center gap-1 text-[10px] font-semibold text-purple-700 bg-purple-50 px-2 py-1 rounded border border-purple-100">
                                              <Bath size={12} /> Bath
                                            </span>
                                          )}
                                          {room.meterNumber && (
                                            <span className="flex items-center gap-1 text-[10px] font-semibold text-amber-700 bg-amber-50 px-2 py-1 rounded border border-amber-100">
                                              <Zap size={12} /> {room.meterNumber}
                                            </span>
                                          )}
                                        </div>
                                      </div>
                                      <div className="border-t border-gray-100 flex p-2 gap-2 bg-gray-50/50 rounded-b-lg">
                                        <button
                                          onClick={() => setModal({ type: "edit-room", room })}
                                          className="flex-1 py-1.5 text-xs font-semibold text-gray-600 bg-white border border-gray-200 rounded hover:bg-gray-50 transition-colors"
                                        >
                                          Edit
                                        </button>
                                        {isRoomConfirmingDelete ? (
                                          <div className="flex-1 flex items-center justify-center gap-1.5 text-xs text-red-600 bg-red-50 border border-red-200 rounded">
                                            <span className="font-semibold">Sure?</span>
                                            <button onClick={() => deleteRoom(room.id)} className="hover:underline font-bold">Yes</button>
                                            <span className="text-red-300">/</span>
                                            <button onClick={() => setConfirmDelete(null)} className="hover:underline font-bold">No</button>
                                          </div>
                                        ) : (
                                          <button
                                            onClick={() => setConfirmDelete(`room-${room.id}`)}
                                            className="px-3 py-1.5 text-gray-400 bg-white border border-gray-200 rounded hover:text-red-600 hover:border-red-200 transition-colors"
                                          >
                                            <Trash2 size={14} />
                                          </button>
                                        )}
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })
                )}
                
                {/* Add Floor Button */}
                <button
                  onClick={() => setModal({ type: "add-floor", buildingId: currentBuilding.id })}
                  className="w-full py-4 border-2 border-dashed border-gray-300 rounded-xl text-gray-500 font-semibold text-sm hover:border-gold hover:text-gold transition-colors flex items-center justify-center gap-2"
                >
                  <Plus size={18} /> Add Floor to {currentBuilding.name}
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* UNIFIED MODAL */}
      {modal && (
        <div 
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setModal(null)}
        >
          <div 
            className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 shrink-0">
              <h2 className="text-lg font-bold text-navy">
                {modal.type === "add-building" && "Add New Building"}
                {modal.type === "edit-building" && "Edit Building"}
                {modal.type === "add-floor" && "Add New Floor"}
                {modal.type === "edit-floor" && "Edit Floor"}
                {modal.type === "add-room" && "Add New Room"}
                {modal.type === "edit-room" && "Edit Room"}
              </h2>
              <button onClick={() => setModal(null)} className="text-gray-400 hover:text-gray-700 transition-colors p-1">
                <X size={20} />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto">
              {(modal.type === "add-building" || modal.type === "edit-building") && (
                <BuildingForm 
                  initialData={modal.type === "edit-building" ? modal.building : undefined}
                  onSave={(name) => saveBuilding(name, modal.type === "edit-building" ? modal.building.id : undefined)}
                  onCancel={() => setModal(null)}
                />
              )}
              
              {(modal.type === "add-floor" || modal.type === "edit-floor") && (
                <FloorForm 
                  initialData={modal.type === "edit-floor" ? modal.floor : undefined}
                  onSave={(name) => saveFloor(name, modal.type === "add-floor" ? modal.buildingId : modal.floor.buildingId, modal.type === "edit-floor" ? modal.floor.id : undefined)}
                  onCancel={() => setModal(null)}
                />
              )}
              
              {(modal.type === "add-room" || modal.type === "edit-room") && (
                <RoomForm 
                  initialData={modal.type === "edit-room" ? modal.room : undefined}
                  buildingId={modal.type === "add-room" ? modal.buildingId : modal.room.buildingId}
                  floorId={modal.type === "add-room" ? modal.floorId : modal.room.floorId}
                  onSave={(data) => saveRoom(data, modal.type === "edit-room" ? modal.room.id : undefined)}
                  onCancel={() => setModal(null)}
                />
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── BUILDING FORM

function BuildingForm({ initialData, onSave, onCancel }: { initialData?: Building, onSave: (name: string) => void, onCancel: () => void }) {
  const [name, setName] = useState(initialData?.name || "");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) onSave(name.trim());
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1 block">Building Name</label>
        <input
          autoFocus
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g. Block A, Wing B"
          className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-gold focus:outline-none transition-colors"
        />
      </div>
      <div className="flex gap-3">
        <button type="button" onClick={onCancel} className="flex-1 px-4 py-2.5 border border-gray-200 text-gray-700 rounded-lg text-sm font-semibold hover:bg-gray-50 transition-colors">Cancel</button>
        <button type="submit" disabled={!name.trim()} className="flex-1 px-4 py-2.5 bg-navy text-white rounded-lg text-sm font-semibold hover:bg-navy/90 transition-colors disabled:opacity-50">Save Building</button>
      </div>
    </form>
  );
}

// ─── FLOOR FORM

function FloorForm({ initialData, onSave, onCancel }: { initialData?: Floor, onSave: (name: string) => void, onCancel: () => void }) {
  const [name, setName] = useState(initialData?.name || "");
  const presets = ["Ground Floor", "1st Floor", "2nd Floor", "3rd Floor", "4th Floor", "Terrace", "Basement"];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) onSave(name.trim());
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1 block">Floor Name</label>
        <input
          autoFocus
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g. Ground Floor, 1st Floor"
          className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-gold focus:outline-none transition-colors mb-3"
        />
        <div className="flex flex-wrap gap-2">
          {presets.map(p => (
            <button
              key={p}
              type="button"
              onClick={() => setName(p)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md border transition-colors ${name === p ? "bg-navy text-white border-navy" : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50"}`}
            >
              {p}
            </button>
          ))}
        </div>
      </div>
      <div className="flex gap-3">
        <button type="button" onClick={onCancel} className="flex-1 px-4 py-2.5 border border-gray-200 text-gray-700 rounded-lg text-sm font-semibold hover:bg-gray-50 transition-colors">Cancel</button>
        <button type="submit" disabled={!name.trim()} className="flex-1 px-4 py-2.5 bg-navy text-white rounded-lg text-sm font-semibold hover:bg-navy/90 transition-colors disabled:opacity-50">Save Floor</button>
      </div>
    </form>
  );
}

// ─── ROOM FORM

function RoomForm({ initialData, buildingId, floorId, onSave, onCancel }: { initialData?: Room, buildingId: string, floorId: string, onSave: (data: Partial<Room>) => void, onCancel: () => void }) {
  const [number, setNumber] = useState(initialData?.number || "");
  const [meterNumber, setMeterNumber] = useState(initialData?.meterNumber || "");
  const [type, setType] = useState<"Single" | "Double" | "Triple">(initialData?.type || "Single");
  const [pricePerBed, setPricePerBed] = useState<string>(initialData?.pricePerBed?.toString() || "");
  const [status, setStatus] = useState<Room["status"]>(initialData?.status || "available");
  const [ac, setAc] = useState(initialData?.ac || false);
  const [attachedBath, setAttachedBath] = useState(initialData?.attachedBath || false);

  const priceNum = parseFloat(pricePerBed) || 0;
  const isComplete = number.trim() !== "" && priceNum > 0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isComplete) {
      onSave({
        buildingId,
        floorId,
        number: number.trim(),
        meterNumber: meterNumber.trim(),
        type,
        pricePerBed: priceNum,
        status,
        ac,
        attachedBath
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1 block">Room Number</label>
          <input
            autoFocus
            value={number}
            onChange={(e) => setNumber(e.target.value)}
            placeholder="e.g. 101"
            className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-gold focus:outline-none transition-colors"
          />
        </div>
        <div>
          <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1 block">Meter Number</label>
          <input
            value={meterNumber}
            onChange={(e) => setMeterNumber(e.target.value)}
            placeholder="e.g. M-101"
            className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-gold focus:outline-none transition-colors"
          />
        </div>
      </div>

      <div>
        <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1 block">Room Type</label>
        <div className="grid grid-cols-3 gap-2">
          {(["Single", "Double", "Triple"] as const).map(t => (
            <button
              key={t}
              type="button"
              onClick={() => setType(t)}
              className={`flex flex-col items-center justify-center p-3 rounded-lg border transition-colors ${type === t ? "bg-navy border-navy text-white" : "bg-white border-gray-200 text-gray-600 hover:bg-gray-50"}`}
            >
              <span className="font-semibold text-sm">{t}</span>
              <span className={`text-[10px] mt-0.5 ${type === t ? "text-gray-300" : "text-gray-400"}`}>{bedCount(t)} bed{bedCount(t) > 1 && "s"}</span>
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1 block">Price Per Bed (Monthly)</label>
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 font-semibold">₹</span>
          <input
            type="number"
            value={pricePerBed}
            onChange={(e) => setPricePerBed(e.target.value)}
            placeholder="0"
            className="w-full pl-7 pr-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-gold focus:outline-none transition-colors"
          />
        </div>
        {(type === "Double" || type === "Triple") && priceNum > 0 && (
          <p className="text-xs text-gray-500 mt-2">
            Total room value: <span className="font-semibold text-gray-700">₹{(priceNum * bedCount(type)).toLocaleString("en-IN")}/month</span> ({bedCount(type)} beds)
          </p>
        )}
      </div>

      <div>
        <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1 block">Current Status</label>
        <select
          value={status}
          // FIX: Explicitly cast the value to the Room["status"] type instead of 'any'
          onChange={(e) => setStatus(e.target.value as Room["status"])}
          className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-gold focus:outline-none transition-colors bg-white"
        >
          <option value="available">Available</option>
          <option value="occupied">Occupied</option>
          <option value="partial">Partial</option>
          <option value="maintenance">Under Maintenance</option>
        </select>
      </div>

      <div>
        <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-2 block">Amenities</label>
        <div className="flex gap-4">
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={ac} onChange={(e) => setAc(e.target.checked)} className="w-4 h-4 text-gold focus:ring-gold border-gray-300 rounded" />
            <span className="text-sm font-medium text-gray-700 flex items-center gap-1.5"><Wind size={16} className="text-gray-400" /> AC Room</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={attachedBath} onChange={(e) => setAttachedBath(e.target.checked)} className="w-4 h-4 text-gold focus:ring-gold border-gray-300 rounded" />
            <span className="text-sm font-medium text-gray-700 flex items-center gap-1.5"><Bath size={16} className="text-gray-400" /> Attached Bath</span>
          </label>
        </div>
      </div>

      <div className="flex gap-3 pt-2">
        <button type="button" onClick={onCancel} className="flex-1 px-4 py-2.5 border border-gray-200 text-gray-700 rounded-lg text-sm font-semibold hover:bg-gray-50 transition-colors">Cancel</button>
        <button type="submit" disabled={!isComplete} className="flex-1 px-4 py-2.5 bg-navy text-white rounded-lg text-sm font-semibold hover:bg-navy/90 transition-colors disabled:opacity-50">Save Room</button>
      </div>
    </form>
  );
}