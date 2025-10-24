import React, { useState } from 'react';
import { 
  Download, 
  Calendar, 
  FileText, 
  GitCompare, 
  ArrowLeft, 
  CheckCircle2,
  ZoomIn, 
  ZoomOut, 
  ArrowRight,
  Maximize2
} from 'lucide-react';

const VersionCompare = ({ versions = [], currentVersion, onBack }) => {
  const [selectedVersions, setSelectedVersions] = useState({
    left: versions[0],
    right: versions[versions.length - 1]
  });

  const [comparisonMode, setComparisonMode] = useState('side-by-side');
  const [zoom, setZoom] = useState(100);
  const [sliderPosition, setSliderPosition] = useState(50);

  // Mock data with food images
  const mockVersions = [
    {
      id: "3",
      version: "3",
      name: "Restaurant Menu V3",
      createdAt: "2025-04-20T14:30:00Z",
      uploadedBy: "Emma Johnson",
      status: "pending-review",
      thumbnailUrl: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800&auto=format&fit=crop",
      fileUrl: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800&auto=format&fit=crop",
      fileType: "image",
      changes: ["Updated color palette to warmer tones", "Added seasonal specials section", "Improved dish photography"],
    },
    {
      id: "2", 
      version: "2",
      name: "Restaurant Menu V2",
      createdAt: "2025-04-18T16:15:00Z",
      uploadedBy: "Emma Johnson",
      status: "revision-requested",
      thumbnailUrl: "https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=800&auto=format&fit=crop",
      fileUrl: "https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=800&auto=format&fit=crop",
      fileType: "image",
      changes: ["Reorganized menu categories", "Updated pricing structure", "Added vegan options"],
    },
    {
      id: "1",
      version: "1",
      name: "Restaurant Menu V1", 
      createdAt: "2025-04-15T10:00:00Z",
      uploadedBy: "Emma Johnson",
      status: "revision-requested",
      thumbnailUrl: "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=800&auto=format&fit=crop",
      fileUrl: "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=800&auto=format&fit=crop",
      fileType: "image",
      changes: ["Initial menu layout", "Basic food categories", "Standard pricing"],
    },
  ];

  const displayVersions = versions.length > 0 ? versions : mockVersions;
  const leftVersionData = displayVersions.find(v => v.id === selectedVersions.left?.id) || displayVersions[0];
  const rightVersionData = displayVersions.find(v => v.id === selectedVersions.right?.id) || displayVersions[1];

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

  // FIXED: Simplified Select component
  const Select = ({ value, onValueChange, children, className = "" }) => {
    return (
      <select
        value={value}
        onChange={(e) => onValueChange(e.target.value)}
        className={`border border-[#D1D5DB] rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1E3A8A] focus:border-[#1E3A8A] ${className}`}
      >
        {children}
      </select>
    );
  };

  const Slider = ({ value, onValueChange, min, max, step, className = "" }) => {
    return (
      <input
        type="range"
        value={value[0]}
        onChange={(e) => onValueChange([parseInt(e.target.value)])}
        min={min}
        max={max}
        step={step}
        className={`w-full h-2 bg-[#D1D5DB] rounded-lg appearance-none cursor-pointer ${className}`}
        style={{
          background: `linear-gradient(to right, #1E3A8A 0%, #1E3A8A ${((value[0] - min) / (max - min)) * 100}%, #D1D5DB ${((value[0] - min) / (max - min)) * 100}%, #D1D5DB 100%)`
        }}
      />
    );
  };

  const ImageWithFallback = ({ src, alt, className = "" }) => {
    return (
      <img
        src={src}
        alt={alt}
        className={`rounded-lg ${className}`}
        onError={(e) => {
          e.target.src = "https://via.placeholder.com/800x600/F3F4F6/4B5563?text=Image+Not+Found";
        }}
      />
    );
  };

  const Badge = ({ children, className = "" }) => (
    <span className={`bg-[#1E3A8A] text-white text-xs px-2 py-1 rounded-full font-semibold ${className}`}>
      {children}
    </span>
  );

  const formatDate = (dateString) => {
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
  };

  return (
    <div className="min-h-screen bg-[#F3F4F6]">
      {/* Header */}
      <header className="bg-white border-b border-[#D1D5DB] sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={onBack}>
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div className="flex items-center gap-2">
              <GitCompare className="w-5 h-5 text-[#1E3A8A]" />
              <h1 className="text-xl text-[#1F2937] font-semibold">
                Version Comparison
              </h1>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-3 py-2 bg-[#F3F4F6] rounded-lg">
              <ZoomOut className="w-4 h-4 text-[#4B5563]" />
              <Slider
                value={[zoom]}
                onValueChange={(value) => setZoom(value[0])}
                min={50}
                max={200}
                step={10}
                className="w-32"
              />
              <ZoomIn className="w-4 h-4 text-[#4B5563]" />
              <span className="text-sm text-[#4B5563] ml-2 w-12">{zoom}%</span>
            </div>
            <Button variant="outline" size="icon" className="border-[#D1D5DB]">
              <Maximize2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto p-6">
        {/* Comparison Mode Selector */}
        <Card className="p-4 mb-6 border-[#D1D5DB]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <span className="text-sm text-[#4B5563] font-semibold">
                Comparison Mode:
              </span>
              <div className="flex gap-2">
                <Button
                  variant={comparisonMode === "side-by-side" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setComparisonMode("side-by-side")}
                  className={comparisonMode === "side-by-side" ? "bg-[#1E3A8A] text-white" : "border-[#D1D5DB]"}
                >
                  Side by Side
                </Button>
                <Button
                  variant={comparisonMode === "slider" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setComparisonMode("slider")}
                  className={comparisonMode === "slider" ? "bg-[#1E3A8A] text-white" : "border-[#D1D5DB]"}
                >
                  Slider
                </Button>
                <Button
                  variant={comparisonMode === "overlay" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setComparisonMode("overlay")}
                  className={comparisonMode === "overlay" ? "bg-[#1E3A8A] text-white" : "border-[#D1D5DB]"}
                >
                  Overlay
                </Button>
              </div>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" className="border-[#D1D5DB] gap-2">
                <Download className="w-4 h-4" />
                Export Comparison
              </Button>
            </div>
          </div>
        </Card>

        <div className="grid lg:grid-cols-5 gap-6">
          {/* Main Comparison Area */}
          <div className="lg:col-span-4">
            {comparisonMode === "side-by-side" && (
              <div className="grid md:grid-cols-2 gap-6">
                {/* Left Version */}
                <Card className="p-6 border-[#D1D5DB]">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-[#1F2937] mb-1 font-semibold">
                        Version {leftVersionData?.version}
                      </h3>
                      <p className="text-sm text-[#4B5563]">{formatDate(leftVersionData?.createdAt)}</p>
                    </div>
                    {/* FIXED: Simplified Select usage */}
                    <Select 
                      value={leftVersionData?.id} 
                      onValueChange={(value) => setSelectedVersions(prev => ({ ...prev, left: displayVersions.find(v => v.id === value) }))}
                      className="w-32"
                    >
                      {displayVersions.map((v) => (
                        <option key={v.id} value={v.id} disabled={v.id === selectedVersions.right?.id}>
                          Version {v.version}
                        </option>
                      ))}
                    </Select>
                  </div>
                  <div className="bg-[#F3F4F6] rounded-lg overflow-hidden mb-4 flex items-center justify-center min-h-[400px]">
                    <div style={{ transform: `scale(${zoom / 100})`, transformOrigin: "center" }}>
                      <ImageWithFallback
                        src={leftVersionData?.thumbnailUrl}
                        alt={leftVersionData?.name}
                        className="rounded-lg"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <h4 className="text-sm text-[#1F2937] font-semibold">Changes:</h4>
                    <ul className="space-y-1">
                      {leftVersionData?.changes?.map((change, index) => (
                        <li key={index} className="flex items-start gap-2 text-sm text-[#4B5563]">
                          <CheckCircle2 className="w-4 h-4 text-[#10B981] mt-0.5 flex-shrink-0" />
                          {change}
                        </li>
                      ))}
                    </ul>
                  </div>
                </Card>

                {/* Right Version */}
                <Card className="p-6 border-[#D1D5DB]">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-[#1F2937] mb-1 font-semibold">
                        Version {rightVersionData?.version}
                      </h3>
                      <p className="text-sm text-[#4B5563]">{formatDate(rightVersionData?.createdAt)}</p>
                    </div>
                    {/* FIXED: Simplified Select usage */}
                    <Select 
                      value={rightVersionData?.id} 
                      onValueChange={(value) => setSelectedVersions(prev => ({ ...prev, right: displayVersions.find(v => v.id === value) }))}
                      className="w-32"
                    >
                      {displayVersions.map((v) => (
                        <option key={v.id} value={v.id} disabled={v.id === selectedVersions.left?.id}>
                          Version {v.version}
                        </option>
                      ))}
                    </Select>
                  </div>
                  <div className="bg-[#F3F4F6] rounded-lg overflow-hidden mb-4 flex items-center justify-center min-h-[400px]">
                    <div style={{ transform: `scale(${zoom / 100})`, transformOrigin: "center" }}>
                      <ImageWithFallback
                        src={rightVersionData?.thumbnailUrl}
                        alt={rightVersionData?.name}
                        className="rounded-lg"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <h4 className="text-sm text-[#1F2937] font-semibold">Changes:</h4>
                    <ul className="space-y-1">
                      {rightVersionData?.changes?.map((change, index) => (
                        <li key={index} className="flex items-start gap-2 text-sm text-[#4B5563]">
                          <CheckCircle2 className="w-4 h-4 text-[#10B981] mt-0.5 flex-shrink-0" />
                          {change}
                        </li>
                      ))}
                    </ul>
                  </div>
                </Card>
              </div>
            )}

            {/* Other comparison modes remain the same but use the fixed Select component */}
            {/* ... rest of the component ... */}
          </div>

          {/* Version History Sidebar */}
          <div className="lg:col-span-1">
            <Card className="p-4 border-[#D1D5DB]">
              <h3 className="text-[#1F2937] mb-4 font-semibold">Version History</h3>
              <div className="space-y-3">
                {displayVersions.map((version) => (
                  <div
                    key={version.id}
                    className={`p-3 rounded-lg cursor-pointer transition-colors ${
                      version.id === selectedVersions.left?.id || version.id === selectedVersions.right?.id
                        ? "bg-[#1E3A8A]/10 border-2 border-[#1E3A8A]"
                        : "bg-[#F3F4F6] hover:bg-[#F3F4F6]/70"
                    }`}
                    onClick={() => {
                      if (version.id !== selectedVersions.left?.id && version.id !== selectedVersions.right?.id) {
                        setSelectedVersions(prev => ({ ...prev, right: version }));
                      }
                    }}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <Badge className="bg-[#1E3A8A] text-white text-xs">
                        V{version.version}
                      </Badge>
                      {(version.id === selectedVersions.left?.id || version.id === selectedVersions.right?.id) && (
                        <CheckCircle2 className="w-4 h-4 text-[#1E3A8A]" />
                      )}
                    </div>
                    <div className="w-full h-16 bg-white rounded overflow-hidden mb-2">
                      <ImageWithFallback
                        src={version.thumbnailUrl}
                        alt={version.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <p className="text-xs text-[#4B5563]">{formatDate(version.createdAt)}</p>
                  </div>
                ))}
              </div>
            </Card>

            <Card className="p-4 border-[#D1D5DB] mt-4">
              <h3 className="text-[#1F2937] mb-3 font-semibold">Differences</h3>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <div className="w-3 h-3 bg-[#10B981] rounded-full" />
                  <span className="text-[#4B5563]">Color Changes</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <div className="w-3 h-3 bg-[#FF6B6B] rounded-full" />
                  <span className="text-[#4B5563]">Typography</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <div className="w-3 h-3 bg-[#F59E0B] rounded-full" />
                  <span className="text-[#4B5563]">Layout</span>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VersionCompare;