// src/api/deliverableAPI.js
import axiosClient from './axiosClient';

class APIError extends Error {
  constructor(message, status = 0, details = null) {
    super(message);
    this.name = 'APIError';
    this.status = status;
    this.details = details;
  }
}

// GET deliverables by project ID 
export const fetchDeliverablesByProject = async (projectId) => {
  try {
    console.log('Fetching deliverables for project:', projectId);
    const response = await axiosClient.get(`/api/deliverable/projects/${projectId}`);
    console.log('Project deliverables fetched:', response.data);
    return response.data;
  } catch (error) {
    console.error('Fetch project deliverables error:', error);
    throw new APIError(
      error.response?.data?.error || 'Failed to fetch project deliverables',
      error.response?.status,
      error.response?.data
    );
  }
};

// GET single deliverable by ID
export const fetchDeliverableById = async (deliverableId) => {
  try {
    console.log('Fetching deliverable:', deliverableId);
    const response = await axiosClient.get(`/api/deliverable/${deliverableId}`);
    console.log('Deliverable fetched:', response.data);
    return response.data;
  } catch (error) {
    console.error('Fetch deliverable error:', error);
    throw new APIError(
      error.response?.data?.error || 'Failed to fetch deliverable',
      error.response?.status,
      error.response?.data
    );
  }
};

// POST - Upload new deliverable 
export const uploadDeliverable = async (formData) => {
  try {
    console.log('Uploading deliverable...');
    const response = await axiosClient.post('/api/deliverable', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    console.log('Deliverable uploaded successfully:', response.data);
    return response.data;
  } catch (error) {
    console.error('Upload deliverable error:', error);
    throw new APIError(
      error.response?.data?.error || 'Failed to upload deliverable',
      error.response?.status,
      error.response?.data
    );
  }
};

// GET freelancer deliverables 
export const fetchMyDeliverables = async () => {
  try {
    console.log('Fetching freelancer deliverables...');
    const response = await axiosClient.get('/api/deliverable/freelancer/my-deliverables');
    console.log('Freelancer deliverables fetched:', response.data);
    return response.data;
  } catch (error) {
    console.error('Fetch freelancer deliverables error:', error);
    throw new APIError(
      error.response?.data?.error || 'Failed to fetch deliverables',
      error.response?.status,
      error.response?.data
    );
  }
};