/**
 * freelancerAPI.js
 * Owner: Monica
 * Description: Handles API requests related to freelancers and project matches.
 */

// TODO: Implement API functions:
// - fetchFreelancers()
// - fetchFreelancerById(id)
// - matchFreelancersToProject(projectId)

 /**
 * FreelancerDashboard.jsx
 * Owner: Caleb
 * Description: Dashboard for freelancers showing project stats, payments, and reviews.
 */
import { useState, useEffect } from 'react';
import { 
  Briefcase, 
  DollarSign, 
  Star, 
  Clock, 
  CheckCircle, 
  AlertCircle,
  TrendingUp,
  FileText,
  MessageSquare
} from 'lucide-react';
import { useAuth } from "../../context/AuthContext";
import dashboardAPI from "../../api/dashboardAPI";

function FreelancerDashboard() {
  const { user } = useAuth();
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const response = await dashboardAPI.getDashboard();
      setDashboardData(response.dashboard);
    } catch (err) {
      setError('Failed to load dashboard data');
      console.error('Dashboard error:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-32 bg-gray-200 rounded-lg"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center">
              <AlertCircle className="h-5 w-5 text-red-400 mr-2" />
              <p className="text-red-800">{error}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Map the backend data to our frontend structure
  const stats = dashboardData || {};
  
  const statCards = [
    {
      title: 'Projects in Progress',
      value: stats.projects_in_progress || 0,
      icon: Briefcase,
      color: 'blue',
      description: 'Active projects'
    },
    {
      title: 'Total Earnings',
      value: `$${stats.earnings_summary || 0}`,
      icon: DollarSign,
      color: 'emerald',
      description: 'Lifetime earnings'
    },
    {
      title: 'Pending Feedback',
      value: stats.pending_feedback || 0,
      icon: MessageSquare,
      color: 'amber',
      description: 'Awaiting client review'
    },
    {
      title: 'Completed Projects',
      value: stats.completed_projects || 0,
      icon: CheckCircle,
      color: 'green',
      description: 'Successfully delivered'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome back, {user?.first_name}!
          </h1>
          <p className="text-gray-600 mt-2">
            Here's your project overview and recent activity.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statCards.map((stat) => (
            <div
              key={stat.title}
              className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    {stat.title}
                  </p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">
                    {stat.value}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {stat.description}
                  </p>
                </div>
                <div className={`p-3 rounded-full bg-${stat.color}-100`}>
                  <stat.icon className={`h-6 w-6 text-${stat.color}-600`} />
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Activity */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                <Clock className="h-5 w-5 text-gray-400 mr-2" />
                Recent Activity
              </h2>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 border border-gray-100 rounded-lg">
                  <div>
                    <h3 className="font-medium text-gray-900">Project Update</h3>
                    <p className="text-sm text-gray-600">New feedback received on Website Redesign</p>
                  </div>
                  <span className="text-xs text-gray-500">2 hours ago</span>
                </div>
                <div className="flex items-center justify-between p-3 border border-gray-100 rounded-lg">
                  <div>
                    <h3 className="font-medium text-gray-900">Payment Received</h3>
                    <p className="text-sm text-gray-600">$1,500 released from escrow</p>
                  </div>
                  <span className="text-xs text-gray-500">1 day ago</span>
                </div>
                <div className="flex items-center justify-between p-3 border border-gray-100 rounded-lg">
                  <div>
                    <h3 className="font-medium text-gray-900">New Project</h3>
                    <p className="text-sm text-gray-600">Assigned to Mobile App Development</p>
                  </div>
                  <span className="text-xs text-gray-500">2 days ago</span>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                <TrendingUp className="h-5 w-5 text-gray-400 mr-2" />
                Quick Actions
              </h2>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 gap-4">
                <button className="flex items-center justify-start p-4 border border-gray-200 rounded-lg hover:bg-gray-50 w-full">
                  <Briefcase className="h-5 w-5 text-gray-400 mr-3" />
                  <span>View Available Projects</span>
                </button>
                <button className="flex items-center justify-start p-4 border border-gray-200 rounded-lg hover:bg-gray-50 w-full">
                  <FileText className="h-5 w-5 text-gray-400 mr-3" />
                  <span>Submit Deliverable</span>
                </button>
                <button className="flex items-center justify-start p-4 border border-gray-200 rounded-lg hover:bg-gray-50 w-full">
                  <MessageSquare className="h-5 w-5 text-gray-400 mr-3" />
                  <span>Check Messages</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default FreelancerDashboard;