/**
 * authAPI.js
 * Owner: Ryan
 * Description: Auth endpoints wrapper.
 */
import axiosClient from "./axiosClient";

const TOKEN_KEY = "access_token";
const REFRESH_KEY = "refresh_token";

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
  register: async (formData /* FormData */) => {
    const res = await axiosClient.post("/api/auth/register", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data; // { message, dev_verify_url? }
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

  logout: async () => {
    clearTokens();
    return Promise.resolve();
  },
};

export default authAPI;
