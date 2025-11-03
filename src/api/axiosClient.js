/**
 * axiosClient.js
 * Owner: Ryan
 * Description: Global Axios instance with JWT interceptors, token refresh, and secure defaults.
 */
import axios from "axios";

// FIX: Changed VITE_API_URL to VITE_API_BASE_URL to match .env file
const BASE_URL = import.meta.env.VITE_API_BASE_URL;
console.log("Axios Base URL:", BASE_URL);

// Create axios instance with credentials support for CORS
const axiosClient = axios.create({
  baseURL: BASE_URL,
  headers: { 
    "Content-Type": "application/json"
  },
  withCredentials: true, // ADDED: Enable credentials for CORS
});

const ACCESS_TOKEN_KEY = "access_token";
const REFRESH_TOKEN_KEY = "refresh_token";

const getAccessToken = () => localStorage.getItem(ACCESS_TOKEN_KEY);
const getRefreshToken = () => localStorage.getItem(REFRESH_TOKEN_KEY);

export const setAccessToken = (token) => {
  if (token) {
    localStorage.setItem(ACCESS_TOKEN_KEY, token);
    axiosClient.defaults.headers.Authorization = `Bearer ${token}`;
  }
};

export const setRefreshToken = (token) => {
  if (token) localStorage.setItem(REFRESH_TOKEN_KEY, token);
};

export const clearTokens = () => {
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
  delete axiosClient.defaults.headers.Authorization;
};

// Request interceptor - attach JWT token
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

// Response interceptor - handle token refresh
axiosClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config;
    if (error.response?.status === 401 && !original._retry) {
      original._retry = true;
      const refresh = getRefreshToken();
      if (!refresh) {
        clearTokens();
        window.location.href = "/login";
        return Promise.reject(error);
      }
      try {
        const res = await axios.post(`${BASE_URL}/api/auth/refresh`, {}, {
          headers: { Authorization: `Bearer ${refreshToken}` },
          withCredentials: true,
        });
        if (r.data?.access_token) {
          setAccessToken(r.data.access_token);
          original.headers.Authorization = `Bearer ${r.data.access_token}`;
          return axiosClient(original);
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