import fs from "fs/promises";
import path from "path";
import { randomUUID } from "crypto";

const DATA_DIR = path.join(process.cwd(), "data");
const USERS_FILE = path.join(DATA_DIR, "users.json");
const ORDERS_FILE = path.join(DATA_DIR, "orders.json");

export type User = {
  id: string;
  name: string;
  email: string;
  phone: string;
  instagram?: string | null;
  createdAt: string;
};

export type Order = {
  id: string;
  userEmail: string;
  items: any[];
  total: number;
  status: "pending" | "paid" | "cancelled" | string;
  createdAt: string;
  payment?: { provider?: string; status?: string; transactionId?: string } | null;
};

async function ensureDataDir() {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
  } catch {}
}

async function readJSON<T>(file: string, fallback: T): Promise<T> {
  try {
    await ensureDataDir();
    const raw = await fs.readFile(file, "utf-8");
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

async function writeJSON<T>(file: string, data: T) {
  await ensureDataDir();
  await fs.writeFile(file, JSON.stringify(data, null, 2), "utf-8");
}

export async function getAllUsers(): Promise<User[]> {
  return readJSON<User[]>(USERS_FILE, []);
}

export async function findUserByEmail(email: string): Promise<User | null> {
  const users = await getAllUsers();
  return users.find((u) => u.email.toLowerCase() === email.toLowerCase()) ?? null;
}

export async function createUser(payload: {
  name: string;
  email: string;
  phone: string;
  instagram?: string | null;
}): Promise<User> {
  const users = await getAllUsers();
  const existing = users.find((u) => u.email.toLowerCase() === payload.email.toLowerCase());
  if (existing) throw new Error("Email already registered");
  const user: User = {
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

export async function updateUser(email: string, patch: Partial<Omit<User, "email" | "id" | "createdAt">>) {
  const users = await getAllUsers();
  const idx = users.findIndex((u) => u.email.toLowerCase() === email.toLowerCase());
  if (idx === -1) throw new Error("User not found");
  const updated = { ...users[idx], ...patch };
  users[idx] = updated;
  await writeJSON(USERS_FILE, users);
  return updated;
}

/* Orders */
export async function getOrdersForUser(email: string): Promise<Order[]> {
  return readJSON<Order[]>(ORDERS_FILE, []).then((orders) => orders.filter((o) => o.userEmail.toLowerCase() === email.toLowerCase()));
}

export async function createOrder(payload: {
  userEmail: string;
  items: any[];
  total: number;
  payment?: Order["payment"] | null;
}): Promise<Order> {
  const orders = await readJSON<Order[]>(ORDERS_FILE, []);
  const order: Order = {
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

export async function updateOrderStatus(orderId: string, status: Order["status"]) {
  const orders = await readJSON<Order[]>(ORDERS_FILE, []);
  const idx = orders.findIndex((o) => o.id === orderId);
  if (idx === -1) throw new Error("Order not found");
  orders[idx].status = status;
  await writeJSON(ORDERS_FILE, orders);
  return orders[idx];
}
