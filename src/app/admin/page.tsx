"use client";

import { useEffect, useState } from "react";
import Table from "@/components/modules/Tables";

export default function AdminPage() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const columns = [
    { key: "license_plate", label: "License Plate" },
    { key: "vehicle_type", label: "Vehicle Type" },
    { key: "barcode", label: "Barcode" },
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
        console.log("Transactions Data:", transactions);
        return transactions && transactions.length > 0
          ? transactions
              .map(
                (t) =>
                  `Paid: Rp ${t.amount_paid.toLocaleString()}, Change: Rp ${t.change_given.toLocaleString()}`
              )
              .join("; ")
          : "No Transactions";
      },
    }
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/parkingcard/transactions");
        const result = await response.json();
        console.log("API Response:", result); // Debug API response structure
        if (Array.isArray(result)) {
          setData(result);
        } else {
          console.error("API did not return an array");
          setError("Failed to load data");
        }
      } catch (err) {
        console.error("Fetch error:", err);
        setError("Failed to load data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Admin - Parking Cards</h1>
      <Table columns={columns} data={data} />
    </div>
  );
}
