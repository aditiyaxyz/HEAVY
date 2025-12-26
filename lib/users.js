import fs from "fs/promises";
import path from "path";
import { randomUUID } from "crypto";

const DATA_DIR = path.join(process.cwd(), "data");
const USERS_FILE = path.join(DATA_DIR, "users.json");
const ORDERS_FILE = path.join(DATA_DIR, "orders.json");

async function ensureDataDir() {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
  } catch {}
}

async function readJSON(file, fallback) {
  try {
    await ensureDataDir();
    const raw = await fs.readFile(file, "utf-8");
    return JSON.parse(raw);
  } catch {
    return fallback;
  }
}

async function writeJSON(file, data) {
  await ensureDataDir();
  await fs.writeFile(file, JSON.stringify(data, null, 2), "utf-8");
}

export async function getAllUsers() {
  return readJSON(USERS_FILE, []);
}

export async function findUserByEmail(email) {
  const users = await getAllUsers();
  return users.find((u) => u.email.toLowerCase() === email.toLowerCase()) ?? null;
}

export async function createUser(payload) {
  const users = await getAllUsers();
  const existing = users.find((u) => u.email.toLowerCase() === payload.email.toLowerCase());
  if (existing) throw new Error("Email already registered");
  
  const user = {
    id: randomUUID(),
    name: payload.name,
    email: payload.email,
    phone: payload.phone,
    instagram: payload.instagram ?? null,
    createdAt: new Date().toISOString(),
  };
  
  users.push(user);
  await writeJSON(USERS_FILE, users);
  return user;
}

export async function updateUser(email, patch) {
  const users = await getAllUsers();
  const idx = users.findIndex((u) => u.email.toLowerCase() === email.toLowerCase());
  if (idx === -1) throw new Error("User not found");
  
  const updated = { ...users[idx], ...patch };
  users[idx] = updated;
  await writeJSON(USERS_FILE, users);
  return updated;
}

// Orders
export async function getOrdersForUser(email) {
  const orders = await readJSON(ORDERS_FILE, []);
  return orders.filter((o) => o.userEmail.toLowerCase() === email.toLowerCase());
}

export async function createOrder(payload) {
  const orders = await readJSON(ORDERS_FILE, []);
  const order = {
    id: randomUUID(),
    userEmail: payload.userEmail,
    items: payload.items,
    total: payload.total,
    status: "pending",
    createdAt: new Date().toISOString(),
    payment: payload.payment ?? null,
  };
  
  orders.push(order);
  await writeJSON(ORDERS_FILE, orders);
  return order;
}

export async function updateOrderStatus(orderId, status) {
  const orders = await readJSON(ORDERS_FILE, []);
  const idx = orders.findIndex((o) => o.id === orderId);
  if (idx === -1) throw new Error("Order not found");
  
  orders[idx].status = status;
  await writeJSON(ORDERS_FILE, orders);
  return orders[idx];
}
