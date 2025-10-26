/**
 * freelancerAPI.js
 * Owner: Monica
 * Description: Handles API requests related to freelancers and project matches.
 */

// TODO: Implement API functions:
// - fetchFreelancers()
// - fetchFreelancerById(id)
// - matchFreelancersToProject(projectId)


import axios from "axios";

// Create an axios instance with a base URL
const API = axios.create({
  baseURL: process.env.REACT_APP_API_URL || "/api",
  timeout: 10000,
});

// Automatically attach the JWT token if available
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});


// Fetch all freelancers (admin-only route)
// GET /api/freelancers

export const fetchFreelancers = async (params = {}) => {
  try {
    const response = await API.get("/freelancers", { params });
    return response.data;
  } catch (error) {
    console.error("Error fetching freelancers:", error);
    throw error;
  }
};


// Fetch a single freelancer by ID
// GET /api/freelancers/:id

export const fetchFreelancerById = async (id) => {
  try {
    const response = await API.get(`/freelancers/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching freelancer with ID ${id}:`, error);
    throw error;
  }
};


// Match freelancers to a specific project
// GET /api/freelancers/search?skills[]=...&open_to_work=true

export const matchFreelancersToProject = async (projectId, skills = []) => {
  try {
    // Convert skills into query params (e.g., ?skills=UI%20Design&skills=Copywriting)
    const query = skills.map((s) => `skills=${encodeURIComponent(s)}`).join("&");
    const response = await API.get(`/freelancers/search?project_id=${projectId}&${query}`);
    return response.data.results || [];
  } catch (error) {
    console.error("Error matching freelancers:", error);
    throw error;
  }
};
