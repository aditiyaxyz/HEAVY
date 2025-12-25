import type { NextApiRequest, NextApiResponse } from "next";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";

const JWT_SECRET = process.env.JWT_SECRET as string;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).end();
  const { email } = req.body as { email?: string };
  if (!email) return res.status(400).json({ error: "Email required" });
  if (!JWT_SECRET) return res.status(500).json({ error: "Server not configured" });

  const token = jwt.sign({ email, type: "magic" }, JWT_SECRET, { expiresIn: "15m" });
  const link = `${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/verify?token=${encodeURIComponent(token)}`;

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: { user: process.env.MAIL_USER, pass: process.env.MAIL_PASS },
  });

  await transporter.sendMail({
    from: `"HEAVY" <${process.env.MAIL_USER}>`,
    to: email,
    subject: "Login to HEAVY",
    html: `<p>Click <a href="${link}">this link</a> to log in. It expires in 15 minutes.</p>`,
  });

  res.json({ message: "Login link sent" });
}
