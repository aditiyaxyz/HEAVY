"use client";
import React from "react";
import { useCart } from "@/hooks/useCart";

type Props = { id: string; name: string; price: number; image?: string; qty?: number; className?: string };

export default function AddToCartButton({ id, name, price, image, qty = 1, className }: Props) {
  const { add } = useCart();
  return (
    <button className={className ?? "px-4 py-2 bg-black text-white rounded"} onClick={() => add({ id, name, price, image }, qty)}>
      Add to cart
    </button>
  );
}
