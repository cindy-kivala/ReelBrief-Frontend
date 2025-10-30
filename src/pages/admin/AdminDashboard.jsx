// src/pages/AdminDashboard.jsx
import React, { useEffect, useState } from "react";
import {
  fetchDashboardStats,
  fetchRecentProjects,
  fetchRecentTransactions,
  fetchRevenueData,
} from "@/api/dashboardAPI";
import StatCard from "@/components/dashboard/StatCard";
import RevenueChart from "@/components/dashboard/RevenueChart";
import ActivityFeed from "@/components/dashboard/ActivityFeed";
import { Users, Briefcase, DollarSign, Lock } from "lucide-react";

const AdminDashboard = () => {
  const [stats, setStats] = useState([]);
  const [recentProjects, setRecentProjects] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const [statsData, projectsData, txData] = await Promise.all([
          fetchDashboardStats(),
          fetchRecentProjects(),
          fetchRecentTransactions(),
        ]);

        setStats(statsData || []);
        setRecentProjects(projectsData || []);
        setTransactions(txData || []);
      } catch (error) {
        console.error("Failed to load dashboard:", error);
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, []);

  const iconMap = {
    "Total Users": Users,
    "Total Projects": Briefcase,
    "Released Payments": DollarSign,
    "In Escrow": Lock,
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-700 dark:text-gray-200">Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-100 min-h-screen p-6 md:ml-64 mt-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8">
        <div>
          <h1 className="font-bold text-3xl text-gray-800">Welcome back, Admin</h1>
          <p className="text-gray-600 mt-1">
            Here's an overview of current projects, escrow activities, and revenue.
          </p>
        </div>
        <button className="mt-4 sm:mt-0 bg-blue-800 px-4 py-2 rounded-lg text-white font-medium hover:bg-blue-600 transition">
          + Create New Project
        </button>
      </div>

      {/* Stats Cards */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <StatCard
            key={index}
            title={stat.label}
            value={stat.value}
            icon={iconMap[stat.label]}
            color={stat.color || "indigo"}
          />
        ))}
      </section>

      {/* Revenue Chart */}
      <section className="mt-10">
        <RevenueChart />
      </section>

      {/* Recent Projects */}
      <section className="mt-10 bg-white p-6 rounded-xl border border-gray-300">
        <div className="flex items-center justify-between mb-6">
          <h1 className="font-bold text-2xl text-gray-800">Recent Project Requests</h1>
          <a href="/projects" className="text-blue-500 hover:underline">
            View All
          </a>
        </div>

        <div className="flex flex-col gap-5">
          {recentProjects.map((project) => (
            <div key={project.id} className="border border-gray-300 rounded-xl p-4 hover:border-blue-400">
              <div className="flex flex-wrap items-center justify-between mb-2">
                <h2 className="font-semibold text-lg text-gray-800">{project.title}</h2>
                <div className="flex items-center gap-2">
                  <span
                    className={`text-white text-sm px-3 py-1 rounded-xl ${
                      project.status === "completed"
                        ? "bg-green-600"
                        : project.status === "in_progress"
                        ? "bg-blue-700"
                        : "bg-yellow-500"
                    }`}
                  >
                    {project.status}
                  </span>
                  <a
                    href={`/projects/${project.id}`}
                    className="text-sm border border-gray-300 px-3 py-1 rounded-lg hover:bg-red-400 hover:text-white transition"
                  >
                    {project.status === "completed" ? "View Report" : "Review"}
                  </a>
                </div>
              </div>
              <p className="text-gray-600 text-sm">Client: {project.client_name}</p>
              <p className="text-gray-600 text-sm">
                Budget: ${project.budget} • Requested {new Date(project.requested_at).toLocaleDateString()}
              </p>

              <div className="mt-3 w-2/3 bg-gray-200 rounded-full h-2.5">
                <div
                  className={`h-2.5 rounded-full ${
                    project.status === "completed"
                      ? "bg-green-600"
                      : project.status === "in_progress"
                      ? "bg-blue-700"
                      : "bg-yellow-500"
                  }`}
                  style={{ width: `${project.progress}%` }}
                ></div>
              </div>
              <p className="text-right text-xs text-gray-500 mt-1 w-2/3">{project.progress}% Progress</p>
            </div>
          ))}
        </div>
      </section>

      {/* Escrow Transactions */}
      <section className="mt-10 bg-white p-6 rounded-xl border border-gray-300">
        <div className="flex items-center justify-between mb-6">
          <h1 className="font-bold text-2xl text-gray-800">Escrow Payment Overview</h1>
          <a href="/transactions" className="text-blue-500 hover:underline">
            View All
          </a>
        </div>

        <div className="flex flex-col gap-5">
          {transactions.map((tx) => (
            <div key={tx.id} className="border border-gray-300 rounded-xl p-4">
              <div className="flex flex-wrap items-center justify-between mb-2">
                <h2 className="font-semibold text-lg text-gray-800">Project: {tx.project_title}</h2>
                <div className="flex items-center gap-2">
                  <span
                    className={`text-white text-sm px-3 py-1 rounded-xl ${
                      tx.status === "released" ? "bg-green-600" : "bg-yellow-500"
                    }`}
                  >
                    {tx.status}
                  </span>
                  <a
                    href={`/transactions/${tx.id}`}
                    className="text-sm border border-gray-300 px-3 py-1 rounded-lg hover:bg-red-400 hover:text-white transition"
                  >
                    {tx.status === "released" ? "Manage" : "Review"}
                  </a>
                </div>
              </div>
              <p className="text-gray-600 text-sm">Client: {tx.client_name}</p>
              <p className="text-gray-600 text-sm">
                Amount: ${tx.amount} • Paid {new Date(tx.paid_at).toLocaleDateString()}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Activity Feed */}
      <section className="mt-10">
        <ActivityFeed />
      </section>
    </div>
  );
};

export default AdminDashboard;