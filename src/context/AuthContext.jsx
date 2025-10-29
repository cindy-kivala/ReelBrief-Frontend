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

  // -------------------- Auto-fetch user if logged in --------------------
  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      setLoading(false);
      return;
    }

    const fetchUser = async () => {
      try {
        const data = await authAPI.getCurrentUser();
        setUser(data);
      } catch {
        localStorage.removeItem("accessToken");
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  // -------------------- LOGIN --------------------
  const login = async (credentials) => {
    try {
      const { user } = await authAPI.login(credentials);
      setUser(user);
      toast.success(`Welcome back, ${user.first_name || "User"}!`);

      // ✅ No navigation logic here — handled in the component (e.g., LoginForm)
      return user;
    } catch (err) {
      toast.error(err.response?.data?.error || "Login failed");
      return null;
    }
  };

  // -------------------- REGISTER --------------------
  const register = async (data) => {
    try {
      await authAPI.register(data);
      toast.success("Account created successfully!");

      // ✅ Return email & password so LoginForm can auto-login
      return { email: data.get("email"), password: data.get("password") };
    } catch (err) {
      toast.error(err.response?.data?.error || "Registration failed");
      return null;
    }
  };

  // -------------------- LOGOUT --------------------
  const logout = async () => {
    await authAPI.logout();
    setUser(null);
    toast.success("Logged out successfully");
  };

  // -------------------- Context --------------------
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

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context)
    throw new Error("useAuth must be used within an AuthProvider");
  return context;
}
