import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/@lib/prisma"; // Adjust the path if necessary

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    try {
      const parkingCards = await prisma.parkingCard.findMany({
        include: {
          Transaction: true, // Include related transactions
        },
        orderBy: {
          entry_time: "desc", // Order by entry_time ascending
        },
      });

      res.status(200).json(parkingCards);
    } catch (error) {
      console.error("Error fetching parking cards:", error);
      res.status(500).json({ error: "Failed to fetch parking cards" });
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}
