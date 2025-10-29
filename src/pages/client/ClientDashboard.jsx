/**
 * ClientDashboard.jsx
 * Owner: Caleb
 * Description: Dashboard for clients to view projects, deliverables, and payments.
 * TEMPORARY: Basic version until projects API is ready
 */
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { GitCompare, FolderOpen, FileText } from 'lucide-react';
import axiosClient from '../../api/axiosClient';

function ClientDashboard() {
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  // TEMPORARY: Get project IDs from deliverables
  useEffect(() => {
    fetchProjectIds();
  }, []);

  const fetchProjectIds = async () => {
    try {
      // Use deliverables to find projects
      const response = await axiosClient.get('/api/deliverables');
      
      if (response.data.success) {
        // Get unique project IDs
        const projectIds = [...new Set(
          response.data.deliverables.map(d => d.project_id).filter(Boolean)
        )];
        
        // Create simple project objects
        const projectsArray = projectIds.map(id => ({
          id,
          title: `Project ${id}`,
          description: `Project with ${response.data.deliverables.filter(d => d.project_id === id).length} deliverables`
        }));
        
        setProjects(projectsArray);
      }
    } catch (err) {
      console.error('Error fetching projects:', err);
    } finally {
      setLoading(false);
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

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Client Dashboard</h1>
          <p className="text-gray-600 mt-2">Monitor your projects and review deliverables</p>
          <div className="mt-2 text-sm text-blue-600 bg-blue-50 px-3 py-2 rounded-lg inline-block">
            🔄 Basic version - Projects API coming soon
          </div>
        </div>

        {/* Projects List */}
        <div className="bg-white rounded-lg border">
          <div className="p-6 border-b">
            <h2 className="text-xl font-semibold text-gray-900">
              Available Projects {projects.length > 0 && `(${projects.length})`}
            </h2>
          </div>
          
          <div className="divide-y">
            {projects.length > 0 ? (
              projects.map(project => (
                <div key={project.id} className="p-6 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold text-gray-900">{project.title}</h3>
                      <p className="text-sm text-gray-600 mt-1">{project.description}</p>
                    </div>
                    
                    <div className="flex gap-3">
                      <button
                        onClick={() => navigate(`/projects/${project.id}/versions`)}
                        className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                      >
                        <GitCompare className="w-4 h-4" />
                        Review Versions
                      </button>
                      
                      <button
                        onClick={() => navigate(`/projects/${project.id}`)}
                        className="flex items-center gap-2 border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        <FolderOpen className="w-4 h-4" />
                        Project Details
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-8 text-center text-gray-500">
                <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p>No projects available</p>
                <p className="text-sm mt-2">Projects will appear here when deliverables are uploaded</p>
              </div>
            )}
          </div>
        </div>

        {/* Test Instructions */}
        <div className="mt-8 bg-yellow-50 border border-yellow-200 rounded-lg p-6">
          <h3 className="font-semibold text-yellow-900 mb-2">Testing Instructions</h3>
          <p className="text-yellow-800 text-sm">
            Since Monica is working on the projects backend, this dashboard currently shows projects 
            based on existing deliverables. You can still test the Version Compare feature with any project ID.
          </p>
          <div className="mt-3">
            <button
              onClick={() => navigate('/projects/34/versions')}
              className="bg-yellow-600 text-white px-4 py-2 rounded-lg hover:bg-yellow-700 text-sm"
            >
              🧪 Test with Project 34 (has 9 deliverables)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ClientDashboard;