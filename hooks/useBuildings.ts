"use client";
import { useState, useEffect } from "react";
import { collection, query, orderBy, onSnapshot, where } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Building, Floor, Room } from "@/types";

export const useBuildings = () => {
  const [buildings, setBuildings] = useState<Building[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const q = query(collection(db, "buildings"), orderBy("createdAt", "asc"));
    const unsubscribe = onSnapshot(q, 
      (snapshot) => {
        setBuildings(snapshot.docs.map(doc => doc.data() as Building));
        setLoading(false);
      },
      (err) => {
        setError(err.message);
        setLoading(false);
      }
    );
    return () => unsubscribe();
  }, []);

  return { buildings, loading, error };
};

export const useFloors = (buildingId: string | null) => {
  const [floors, setFloors] = useState<Floor[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!buildingId) {
      setFloors([]);
      setLoading(false);
      return;
    }
    const q = query(collection(db, "floors"), where("buildingId", "==", buildingId), orderBy("order", "asc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setFloors(snapshot.docs.map(doc => doc.data() as Floor));
      setLoading(false);
    });
    return () => unsubscribe();
  }, [buildingId]);

  return { floors, loading };
};

export const useRooms = (buildingId: string | null) => {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!buildingId) {
      setRooms([]);
      setLoading(false);
      return;
    }
    const q = query(collection(db, "rooms"), where("buildingId", "==", buildingId));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setRooms(snapshot.docs.map(doc => doc.data() as Room));
      setLoading(false);
    });
    return () => unsubscribe();
  }, [buildingId]);

  return { rooms, loading };
};