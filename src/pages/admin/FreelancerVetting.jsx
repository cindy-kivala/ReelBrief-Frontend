/**src/pages/admin/FreelancerVetting.jsx
 * FreelancerVetting.jsx
 * Owner: Caleb
 * Description: Admin page to view, approve, or reject freelancer applications with interactive icons and tooltips.
 */

import React, { useState, useEffect } from "react";
import {
  CheckCircle,
  XCircle,
  User,
  Clock,
  Eye,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

function FreelancerVetting() {
  const [freelancers, setFreelancers] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Simulate API delay with dummy data
    setTimeout(() => {
      setFreelancers([
        {
          id: 1,
          name: "Alex Kim",
          email: "alex.kim@example.com",
          skills: "Graphic Design, Logo Design, Photoshop",
          experience: "3 years",
          status: "pending",
        },
        {
          id: 2,
          name: "Sarah Johnson",
          email: "sarah.j@example.com",
          skills: "Web Development, React, Node.js",
          experience: "5 years",
          status: "approved",
        },
        {
          id: 3,
          name: "Daniel Brown",
          email: "daniel.brown@example.com",
          skills: "Content Writing, SEO, Copywriting",
          experience: "2 years",
          status: "rejected",
        },
        {
          id: 4,
          name: "Emily Davis",
          email: "emily.davis@example.com",
          skills: "UI/UX Design, Figma, Prototyping",
          experience: "4 years",
          status: "pending",
        },
      ]);
      setLoading(false);
    }, 1000);
  }, []);

  const summaryStats = {
    total: freelancers.length,
    pending: freelancers.filter((f) => f.status === "pending").length,
    approved: freelancers.filter((f) => f.status === "approved").length,
    rejected: freelancers.filter((f) => f.status === "rejected").length,
  };

  const handleView = (id) => {
    navigate(`/admin/freelancers/${id}`);
  };

  const handleApprove = (id) => {
    alert(`Freelancer ID ${id} approved.`);
  };

  const handleReject = (id) => {
    alert(`Freelancer ID ${id} rejected.`);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6 md:ml-64 mt-16">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-semibold text-gray-800 mb-6">
          Freelancer Vetting
        </h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-2xl p-4 flex items-center gap-3 border border-gray-300">
            <User className="text-indigo-600" size={30} />
            <div>
              <p className="text-gray-500 text-sm">Total Applicants</p>
              <h2 className="text-lg font-bold text-gray-800">{summaryStats.total}</h2>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-4 flex items-center gap-3 border border-gray-300">
            <Clock className="text-yellow-500" size={30} />
            <div>
              <p className="text-gray-500 text-sm">Pending</p>
              <h2 className="text-lg font-bold text-gray-800">{summaryStats.pending}</h2>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-4 flex items-center gap-3 border border-gray-300">
            <CheckCircle className="text-green-500" size={30} />
            <div>
              <p className="text-gray-500 text-sm">Approved</p>
              <h2 className="text-lg font-bold text-gray-800">{summaryStats.approved}</h2>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-4 flex items-center gap-3 border border-gray-300">
            <XCircle className="text-red-500" size={30} />
            <div>
              <p className="text-gray-500 text-sm">Rejected</p>
              <h2 className="text-lg font-bold text-gray-800">{summaryStats.rejected}</h2>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg overflow-hidden shadow-sm border border-gray-200">
          <table className="min-w-full text-sm text-gray-700">
            <thead className="bg-blue-800 text-white">
              <tr>
                <th className="py-3 px-4 text-left">Name</th>
                <th className="py-3 px-4 text-left">Email</th>
                <th className="py-3 px-4 text-left">Skills</th>
                <th className="py-3 px-4 text-left">Experience</th>
                <th className="py-3 px-4 text-left">Status</th>
                <th className="py-3 px-4 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="6" className="py-6 text-center text-gray-500 italic">
                    Loading applicants...
                  </td>
                </tr>
              ) : (
                freelancers.map((freelancer) => (
                  <tr key={freelancer.id} className="border-t hover:bg-gray-50 transition">
                    <td className="py-3 px-4 font-medium">{freelancer.name}</td>
                    <td className="py-3 px-4">{freelancer.email}</td>
                    <td className="py-3 px-4">{freelancer.skills}</td>
                    <td className="py-3 px-4">{freelancer.experience}</td>
                    <td className="py-3 px-4 capitalize">
                      {freelancer.status === "approved" && (
                        <span className="text-green-600 font-medium">Approved</span>
                      )}
                      {freelancer.status === "rejected" && (
                        <span className="text-red-600 font-medium">Rejected</span>
                      )}
                      {freelancer.status === "pending" && (
                        <span className="text-yellow-600 font-medium">Pending</span>
                      )}
                    </td>

                    <td className="py-3 px-4 flex gap-3">
                      {freelancer.status === "pending" ? (
                        <>
                          {/* View */}
                          <div
                            className="relative group cursor-pointer"
                            onClick={() => handleView(freelancer.id)}
                          >
                            <Eye
                              size={20}
                              className="text-gray-500 hover:text-indigo-600 transition"
                            />
                            <span className="absolute bottom-full mb-1 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-xs rounded-md px-2 py-1 opacity-0 group-hover:opacity-100 transition">
                              View Details
                            </span>
                          </div>

                          {/* Approve */}
                          <div
                            className="relative group cursor-pointer"
                            onClick={() => handleApprove(freelancer.id)}
                          >
                            <CheckCircle
                              size={20}
                              className="text-gray-400 hover:text-green-600 transition"
                            />
                            <span className="absolute bottom-full mb-1 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-xs rounded-md px-2 py-1 opacity-0 group-hover:opacity-100 transition">
                              Approve
                            </span>
                          </div>

                          {/* Reject */}
                          <div
                            className="relative group cursor-pointer"
                            onClick={() => handleReject(freelancer.id)}
                          >
                            <XCircle
                              size={20}
                              className="text-gray-400 hover:text-red-600 transition"
                            />
                            <span className="absolute bottom-full mb-1 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-xs rounded-md px-2 py-1 opacity-0 group-hover:opacity-100 transition">
                              Reject
                            </span>
                          </div>
                        </>
                      ) : (
                        <span className="text-gray-400 italic">No actions</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default FreelancerVetting;
