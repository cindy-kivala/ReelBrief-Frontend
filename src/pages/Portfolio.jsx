// Portfolio.jsx - Complete version with backend integration
import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link, AlertCircle, Eye, EyeOff } from "lucide-react";

const Portfolio = () => {
  const [portfolioItems, setPortfolioItems] = useState([]);
  const [freelancer, setFreelancer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      await Promise.all([fetchPortfolioItems(), fetchFreelancerProfile()]);
    } catch (err) {
      setError("Failed to load portfolio data");
      console.error("Error loading data:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchPortfolioItems = async () => {
    try {
      const token = localStorage.getItem("access_token");
      const response = await axios.get("/api/deliverable/portfolio/items", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPortfolioItems(response.data.portfolio_items || []);
    } catch (error) {
      console.error("Error fetching portfolio:", error);
      throw error;
    }
  };

  const fetchFreelancerProfile = async () => {
    try {
      const token = localStorage.getItem("access_token");
      const response = await axios.get("/api/freelancers/me", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setFreelancer(response.data.freelancer);
    } catch (error) {
      console.error("Error fetching freelancer profile:", error);
      throw error;
    }
  };

  const toggleVisibility = async (itemId, currentVisibility) => {
    try {
      const token = localStorage.getItem("access_token");
      const response = await axios.patch(
        `/api/deliverable/portfolio/items/${itemId}/toggle-visibility`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setPortfolioItems((prev) =>
        prev.map((item) =>
          item.id === itemId ? response.data.portfolio_item : item
        )
      );
    } catch (error) {
      console.error("Error toggling visibility:", error);
      alert("Failed to update visibility. Please try again.");
    }
  };

  if (loading) {
    return (
      <div className="ml-64 flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500 mb-4"></div>
          <p className="text-white text-xl font-semibold">Loading portfolio...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="ml-64 flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900">
        <div className="bg-red-500/20 backdrop-blur-lg rounded-2xl p-8 max-w-md text-center">
          <AlertCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">Error Loading Portfolio</h2>
          <p className="text-gray-300 mb-4">{error}</p>
          <button
            onClick={fetchData}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-semibold transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="ml-64 min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 text-white py-10 px-6">
      {/* Freelancer Info */}
      {freelancer && (
        <div className="flex flex-col items-center mb-10 text-center animate-fadeIn">
          <img
            src={freelancer.profile_picture_url || "/default-avatar.png"}
            alt={freelancer.name}
            className="w-32 h-32 rounded-full border-4 border-blue-500 shadow-lg mb-4 object-cover"
            onError={(e) => {
              e.target.src = "/default-avatar.png";
            }}
          />
          <h1 className="text-4xl font-bold mb-2">{freelancer.name}</h1>
          <p className="text-gray-300 max-w-2xl mt-2 text-lg">{freelancer.bio}</p>
        </div>
      )}

      {/* Portfolio Grid */}
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold mb-8 text-center">My Portfolio</h2>
        
        {portfolioItems.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {portfolioItems.map((item) => (
              <div
                key={item.id}
                className="bg-white/10 backdrop-blur-lg rounded-2xl p-5 shadow-xl hover:scale-105 hover:shadow-2xl transition-all duration-300"
              >
                {/* Cover Image */}
                {item.cover_image_url && (
                  <div className="relative overflow-hidden rounded-xl mb-4 h-48">
                    <img
                      src={item.cover_image_url}
                      alt={item.title}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.src = "https://via.placeholder.com/400x300?text=No+Image";
                      }}
                    />
                    <div className="absolute top-3 right-3">
                      {item.is_visible ? (
                        <Eye className="w-5 h-5 text-green-400" />
                      ) : (
                        <EyeOff className="w-5 h-5 text-gray-400" />
                      )}
                    </div>
                  </div>
                )}

                {/* Title */}
                <h3 className="text-xl font-semibold mb-2 text-blue-300 line-clamp-2">
                  {item.title}
                </h3>

                {/* Description */}
                <p className="text-gray-300 mb-4 line-clamp-3 text-sm">
                  {item.description}
                </p>

                {/* Tags */}
                {item.tags && item.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {item.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="bg-blue-800/40 text-xs px-3 py-1 rounded-full text-blue-200"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}

                {/* Actions */}
                <div className="flex justify-between items-center pt-4 border-t border-white/10">
                  <a
                    href={item.project_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-400 hover:text-blue-200 underline flex items-center gap-1 text-sm font-medium transition-colors"
                  >
                    <Link size={16} />
                    View Project
                  </a>
                  <button
                    onClick={() => toggleVisibility(item.id, item.is_visible)}
                    className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all ${
                      item.is_visible
                        ? "bg-blue-600 hover:bg-blue-700 text-white"
                        : "bg-gray-600 hover:bg-gray-700 text-gray-200"
                    }`}
                  >
                    {item.is_visible ? "Hide" : "Show"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-12 max-w-md mx-auto">
              <svg
                className="w-20 h-20 text-gray-500 mx-auto mb-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                />
              </svg>
              <h3 className="text-xl font-semibold text-gray-300 mb-2">
                No Portfolio Items Yet
              </h3>
              <p className="text-gray-400">
                Start adding your projects to showcase your work!
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Portfolio;