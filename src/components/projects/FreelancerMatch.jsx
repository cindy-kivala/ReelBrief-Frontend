/**
 * FreelancerMatch.jsx
 * Owner: Cindy
 * Description: Displays matched freelancers for a specific project.
 */

import React, { useEffect, useState } from "react";
import axios from "axios";
import { assignFreelancer } from "../../api/projectAPI";

export default function FreelancerMatch({ projectId, onAssignmentComplete }) {
  const [freelancers, setFreelancers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [shortlisted, setShortlisted] = useState([]);
  const [assigning, setAssigning] = useState(null);
  const [error, setError] = useState(null);

  // Fetch matched freelancers 
  useEffect(() => {
    // Only load if we have a valid projectId
    if (!projectId) {
      setLoading(false);
      return;
    }

    const loadFreelancers = async () => {
      try {
        setLoading(true);
        console.log('Loading freelancers for project:', projectId);
        
        // First, get project details to know required skills
        const projectRes = await axios.get(`/api/projects/${projectId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        });
        
        const project = projectRes.data;
        const skillNames = project.required_skills?.map((s) => s.skill_name) || [];
        
        let freelancerData = [];
        
        if (skillNames.length > 0) {
          // Search freelancers by skills
          const query = skillNames.map((s) => `skills=${encodeURIComponent(s)}`).join("&");
          const res = await axios.get(`/api/freelancers/search?${query}`, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("access_token")}`,
            },
          });
          freelancerData = res.data?.results || [];
        } else {
          // If no specific skills, get all available freelancers
          const res = await axios.get('/api/projects/available-freelancers', {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("access_token")}`,
            },
          });
          freelancerData = res.data?.freelancers || [];
        }

        setFreelancers(freelancerData);
      } catch (err) {
        console.error("Failed to load freelancers", err);
        setError("Failed to load freelancers");
        setFreelancers([]);
      } finally {
        setLoading(false);
      }
    };

    loadFreelancers();
  }, [projectId]);

  // Handle shortlist toggle 
  const toggleShortlist = (freelancerId) => {
    setShortlisted((prev) =>
      prev.includes(freelancerId)
        ? prev.filter((id) => id !== freelancerId)
        : [...prev, freelancerId]
    );
  };

  // Assign freelancer to project
  const handleAssign = async (freelancer) => {
    try {
      setAssigning(freelancer.user_id || freelancer.id);
      console.log('Assigning freelancer:', freelancer, 'to project:', projectId);
      
      const freelancerUserId = freelancer.user_id || freelancer.id;
      
      const result = await assignFreelancer(projectId, freelancerUserId);
      console.log('Assignment successful:', result);
      
      if (onAssignmentComplete) {
        onAssignmentComplete(result.project);
      }
    } catch (error) {
      console.error('Assignment failed:', error);
      console.error('Error response data:', error.response?.data);
      alert(error.response?.data?.error || 'Failed to assign freelancer');
    } finally {
      setAssigning(null);
    }
  };

  // Show error if no projectId
  // if (!projectId) {
  //   return (
  //     <div className="p-6 bg-yellow-50 border border-yellow-200 rounded-lg text-center">
  //       <p className="text-yellow-700">Error: Project ID is not available.</p>
  //       <p className="text-sm text-yellow-600 mt-2">
  //         Please try refreshing the page or contact support.
  //       </p>
  //     </div>
  //   );
  // }

  // UI 
  return (
    <div className="bg-white w-full p-6 rounded-xl shadow-lg border">
      {/* Header */}
      <div className="flex justify-between items-start mb-6">
        <h2 className="text-xl font-semibold text-gray-800">
          Matched Freelancers
        </h2>
      </div>

      {/* Content */}
      {loading ? (
        <div className="text-center py-10">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
          <p className="text-gray-500">Loading available freelancers...</p>
        </div>
      ) : error ? (
        <div className="text-center py-10">
          <p className="text-red-500">Error: {error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      ) : !freelancers || freelancers.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-gray-500">No matched freelancers found for this project's skills.</p>
          <p className="text-sm text-gray-400 mt-2">
            Try using the modal to browse all available freelancers.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {freelancers.map((f) => (
            <div
              key={f?.user_id || f?.id || Math.random()}
              className={`border rounded-lg p-4 shadow-sm hover:shadow-md transition relative ${
                shortlisted.includes(f?.user_id || f?.id)
                  ? "border-indigo-500 bg-indigo-50"
                  : "border-gray-200 bg-white"
              }`}
            >
              {/* Name + Status */}
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold text-gray-800">{f?.name || "Unnamed"}</h3>
                  <p className="text-sm text-gray-500">{f?.email || "No email"}</p>
                </div>
                <span
                  className={`text-xs px-2 py-1 rounded-full ${
                    f?.open_to_work !== false
                      ? "bg-green-100 text-green-700"
                      : "bg-gray-200 text-gray-600"
                  }`}
                >
                  {f?.open_to_work !== false ? "Available" : "Unavailable"}
                </span>
              </div>

              {/* Bio */}
              {f?.bio && (
                <p className="mt-2 text-sm text-gray-600 line-clamp-2">{f.bio}</p>
              )}

              {/* Skills */}
              <div className="mt-3 flex flex-wrap gap-2">
                {f?.skills?.map((skill, index) => (
                  <span
                    key={index}
                    className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full"
                  >
                    {skill}
                  </span>
                ))}
                {f?.freelancer_skills?.map((s, index) => (
                  <span
                    key={index}
                    className="text-xs bg-gray-100 px-2 py-1 rounded-full text-gray-700"
                  >
                    {s?.skill_name || "Skill"} • {s?.proficiency || "N/A"}
                  </span>
                ))}
                {(!f?.skills || f.skills.length === 0) && (!f?.freelancer_skills || f.freelancer_skills.length === 0) && (
                  <span className="text-xs text-gray-400">No skills listed</span>
                )}
              </div>

              {/* Experience & Rate */}
              <div className="mt-3 text-sm text-gray-600">
                {f?.years_experience && (
                  <p>{f.years_experience} years experience</p>
                )}
                {f?.hourly_rate && (
                  <p>${f.hourly_rate}/hour</p>
                )}
              </div>

              {/* Actions */}
              <div className="mt-4 flex justify-between items-center">
                <button
                  onClick={() => toggleShortlist(f?.user_id || f?.id)}
                  className={`px-3 py-1 border rounded text-sm transition ${
                    shortlisted.includes(f?.user_id || f?.id)
                      ? "border-indigo-600 text-indigo-600 bg-indigo-50"
                      : "border-gray-400 text-gray-600 hover:border-indigo-400"
                  }`}
                >
                  {shortlisted.includes(f?.user_id || f?.id) ? "Shortlisted" : "Shortlist"}
                </button>

                <button
                  onClick={() => handleAssign(f)}
                  disabled={assigning === (f?.user_id || f?.id) || f?.open_to_work === false}
                  className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
                >
                  {assigning === (f?.user_id || f?.id) ? "Assigning..." : "Assign"}
                </button>
              </div>

              {/* Shortlisted badge */}
              {shortlisted.includes(f?.user_id || f?.id) && (
                <div className="absolute top-2 right-2 bg-indigo-500 text-white text-xs px-2 py-1 rounded">
                  ★
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}