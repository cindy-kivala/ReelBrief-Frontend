//src/pages/DeliverableDetail.jsx
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Download, ArrowLeft, CheckCircle, XCircle, RefreshCw, History, FileText, Calendar, User, X } from 'lucide-react';
import { fetchDeliverableById, approveDeliverable, getDeliverableVersions } from '../api/deliverableAPI';
import { fetchFeedback } from '../api/feedbackAPI';
import { useAuth } from '../context/AuthContext';
import CloudinaryUpload from '../components/deliverables/CloudinaryUpload';
import VersionCompare from '../components/deliverables/VersionCompare';
import FeedbackForm from '../components/deliverables/FeedbackForm';

const DeliverableDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [deliverable, setDeliverable] = useState(null);
  const [feedback, setFeedback] = useState([]);
  const [versions, setVersions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showVersionCompare, setShowVersionCompare] = useState(false);
  const [compareVersions, setCompareVersions] = useState(null);
  const [showUploadNew, setShowUploadNew] = useState(false);
  const [activeTab, setActiveTab] = useState('details');

  useEffect(() => {
    if (id) {
      fetchData();
    } else {
      setError('No deliverable ID provided');
      setLoading(false);
    }
  }, [id]);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    console.log(' Starting to fetch data for deliverable:', id);

    try {
      console.log(' Making API calls...');
      
      const [deliverableRes, feedbackRes, versionsRes] = await Promise.all([
        fetchDeliverableById(id),
        fetchFeedback(id),
        getDeliverableVersions(id)
      ]);

      console.log('All API calls completed');

      setDeliverable(deliverableRes.deliverable);
      setFeedback(feedbackRes.feedback || []);
      setVersions(versionsRes.versions || []);
      
      console.log(' State updated successfully');
    } catch (err) {
      console.error(' Error fetching data:', err);
      setError(err.error || 'Failed to load deliverable');
    } finally {
      setLoading(false);
      console.log('Finished loading');
    }
  };

  const handleApprove = async () => {
    if (!window.confirm('Are you sure you want to approve this deliverable?')) return;

    try {
      const response = await approveDeliverable(id);
      setDeliverable(response.deliverable);
      alert('Deliverable approved successfully!');
      fetchData();
    } catch (err) {
      alert(err.error || 'Failed to approve deliverable');
    }
  };

  const handleVersionCompare = (v1, v2) => {
    setCompareVersions({ version1: v1, version2: v2 });
    setShowVersionCompare(true);
  };

  const closeVersionCompare = () => {
    setShowVersionCompare(false);
    setCompareVersions(null);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatFileSize = (bytes) => {
    if (!bytes) return 'N/A';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  // UI Components
  const Card = ({ children, className = "" }) => (
    <div className={`bg-white rounded-lg border border-[#D1D5DB] ${className}`}>
      {children}
    </div>
  );

  const Button = ({ variant = "outline", size = "default", children, className = "", onClick, ...props }) => {
    const baseClasses = "flex items-center justify-center gap-2 font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#1E3A8A]";
    
    const variants = {
      default: "bg-[#1E3A8A] text-white hover:bg-[#1E3A8A]/90",
      success: "bg-[#10B981] text-white hover:bg-[#10B981]/90 focus:ring-[#10B981]",
      outline: "border border-[#D1D5DB] bg-white text-[#1F2937] hover:bg-[#F3F4F6]",
      ghost: "bg-transparent text-[#1F2937] hover:bg-[#F3F4F6]"
    };
    
    const sizes = {
      default: "px-4 py-2 text-sm rounded-lg",
      sm: "px-3 py-1.5 text-sm rounded-lg",
      icon: "w-10 h-10 rounded-lg"
    };

    return (
      <button className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`} onClick={onClick} {...props}>
        {children}
      </button>
    );
  };

  const Badge = ({ children, variant = "default", className = "" }) => {
    const variants = {
      default: "bg-[#1E3A8A] text-white",
      success: "bg-[#10B981] text-white",
      warning: "bg-[#F59E0B] text-white",
      error: "bg-[#EF4444] text-white",
      gray: "bg-[#6B7280] text-white"
    };

    return (
      <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${variants[variant]} ${className}`}>
        {children}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F3F4F6] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1E3A8A] mx-auto"></div>
          <p className="mt-4 text-[#4B5563]">Loading deliverable...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#F3F4F6] flex items-center justify-center">
        <Card className="p-8 text-center max-w-md">
          <p className="text-[#EF4444] mb-4">{error}</p>
          <Button variant="default" onClick={() => navigate(-1)}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Go Back
          </Button>
        </Card>
      </div>
    );
  }

  if (!deliverable) return null;

  const canApprove = user?.role === 'client' || user?.role === 'admin';
  const canUploadNew = user?.role === 'freelancer';

  return (
    <div className="min-h-screen bg-[#F3F4F6]">
      {/* Header */}
      <header className="bg-white border-b border-[#D1D5DB] sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-xl text-[#1F2937] font-semibold">{deliverable.title}</h1>
              <p className="text-sm text-[#4B5563]">Version {deliverable.version_number}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <Badge 
              variant={
                deliverable.status === 'approved' ? 'success'
                  : deliverable.status === 'rejected' ? 'error'
                  : deliverable.status === 'revision_requested' ? 'warning'
                  : 'gray'
              }
            >
              {deliverable.status.replace('_', ' ').toUpperCase()}
            </Badge>

            {canApprove && deliverable.status !== 'approved' && (
              <Button variant="success" onClick={handleApprove}>
                <CheckCircle className="w-4 h-4 mr-2" />
                Approve
              </Button>
            )}
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto p-6">
        {/* Tabs */}
        <Card className="p-4 mb-6 border-[#D1D5DB]">
          <div className="flex space-x-8">
            {['details', 'feedback', 'versions'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab
                    ? 'border-[#1E3A8A] text-[#1E3A8A]'
                    : 'border-transparent text-[#4B5563] hover:text-[#1F2937]'
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>
        </Card>

        <div className="grid lg:grid-cols-4 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-3 space-y-6">
            {activeTab === 'details' && (
              <>
                {/* File Preview */}
                <Card className="p-6">
                  <h2 className="text-lg font-semibold text-[#1F2937] mb-4">Preview</h2>
                  {deliverable.file_type === 'image' ? (
                    <div className="bg-[#F3F4F6] rounded-lg overflow-hidden flex items-center justify-center min-h-[400px]">
                      <img
                        src={deliverable.file_url}
                        alt={deliverable.title}
                        className="max-w-full max-h-[400px] object-contain rounded-lg"
                      />
                    </div>
                  ) : deliverable.file_type === 'video' ? (
                    <div className="bg-[#F3F4F6] rounded-lg overflow-hidden">
                      <video controls className="w-full rounded-lg">
                        <source src={deliverable.file_url} type="video/mp4" />
                      </video>
                    </div>
                  ) : (
                    <div className="bg-[#F3F4F6] rounded-lg p-12 text-center">
                      <FileText className="w-16 h-16 text-[#4B5563] mx-auto mb-4" />
                      <p className="text-[#4B5563] mb-4">Preview not available</p>
                      <Button variant="default" onClick={() => window.open(deliverable.file_url, '_blank')}>
                        <Download className="w-4 h-4 mr-2" />
                        Download File
                      </Button>
                    </div>
                  )}
                </Card>

                {/* Upload New Version */}
                {canUploadNew && (
                  <Card className="p-6">
                    <Button
                      variant="default"
                      onClick={() => setShowUploadNew(!showUploadNew)}
                      className="w-full"
                    >
                      <RefreshCw className="w-4 h-4 mr-2" />
                      Upload New Version
                    </Button>
                    {showUploadNew && (
                      <div className="mt-4">
                        <CloudinaryUpload
                          projectId={deliverable.project_id}
                          onUploadSuccess={() => {
                            setShowUploadNew(false);
                            fetchData();
                          }}
                        />
                      </div>
                    )}
                  </Card>
                )}
              </>
            )}

            {activeTab === 'feedback' && (
              <div className="space-y-6">
                {/* Feedback Form */}
                {canApprove && (
                  <FeedbackForm
                    deliverableId={deliverable.id}
                    onSuccess={() => fetchData()}
                  />
                )}

                {/* Feedback List */}
                <Card className="p-6">
                  <h2 className="text-lg font-semibold text-[#1F2937] mb-4">
                    Feedback ({feedback.length})
                  </h2>
                  {feedback.length > 0 ? (
                    <div className="space-y-4">
                      {feedback.map((fb) => (
                        <div key={fb.id} className="border-b border-[#D1D5DB] pb-4 last:border-0">
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <p className="font-medium text-[#1F2937]">
                                {fb.author?.first_name} {fb.author?.last_name}
                              </p>
                              <p className="text-xs text-[#4B5563]">{formatDate(fb.created_at)}</p>
                            </div>
                            <Badge 
                              variant={
                                fb.priority === 'high' ? 'error'
                                  : fb.priority === 'medium' ? 'warning'
                                  : 'default'
                              }
                            >
                              {fb.priority}
                            </Badge>
                          </div>
                          <p className="text-[#4B5563]">{fb.content}</p>
                          {fb.is_resolved && (
                            <div className="flex items-center gap-1 text-[#10B981] text-sm mt-2">
                              <CheckCircle className="w-4 h-4" />
                              Resolved
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-[#4B5563] text-center py-8">No feedback yet</p>
                  )}
                </Card>
              </div>
            )}

            {activeTab === 'versions' && (
              <Card className="p-6">
                <h2 className="text-lg font-semibold text-[#1F2937] mb-4">
                  Version History ({versions.length})
                </h2>
                <div className="space-y-3">
                  {versions.map((v) => (
                    <div
                      key={v.id}
                      className={`p-4 rounded-lg border cursor-pointer transition-colors ${
                        v.id === deliverable.id
                          ? 'border-[#1E3A8A] bg-[#1E3A8A]/10'
                          : 'border-[#D1D5DB] hover:border-[#1E3A8A] hover:bg-[#1E3A8A]/5'
                      }`}
                      onClick={() => handleVersionCompare(deliverable, v)}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-[#1F2937]">Version {v.version_number}</p>
                          <p className="text-sm text-[#4B5563]">{formatDate(v.uploaded_at)}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge 
                            variant={
                              v.status === 'approved' ? 'success'
                                : v.status === 'rejected' ? 'error'
                                : v.status === 'revision_requested' ? 'warning'
                                : 'gray'
                            }
                          >
                            {v.status}
                          </Badge>
                          <History className="w-4 h-4 text-[#4B5563]" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Metadata */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-[#1F2937] mb-4">Details</h3>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <User className="w-4 h-4 text-[#4B5563]" />
                  <div>
                    <p className="text-sm text-[#4B5563]">Uploaded By</p>
                    <p className="font-medium text-[#1F2937]">
                      {deliverable.uploader?.first_name} {deliverable.uploader?.last_name}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Calendar className="w-4 h-4 text-[#4B5563]" />
                  <div>
                    <p className="text-sm text-[#4B5563]">Upload Date</p>
                    <p className="font-medium text-[#1F2937]">{formatDate(deliverable.uploaded_at)}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <FileText className="w-4 h-4 text-[#4B5563]" />
                  <div>
                    <p className="text-sm text-[#4B5563]">File Size</p>
                    <p className="font-medium text-[#1F2937]">{formatFileSize(deliverable.file_size)}</p>
                  </div>
                </div>

                <div>
                  <p className="text-sm text-[#4B5563] mb-1">File Type</p>
                  <Badge variant="default" className="bg-[#6B7280]">
                    {deliverable.file_type}
                  </Badge>
                </div>

                {deliverable.change_notes && (
                  <div>
                    <p className="text-sm text-[#4B5563] mb-2">Change Notes</p>
                    <p className="text-sm text-[#1F2937] bg-[#F3F4F6] rounded-lg p-3">
                      {deliverable.change_notes}
                    </p>
                  </div>
                )}
              </div>

              <Button 
                variant="default"
                className="w-full mt-6"
                onClick={() => window.open(deliverable.file_url, '_blank')}
              >
                <Download className="w-4 h-4 mr-2" />
                Download File
              </Button>
            </Card>

            {/* Quick Actions */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-[#1F2937] mb-4">Quick Actions</h3>
              <div className="space-y-2">
                <Button 
                  variant="outline" 
                  className="w-full justify-start border-[#D1D5DB]"
                  onClick={() => setActiveTab('versions')}
                >
                  <History className="w-4 h-4 mr-2" />
                  Compare Versions
                </Button>
                {canApprove && (
                  <Button 
                    variant="outline" 
                    className="w-full justify-start border-[#D1D5DB]"
                    onClick={() => setActiveTab('feedback')}
                  >
                    <FileText className="w-4 h-4 mr-2" />
                    Add Feedback
                  </Button>
                )}
              </div>
            </Card>
          </div>
        </div>

        {/* Version Compare Modal */}
        {showVersionCompare && compareVersions && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            onClick={(e) => {
              // Close modal when clicking the backdrop
              if (e.target === e.currentTarget) {
                closeVersionCompare();
              }
            }}
          >
            <div className="bg-white rounded-lg max-w-6xl w-full max-h-[90vh] overflow-hidden flex flex-col">
              {/* Modal Header with Close Button */}
              <div className="flex items-center justify-between p-4 border-b border-[#D1D5DB]">
                <h2 className="text-xl font-semibold text-[#1F2937]">Compare Versions</h2>
                <button
                  onClick={closeVersionCompare}
                  className="p-2 hover:bg-[#F3F4F6] rounded-lg transition-colors"
                  aria-label="Close"
                >
                  <X className="w-5 h-5 text-[#4B5563]" />
                </button>
              </div>
              
              {/* Modal Content */}
              <div className="overflow-y-auto flex-1">
                <VersionCompare
                  version1={compareVersions.version1}
                  version2={compareVersions.version2}
                  onClose={closeVersionCompare}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DeliverableDetail;