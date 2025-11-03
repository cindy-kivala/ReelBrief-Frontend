/**
 * authAPI.js - FIXED VERSION
 * Owner: Ryan
 * Description: Auth endpoints wrapper with correct API paths.
 */
import axiosClient from "./axiosClient";

const TOKEN_KEY = "access_token";
const REFRESH_KEY = "refresh_token";

// Token management functions
const setAccessToken = (token) => {
  localStorage.setItem(TOKEN_KEY, token);
  axiosClient.defaults.headers.Authorization = `Bearer ${token}`;
};

const setRefreshToken = (token) => {
  localStorage.setItem(REFRESH_KEY, token);
};

const clearTokens = () => {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(REFRESH_KEY);
  delete axiosClient.defaults.headers.Authorization;
};

const authAPI = {
  register: async (formData) => {
    const res = await axiosClient.post("/api/auth/register", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    // Store tokens if returned
    if (res.data.access_token) {
      setAccessToken(res.data.access_token);
    }
    return res.data;
  },

  login: async (credentials) => {
    const res = await axiosClient.post("/api/auth/login", credentials);
    const { access_token, refresh_token, user } = res.data;
    if (access_token) setAccessToken(access_token);
    if (refresh_token) setRefreshToken(refresh_token);
    return { user, access_token, refresh_token };
  },

  verifyEmail: async (token) => {
    const res = await axiosClient.post("/api/auth/verify-email", { token });
    return res.data;
  },

  me: async () => {
    const res = await axiosClient.get("/api/auth/me");
    return res.data;
  },

  refreshToken: async () => {
    const refreshToken = localStorage.getItem(REFRESH_KEY);
    const res = await axiosClient.post("/api/auth/refresh", { refresh_token: refreshToken });
    const { access_token } = res.data;
    if (access_token) setAccessToken(access_token);
    return access_token;
  },

  logout: async () => {
    clearTokens();
    return Promise.resolve();
  },

  requestPasswordReset: async (email) => {
    const res = await axiosClient.post("/api/auth/reset-password", { email });
    return res.data;
  },

  resetPassword: async (token, newPassword) => {
    const res = await axiosClient.post("/api/auth/reset-password", {
      token,
      new_password: newPassword,
    });
    return res.data;
  },
};

export default authAPI;