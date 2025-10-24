/**
 * components/deliverables/VersionCompare.jsx
 * Owner: Cindy
 * Description: Compares two versions of a deliverable visually or textually.
 */

// TODO:
// - Render side-by-side comparison of deliverables
// - Highlight changes or updates

import React, { useState } from 'react';
import { Card } from '../common';
import { Download, Calendar, FileText } from 'lucide-react';

const VersionCompare = ({ versions = [], currentVersion }) => {
  const [selectedVersions, setSelectedVersions] = useState({
    left: versions[0],
    right: versions[versions.length - 1]
  });

  // Safe data formatting
  const formatDate = (dateString) => {
    if (!dateString) return 'Unknown date';
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch {
      return 'Invalid date';
    }
  };

  const formatFileSize = (bytes) => {
    if (!bytes || isNaN(bytes)) return 'N/A';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  // Early return for no versions
  if (!versions || versions.length === 0) {
    return (
      <Card className="p-8 text-center">
        <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-500">No versions available for comparison</p>
        <p className="text-sm text-gray-400 mt-2">
          Upload some deliverables to see version comparisons
        </p>
      </Card>
    );
  }

  // If we have versions but selection is invalid, reset it
  if (!selectedVersions.left && versions.length > 0) {
    setSelectedVersions({
      left: versions[0],
      right: versions[versions.length - 1]
    });
    return <div>Loading versions...</div>;
  }

  return (
    <Card className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Version Comparison</h3>
        
        {/* Version Selectors - only show if we have multiple versions */}
        {versions.length > 1 && (
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <label className="text-sm font-medium text-gray-700">Compare:</label>
              <select
                value={selectedVersions.left?.id || ''}
                onChange={(e) => setSelectedVersions(prev => ({
                  ...prev,
                  left: versions.find(v => v.id === e.target.value)
                }))}
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                {versions.map(version => (
                  <option key={version.id} value={version.id}>
                    v{version.version} - {formatDate(version.createdAt)}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="flex items-center space-x-2">
              <label className="text-sm font-medium text-gray-700">with:</label>
              <select
                value={selectedVersions.right?.id || ''}
                onChange={(e) => setSelectedVersions(prev => ({
                  ...prev,
                  right: versions.find(v => v.id === e.target.value)
                }))}
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                {versions.map(version => (
                  <option key={version.id} value={version.id}>
                    v{version.version} - {formatDate(version.createdAt)}
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}
      </div>

      <div className="text-center text-gray-500">
        <p>Version compare component loaded successfully</p>
        <p className="text-sm">Versions available: {versions.length}</p>
      </div>
    </Card>
  );
};

export default VersionCompare;