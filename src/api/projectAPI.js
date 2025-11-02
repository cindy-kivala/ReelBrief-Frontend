/**
 * projectAPI.js
 * Owner: Monica
 * Description: Handles API requests for project creation, retrieval, updates, and deletion.
 */


import API from "./axiosClient"; //  shared Axios client setup

//  Fetch all projects 
export const fetchAllProjects = async (params = {}) => {
  const response = await API.get("/api/projects", { params }); 
  return response.data;
};

//Fetch a single project by ID
export const fetchProjectById = async (id) => {
  const response = await API.get(`/api/projects/${id}`); 
  return response.data;
};

//  Create a new project
export const createProject = async (data) => {
  const response = await API.post("/api/projects", data); 
  return response.data;
};

// Update an existing project
export const updateProject = async (id, data) => {
  const response = await API.patch(`/api/projects/${id}`, data); 
  return response.data;
};

//  Delete or cancel a project
export const deleteProject = async (id) => {
  const response = await API.delete(`/api/projects/${id}`); 
  return response.data;
};

//  Assign freelancer to a project
export const assignFreelancer = async (id, freelancerId) => {
  const response = await API.post(`/api/projects/${id}/assign-freelancer`, { 
    freelancer_id: freelancerId,
  });
  return response.data;
};

//  Mark project as completed
export const completeProject = async (id) => {
  const response = await API.post(`/api/projects/${id}/complete`); 
  return response.data;
};

export default API;