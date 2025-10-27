// ClientDashboard.jsx
import { useState, useEffect } from 'react';
import { 
  Briefcase, 
  DollarSign, 
  FileText, 
  Clock, 
  CheckCircle, 
  AlertCircle,
  MessageSquare,
  Users,
  GitCompare
} from 'lucide-react';
import { useAuth } from "../../context/AuthContext";
import dashboardAPI from "../../api/dashboardAPI";
import VersionCompare from "../../components/deliverables/VersionCompare";

function ClientDashboard() {
  const { user } = useAuth();
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showVersionCompare, setShowVersionCompare] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const data = await dashboardAPI.getClientDashboard();
      setDashboardData(data);
    } catch (err) {
      setError('Failed to load dashboard data');
      console.error('Dashboard error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCompareVersions = (project) => {
    setSelectedProject(project);
    setShowVersionCompare(true);
  };

  if (showVersionCompare && selectedProject) {
    return (
      <VersionCompare 
        projectId={selectedProject.id}
        projectTitle={selectedProject.title}
        userRole="client"
        onBack={() => setShowVersionCompare(false)}
      />
    );
  }

  if (loading) {
    return <DashboardLoadingSkeleton />;
  }

  if (error) {
    return <DashboardError error={error} />;
  }

  if (!dashboardData) {
    return <div>No data available</div>;
  }

  const { 
    stats, 
    activeProjects = [], 
    pendingReviews = [],
    recentDeliverables = [],
    earningsBreakdown = {}
  } = dashboardData;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Welcome back, {user?.first_name}!
        </h1>
        <p className="text-gray-600 mb-8">Manage your projects and review deliverables.</p>
        
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard 
            stat={{
              title: 'Active Projects',
              value: stats?.activeProjects || 0,
              description: 'In progress',
              icon: Briefcase,
              color: 'blue'
            }}
          />
          <StatCard 
            stat={{
              title: 'Total Spent',
              value: `$${stats?.totalSpent || 0}`,
              description: 'All time',
              icon: DollarSign,
              color: 'green'
            }}
          />
          <StatCard 
            stat={{
              title: 'Pending Reviews',
              value: stats?.pendingReviews || 0,
              description: 'Awaiting feedback',
              icon: FileText,
              color: 'orange'
            }}
          />
          <StatCard 
            stat={{
              title: 'On-time Delivery',
              value: `${stats?.onTimeDelivery || 0}%`,
              description: 'Past projects',
              icon: CheckCircle,
              color: 'purple'
            }}
          />
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Active Projects */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900">Active Projects</h2>
              <span className="text-sm text-gray-500">{activeProjects.length} projects</span>
            </div>
            <div className="space-y-4">
              {activeProjects.length > 0 ? (
                activeProjects.map(project => (
                  <div key={project.id} className="border border-gray-200 rounded-lg p-4 hover:border-gray-300 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900">{project.title}</h3>
                        <p className="text-sm text-gray-600 mt-1">
                          Freelancer: {project.freelancer_name}
                        </p>
                        <div className="flex items-center mt-2 space-x-4">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            project.status === 'completed' ? 'bg-green-100 text-green-800' :
                            project.status === 'in_progress' ? 'bg-blue-100 text-blue-800' :
                            'bg-yellow-100 text-yellow-800'
                          }`}>
                            {project.status?.replace('_', ' ') || 'Unknown'}
                          </span>
                          <span className="text-xs text-gray-500">
                            Budget: ${project.budget}
                          </span>
                        </div>
                      </div>
                      <button
                        onClick={() => handleCompareVersions(project)}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors ml-4"
                      >
                        <GitCompare className="w-4 h-4" />
                        Compare Versions
                      </button>
                    </div>
                    
                    {/* Recent Deliverables for this project */}
                    {project.recent_deliverables && project.recent_deliverables.length > 0 && (
                      <div className="mt-3 pt-3 border-t border-gray-100">
                        <p className="text-xs text-gray-500 mb-2">Recent deliverables:</p>
                        <div className="space-y-2">
                          {project.recent_deliverables.map(deliverable => (
                            <div key={deliverable.id} className="flex items-center justify-between text-xs">
                              <span className="text-gray-700">v{deliverable.version_number}</span>
                              <span className={`px-2 py-1 rounded ${
                                deliverable.status === 'approved' ? 'bg-green-100 text-green-800' :
                                deliverable.status === 'revision_requested' ? 'bg-orange-100 text-orange-800' :
                                'bg-yellow-100 text-yellow-800'
                              }`}>
                                {deliverable.status.replace('_', ' ')}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <EmptyState 
                  icon={Briefcase} 
                  message="No active projects" 
                />
              )}
            </div>
          </div>

          {/* Pending Reviews & Recent Deliverables */}
          <div className="space-y-6">
            {/* Pending Reviews */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-900">Pending Reviews</h2>
                <span className="text-sm text-gray-500">{pendingReviews.length} waiting</span>
              </div>
              <div className="space-y-3">
                {pendingReviews.length > 0 ? (
                  pendingReviews.map(review => (
                    <div key={review.id} className="p-3 border border-orange-200 bg-orange-50 rounded-lg">
                      <h4 className="font-medium text-gray-900 text-sm">{review.project_title}</h4>
                      <p className="text-xs text-gray-600 mt-1">v{review.version_number} • {review.freelancer_name}</p>
                      <p className="text-xs text-orange-600 mt-2">Waiting for your feedback</p>
                      <div className="flex gap-2 mt-3">
                        <button className="text-xs bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700">
                          Review Now
                        </button>
                        <button 
                          onClick={() => handleCompareVersions({ id: review.project_id, title: review.project_title })}
                          className="text-xs border border-gray-300 text-gray-700 px-3 py-1 rounded hover:bg-gray-50"
                        >
                          Compare Versions
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <EmptyState 
                    icon={CheckCircle} 
                    message="No pending reviews" 
                  />
                )}
              </div>
            </div>

            {/* Recent Deliverables */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Recent Deliverables</h2>
              <div className="space-y-3">
                {recentDeliverables.length > 0 ? (
                  recentDeliverables.map(deliverable => (
                    <div key={deliverable.id} className="flex items-center justify-between p-3 border border-gray-100 rounded-lg">
                      <div>
                        <h4 className="font-medium text-gray-900 text-sm">{deliverable.project_title}</h4>
                        <p className="text-xs text-gray-600">v{deliverable.version_number} • {deliverable.freelancer_name}</p>
                      </div>
                      <span className={`text-xs px-2 py-1 rounded ${
                        deliverable.status === 'approved' ? 'bg-green-100 text-green-800' :
                        deliverable.status === 'revision_requested' ? 'bg-orange-100 text-orange-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {deliverable.status.replace('_', ' ')}
                      </span>
                    </div>
                  ))
                ) : (
                  <EmptyState 
                    icon={FileText} 
                    message="No recent deliverables" 
                  />
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions for Client */}
        <QuickActionsClient />
      </div>
    </div>
  );
}

// Client-specific Quick Actions
const QuickActionsClient = () => (
  <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
    <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <button className="flex items-center justify-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
        <Briefcase className="h-5 w-5 text-gray-400 mr-2" />
        <span>Post New Project</span>
      </button>
      <button className="flex items-center justify-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
        <FileText className="h-5 w-5 text-gray-400 mr-2" />
        <span>Review Deliverables</span>
      </button>
      <button className="flex items-center justify-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
        <MessageSquare className="h-5 w-5 text-gray-400 mr-2" />
        <span>Message Freelancers</span>
      </button>
    </div>
  </div>
);

// Reuse the same helper components from FreelancerDashboard
const StatCard = ({ stat }) => (
  <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-gray-600">{stat.title}</p>
        <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
        <p className="text-xs text-gray-500 mt-1">{stat.description}</p>
      </div>
      <div className={`p-3 rounded-full ${getColorClass(stat.color, 'bg')}`}>
        <stat.icon className={`h-6 w-6 ${getColorClass(stat.color, 'text')}`} />
      </div>
    </div>
  </div>
);

const EmptyState = ({ icon: Icon, message }) => (
  <div className="text-center py-8">
    <Icon className="h-12 w-12 text-gray-300 mx-auto mb-3" />
    <p className="text-gray-500">{message}</p>
  </div>
);

const DashboardLoadingSkeleton = () => (
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

const DashboardError = ({ error }) => (
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

// Helper function for dynamic color classes
const getColorClass = (color, type) => {
  const colors = {
    blue: { bg: 'bg-blue-100', text: 'text-blue-600' },
    green: { bg: 'bg-green-100', text: 'text-green-600' },
    yellow: { bg: 'bg-yellow-100', text: 'text-yellow-600' },
    orange: { bg: 'bg-orange-100', text: 'text-orange-600' },
    purple: { bg: 'bg-purple-100', text: 'text-purple-600' },
    red: { bg: 'bg-red-100', text: 'text-red-600' },
  };
  return colors[color]?.[type] || colors.blue[type];
};

export default ClientDashboard;