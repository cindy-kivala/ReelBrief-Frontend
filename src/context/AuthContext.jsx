/**
 * AuthContext.jsx - COMPLETE FIXED VERSION
 * Owner: Ryan
 * Description: Provides authentication context and state management for ReelBrief frontend.
 */
import { createContext, useContext, useState, useEffect } from "react";
import axiosClient from "../api/axiosClient";
import toast from "react-hot-toast";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Get current user from backend
  const getCurrentUser = async () => {
    try {
      const response = await axiosClient.get("/api/auth/me");
      return response.data.user;
    } catch (error) {
      console.error("Failed to get current user:", error);
      // Clear invalid token
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");
      return null;
    }
  };

  // Auto-fetch user if access token exists on app start
  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem("access_token");
      if (token) {
        const userData = await getCurrentUser();
        setUser(userData);
      }
      setLoading(false);
    };
    
    initAuth();
  }, []);

  // LOGIN - Fixed to handle JWT format properly
  const login = async (credentials) => {
    try {
      const response = await axiosClient.post("/api/auth/login", credentials);
      const { user: userData, access_token, refresh_token } = response.data;
      
      // Store tokens
      localStorage.setItem("access_token", access_token);
      localStorage.setItem("refresh_token", refresh_token);
      
      // Set user state
      setUser(userData);
      
      toast.success(`Welcome back, ${userData.first_name || "User"}!`);
      return userData;
    } catch (error) {
      const errorMsg = error.response?.data?.error || "Login failed";
      toast.error(errorMsg);
      return null;
    }
  };

  // REGISTER (no auto-login; user must verify first)
  const register = async (formData) => {
    try {
      const response = await axiosClient.post("/api/auth/register", formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      toast.success("Account created! Check your email to verify.");
      return response.data; // contains dev_verify_url & verification_token
    } catch (error) {
      const errorMsg = error.response?.data?.error || "Registration failed";
      toast.error(errorMsg);
      return null;
    }
  };

  // LOGOUT
  const logout = async () => {
    // Clear local storage
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    
    // Clear state
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
    getCurrentUser, // Export for manual refreshes
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