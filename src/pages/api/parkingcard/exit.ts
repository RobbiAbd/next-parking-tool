import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/@lib/prisma"; // Path to Prisma client

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    const { barcode, amount_paid, change_given, fee_paid } = req.body;

    try {
      // Check if all required fields are present
      if (!barcode || amount_paid === undefined || change_given === undefined) {
        return res.status(400).json({ error: "Missing required fields" });
      }

      // Find the parking card by barcode
      const parkingCard = await prisma.parkingCard.findFirst({
        where: { barcode },
      });

      if (!parkingCard) {
        return res.status(404).json({ error: "Parking card not found" });
      }

      // Update parking card with exit time
      const updatedParkingCard = await prisma.parkingCard.update({
        where: { id: parkingCard.id },  // Use the ID for the update
        data: {
          exit_time: new Date(),
          fee_paid: fee_paid
        },
      });

      // Create a transaction record
      const transaction = await prisma.transaction.create({
        data: {
          parking_card_id: updatedParkingCard.id,
          amount_paid,
          change_given,
        },
      });

      // Update parking lot (decrement occupied spaces)
      const updatedParkingLot = await prisma.parkingLot.update({
        where: { id: 1 }, // Assuming there's only one parking lot
        data: { occupied_spaces: { decrement: 1 } },
      });

      // Success response
      res.status(200).json({
        message: "Transaction completed successfully",
        transaction, // You can return the transaction details here for further verification
      });
    } catch (error) {
      console.error("Transaction error:", error);  // Log the error to console
      res.status(500).json({ error: "Failed to process transaction", details: error.message });
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}
