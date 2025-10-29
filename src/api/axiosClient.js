// src/api/axiosClient.js
import axios from "axios";

const axiosClient = axios.create({
  baseURL: "http://localhost:5000/api", // your Flask API base
  headers: {
    "Content-Type": "application/json",
  },
});

// Add JWT token automatically if available
axiosClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("access_token"); // or wherever you store JWT
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Optional: handle 401 globally
axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      console.warn("Unauthorized! Redirect to login or refresh token.");
      // e.g., redirect to login
      // window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default axiosClient;
