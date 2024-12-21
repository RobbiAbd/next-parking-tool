"use client";

import { useVehicleStore } from "@/@stores/vehicleStore";
import Button from "@/components/elements/Button";
import Table from "@/components/modules/Tables";
import { useEffect } from "react";

export default function Page() {
  const { vehicles, fetchVehicles } = useVehicleStore();

  useEffect(() => {
    fetchVehicles();
  }, [fetchVehicles]);

  const columns = [
    { key: "license_plate", label: "License Plate" },
    { key: "vehicle_type", label: "Vehicle Type" },
    { key: "barcode", label: "Barcode" },
    {
      key: "created_at",
      label: "Created At",
      render: (value: string) => {
        const date = new Date(value);
        return `${date.toLocaleDateString()} ${date.toLocaleTimeString(
          undefined,
          { hour12: false }
        )}`;
      },
    },
    {
      key: "actions",
      label: "Actions",
      render: (value: any, row: any) => (
        <div>
          <Button label="Edit" variant="primary" size="sm" />
          <Button label="Delete" variant="danger" size="sm" className="ml-2" />
        </div>
      ),
    },
  ];

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Vehicles</h1>
      <Table columns={columns} data={vehicles} />
    </div>
  );
}
