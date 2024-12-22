import { ParkingCard } from "@prisma/client";
import { create } from "zustand";

interface ParkingLot {
  id: number;
  total_spaces: number;
  occupied_spaces: number;
  created_at: string;
  updated_at: string;
}

interface ParkingLotStore {
  parkingLot: ParkingLot | null;
  parkingCard: ParkingCard | null;
  fetchParkingLot: () => Promise<void>;
  enterParking: () => Promise<void>;
  error: string | null; // Untuk menampilkan pesan error,
}

export const useParkingLotStore = create<ParkingLotStore>((set) => ({
  parkingLot: null,
  parkingCard: null,
  error: null,
  fetchParkingLot: async () => {
    try {
      const response = await fetch("/api/parkinglot"); // API untuk ambil data parkir
      const data: ParkingLot = await response.json();
      set({ parkingLot: data });
    } catch (error) {
      console.error("Failed to fetch parking lot data:", error);
    }
  },
  enterParking: async () => {
    try {
      const response = await fetch("/api/parkinglot/enter", {
        method: "POST",
      });
      const data = await response.json();
      if (response.ok) {
        set({ parkingLot: data.updatedParkingLot, parkingCard: data.parkingCard, error: null }); // Update parkingLot setelah kendaraan masuk
        console.log("Parking entry successful", data);
      } else {
        set({ error: data.error }); // Menangani error jika parkir penuh
        console.error(data.error);
      }
    } catch (error) {
      set({ error: "Failed to enter parking" });
      console.error("Failed to enter parking:", error);
    }
  },
}));
