import dynamic from "next/dynamic";
import { useState } from "react";

const LoginForm = dynamic(() => import("@/components/auth/LoginForm"));
const RegisterForm = dynamic(() => import("@/components/auth/RegisterForm"));

export default function LoginPage() {
  const [mode, setMode] = useState("login");

  return (
    <main className="max-w-md mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-4">{mode === "login" ? "Login" : "Create account"}</h1>
      <div className="mb-4">
        <button className={`px-3 py-1 mr-2 ${mode === "login" ? "bg-black text-white" : "border"}`} onClick={() => setMode("login")}>
          Login (magic link)
        </button>
        <button className={`px-3 py-1 ${mode === "register" ? "bg-black text-white" : "border"}`} onClick={() => setMode("register")}>
          Register
        </button>
      </div>
      {mode === "login" ? <LoginForm /> : <RegisterForm />}
    </main>
  );
}
