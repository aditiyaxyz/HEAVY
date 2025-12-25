import type { NextApiRequest, NextApiResponse } from "next";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET as string;

type CartItem = { id: string; name: string; price: number; image?: string; qty: number };
type CartPayload = { email: string; cart: CartItem[] };

function readSession(req: NextApiRequest): string | null {
  return req.cookies.session || null;
}

function readCart(req: NextApiRequest): CartItem[] {
  const raw = req.cookies.user_cart;
  if (!raw || !JWT_SECRET) return [];
  try {
    const payload = jwt.verify(raw, JWT_SECRET) as CartPayload;
    return payload.cart || [];
  } catch {
    return [];
  }
}

function writeCart(res: NextApiResponse, email: string, cart: CartItem[]) {
  const token = jwt.sign({ email, cart }, JWT_SECRET, { expiresIn: "7d" });
  res.setHeader("Set-Cookie", [
    `user_cart=${token}; Path=/; Max-Age=${60 * 60 * 24 * 7}; SameSite=Strict; ${process.env.NODE_ENV === "production" ? "Secure;" : ""}`,
  ]);
}

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (!JWT_SECRET) return res.status(500).json({ error: "Server not configured" });

  if (req.method === "GET") {
    const session = readSession(req);
    const cart = readCart(req);
    return res.status(200).json({ authenticated: !!session, cart });
  }

  if (req.method === "POST") {
    const session = readSession(req);
    if (!session) return res.status(401).json({ error: "Not authenticated" });

    try {
      const { email } = jwt.verify(session, JWT_SECRET) as { email: string; type: string };
      const { cart } = req.body as { cart: CartItem[] };
      writeCart(res, email, cart);
      return res.status(200).json({ ok: true });
    } catch {
      return res.status(401).json({ error: "Invalid session" });
    }
  }

  return res.status(405).end();
}
