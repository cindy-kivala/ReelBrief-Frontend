const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const USE_MOCK_DATA = import.meta.env.VITE_USE_MOCK_DATA === 'true';

//  MOCK DATA
const mockDeliverables = [
  {
    id: 1,
    title: "Website Homepage Design",
    version_number: 1,
    status: "in_review",
    file_url: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800",
    file_type: "image",
    file_size: 2048576,
    uploaded_at: "2024-01-15T10:30:00Z",
    project_id: 1,
    uploader: {
      first_name: "John",
      last_name: "Designer",
      email: "john@example.com"
    },
    change_notes: "Initial design submission"
  },
  {
    id: 2,
    title: "Website Homepage Design",
    version_number: 2,
    status: "pending",
    file_url: "https://images.unsplash.com/photo-1618005198919-d3d4b5a92ead?w=800",
    file_type: "image",
    file_size: 2097152,
    uploaded_at: "2024-01-20T14:45:00Z",
    project_id: 1,
    uploader: {
      first_name: "John",
      last_name: "Designer",
      email: "john@example.com"
    },
    change_notes: "Updated based on client feedback"
  }
];

//  MOCK FUNCTIONS
const mockFetchDeliverableById = async (id) => {
  await new Promise(resolve => setTimeout(resolve, 1000));
  const deliverable = mockDeliverables.find(d => d.id === parseInt(id));
  if (!deliverable) throw new Error('Deliverable not found');
  return { success: true, deliverable };
};

const mockApproveDeliverable = async (id) => {
  await new Promise(resolve => setTimeout(resolve, 800));
  const deliverable = mockDeliverables.find(d => d.id === parseInt(id));
  if (!deliverable) throw new Error('Deliverable not found');
  deliverable.status = 'approved';
  return { success: true, message: 'Deliverable approved successfully', deliverable };
};

const mockGetDeliverableVersions = async (id) => {
  await new Promise(resolve => setTimeout(resolve, 600));
  const mainDeliverable = mockDeliverables.find(d => d.id === parseInt(id));
  if (!mainDeliverable) throw new Error('Deliverable not found');
  const versions = mockDeliverables.filter(d => d.title === mainDeliverable.title);
  return { success: true, versions, total_versions: versions.length };
};

const mockUploadDeliverable = async (projectId, formData) => {
  await new Promise(resolve => setTimeout(resolve, 1500));
  const newDeliverable = {
    id: mockDeliverables.length + 1,
    title: formData.get('title') || `Deliverable ${mockDeliverables.length + 1}`,
    version_number: mockDeliverables.filter(d => d.project_id === projectId).length + 1,
    status: "pending",
    file_url: "https://images.unsplash.com/photo-1618005198919-d3d4b5a92ead?w=800",
    file_type: "image",
    file_size: 0,
    uploaded_at: new Date().toISOString(),
    project_id: projectId,
    uploader: {
      first_name: "Current",
      last_name: "User", 
      email: "user@example.com"
    },
    change_notes: formData.get('change_notes') || "New version uploaded"
  };
  mockDeliverables.push(newDeliverable);
  return { success: true, message: 'Deliverable uploaded successfully', deliverable: newDeliverable };
};

// PRODUCTION FUNCTIONS
// GET /api/deliverables/:id
const prodFetchDeliverableById = async (id) => {
  const response = await fetch(`${API_BASE_URL}/api/deliverables/${id}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    }
  });
  if (!response.ok) throw new Error('Failed to fetch deliverable');
  return await response.json();
};

// POST /api/deliverables/:id/approve
const prodApproveDeliverable = async (id) => {
  const response = await fetch(`${API_BASE_URL}/api/deliverables/${id}/approve`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    }
  });
  if (!response.ok) throw new Error('Failed to approve deliverable');
  return await response.json();
};

// GET /api/deliverables/:id/versions
const prodGetDeliverableVersions = async (id) => {
  const response = await fetch(`${API_BASE_URL}/api/deliverables/${id}/versions`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    }
  });
  if (!response.ok) throw new Error('Failed to fetch versions');
  return await response.json();
};

// POST /api/deliverables (with multipart/form-data)
const prodUploadDeliverable = async (projectId, formData) => {
  // Ensure project_id is in formData
  if (!formData.has('project_id')) {
    formData.append('project_id', projectId);
  }
  
  const response = await fetch(`${API_BASE_URL}/api/deliverables`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('token')}`
      // Remember== Don't set Content-Type for FormData - browser sets it automatically with boundary
    },
    body: formData
  });
  if (!response.ok) throw new Error('Failed to upload deliverable');
  return await response.json();
};

// EXPORTS (Toggle based on environment) 
export const fetchDeliverableById = USE_MOCK_DATA ? mockFetchDeliverableById : prodFetchDeliverableById;
export const approveDeliverable = USE_MOCK_DATA ? mockApproveDeliverable : prodApproveDeliverable;
export const getDeliverableVersions = USE_MOCK_DATA ? mockGetDeliverableVersions : prodGetDeliverableVersions;
export const uploadDeliverable = USE_MOCK_DATA ? mockUploadDeliverable : prodUploadDeliverable;

