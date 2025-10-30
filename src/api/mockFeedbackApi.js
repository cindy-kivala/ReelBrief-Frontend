// src/api/mockFeedbackAPI.js
class MockAPIError extends Error {
  constructor(message, status = 0) {
    super(message);
    this.name = 'MockAPIError';
    this.status = status;
  }
}

// Mock data storage (in real app, this would be in backend)
let mockFeedbackData = [
  {
    id: '1',
    deliverable_id: '1',
    author_id: '107',
    content: 'Great work on the color grading! The tones are perfect.',
    feedback_type: 'approval',
    priority: 'high',
    status: 'active',
    created_at: new Date().toISOString(),
    author: {
      id: '107',
      first_name: 'Alex',
      last_name: 'Thompson',
      email: 'alex.designer@demo.com'
    }
  },
  {
    id: '2',
    deliverable_id: '1',
    author_id: '108',
    content: 'Could you adjust the brightness a bit?',
    feedback_type: 'revision',
    priority: 'medium',
    status: 'active',
    created_at: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
    author: {
      id: '108',
      first_name: 'Sarah',
      last_name: 'Johnson',
      email: 'sarah.johnson@techstartup.com'
    }
  }
];

// Mock submit feedback
export const submitFeedback = async (feedbackData) => {
  try {
    console.log('[MOCK] Submitting feedback:', feedbackData);
    
    if (!feedbackData.deliverable_id || !feedbackData.content) {
      throw new MockAPIError('Deliverable ID and content are required');
    }

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    const newFeedback = {
      id: `mock-${Date.now()}`,
      deliverable_id: feedbackData.deliverable_id,
      author_id: '107', // Mock user ID
      content: feedbackData.content,
      feedback_type: feedbackData.feedback_type || 'comment',
      priority: feedbackData.priority || 'medium',
      status: 'active',
      created_at: new Date().toISOString(),
      author: {
        id: '107',
        first_name: 'Alex',
        last_name: 'Thompson',
        email: 'alex.designer@demo.com'
      }
    };

    mockFeedbackData.push(newFeedback);

    console.log('[MOCK] Feedback submitted successfully:', newFeedback);
    
    return {
      success: true,
      message: 'Feedback submitted successfully',
      feedback: newFeedback
    };
    
  } catch (error) {
    console.error('[MOCK] Submit feedback error:', error);
    throw new MockAPIError(error.message || 'Failed to submit feedback');
  }
};

// Mock fetch feedback for deliverable
export const fetchFeedback = async (deliverableId) => {
  try {
    console.log('[MOCK] Fetching feedback for deliverable:', deliverableId);
    
    if (!deliverableId) {
      throw new MockAPIError('Deliverable ID is required');
    }

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));

    const feedback = mockFeedbackData.filter(fb => fb.deliverable_id === deliverableId);
    
    console.log('[MOCK] Feedback fetched:', feedback);
    
    return {
      success: true,
      feedback: feedback,
      count: feedback.length
    };
    
  } catch (error) {
    console.error('[MOCK] Fetch feedback error:', error);
    throw new MockAPIError(error.message || 'Failed to fetch feedback');
  }
};

// Mock resolve feedback
export const resolveFeedback = async (feedbackId) => {
  try {
    console.log('[MOCK] Resolving feedback:', feedbackId);
    
    if (!feedbackId) {
      throw new MockAPIError('Feedback ID is required');
    }

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));

    const feedback = mockFeedbackData.find(fb => fb.id === feedbackId);
    if (feedback) {
      feedback.status = 'resolved';
    }
    
    return {
      success: true,
      message: 'Feedback resolved successfully',
      feedback: feedback
    };
    
  } catch (error) {
    console.error('[MOCK] Resolve feedback error:', error);
    throw new MockAPIError(error.message || 'Failed to resolve feedback');
  }
};