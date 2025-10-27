import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.email || !form.password) return;
    
    try {
      const user = await login(form);
      
      // Navigate based on user role
      if (user.role === "admin") {
        navigate("/admin/dashboard");
      } else if (user.role === "freelancer") {
        navigate("/freelancer/dashboard");
      } else if (user.role === "client") {
        navigate("/client/dashboard");
      } else {
        navigate("/dashboard");
      }
    } catch (error) {
      // Error already handled by login function 
      console.error("Login error:", error);
    }
  };

  return (
    <div className="login-page min-h-screen flex items-center justify-center bg-gray-50">
      <div className="login-card bg-white rounded-xl shadow-md p-8 w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-6">
          <div className="logo w-12 h-12 mx-auto rounded-md bg-blue-700 flex items-center justify-center">
            <span className="text-white font-bold text-lg">RB</span>
          </div>
        </div>

        {/* Title */}
        <h1 className="text-2xl font-semibold text-center">Welcome Back</h1>
        <p className="text-center text-gray-500 mb-6">
          Sign in to your ReelBrief account
        </p>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Email */}
          <div className="form-group">
            <label className="block text-sm font-medium mb-1">
              Email Address
            </label>
            <div className="relative">
              <input
                type="email"
                className="form-input w-full border rounded-md p-2 pl-8"
                placeholder="you@example.com"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
              <span className="input-icon absolute left-2 top-2.5 text-gray-400">
                @
              </span>
            </div>
          </div>

          {/* Password */}
          <div className="form-group">
            <div className="flex justify-between items-center mb-1">
              <label className="block text-sm font-medium">Password</label>
              <Link
                to="/forgot-password"
                className="text-sm text-blue-600 hover:underline"
              >
                Forgot password?
              </Link>
            </div>
            <div className="relative">
              <input
                type="password"
                className="form-input w-full border rounded-md p-2 pl-8"
                placeholder="Enter your password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
              />
              <span className="input-icon absolute left-2 top-2.5 text-gray-400">
                🔒
              </span>
            </div>
          </div>

          {/* Sign In Button */}
          <button type="submit" className="btn-primary w-full">
            Sign In
          </button>
        </form>

        {/* Sign Up & Back Links */}
        <div className="text-center mt-6">
          <p className="text-gray-600 text-sm">
            Don't have an account?{" "}
            <Link to="/register" className="text-blue-600 hover:underline">
              Sign up
            </Link>
          </p>
          <Link
            to="/"
            className="block mt-2 text-sm text-gray-500 hover:underline"
          >
            ← Back to home
          </Link>
        </div>

        {/* Demo Accounts */}
        <div className="demo-box mt-8 border rounded-md p-4 text-sm bg-gray-50">
          <p className="font-semibold mb-2">Demo Test Accounts:</p>
          <ul className="space-y-1 text-gray-700">
            <li>• Admin: <code>admin@reelbrief.com</code> / <code>admin123</code></li>
            <li>• Client: <code>sarah.johnson@techstartup.com</code> / <code>demo123</code></li>
            <li>• Freelancer: <code>alex.designer@demo.com</code> / <code>demo123</code></li>
          </ul>
        </div>
      </div>
    </div>
  );
}