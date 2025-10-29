/**
 * ActivityFeed.jsx
 * Owner: Caleb
 * Description: Displays a timeline of recent actions (audit trail).
 */
import React, { useEffect, useState } from "react";
import { Clock, User, CheckCircle, AlertCircle } from "lucide-react";
import activityAPI from "../../api/activityAPI";

const ActivityFeed = () => {
  const [activities, setActivities] = useState([]);

  useEffect(() => {
    const dummy = [
      {
        id: 1,
        action: "Admin Caleb approved freelancer John Doe",
        created_at: "2025-10-23T09:30:00Z",
      },
      {
        id: 2,
        action: "Client Jane funded project 'Logo Design' escrow",
        created_at: "2025-10-23T09:00:00Z",
      },
      {
        id: 3,
        action: "Freelancer Alex submitted project deliverables",
        created_at: "2025-10-22T21:30:00Z",
      },
      {
        id: 4,
        action: "Review added by client Peter (⭐4.5)",
        created_at: "2025-10-22T18:10:00Z",
      },
    ];
    setActivities(dummy);
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
                {item.action}
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
