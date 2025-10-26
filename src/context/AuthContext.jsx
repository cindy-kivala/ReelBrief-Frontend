/**
 * AuthContext.jsx
 * Owner: Ryan
 * Description: Provides authentication context and state management for ReelBrief frontend.
 */

import { createContext, useContext, useState, useEffect } from "react";
import authAPI from "../api/authAPI";
import toast from "react-hot-toast";

// -------------------- Create Context --------------------
const AuthContext = createContext(null);

// -------------------- Provider --------------------
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // -------------------- Check Current User --------------------
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setLoading(false);
      return;
    }

    const fetchUser = async () => {
      try {
        const res = await authAPI.getCurrentUser();
        setUser(res.data);
      } catch {
        localStorage.removeItem("token");
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  // -------------------- Auth Actions --------------------
  const login = async (credentials) => {
    try {
      const res = await authAPI.login(credentials);
      localStorage.setItem("token", res.data.access_token);
      setUser(res.data.user);
      toast.success(`Welcome back, ${res.data.user.name || "User"}!`);
    } catch (err) {
      toast.error(err.response?.data?.error || "Login failed");
    }
  };

  const register = async (data) => {
    try {
      await authAPI.register(data);
      toast.success("Account created! Check your email to verify.");
    } catch (err) {
      toast.error(err.response?.data?.error || "Registration failed");
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
    toast.success("Logged out successfully");
  };

  // -------------------- Context Value --------------------
  const value = {
    user,
    loading,
    login,
    register,
    logout,
    isAuthenticated: !!user,
    isAdmin: user?.role === "admin",
    isFreelancer: user?.role === "freelancer",
    isClient: user?.role === "client",
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

// -------------------- Hook --------------------
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
