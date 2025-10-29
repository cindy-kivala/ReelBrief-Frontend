// src/components/dashboard/ActivityFeed.jsx
import React, { useEffect, useState } from "react";
import { Clock } from "lucide-react";
import axiosClient from "@/api/axiosClient";

const ActivityFeed = () => {
  const [activities, setActivities] = useState([]);

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const response = await axiosClient.get("/api/dashboard/activity");
        setActivities(response.data.recent_activity || []);
      } catch (error) {
        console.error("Failed to load activities:", error);
      }
    };
    fetchActivities();
  }, []);

  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-md">
      <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-100">
        Recent Activity
      </h2>
      <div className="space-y-4">
        {activities.map((item) => (
          <div
            key={item.id}
            className="flex items-start gap-3 border-l-2 border-gray-300 pl-4 hover:bg-gray-50 dark:hover:bg-gray-800 p-2 rounded-md transition"
          >
            <div className="mt-1 text-blue-600">
              <Clock size={18} />
            </div>
            <div>
              <p className="text-gray-700 dark:text-gray-200 text-sm">
                {item.action} by {item.user_name}
              </p>
              <span className="text-xs text-gray-400">
                {new Date(item.created_at).toLocaleString()}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ActivityFeed;