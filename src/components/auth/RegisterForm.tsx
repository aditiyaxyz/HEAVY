"use client";
import React, { useState } from "react";
import { useRouter } from "next/router";

export default function RegisterForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [instagram, setInstagram] = useState("");
  const [msg, setMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMsg(null);
    try {
      const res = await fetch("/api/users/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, phone, instagram: instagram || undefined }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Registration failed");
      router.replace("/");
    } catch (err: any) {
      setMsg(err.message || "Failed to register");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={submit} className="space-y-4">
      <input value={name} onChange={(e) => setName(e.target.value)} required placeholder="Full name" className="w-full border px-3 py-2 rounded" />
      <input value={email} onChange={(e) => setEmail(e.target.value)} required type="email" placeholder="Email" className="w-full border px-3 py-2 rounded" />
      <input value={phone} onChange={(e) => setPhone(e.target.value)} required placeholder="Phone" className="w-full border px-3 py-2 rounded" />
      <input value={instagram} onChange={(e) => setInstagram(e.target.value)} placeholder="Instagram (optional)" className="w-full border px-3 py-2 rounded" />
      <button type="submit" disabled={loading} className="w-full bg-black text-white py-2 rounded">
        {loading ? "Creating..." : "Create account & login"}
      </button>
      {msg && <p className="text-sm text-red-600">{msg}</p>}
    </form>
  );
}
