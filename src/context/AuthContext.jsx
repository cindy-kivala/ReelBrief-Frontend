/**
 * AuthContext.jsx
 * Owner: Ryan
 * Description: Provides authentication context and state management for ReelBrief frontend.
 */
import { createContext, useContext, useState, useEffect } from "react";
import authAPI from "../api/authAPI";
import toast from "react-hot-toast";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Auto-fetch user if access token exists
  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      setLoading(false);
      return;
    }
    (async () => {
      try {
        const data = await authAPI.getCurrentUser();
        setUser(data);
      } catch {
        localStorage.removeItem("accessToken");
        setUser(null);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // LOGIN
  const login = async (credentials) => {
    try {
      const { user, access_token } = await authAPI.login(credentials);
      setUser(user);
      localStorage.setItem("accessToken", access_token);
      toast.success(`Welcome back, ${user.first_name || "User"}!`);
      return user;
    } catch (err) {
      toast.error(err?.response?.data?.error || "Login failed");
      return null;
    }
  };

  // REGISTER (no auto-login; user must verify first)
  const register = async (formData) => {
    try {
      const res = await authAPI.register(formData);
      toast.success("Account created! Check your email to verify.");
      return res; // contains dev_verify_url & verification_token
    } catch (err) {
      toast.error(err?.response?.data?.error || "Registration failed");
      return null;
    }
  };

  const logout = async () => {
    await authAPI.logout();
    setUser(null);
    toast.success("Logged out successfully");
  };

  const value = {
    user,
    loading,
    isAuthenticated: !!user,
    isAdmin: user?.role === "admin",
    isFreelancer: user?.role === "freelancer",
    isClient: user?.role === "client",
    login,
    register,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
}
