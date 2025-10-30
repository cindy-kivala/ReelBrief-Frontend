/**
 * RegisterForm.jsx
 * Owner: Ryan
 * Description: Register user with optional freelancer CV. In dev, auto-verify & auto-login.
 */
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import toast from "react-hot-toast";

const REQUIRE_EMAIL_VERIFICATION =
  (import.meta.env.VITE_REQUIRE_EMAIL_VERIFICATION || "false").toLowerCase() === "true";

export default function RegisterForm() {
  const { register, login } = useAuth();
  const navigate = useNavigate();
  const [busy, setBusy] = useState(false);
  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    role: "client",
    cv: null,
  });

  const handleFileChange = (e) => {
    setForm({ ...form, cv: e.target.files[0] || null });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.email || !form.password) {
      toast.error("Email and password required");
      return;
    }

    const fd = new FormData();
    Object.entries(form).forEach(([k, v]) => v !== null && fd.append(k, v));

    setBusy(true);
    const res = await register(fd);
    setBusy(false);
    if (!res) return;

    // If your env explicitly requires email verification, just send to login.
    if (REQUIRE_EMAIL_VERIFICATION) {
      toast.success("Check your email to verify your account.");
      navigate("/login");
      return;
    }

    // Otherwise: auto-login (dev)
    const user = await login({ email: form.email, password: form.password });
    if (!user) return;

    if (user.role === "admin") navigate("/admin/dashboard");
    else if (user.role === "freelancer") navigate("/freelancer/dashboard");
    else navigate("/client/dashboard");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="bg-white rounded-xl shadow-md p-8 w-full max-w-md">
        <h2 className="text-2xl font-semibold text-center mb-6">Create account</h2>

        <form onSubmit={handleSubmit} encType="multipart/form-data" className="space-y-4">
          <div>
            <label className="block text-gray-700">First name</label>
            <input
              type="text"
              value={form.first_name}
              onChange={(e) => setForm({ ...form, first_name: e.target.value })}
              className="w-full border rounded-md px-3 py-2 mt-1"
            />
          </div>

          <div>
            <label className="block text-gray-700">Last name</label>
            <input
              type="text"
              value={form.last_name}
              onChange={(e) => setForm({ ...form, last_name: e.target.value })}
              className="w-full border rounded-md px-3 py-2 mt-1"
            />
          </div>

          <div>
            <label className="block text-gray-700">Email</label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="w-full border rounded-md px-3 py-2 mt-1"
            />
          </div>

          <div>
            <label className="block text-gray-700">Password</label>
            <input
              type="password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              className="w-full border rounded-md px-3 py-2 mt-1"
            />
          </div>

          <div>
            <label className="block text-gray-700">Role</label>
            <select
              value={form.role}
              onChange={(e) => setForm({ ...form, role: e.target.value })}
              className="w-full border rounded-md px-3 py-2 mt-1"
            >
              <option value="client">Client</option>
              <option value="freelancer">Freelancer</option>
            </select>
          </div>

          {form.role === "freelancer" && (
            <div>
              <label className="block text-gray-700">Upload CV (PDF/DOC/DOCX)</label>
              <input
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={handleFileChange}
                className="w-full border rounded-md px-3 py-2 mt-1"
              />
            </div>
          )}

          <button
            type="submit"
            disabled={busy}
            className="w-full bg-blue-700 text-white py-2 rounded-md hover:bg-blue-800 transition"
          >
            {busy ? "Creating..." : "Sign Up"}
          </button>
        </form>

        <p className="text-center text-sm text-gray-600 mt-6">
          Already have an account?{" "}
          <Link to="/login" className="text-blue-600 hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
