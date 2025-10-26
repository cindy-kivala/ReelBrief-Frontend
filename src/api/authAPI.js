/**
 * authAPI.js
 * Owner: Ryan
 * Description: Handles authentication-related API requests using JWT.
 */

import axiosClient from "./axiosClient";

// -------------------- Helper: Token Storage --------------------
const TOKEN_KEY = "accessToken";
const REFRESH_KEY = "refreshToken";

const storeTokens = (access, refresh) => {
  if (access) localStorage.setItem(TOKEN_KEY, access);
  if (refresh) localStorage.setItem(REFRESH_KEY, refresh);
  axiosClient.defaults.headers.Authorization = `Bearer ${access}`;
};

const getAccessToken = () => localStorage.getItem(TOKEN_KEY);
const getRefreshToken = () => localStorage.getItem(REFRESH_KEY);

const clearTokens = () => {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(REFRESH_KEY);
  delete axiosClient.defaults.headers.Authorization;
};

// -------------------- API Endpoints --------------------
const authAPI = {
  /**
   * Register a new user
   * @param {Object} data {name, email, password, role, etc.}
   */
  register: (data) => axiosClient.post("/auth/register", data),

  /**
   * Login user and store tokens
   * @param {Object} credentials {email, password}
   */
  login: async (credentials) => {
    const res = await axiosClient.post("/auth/login", credentials);
    const { access_token, refresh_token, user } = res.data;

    if (access_token) storeTokens(access_token, refresh_token);
    return user || res.data;
  },

  /**
   * Refresh expired access token
   */
  refreshToken: async () => {
    const refresh = getRefreshToken();
    if (!refresh) throw new Error("No refresh token found");

    const res = await axiosClient.post("/auth/refresh", { refresh_token: refresh });
    const { access_token } = res.data;

    if (access_token) storeTokens(access_token);
    return access_token;
  },

  /**
   * Fetch currently authenticated user
   */
  getCurrentUser: async () => {
    const res = await axiosClient.get("/auth/me");
    return res.data;
  },

  /**
   * Logout and clear local storage
   */
  logout: () => {
    clearTokens();
    return Promise.resolve();
  },

  /**
   * Password reset flow
   */
  requestPasswordReset: (email) =>
    axiosClient.post("/auth/reset-password-request", { email }),

  resetPassword: (token, newPassword) =>
    axiosClient.post("/auth/reset-password", { token, password: newPassword }),
};

export default authAPI;
