"use client";

import { useState, useEffect, useRef } from "react";
import Webcam from "react-webcam";
import { BrowserMultiFormatReader } from "@zxing/library";
import Button from "@/components/elements/Button";

export default function ExitPage() {
  const [scannedBarcode, setScannedBarcode] = useState<string>("");
  const [paymentAmount, setPaymentAmount] = useState<number | null>(null);
  const [amountPaid, setAmountPaid] = useState<number | null>(null);
  const [changeGiven, setChangeGiven] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isManualEntry, setIsManualEntry] = useState<boolean>(false);
  const [isScanning, setIsScanning] = useState<boolean>(false); // Track if scanning is active
  const [isPaymentDone, setIsPaymentDone] = useState<boolean>(false); // Track if payment is already done

  const webcamRef = useRef<any>(null);
  const scannerRef = useRef<BrowserMultiFormatReader | null>(null);

  // Barcode scanner setup
  const handleScanBarcode = (result: string) => {
    if (result) {
      setScannedBarcode(result);
      // Fetch parking card details based on barcode
      fetchParkingCardDetails(result);
    }
  };

  const handlePayment = () => {
    if (amountPaid && paymentAmount && changeGiven !== null) {
      const change = amountPaid - paymentAmount;
      setChangeGiven(change);

      // Update parking transaction
      updateParkingTransaction();
    }
  };

  const fetchParkingCardDetails = async (barcode: string) => {
    try {
      // Fetch the parking card details based on the barcode
      const response = await fetch(`/api/parkingcard/${barcode}`);
      const data = await response.json();

      if (data.error) {
        setError(data.error);
        return;
      }

      const entryTime = new Date(data.entry_time);
      const exitTime = new Date();

      // Check if exit_time is already filled
      if (data.fee_paid !== null && data.fee_paid !== undefined) {
        setIsPaymentDone(true); // Payment already completed
        setError(null); // Clear any previous errors
        setTimeout(() => {
          window.location.reload(); // Reload the page after 3 seconds
        }, 3000);
        return;
      }

      const parkingDuration =
        (exitTime ? exitTime.getTime() - entryTime.getTime() : new Date().getTime()) / 1000 / 60 / 60; // Duration in hours

      // Calculate the parking fee
      let fee = 0;

      // If the duration is less than 1 hour, set the fee to 2000 IDR
      if (parkingDuration < 1) {
        fee = 2000;
      } else {
        fee = parkingDuration * 2000; // Fee based on the duration (2000 IDR per hour)
      }

      setPaymentAmount(fee);
      setError(null); // Clear any previous errors
    } catch (err) {
      console.error("Failed to fetch parking card details:", err);
      setError("Failed to fetch parking card details");
    }
  };

  const updateParkingTransaction = async () => {
    try {
      // Make API call to update the transaction and exit time
      const response = await fetch(`/api/parkingcard/exit`, {
        method: "POST",
        body: JSON.stringify({
          barcode: scannedBarcode,
          amount_paid: amountPaid,
          change_given: changeGiven,
          fee_paid: amountPaid,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();

      if (data.error) {
        setError(data.error);
        return;
      }

      // Show success message for a few seconds
      setSuccessMessage("Payment Successful! You can now exit the parking.");

      // Refresh the page after 3 seconds
      setTimeout(() => {
        window.location.reload(); // Reload the page after 3 seconds
      }, 3000);
    } catch (err) {
      console.error("Failed to process payment:", err);
      setError("Failed to process payment");
    }
  };

  useEffect(() => {
    if (isScanning && webcamRef.current) {
      // Initialize the barcode scanner
      const scanner = new BrowserMultiFormatReader();
      scannerRef.current = scanner;

      // Decode barcode from the video feed
      const videoElement = webcamRef.current.video;

      // Start scanning for barcodes
      const scanBarcode = () => {
        if (videoElement) {
          scanner.decodeFromVideoDevice(null, videoElement, (result, err) => {
            if (result) {
              handleScanBarcode(result.getText());
            } else if (err) {
              console.error("Error scanning barcode:", err);
            }
          });
        }
      };

      scanBarcode(); // Start scanning

      return () => {
        if (scannerRef.current) {
          scannerRef.current.reset();
        }
      };
    }
  }, [isScanning]); // Only re-run the scanning setup when isScanning changes

  useEffect(() => {
    if (amountPaid !== null && paymentAmount !== null) {
      const change = amountPaid - paymentAmount;
      setChangeGiven(change > 0 ? change : 0); // Ensure the change is not negative
    }
  }, [amountPaid, paymentAmount]);

  const handleManualSubmit = () => {
    // Manually entered barcode
    if (scannedBarcode) {
      fetchParkingCardDetails(scannedBarcode);
    }
  };

  const handleStartScanning = () => {
    setIsScanning(true); // Start scanning
    setIsManualEntry(false); // Disable manual entry mode
    setScannedBarcode(""); // Clear any previously entered barcode
  };

  return (
    <div className="p-4">
      <h1 className="text-center">Exit Parking</h1>

      {isScanning && (
        <div className="flex justify-center mb-4">
          <Webcam
            ref={webcamRef}
            videoConstraints={{ facingMode: "environment" }} // Use back camera
            audio={false}
            screenshotFormat="image/jpeg"
            onUserMediaError={(error) =>
              console.log("Error opening webcam:", error)
            }
          />
        </div>
      )}

      {!isScanning && !isPaymentDone && (
        <div className="text-center mb-4">
          <Button
            label="Scan Barcode"
            variant="success"
            size="md"
            onClick={handleStartScanning}
          />
        </div>
      )}

      {isPaymentDone && (
        <div className="text-center text-green-500 mt-4">
          <p>Payment already paid! You can exit the parking.</p>
        </div>
      )}

      {!isScanning && !isPaymentDone && (
        <div className="text-center mb-4">
          <input
            type="text"
            value={scannedBarcode}
            onChange={(e) => {
              setScannedBarcode(e.target.value);
              setIsManualEntry(true);
            }}
            placeholder="Or enter barcode number"
            className="p-2 border rounded"
          />
        </div>
      )}

      {isManualEntry && !isPaymentDone && (
        <div className="text-center mb-4">
          <Button
            label="Submit"
            variant="success"
            size="md"
            onClick={handleManualSubmit}
          />
        </div>
      )}

      {paymentAmount !== null && !isPaymentDone && (
        <div className="mt-4">
          <p>Biaya Parkir: Rp {paymentAmount.toLocaleString()}</p>
          <input
            type="number"
            placeholder="Amount Paid"
            className="p-2 border rounded mt-2"
            onChange={(e) => setAmountPaid(parseFloat(e.target.value))}
          />
        </div>
      )}

      {amountPaid !== null && paymentAmount !== null && (
        <div className="mt-4">
          <p>Kembalian: Rp {changeGiven !== null ? changeGiven.toLocaleString() : "0"}</p>
        </div>
      )}

      {paymentAmount !== null && changeGiven !== null && !isPaymentDone && (
        <div className="mt-4 text-center">
          <Button
            label="Pay Now"
            variant="success"
            size="md"
            onClick={handlePayment}
          />
        </div>
      )}

      {error && <div className="text-red-500 text-center mt-4">{error}</div>}

      {successMessage && (
        <div className="text-green-500 text-center mt-4">{successMessage}</div>
      )}
    </div>
  );
}
