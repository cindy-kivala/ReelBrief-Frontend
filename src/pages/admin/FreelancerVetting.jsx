/**
 * FreelancerVetting.jsx
 * Owner: Caleb
 * Description: Admin page to view, approve, or reject freelancer applications.
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
import Layout from "../../components/layout/Layout"; // ✅ Import Layout
// import axios from "axios"; // Uncomment later for real API

function FreelancerVetting() {
  const [freelancers, setFreelancers] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Dummy load for now
    setTimeout(() => {
      setFreelancers([
        {
          id: 1,
          name: "Alex Kim",
          email: "alex.kim@example.com",
          skills: "Graphic Design, Photoshop",
          experience: "3 years",
          status: "pending",
        },
        {
          id: 2,
          name: "Sarah Johnson",
          email: "sarah.j@example.com",
          skills: "React, Node.js",
          experience: "5 years",
          status: "approved",
        },
        {
          id: 3,
          name: "Daniel Brown",
          email: "daniel.brown@example.com",
          skills: "SEO, Copywriting",
          experience: "2 years",
          status: "rejected",
        },
      ]);
      setLoading(false);
    }, 800);
  }, []);

  const summaryStats = {
    total: freelancers.length,
    pending: freelancers.filter((f) => f.status === "pending").length,
    approved: freelancers.filter((f) => f.status === "approved").length,
    rejected: freelancers.filter((f) => f.status === "rejected").length,
  };

  const handleView = (id) => navigate(`/admin/freelancers/${id}`);
  const handleApprove = (id) => alert(`Approved freelancer ID ${id}`);
  const handleReject = (id) => alert(`Rejected freelancer ID ${id}`);

  return (
    <Layout>
      <div className="min-h-screen bg-gray-100 p-6">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-semibold text-gray-800 mb-6">
            Freelancer Vetting
          </h1>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <SummaryCard
              icon={<User className="text-indigo-600" size={30} />}
              label="Total Applicants"
              value={summaryStats.total}
            />
            <SummaryCard
              icon={<Clock className="text-yellow-500" size={30} />}
              label="Pending"
              value={summaryStats.pending}
            />
            <SummaryCard
              icon={<CheckCircle className="text-green-500" size={30} />}
              label="Approved"
              value={summaryStats.approved}
            />
            <SummaryCard
              icon={<XCircle className="text-red-500" size={30} />}
              label="Rejected"
              value={summaryStats.rejected}
            />
          </div>

          {/* Table Section */}
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
                    <td
                      colSpan="6"
                      className="py-6 text-center text-gray-500 italic"
                    >
                      Loading freelancers...
                    </td>
                  </tr>
                ) : (
                  freelancers.map((freelancer) => (
                    <tr
                      key={freelancer.id}
                      className="border-t hover:bg-gray-50 transition"
                    >
                      <td className="py-3 px-4 font-medium">
                        {freelancer.name}
                      </td>
                      <td className="py-3 px-4">{freelancer.email}</td>
                      <td className="py-3 px-4">{freelancer.skills}</td>
                      <td className="py-3 px-4">{freelancer.experience}</td>
                      <td className="py-3 px-4 capitalize">
                        <StatusTag status={freelancer.status} />
                      </td>
                      <td className="py-3 px-4 flex gap-3">
                        {freelancer.status === "pending" ? (
                          <>
                            <ActionIcon
                              icon={<Eye size={20} />}
                              label="View"
                              onClick={() => handleView(freelancer.id)}
                            />
                            <ActionIcon
                              icon={<CheckCircle size={20} />}
                              label="Approve"
                              onClick={() => handleApprove(freelancer.id)}
                            />
                            <ActionIcon
                              icon={<XCircle size={20} />}
                              label="Reject"
                              onClick={() => handleReject(freelancer.id)}
                            />
                          </>
                        ) : (
                          <span className="text-gray-400 italic">
                            No actions
                          </span>
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
    </Layout>
  );
}

/* ─────────────────────────────── */
/* Helper Components */
/* ─────────────────────────────── */

const SummaryCard = ({ icon, label, value }) => (
  <div className="bg-white rounded-2xl p-4 flex items-center gap-3 border border-gray-300">
    {icon}
    <div>
      <p className="text-gray-500 text-sm">{label}</p>
      <h2 className="text-lg font-bold text-gray-800">{value}</h2>
    </div>
  </div>
);

const StatusTag = ({ status }) => {
  if (status === "approved")
    return <span className="text-green-600 font-medium">Approved</span>;
  if (status === "rejected")
    return <span className="text-red-600 font-medium">Rejected</span>;
  return <span className="text-yellow-600 font-medium">Pending</span>;
};

const ActionIcon = ({ icon, label, onClick }) => (
  <div className="relative group cursor-pointer" onClick={onClick}>
    <div className="text-gray-400 hover:text-indigo-600 transition">{icon}</div>
    <span className="absolute bottom-full mb-1 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-xs rounded-md px-2 py-1 opacity-0 group-hover:opacity-100 transition">
      {label}
    </span>
  </div>
);

export default FreelancerVetting;
