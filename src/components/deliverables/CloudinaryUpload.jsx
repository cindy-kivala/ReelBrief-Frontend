/**
 * CloudinaryUpload.jsx
 * Owner: Cindy
 * Description: Upload component integrated with Cloudinary for file management.
 */
import { useState, useRef } from 'react';
import { Upload, X, CheckCircle, AlertCircle, File } from 'lucide-react';
import { uploadDeliverable } from '/src/api/deliverableAPI';

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
    const maxSize = 50 * 1024 * 1024;
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
      const data = new FormData();
      data.append('file', selectedFile);
      data.append('project_id', projectId);
      data.append('title', formData.title || selectedFile.name);
      data.append('description', formData.description);
      data.append('change_notes', formData.change_notes);

      const progressInterval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 200);

      const response = await uploadDeliverable(data);

      clearInterval(progressInterval);
      setProgress(100);

      if (onUploadSuccess) {
        onUploadSuccess(response.deliverable);
      }

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
    <div className="w-full max-w-3xl mx-auto">
      <div className="bg-white rounded-xl shadow-sm border border-[#D1D5DB] p-8">
        <div className="mb-8">
          <h2 className="text-2xl text-[#1F2937] mb-2" style={{ fontWeight: 600 }}>
            Upload Deliverable
          </h2>
          <p className="text-sm text-[#4B5563]">Share your work with the team</p>
        </div>

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
            className={`flex flex-col items-center justify-center w-full h-56 border-2 border-dashed rounded-xl cursor-pointer transition-all duration-200
              ${uploading ? 'bg-[#F3F4F6] border-[#D1D5DB] cursor-not-allowed' : 'bg-[#F3F4F6] border-[#D1D5DB] hover:bg-[#1E3A8A]/5 hover:border-[#1E3A8A]'}`}
          >
            {!selectedFile ? (
              <>
                <Upload className="w-12 h-12 text-[#4B5563] mb-4" />
                <p className="text-base text-[#1F2937] mb-1" style={{ fontWeight: 600 }}>
                  Click to upload file
                </p>
                <p className="text-sm text-[#4B5563]">Images, videos, or documents (Max 50MB)</p>
              </>
            ) : (
              <div className="flex flex-col items-center">
                {preview ? (
                  <img src={preview} alt="Preview" className="h-36 rounded-lg mb-3 object-cover shadow-sm" />
                ) : (
                  <File className="w-12 h-12 text-[#1E3A8A] mb-3" />
                )}
                <p className="text-base text-[#1F2937] mb-1" style={{ fontWeight: 600 }}>
                  {selectedFile.name}
                </p>
                <p className="text-sm text-[#4B5563]">{formatFileSize(selectedFile.size)}</p>
              </div>
            )}
          </label>
        </div>

        {/* File Info & Form */}
        {selectedFile && !uploading && progress < 100 && (
          <div className="space-y-5 mb-6">
            <div>
              <label className="block text-sm text-[#1F2937] mb-2" style={{ fontWeight: 600 }}>
                Title
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder={selectedFile.name}
                className="w-full px-4 py-2.5 border border-[#D1D5DB] rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#1E3A8A] focus:border-[#1E3A8A] transition-all"
              />
            </div>

            <div>
              <label className="block text-sm text-[#1F2937] mb-2" style={{ fontWeight: 600 }}>
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Optional description..."
                rows={3}
                className="w-full px-4 py-2.5 border border-[#D1D5DB] rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#1E3A8A] focus:border-[#1E3A8A] transition-all"
              />
            </div>

            <div>
              <label className="block text-sm text-[#1F2937] mb-2" style={{ fontWeight: 600 }}>
                Change Notes
              </label>
              <textarea
                name="change_notes"
                value={formData.change_notes}
                onChange={handleInputChange}
                placeholder="What changed in this version?"
                rows={2}
                className="w-full px-4 py-2.5 border border-[#D1D5DB] rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#1E3A8A] focus:border-[#1E3A8A] transition-all"
              />
            </div>
          </div>
        )}

        {/* Progress Bar */}
        {uploading && (
          <div className="mb-6">
            <div className="flex justify-between text-sm text-[#4B5563] mb-3" style={{ fontWeight: 600 }}>
              <span>Uploading...</span>
              <span>{progress}%</span>
            </div>
            <div className="w-full bg-[#F3F4F6] rounded-full h-2.5">
              <div
                className="bg-[#1E3A8A] h-2.5 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}

        {/* Success Message */}
        {progress === 100 && !uploading && (
          <div className="mb-6 p-4 bg-[#10B981]/10 border border-[#10B981]/20 rounded-lg flex items-center">
            <CheckCircle className="w-5 h-5 text-[#10B981] mr-3 flex-shrink-0" />
            <span className="text-[#10B981] text-sm" style={{ fontWeight: 600 }}>
              Upload successful!
            </span>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-[#FF6B6B]/10 border border-[#FF6B6B]/20 rounded-lg flex items-start">
            <AlertCircle className="w-5 h-5 text-[#FF6B6B] mr-3 mt-0.5 flex-shrink-0" />
            <span className="text-[#FF6B6B] text-sm" style={{ fontWeight: 500 }}>
              {error}
            </span>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-3">
          <button
            onClick={handleUpload}
            disabled={!selectedFile || uploading || progress === 100}
            className="flex-1 px-6 py-2.5 bg-[#1E3A8A] text-white rounded-lg hover:bg-[#1E3A8A]/90 disabled:bg-[#D1D5DB] disabled:cursor-not-allowed transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#1E3A8A]"
            style={{ fontWeight: 600 }}
          >
            {uploading ? 'Uploading...' : 'Upload File'}
          </button>
          
          {selectedFile && !uploading && (
            <button
              onClick={resetForm}
              className="px-6 py-2.5 bg-[#F3F4F6] text-[#4B5563] rounded-lg hover:bg-[#D1D5DB] transition-all duration-200 flex items-center focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#4B5563]"
              style={{ fontWeight: 600 }}
            >
              <X className="w-4 h-4 mr-2" />
              Clear
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default CloudinaryUpload;