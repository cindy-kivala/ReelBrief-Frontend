/**
 * FreelancerDashboard.jsx
 * Owner: Caleb
 * Description: Dashboard for freelancers showing project stats, payments, and reviews.
 * TEMPORARY: Uses deliverables data until projects API is ready
 */
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { GitCompare, FolderOpen, Clock, CheckCircle, FileText } from 'lucide-react';
import axiosClient from '../../api/axiosClient';

function FreelancerDashboard() {
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [stats, setStats] = useState({
    activeProjects: 0,
    pendingApproval: 0,
    completedProjects: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // TEMPORARY: Fetch projects from deliverables data
  useEffect(() => {
    fetchProjectsFromDeliverables();
  }, []);

  const fetchProjectsFromDeliverables = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('Fetching freelancer deliverables...');
      // Use the same endpoint that VersionCompare uses
      const response = await axiosClient.get('/api/deliverables/freelancer/my-deliverables');
      
      console.log('Deliverables response:', response.data);
      
      if (response.data.success) {
        // Extract unique projects from deliverables
        const deliverables = response.data.deliverables || [];
        const projectMap = new Map();
        
        deliverables.forEach(deliverable => {
          if (deliverable.project_id && !projectMap.has(deliverable.project_id)) {
            projectMap.set(deliverable.project_id, {
              id: deliverable.project_id,
              title: deliverable.project_title || `Project ${deliverable.project_id}`,
              // Count deliverables per status for this project
              pending: deliverables.filter(d => 
                d.project_id === deliverable.project_id && 
                (d.status === 'pending' || d.status === 'revision_requested')
              ).length,
              approved: deliverables.filter(d => 
                d.project_id === deliverable.project_id && 
                d.status === 'approved'
              ).length,
              totalDeliverables: deliverables.filter(d => 
                d.project_id === deliverable.project_id
              ).length
            });
          }
        });
        
        const projectsArray = Array.from(projectMap.values());
        console.log('Extracted projects:', projectsArray.length);
        setProjects(projectsArray);
        
        // Calculate stats
        setStats({
          activeProjects: projectsArray.length,
          pendingApproval: projectsArray.reduce((sum, project) => sum + project.pending, 0),
          completedProjects: projectsArray.reduce((sum, project) => sum + project.approved, 0)
        });
      }
      
    } catch (err) {
      console.error('Error fetching deliverables:', err);
      console.error('Error details:', err.response?.data);
      
      // If the freelancer endpoint doesn't exist, fall back to general deliverables
      if (err.response?.status === 404) {
        fetchAllDeliverables();
      } else {
        setError(err.response?.data?.error || 'Failed to load your projects');
      }
    } finally {
      setLoading(false);
    }
  };

  // Fallback: Use general deliverables endpoint
  const fetchAllDeliverables = async () => {
    try {
      const response = await axiosClient.get('/api/deliverables');
      
      if (response.data.success) {
        // Same logic as above but with all deliverables
        const deliverables = response.data.deliverables || [];
        const projectMap = new Map();
        
        deliverables.forEach(deliverable => {
          if (deliverable.project_id && !projectMap.has(deliverable.project_id)) {
            projectMap.set(deliverable.project_id, {
              id: deliverable.project_id,
              title: `Project ${deliverable.project_id}`,
              pending: deliverables.filter(d => 
                d.project_id === deliverable.project_id && 
                (d.status === 'pending' || d.status === 'revision_requested')
              ).length,
              approved: deliverables.filter(d => 
                d.project_id === deliverable.project_id && 
                d.status === 'approved'
              ).length,
              totalDeliverables: deliverables.filter(d => 
                d.project_id === deliverable.project_id
              ).length
            });
          }
        });
        
        const projectsArray = Array.from(projectMap.values());
        setProjects(projectsArray);
        
        setStats({
          activeProjects: projectsArray.length,
          pendingApproval: projectsArray.reduce((sum, project) => sum + project.pending, 0),
          completedProjects: projectsArray.reduce((sum, project) => sum + project.approved, 0)
        });
      }
    } catch (err) {
      setError('Failed to load project data');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your projects...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md">
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={fetchProjectsFromDeliverables}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Freelancer Dashboard</h1>
          <p className="text-gray-600 mt-2">Manage your projects and deliverables</p>
          <div className="mt-2 text-sm text-blue-600 bg-blue-50 px-3 py-2 rounded-lg inline-block">
            🔄 Using deliverables data - Projects API coming soon
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg border p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600">Active Projects</p>
                <p className="text-2xl font-bold text-gray-900">{stats.activeProjects}</p>
              </div>
              <FolderOpen className="w-8 h-8 text-blue-600" />
            </div>
          </div>
          
          <div className="bg-white rounded-lg border p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600">Pending Approval</p>
                <p className="text-2xl font-bold text-gray-900">{stats.pendingApproval}</p>
              </div>
              <Clock className="w-8 h-8 text-yellow-600" />
            </div>
          </div>
          
          <div className="bg-white rounded-lg border p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600">Approved</p>
                <p className="text-2xl font-bold text-gray-900">{stats.completedProjects}</p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
          </div>
        </div>

        {/* Projects List */}
        <div className="bg-white rounded-lg border">
          <div className="p-6 border-b">
            <h2 className="text-xl font-semibold text-gray-900">
              Your Projects {projects.length > 0 && `(${projects.length})`}
            </h2>
          </div>
          
          <div className="divide-y">
            {projects.length > 0 ? (
              projects.map(project => (
                <div key={project.id} className="p-6 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold text-gray-900">{project.title}</h3>
                      <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                        <span className="flex items-center gap-1">
                          <FileText className="w-4 h-4" />
                          {project.totalDeliverables} deliverables
                        </span>
                        {project.pending > 0 && (
                          <span className="flex items-center gap-1 text-yellow-600">
                            <Clock className="w-4 h-4" />
                            {project.pending} pending review
                          </span>
                        )}
                        {project.approved > 0 && (
                          <span className="flex items-center gap-1 text-green-600">
                            <CheckCircle className="w-4 h-4" />
                            {project.approved} approved
                          </span>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex gap-3">
                      <button
                        onClick={() => navigate(`/projects/${project.id}/versions`)}
                        className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        <GitCompare className="w-4 h-4" />
                        Compare Versions
                      </button>
                      
                      <button
                        onClick={() => navigate(`/projects/${project.id}`)}
                        className="flex items-center gap-2 border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        <FolderOpen className="w-4 h-4" />
                        View Project
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-8 text-center text-gray-500">
                <FolderOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p>No projects found</p>
                <p className="text-sm mt-2">Projects will appear here when you have deliverables</p>
                <button
                  onClick={() => navigate('/upload')}
                  className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2 mx-auto"
                >
                  <FileText className="w-4 h-4" />
                  Upload First Deliverable
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Quick Access to Version Compare */}
        {projects.length > 0 && (
          <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
            <h3 className="font-semibold text-blue-900 mb-2">Quick Access</h3>
            <p className="text-blue-800 text-sm mb-4">
              Test the Version Compare feature with your existing projects:
            </p>
            <div className="flex flex-wrap gap-2">
              {projects.slice(0, 3).map(project => (
                <button
                  key={project.id}
                  onClick={() => navigate(`/projects/${project.id}/versions`)}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 text-sm"
                >
                  Project {project.id} ({project.totalDeliverables} files)
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default FreelancerDashboard;