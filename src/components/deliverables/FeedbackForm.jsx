import React, { useState } from 'react';
import { Button, InputField, Card } from '../common';
import { submitFeedback } from '../../api/feedbackAPI';

const FeedbackForm = ({ deliverableId, onSuccess }) => {
  const [formData, setFormData] = useState({
    content: '',
    priority: 'medium',
    feedback_type: 'comment'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      const feedbackData = {
        deliverable_id: deliverableId,
        content: formData.content,
        priority: formData.priority,
        feedback_type: formData.feedback_type
      };

      const response = await submitFeedback(feedbackData);
      
      // Reset form
      setFormData({
        content: '',
        priority: 'medium',
        feedback_type: 'comment'
      });
      
      // Notify parent
      onSuccess?.(response.feedback);
      
    } catch (err) {
      console.error('Failed to submit feedback:', err);
      setError(err.error || 'Failed to submit feedback. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold text-[#1F2937] mb-4">Add Feedback</h3>
      
      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-800 text-sm">{error}</p>
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <InputField
          as="textarea"
          rows={4}
          label="Feedback"
          value={formData.content}
          onChange={(e) => handleChange('content', e.target.value)}
          placeholder="Enter your feedback..."
          required
        />

        <div>
          <label className="block text-sm font-medium text-[#1F2937] mb-2">
            Priority
          </label>
          <select
            value={formData.priority}
            onChange={(e) => handleChange('priority', e.target.value)}
            className="border border-[#D1D5DB] rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1E3A8A] focus:border-[#1E3A8A] w-full"
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-[#1F2937] mb-2">
            Feedback Type
          </label>
          <select
            value={formData.feedback_type}
            onChange={(e) => handleChange('feedback_type', e.target.value)}
            className="border border-[#D1D5DB] rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1E3A8A] focus:border-[#1E3A8A] w-full"
          >
            <option value="comment">Comment</option>
            <option value="revision">Revision Request</option>
            <option value="approval">Approval</option>
          </select>
        </div>

        <Button
          type="submit"
          disabled={loading || !formData.content.trim()}
          className="w-full bg-[#1E3A8A] text-white hover:bg-[#1E3A8A]/90"
        >
          {loading ? 'Submitting...' : 'Submit Feedback'}
        </Button>
      </form>
    </Card>
  );
};

export default FeedbackForm;