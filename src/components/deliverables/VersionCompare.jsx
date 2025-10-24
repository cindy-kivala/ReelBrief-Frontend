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
import { Download, Calendar, FileText, Clock, Maximize2, Minimize2 } from 'lucide-react';

const VersionCompare = ({ versions = [], currentVersion }) => {
  const [selectedVersions, setSelectedVersions] = useState({
    left: versions[0],
    right: versions[versions.length - 1]
  });
  const [expandedView, setExpandedView] = useState(false);

  const formatDate = (dateString) => {
    if (!dateString) return 'Unknown date';
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      });
    } catch {
      return 'Invalid date';
    }
  };

  const formatFileSize = (bytes) => {
    if (!bytes || isNaN(bytes)) return '0 KB';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // File preview component that handles different file types
  const FilePreview = ({ version, className = '' }) => {
    if (!version) return null;

    const isImage = version.fileType?.includes('image');
    const isVideo = version.fileType?.includes('video');
    const isPDF = version.fileType?.includes('pdf');
    const isDocument = version.fileType?.includes('document') || version.fileType?.includes('text');

    return (
      <div className={`bg-gray-50 rounded-lg border-2 border-gray-200 ${className}`}>
        {isImage ? (
          <div className="flex flex-col">
            <div className="flex-1 min-h-64 max-h-96 overflow-auto">
              <img
                src={version.thumbnailUrl || version.fileUrl}
                alt={`Version ${version.version}`}
                className="w-full h-auto object-contain"
                style={{ maxWidth: '100%', height: 'auto' }}
              />
            </div>
            <div className="p-3 bg-white border-t border-gray-200">
              <p className="text-xs text-gray-500 text-center">
                Scroll to view full image • {formatFileSize(version.fileSize)}
              </p>
            </div>
          </div>
        ) : isVideo ? (
          <div className="p-4">
            <video
              controls
              className="w-full max-w-full rounded"
              style={{ maxHeight: '400px' }}
            >
              <source src={version.fileUrl} type={version.fileType} />
              Your browser does not support the video tag.
            </video>
            <p className="text-xs text-gray-500 text-center mt-2">
              Video • {formatFileSize(version.fileSize)}
            </p>
          </div>
        ) : isPDF || isDocument ? (
          <div className="p-6">
            <div className="text-center mb-4">
              <FileText className="w-16 h-16 text-gray-400 mx-auto mb-3" />
              <p className="text-sm font-medium text-gray-700">{version.fileName || 'Document'}</p>
              <p className="text-xs text-gray-500 mt-1">{formatFileSize(version.fileSize)}</p>
            </div>
            <div className="bg-white rounded border p-4 max-h-60 overflow-y-auto">
              <p className="text-sm text-gray-600">
                {version.previewText || 'Document preview not available. Download to view full content.'}
              </p>
            </div>
            <button className="w-full mt-4 flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              <Download className="w-4 h-4" />
              Download Full Document
            </button>
          </div>
        ) : (
          <div className="p-6 text-center">
            <FileText className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <p className="text-sm font-medium text-gray-700">{version.fileType || 'File'}</p>
            <p className="text-xs text-gray-500 mt-1">{formatFileSize(version.fileSize)}</p>
            <button className="mt-4 flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors mx-auto">
              <Download className="w-4 h-4" />
              Download File
            </button>
          </div>
        )}
      </div>
    );
  };

  if (!versions || versions.length === 0) {
    return (
      <Card className="p-8 text-center">
        <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">No Versions Available</h3>
        <p className="text-gray-500">Upload deliverables to start comparing versions.</p>
      </Card>
    );
  }

  const v1 = selectedVersions.left;
  const v2 = selectedVersions.right;

  return (
    <Card className="p-6">
      {/* Header with expand/collapse toggle */}
      <div className="flex items-center justify-between mb-6">
        <div className="text-center flex-1">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Version Comparison</h2>
          <p className="text-gray-600">Compare different versions of your deliverable</p>
        </div>
        <button
          onClick={() => setExpandedView(!expandedView)}
          className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
        >
          {expandedView ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          {expandedView ? 'Collapse' : 'Expand'}
        </button>
      </div>

      {/* Version Selectors */}
      <div className="flex items-center justify-center gap-4 mb-8">
        <div className="flex items-center gap-3">
          <select
            value={v1?.id || ''}
            onChange={(e) => setSelectedVersions(prev => ({
              ...prev,
              left: versions.find(v => v.id === e.target.value)
            }))}
            className="border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 min-w-48"
          >
            {versions.map(version => (
              <option key={version.id} value={version.id}>
                Version {version.version} • {formatDate(version.createdAt)}
              </option>
            ))}
          </select>
          
          <span className="text-gray-400">vs</span>
          
          <select
            value={v2?.id || ''}
            onChange={(e) => setSelectedVersions(prev => ({
              ...prev,
              right: versions.find(v => v.id === e.target.value)
            }))}
            className="border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 min-w-48"
          >
            {versions.map(version => (
              <option key={version.id} value={version.id}>
                Version {version.version} • {formatDate(version.createdAt)}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Responsive Comparison Grid */}
      <div className={`grid ${expandedView ? 'grid-cols-1 gap-8' : 'grid-cols-2 gap-6'}`}>
        {/* Version 1 */}
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-gray-900">Version {v1?.version}</h3>
              {v1?.id === currentVersion?.id && (
                <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
                  Current
                </span>
              )}
            </div>
            <button className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-md transition-colors">
              <Download className="w-4 h-4" />
              Download
            </button>
          </div>

          <FilePreview 
            version={v1} 
            className={expandedView ? 'min-h-96' : ''}
          />

          {/* Metadata */}
          <div className="space-y-3">
            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-1.5 text-gray-600">
                <Calendar className="w-4 h-4" />
                <span>{formatDate(v1?.createdAt)}</span>
              </div>
              <div className="flex items-center gap-1.5 text-gray-600">
                <Clock className="w-4 h-4" />
                <span>{formatFileSize(v1?.fileSize)}</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-gray-700">Status:</span>
              <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                v1?.status === 'approved' ? 'bg-green-100 text-green-800'
                : v1?.status === 'rejected' ? 'bg-red-100 text-red-800'
                : v1?.status === 'pending_review' ? 'bg-yellow-100 text-yellow-800'
                : 'bg-gray-100 text-gray-800'
              }`}>
                {v1?.status?.replace('_', ' ') || 'Draft'}
              </span>
            </div>

            {v1?.changeNotes && (
              <div className="bg-blue-50 rounded-lg p-3">
                <p className="text-sm font-medium text-blue-900 mb-1">Change Notes</p>
                <p className="text-sm text-blue-800">{v1.changeNotes}</p>
              </div>
            )}
          </div>
        </div>

        {/* Version 2 - Only show in side-by-side mode */}
        {!expandedView && (
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-gray-900">Version {v2?.version}</h3>
                {v2?.id === currentVersion?.id && (
                  <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
                    Current
                  </span>
                )}
              </div>
              <button className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-md transition-colors">
                <Download className="w-4 h-4" />
                Download
              </button>
            </div>

            <FilePreview version={v2} />

            <div className="space-y-3">
              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-1.5 text-gray-600">
                  <Calendar className="w-4 h-4" />
                  <span>{formatDate(v2?.createdAt)}</span>
                </div>
                <div className="flex items-center gap-1.5 text-gray-600">
                  <Clock className="w-4 h-4" />
                  <span>{formatFileSize(v2?.fileSize)}</span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-gray-700">Status:</span>
                <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                  v2?.status === 'approved' ? 'bg-green-100 text-green-800'
                  : v2?.status === 'rejected' ? 'bg-red-100 text-red-800'
                  : v2?.status === 'pending_review' ? 'bg-yellow-100 text-yellow-800'
                  : 'bg-gray-100 text-gray-800'
                }`}>
                  {v2?.status?.replace('_', ' ') || 'Draft'}
                </span>
              </div>

              {v2?.changeNotes && (
                <div className="bg-blue-50 rounded-lg p-3">
                  <p className="text-sm font-medium text-blue-900 mb-1">Change Notes</p>
                  <p className="text-sm text-blue-800">{v2.changeNotes}</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Expand to view second version when in single column mode */}
      {expandedView && (
        <div className="mt-8">
          <button
            onClick={() => setExpandedView(false)}
            className="w-full py-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-gray-400 transition-colors text-gray-600 hover:text-gray-800"
          >
            Click to compare with Version {v2?.version}
          </button>
        </div>
      )}

      {/* Change Summary */}
      <div className="mt-8 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200">
        <h4 className="text-lg font-semibold text-gray-900 mb-4">Comparison Summary</h4>
        <div className="grid grid-cols-3 gap-6">
          <div className="text-center">
            <p className="text-2xl font-bold text-blue-600">
              +{Math.abs(v2?.version - v1?.version)}
            </p>
            <p className="text-sm text-gray-600 mt-1">Versions Apart</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-gray-900">
              {v1?.createdAt && v2?.createdAt 
                ? Math.round((new Date(v2.createdAt) - new Date(v1.createdAt)) / (1000 * 60 * 60 * 24))
                : 0
              }
            </p>
            <p className="text-sm text-gray-600 mt-1">Days Between</p>
          </div>
          <div className="text-center">
            <p className={`text-2xl font-bold ${
              (v2?.fileSize - v1?.fileSize) > 0 ? 'text-red-600' : 'text-green-600'
            }`}>
              {v1?.fileSize && v2?.fileSize
                ? `${(v2.fileSize - v1.fileSize) > 0 ? '+' : ''}${formatFileSize(v2.fileSize - v1.fileSize)}`
                : '0 KB'
              }
            </p>
            <p className="text-sm text-gray-600 mt-1">Size Change</p>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default VersionCompare;