/**
 * StatCard.jsx
 * Owner: Caleb
 * Description: Reusable card component to display key performance metrics.
 */

import React from "react";
import { motion } from "framer-motion";
// import { cn } from "@/lib/utils";

const StatCard = ({ title, value, icon: Icon, color = "indigo", className }) => {
  return (
    <motion.div
      whileHover={{ scale: 1.03 }}
      transition={{ duration: 0.2 }}
      className={cn(
        "flex items-center justify-between bg-white dark:bg-gray-900 shadow-md rounded-2xl p-5",
        className
      )}
    >
      {/* Text Section */}
      <div>
        <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
          {title}
        </h3>
        <p className="text-2xl font-bold text-gray-900 dark:text-gray-100 mt-1">
          {value}
        </p>
      </div>

      {/* Icon Section */}
      {Icon && (
        <div
          className={`p-3 rounded-xl bg-${color}-100 dark:bg-${color}-900/30 text-${color}-600 dark:text-${color}-400`}
        >
          <Icon size={28} />
        </div>
      )}
    </motion.div>
  );
};

export default StatCard;
