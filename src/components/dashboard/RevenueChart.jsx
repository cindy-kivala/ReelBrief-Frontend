/**
 * RevenueChart.jsx
 * Owner: Caleb
 * Description: Visual chart for displaying revenue over time.
 */

import React, { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";
import { fetchRevenueData } from "@/api/dashboardAPI";

const RevenueChart = () => {
  const [revenueData, setRevenueData] = useState([]);

  useEffect(() => {
    const loadRevenue = async () => {
      try {
        const response = await fetchRevenueData();
        setRevenueData(response.revenue || []);
      } catch (error) {
        console.error("Failed to load revenue data:", error);
      }
    };
    loadRevenue();
  }, []);

  return (
    <div className="bg-white dark:bg-gray-900 shadow-md rounded-2xl p-6">
      <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-4">
        Revenue Over Time
      </h2>

      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={revenueData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis dataKey="month" stroke="#9ca3af" />
          <YAxis stroke="#9ca3af" />
          <Tooltip
            contentStyle={{
              backgroundColor: "#1f2937",
              color: "#fff",
              borderRadius: "8px",
              border: "none",
            }}
          />
          <Line
            type="monotone"
            dataKey="revenue"
            stroke="#4f46e5"
            strokeWidth={3}
            dot={{ r: 5, fill: "#4f46e5" }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default RevenueChart;
