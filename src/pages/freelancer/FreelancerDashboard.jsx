// FreelancerDashboard.jsx
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
  MessageSquare,
  Users,
  Award,
  Zap,
  GitCompare
} from 'lucide-react';
import { useAuth } from "../../context/AuthContext";
import dashboardAPI from "../../api/dashboardAPI";
import VersionCompare from "../../components/deliverables/VersionCompare";
import CloudinaryUpload from "../../components/deliverables/CloudinaryUpload";

function FreelancerDashboard() {
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
      const data = await dashboardAPI.getFreelancerDashboard();
      setDashboardData(data);
      
      // safely access the data
      console.log("Recent Feedback:", data.recentFeedback);
      console.log("Pending Earnings:", data.earningsBreakdown?.pending);
      console.log("Top Skills:", data.skillMetrics?.top_skills);
      
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

  // SAFE data access with optional chaining
  const { 
    stats, 
    recentProjects = [], 
    pendingDeliverables = [], 
    recentFeedback = [],
    earningsBreakdown = {},
    skillMetrics = {}
  } = dashboardData;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Welcome back, {user?.first_name}!
        </h1>
        <p className="text-gray-600 mb-8">Here's what's happening with your projects today.</p>
        
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard 
            stat={{
              title: 'Active Projects',
              value: stats?.activeProjects || 0,
              description: 'Currently working',
              icon: Briefcase,
              color: 'blue'
            }}
          />
          <StatCard 
            stat={{
              title: 'Total Earnings',
              value: `$${stats?.totalEarnings || 0}`,
              description: 'All time',
              icon: DollarSign,
              color: 'green'
            }}
          />
          <StatCard 
            stat={{
              title: 'Avg Rating',
              value: stats?.averageRating ? stats.averageRating.toFixed(1) : '0.0',
              description: 'Based on reviews',
              icon: Star,
              color: 'yellow'
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
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Left Column - Projects & Deliverables */}
          <div className="lg:col-span-2 space-y-6">
            {/* Recent Projects */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-900">Recent Projects</h2>
                <span className="text-sm text-gray-500">{recentProjects.length} projects</span>
              </div>
              <div className="space-y-3">
                {recentProjects.length > 0 ? (
                  recentProjects.map(project => (
                    <div key={project.id} className="bg-white p-4 rounded-lg border border-gray-200 hover:border-gray-300 transition-colors">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900">{project.title}</h3>
                          <p className="text-sm text-gray-600 mt-1">Client: {project.client_name}</p>
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
                    </div>
                  ))
                ) : (
                  <EmptyState 
                    icon={Briefcase} 
                    message="No recent projects found" 
                  />
                )}
              </div>
            </div>

            {/* Pending Deliverables */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-900">Pending Deliverables</h2>
                <span className="text-sm text-gray-500">{pendingDeliverables.length} pending</span>
              </div>
              <div className="space-y-3">
                {pendingDeliverables.length > 0 ? (
                  pendingDeliverables.map(deliverable => (
                    <DeliverableCard key={deliverable.id} deliverable={deliverable} />
                  ))
                ) : (
                  <EmptyState 
                    icon={CheckCircle} 
                    message="No pending deliverables" 
                  />
                )}
              </div>
            </div>
          </div>

          {/* Right Column - Feedback & Earnings */}
          <div className="space-y-6">
            {/* Recent Feedback */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-900">Recent Feedback</h2>
                <MessageSquare className="h-5 w-5 text-gray-400" />
              </div>
              <div className="space-y-4">
                {recentFeedback.length > 0 ? (
                  recentFeedback.map(feedback => (
                    <FeedbackCard key={feedback.id} feedback={feedback} />
                  ))
                ) : (
                  <EmptyState 
                    icon={MessageSquare} 
                    message="No recent feedback" 
                  />
                )}
              </div>
            </div>

            {/* Earnings Overview */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Earnings Overview</h2>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Pending</span>
                  <span className="font-semibold">${earningsBreakdown.pending || 0}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Released</span>
                  <span className="font-semibold text-green-600">${earningsBreakdown.released || 0}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">In Escrow</span>
                  <span className="font-semibold text-blue-600">${earningsBreakdown.in_escrow || 0}</span>
                </div>
                <div className="border-t pt-4">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-gray-900">Total</span>
                    <span className="font-bold text-lg text-gray-900">
                      ${(earningsBreakdown.pending || 0) + (earningsBreakdown.released || 0) + (earningsBreakdown.in_escrow || 0)}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Top Skills */}
            {skillMetrics?.top_skills && skillMetrics.top_skills.length > 0 && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Top Skills</h2>
                <div className="space-y-3">
                  {skillMetrics.top_skills.map((skill, index) => (
                    <div key={skill.name} className="flex justify-between items-center">
                      <span className="text-gray-700">{skill.name}</span>
                      <span className="text-sm bg-gray-100 text-gray-600 px-2 py-1 rounded">
                        {skill.projects_count} projects
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <QuickActions />
      </div>
    </div>
  );
}

// Supporting Components
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

const ProjectCard = ({ project }) => (
  <div className="flex items-center justify-between p-4 border border-gray-100 rounded-lg hover:bg-gray-50">
    <div className="flex-1">
      <h3 className="font-medium text-gray-900">{project.title}</h3>
      <p className="text-sm text-gray-600 mt-1">{project.client_name} • {project.client_company}</p>
      <div className="flex items-center mt-2 space-x-4">
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
          project.status === 'completed' ? 'bg-green-100 text-green-800' :
          project.status === 'in_progress' ? 'bg-blue-100 text-blue-800' :
          'bg-yellow-100 text-yellow-800'
        }`}>
          {project.status.replace('_', ' ')}
        </span>
        <span className="text-xs text-gray-500">
          Progress: {project.progress}%
        </span>
      </div>
    </div>
    <div className="text-right">
      <p className="text-sm font-medium text-gray-900">${project.budget}</p>
      <p className="text-xs text-gray-500">
        Due {new Date(project.deadline).toLocaleDateString()}
      </p>
    </div>
  </div>
);

const DeliverableCard = ({ deliverable }) => (
  <div className="flex items-center justify-between p-4 border border-gray-100 rounded-lg hover:bg-gray-50">
    <div className="flex-1">
      <h3 className="font-medium text-gray-900">{deliverable.title}</h3>
      <p className="text-sm text-gray-600">v{deliverable.version_number} • {deliverable.project_title}</p>
      {deliverable.feedback_summary && (
        <p className="text-xs text-orange-600 mt-1">{deliverable.feedback_summary}</p>
      )}
    </div>
    <div className="text-right">
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
        deliverable.status === 'submitted' ? 'bg-yellow-100 text-yellow-800' :
        deliverable.status === 'revision_requested' ? 'bg-orange-100 text-orange-800' :
        'bg-gray-100 text-gray-800'
      }`}>
        {deliverable.status.replace('_', ' ')}
      </span>
      <p className="text-xs text-gray-500 mt-1">
        {new Date(deliverable.uploaded_at).toLocaleDateString()}
      </p>
    </div>
  </div>
);

const FeedbackCard = ({ feedback }) => (
  <div className="p-3 border border-gray-100 rounded-lg">
    <div className="flex items-start justify-between">
      <div className="flex-1">
        <h4 className="font-medium text-gray-900 text-sm">{feedback.project_title}</h4>
        <p className="text-xs text-gray-600 mt-1">{feedback.client_name}</p>
        <p className="text-sm text-gray-700 mt-2">{feedback.content}</p>
      </div>
      <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${
        feedback.feedback_type === 'revision' ? 'bg-orange-100 text-orange-800' :
        feedback.feedback_type === 'approval' ? 'bg-green-100 text-green-800' :
        'bg-blue-100 text-blue-800'
      }`}>
        {feedback.feedback_type}
      </span>
    </div>
    <p className="text-xs text-gray-500 mt-2">
      {new Date(feedback.created_at).toLocaleDateString()}
    </p>
  </div>
);

const EmptyState = ({ icon: Icon, message }) => (
  <div className="text-center py-8">
    <Icon className="h-12 w-12 text-gray-300 mx-auto mb-3" />
    <p className="text-gray-500">{message}</p>
  </div>
);

const QuickActions = () => (
  <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
    <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <button className="flex items-center justify-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
        <Briefcase className="h-5 w-5 text-gray-400 mr-2" />
        <span>View Available Projects</span>
      </button>
      <button className="flex items-center justify-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
        <FileText className="h-5 w-5 text-gray-400 mr-2" />
        <span>Submit Deliverable</span>
      </button>
      <button className="flex items-center justify-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
        <TrendingUp className="h-5 w-5 text-gray-400 mr-2" />
        <span>Update Portfolio</span>
      </button>
    </div>
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
    purple: { bg: 'bg-purple-100', text: 'text-purple-600' },
    red: { bg: 'bg-red-100', text: 'text-red-600' },
  };
  return colors[color]?.[type] || colors.blue[type];
};

export default FreelancerDashboard;