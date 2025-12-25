"use client";
import React from "react";
import { useCart } from "@/hooks/useCart";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/router";

type Props = { id: string; name: string; price: number; image?: string; qty?: number; className?: string };

export default function AddToCartButton({ id, name, price, image, qty = 1, className }: Props) {
  const { add } = useCart();
  const { user } = useAuth();
  const router = useRouter();

  const handle = () => {
    if (!user) {
      router.push(`/login`);
      return;
    }
    add({ id, name, price, image }, qty);
  };

  return (
    <button className={className ?? "px-4 py-2 bg-black text-white rounded"} onClick={handle}>
      Add to cart
    </button>
  );
}
