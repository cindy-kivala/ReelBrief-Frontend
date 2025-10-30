// src/api/activityAPI.js
import axiosClient from "./axiosClient";

export const fetchActivities = async (params = {}) => {
  const response = await axiosClient.get("/dashboard/activity", { params });
  return response.data.recent_activity || response.data;
};
