/**
 * projectAPI.js
 * Owner: Monica
 * Description: Handles API requests for project creation, retrieval, updates, and deletion.
 */

import axios from "axios";

// ✅ Base API instance — reads backend URL from .env (Vite format)
const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// ✅ Automatically attach JWT token if available
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ✅ Fetch all projects (optionally with filters)
export const fetchAllProjects = async (params = {}) => {
  const response = await API.get("/projects", { params });
  return response.data;
};

// ✅ Fetch a single project by ID
export const fetchProjectById = async (id) => {
  const response = await API.get(`/projects/${id}`);
  return response.data;
};

// ✅ Create a new project
export const createProject = async (data) => {
  const response = await API.post("/projects", data);
  return response.data;
};

// ✅ Update an existing project
export const updateProject = async (id, data) => {
  const response = await API.patch(`/projects/${id}`, data);
  return response.data;
};

// ✅ Delete or cancel a project
export const deleteProject = async (id) => {
  const response = await API.delete(`/projects/${id}`);
  return response.data;
};

// ✅ Assign freelancer to a project
export const assignFreelancer = async (id, freelancerId) => {
  const response = await API.post(`/projects/${id}/assign-freelancer`, {
    freelancer_id: freelancerId,
  });
  return response.data;
};

// ✅ Mark project as completed
export const completeProject = async (id) => {
  const response = await API.post(`/projects/${id}/complete`);
  return response.data;
};

// ✅ Export the API instance (optional, for custom requests)
export default API;
