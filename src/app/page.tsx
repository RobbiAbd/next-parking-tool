"use client";

import { useHelpStore } from "@/@stores/helpStore";
import { useParkingLotStore } from "@/@stores/parkingLotStore";
import Button from "@/components/elements/Button";
import { useEffect } from "react";
import { generateBarcodeAndPDF } from "@/@utils/helpers";

export default function Page() {
  const { parkingLot, fetchParkingLot, enterParking, parkingCard, error } =
    useParkingLotStore();

  const { setHelpRequested } = useHelpStore(); // Access the Zustand store

  const handleClickHelp = () => {
    setHelpRequested(true); // Set the helpRequested state to true when button is clicked
  };

  useEffect(() => {
    fetchParkingLot();
  }, [fetchParkingLot]);

  // Call generateBarcodeAndPDF whenever parkingCard.barcode is updated
  useEffect(() => {
    if (parkingCard?.barcode) {
      generateBarcodeAndPDF(parkingCard.barcode); // Generate PDF when the barcode becomes available
    }
  }, [parkingCard?.barcode]);

  if (!parkingLot) {
    return <div>Loading...</div>;
  }

  const handleEnterParking = async () => {
    await enterParking(); // Call enterParking to enter the parking lot
    // No need to call generateBarcodeAndPDF here; it will be triggered by the useEffect above
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
          <Button
            label="Tombol Bantuan"
            variant="danger"
            size="md"
            onClick={handleClickHelp}
          />
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
