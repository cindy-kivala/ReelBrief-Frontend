import React, { useState } from 'react';
import { Download, FileText, GitCompare, ArrowLeft, CheckCircle2, RefreshCw, AlertCircle } from 'lucide-react';

// Standalone test component for Version Compare
// Access at: /test-version-compare

const VersionCompareTest = () => {
  const [projectId, setProjectId] = useState('34');
  const [showCompare, setShowCompare] = useState(false);
  
  const testInstructions = [
    'Enter a valid project ID that has deliverables',
    'Make sure you\'re logged in (check localStorage for access_token)',
    'Click "Load Versions" to test the API call',
    'If it fails, check the console for error details'
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        {/* Test Controls */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            🧪 Version Compare Test Panel
          </h1>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Project ID to Test
              </label>
              <input
                type="text"
                value={projectId}
                onChange={(e) => setProjectId(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter project ID (e.g., 34)"
              />
            </div>

            <button
              onClick={() => setShowCompare(true)}
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
            >
              <GitCompare className="w-5 h-5" />
              Load Version Compare for Project {projectId}
            </button>
          </div>

          {/* Instructions */}
          <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="font-semibold text-blue-900 mb-2">📋 Testing Instructions:</h3>
            <ul className="space-y-1 text-sm text-blue-800">
              {testInstructions.map((instruction, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="font-bold">{i + 1}.</span>
                  <span>{instruction}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Auth Check */}
          <div className="mt-4 bg-gray-100 rounded-lg p-4">
            <h3 className="font-semibold text-gray-900 mb-2">🔐 Auth Status:</h3>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full ${localStorage.getItem('access_token') ? 'bg-green-500' : 'bg-red-500'}`} />
                <span className="font-medium">
                  {localStorage.getItem('access_token') ? '✅ Token Found' : '❌ No Token'}
                </span>
              </div>
              {localStorage.getItem('access_token') && (
                <div className="mt-2 p-2 bg-white rounded border border-gray-300">
                  <p className="text-xs text-gray-600 font-mono break-all">
                    {localStorage.getItem('access_token').substring(0, 50)}...
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Version Compare Component */}
        {showCompare && (
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="bg-gray-800 text-white p-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold">Version Compare View</h2>
              <button
                onClick={() => setShowCompare(false)}
                className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
              >
                Close Test
              </button>
            </div>
            
            {/* This will render your actual VersionCompare component */}
            <div className="p-6">
              <VersionCompareEmbed projectId={projectId} />
            </div>
          </div>
        )}

        {/* Debug Info */}
        <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <h3 className="font-semibold text-yellow-900 mb-2">🐛 Debug Checklist:</h3>
          <div className="space-y-2 text-sm text-yellow-800">
            <div>✓ API Base URL: <code className="bg-yellow-100 px-2 py-1 rounded">{import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'}</code></div>
            <div>✓ Expected Endpoint: <code className="bg-yellow-100 px-2 py-1 rounded">/api/deliverables/projects/{projectId}</code></div>
            <div>✓ Token Storage Key: <code className="bg-yellow-100 px-2 py-1 rounded">access_token</code></div>
            <div>✓ Open DevTools Console to see API calls and responses</div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Embedded version compare (simplified for testing)
const VersionCompareEmbed = ({ projectId }) => {
  const [versions, setVersions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  React.useEffect(() => {
    fetchVersions();
  }, [projectId]);

  const fetchVersions = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const token = localStorage.getItem('access_token');
      const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';
      
      console.log('🔍 Fetching versions for project:', projectId);
      console.log('🔍 Using URL:', `${API_BASE_URL}/api/deliverables/projects/${projectId}`);
      console.log('🔍 Token exists:', !!token);
      
      const response = await fetch(`${API_BASE_URL}/api/deliverables/projects/${projectId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token ? `Bearer ${token}` : ''
        }
      });

      console.log('📦 Response status:', response.status);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('❌ API Error:', errorData);
        throw new Error(errorData.error || `HTTP ${response.status}`);
      }

      const data = await response.json();
      console.log('✅ API Success:', data);
      
      if (!data.success) {
        throw new Error(data.error || 'Failed to load versions');
      }
      
      setVersions(data.deliverables || []);
      
    } catch (err) {
      console.error('💥 Fetch error:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <RefreshCw className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
        <p className="text-gray-600">Loading deliverables...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-gray-800 mb-2">Error Loading Data</h3>
        <p className="text-red-600 mb-4">{error}</p>
        <button
          onClick={fetchVersions}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
        >
          Retry
        </button>
      </div>
    );
  }

  if (versions.length === 0) {
    return (
      <div className="text-center py-12">
        <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-600">No deliverables found for project {projectId}</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
        <div className="flex items-center gap-2 text-green-800">
          <CheckCircle2 className="w-5 h-5" />
          <span className="font-semibold">Success! Found {versions.length} deliverables</span>
        </div>
      </div>

      <div className="grid gap-4">
        {versions.map((v) => (
          <div key={v.id} className="border border-gray-200 rounded-lg p-4">
            <div className="flex items-start justify-between">
              <div>
                <h4 className="font-semibold text-gray-900">Version {v.version_number}</h4>
                <p className="text-sm text-gray-600">{v.title}</p>
                <p className="text-xs text-gray-500 mt-1">
                  Uploaded: {new Date(v.uploaded_at).toLocaleDateString()}
                </p>
              </div>
              <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                {v.status}
              </span>
            </div>
            {v.change_notes && (
              <p className="mt-2 text-sm text-gray-600 bg-gray-50 p-2 rounded">
                {v.change_notes}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default VersionCompareTest;