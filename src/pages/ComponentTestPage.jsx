import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { GitCompare, Upload, MessageSquare, ArrowLeft, CheckCircle, RefreshCw } from 'lucide-react';
import VersionCompare from '../components/deliverables/VersionCompare';
import CloudinaryUpload from '../components/deliverables/CloudinaryUpload';
import FeedbackForm from '../components/deliverables/FeedbackForm';
import FeedbackList from '../components/deliverables/FeedbackList';
import { fetchMyDeliverables, fetchDeliverablesByProject } from '../api/deliverableAPI';

function ComponentTestPage() {
  const navigate = useNavigate();
  const [activeTest, setActiveTest] = useState(null);
  const [deliverables, setDeliverables] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDeliverable, setSelectedDeliverable] = useState(null);
  
  // Check if user is logged in
  const token = localStorage.getItem('access_token');
  const user = localStorage.getItem('user');
  const isAuthenticated = !!token;

  // Fetch deliverables on mount
  useEffect(() => {
    if (isAuthenticated) {
      loadDeliverables();
    }
  }, [isAuthenticated]);

  const loadDeliverables = async () => {
    try {
      setLoading(true);
      // Use the freelancer endpoint that exists in your backend
      const response = await fetchMyDeliverables();
      const deliverableList = response.deliverables || [];
      setDeliverables(deliverableList);
      
      // Auto-select first deliverable if available
      if (deliverableList.length > 0) {
        setSelectedDeliverable(deliverableList[0]);
      }
    } catch (error) {
      console.error('Failed to load deliverables:', error);
      // If freelancer endpoint fails, try with a project ID
      try {
        const projectId = 1; // Use an actual project ID
        const projectResponse = await fetchDeliverablesByProject(projectId);
        const projectDeliverables = projectResponse.deliverables || [];
        setDeliverables(projectDeliverables);
        
        if (projectDeliverables.length > 0) {
          setSelectedDeliverable(projectDeliverables[0]);
        }
      } catch (projectError) {
        console.error('Failed to load project deliverables:', projectError);
        setDeliverables([]);
      }
    } finally {
      setLoading(false);
    }
  };

  const testComponents = [
    {
      id: 'version-compare',
      name: 'Version Compare',
      icon: GitCompare,
      description: 'Test side-by-side version comparison',
      color: 'bg-blue-600',
      hoverColor: 'hover:bg-blue-700',
      requiresProject: true,
      component: selectedDeliverable ? (
        <VersionCompare 
          projectId={selectedDeliverable.project_id}
          onBack={() => setActiveTest(null)}
        />
      ) : (
        <div className="p-6 text-center text-gray-500">
          No deliverable selected
        </div>
      )
    },
    {
      id: 'cloudinary-upload',
      name: 'Cloudinary Upload',
      icon: Upload,
      description: 'Test file upload with Cloudinary',
      color: 'bg-green-600',
      hoverColor: 'hover:bg-green-700',
      requiresProject: true,
      component: selectedDeliverable ? (
        <div className="p-6">
          <button
            onClick={() => setActiveTest(null)}
            className="mb-6 flex items-center gap-2 text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Tests
          </button>
          <CloudinaryUpload 
            projectId={selectedDeliverable.project_id}
            onUploadSuccess={(deliverable) => {
              console.log('Upload successful:', deliverable);
              alert('Upload successful! Check console for details.');
              loadDeliverables(); // Refresh the list
            }}
            onUploadError={(error) => {
              console.error('Upload failed:', error);
              alert('Upload failed! Check console for details.');
            }}
          />
        </div>
      ) : (
        <div className="p-6 text-center text-gray-500">
          No deliverable selected
        </div>
      )
    },
    {
      id: 'feedback-form',
      name: 'Feedback Form',
      icon: MessageSquare,
      description: 'Test feedback submission',
      color: 'bg-purple-600',
      hoverColor: 'hover:bg-purple-700',
      requiresProject: false,
      component: selectedDeliverable ? (
        <div className="p-6 max-w-2xl mx-auto">
          <button
            onClick={() => setActiveTest(null)}
            className="mb-6 flex items-center gap-2 text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Tests
          </button>
          <div className="grid md:grid-cols-2 gap-6">
            <FeedbackForm 
              deliverableId={selectedDeliverable.id}
              onSuccess={(feedback) => {
                console.log('Feedback submitted:', feedback);
                alert('Feedback submitted successfully!');
                // The FeedbackList will automatically refresh
              }}
            />
            <FeedbackList deliverableId={selectedDeliverable.id} />
          </div>
        </div>
      ) : (
        <div className="p-6 text-center text-gray-500">
          No deliverable selected
        </div>
      )
    }
  ];

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
        <div className="bg-white rounded-xl shadow-lg p-8 max-w-md text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl">🔒</span>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Authentication Required</h2>
          <p className="text-gray-600 mb-6">
            You need to be logged in to test these components.
          </p>
          <button
            onClick={() => navigate('/login')}
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  // If a component is active, render it
  if (activeTest) {
    const active = testComponents.find(t => t.id === activeTest);
    return (
      <div className="min-h-screen bg-gray-50">
        {active.component}
      </div>
    );
  }

  // Main test selection page
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Component Test Center</h1>
              <p className="text-gray-600 mt-2">Test your deliverable components with real backend data</p>
            </div>
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </button>
          </div>

          {/* Auth Status */}
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center gap-3">
            <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
            <div>
              <p className="text-green-900 font-semibold">Authenticated</p>
              <p className="text-green-700 text-sm">
                {user ? JSON.parse(user).email : 'User logged in'}
              </p>
            </div>
          </div>
        </div>

        {/* Deliverable Selector */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Select Deliverable</h2>
            <button
              onClick={loadDeliverables}
              disabled={loading}
              className="flex items-center gap-2 text-blue-600 hover:text-blue-700 disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </button>
          </div>

          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              <p className="text-gray-600 mt-2">Loading deliverables...</p>
            </div>
          ) : deliverables.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <p>No deliverables found.</p>
              <p className="text-sm mt-2">Upload a deliverable first to test these components.</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Choose a deliverable to work with:
                </label>
                <select
                  value={selectedDeliverable?.id || ''}
                  onChange={(e) => {
                    const selected = deliverables.find(d => d.id === parseInt(e.target.value));
                    setSelectedDeliverable(selected);
                  }}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  {deliverables.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.title} (v{d.version_number}) - ID: {d.id}
                    </option>
                  ))}
                </select>
              </div>

              {selectedDeliverable && (
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-xs text-gray-500 mb-1">Selected Deliverable Info:</p>
                  <p className="font-mono text-sm text-gray-900">
                    <strong>ID:</strong> {selectedDeliverable.id}
                  </p>
                  <p className="font-mono text-sm text-gray-900">
                    <strong>Project ID:</strong> {selectedDeliverable.project_id}
                  </p>
                  <p className="font-mono text-sm text-gray-900">
                    <strong>Status:</strong> {selectedDeliverable.status}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Component Cards */}
        {selectedDeliverable && (
          <div className="grid md:grid-cols-3 gap-6">
            {testComponents.map((test) => {
              const Icon = test.icon;
              return (
                <div
                  key={test.id}
                  className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
                >
                  <div className={`${test.color} p-6 text-white`}>
                    <Icon className="w-12 h-12 mb-3" />
                    <h3 className="text-xl font-bold">{test.name}</h3>
                  </div>
                  <div className="p-6">
                    <p className="text-gray-600 mb-4">{test.description}</p>
                    <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                      <p className="text-xs text-gray-500 mb-1">Using Real Data:</p>
                      <p className="font-mono text-xs text-gray-900">
                        Deliverable: {selectedDeliverable.id}
                      </p>
                      {test.requiresProject && (
                        <p className="font-mono text-xs text-gray-900">
                          Project: {selectedDeliverable.project_id}
                        </p>
                      )}
                    </div>
                    <button
                      onClick={() => setActiveTest(test.id)}
                      className={`w-full ${test.color} ${test.hoverColor} text-white py-3 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2`}
                    >
                      <Icon className="w-4 h-4" />
                      Test Component
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* API Info */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="font-semibold text-blue-900 mb-2">📡 API Endpoints Being Used</h3>
          <div className="space-y-2 text-sm text-blue-800">
            <div className="flex items-start gap-2">
              <span className="font-mono bg-blue-100 px-2 py-1 rounded">GET</span>
              <span>/api/deliverable/freelancer/my-deliverables</span>
              <span className="text-blue-600 ml-auto">Freelancer Deliverables</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="font-mono bg-blue-100 px-2 py-1 rounded">GET</span>
              <span>/api/deliverable/projects/{'{projectId}'}</span>
              <span className="text-blue-600 ml-auto">Version Compare</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="font-mono bg-green-100 px-2 py-1 rounded text-green-800">POST</span>
              <span>/api/deliverable</span>
              <span className="text-blue-600 ml-auto">Upload</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="font-mono bg-purple-100 px-2 py-1 rounded text-purple-800">POST</span>
              <span>/api/feedback</span>
              <span className="text-blue-600 ml-auto">Submit Feedback</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="font-mono bg-purple-100 px-2 py-1 rounded text-purple-800">GET</span>
              <span>/api/feedback/deliverable/{'{deliverableId}'}</span>
              <span className="text-blue-600 ml-auto">Get Feedback</span>
            </div>
          </div>
        </div>

        {/* Debug Info */}
        <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-lg p-6">
          <h3 className="font-semibold text-yellow-900 mb-2">🐛 Debug Info</h3>
          <div className="space-y-1 text-sm text-yellow-800 font-mono">
            <div>API Base: {import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'}</div>
            <div>Token: {token ? `${token.substring(0, 20)}...` : 'None'}</div>
            <div>Total Deliverables: {deliverables.length}</div>
            <div>Selected: {selectedDeliverable ? `${selectedDeliverable.id} - ${selectedDeliverable.title}` : 'None'}</div>
            <div>Open DevTools Console to see API calls and responses</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ComponentTestPage;