export interface Room {
  id: string;
  floorId: string;
  buildingId: string;
  roomNumber: string; 
  number: string;     
  type: string; 
  capacity: number;
  status: "available" | "occupied" | "maintenance" | "partial";
  bedsTotal: number;    // <-- Fixes the line 336 error
  pricePerBed: number;  // <-- Fixes the line 339 error waiting to happen
}