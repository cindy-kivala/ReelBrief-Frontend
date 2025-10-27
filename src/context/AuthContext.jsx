/**
 * AuthContext.jsx
 * Owner: Ryan
 * Description: Provides authentication context and state management for ReelBrief frontend.
 */

import { createContext, useContext, useState, useEffect } from "react";
import authAPI from "../api/authAPI";
import toast from "react-hot-toast";

// Create Context for Auth
const AuthContext = createContext(null);

//  Provider Component
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check Current User and set auth state on mount
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setLoading(false);
      return;
    }

    const fetchUser = async () => {
      try {
        const res = await authAPI.getCurrentUser();
        setUser(res);
      } catch {
        localStorage.removeItem("token");
        localStorage.removeItem("refreshToken");
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  //  Auth Actions to be provided in context
  const login = async (credentials) => {
    try {
      const user = await authAPI.login(credentials);
      setUser(user);
      toast.success(`Welcome back, ${user.first_name || "User"}!`);
      return user; // Return user so component can navigate
    } catch (err) {
      toast.error(err.response?.data?.error || "Login failed");
      throw err;
    }
  };

  const register = async (data) => {
    try {
      await authAPI.register(data);
      toast.success("Account created! Check your email to verify.");
    } catch (err) {
      toast.error(err.response?.data?.error || "Registration failed");
      throw err;
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken");
    setUser(null);
    toast.success("Logged out successfully");
  };

  //  Context Value to keep track of auth state and actions
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

// -Hook to use Auth Context 
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}