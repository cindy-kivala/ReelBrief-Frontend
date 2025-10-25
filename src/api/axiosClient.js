/**
 * axiosClient.js
 * Owner: Ryan
 * Description: Global Axios instance with JWT interceptors and auto-refresh logic.
 */

import axios from "axios";

const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL, // ✅ flexible for local or production
  headers: { "Content-Type": "application/json" },
});

// -------------------- Token Helpers --------------------
const ACCESS_TOKEN_KEY = "token";
const REFRESH_TOKEN_KEY = "refreshToken";

const getAccessToken = () => localStorage.getItem(ACCESS_TOKEN_KEY);
const getRefreshToken = () => localStorage.getItem(REFRESH_TOKEN_KEY);
const setAccessToken = (token) => localStorage.setItem(ACCESS_TOKEN_KEY, token);
const clearTokens = () => {
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
};

// -------------------- Request Interceptor --------------------
axiosClient.interceptors.request.use(
  (config) => {
    const token = getAccessToken();
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

// -------------------- Response Interceptor --------------------
axiosClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const refreshToken = getRefreshToken();

      if (!refreshToken) {
        clearTokens();
        window.location.href = "/login";
        return Promise.reject(error);
      }

      try {
        const res = await axios.post(
          `${import.meta.env.VITE_API_URL}/auth/refresh`,
          { refresh_token: refreshToken }
        );

        if (res.data?.access_token) {
          setAccessToken(res.data.access_token);
          originalRequest.headers.Authorization = `Bearer ${res.data.access_token}`;
          return axiosClient(originalRequest);
        }
      } catch (refreshError) {
        console.error("Token refresh failed:", refreshError);
        clearTokens();
        window.location.href = "/login";
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default axiosClient;
