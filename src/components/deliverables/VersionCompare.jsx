import React, { useState, useEffect } from 'react';
import { 
  Download, Calendar, FileText, GitCompare, ArrowLeft, CheckCircle2,
  ZoomIn, ZoomOut, ArrowRight, Maximize2, Loader, Eye, FileDown,
  ChevronDown, ChevronUp, Image, Film, File, MessageSquare,
  ThumbsUp, RefreshCw, Share2, Settings, Info
} from 'lucide-react';

const VersionCompare = ({ projectId, projectTitle, userRole = 'freelancer', onBack }) => {
  const [versions, setVersions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedVersions, setSelectedVersions] = useState({ left: null, right: null });
  const [comparisonMode, setComparisonMode] = useState('side-by-side');
  const [zoom, setZoom] = useState(100);
  const [sliderPosition, setSliderPosition] = useState(50);
  const [showChanges, setShowChanges] = useState(true);
  const [fullscreen, setFullscreen] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [selectedFeedback, setSelectedFeedback] = useState(null);

  
  const mockVersions = [
    {
      id: "4",
      version: "4",
      name: "Final Restaurant Menu Design",
      createdAt: "2025-04-25T11:20:00Z",
      uploadedBy: "Alex Thompson",
      status: "submitted",
      thumbnailUrl: "https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=400&auto=format&fit=crop",
      fileUrl: "https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=800&auto=format&fit=crop",
      fileType: "image",
      fileSize: 2457600,
      changes: [
        "Final color adjustments completed",
        "Added seasonal specials section",
        "Optimized for print and digital",
        "Accessibility compliance achieved",
        "Final proofreading completed"
      ],
      feedback: [
        { 
          id: 1, 
          type: 'approval', 
          content: 'Colors look perfect now! The warm tones really make the food pop.', 
          author: 'Sarah Johnson', 
          role: 'client',
          createdAt: '2025-04-25T12:30:00Z',
          resolved: true
        },
        { 
          id: 2, 
          type: 'comment', 
          content: 'Ready for launch. Great work on the final touches!', 
          author: 'Mike Chen', 
          role: 'project_manager',
          createdAt: '2025-04-25T13:15:00Z',
          resolved: true
        }
      ],
      metadata: {
        dimensions: "2480x3508 pixels",
        colorProfile: "CMYK",
        resolution: "300 DPI"
      }
    },
    {
      id: "3",
      version: "3",
      name: "Revised Menu Design with Photography",
      createdAt: "2025-04-20T14:30:00Z",
      uploadedBy: "Alex Thompson",
      status: "approved",
      thumbnailUrl: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400&auto=format&fit=crop",
      fileUrl: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800&auto=format&fit=crop",
      fileType: "image",
      fileSize: 2048000,
      changes: [
        "Updated color palette to warmer tones",
        "Improved typography hierarchy",
        "Added high-quality food photography",
        "Reorganized menu sections",
        "Enhanced visual hierarchy"
      ],
      feedback: [
        { 
          id: 3, 
          type: 'revision', 
          content: 'Can we make the colors warmer? The current palette feels a bit cold for a restaurant setting.', 
          author: 'Sarah Johnson', 
          role: 'client',
          createdAt: '2025-04-20T16:45:00Z',
          resolved: true
        },
        { 
          id: 4, 
          type: 'comment', 
          content: 'Photography looks amazing! The food styling is perfect.', 
          author: 'Emily Rodriguez', 
          role: 'creative_director',
          createdAt: '2025-04-21T09:20:00Z',
          resolved: true
        }
      ],
      metadata: {
        dimensions: "2480x3508 pixels",
        colorProfile: "RGB",
        resolution: "300 DPI"
      }
    },
    {
      id: "2", 
      version: "2",
      name: "Menu Layout Draft with Pricing",
      createdAt: "2025-04-18T16:15:00Z",
      uploadedBy: "Alex Thompson",
      status: "revision-requested",
      thumbnailUrl: "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=400&auto=format&fit=crop",
      fileUrl: "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=800&auto=format&fit=crop",
      fileType: "image",
      fileSize: 1984500,
      changes: [
        "Reorganized menu categories",
        "Updated pricing structure",
        "Added vegan and gluten-free options",
        "Improved spacing and layout",
        "Enhanced readability"
      ],
      feedback: [
        { 
          id: 5, 
          type: 'revision', 
          content: 'Pricing needs adjustment in the dessert section. Some items seem too high compared to competitors.', 
          author: 'Sarah Johnson', 
          role: 'client',
          createdAt: '2025-04-18T17:30:00Z',
          resolved: true
        },
        { 
          id: 6, 
          type: 'revision', 
          content: 'Add more vegan options to the main courses section. Current selection is limited.', 
          author: 'Mike Chen', 
          role: 'project_manager',
          createdAt: '2025-04-19T10:15:00Z',
          resolved: true
        }
      ],
      metadata: {
        dimensions: "2480x3508 pixels",
        colorProfile: "RGB",
        resolution: "300 DPI"
      }
    },
    {
      id: "1",
      version: "1",
      name: "Initial Menu Concept Draft", 
      createdAt: "2025-04-15T10:00:00Z",
      uploadedBy: "Alex Thompson",
      status: "approved",
      thumbnailUrl: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&auto=format&fit=crop",
      fileUrl: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&auto=format&fit=crop",
      fileType: "image",
      fileSize: 1876300,
      changes: [
        "Initial menu layout and structure",
        "Basic food categories established",
        "Standard pricing framework",
        "Color scheme concepts",
        "Typography selection"
      ],
      feedback: [
        { 
          id: 7, 
          type: 'approval', 
          content: 'Great starting point! Love the modern approach to the layout.', 
          author: 'Sarah Johnson', 
          role: 'client',
          createdAt: '2025-04-15T14:20:00Z',
          resolved: true
        },
        { 
          id: 8, 
          type: 'comment', 
          content: 'Love the direction. The minimalist approach works well for upscale dining.', 
          author: 'Emily Rodriguez', 
          role: 'creative_director',
          createdAt: '2025-04-15T15:45:00Z',
          resolved: true
        }
      ],
      metadata: {
        dimensions: "2480x3508 pixels",
        colorProfile: "RGB",
        resolution: "300 DPI"
      }
    }
  ];

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        await new Promise(resolve => setTimeout(resolve, 1500));
        setVersions(mockVersions);
        
        if (mockVersions.length > 0) {
          setSelectedVersions({
            left: mockVersions[0],
            right: mockVersions[1] || mockVersions[0]
          });
        }
      } catch (error) {
        console.error('Failed to load versions:', error);
        setVersions(mockVersions);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [projectId]);

  // Helper functions remain the same...
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatFileSize = (bytes) => {
    if (!bytes) return '0 KB';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileIcon = (fileType) => {
    switch (fileType) {
      case 'image': return <Image className="w-4 h-4" />;
      case 'video': return <Film className="w-4 h-4" />;
      default: return <File className="w-4 h-4" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'approved': return 'text-green-600 bg-green-50';
      case 'submitted': return 'text-blue-600 bg-blue-50';
      case 'revision-requested': return 'text-orange-600 bg-orange-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getFeedbackColor = (type) => {
    switch (type) {
      case 'approval': return 'bg-green-50 text-green-700 border-green-200';
      case 'revision': return 'bg-orange-50 text-orange-700 border-orange-200';
      case 'comment': return 'bg-blue-50 text-blue-700 border-blue-200';
      default: return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  const handleDownload = (version) => {
    console.log('Downloading version:', version.version);
  };

  const handleFullscreen = () => {
    setFullscreen(!fullscreen);
  };

  const handleShare = () => {
    console.log('Sharing comparison');
  };

  // Simplified UI Components
  const Card = ({ children, className = "" }) => (
    <div className={`bg-white rounded-lg border ${className}`}>
      {children}
    </div>
  );

  const Button = ({ variant = "outline", size = "default", children, className = "", ...props }) => {
    const baseClasses = "flex items-center justify-center gap-2 font-medium transition-colors focus:outline-none rounded-lg disabled:opacity-50 disabled:cursor-not-allowed";
    
    const variants = {
      default: "bg-blue-600 text-white hover:bg-blue-700",
      outline: "border border-gray-300 bg-white text-gray-700 hover:bg-gray-50",
      ghost: "bg-transparent text-gray-700 hover:bg-gray-100"
    };
    
    const sizes = {
      default: "px-4 py-2 text-sm",
      sm: "px-3 py-1.5 text-xs",
      icon: "w-10 h-10"
    };

    return (
      <button className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`} {...props}>
        {children}
      </button>
    );
  };

  const Badge = ({ children, color = "gray", className = "" }) => (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-${color}-50 text-${color}-700 ${className}`}>
      {children}
    </span>
  );

  const Select = ({ value, onChange, children, className = "" }) => (
    <select
      value={value}
      onChange={onChange}
      className={`border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-blue-500 bg-white ${className}`}
    >
      {children}
    </select>
  );

  const Slider = ({ value, onChange, min, max, step, className = "" }) => (
    <input
      type="range"
      value={value}
      onChange={(e) => onChange(parseInt(e.target.value))}
      min={min}
      max={max}
      step={step}
      className={`w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer ${className}`}
    />
  );

  const ImageWithFallback = ({ src, alt, className = "" }) => (
    <img
      src={src}
      alt={alt}
      className={`rounded ${className}`}
      onError={(e) => {
        e.target.src = "https://via.placeholder.com/800x600/f3f4f6/4b5563?text=Image+Not+Found";
      }}
    />
  );

  const FeedbackCard = ({ feedback }) => (
    <div className={`p-3 rounded border ${getFeedbackColor(feedback.type)}`}>
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center gap-2">
          <span className="font-medium text-sm">{feedback.author}</span>
          <Badge color={feedback.type === 'approval' ? 'green' : feedback.type === 'revision' ? 'orange' : 'blue'}>
            {feedback.type}
          </Badge>
        </div>
        <span className="text-xs opacity-70">{formatDate(feedback.createdAt)}</span>
      </div>
      <p className="text-sm">{feedback.content}</p>
      {feedback.resolved && (
        <div className="flex items-center gap-1 mt-2 text-xs text-green-600">
          <CheckCircle2 className="w-3 h-3" />
          Resolved
        </div>
      )}
    </div>
  );

  const VersionCard = ({ version, isSelected, onSelect, position }) => (
    <Card className={`p-4 ${isSelected ? 'border-blue-500' : ''}`}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Badge color="blue">v{version.version}</Badge>
          <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(version.status)}`}>
            {version.status.replace('-', ' ')}
          </span>
        </div>
        <Select
          value={version.id}
          onChange={(e) => onSelect(versions.find(v => v.id === e.target.value))}
          className="w-32"
        >
          {versions.map((v) => (
            <option 
              key={v.id} 
              value={v.id}
              disabled={v.id === (position === 'left' ? selectedVersions.right?.id : selectedVersions.left?.id)}
            >
              Version {v.version}
            </option>
          ))}
        </Select>
      </div>

      <div className="space-y-2 mb-3">
        <div className="flex items-center justify-between text-sm text-gray-600">
          <span>{formatDate(version.createdAt)}</span>
          <span className="flex items-center gap-1">
            {getFileIcon(version.fileType)}
            {formatFileSize(version.fileSize)}
          </span>
        </div>
        <p className="text-sm font-medium">{version.name}</p>
        <p className="text-xs text-gray-500">By {version.uploadedBy}</p>
      </div>

      {/* Image Preview */}
      <div className="bg-gray-50 rounded mb-3 flex items-center justify-center min-h-[200px]">
        <div style={{ transform: `scale(${zoom / 100})`, transformOrigin: "center" }}>
          <ImageWithFallback
            src={version.thumbnailUrl}
            alt={version.name}
            className="max-w-full max-h-64 object-contain"
          />
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-2 mb-3">
        <Button variant="outline" size="sm" className="flex-1">
          <Eye className="w-4 h-4" />
          View
        </Button>
        <Button 
          variant="outline" 
          size="sm" 
          className="flex-1"
          onClick={() => handleDownload(version)}
        >
          <FileDown className="w-4 h-4" />
          Download
        </Button>
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => {
            setSelectedFeedback(version);
            setShowFeedback(true);
          }}
        >
          <MessageSquare className="w-4 h-4" />
        </Button>
      </div>

      {/* File Metadata */}
      <div className="text-xs text-gray-500 space-y-1 mb-3">
        <div className="flex justify-between">
          <span>Dimensions:</span>
          <span>{version.metadata.dimensions}</span>
        </div>
        <div className="flex justify-between">
          <span>Color Profile:</span>
          <span>{version.metadata.colorProfile}</span>
        </div>
        <div className="flex justify-between">
          <span>Resolution:</span>
          <span>{version.metadata.resolution}</span>
        </div>
      </div>

      {/* Changes */}
      {showChanges && (
        <div className="mt-3 pt-3 border-t">
          <h4 className="text-sm font-semibold mb-2">Changes in this version:</h4>
          <ul className="space-y-1">
            {version.changes.map((change, index) => (
              <li key={index} className="flex items-start gap-2 text-sm text-gray-600">
                <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                {change}
              </li>
            ))}
          </ul>
        </div>
      )}
    </Card>
  );

  const LoadingState = () => (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <Loader className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-600" />
        <p className="text-gray-600">Loading version history...</p>
      </div>
    </div>
  );

  if (loading) return <LoadingState />;

  const leftVersion = selectedVersions.left || versions[0];
  const rightVersion = selectedVersions.right || versions[1];

  return (
    <div className={`min-h-screen bg-gray-50 ${fullscreen ? 'fixed inset-0 z-50' : ''}`}>
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={onBack}>
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div className="flex items-center gap-2">
              <GitCompare className="w-5 h-5 text-blue-600" />
              <div>
                <h1 className="text-xl font-semibold">
                  Version Comparison
                </h1>
                <p className="text-sm text-gray-600">{projectTitle}</p>
              </div>
            </div>
            <Badge color="gray">
              {userRole === 'freelancer' ? 'Freelancer View' : 'Client View'}
            </Badge>
          </div>

          <div className="flex items-center gap-4">
            {/* Zoom Controls */}
            <div className="flex items-center gap-2 px-3 py-2 bg-gray-100 rounded">
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => setZoom(Math.max(50, zoom - 10))}
                disabled={zoom <= 50}
              >
                <ZoomOut className="w-4 h-4" />
              </Button>
              <Slider
                value={zoom}
                onChange={setZoom}
                min={50}
                max={200}
                step={10}
                className="w-32"
              />
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => setZoom(Math.min(200, zoom + 10))}
                disabled={zoom >= 200}
              >
                <ZoomIn className="w-4 h-4" />
              </Button>
              <span className="text-sm text-gray-600 w-12">{zoom}%</span>
            </div>

            <Button variant="outline" onClick={handleShare}>
              <Share2 className="w-4 h-4" />
              Share
            </Button>
            <Button variant="outline" onClick={handleFullscreen}>
              <Maximize2 className="w-4 h-4" />
              {fullscreen ? 'Exit' : 'Fullscreen'}
            </Button>
            <Button>
              <Download className="w-4 h-4" />
              Export
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto p-6">
        {/* Controls */}
        <Card className="p-4 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              {/* Comparison Mode */}
              <div className="flex items-center gap-3">
                <span className="text-sm font-medium">Mode:</span>
                <div className="flex gap-1">
                  {['side-by-side', 'slider', 'overlay'].map((mode) => (
                    <Button
                      key={mode}
                      variant={comparisonMode === mode ? "default" : "outline"}
                      size="sm"
                      onClick={() => setComparisonMode(mode)}
                    >
                      {mode.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Changes Toggle */}
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowChanges(!showChanges)}
              >
                {showChanges ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                Changes {showChanges ? 'Hide' : 'Show'}
              </Button>
            </div>

            {/* File Info */}
            <div className="flex items-center gap-4 text-sm text-gray-600">
              <span>{versions.length} versions</span>
              <span>•</span>
              <span>Last updated {formatDate(versions[0]?.createdAt)}</span>
            </div>
          </div>
        </Card>

        {/* Main Content */}
        <div className="grid lg:grid-cols-5 gap-6">
          {/* Comparison Area */}
          <div className="lg:col-span-4">
            {comparisonMode === 'side-by-side' && (
              <div className="grid md:grid-cols-2 gap-6">
                <VersionCard
                  version={leftVersion}
                  isSelected={true}
                  onSelect={(version) => setSelectedVersions(prev => ({ ...prev, left: version }))}
                  position="left"
                />
                <VersionCard
                  version={rightVersion}
                  isSelected={true}
                  onSelect={(version) => setSelectedVersions(prev => ({ ...prev, right: version }))}
                  position="right"
                />
              </div>
            )}

            {/* Slider and Overlay modes remain similar but simplified */}
            {comparisonMode === 'slider' && (
              <Card className="p-4">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-4">
                    <div className="text-center">
                      <Badge color="blue">v{leftVersion.version}</Badge>
                      <p className="text-xs text-gray-600 mt-1">{formatDate(leftVersion.createdAt)}</p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-gray-400" />
                    <div className="text-center">
                      <Badge color="green">v{rightVersion.version}</Badge>
                      <p className="text-xs text-gray-600 mt-1">{formatDate(rightVersion.createdAt)}</p>
                    </div>
                  </div>
                </div>

                <div className="relative bg-gray-100 rounded overflow-hidden" style={{ minHeight: '400px' }}>
                  {/* Simplified slider implementation */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div style={{ transform: `scale(${zoom / 100})`, transformOrigin: "center" }}>
                      <div className="relative">
                        <ImageWithFallback
                          src={leftVersion.thumbnailUrl}
                          alt={leftVersion.name}
                          className="rounded"
                        />
                        <div
                          className="absolute top-0 right-0 bottom-0 overflow-hidden"
                          style={{ left: `${sliderPosition}%` }}
                        >
                          <ImageWithFallback
                            src={rightVersion.thumbnailUrl}
                            alt={rightVersion.name}
                            className="rounded"
                          />
                        </div>
                        <div
                          className="absolute top-0 bottom-0 w-1 bg-blue-600 cursor-ew-resize z-10"
                          style={{ left: `${sliderPosition}%` }}
                        >
                          <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 left-0 w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                            <ArrowRight className="w-4 h-4 text-white" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-4">
                  <Slider
                    value={sliderPosition}
                    onChange={setSliderPosition}
                    min={0}
                    max={100}
                    step={1}
                  />
                </div>
              </Card>
            )}

            {comparisonMode === 'overlay' && (
              <Card className="p-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold">Overlay Comparison</h3>
                  <div className="flex gap-2">
                    <Select
                      value={leftVersion.id}
                      onChange={(e) => setSelectedVersions(prev => ({ ...prev, left: versions.find(v => v.id === e.target.value) }))}
                    >
                      {versions.map((v) => (
                        <option key={v.id} value={v.id}>Version {v.version}</option>
                      ))}
                    </Select>
                    <Select
                      value={rightVersion.id}
                      onChange={(e) => setSelectedVersions(prev => ({ ...prev, right: versions.find(v => v.id === e.target.value) }))}
                    >
                      {versions.map((v) => (
                        <option key={v.id} value={v.id}>Version {v.version}</option>
                      ))}
                    </Select>
                  </div>
                </div>

                <div className="relative bg-gray-100 rounded overflow-hidden flex items-center justify-center min-h-[400px]">
                  <div style={{ transform: `scale(${zoom / 100})`, transformOrigin: "center" }}>
                    <div className="relative">
                      <ImageWithFallback
                        src={leftVersion.thumbnailUrl}
                        alt={leftVersion.name}
                        className="rounded"
                      />
                      <div 
                        className="absolute inset-0 opacity-50 transition-opacity"
                        style={{ opacity: sliderPosition / 100 }}
                      >
                        <ImageWithFallback
                          src={rightVersion.thumbnailUrl}
                          alt={rightVersion.name}
                          className="rounded"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-4">
                  <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
                    <span>Version {leftVersion.version}</span>
                    <span>Opacity: {sliderPosition}%</span>
                    <span>Version {rightVersion.version}</span>
                  </div>
                  <Slider
                    value={sliderPosition}
                    onChange={setSliderPosition}
                    min={0}
                    max={100}
                    step={1}
                  />
                </div>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Version History */}
            <Card className="p-4">
              <h3 className="font-semibold mb-3">Version History</h3>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {versions.map((version) => (
                  <div
                    key={version.id}
                    className={`p-3 rounded cursor-pointer transition-colors ${
                      version.id === selectedVersions.left?.id || version.id === selectedVersions.right?.id
                        ? 'bg-blue-50 border-2 border-blue-200'
                        : 'bg-gray-50 hover:bg-gray-100'
                    }`}
                    onClick={() => {
                      if (version.id !== selectedVersions.left?.id && version.id !== selectedVersions.right?.id) {
                        setSelectedVersions(prev => ({ ...prev, right: version }));
                      }
                    }}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <Badge color="blue">v{version.version}</Badge>
                      {(version.id === selectedVersions.left?.id || version.id === selectedVersions.right?.id) && (
                        <CheckCircle2 className="w-4 h-4 text-blue-600" />
                      )}
                    </div>
                    <div className="w-full h-16 bg-white rounded overflow-hidden mb-2">
                      <ImageWithFallback
                        src={version.thumbnailUrl}
                        alt={version.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <p className="text-xs text-gray-600">{formatDate(version.createdAt)}</p>
                    <p className="text-xs text-gray-500 mt-1 capitalize">{version.status.replace('-', ' ')}</p>
                  </div>
                ))}
              </div>
            </Card>

            {/* Quick Actions */}
            <Card className="p-4">
              <h3 className="font-semibold mb-3">Quick Actions</h3>
              <div className="space-y-2">
                <Button variant="outline" size="sm" className="w-full justify-start">
                  <FileText className="w-4 h-4" />
                  Generate Report
                </Button>
                <Button variant="outline" size="sm" className="w-full justify-start">
                  <Download className="w-4 h-4" />
                  Download All
                </Button>
                <Button variant="outline" size="sm" className="w-full justify-start" onClick={handleFullscreen}>
                  <Maximize2 className="w-4 h-4" />
                  {fullscreen ? 'Exit Full Screen' : 'Full Screen'}
                </Button>
                {userRole === 'client' && (
                  <Button variant="outline" size="sm" className="w-full justify-start">
                    <RefreshCw className="w-4 h-4" />
                    Request Revision
                  </Button>
                )}
                {userRole === 'client' && (
                  <Button size="sm" className="w-full justify-start">
                    <ThumbsUp className="w-4 h-4" />
                    Approve Version
                  </Button>
                )}
              </div>
            </Card>
          </div>
        </div>
      </div>

      {/* Feedback Modal */}
      {showFeedback && selectedFeedback && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <Card className="max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Feedback for Version {selectedFeedback.version}</h3>
                <Button variant="ghost" size="icon" onClick={() => setShowFeedback(false)}>
                  <ArrowLeft className="w-5 h-5" />
                </Button>
              </div>
              
              <div className="space-y-4">
                {selectedFeedback.feedback.map((feedback) => (
                  <FeedbackCard key={feedback.id} feedback={feedback} />
                ))}
              </div>

              <div className="mt-6 pt-4 border-t">
                <h4 className="font-semibold mb-3">Add New Feedback</h4>
                <div className="space-y-3">
                  <select className="w-full border border-gray-300 rounded px-3 py-2 text-sm">
                    <option value="comment">Comment</option>
                    <option value="revision">Revision Request</option>
                    <option value="approval">Approval</option>
                  </select>
                  <textarea 
                    className="w-full border border-gray-300 rounded px-3 py-2 text-sm h-24"
                    placeholder="Enter your feedback..."
                  />
                  <div className="flex gap-2">
                    <Button variant="outline" onClick={() => setShowFeedback(false)}>
                      Cancel
                    </Button>
                    <Button>
                      Submit Feedback
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};

export default VersionCompare;