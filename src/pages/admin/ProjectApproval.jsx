
import React, { useState, useEffect } from 'react';
import { CheckCircle, XCircle, Users, AlertCircle, Clock } from 'lucide-react';

export default function AdminProjectApproval() {
  const [pendingProjects, setPendingProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProject, setSelectedProject] = useState(null);
  const [feasibility, setFeasibility] = useState(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [showRejectModal, setShowRejectModal] = useState(null);

  useEffect(() => {
    fetchPendingProjects();
  }, []);

  const fetchPendingProjects = async () => {
    try {
      const token = localStorage.getItem('access_token');
      const response = await fetch('/api/projects/pending-approval', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      if (data.success) {
        setPendingProjects(data.projects);
      }
    } catch (error) {
      console.error('Error fetching projects:', error);
    } finally {
      setLoading(false);
    }
  };

  const checkFeasibility = async (projectId) => {
    try {
      const token = localStorage.getItem('access_token');
      const response = await fetch(`/api/projects/${projectId}/check-feasibility`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      setFeasibility(data);
      setSelectedProject(projectId);
    } catch (error) {
      console.error('Error checking feasibility:', error);
    }
  };

  const approveProject = async (projectId) => {
    if (!window.confirm('Approve this project and send shortlist to client?')) return;

    try {
      const token = localStorage.getItem('access_token');
      const response = await fetch(`/api/projects/${projectId}/approve`, {
        method: 'POST',
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      const data = await response.json();
      
      if (data.success) {
        alert(`Project approved! Shortlist with ${data.shortlisted_freelancers.length} freelancers sent to client.`);
        fetchPendingProjects();
        setSelectedProject(null);
        setFeasibility(null);
      } else {
        alert(`${data.error}`);
      }
    } catch (error) {
      console.error('Error approving project:', error);
      alert('Failed to approve project');
    }
  };

  const rejectProject = async (projectId) => {
    if (!rejectionReason.trim()) {
      alert('Please provide a rejection reason');
      return;
    }

    try {
      const token = localStorage.getItem('access_token');
      const response = await fetch(`/api/projects/${projectId}/reject-feasibility`, {
        method: 'POST',
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ reason: rejectionReason })
      });
      
      const data = await response.json();
      
      if (data.success) {
        alert('Project rejected and client notified');
        fetchPendingProjects();
        setShowRejectModal(null);
        setRejectionReason('');
      } else {
        alert(`${data.error}`);
      }
    } catch (error) {
      console.error('Error rejecting project:', error);
      alert('Failed to reject project');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading projects...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Project Approval Queue</h1>
          <p className="text-gray-600 mt-2">Review and approve projects based on freelancer availability</p>
        </div>

        {pendingProjects.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <Clock className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No Pending Projects</h3>
            <p className="text-gray-500">All projects have been reviewed</p>
          </div>
        ) : (
          <div className="grid gap-6">
            {pendingProjects.map((project) => (
              <div key={project.id} className="bg-white rounded-lg shadow-lg overflow-hidden">
                {/* Project Header */}
                <div className="p-6 border-b border-gray-200">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h2 className="text-2xl font-bold text-gray-900 mb-2">{project.title}</h2>
                      <p className="text-gray-600 mb-4">{project.description}</p>
                      
                      <div className="flex flex-wrap gap-4 text-sm">
                        <span className="flex items-center text-gray-700">
                          <strong className="mr-2">Budget:</strong> ${project.budget}
                        </span>
                        <span className="flex items-center text-gray-700">
                          <strong className="mr-2">Deadline:</strong> 
                          {project.deadline ? new Date(project.deadline).toLocaleDateString() : 'Not set'}
                        </span>
                        <span className="flex items-center text-gray-700">
                          <strong className="mr-2">Type:</strong> {project.project_type}
                        </span>
                      </div>
                    </div>

                    {/* Feasibility Badge */}
                    <div className={`px-4 py-2 rounded-full text-sm font-semibold ${
                      project.is_feasible 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {project.is_feasible ? (
                        <span className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4" />
                          {project.matching_freelancers_count} Matches
                        </span>
                      ) : (
                        <span className="flex items-center gap-2">
                          <AlertCircle className="w-4 h-4" />
                          Limited Matches
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Required Skills */}
                <div className="px-6 py-4 bg-gray-50">
                  <h3 className="text-sm font-semibold text-gray-700 mb-2">Required Skills:</h3>
                  <div className="flex flex-wrap gap-2">
                    {project.required_skills?.map((skill, idx) => (
                      <span key={idx} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                        {skill.skill_name} • {skill.required_proficiency}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Feasibility Details */}
                {selectedProject === project.id && feasibility && (
                  <div className="p-6 bg-blue-50 border-t border-blue-100">
                    <h3 className="text-lg font-semibold text-blue-900 mb-4 flex items-center gap-2">
                      <Users className="w-5 h-5" />
                      Matching Freelancers ({feasibility.matching_freelancers?.length || 0})
                    </h3>
                    
                    {feasibility.is_feasible ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                        {feasibility.matching_freelancers?.slice(0, 4).map((item, idx) => (
                          <div key={idx} className="bg-white rounded-lg p-4 border border-blue-200">
                            <div className="flex justify-between items-start mb-2">
                              <h4 className="font-semibold text-gray-900">
                                {item.freelancer.name}
                              </h4>
                              <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs font-semibold">
                                {Math.round(item.match_score * 100)}% Match
                              </span>
                            </div>
                            <p className="text-sm text-gray-600 mb-2">{item.freelancer.bio}</p>
                            <div className="text-xs text-gray-500">
                              {item.freelancer.years_experience} years • ${item.freelancer.hourly_rate}/hr
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                        <p className="text-yellow-800 font-semibold mb-2">Feasibility Issues:</p>
                        <ul className="list-disc list-inside text-yellow-700 text-sm">
                          {feasibility.reasons?.map((reason, idx) => (
                            <li key={idx}>{reason}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )}

                {/* Action Buttons */}
                <div className="p-6 bg-gray-50 border-t border-gray-200 flex gap-3">
                  {selectedProject !== project.id ? (
                    <button
                      onClick={() => checkFeasibility(project.id)}
                      className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold"
                    >
                      Check Feasibility
                    </button>
                  ) : (
                    <>
                      {feasibility?.is_feasible && (
                        <button
                          onClick={() => approveProject(project.id)}
                          className="flex items-center gap-2 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-semibold"
                        >
                          <CheckCircle className="w-5 h-5" />
                          Approve & Send Shortlist
                        </button>
                      )}
                      
                      <button
                        onClick={() => setShowRejectModal(project.id)}
                        className="flex items-center gap-2 px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-semibold"
                      >
                        <XCircle className="w-5 h-5" />
                        Reject Project
                      </button>

                      <button
                        onClick={() => {
                          setSelectedProject(null);
                          setFeasibility(null);
                        }}
                        className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
                      >
                        Close
                      </button>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Reject Modal */}
      {showRejectModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-lg w-full p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Reject Project</h3>
            <p className="text-gray-600 mb-4">
              Please provide a reason for rejecting this project. The client will be notified.
            </p>
            
            <textarea
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              placeholder="Enter rejection reason (e.g., 'No qualified freelancers currently available for the required skill set')"
              className="w-full p-3 border border-gray-300 rounded-lg mb-4 h-32 resize-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
            />

            <div className="flex gap-3 justify-end">
              <button
                onClick={() => {
                  setShowRejectModal(null);
                  setRejectionReason('');
                }}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                onClick={() => rejectProject(showRejectModal)}
                disabled={!rejectionReason.trim()}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Reject Project
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}