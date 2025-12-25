export default function AccountPage() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-black text-white">
      <div className="w-full max-w-md p-6 bg-gray-900 rounded shadow-lg">
        <h1 className="text-3xl font-bold mb-6">My Account</h1>

        <div className="space-y-4">
          <div className="p-4 bg-gray-800 rounded">
            <h2 className="text-xl font-semibold">Profile</h2>
            <p className="text-gray-300">Name: Demo User</p>
            <p className="text-gray-300">Email: demo@example.com</p>
          </div>

          <div className="p-4 bg-gray-800 rounded">
            <h2 className="text-xl font-semibold">Settings</h2>
            <p className="text-gray-300">Manage your preferences here.</p>
          </div>

          <div className="p-4 bg-gray-800 rounded">
            <h2 className="text-xl font-semibold">Security</h2>
            <p className="text-gray-300">Update password or enable 2FA.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
