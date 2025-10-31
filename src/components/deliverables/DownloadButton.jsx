// components/deliverables/DownloadButton.jsx - FETCH VERSION
import { Download } from 'lucide-react';
import { useState } from 'react';

const DownloadButton = ({ deliverable }) => {
  const [loading, setLoading] = useState(false);

  const handleDownload = async () => {
    if (!deliverable?.file_url) {
      alert('No file available for download');
      return;
    }

    setLoading(true);
    
    try {
      console.log('Starting download for:', deliverable.file_url);
      
      // Method 1: Try direct Cloudinary download first
      let downloadUrl = deliverable.file_url;
      
      if (downloadUrl.includes('cloudinary.com')) {
        const url = new URL(downloadUrl);
        url.searchParams.set('fl_attachment', '');
        downloadUrl = url.toString();
      }
      
      // Method 2: Use fetch to download and create blob
      const response = await fetch(downloadUrl);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const blob = await response.blob();
      console.log('Blob size:', blob.size);
      
      // Create download link
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      
      // Set filename
      const filename = deliverable.title || 
        `deliverable-${deliverable.id}.${deliverable.file_type || 'file'}`;
      link.download = filename;
      
      // Trigger download
      document.body.appendChild(link);
      link.click();
      
      // Cleanup
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      console.log('Download completed successfully');
      
    } catch (error) {
      console.error('Download failed:', error);
      
      // Fallback: Open in new tab
      console.log('Trying fallback method...');
      window.open(deliverable.file_url, '_blank');
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleDownload}
      disabled={loading || !deliverable?.file_url}
      className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
    >
      <Download size={18} />
      {loading ? 'Downloading...' : 'Download'}
    </button>
  );
};

export default DownloadButton;