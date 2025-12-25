import LoginForm from "@/components/auth/LoginForm";

export default function LoginPage() {
  return (
    <main className="max-w-md mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-4">Login</h1>
      <LoginForm />
    </main>
  );
}
