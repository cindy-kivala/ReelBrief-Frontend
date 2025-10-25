/**
 * AdminDashboard.jsx
 * Owner: Caleb
 * Description: Dashboard view for administrators — overall system stats and management.
 */

// TODO:
// - Fetch global data from dashboardAPI
// - Display stats using StatCard and RevenueChart
import React from "react";

function AdminDashboard() {
  return (
    <div className="bg-gray-100 min-h-screen p-6 md:ml-64 mt-16">

      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8">
        <div>
          <h1 className="font-bold text-3xl text-gray-800">Welcome back, Admin </h1>
          <p className="text-gray-600 mt-1">
            Here's an overview of current projects and escrow activities
          </p>
        </div>
        <button className="mt-4 sm:mt-0 bg-blue-800 px-4 py-2 rounded-lg text-white font-medium hover:bg-blue-600 transition">
          + Create New Project
        </button>
      </div>

      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { icon: "fi fi-rr-folder-open", label: "Total Projects", value: "28" },
          { icon: "fi fi-rr-clock-three", label: "Pending Approval", value: "6" },
          { icon: "fi fi-rs-check-circle", label: "Completed", value: "14" },
          { icon: "fi fi-rr-bank", label: "In Escrow", value: "$12.8K" },
        ].map((card, index) => (
          <div
            key={index}
            className="bg-white rounded-xl border border-gray-300 p-5 text-center"
          >
            <div className="flex flex-col items-center gap-2">
              <i className={`${card.icon} text-2xl text-blue-700`}></i>
              <p className="text-2xl font-bold text-gray-700">{card.value}</p>
              <h3 className="text-sm text-gray-600 font-medium">{card.label}</h3>
            </div>
          </div>
        ))}
      </section>

      <section className="mt-10 bg-white p-6 rounded-xl border border-gray-300">
        <div className="flex items-center justify-between mb-6">
          <h1 className="font-bold text-2xl text-gray-800">Recent Project Requests</h1>
          <a
            href="#"
            className="text-blue-500 px-4 py-2 rounded-lg hover:bg-red-400 hover:text-white transition"
          >
            View All
          </a>
        </div>

        <div className="flex flex-col gap-5">
          <div className="border border-gray-300 rounded-xl p-4 hover:border-blue-400">
            <div className="flex flex-wrap items-center justify-between mb-2">
              <h2 className="font-semibold text-lg text-gray-800">E-commerce Website</h2>
              <div className="flex items-center gap-2">
                <span className="bg-yellow-500 text-white text-sm px-3 py-1 rounded-xl">
                  Pending Assignment
                </span>
                <a
                  href="#"
                  className="text-sm border border-gray-300 px-3 py-1 rounded-lg hover:bg-red-400 hover:text-white transition"
                >
                  Review
                </a>
              </div>
            </div>
            <p className="text-gray-600 text-sm">Client: David Kim</p>
            <p className="text-gray-600 text-sm">Budget: $3200 • Requested Oct 20</p>

            <div className="mt-3 w-2/3 bg-gray-200 rounded-full h-2.5">
              <div
                className="bg-yellow-500 h-2.5 rounded-full"
                style={{ width: "20%" }}
              ></div>
            </div>
            <p className="text-right text-xs text-gray-500 mt-1 w-2/3">20% Progress</p>
          </div>

          <div className="border border-gray-300 rounded-xl p-4 hover:border-blue-400">
            <div className="flex flex-wrap items-center justify-between mb-2">
              <h2 className="font-semibold text-lg text-gray-800">Branding Package</h2>
              <div className="flex items-center gap-2">
                <span className="bg-blue-700 text-white text-sm px-3 py-1 rounded-xl">
                  Assigned to Agency
                </span>
                <a
                  href="#"
                  className="text-sm border border-gray-300 px-3 py-1 rounded-lg hover:bg-red-400 hover:text-white transition"
                >
                  View Details
                </a>
              </div>
            </div>
            <p className="text-gray-600 text-sm">Client: Sarah Jones</p>
            <p className="text-gray-600 text-sm">Budget: $2500 • Started Oct 15</p>

            <div className="mt-3 w-2/3 bg-gray-200 rounded-full h-2.5">
              <div
                className="bg-blue-700 h-2.5 rounded-full"
                style={{ width: "55%" }}
              ></div>
            </div>
            <p className="text-right text-xs text-gray-500 mt-1 w-2/3">55% Progress</p>
          </div>

          <div className="border border-gray-300 rounded-xl p-4 hover:border-blue-400">
            <div className="flex flex-wrap items-center justify-between mb-2">
              <h2 className="font-semibold text-lg text-gray-800">Logo Animation</h2>
              <div className="flex items-center gap-2">
                <span className="bg-green-600 text-white text-sm px-3 py-1 rounded-xl">
                  Completed
                </span>
                <a
                  href="#"
                  className="text-sm border border-gray-300 px-3 py-1 rounded-lg hover:bg-red-400 hover:text-white transition"
                >
                  View Report
                </a>
              </div>
            </div>
            <p className="text-gray-600 text-sm">Client: Alice Brown</p>
            <p className="text-gray-600 text-sm">Budget: $1500 • Completed Oct 10</p>

            <div className="mt-3 w-2/3 bg-gray-200 rounded-full h-2.5">
              <div
                className="bg-green-600 h-2.5 rounded-full"
                style={{ width: "100%" }}
              ></div>
            </div>
            <p className="text-right text-xs text-gray-500 mt-1 w-2/3">100% Complete</p>
          </div>
        </div>
      </section>

      <section className="mt-10 bg-white p-6 rounded-xl border border-gray-300">
        <div className="flex items-center justify-between mb-6">
          <h1 className="font-bold text-2xl text-gray-800">Escrow Payment Overview</h1>
          <a
            href="#"
            className="text-blue-500 px-4 py-2 rounded-lg hover:bg-red-400 hover:text-white transition"
          >
            View All
          </a>
        </div>

        <div className="flex flex-col gap-5">
          <div className="border border-gray-300 rounded-xl p-4">
            <div className="flex flex-wrap items-center justify-between mb-2">
              <h2 className="font-semibold text-lg text-gray-800">Project: Website Copy</h2>
              <div className="flex items-center gap-2">
                <span className="bg-green-600 text-white text-sm px-3 py-1 rounded-xl">
                  Released
                </span>
                <a
                  href="#"
                  className="text-sm border border-gray-300 px-3 py-1 rounded-lg hover:bg-red-400 hover:text-white transition"
                >
                  Manage
                </a>
              </div>
            </div>
            <p className="text-gray-600 text-sm">Client: Michael Lee</p>
            <p className="text-gray-600 text-sm">Amount: $1,800 • Released Oct 22</p>
          </div>

          <div className="border border-gray-300 rounded-xl p-4">
            <div className="flex flex-wrap items-center justify-between mb-2">
              <h2 className="font-semibold text-lg text-gray-800">Project: App Design</h2>
              <div className="flex items-center gap-2">
                <span className="bg-yellow-500 text-white text-sm px-3 py-1 rounded-xl">
                  In Escrow
                </span>
                <a
                  href="#"
                  className="text-sm border border-gray-300 px-3 py-1 rounded-lg hover:bg-red-400 hover:text-white transition"
                >
                  Review
                </a>
              </div>
            </div>
            <p className="text-gray-600 text-sm">Client: David Kim</p>
            <p className="text-gray-600 text-sm">Amount: $2,400 • Paid Oct 21</p>
          </div>
        </div>
      </section>
    </div>
  );
}

export default AdminDashboard;