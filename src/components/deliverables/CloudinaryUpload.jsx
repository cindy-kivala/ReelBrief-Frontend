/**
 * CloudinaryUpload.jsx
 * Owner: Cindy
 * Description: Upload component integrated with Cloudinary for file management.
 */

import { useState, useRef } from 'react';
import { Upload, X, CheckCircle, AlertCircle, File } from 'lucide-react';
import { uploadDeliverable } from '../../api/deliverableAPI';

const CloudinaryUpload = ({ projectId, onUploadSuccess, onUploadError }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState(null);
  const [preview, setPreview] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    change_notes: ''
  });
  
  const fileInputRef = useRef(null);

  // Allowed file types
  const allowedTypes = {
    'image/jpeg': 'JPEG Image',
    'image/png': 'PNG Image',
    'image/gif': 'GIF Image',
    'image/webp': 'WebP Image',
    'video/mp4': 'MP4 Video',
    'video/quicktime': 'MOV Video',
    'application/pdf': 'PDF Document',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'Word Document',
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    if (!allowedTypes[file.type]) {
      setError('File type not supported. Please upload an image, video, or document.');
      return;
    }

    // Validate file size (max 50MB)
    const maxSize = 50 * 1024 * 1024; // 50MB
    if (file.size > maxSize) {
      setError('File size exceeds 50MB limit.');
      return;
    }

    setSelectedFile(file);
    setError(null);

    // Generate preview for images
    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      setPreview(null);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setError('Please select a file to upload.');
      return;
    }

    setUploading(true);
    setProgress(0);
    setError(null);

    try {
      // Create FormData
      const data = new FormData();
      data.append('file', selectedFile);
      data.append('project_id', projectId);
      data.append('title', formData.title || selectedFile.name);
      data.append('description', formData.description);
      data.append('change_notes', formData.change_notes);

      // Simulate progress (since we can't track actual upload progress easily)
      const progressInterval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 200);

      // Upload to backend
      const response = await uploadDeliverable(data);

      clearInterval(progressInterval);
      setProgress(100);

      // Success callback
      if (onUploadSuccess) {
        onUploadSuccess(response.deliverable);
      }

      // Reset form
      setTimeout(() => {
        resetForm();
      }, 1500);

    } catch (err) {
      setError(err.error || 'Upload failed. Please try again.');
      if (onUploadError) {
        onUploadError(err);
      }
    } finally {
      setUploading(false);
    }
  };

  const resetForm = () => {
    setSelectedFile(null);
    setPreview(null);
    setFormData({
      title: '',
      description: '',
      change_notes: ''
    });
    setProgress(0);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  return (
    <div className="w-full max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Upload Deliverable</h2>

      {/* File Input */}
      <div className="mb-6">
        <input
          ref={fileInputRef}
          type="file"
          onChange={handleFileSelect}
          accept=".jpg,.jpeg,.png,.gif,.webp,.mp4,.mov,.pdf,.doc,.docx"
          className="hidden"
          id="file-upload"
          disabled={uploading}
        />
        
        <label
          htmlFor="file-upload"
          className={`flex flex-col items-center justify-center w-full h-48 border-2 border-dashed rounded-lg cursor-pointer transition-colors
            ${uploading ? 'bg-gray-100 border-gray-300 cursor-not-allowed' : 'bg-gray-50 border-gray-300 hover:bg-gray-100 hover:border-blue-500'}`}
        >
          {!selectedFile ? (
            <>
              <Upload className="w-12 h-12 text-gray-400 mb-3" />
              <p className="text-sm text-gray-600 font-medium">Click to upload file</p>
              <p className="text-xs text-gray-500 mt-1">Images, videos, or documents (Max 50MB)</p>
            </>
          ) : (
            <div className="flex flex-col items-center">
              {preview ? (
                <img src={preview} alt="Preview" className="h-32 rounded-lg mb-2 object-cover" />
              ) : (
                <File className="w-12 h-12 text-blue-500 mb-2" />
              )}
              <p className="text-sm font-medium text-gray-700">{selectedFile.name}</p>
              <p className="text-xs text-gray-500">{formatFileSize(selectedFile.size)}</p>
            </div>
          )}
        </label>
      </div>

      {/* File Info & Form */}
      {selectedFile && !uploading && progress < 100 && (
        <div className="space-y-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              placeholder={selectedFile.name}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Optional description..."
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Change Notes</label>
            <textarea
              name="change_notes"
              value={formData.change_notes}
              onChange={handleInputChange}
              placeholder="What changed in this version?"
              rows={2}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      )}

      {/* Progress Bar */}
      {uploading && (
        <div className="mb-6">
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>Uploading...</span>
            <span>{progress}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}

      {/* Success Message */}
      {progress === 100 && !uploading && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center">
          <CheckCircle className="w-5 h-5 text-green-600 mr-3" />
          <span className="text-green-800 font-medium">Upload successful!</span>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start">
          <AlertCircle className="w-5 h-5 text-red-600 mr-3 mt-0.5" />
          <span className="text-red-800 text-sm">{error}</span>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex gap-3">
        <button
          onClick={handleUpload}
          disabled={!selectedFile || uploading || progress === 100}
          className="flex-1 px-4 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
        >
          {uploading ? 'Uploading...' : 'Upload File'}
        </button>
        
        {selectedFile && !uploading && (
          <button
            onClick={resetForm}
            className="px-4 py-2 bg-gray-200 text-gray-700 font-medium rounded-md hover:bg-gray-300 transition-colors flex items-center"
          >
            <X className="w-4 h-4 mr-1" />
            Clear
          </button>
        )}
      </div>
    </div>
  );
};

export default CloudinaryUpload;