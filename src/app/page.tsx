"use client";

import { useHelpStore } from "@/@stores/helpStore";
import { useParkingLotStore } from "@/@stores/parkingLotStore";
import Button from "@/components/elements/Button";
import { useEffect, useState } from "react";
import { generateBarcodeAndPDF } from "@/@utils/helpers";
import withReactContent from "sweetalert2-react-content";
import Swal from "sweetalert2";

export default function Page() {
  const { parkingLot, fetchParkingLot, enterParking, parkingCard, error } =
    useParkingLotStore();
  const swalHelp = withReactContent(Swal);

  const { setHelpRequested } = useHelpStore(); // Access the Zustand store

  const [isButtonDisabled, setIsButtonDisabled] = useState(false); // Manage button disabled state

  const handleClickHelp = () => {
    swalHelp.fire({
      title: "Information",
      text: "Petugas akan segera membantu",
    });
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

  const playSound = () => {
    const audio = new Audio("/audio/entry.mp3"); // Initialize audio
    audio.play(); // Play the sound
  };

  const handleEnterParking = async () => {
    setIsButtonDisabled(true); // Disable the button immediately
    await enterParking(); // Call enterParking to enter the parking lot
    playSound()

    setTimeout(() => {
      setIsButtonDisabled(false); // Re-enable the button after 5 seconds
    }, 5000);
  };

  const isParkingFull = parkingLot.occupied_spaces >= parkingLot.total_spaces;

  return (
    <div className="p-4">
      <h3 className="text-center font-bold">
        Slot Parkir: {parkingLot.occupied_spaces}/{parkingLot.total_spaces}
      </h3>
      <h1 className="text-center font-bold">Ambil Kartu</h1>
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
              disabled={isButtonDisabled} // Disable the button if isButtonDisabled is true
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
