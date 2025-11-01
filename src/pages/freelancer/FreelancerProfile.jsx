// src/pages/FreelancerProfile.jsx
import React, { useEffect, useState } from "react";
import axiosClient from "../api/axiosClient";

export default function FreelancerProfile({ freelancerId, onClose }) {
  const [freelancer, setFreelancer] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!freelancerId) return;
    const loadFreelancer = async () => {
      try {
        const res = await axiosClient.get(`/freelancers/${freelancerId}`);
        setFreelancer(res.data.freelancer);
      } catch (err) {
        console.error("Failed to load freelancer:", err);
      } finally {
        setLoading(false);
      }
    };
    loadFreelancer();
  }, [freelancerId]);

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
        <div className="bg-white p-6 rounded-lg shadow">
          <p className="text-gray-600">Loading freelancer...</p>
        </div>
      </div>
    );
  }

  if (!freelancer) {
    return (
      <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
        <div className="bg-white p-6 rounded-lg shadow">
          <p className="text-gray-600">Freelancer not found.</p>
          <button
            onClick={onClose}
            className="mt-4 px-4 py-2 border rounded text-gray-600 hover:bg-gray-100"
          >
            Close
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 overflow-auto">
      <div className="bg-white w-full max-w-3xl p-6 rounded-xl shadow-lg">
        {/* Header */}
        <div className="flex justify-between items-start mb-4">
          <h2 className="text-2xl font-semibold text-gray-800">{freelancer.name}</h2>
          <span
            className={`text-xs px-2 py-1 rounded-full capitalize ${
              freelancer.application_status === "pending"
                ? "bg-yellow-100 text-yellow-800"
                : freelancer.application_status === "approved"
                ? "bg-green-100 text-green-800"
                : "bg-red-100 text-red-800"
            }`}
          >
            {freelancer.application_status}
          </span>
        </div>

        {/* Bio */}
        <p className="text-gray-700 mb-4">{freelancer.bio}</p>

        {/* Experience & Rate */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <div className="text-xs text-gray-500">Years of Experience</div>
            <div className="font-medium">{freelancer.years_experience}</div>
          </div>
          <div>
            <div className="text-xs text-gray-500">Hourly Rate</div>
            <div className="font-medium">${freelancer.hourly_rate}</div>
          </div>
        </div>

        {/* CV & Portfolio */}
        <div className="flex gap-4 mb-4">
          {freelancer.cv_url && (
            <a
              href={freelancer.cv_url}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-1 bg-indigo-600 text-white rounded hover:bg-indigo-700"
            >
              View CV
            </a>
          )}
          {freelancer.portfolio_url && (
            <a
              href={freelancer.portfolio_url}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700"
            >
              View Portfolio
            </a>
          )}
        </div>

        {/* Rejection Reason */}
        {freelancer.application_status === "rejected" && freelancer.rejection_reason && (
          <div className="text-sm text-red-600 mb-4">
            Rejection Reason: {freelancer.rejection_reason}
          </div>
        )}

        {/* Close Button */}
        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 border rounded text-gray-600 hover:bg-gray-100"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
