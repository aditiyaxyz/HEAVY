import type { NextApiRequest, NextApiResponse } from "next";
import jwt from "jsonwebtoken";
import { serialize } from "cookie";

const JWT_SECRET = process.env.JWT_SECRET as string;

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const token = req.query.token;
  if (typeof token !== "string") return res.status(400).send("Invalid request");
  if (!JWT_SECRET) return res.status(500).send("Server not configured");

  try {
    const payload = jwt.verify(token, JWT_SECRET) as { email: string; type: string };

    const sessionToken = jwt.sign({ email: payload.email, type: "session" }, JWT_SECRET, { expiresIn: "7d" });

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

    res.redirect("/");
  } catch {
    res.status(401).send("Invalid or expired link");
  }
}
