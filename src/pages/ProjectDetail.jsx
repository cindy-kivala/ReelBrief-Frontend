import React, { useEffect, useState } from "react";
import { fetchProjectById } from "../api/projectAPI";
import { 
  fetchDeliverablesByProject, 
  approveDeliverable, 
  rejectDeliverable, 
  requestRevision 
} from "../api/deliverableAPI";
import { fetchFeedback, submitFeedback } from "../api/feedbackAPI"; 
import CloudinaryUpload from "../components/deliverables/CloudinaryUpload";
import VersionCompare from '../components/deliverables/VersionCompare';
import AssignFreelancerModal from '../components/projects/AssignFreelancerModal';
import FeedbackForm from '../components/deliverables/FeedbackForm';
import FeedbackList from '../components/deliverables/FeedbackList';
import DownloadButton from "../components/deliverables/DownloadButton";
import { useAuth } from "../context/AuthContext";

export default function ProjectDetail({ projectId, onClose, onUpdated }) {
  const [project, setProject] = useState(null);
  const [deliverables, setDeliverables] = useState([]);
  const [portfolioItems, setPortfolioItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("deliverables");
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [showVersions, setShowVersions] = useState(null);
  const [selectedDeliverableForFeedback, setSelectedDeliverableForFeedback] = useState(null);
  const [feedbacks, setFeedbacks] = useState({});

  const { user } = useAuth();
  const isClient = user?.role === 'client';
  const isAdmin = user?.role === 'admin';
  const isFreelancer = user?.role === 'freelancer';

  const loadFeedback = async (deliverableId) => {
    try {
      const feedbackData = await fetchFeedback(deliverableId);
      setFeedbacks(prev => ({
        ...prev,
        [deliverableId]: feedbackData.feedback || feedbackData.feedbacks || []
      }));
    } catch (error) {
      console.error('Failed to load feedback:', error);
      setFeedbacks(prev => ({
        ...prev,
        [deliverableId]: []
      }));
    }
  };

  const loadPortfolioItems = async () => {
    try {
      const token = localStorage.getItem('access_token');
      const response = await fetch('/api/deliverables/portfolio/items', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      const data = await response.json();
      if (data.success) {
        setPortfolioItems(data.portfolio_items || []);
      }
    } catch (error) {
      console.error('Error loading portfolio:', error);
      setPortfolioItems([]);
    }
  };

  const togglePortfolioVisibility = async (itemId, currentVisibility) => {
    try {
      const token = localStorage.getItem('access_token');
      const response = await fetch(`/api/deliverables/portfolio/items/${itemId}/toggle-visibility`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const result = await response.json();
      if (result.success) {
        setPortfolioItems(prev => 
          prev.map(item => 
            item.id === itemId ? result.portfolio_item : item
          )
        );
      }
    } catch (error) {
      console.error('Error toggling visibility:', error);
    }
  };

  useEffect(() => {
    if (selectedDeliverableForFeedback) {
      loadFeedback(selectedDeliverableForFeedback.id);
    }
  }, [selectedDeliverableForFeedback]);

  useEffect(() => {
    if (activeTab === "portfolio") {
      loadPortfolioItems();
    }
  }, [activeTab]);

  const loadProject = async () => {
    try {
      setLoading(true);
      console.log("Loading project with ID:", projectId);
      
      const projectData = await fetchProjectById(projectId);
      console.log("Project data received:", projectData);
      setProject(projectData);

      const deliverablesData = await fetchDeliverablesByProject(projectId);
      console.log("Deliverables data received:", deliverablesData);
      
      const deliverablesArray = deliverablesData.deliverables || deliverablesData || [];
      setDeliverables(Array.isArray(deliverablesArray) ? deliverablesArray : []);
      
    } catch (err) {
      console.error("Failed to load project:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (projectId) {
      loadProject();
    }
  }, [projectId]);

  // Action handlers for client/admin actions
  const handleApprove = async (deliverableId) => {
    try {
      await approveDeliverable(deliverableId);
      console.log('Deliverable approved');
      loadProject();
      if (onUpdated) onUpdated();
    } catch (error) {
      console.error('Failed to approve deliverable:', error);
      setError('Failed to approve deliverable');
    }
  };

  const handleReject = async (deliverableId) => {
    try {
      const reason = prompt('Please enter rejection reason:');
      if (reason) {
        await rejectDeliverable(deliverableId, reason);
        console.log('Deliverable rejected');
        loadProject();
        if (onUpdated) onUpdated();
      }
    } catch (error) {
      console.error('Failed to reject deliverable:', error);
      setError('Failed to reject deliverable');
    }
  };

  const handleRequestRevision = async (deliverableId) => {
    try {
      const revisionNotes = prompt('Please enter revision notes:');
      if (revisionNotes) {
        await requestRevision(deliverableId, revisionNotes);
        console.log('Revision requested');
        loadProject();
        if (onUpdated) onUpdated();
      }
    } catch (error) {
      console.error('Failed to request revision:', error);
      setError('Failed to request revision');
    }
  };

  const handleAssignFreelancer = async (freelancerUserId) => {
    try {
      const token = localStorage.getItem('access_token');
      const response = await fetch(`/api/projects/${projectId}/assign-freelancer`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          freelancer_id: freelancerUserId
        })
      });

      const result = await response.json();
      
      if (response.ok) {
        console.log('Freelancer assigned successfully:', result);
        setProject(result.project);
        setShowAssignModal(false);
        if (onUpdated) onUpdated();
      } else {
        setError(result.error || 'Failed to assign freelancer');
      }
    } catch (error) {
      console.error('Error assigning freelancer:', error);
      setError('Error assigning freelancer');
    }
  };

  const onUploadSuccess = (newDeliverable) => {
    console.log("Deliverable uploaded successfully:", newDeliverable);
    loadProject();
    if (onUpdated) onUpdated();
  };

  const onUploadError = (error) => {
    console.error("Upload failed:", error);
    setError(error.message);
  };

  if (loading) return <div className="p-4">Loading project...</div>;
  if (error) return <div className="p-4 text-red-500">Error: {error}</div>;
  if (!project) return <div className="p-4">Project not found</div>;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-6xl w-full max-h-[95vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b">
          <div>
            <h2 className="text-2xl font-bold">{project.title}</h2>
            <p className="text-gray-600 mt-1">{project.description}</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl"
          >
            ×
          </button>
        </div>

        {/* Project Info */}
        <div className="p-6 border-b">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <h3 className="font-semibold text-gray-700">Budget</h3>
              <p className="mt-1">${project.budget}</p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-700">Status</h3>
              <p className="mt-1 capitalize">{project.status}</p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-700">Deadline</h3>
              <p className="mt-1">
                {project.deadline ? new Date(project.deadline).toLocaleDateString() : 'Not set'}
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-700">
                {project.freelancer_id ? 'Assigned To' : 'Client'}
              </h3>
              <p className="mt-1">
                {project.freelancer_id ? `Freelancer #${project.freelancer_id}` : `Client #${project.client_id}`}
              </p>
            </div>
          </div>

          {/* Assignment Status */}
          {(isClient || isAdmin) && (
            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
              <div className="flex justify-between items-center">
                <div>
                  <h4 className="font-semibold text-gray-700">Freelancer Assignment</h4>
                  <p className="text-sm text-gray-600 mt-1">
                    {project.freelancer_id 
                      ? 'Project has been assigned to a freelancer'
                      : 'No freelancer assigned yet'
                    }
                  </p>
                </div>
                {!project.freelancer_id && (
                  <button
                    onClick={() => setShowAssignModal(true)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Assign Freelancer
                  </button>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Tabs */}
        <div className="border-b">
          <div className="flex space-x-8 px-6">
            <button
              onClick={() => setActiveTab("deliverables")}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === "deliverables"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              Deliverables
            </button>
            
            {/* Portfolio Tab - Show for freelancers */}
            {isFreelancer && (
              <button
                onClick={() => setActiveTab("portfolio")}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === "portfolio"
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700"
                }`}
              >
                📁 Portfolio
              </button>
            )}
            
            {(isClient || isAdmin) && !project.freelancer_id && (
              <button
                onClick={() => setActiveTab("assignment")}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === "assignment"
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700"
                }`}
              >
                Assign Freelancer
              </button>
            )}
            <button
              onClick={() => setActiveTab("versions")}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === "versions"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              Version History
            </button>
            <button 
              onClick={() => setActiveTab("feedback")} 
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === "feedback" 
                  ? "border-blue-500 text-blue-600" 
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              Feedback
            </button>
          </div>
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {/* Deliverables Tab */}
          {activeTab === "deliverables" && (
            <div className="space-y-6">
              {/* Upload Section - Only for assigned freelancer */}
              {isFreelancer && project.freelancer_id === user?.id && (
                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="text-lg font-semibold mb-4">Upload New Deliverable</h3>
                  <CloudinaryUpload
                    projectId={projectId}
                    onUploadSuccess={onUploadSuccess}
                    onUploadError={onUploadError}
                  />
                </div>
              )}

              {/* Assignment Notice for Freelancer */}
              {isFreelancer && !project.freelancer_id && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <p className="text-yellow-800">
                    This project has not been assigned to a freelancer yet.
                  </p>
                </div>
              )}

              {/* Assignment Notice for Other Freelancers */}
              {isFreelancer && project.freelancer_id && project.freelancer_id !== user?.id && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p className="text-blue-800">
                    This project is assigned to another freelancer.
                  </p>
                </div>
              )}

              {/* Deliverables List */}
              <div>
                <h3 className="text-lg font-semibold mb-4">
                  Deliverables ({deliverables.length})
                </h3>
                
                {deliverables.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">
                    No deliverables uploaded yet.
                  </p>
                ) : (
                  <div className="space-y-4">
                    {deliverables.map((deliverable) => (
                      <div
                        key={deliverable.id}
                        className="border rounded-lg p-4 hover:shadow-md transition-shadow"
                      >
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <div className="flex items-center gap-3">
                              <h4 className="font-semibold text-lg">{deliverable.title}</h4>
                              <span className="text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded">
                                v{deliverable.version_number}
                              </span>
                            </div>
                            
                            {deliverable.description && (
                              <p className="text-gray-600 mt-1">{deliverable.description}</p>
                            )}
                            
                            {deliverable.change_notes && (
                              <p className="text-sm text-blue-600 mt-1">
                                <strong>Changes:</strong> {deliverable.change_notes}
                              </p>
                            )}
                            
                            <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                              <span>{deliverable.file_type}</span>
                              <span>•</span>
                              <span>
                                {deliverable.file_size ? 
                                  `${(deliverable.file_size / 1024 / 1024).toFixed(2)} MB` : 
                                  'Size unknown'
                                }
                              </span>
                              <span>•</span>
                              <span>
                                {new Date(deliverable.created_at).toLocaleDateString()}
                              </span>
                            </div>
                          </div>
                          
                          {/* Actions */}
                          <div className="flex gap-2 ml-4">
                            <DownloadButton deliverable={deliverable} />
                            
                            {/* CLIENT/ADMIN ACTIONS ONLY */}
                            {(isClient || isAdmin) && (
                              <div className="flex gap-2">
                                <button 
                                  className="px-3 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
                                  onClick={() => handleApprove(deliverable.id)}
                                >
                                  Approve
                                </button>
                                <button 
                                  className="px-3 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600 transition-colors"
                                  onClick={() => handleRequestRevision(deliverable.id)}
                                >
                                  Request Revision
                                </button>
                                <button 
                                  className="px-3 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
                                  onClick={() => handleReject(deliverable.id)}
                                >
                                  Reject
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                        
                        {/* Status and Action Buttons */}
                        <div className="mt-3 flex justify-between items-center">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            deliverable.status === 'approved' ? 'bg-green-100 text-green-800' : 
                            deliverable.status === 'rejected' ? 'bg-red-100 text-red-800' : 
                            deliverable.status === 'pending_revision' ? 'bg-yellow-100 text-yellow-800' : 
                            'bg-blue-100 text-blue-800'
                          }`}>
                            {deliverable.status.replace('_', ' ')}
                          </span>
                          
                          <div className="flex gap-3">
                            <button 
                              onClick={() => {
                                setShowVersions(deliverable.id);
                                setActiveTab("versions");
                              }}
                              className="text-sm text-blue-600 hover:text-blue-800"
                            >
                              View Version History
                            </button>
                            <button 
                              onClick={() => {
                                setSelectedDeliverableForFeedback(deliverable);
                                setActiveTab("feedback");
                              }}
                              className="text-sm text-green-600 hover:text-green-800"
                            >
                              Give Feedback
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Portfolio Tab */}
          {activeTab === "portfolio" && isFreelancer && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">My Portfolio</h3>
                <button 
                  onClick={loadPortfolioItems}
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                >
                  Refresh
                </button>
              </div>

              {portfolioItems.length === 0 ? (
                <div className="text-center py-12 bg-gray-50 rounded-lg">
                  <div className="text-6xl mb-4">📁</div>
                  <h4 className="text-xl font-semibold text-gray-700 mb-2">No Portfolio Items Yet</h4>
                  <p className="text-gray-600 mb-4 max-w-md mx-auto">
                    Your approved projects will automatically appear here once deliverables are approved by clients.
                  </p>
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 max-w-md mx-auto">
                    <p className="text-blue-800 text-sm">
                      <strong>How it works:</strong><br/>
                      • Upload deliverables as a freelancer<br/>
                      • Client approves the deliverables<br/>
                      • Portfolio items are automatically created<br/>
                      • Showcase your work to potential clients
                    </p>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {portfolioItems.map((item) => (
                    <div key={item.id} className="border rounded-lg p-6 hover:shadow-md transition-shadow">
                      <div className="flex justify-between items-start mb-4">
                        <h4 className="text-lg font-semibold">{item.title}</h4>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          item.is_visible ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {item.is_visible ? 'Visible' : 'Hidden'}
                        </span>
                      </div>
                      
                      {item.description && (
                        <p className="text-gray-600 mb-4">{item.description}</p>
                      )}
                      
                      {item.cover_image_url && (
                        <img 
                          src={item.cover_image_url} 
                          alt={item.title}
                          className="w-full h-48 object-cover rounded-lg mb-4"
                        />
                      )}
                      
                      {/* Skills */}
                      {item.skills_used && item.skills_used.length > 0 && (
                        <div className="mb-4">
                          <h5 className="text-sm font-semibold text-gray-700 mb-2">Skills Used:</h5>
                          <div className="flex flex-wrap gap-1">
                            {item.skills_used.map((skill, index) => (
                              <span 
                                key={index}
                                className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded"
                              >
                                {skill}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      {/* Project Details */}
                      <div className="space-y-2 text-sm text-gray-600 mb-4">
                        {item.project_duration && (
                          <div className="flex justify-between">
                            <span>Duration:</span>
                            <span className="font-medium">{item.project_duration}</span>
                          </div>
                        )}
                        {item.completion_date && (
                          <div className="flex justify-between">
                            <span>Completed:</span>
                            <span className="font-medium">
                              {new Date(item.completion_date).toLocaleDateString()}
                            </span>
                          </div>
                        )}
                      </div>
                      
                      {/* Toggle Visibility */}
                      <button
                        onClick={() => togglePortfolioVisibility(item.id, item.is_visible)}
                        className={`w-full px-4 py-2 rounded-lg transition-colors ${
                          item.is_visible 
                            ? 'bg-yellow-500 text-white hover:bg-yellow-600' 
                            : 'bg-green-500 text-white hover:bg-green-600'
                        }`}
                      >
                        {item.is_visible ? 'Hide from Portfolio' : 'Show in Portfolio'}
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Assign Freelancer Tab */}
          {activeTab === "assignment" && (isClient || isAdmin) && (
            <div className="space-y-6">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-blue-800 mb-2">Assign a Freelancer</h3>
                <p className="text-blue-700 mb-4">
                  Assign a freelancer to this project to get started. Once assigned, the freelancer will be able to upload deliverables.
                </p>
                
                <button
                  onClick={() => setShowAssignModal(true)}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold"
                >
                  Browse Available Freelancers
                </button>
              </div>

              <div className="bg-gray-50 rounded-lg p-6">
                <h4 className="font-semibold mb-3">Assignment Status</h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Current Status:</span>
                    <span className="font-medium capitalize">{project.status}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Freelancer Assigned:</span>
                    <span className="font-medium">
                      {project.freelancer_id ? `Yes (ID: ${project.freelancer_id})` : 'No'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Version History Tab */}
          {activeTab === "versions" && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">Version Comparison</h3>
                {showVersions && (
                  <button
                    onClick={() => setShowVersions(null)}
                    className="text-blue-600 hover:text-blue-800 text-sm"
                  >
                    Back to List
                  </button>
                )}
              </div>
              
              {showVersions ? (
                <VersionCompare 
                  projectId={projectId}
                  deliverableId={showVersions}
                  onBack={() => setShowVersions(null)}
                />
              ) : (
                <div className="space-y-4">
                  <p className="text-gray-600">
                    Compare different versions of deliverables side by side.
                  </p>
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <p className="text-blue-800">
                      Select a deliverable from the list above and click "View Version History" 
                      to compare different versions.
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Feedback Tab */}
          {activeTab === "feedback" && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold">Project Feedback</h3>
              
              {selectedDeliverableForFeedback ? (
                <div className="space-y-6">
                  <div className="flex justify-between items-center">
                    <h4 className="font-semibold">
                      Feedback for: {selectedDeliverableForFeedback.title}
                    </h4>
                    <button
                      onClick={() => setSelectedDeliverableForFeedback(null)}
                      className="text-blue-600 hover:text-blue-800 text-sm"
                    >
                      Back to All Feedback
                    </button>
                  </div>
                  
                  {/* Feedback Form - Only for clients/admins */}
                  {(isClient || isAdmin) && (
                    <FeedbackForm
                      deliverableId={selectedDeliverableForFeedback.id}
                      onSubmit={submitFeedback}
                      onSuccess={(newFeedback) => {
                        loadFeedback(selectedDeliverableForFeedback.id);
                        if (onUpdated) onUpdated();
                      }}
                    />
                  )}
                  
                  {/* Feedback List */}
                  <FeedbackList 
                    feedbacks={feedbacks[selectedDeliverableForFeedback.id] || []}
                    deliverableId={selectedDeliverableForFeedback.id}
                  />
                </div>
              ) : (
                <div className="space-y-4">
                  <p className="text-gray-600">
                    Provide and view feedback for specific deliverables. Select a deliverable to view or add feedback.
                  </p>
                  
                  {deliverables.length === 0 ? (
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                      <p className="text-yellow-800">
                        No deliverables available for feedback.
                      </p>
                    </div>
                  ) : (
                    <div className="grid gap-4">
                      {deliverables.map((deliverable) => (
                        <div
                          key={deliverable.id}
                          className="border rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
                          onClick={() => {
                            setSelectedDeliverableForFeedback(deliverable);
                            loadFeedback(deliverable.id);
                          }}
                        >
                          <div className="flex justify-between items-center">
                            <div>
                              <h4 className="font-semibold">{deliverable.title}</h4>
                              <p className="text-sm text-gray-600">
                                Version {deliverable.version_number} • {deliverable.status}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="text-sm text-blue-600">
                                {(feedbacks[deliverable.id]?.length || 0)} comments
                              </p>
                              <button className="text-blue-600 hover:text-blue-800 text-sm">
                                View Feedback →
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Assign Freelancer Modal */}
      {showAssignModal && (
        <AssignFreelancerModal
          projectId={projectId}
          isOpen={showAssignModal}
          onClose={() => setShowAssignModal(false)}
          onAssign={handleAssignFreelancer}
        />
      )}
    </div>
  );
}