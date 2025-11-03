/**
 * Login.jsx
 * Owner: Ryan
 * Description: Sign in and route by role.
 */
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import toast from "react-hot-toast";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [busy, setBusy] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.email || !form.password) {
      toast.error("Email and password required");
      return;
    }
    setBusy(true);
    const u = await login(form);
    setBusy(false);
    if (!u) return;

    // Route by role
    if (u.role === "admin") navigate("/admin/dashboard");
    else if (u.role === "freelancer") navigate("/freelancer/dashboard");
    else navigate("/client/dashboard");
  };

  // Quick fill for testing
  const fillTestCredentials = (role) => {
    const credentials = {
      admin: { email: "admin@reelbrief.com", password: "admin123" },
      client: { email: "sarah@techstartup.com", password: "client123" },
      freelancer: { email: "alex@designer.com", password: "freelancer123" }
    };
    setForm(credentials[role]);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="bg-white rounded-xl shadow-md p-8 w-full max-w-md">
        <h2 className="text-2xl font-semibold text-center mb-6">Sign in</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700">Email</label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="w-full border rounded-md px-3 py-2 mt-1"
              placeholder="you@example.com"
            />
          </div>
          <div>
            <label className="block text-gray-700">Password</label>
            <input
              type="password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              className="w-full border rounded-md px-3 py-2 mt-1"
              placeholder="••••••••"
            />
          </div>
          <button
            type="submit"
            disabled={busy}
            className="w-full bg-blue-700 text-white py-2 rounded-md hover:bg-blue-800 transition"
          >
            {busy ? "Signing in..." : "Sign In"}
          </button>
        </form>

        {/* Testing Credentials Section */}
        <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
          <h3 className="text-sm font-medium text-gray-700 mb-2">Test Accounts:</h3>
          <div className="space-y-2">
            <button
              onClick={() => fillTestCredentials('admin')}
              className="w-full text-left text-sm p-2 bg-red-50 hover:bg-red-100 rounded border border-red-200 text-red-700"
            >
              <strong>Admin:</strong> admin@reelbrief.com / admin123
            </button>
            <button
              onClick={() => fillTestCredentials('client')}
              className="w-full text-left text-sm p-2 bg-blue-50 hover:bg-blue-100 rounded border border-blue-200 text-blue-700"
            >
              <strong>Client:</strong> sarah@techstartup.com / client123
            </button>
            <button
              onClick={() => fillTestCredentials('freelancer')}
              className="w-full text-left text-sm p-2 bg-green-50 hover:bg-green-100 rounded border border-green-200 text-green-700"
            >
              <strong>Freelancer:</strong> alex@designer.com / freelancer123
            </button>
          </div>
        </div>

        <p className="text-center text-sm text-gray-600 mt-6">
          Don't have an account?{" "}
          <Link to="/register" className="text-blue-600 hover:underline">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}