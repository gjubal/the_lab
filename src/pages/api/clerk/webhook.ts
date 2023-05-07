import { type NextApiRequest, type NextApiResponse } from "next";
import type { WebhookEvent } from "@clerk/clerk-sdk-node";
import { prisma } from "../../../server/db";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    const { type, data } = req.body as WebhookEvent;

    if (type === "user.created") {
      const { id: clerkId, username, primary_email_address_id } = data;
      const email = data.email_addresses.find(
        (e) => e.id === primary_email_address_id
      )?.email_address;

      try {
        if (!email) {
          res.status(400).json({ error: "No email address found." });
        }

        const existingUser = await prisma.user.findUnique({
          where: {
            username,
          },
        });

        if (existingUser) {
          res
            .status(400)
            .json({ error: "User with the username provided already exists." });
        }

        const user = await prisma.user.create({
          data: {
            id: clerkId,
            email: email as string,
            username,
          },
        });

        res.status(201).json(user);
      } catch (error) {
        console.error(error);
        res.status(500).end();
      }
    }
  } else {
    res.status(405).end();
  }
}
