"use client";
import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { useAuth } from "@/hooks/useAuth";

export type CartItem = { id: string; name: string; price: number; image?: string; qty: number };

type CartContextType = {
  items: CartItem[];
  add: (item: Omit<CartItem, "qty">, qty?: number) => void;
  remove: (id: string) => void;
  increment: (id: string) => void;
  decrement: (id: string) => void;
  clear: () => void;
  totalQty: number;
  subtotal: number;
};

const CartContext = createContext<CartContextType | null>(null);
const LS_KEY = "heavy_cart_local_v1";

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, loading } = useAuth();
  const [items, setItems] = useState<CartItem[]>([]);

  useEffect(() => {
    const loadLocal = () => {
      try {
        const raw = localStorage.getItem(LS_KEY);
        setItems(raw ? JSON.parse(raw) : []);
      } catch {
        setItems([]);
      }
    };

    const loadServer = async () => {
      const res = await fetch("/api/cart");
      const data = await res.json();
      setItems(data.cart || []);
    };

    if (loading) return;
    if (user) loadServer();
    else loadLocal();
  }, [user, loading]);

  useEffect(() => {
    if (loading) return;
    if (user) {
      fetch("/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cart: items }),
      }).catch(() => {});
    } else {
      try {
        localStorage.setItem(LS_KEY, JSON.stringify(items));
      } catch {}
    }
  }, [items, user, loading]);

  const add: CartContextType["add"] = (product, qty = 1) => {
    setItems(prev => {
      const idx = prev.findIndex(i => i.id === product.id);
      if (idx !== -1) {
        const next = [...prev];
        next[idx] = { ...next[idx], qty: next[idx].qty + qty };
        return next;
      }
      return [...prev, { ...product, qty }];
    });
  };

  const remove = (id: string) => setItems(prev => prev.filter(i => i.id !== id));
  const increment = (id: string) => setItems(prev => prev.map(i => (i.id === id ? { ...i, qty: i.qty + 1 } : i)));
  const decrement = (id: string) =>
    setItems(prev => prev.map(i => (i.id === id ? { ...i, qty: Math.max(0, i.qty - 1) } : i)).filter(i => i.qty > 0));
  const clear = () => setItems([]);

  const totalQty = useMemo(() => items.reduce((s, i) => s + i.qty, 0), [items]);
  const subtotal = useMemo(() => items.reduce((s, i) => s + i.price * i.qty, 0), [items]);

  return (
    <CartContext.Provider value={{ items, add, remove, increment, decrement, clear, totalQty, subtotal }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCartContext = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCartContext must be used within CartProvider");
  return ctx;
};
