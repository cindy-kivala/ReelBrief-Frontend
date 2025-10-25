
const API_BASE_URL_FEEDBACK = import.meta.env.VITE_API_BASE_URL;
const USE_MOCK_DATA_FEEDBACK = import.meta.env.VITE_USE_MOCK_DATA === 'true';

//  MOCK DATA 
const mockFeedback = [
  {
    id: 1,
    deliverable_id: 1,
    content: "Great work on the initial design! Just a few minor tweaks needed on the header section.",
    priority: "medium",
    is_resolved: false,
    created_at: "2024-01-16T09:00:00Z",
    author: {
      first_name: "Sarah",
      last_name: "Client",
      email: "sarah@client.com"
    }
  },
  {
    id: 2,
    deliverable_id: 1,
    content: "Can you make the logo 20% larger? It's a bit hard to see.",
    priority: "high",
    is_resolved: true,
    created_at: "2024-01-16T10:30:00Z",
    author: {
      first_name: "Mike",
      last_name: "Manager",
      email: "mike@client.com"
    }
  },
  {
    id: 3,
    deliverable_id: 2,
    content: "Much better! The logo size is perfect now.",
    priority: "low",
    is_resolved: false,
    created_at: "2024-01-21T11:00:00Z",
    author: {
      first_name: "Sarah",
      last_name: "Client",
      email: "sarah@client.com"
    }
  }
];

//  MOCK FUNCTIONS 
const mockFetchFeedback = async (deliverableId) => {
  await new Promise(resolve => setTimeout(resolve, 500));
  const feedback = mockFeedback.filter(f => f.deliverable_id === parseInt(deliverableId));
  return { 
    success: true, 
    feedback, 
    total_count: feedback.length,
    unresolved_count: feedback.filter(f => !f.is_resolved).length
  };
};

const mockSubmitFeedback = async (feedbackData) => {
  await new Promise(resolve => setTimeout(resolve, 800));
  const newFeedback = {
    id: mockFeedback.length + 1,
    deliverable_id: feedbackData.deliverable_id,
    content: feedbackData.content,
    priority: feedbackData.priority || 'medium',
    feedback_type: feedbackData.feedback_type || 'comment',
    is_resolved: false,
    created_at: new Date().toISOString(),
    author: {
      first_name: "Current",
      last_name: "User",
      email: "user@example.com"
    }
  };
  mockFeedback.push(newFeedback);
  return { success: true, message: 'Feedback submitted successfully', feedback: newFeedback };
};

const mockResolveFeedback = async (feedbackId) => {
  await new Promise(resolve => setTimeout(resolve, 400));
  const feedback = mockFeedback.find(f => f.id === parseInt(feedbackId));
  if (!feedback) throw new Error('Feedback not found');
  feedback.is_resolved = true;
  return { success: true, message: 'Feedback marked as resolved', feedback };
};

// PRODUCTION FUNCTIONS 
// GET /api/feedback/deliverables/:deliverable_id
const prodFetchFeedback = async (deliverableId) => {
  const response = await fetch(`${API_BASE_URL_FEEDBACK}/api/feedback/deliverables/${deliverableId}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    }
  });
  if (!response.ok) throw new Error('Failed to fetch feedback');
  return await response.json();
};

// POST /api/feedback
const prodSubmitFeedback = async (feedbackData) => {
  const response = await fetch(`${API_BASE_URL_FEEDBACK}/api/feedback`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    },
    body: JSON.stringify(feedbackData)
  });
  if (!response.ok) throw new Error('Failed to submit feedback');
  return await response.json();
};

// PATCH /api/feedback/:id/resolve
const prodResolveFeedback = async (feedbackId) => {
  const response = await fetch(`${API_BASE_URL_FEEDBACK}/api/feedback/${feedbackId}/resolve`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    }
  });
  if (!response.ok) throw new Error('Failed to resolve feedback');
  return await response.json();
};

//  EXPORTS (Toggle based on the environment we are in)
export const fetchFeedback = USE_MOCK_DATA_FEEDBACK ? mockFetchFeedback : prodFetchFeedback;
export const submitFeedback = USE_MOCK_DATA_FEEDBACK ? mockSubmitFeedback : prodSubmitFeedback;
export const resolveFeedback = USE_MOCK_DATA_FEEDBACK ? mockResolveFeedback : prodResolveFeedback;