/**
 * authAPI.js
 * Owner: Ryan
 * Description: Auth endpoints wrapper.
 */
import axiosClient, { setAccessToken, setRefreshToken, clearTokens } from "./axiosClient";

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
