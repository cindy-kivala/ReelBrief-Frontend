/**
 * authAPI.js
 * Owner: Monica
 * Description: Handles user authentication (login/register/logout).
 */

import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL  || "/api",
  headers: { "Content-Type": "application/json" },
});

// Save token automatically
API.interceptors.response.use((response) => {
  if (response.data?.access_token) {
    localStorage.setItem("token", response.data.access_token);
  }
  return response;
});

// Register user
export const registerUser = async (data) => {
  const res = await API.post("/auth/register", data);
  return res.data;
};

// Login user
export const loginUser = async (data) => {
  const res = await API.post("/auth/login", data);
  if (res.data.access_token) {
    localStorage.setItem("token", res.data.access_token);
  }
  return res.data;
};

// Logout user
export const logoutUser = () => {
  localStorage.removeItem("token");
};

// Get current token
export const getAuthToken = () => {
  return localStorage.getItem("token");
};
