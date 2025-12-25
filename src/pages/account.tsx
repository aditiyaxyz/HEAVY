"use client";

import Link from "next/link";
import { FaUser } from "react-icons/fa";
import { useState, useEffect } from "react";

export default function HeaderNav() {
  const [open, setOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // Check auth token on mount
    const token = localStorage.getItem("authToken");
    setIsLoggedIn(!!token);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    setIsLoggedIn(false);
    setOpen(false);
  };

  return (
    <nav className="flex items-center justify-between px-6 py-4 bg-black text-white shadow-md">
      {/* Left side */}
      <div className="flex items-center space-x-6">
        <Link href="/" className="font-bold text-xl tracking-wide hover:text-gray-300 transition-colors">
          HEAVY
        </Link>
        <Link href="/about" className="hover:text-gray-300 transition-colors">
          About
        </Link>
        <Link href="/contact" className="hover:text-gray-300 transition-colors">
          Contact
        </Link>
      </div>

      {/* Right side */}
      <div className="flex items-center space-x-4 relative">
        {!isLoggedIn ? (
          <>
            <Link
              href="/signin"
              className="px-3 py-1 rounded hover:bg-gray-800 transition-colors duration-300"
            >
              Sign In
            </Link>
            <Link
              href="/signup"
              className="px-3 py-1 rounded hover:bg-gray-800 transition-colors duration-300"
            >
              Sign Up
            </Link>
          </>
        ) : (
          <div className="relative">
            <button
              onClick={() => setOpen(!open)}
              className="flex items-center px-3 py-2 rounded hover:bg-gray-800 transition duration-300"
            >
              <FaUser className="mr-2" />
              <span>Account</span>
            </button>

            {/* Dropdown with fade/slide */}
            <div
              className={`absolute right-0 mt-2 w-44 bg-white text-black border rounded shadow-lg transform transition-all duration-300 ease-out
                ${open ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-2 pointer-events-none"}`}
            >
              <Link
                href="/account"
                className="block px-4 py-2 hover:bg-gray-100 transition-colors duration-200"
                onClick={() => setOpen(false)}
              >
                My Account
              </Link>
              <button
                onClick={handleLogout}
                className="w-full text-left block px-4 py-2 hover:bg-gray-100 transition-colors duration-200"
              >
                Logout
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
