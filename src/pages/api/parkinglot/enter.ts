import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/@lib/prisma"; // Assuming you set up Prisma in `lib/prisma.ts`

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    try {
      // Cek apakah masih ada space kosong
      const parkingLot = await prisma.parkingLot.findFirst();

      if (
        !parkingLot ||
        parkingLot.occupied_spaces >= parkingLot.total_spaces
      ) {
        return res.status(400).json({ error: "No available parking spaces" });
      }

      // Simulasi nomor kendaraan, bisa diganti dengan barcode atau input dari user
      const vehicle = {
        license_plate: null,
        vehicle_type: "motor",
        barcode: Date.now().toString(),
        entry_time: new Date(),
      };

      // Menambahkan record baru pada ParkingCard
      const parkingCard = await prisma.parkingCard.create({
        data: vehicle,
      });

      // Memperbarui data ParkingLot (menambahkan occupied space)
      const updatedParkingLot = await prisma.parkingLot.update({
        where: { id: parkingLot.id },
        data: { occupied_spaces: parkingLot.occupied_spaces + 1 },
      });

      res.status(200).json({ parkingCard, updatedParkingLot });
    } catch (error) {
      res.status(500).json({ error: "Failed to process parking entry" });
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}
