import { useState } from "react";

// ✅ NEW IMPORTS
import Inventory from "./components/Inventory";
import DropRegister from "./components/DropRegister";

// ⚠️ KEEP YOUR EXISTING DEFAULT EXPORT NAME
export default function HeavyShitApp() {
  // ---- your existing state ----
  const [cartOpen, setCartOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  return (
    <div>
      {/* ========================= */}
      {/* YOUR EXISTING UI GOES HERE */}
      {/* ========================= */}

      {/* Example placeholder (remove if you already have UI) */}
      {/* <Navbar /> */}
      {/* <Hero /> */}
      {/* <Products /> */}

      {/* ========================= */}
      {/* ADMIN / INTERNAL SECTION */}
      {/* ========================= */}
      <div className="p-6 max-w-3xl mx-auto mt-16 border-t">
        <h2 className="text-2xl font-bold mb-6">Admin Panel</h2>

        <Inventory />
        <DropRegister />
      </div>
    </div>
  );
}
