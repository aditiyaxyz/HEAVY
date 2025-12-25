// HEAVY/pages/api/users/exportDropRegistry.ts
import type { NextApiRequest, NextApiResponse } from "next";
import dbConnect from "../../../lib/dbConnect";
import User from "../../../models/User";
import { Parser } from "json2csv";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  await dbConnect();

  try {
    const users = await User.find({}, "email drops"); // only fetch email + drops
    const data = users.map((u) =>
      u.drops.map((d: any) => ({
        email: u.email,
        date: d.date,
        status: d.status,
      }))
    ).flat();

    const parser = new Parser({ fields: ["email", "date", "status"] });
    const csv = parser.parse(data);

    res.setHeader("Content-Type", "text/csv");
    res.setHeader("Content-Disposition", "attachment; filename=drop_registry.csv");
    res.status(200).send(csv);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
}
