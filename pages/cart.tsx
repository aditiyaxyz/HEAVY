"use client";
import React from "react";
import { useCart } from "@/hooks/useCart";
import { useAuth } from "@/hooks/useAuth";

export default function CartPage() {
  const { user } = useAuth();
  const { items, increment, decrement, remove, subtotal, clear } = useCart();

  return (
    <main className="max-w-3xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Your cart</h1>
        <div className="text-sm">{user ? `Logged in: ${user.email}` : <a href="/login" className="underline">Login</a>}</div>
      </div>

      {items.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <>
          <ul className="space-y-4">
            {items.map(item => (
              <li key={item.id} className="flex items-center gap-4 border-b pb-4">
                {item.image && <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded" />}
                <div className="flex-1">
                  <div className="font-medium">{item.name}</div>
                  <div className="text-sm text-gray-600">₹{item.price}</div>
                  <div className="flex items-center gap-2 mt-2">
                    <button className="px-2 border rounded" onClick={() => decrement(item.id)}>-</button>
                    <span>{item.qty}</span>
                    <button className="px-2 border rounded" onClick={() => increment(item.id)}>+</button>
                    <button className="ml-4 text-red-600 text-sm" onClick={() => remove(item.id)}>Remove</button>
                  </div>
                </div>
                <div className="text-right font-medium">₹{item.price * item.qty}</div>
              </li>
            ))}
          </ul>
          <div className="flex justify-between items-center mt-6">
            <button className="px-3 py-2 border rounded" onClick={clear}>Clear cart</button>
            <div className="text-xl font-semibold">Subtotal: ₹{subtotal}</div>
          </div>
          <button className="mt-4 w-full px-4 py-3 bg-black text-white rounded">Proceed to checkout</button>
        </>
      )}
    </main>
  );
}
