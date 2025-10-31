/**
 * axiosClient.js
 * Owner: Ryan
 * Description: Global Axios instance with JWT interceptors, token refresh, and secure defaults.
 */
import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";
console.log("Axios Base URL:", BASE_URL);

// Create axios instance
const axiosClient = axios.create({
  baseURL: BASE_URL,
  headers: { "Content-Type": "application/json" },
});

const ACCESS_TOKEN_KEY = "access_token";
const REFRESH_TOKEN_KEY = "refresh_token";

const getAccessToken = () => localStorage.getItem(ACCESS_TOKEN_KEY);
const getRefreshToken = () => localStorage.getItem(REFRESH_TOKEN_KEY);
const setAccessToken = (token) => {
  if (token) {
    localStorage.setItem(ACCESS_TOKEN_KEY, token);
    axiosClient.defaults.headers.Authorization = `Bearer ${token}`;
  }
};
const clearTokens = () => {
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
  delete axiosClient.defaults.headers.Authorization;
};

axiosClient.interceptors.request.use(
  (config) => {
    const token = getAccessToken();
    if (token) config.headers.Authorization = `Bearer ${token}`;
    
    // FIX: Remove Content-Type header for FormData to let browser set it automatically
    if (config.data instanceof FormData) {
      delete config.headers['Content-Type'];
    }
    
    return config;
  },
  (error) => Promise.reject(error)
);

axiosClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Expired access token → try refresh once
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      const refreshToken = getRefreshToken();
      if (!refreshToken) {
        clearTokens();
        window.location.href = "/login";
        return Promise.reject(error);
      }

      try {
        const res = await axios.post(`${BASE_URL}/api/auth/refresh`, {}, {
          headers: { Authorization: `Bearer ${refreshToken}` },
        });
        if (res.data?.access_token) {
          setAccessToken(res.data.access_token);
          originalRequest.headers.Authorization = `Bearer ${res.data.access_token}`;
          return axiosClient(originalRequest);
        }
      } catch (e) {
        clearTokens();
        window.location.href = "/login";
        return Promise.reject(e);
      }
    }

    return Promise.reject(error);
  }
);

export default axiosClient;