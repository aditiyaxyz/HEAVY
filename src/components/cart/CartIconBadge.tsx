"use client";
import React from "react";
import Link from "next/link";
import { useCart } from "@/hooks/useCart";

export default function CartIconBadge() {
  const { totalQty } = useCart();
  return (
    <Link href="/cart" className="relative inline-flex items-center">
      <span className="material-icons">shopping_cart</span>
      {totalQty > 0 && (
        <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs rounded-full px-2">
          {totalQty}
        </span>
      )}
    </Link>
  );
}
