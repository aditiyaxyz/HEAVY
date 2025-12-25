import type { NextApiRequest, NextApiResponse } from "next";
import jwt from "jsonwebtoken";
import { findUserByEmail } from "../../../lib/users";

const JWT_SECRET = process.env.JWT_SECRET as string;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const token = req.cookies.session;
  if (!token || !JWT_SECRET) return res.status(200).json({ user: null });

  try {
    const payload = jwt.verify(token, JWT_SECRET) as { email: string; type: string };
    if (payload.type !== "session") return res.status(200).json({ user: null });
    const user = await findUserByEmail(payload.email);
    if (!user) return res.status(200).json({ user: null });
    return res.status(200).json({ user });
  } catch {
    return res.status(200).json({ user: null });
  }
}
