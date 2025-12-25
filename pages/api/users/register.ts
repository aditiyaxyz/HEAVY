import type { NextApiRequest, NextApiResponse } from "next";
import { createUser } from "../../../lib/users";
import jwt from "jsonwebtoken";
import { serialize } from "cookie";

const JWT_SECRET = process.env.JWT_SECRET as string;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).end();
  if (!JWT_SECRET) return res.status(500).json({ error: "Server not configured" });

  const { name, email, phone, instagram } = req.body as {
    name?: string;
    email?: string;
    phone?: string;
    instagram?: string;
  };

  if (!name || !email || !phone) return res.status(400).json({ error: "name, email and phone are required" });

  try {
    const user = await createUser({ name, email, phone, instagram });
    const sessionToken = jwt.sign({ email: user.email, type: "session" }, JWT_SECRET, { expiresIn: "7d" });

    res.setHeader(
      "Set-Cookie",
      serialize("session", sessionToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        path: "/",
        maxAge: 60 * 60 * 24 * 7,
      })
    );

    return res.status(201).json({ ok: true, user });
  } catch (err: any) {
    return res.status(400).json({ error: err.message || "Failed to register" });
  }
}
