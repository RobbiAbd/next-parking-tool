"use client";

import { useEffect, useState } from "react";
import Table from "@/components/modules/Tables";
import { useHelpStore } from "@/@stores/helpStore";
import { generateBarcodeAndPDF } from "@/@utils/helpers";
import Button from "@/components/elements/Button";

export default function AdminPage() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [barcodeToGenerate, setBarcodeToGenerate] = useState<string | null>(
    null
  ); // State to hold the barcode to generate
  const { helpRequested, setHelpRequested } = useHelpStore();

  const columns = [
    { key: "license_plate", label: "License Plate" },
    { key: "vehicle_type", label: "Vehicle Type" },
    {
      key: "barcode",
      label: "Barcode",
      render: (value: string) => (
        <Button
          label={value}
          variant="primary"
          size="md"
          // Use an arrow function to pass the barcode value to the handler
          onClick={() => handleGenerateBarcode(value)}
        />
      ),
    },    
    {
      key: "entry_time",
      label: "Entry Time",
      render: (value: string) => new Date(value).toLocaleString(),
    },
    {
      key: "exit_time",
      label: "Exit Time",
      render: (value: string | null) =>
        value ? new Date(value).toLocaleString() : "Still Parked",
    },
    {
      key: "fee_paid",
      label: "Fee Paid",
      render: (value: number | null) =>
        value !== null ? `Rp ${value.toLocaleString()}` : "-",
    },
    {
      key: "Transaction",
      label: "Transactions",
      render: (transactions: any[]) => {
        return transactions && transactions.length > 0
          ? transactions
              .map(
                (t) =>
                  `Paid: Rp ${t.amount_paid.toLocaleString()}, Change: Rp ${t.change_given.toLocaleString()}`
              )
              .join("; ")
          : "No Transactions";
      },
    },
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/parkingcard/transactions");
        const result = await response.json();
        if (Array.isArray(result)) {
          setData(result);
        } else {
          setError("Failed to load data");
        }
      } catch (err) {
        setError("Failed to load data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (helpRequested) {
      alert("Someone needs help!"); // Trigger the alert when help is requested
    }
  }, [helpRequested, setHelpRequested]); // Effect runs when helpRequested changes

  // Handle the click on the barcode to generate the barcode image
  const handleGenerateBarcode = (barcode: string) => {
    setBarcodeToGenerate(barcode);
    generateBarcodeAndPDF(barcode); // Call function to generate and show/download PDF
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Admin - Parking Cards</h1>
      <Table columns={columns} data={data} />
    </div>
  );
}
