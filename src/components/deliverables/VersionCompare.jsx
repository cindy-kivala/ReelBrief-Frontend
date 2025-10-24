/**
 * components/deliverables/VersionCompare.jsx
 * Owner: Cindy
 * Description: Compares two versions of a deliverable visually or textually.
 */

// TODO:
// - Render side-by-side comparison of deliverables
// - Highlight changes or updates
import React, { useState } from 'react';
import { Download, Calendar, FileText, GitCompare, ArrowLeft, CheckCircle2 } from 'lucide-react';

/**
 * Stage 1: Basic Version Comparison Layout
 * 
 * This stage establishes the foundation:
 * - Basic component structure matching Figma design
 * - Side-by-side comparison view
 * - Static version data display
 * - No interactivity yet (comparison modes, zoom, etc. coming in next updates)
 */

const VersionCompare = ({ versions = [], currentVersion, onBack }) => {
  // STATE WILL BE ADDED later
  const [selectedVersions, setSelectedVersions] = useState({
    left: versions[0],
    right: versions[versions.length - 1]
  });

  
  // Complete mock data with diverse food images for all versions
const mockVersions = [
  {
    id: "3",
    version: "3",
    name: "Restaurant Menu V3",
    createdAt: "2025-04-20T14:30:00Z",
    uploadedBy: "Emma Johnson",
    status: "pending-review",
    thumbnailUrl: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800&auto=format&fit=crop", // Pizza
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
    thumbnailUrl: "https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=800&auto=format&fit=crop", // Burger
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
    thumbnailUrl: "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=800&auto=format&fit=crop", // Pancakes
    fileUrl: "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=800&auto=format&fit=crop",
    fileType: "image",
    changes: ["Initial menu layout", "Basic food categories", "Standard pricing"],
  },
  {
    id: "4",
    version: "4",
    name: "Restaurant Menu V4",
    createdAt: "2025-04-22T09:45:00Z",
    uploadedBy: "Emma Johnson",
    status: "approved",
    thumbnailUrl: "https://images.unsplash.com/photo-1563379926898-05f4575a45d8?w=800&auto=format&fit=crop", // Pasta
    fileUrl: "https://images.unsplash.com/photo-1563379926898-05f4575a45d8?w=800&auto=format&fit=crop",
    fileType: "image",
    changes: ["Added dessert section", "Updated chef recommendations", "Enhanced food styling"],
  },
  {
    id: "5",
    version: "5",
    name: "Restaurant Menu V5",
    createdAt: "2025-04-25T11:20:00Z",
    uploadedBy: "Emma Johnson",
    status: "draft",
    thumbnailUrl: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800&auto=format&fit=crop", // Double Burger
    fileUrl: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800&auto=format&fit=crop",
    fileType: "image",
    changes: ["Complete menu redesign", "Added international cuisine", "Updated branding"],
  },
];

  const displayVersions = versions.length > 0 ? versions : mockVersions;
  const leftVersionData = displayVersions.find(v => v.id === selectedVersions.left?.id) || displayVersions[0];
  const rightVersionData = displayVersions.find(v => v.id === selectedVersions.right?.id) || displayVersions[1];

  // Basic UI components - will be enhanced in later updates
  const Card = ({ children, className = "" }) => (
    <div className={`bg-white rounded-lg border border-[#D1D5DB] ${className}`}>
      {children}
    </div>
  );

  const Button = ({ variant = "outline", size = "default", children, className = "", onClick }) => {
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
      <button className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`} onClick={onClick}>
        {children}
      </button>
    );
  };

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
      {/* Header - Basic version, zoom control needed */}
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
          {/* ZOOM CONTROLS2 */}
        </div>
      </header>

      <div className="max-w-7xl mx-auto p-6">
        {/* COMPARISON MODE SELECTOR 2 */}
        
        {/* Basic Side-by-Side Comparison - Only mode available currently*/}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Left Version Card */}
          <Card className="p-6 border-[#D1D5DB]">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-[#1F2937] mb-1 font-semibold">
                  Version {leftVersionData?.version}
                </h3>
                <p className="text-sm text-[#4B5563]">{formatDate(leftVersionData?.createdAt)}</p>
              </div>
              {/* VERSION SELECTOR DROPDOWN 2 */}
            </div>
            
            {/* Image Preview */}
            <div className="bg-[#F3F4F6] rounded-lg overflow-hidden mb-4 flex items-center justify-center min-h-[400px]">
              <img
                src={leftVersionData?.thumbnailUrl}
                alt={leftVersionData?.name}
                className="rounded-lg max-w-full max-h-[400px] object-contain"
              />
            </div>
            
            {/* Changes List */}
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

          {/* Right Version Card */}
          <Card className="p-6 border-[#D1D5DB]">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-[#1F2937] mb-1 font-semibold">
                  Version {rightVersionData?.version}
                </h3>
                <p className="text-sm text-[#4B5563]">{formatDate(rightVersionData?.createdAt)}</p>
              </div>
              {/* VERSION SELECTOR DROPDOWN WILL BE ADDED HERE 2*/}
            </div>
            
            {/* Image Preview */}
            <div className="bg-[#F3F4F6] rounded-lg overflow-hidden mb-4 flex items-center justify-center min-h-[400px]">
              <img
                src={rightVersionData?.thumbnailUrl}
                alt={rightVersionData?.name}
                className="rounded-lg max-w-full max-h-[400px] object-contain"
              />
            </div>
            
            {/* Changes List */}
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

        {/* ADD VERSION HISTORY SIDEBAR */}
      </div>
    </div>
  );
};

export default VersionCompare;