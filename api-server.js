import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import fs from "fs/promises";
import path from "path";
import { createUser, findUserByEmail, getAllUsers } from "./lib/users.js";

dotenv.config({ path: ".env.local" });

const app = express();
const PORT = process.env.PORT || 3001;
const JWT_SECRET = process.env.JWT_SECRET;
const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:5173";

// Fail fast if JWT_SECRET is not set
if (!JWT_SECRET) {
  console.error("FATAL ERROR: JWT_SECRET environment variable is not set!");
  process.exit(1);
}

app.use(cors({ origin: FRONTEND_URL, credentials: true }));
app.use(express.json());
app.use(cookieParser());

// Register endpoint
app.post("/api/users/register", async (req, res) => {
  try {
    const { name, email, phone, instagram } = req.body;
    
    if (!name || !email || !phone) {
      return res.status(400).json({ error: "name, email and phone are required" });
    }

    const user = await createUser({ name, email, phone, instagram });
    const sessionToken = jwt.sign({ email: user.email, type: "session" }, JWT_SECRET, { expiresIn: "7d" });

    res.cookie("session", sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7 * 1000, // 7 days
    });

    return res.status(201).json({ ok: true, user });
  } catch (err) {
    return res.status(400).json({ error: err.message || "Failed to register" });
  }
});

// Get current user (session check)
app.get("/api/auth/me", async (req, res) => {
  const token = req.cookies.session;
  if (!token) return res.status(200).json({ user: null });

  try {
    const payload = jwt.verify(token, JWT_SECRET);
    if (payload.type !== "session") return res.status(200).json({ user: null });
    
    const user = await findUserByEmail(payload.email);
    if (!user) return res.status(200).json({ user: null });
    
    return res.status(200).json({ user });
  } catch {
    return res.status(200).json({ user: null });
  }
});

// Logout endpoint
app.post("/api/auth/logout", (req, res) => {
  res.clearCookie("session", { path: "/" });
  return res.status(200).json({ ok: true, message: "Logged out" });
});

// Register drop interest
app.post("/api/users/register-drop", async (req, res) => {
  const token = req.cookies.session;
  if (!token) {
    return res.status(401).json({ error: "Not authenticated" });
  }

  try {
    const payload = jwt.verify(token, JWT_SECRET);
    const user = await findUserByEmail(payload.email);
    
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const { details } = req.body;
    
    // Store the drop registration in a simple JSON file
    const dataDir = path.join(process.cwd(), "data");
    const dropsFile = path.join(dataDir, "drops.json");
    
    await fs.mkdir(dataDir, { recursive: true });
    
    let drops = [];
    try {
      const raw = await fs.readFile(dropsFile, "utf-8");
      drops = JSON.parse(raw);
    } catch {
      drops = [];
    }
    
    drops.push({
      id: `drop_${Date.now()}`,
      username: user.name,
      email: user.email,
      phone: user.phone,
      details: details || "PHANTOM BOMBER",
      timestamp: new Date().toISOString(),
    });
    
    await fs.writeFile(dropsFile, JSON.stringify(drops, null, 2), "utf-8");
    
    return res.status(200).json({ ok: true, message: "Successfully registered for drop" });
  } catch (err) {
    return res.status(500).json({ error: "Server error" });
  }
});

// Admin: Export drop registrations (simple CSV)
app.get("/api/admin/export-drops", async (req, res) => {
  try {
    const dropsFile = path.join(process.cwd(), "data", "drops.json");
    
    let drops = [];
    try {
      const raw = await fs.readFile(dropsFile, "utf-8");
      drops = JSON.parse(raw);
    } catch {
      drops = [];
    }
    
    // Simple CSV generation
    const csv = [
      "ID,Username,Email,Phone,Details,Timestamp",
      ...drops.map(d => `${d.id},"${d.username}","${d.email}","${d.phone}","${d.details}","${d.timestamp}"`)
    ].join("\n");
    
    res.setHeader("Content-Type", "text/csv");
    res.setHeader("Content-Disposition", "attachment; filename=drop_registrations.csv");
    return res.status(200).send(csv);
  } catch (err) {
    return res.status(500).json({ error: "Failed to export" });
  }
});

// Admin: Get all drop registrations as JSON
app.get("/api/admin/drops", async (req, res) => {
  try {
    const dropsFile = path.join(process.cwd(), "data", "drops.json");
    
    let drops = [];
    try {
      const raw = await fs.readFile(dropsFile, "utf-8");
      drops = JSON.parse(raw);
    } catch {
      drops = [];
    }
    
    return res.status(200).json({ drops });
  } catch (err) {
    return res.status(500).json({ error: "Failed to fetch drops" });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 HEAVY API Server running on http://localhost:${PORT}`);
});
