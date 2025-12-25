"use client";
import React, { useState } from "react";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [msg, setMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMsg(null);
    try {
      const res = await fetch("/api/auth/request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      setMsg(data.message || "Check your email for the login link.");
    } catch {
      setMsg("Failed to send link. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={submit} className="space-y-4">
      <input
        type="email"
        placeholder="Enter your email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="w-full border px-3 py-2 rounded"
        required
      />
      <button type="submit" disabled={loading} className="w-full bg-black text-white py-2 rounded">
        {loading ? "Sending..." : "Send login link"}
      </button>
      {msg && <p className="text-sm text-gray-700">{msg}</p>}
    </form>
  );
}
