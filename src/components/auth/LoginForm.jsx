/**
 * LoginForm.jsx - FIXED VERSION
 * Owner: Ryan
 * Description: Handles user authentication with proper error handling and navigation.
 */
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import toast from "react-hot-toast";

export default function LoginForm() {
  const { login } = useAuth();
  const navigate = useNavigate();
  
  const [form, setForm] = useState({ 
    email: "", 
    password: "" 
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.email || !form.password) {
      toast.error("Please fill in all fields");
      return;
    }

    setLoading(true);

    try {
      const user = await login(form);
      
      if (user) {
        console.log("Login successful, user:", user);
        
        // Small delay to ensure state is fully updated
        setTimeout(() => {
          // Navigate based on role
          switch (user.role) {
            case "admin":
              navigate("/admin/dashboard");
              break;
            case "client":
              navigate("/client/dashboard");
              break;
            case "freelancer":
              navigate("/freelancer/dashboard");
              break;
            default:
              navigate("/");
              toast.error("Unknown user role");
          }
        }, 100);
      } else {
        toast.error("Login failed - please check your credentials");
      }
    } catch (error) {
      console.error("Login error:", error);
      toast.error("An error occurred during login");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="bg-white rounded-xl shadow-md p-8 w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-6">
          <div className="w-12 h-12 mx-auto rounded-md bg-blue-700 flex items-center justify-center">
            <span className="text-white font-bold text-lg">RB</span>
          </div>
        </div>

        {/* Title */}
        <h2 className="text-2xl font-semibold text-center text-gray-800 mb-2">
          Welcome Back
        </h2>
        <p className="text-center text-gray-500 mb-6">
          Sign in to your ReelBrief account
        </p>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email */}
          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Email Address
            </label>
            <input
              type="email"
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              placeholder="you@example.com"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
            />
          </div>

          {/* Password */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="block text-gray-700 font-medium">Password</label>
              <a 
                href="/forgot-password" 
                className="text-sm text-blue-600 hover:underline"
              >
                Forgot password?
              </a>
            </div>
            <input
              type="password"
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              placeholder="Enter your password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              required
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-700 text-white font-medium py-2 rounded-md hover:bg-blue-800 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        {/* Sign Up Link */}
        <p className="text-center text-sm text-gray-600 mt-6">
          Don't have an account?{" "}
          <a href="/register" className="text-blue-600 hover:underline">
            Sign up
          </a>
        </p>

        {/* Demo Accounts */}
        <div className="mt-6 p-4 border border-gray-200 rounded-lg bg-gray-50">
          <p className="text-sm font-medium text-gray-700 mb-2">Demo Accounts:</p>
          <div className="text-xs text-gray-600 space-y-1">
            <p>• Admin: <code>admin@reelbrief.com</code> / <code>admin123</code></p>
            <p>• Client: <code>sarah@techstartup.com</code> / <code>client123</code></p>
            <p>• Freelancer: <code>alex@designer.com</code> / <code>freelancer123</code></p>
          </div>
        </div>
      </div>
    </div>
  );
}