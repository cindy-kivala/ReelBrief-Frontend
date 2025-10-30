/**
 * AuthContext.jsx
 * Owner: Ryan
 * Description: Provides authentication context and state management for ReelBrief frontend.
 */

import { createContext, useEffect, useState } from "react";
import authAPI from "../api/authAPI";
import toast from "react-hot-toast";

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // -------------------- Boot: fetch /me if token exists --------------------
  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      setLoading(false);
      return;
    }

    (async () => {
      try {
        const me = await authAPI.getCurrentUser();
        setUser(me);
      } catch {
        // invalid/expired token — clear it
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        setUser(null);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // -------------------- LOGIN --------------------
  const login = async (credentials) => {
    try {
      const { user: u, access_token } = await authAPI.login(credentials);
      setUser(u);
      if (access_token) localStorage.setItem("accessToken", access_token);
      toast.success(`Welcome back, ${u.first_name || "User"}!`);
      return u;
    } catch (err) {
      console.error("Login failed:", err);
      toast.error(err?.response?.data?.error || "Login failed");
      return null;
    }
  };

  // -------------------- REGISTER --------------------
  const register = async (formData) => {
    try {
      await authAPI.register(formData);
      toast.success("Account created. Check your email to verify.");
      // return creds for optional auto-login by caller
      return { email: formData.get("email"), password: formData.get("password") };
    } catch (err) {
      console.error("Registration failed:", err);
      toast.error(err?.response?.data?.error || "Registration failed");
      return null;
    }
  };

  // -------------------- LOGOUT --------------------
  const logout = async () => {
    await authAPI.logout();
    setUser(null);
    toast.success("Logged out");
  };

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

  return <AuthContext.Provider value={value}>{!loading && children}</AuthContext.Provider>;
}
