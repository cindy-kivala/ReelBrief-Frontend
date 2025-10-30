// src/api/dashboardAPI.js
import axiosClient from "./axiosClient";

export const fetchDashboardStats = async () => {
  const response = await axiosClient.get("/dashboard/stats");
  return response.data;
};

export const fetchRecentProjects = async () => {
  const response = await axiosClient.get("/dashboard/recent-projects");
  return response.data;
};

export const fetchRecentTransactions = async () => {
  const response = await axiosClient.get("/dashboard/transactions");
  return response.data;
};

export const fetchRevenueData = async () => {
  const response = await axiosClient.get("/dashboard/revenue");
  return response.data;
};
export const approveProject = async (projectId) => {
  const res = await axiosClient.post("/projects/approve", { project_id: projectId });
  return res.data;
};
