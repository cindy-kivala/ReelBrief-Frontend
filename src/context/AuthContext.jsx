/**
 * AuthContext.jsx - FIXED VERSION
 */

import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";

// Create axios client with interceptors
const axiosClient = axios.create({
  baseURL: "http://localhost:5000/api",
  withCredentials: true,
});

axiosClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      // Don't redirect automatically - let component handle it
      console.log("Token expired or invalid");
    }
    return Promise.reject(error);
  }
);

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Improved user loading with better error handling
  useEffect(() => {
    const checkAuthStatus = async () => {
      const token = localStorage.getItem("access_token");
      
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const res = await axiosClient.get("/auth/me");
        setUser(res.data.user);
      } catch (error) {
        console.log("Auth check failed:", error.response?.status);
        // Clear invalid token
        localStorage.removeItem("access_token");
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkAuthStatus();
  }, []);

  // Register (multipart/form-data)
  const register = async (formData) => {
    try {
      const res = await axiosClient.post("/auth/register", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      
      if (res.data.access_token && res.data.user) {
        localStorage.setItem("access_token", res.data.access_token);
        setUser(res.data.user);
        toast.success("Registration successful!");
        return res.data;
      }
    } catch (err) {
      const message = err.response?.data?.error || "Failed to register.";
      toast.error(message);
      return null;
    }
  };

  // Login (JSON)
  const login = async (form) => {
    try {
      const res = await axiosClient.post("/auth/login", {
        email: form.email,
        password: form.password,
      });

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
      const message = err.response?.data?.error || "Invalid email or password.";
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

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export default AuthContext;