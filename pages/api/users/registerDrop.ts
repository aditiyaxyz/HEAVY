// HEAVY/pages/api/users/registerDrop.ts
import type { NextApiRequest, NextApiResponse } from "next";
import jwt from "jsonwebtoken";
import dbConnect from "../../../lib/dbConnect"; // adjust if your dbConnect path differs
import User from "../../../models/User";        // adjust path to your User model

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  await dbConnect();

  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ message: "No token provided" });
    }

    const token = authHeader.split(" ")[1];
    const decoded: any = jwt.verify(token, process.env.JWT_SECRET as string);

    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Example: push drop entry into user doc
    user.drops = user.drops || [];
    user.drops.push({ date: new Date(), status: "registered" });
    await user.save();

    return res.status(200).json({ message: "Successfully registered for drop" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
}
