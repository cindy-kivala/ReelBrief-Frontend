/**
 * FreelancerMatch.jsx
 * Owner: Monica
 * Description: Displays matched freelancers for a specific project.
 */

import React, { useEffect, useState } from "react";
import axios from "axios";
import { assignFreelancer } from "../../api/projectAPI";

export default function FreelancerMatch({ project, onClose }) {
  const [freelancers, setFreelancers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [shortlisted, setShortlisted] = useState([]);
  const [assigning, setAssigning] = useState(null);

  // --- Early return if project is missing ---
  if (!project) {
    return (
      <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
        <div className="bg-white w-full max-w-5xl p-6 rounded-xl shadow-lg text-center">
          Loading project...
        </div>
      </div>
    );
  }

  // Fetch matched freelancers 
  useEffect(() => {
    const loadFreelancers = async () => {
      try {
        const skillNames = project.required_skills?.map((s) => s.skill_name) || [];
        const query = skillNames.map((s) => `skills=${encodeURIComponent(s)}`).join("&");

        const res = await axios.get(`/api/freelancers/search?${query}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        });

        setFreelancers(res.data?.results || []);
      } catch (err) {
        console.error("Failed to load freelancers", err);
        setFreelancers([]);
      } finally {
        setLoading(false);
      }
    };

    loadFreelancers();
  }, [project]);

  // Handle shortlist toggle 
  const toggleShortlist = (freelancerId) => {
    setShortlisted((prev) =>
      prev.includes(freelancerId)
        ? prev.filter((id) => id !== freelancerId)
        : [...prev, freelancerId]
    );
  };

  //  Assign freelancer to project
  const handleAssign = async (freelancer) => {
    if (!freelancer || !project) return;

    setAssigning(freelancer.id);
    try {
      await assignFreelancer(project.id, freelancer.id);
      alert(`✅ Assigned ${freelancer.name} to "${project?.title || "Untitled Project"}"`);
      onClose && onClose();
    } catch (err) {
      console.error(err);
      alert("❌ Assignment failed. Please try again.");
    } finally {
      setAssigning(null);
    }
  };

  // UI 
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white w-full max-w-5xl p-6 rounded-xl shadow-lg overflow-y-auto max-h-[90vh]">
        {/* Header */}
        <div className="flex justify-between items-start mb-4">
          <h2 className="text-xl font-semibold text-gray-800">
            Matched Freelancers for{" "}
            <span className="text-indigo-600">{project?.title || "Untitled Project"}</span>
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-800 transition text-lg">
            ✕
          </button>
        </div>

        {/* Content */}
        {loading ? (
          <div className="text-center text-gray-500 py-10">Loading freelancers...</div>
        ) : !freelancers || freelancers.length === 0 ? (
          <div className="text-center text-gray-500 py-10">
            No freelancers matched the required skills.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {freelancers.map((f) => (
              <div
                key={f?.id || Math.random()}
                className={`border rounded-lg p-4 shadow-sm hover:shadow-md transition relative ${
                  shortlisted.includes(f?.id)
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
                      f?.open_to_work
                        ? "bg-green-100 text-green-700"
                        : "bg-gray-200 text-gray-600"
                    }`}
                  >
                    {f?.open_to_work ? "Open to Work" : "Unavailable"}
                  </span>
                </div>

                {/* Bio */}
                <p className="mt-2 text-sm text-gray-600 line-clamp-2">{f?.bio || ""}</p>

                {/* Skills */}
                <div className="mt-3 flex flex-wrap gap-2">
                  {f?.freelancer_skills?.map((s) => (
                    <span
                      key={s?.id || Math.random()}
                      className="text-xs bg-gray-100 px-2 py-1 rounded-full text-gray-700">
                      {s?.skill_name || "Skill"} • {s?.proficiency || "N/A"}
                    </span>
                  ))}
                </div>

                {/* Actions */}
                <div className="mt-4 flex justify-between items-center">
                  <button
                    onClick={() => toggleShortlist(f?.id)}
                    className={`px-3 py-1 border rounded text-sm transition ${
                      shortlisted.includes(f?.id)
                        ? "border-indigo-600 text-indigo-600 bg-indigo-50"
                        : "border-gray-400 text-gray-600 hover:border-indigo-400"
                    }`}
                  >
                    {shortlisted.includes(f?.id) ? "Shortlisted" : "Shortlist"}
                  </button>

                  <button
                    onClick={() => handleAssign(f)}
                    disabled={assigning === f?.id}
                    className="px-3 py-1 bg-indigo-600 text-white text-sm rounded hover:bg-indigo-700 disabled:bg-gray-300">
                    {assigning === f?.id ? "Assigning..." : "Assign"}
                  </button>
                </div>

                {/* Shortlisted badge */}
                {shortlisted.includes(f?.id) && (
                  <div className="absolute top-2 right-2 bg-indigo-500 text-white text-xs px-2 py-1 rounded">
                    ★
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
