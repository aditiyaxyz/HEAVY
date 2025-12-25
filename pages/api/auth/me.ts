import type { NextApiRequest, NextApiResponse } from "next";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET as string;

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const token = req.cookies.session;
  if (!token || !JWT_SECRET) return res.status(200).json({ user: null });

  try {
    const payload = jwt.verify(token, JWT_SECRET) as { email: string; type: string };
    if (payload.type !== "session") return res.status(200).json({ user: null });
    res.status(200).json({ user: { email: payload.email } });
  } catch {
    res.status(200).json({ user: null });
  }
}
