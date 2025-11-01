import React, { useState, useEffect, useCallback } from 'react';
import { 
  Download, 
  FileText, 
  GitCompare, 
  ArrowLeft, 
  CheckCircle2,
  RefreshCw,
  AlertCircle,
  Image as ImageIcon
} from 'lucide-react';
import { fetchDeliverablesByProject } from '../../api/deliverableAPI';
import PropTypes from 'prop-types';

const VersionCompare = ({ projectId, onBack }) => {
  // State
  const [versions, setVersions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedVersions, setSelectedVersions] = useState({
    left: null,
    right: null
  });

  // Memoized helper functions
  const getErrorMessage = useCallback((error, projectId) => {
    if (!error) return 'An unknown error occurred';
    
    if (error.status === 401) {
      return 'Authentication failed. Please log in again.';
    }
    if (error.status === 403) {
      return `You don't have access to project ${projectId}.`;
    }
    if (error.status === 404) {
      return `Project ${projectId} not found.`;
    }
    if (error.status === 500) {
      return 'Server error. Please try again later.';
    }
    if (error.message?.includes('Network error')) {
      return 'Unable to connect to server. Please check your internet connection.';
    }
    
    return error.message || 'Failed to load versions';
  }, []);

  const formatDate = useCallback((dateString) => {
    if (!dateString) return 'Unknown date';
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return 'Invalid date';
    }
  }, []);

  const formatFileSize = useCallback((bytes) => {
    if (!bytes || bytes === 0) return 'Unknown size';
    const kb = bytes / 1024;
    if (kb < 1024) return `${Math.round(kb)} KB`;
    return `${(kb / 1024).toFixed(1)} MB`;
  }, []);

  const handleVersionSelect = useCallback((side, versionId) => {
    setSelectedVersions(prev => ({
      ...prev, 
      [side]: versions.find(v => v.id === versionId) || null
    }));
  }, [versions]);

  // Fetch versions from API
  const fetchVersions = useCallback(async () => {
    if (!projectId) {
      setError('No project ID provided');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      console.log('Fetching versions for project:', projectId);
      
      const response = await fetchDeliverablesByProject(projectId);
      
      console.log('API Response:', response);
      
      if (!response.success) {
        throw new Error(response.error || 'Failed to load versions');
      }
      
      // Transform data
      const transformedVersions = (response.deliverables || []).map(d => ({
        id: d.id?.toString() || `unknown-${Math.random()}`,
        version: d.version_number?.toString() || '1',
        name: d.title || 'Untitled',
        createdAt: d.uploaded_at || d.created_at || new Date().toISOString(),
        uploadedBy: d.uploader ? 
          `${d.uploader.first_name || ''} ${d.uploader.last_name || ''}`.trim() || 'Unknown' 
          : 'Unknown',
        status: d.status || 'pending',
        thumbnailUrl: d.thumbnail_url || d.file_url,
        fileUrl: d.file_url,
        fileType: d.file_type || 'document',
        changes: d.change_notes ? [d.change_notes] : ['No change notes provided'],
        fileSize: d.file_size || 0
      }));
      
      console.log('Transformed versions:', transformedVersions.length);
      setVersions(transformedVersions);
      
      // Set initial versions (newest vs oldest)
      if (transformedVersions.length > 0) {
        setSelectedVersions({
          left: transformedVersions[transformedVersions.length - 1], // Newest
          right: transformedVersions[0] // Oldest
        });
      }
      
    } catch (err) {
      console.error('Version fetch error:', err);
      const errorMessage = getErrorMessage(err, projectId);
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [projectId, getErrorMessage]);

  // Effect to fetch data on mount or projectId change
  useEffect(() => {
    fetchVersions();
  }, [fetchVersions]);

  // Derive selected versions safely
  const leftVersion = selectedVersions.left || (versions.length > 0 ? versions[versions.length - 1] : null);
  const rightVersion = selectedVersions.right || (versions.length > 0 ? versions[0] : null);

  // Render loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-800">Loading Deliverables</h3>
          <p className="text-gray-600">Fetching data for Project {projectId}...</p>
        </div>
      </div>
    );
  }

  // Render error state
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-800 mb-2">Oops! Something went wrong</h3>
          <p className="text-gray-600 mb-2">{error}</p>
          <p className="text-sm text-gray-500 mb-4">
            Project ID: {projectId || 'Not provided'}
          </p>
          <button
            onClick={fetchVersions}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
          {onBack && (
            <button
              onClick={onBack}
              className="ml-3 bg-gray-200 text-gray-700 px-6 py-3 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
            >
              Go Back
            </button>
          )}
        </div>
      </div>
    );
  }

  // Render no versions state
  if (versions.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md">
          <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-800 mb-2">No Versions Found</h3>
          <p className="text-gray-600 mb-4">
            There are no deliverables for Project {projectId} yet.
          </p>
          {onBack && (
            <button
              onClick={onBack}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              Go Back
            </button>
          )}
        </div>
      </div>
    );
  }

  // Version card component
  const VersionCard = ({ version, side, onVersionSelect }) => {
    if (!version) return null;

    return (
      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm h-full flex flex-col">
        <div className="flex justify-between items-start mb-4">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900">
              Version {version.version}
            </h3>
            <p className="text-sm text-gray-600">
              {formatDate(version.createdAt)}
            </p>
            <p className="text-xs text-gray-500">
              By {version.uploadedBy}
            </p>
          </div>
          <select 
            value={version.id}
            onChange={(e) => onVersionSelect(side, e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ml-4"
          >
            {versions.map((v) => (
              <option key={v.id} value={v.id}>
                Version {v.version} - {formatDate(v.createdAt)}
              </option>
            ))}
          </select>
        </div>

        {/* File Preview */}
        <div className="bg-gray-100 rounded-lg p-8 mb-4 flex items-center justify-center min-h-[300px] flex-1">
          {version.fileType === 'image' ? (
            <div className="relative">
    <img
      src={version.fileUrl}
      alt={version.name}
      className="max-w-full max-h-64 object-contain rounded shadow-sm"
      onError={(e) => {
        // FIXED: Safe error handling
        if (e.target) {
          e.target.style.display = 'none';
        }
        // Show fallback content
        const fallback = document.createElement('div');
        fallback.className = 'text-center p-4';
        fallback.innerHTML = `
          <div class="text-gray-400 mb-2">
            <svg class="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
            </svg>
          </div>
          <p class="text-sm text-gray-600">Image not available</p>
          <a href="${version.fileUrl}" target="_blank" rel="noopener noreferrer" class="text-blue-600 text-sm hover:underline">
            Open original
          </a>
        `;
        e.target.parentNode.appendChild(fallback);
      }}
    />
  </div>
          ) : version.fileType === 'video' ? (
            <video 
              controls 
              className="max-w-full max-h-64 rounded shadow-sm"
              src={version.fileUrl}
            >
              Your browser does not support the video tag.
            </video>
          ) : (
            <div className="text-center">
              <FileText className="w-16 h-16 text-gray-400 mx-auto mb-3" />
              <p className="font-medium text-gray-700">{version.name}</p>
              <p className="text-sm text-gray-500 mt-1">{formatFileSize(version.fileSize)}</p>
              <a
                href={version.fileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 mt-3 text-blue-600 hover:text-blue-700 text-sm"
              >
                <Download className="w-4 h-4" />
                Download File
              </a>
            </div>
          )}
        </div>

        {/* Status Badge */}
        <div className="mb-4">
          <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
            version.status === 'approved' ? 'bg-green-100 text-green-800' :
            version.status === 'rejected' ? 'bg-red-100 text-red-800' :
            version.status === 'revision_requested' ? 'bg-yellow-100 text-yellow-800' :
            'bg-gray-100 text-gray-800'
          }`}>
            {version.status ? version.status.replace('_', ' ').toUpperCase() : 'UNKNOWN'}
          </span>
        </div>

        {/* Changes */}
        <div className="mt-auto">
          <h4 className="font-semibold text-gray-900 mb-2">What Changed:</h4>
          <ul className="space-y-1">
            {version.changes.map((change, index) => (
              <li key={index} className="flex items-start gap-2 text-sm text-gray-600">
                <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                <span>{change}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    );
  };

  // Main comparison view
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center gap-4">
            {onBack && (
              <button 
                onClick={onBack}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                aria-label="Go back"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
            )}
            <GitCompare className="w-6 h-6 text-blue-600" />
            <div>
              <h1 className="text-xl font-semibold text-gray-900">
                Version Comparison
              </h1>
              <p className="text-sm text-gray-600">
                Project {projectId} • {versions.length} version{versions.length !== 1 ? 's' : ''}
              </p>
            </div>
            <button
              onClick={fetchVersions}
              className="ml-auto p-2 hover:bg-gray-100 rounded-lg transition-colors"
              aria-label="Refresh"
            >
              <RefreshCw className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto p-6">
        {/* Comparison Layout */}
        <div className="grid md:grid-cols-2 gap-8 mb-8">
          <VersionCard 
            version={leftVersion}
            side="left"
            onVersionSelect={handleVersionSelect}
          />
          <VersionCard 
            version={rightVersion}
            side="right"
            onVersionSelect={handleVersionSelect}
          />
        </div>

        {/* Info Banner */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
          <h3 className="font-semibold text-blue-900 mb-2"> Real Data Source</h3>
          <p className="text-blue-800 text-sm mb-3">
            Displaying <strong>real deliverables</strong> from Project {projectId} via backend API.
            Each version represents actual file uploads with proper version tracking from PostgreSQL.
          </p>
          <div className="flex flex-wrap gap-4 text-xs text-blue-700">
            <span>API: <code className="bg-blue-100 px-2 py-1 rounded">/api/deliverable/projects/{projectId}</code></span>
            <span>Storage: Cloudinary</span>
            <span>Versions: {versions.length} total</span>
          </div>
        </div>
      </div>
    </div>
  );
};

VersionCompare.propTypes = {
  projectId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  onBack: PropTypes.func,
};

export default VersionCompare;