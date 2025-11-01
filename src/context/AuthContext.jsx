/**
 * AuthContext.jsx - FIXED LOGIN VERSION
 * Works with Flask JSON-based login route.
 */

import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";

const AuthContext = createContext();
const API_URL = "http://localhost:5000/api/auth";

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load current user if token exists
  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (token) {
      axios
        .get(`${API_URL}/me`, {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        })
        .then((res) => setUser(res.data.user))
        .catch(() => setUser(null))
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  // Register (multipart/form-data)
  const register = async (formData) => {
    try {
      const res = await axios.post(`${API_URL}/register`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true,
      });
      if (res.data.user) setUser(res.data.user);
      toast.success("Registration successful!");
      return res.data;
    } catch (err) {
      const message =
        err.response?.data?.error ||
        err.response?.data?.message ||
        "Failed to register.";
      toast.error(message);
      return null;
    }
  };

  // ✅ Login (JSON)
  const login = async (form) => {
    try {
      const res = await axios.post(
        `${API_URL}/login`,
        {
          email: form.email,
          password: form.password,
        },
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );

      const { access_token, user } = res.data;
      if (!access_token || !user) {
        toast.error("Invalid server response");
        return null;
      }

      localStorage.setItem("access_token", access_token);
      setUser(user);
      toast.success("Logged in successfully!");
      return user;
    } catch (err) {
      console.error("Login error:", err);
      const message =
        err.response?.data?.error ||
        err.response?.data?.message ||
        "Invalid email or password.";
      toast.error(message);
      return null;
    }
  };

  const logout = () => {
    localStorage.removeItem("access_token");
    setUser(null);
    toast.success("Logged out successfully!");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        register,
        login,
        logout,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
