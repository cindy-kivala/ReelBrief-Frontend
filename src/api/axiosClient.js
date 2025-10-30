/**
 * axiosClient.js
 * Owner: Ryan
 * Description: Global Axios instance with JWT interceptors, token refresh, and secure defaults.
 */
import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";
const ACCESS_TOKEN_KEY = "accessToken";
const REFRESH_TOKEN_KEY = "refreshToken";

const axiosClient = axios.create({
  baseURL: BASE_URL,
  headers: { "Content-Type": "application/json" },
});

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

// Attach token on every request
axiosClient.interceptors.request.use(
  (config) => {
    const token = getAccessToken();
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

// Auto refresh
axiosClient.interceptors.response.use(
  (res) => res,
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
        const r = await axios.post(`${BASE_URL}/api/auth/refresh`, {}, {
          headers: { Authorization: `Bearer ${refresh}` },
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
