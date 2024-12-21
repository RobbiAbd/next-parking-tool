import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/@lib/prisma"; // Assuming you set up Prisma in `lib/prisma.ts`

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { identifier } = req.query; // Either barcode or license plate

  try {
    // Try to find the parking card by either barcode or license plate
    const parkingCard = await prisma.parkingCard.findFirst({
      where: {
        OR: [
          { barcode: identifier as string },
          { license_plate: identifier as string }
        ],
      },
    });

    if (!parkingCard) {
      return res.status(404).json({ error: "Parking card not found" });
    }

    // Calculate the fee (example: based on entry_time and exit_time)
    const entryTime = new Date(parkingCard.entry_time);
    const exitTime = new Date();
    const parkingDuration = (exitTime.getTime() - entryTime.getTime()) / 1000 / 60 / 60; // Duration in hours

    const fee = parkingDuration * 10; // Example: $10 per hour

    return res.status(200).json({
      ...parkingCard,
      parking_fee: fee,
      exit_time: exitTime,
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch parking card details" });
  }
}
