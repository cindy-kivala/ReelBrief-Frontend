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
import axiosClient from '../../api/axiosClient';
import PropTypes from 'prop-types';

const VersionCompare = ({ projectId, onBack }) => {
  const [versions, setVersions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedVersions, setSelectedVersions] = useState({
    left: null,
    right: null
  });

  console.log('VersionCompare mounted with projectId:', projectId); // Debug log

  // REAL DATA FETCHING - FIXED URL
  useEffect(() => {
    if (projectId) {
      fetchVersions();
    } else {
      setError('No project ID provided');
      setLoading(false);
    }
  }, [projectId]);

  const getErrorMessage = useCallback((error, projectId) => {
    if (error.includes('Network Error')) {
      return 'Unable to connect to server. Please check your internet connection.';
    }
    if (error.includes('401')) {
      return 'Authentication failed. Please log in again.';
    }
    if (error.includes('404')) {
      return `Project ${projectId} not found or you don't have access.`;
    }
    if (error.includes('500')) {
      return 'Server error. Please try again later.';
    }
    return error;
  }, []);


  const fetchVersions = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('Fetching versions for project:', projectId); // Debug log
      
      // FIXED: Remove duplicate /api/ from URL
      // Our backend route is: /api/deliverables/projects/{id}
      // NOT: /api/api/deliverables/projects/{id}
      const response = await axiosClient.get(`/api/deliverables/projects/${projectId}`);
      
      console.log('API Response:', response.data); // Debug log
      
      if (!response.data.success) {
        throw new Error(response.data.error || 'Failed to load versions');
      }
      
      // Transform data
      const transformedVersions = response.data.deliverables.map(d => ({
        id: d.id?.toString() || 'unknown',
        version: d.version_number.toString() || '1',
        name: d.title || 'Untitled',
        createdAt: d.uploaded_at || new Date().toISOString(),
        uploadedBy: d.uploader ? 
        `${d.uploader.first_name || ''} ${d.uploader.last_name || ''}`.trim() || 'Unknown' 
        : 'Unknown',
        status: d.status || 'pending',
        thumbnailUrl: d.thumbnail_url || d.file_url,
        fileUrl: d.file_url,
        fileType: d.file_type || 'document',
        changes: d.change_notes ? [d.change_notes] : ['No change notes'],
        fileSize: d.file_size || 0
      }));
      
      console.log('Transformed versions:', transformedVersions.length);
      setVersions(transformedVersions);
      
      // Set initial versions
      if (transformedVersions.length > 0) {
        setSelectedVersions({
          left: transformedVersions[transformedVersions.length - 1], // Newest
          right: transformedVersions[0] // Oldest
        });
      }
      
    } catch (err) {
      console.error('Version fetch error:', err);
      console.error('Error details:', err.response?.data); // Debug log
      const errorMessage = err.response?.data?.error || err.message || 'Failed to load versions';
      setError(getErrorMessage(errorMessage, projectId));
    } finally {
      setLoading(false);
    }
  };

  // LOADING STATE
  if (loading) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <RefreshCw className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-gray-800">Loading Deliverables</h3>
        <p className="text-gray-600">Fetching data for Project {projectId}...</p>
      </div>
    </div>
  );

  // SIMPLE ERROR STATE
  if (error) return (
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
          className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700"
        >
          Try Again
        </button>
      </div>
    </div>
  );

  const leftVersion = selectedVersions.left || versions[versions.length - 1];
  const rightVersion = selectedVersions.right || versions[0];

  const formatDate = useCallback((dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  }, []);

  const formatFileSize = useCallback((bytes) => {
    if (!bytes) return 'Unknown size';
    return `${(bytes / 1024).toFixed(1)} KB`;
  }, []);

  const handleVersionSelect = useCallback((side, versionId) => {
    setSelectedVersions(prev => ({
      ...prev, 
      [side]: versions.find(v => v.id === versionId) 
    }));
  }, [versions]);


  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center gap-4">
            <button 
              onClick={onBack}
              className="p-2 hover:bg-gray-100 rounded-lg"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <GitCompare className="w-6 h-6 text-blue-600" />
            <div>
              <h1 className="text-xl font-semibold text-gray-900">
                Version Comparison
              </h1>
              <p className="text-sm text-gray-600">
                Project {projectId} • {versions.length} versions
              </p>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto p-6">
        {/* Comparison Layout */}
        <div className="grid md:grid-cols-2 gap-8 mb-8">
          {/* Left Version */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  Version {leftVersion.version}
                </h3>
                <p className="text-sm text-gray-600">
                  {formatDate(leftVersion.createdAt)}
                </p>
                <p className="text-xs text-gray-500">
                  By {leftVersion.uploadedBy}
                </p>
              </div>
              <select 
                value={leftVersion.id}
                onChange={(e) => handleVersionSelect('left', e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
              >
                {versions.map((v) => (
                  <option key={v.id} value={v.id}>
                    Version {v.version}
                  </option>
                ))}
              </select>
            </div>

            {/* File Preview */}
            <div className="bg-gray-100 rounded-lg p-8 mb-4 flex items-center justify-center min-h-[300px]">
              {leftVersion.fileType === 'image' ? (
                <img
                  src={leftVersion.fileUrl}
                  alt={leftVersion.name}
                  className="max-w-full max-h-64 object-contain rounded"
                />
              ) : (
                <div className="text-center">
                  <FileText className="w-16 h-16 text-gray-400 mx-auto mb-3" />
                  <p className="font-medium text-gray-700">{leftVersion.name}</p>
                  <p className="text-sm text-gray-500">{formatFileSize(leftVersion.fileSize)}</p>
                </div>
              )}
            </div>

            {/* Changes */}
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">What Changed:</h4>
              <ul className="space-y-1">
                {leftVersion.changes.map((change, index) => (
                  <li key={index} className="flex items-start gap-2 text-sm text-gray-600">
                    <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                    {change}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Right Version */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  Version {rightVersion.version}
                </h3>
                <p className="text-sm text-gray-600">
                  {formatDate(rightVersion.createdAt)}
                </p>
                <p className="text-xs text-gray-500">
                  By {rightVersion.uploadedBy}
                </p>
              </div>
              <select 
                value={rightVersion.id}
                onChange={(e) => handleVersionSelect('right', e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
              >
                {versions.map((v) => (
                  <option key={v.id} value={v.id}>
                    Version {v.version}
                  </option>
                ))}
              </select>
            </div>

            {/* File Preview */}
            <div className="bg-gray-100 rounded-lg p-8 mb-4 flex items-center justify-center min-h-[300px]">
              {rightVersion.fileType === 'image' ? (
                <img
                  src={rightVersion.fileUrl}
                  alt={rightVersion.name}
                  className="max-w-full max-h-64 object-contain rounded"
                />
              ) : (
                <div className="text-center">
                  <FileText className="w-16 h-16 text-gray-400 mx-auto mb-3" />
                  <p className="font-medium text-gray-700">{rightVersion.name}</p>
                  <p className="text-sm text-gray-500">{formatFileSize(rightVersion.fileSize)}</p>
                </div>
              )}
            </div>

            {/* Changes */}
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">What Changed:</h4>
              <ul className="space-y-1">
                {rightVersion.changes.map((change, index) => (
                  <li key={index} className="flex items-start gap-2 text-sm text-gray-600">
                    <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                    {change}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Data Source Info */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-xl p-6">
          <h3 className="font-semibold text-blue-900 mb-2">Real Data Source</h3>
          <p className="text-blue-800 text-sm">
            Displaying <strong>real deliverables</strong> from Project {projectId} via our backend API.
            Each version represents actual file uploads with proper version tracking from PostgreSQL.
          </p>
          <div className="mt-3 flex gap-4 text-xs text-blue-700">
            <span>API: <code>/deliverables/projects/{projectId}</code></span>
            <span>Files: Cloudinary</span>
            <span>Versions: {versions.length} total</span>
          </div>
        </div>
      </div>
    </div>
  );
};

VersionCompare.propTypes = {
  projectId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  onBack: PropTypes.func.isRequired,
};

export default VersionCompare;