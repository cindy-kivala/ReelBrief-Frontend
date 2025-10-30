/**
 * authAPI.js
 * Owner: Ryan
 * Description: Handles authentication-related API requests using JWT.
 */
import axiosClient from "./axiosClient";

const TOKEN_KEY = "accessToken";
const REFRESH_KEY = "refreshToken";

const storeTokens = (access, refresh) => {
  if (access) localStorage.setItem(TOKEN_KEY, access);
  if (refresh) localStorage.setItem(REFRESH_KEY, refresh);
  axiosClient.defaults.headers.Authorization = `Bearer ${access}`;
};

const clearTokens = () => {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(REFRESH_KEY);
  delete axiosClient.defaults.headers.Authorization;
};

const authAPI = {
  // Register (supports file upload) → returns dev_verify_url + verification_token
  register: async (data) => {
    const res = await axiosClient.post("/api/auth/register", data, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data; // { message, dev_verify_url, verification_token }
  },

  login: async (credentials) => {
    const res = await axiosClient.post("/api/auth/login", credentials);
    const { access_token, refresh_token, user } = res.data;
    if (access_token) storeTokens(access_token, refresh_token);
    return { user, access_token };
  },

  verifyEmail: async (token) => {
    const res = await axiosClient.post("/api/auth/verify-email", { token });
    return res.data;
  },

  resendVerification: async (email) => {
    const res = await axiosClient.post("/api/auth/resend-verification", { email });
    return res.data;
  },

  getCurrentUser: async () => {
    const res = await axiosClient.get("/api/auth/me");
    return res.data;
  },

  logout: async () => {
    clearTokens();
    return Promise.resolve();
  },
};

export default authAPI;
