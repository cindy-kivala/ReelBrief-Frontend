/**
 * components/deliverables/FeedbackForm.jsx
 * Owner: Cindy
 * Description: Allows clients or reviewers to submit feedback on deliverables.
 */

// TODO:
// - Form fields for rating, comments, and submission
// - Connect submit button to feedbackAPI
/**
 * components/deliverables/FeedbackForm.jsx
 * Owner: Cindy
 * Description: Allows clients or reviewers to submit feedback on deliverables.
 */

import { useState } from 'react';
import { Send, AlertCircle, CheckCircle } from 'lucide-react';
import { submitFeedback } from '../../api/feedbackAPI';

const FeedbackForm = ({ deliverableId, parentFeedbackId = null, onSuccess, onCancel }) => {
  const [formData, setFormData] = useState({
    content: '',
    feedback_type: 'comment',
    priority: 'medium'
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const feedbackTypes = [
    { value: 'comment', label: 'Comment', description: 'General comment or note' },
    { value: 'revision', label: 'Revision Request', description: 'Request changes to deliverable' },
    { value: 'approval', label: 'Approval', description: 'Approve deliverable' }
  ];

  const priorities = [
    { value: 'low', label: 'Low', color: 'bg-[#1E3A8A] text-white' },
    { value: 'medium', label: 'Medium', color: 'bg-[#F59E0B] text-white' },
    { value: 'high', label: 'High', color: 'bg-[#FF6B6B] text-white' }
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.content.trim()) {
      setError('Please enter feedback content');
      return;
    }

    setSubmitting(true);
    setError(null);
    setSuccess(false);

    try {
      const feedbackData = {
        deliverable_id: deliverableId,
        feedback_type: formData.feedback_type,
        content: formData.content,
        priority: formData.priority,
        ...(parentFeedbackId && { parent_feedback_id: parentFeedbackId })
      };

      const response = await submitFeedback(feedbackData);
      
      setSuccess(true);
      setFormData({
        content: '',
        feedback_type: 'comment',
        priority: 'medium'
      });

      if (onSuccess) {
        onSuccess(response.feedback);
      }

      setTimeout(() => {
        setSuccess(false);
      }, 3000);

    } catch (err) {
      setError(err.error || 'Failed to submit feedback');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-[#D1D5DB] p-8">
      <div className="mb-6">
        <h3 className="text-xl text-[#1F2937] mb-1" style={{ fontWeight: 600 }}>
          {parentFeedbackId ? 'Reply to Feedback' : 'Submit Feedback'}
        </h3>
        <p className="text-sm text-[#4B5563]">Share your thoughts and suggestions</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Feedback Type Selection */}
        {!parentFeedbackId && (
          <div>
            <label className="block text-sm text-[#1F2937] mb-3" style={{ fontWeight: 600 }}>
              Feedback Type
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {feedbackTypes.map((type) => (
                <label
                  key={type.value}
                  className={`relative flex flex-col p-4 border-2 rounded-lg cursor-pointer transition-all duration-200 ${
                    formData.feedback_type === type.value
                      ? 'border-[#1E3A8A] bg-[#1E3A8A]/5 shadow-sm'
                      : 'border-[#D1D5DB] hover:border-[#4B5563] hover:bg-[#F3F4F6]'
                  }`}
                >
                  <input
                    type="radio"
                    name="feedback_type"
                    value={type.value}
                    checked={formData.feedback_type === type.value}
                    onChange={handleInputChange}
                    className="sr-only"
                  />
                  <span className="text-sm text-[#1F2937] mb-1" style={{ fontWeight: 600 }}>
                    {type.label}
                  </span>
                  <span className="text-xs text-[#4B5563]">{type.description}</span>
                </label>
              ))}
            </div>
          </div>
        )}

        {/* Priority Selection */}
        <div>
          <label className="block text-sm text-[#1F2937] mb-3" style={{ fontWeight: 600 }}>
            Priority
          </label>
          <div className="flex gap-3">
            {priorities.map((priority) => (
              <button
                key={priority.value}
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, priority: priority.value }))}
                className={`px-5 py-2.5 rounded-lg text-sm transition-all duration-200 ${
                  formData.priority === priority.value
                    ? priority.color
                    : 'bg-[#F3F4F6] text-[#4B5563] hover:bg-[#D1D5DB]'
                }`}
                style={{ fontWeight: 600 }}
              >
                {priority.label}
              </button>
            ))}
          </div>
        </div>

        {/* Feedback Content */}
        <div>
          <label className="block text-sm text-[#1F2937] mb-2" style={{ fontWeight: 600 }}>
            Feedback Content <span className="text-[#FF6B6B]">*</span>
          </label>
          <textarea
            name="content"
            value={formData.content}
            onChange={handleInputChange}
            placeholder={
              formData.feedback_type === 'revision'
                ? 'Describe what needs to be changed...'
                : formData.feedback_type === 'approval'
                ? 'Add approval notes (optional)...'
                : 'Enter your feedback...'
            }
            rows={6}
            required
            disabled={submitting}
            className="w-full px-4 py-3 border border-[#D1D5DB] rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#1E3A8A] focus:border-[#1E3A8A] disabled:bg-[#F3F4F6] transition-all"
          />
          <p className="text-xs text-[#4B5563] mt-2">
            {formData.content.length} characters
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="p-4 bg-[#FF6B6B]/10 border border-[#FF6B6B]/20 rounded-lg flex items-start">
            <AlertCircle className="w-5 h-5 text-[#FF6B6B] mr-3 mt-0.5 flex-shrink-0" />
            <span className="text-[#FF6B6B] text-sm" style={{ fontWeight: 500 }}>
              {error}
            </span>
          </div>
        )}

        {/* Success Message */}
        {success && (
          <div className="p-4 bg-[#10B981]/10 border border-[#10B981]/20 rounded-lg flex items-center">
            <CheckCircle className="w-5 h-5 text-[#10B981] mr-3 flex-shrink-0" />
            <span className="text-[#10B981] text-sm" style={{ fontWeight: 600 }}>
              Feedback submitted successfully!
            </span>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-3 pt-2">
          <button
            type="submit"
            disabled={submitting || !formData.content.trim()}
            className="flex-1 px-6 py-2.5 bg-[#1E3A8A] text-white rounded-lg hover:bg-[#1E3A8A]/90 disabled:bg-[#D1D5DB] disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#1E3A8A]"
            style={{ fontWeight: 600 }}
          >
            {submitting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Submitting...
              </>
            ) : (
              <>
                <Send className="w-4 h-4 mr-2" />
                Submit Feedback
              </>
            )}
          </button>

          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              disabled={submitting}
              className="px-6 py-2.5 bg-[#F3F4F6] text-[#4B5563] rounded-lg hover:bg-[#D1D5DB] disabled:bg-[#F3F4F6]/50 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#4B5563]"
              style={{ fontWeight: 600 }}
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      {/* Helper Text */}
      {formData.feedback_type === 'revision' && (
        <div className="mt-6 p-4 bg-[#1E3A8A]/10 border border-[#1E3A8A]/20 rounded-lg">
          <p className="text-sm text-[#1E3A8A]">
            <strong style={{ fontWeight: 600 }}>Tip:</strong> Be specific about what needs to change. Include details like colors, sizes, positioning, or content that should be adjusted.
          </p>
        </div>
      )}
    </div>
  );
};

export default FeedbackForm;