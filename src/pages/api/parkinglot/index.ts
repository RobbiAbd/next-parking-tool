import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/@lib/prisma"; // Assuming you set up Prisma in `lib/prisma.ts`

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    try {
      const parkingLot = await prisma.parkingLot.findFirst(); // Ambil data pertama
      res.status(200).json(parkingLot);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch parking lot data" });
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}
