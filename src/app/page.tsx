"use client";

import { useParkingLotStore } from "@/@stores/parkingLotStore";
import Button from "@/components/elements/Button";
import { useEffect } from "react";

export default function Page() {
  const { parkingLot, fetchParkingLot, enterParking, error } =
    useParkingLotStore();

  useEffect(() => {
    fetchParkingLot();
  }, [fetchParkingLot]);

  if (!parkingLot) {
    return <div>Loading...</div>;
  }

  const handleEnterParking = async () => {
    await enterParking(); // Panggil fungsi untuk memasukkan kendaraan ke parkir
  };

  const isParkingFull = parkingLot.occupied_spaces >= parkingLot.total_spaces;

  return (
    <div className="p-4">
      <h3 className="text-center">
        Slot Parkir: {parkingLot.occupied_spaces}/{parkingLot.total_spaces}
      </h3>
      <h1 className="text-center">Ambil Kartu</h1>
      <div className="flex justify-center gap-x-4">
        <div>
          <Button label="Tombol Bantuan" variant="danger" size="md" />
        </div>
        {!isParkingFull && (
          <div>
            <Button
              label="Tekan Tombol"
              variant="success"
              size="md"
              onClick={handleEnterParking}
            />
          </div>
        )}
      </div>

      {/* Menampilkan pesan error jika parkir penuh */}
      {error && (
        <div className="text-red-500 text-center mt-4">
          {error === "No available parking spaces"
            ? "Parkir penuh! Silakan coba lagi nanti."
            : error}
        </div>
      )}
    </div>
  );
}
