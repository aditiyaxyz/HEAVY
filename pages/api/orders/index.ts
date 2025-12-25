import type { NextApiRequest, NextApiResponse } from "next";
import jwt from "jsonwebtoken";
import { createOrder, getOrdersForUser } from "../../../lib/users";

const JWT_SECRET = process.env.JWT_SECRET as string;

function readSession(req: NextApiRequest): string | null {
  return req.cookies.session || null;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (!JWT_SECRET) return res.status(500).json({ error: "Server not configured" });

  const session = readSession(req);
  if (!session) return res.status(401).json({ error: "Not authenticated" });

  try {
    const { email } = jwt.verify(session, JWT_SECRET) as { email: string; type: string };
    if (req.method === "GET") {
      const orders = await getOrdersForUser(email);
      return res.status(200).json({ orders });
    }

    if (req.method === "POST") {
      const { items, total, payment } = req.body as { items: any[]; total: number; payment?: any };
      if (!items || typeof total !== "number") return res.status(400).json({ error: "Invalid payload" });
      const order = await createOrder({ userEmail: email, items, total, payment });
      return res.status(201).json({ ok: true, order });
    }

    return res.status(405).end();
  } catch {
    return res.status(401).json({ error: "Invalid session" });
  }
}
