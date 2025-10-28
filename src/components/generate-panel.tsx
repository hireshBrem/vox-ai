'use client';

import { Sparkles, Image as ImageIcon, Video as VideoIcon, Download, Loader2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';

export function GeneratePanel() {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [isLoadingImage, setIsLoadingImage] = useState(false);

  useEffect(() => {
    // Check for existing content in localStorage on mount
    const existingImageUrl = localStorage.getItem('generatedImageUrl');
    const existingVideoUrl = localStorage.getItem('generatedVideoUrl');
    
    if (existingImageUrl) {
      setImageUrl(existingImageUrl);
    }
    if (existingVideoUrl) {
      setVideoUrl(existingVideoUrl);
    }

    // Listen for custom content update events
    const handleContentUpdate = (event: Event) => {
      const customEvent = event as CustomEvent<{ type: 'image' | 'video'; url: string }>;
      
      if (customEvent.detail.type === 'image') {
        console.log('Received image update event:', customEvent.detail.url);
        setImageUrl(customEvent.detail.url);
      } else if (customEvent.detail.type === 'video') {
        console.log('Received video update event:', customEvent.detail.url);
        setVideoUrl(customEvent.detail.url);
      }
    };

    // Also listen for storage events (for cross-tab updates)
    const handleStorageChange = () => {
      const newImageUrl = localStorage.getItem('generatedImageUrl');
      const newVideoUrl = localStorage.getItem('generatedVideoUrl');
      
      if (newImageUrl && newImageUrl !== imageUrl) {
        setImageUrl(newImageUrl);
      }
      if (newVideoUrl && newVideoUrl !== videoUrl) {
        setVideoUrl(newVideoUrl);
      }
    };

    window.addEventListener('generatedContentUpdate', handleContentUpdate);
    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      window.removeEventListener('generatedContentUpdate', handleContentUpdate);
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [imageUrl, videoUrl]);

  const handleDownload = (url: string, filename: string) => {
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleClear = () => {
    setImageUrl(null);
    setVideoUrl(null);
    localStorage.removeItem('generatedImageUrl');
    localStorage.removeItem('generatedVideoUrl');
  };

  return (
    <div className="flex flex-col bg-white text-gray-900 rounded-2xl h-full shadow-sm border border-gray-100">
      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6">
        {!imageUrl && !videoUrl ? (
          <div className="h-full flex items-center justify-center">
            <div className="text-center space-y-6 max-w-md">
              <div className="w-20 h-20 bg-gradient-to-br from-purple-50 to-purple-100 rounded-full flex items-center justify-center mx-auto">
                <Sparkles size={32} className="text-[#6E56CF]" />
              </div>
              
              <div className="space-y-3">
                <h3 className="text-xl font-semibold text-gray-900">
                  Say what you want to create!
                </h3>
                <p className="text-sm text-gray-600">
                  Image or video, etc.
                </p>
              </div>

              <div className="flex items-center justify-center gap-6 pt-4">
                <div className="flex items-center gap-2 text-gray-600">
                  <ImageIcon size={20} />
                  <span className="text-xs">Images</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <VideoIcon size={20} />
                  <span className="text-xs">Videos</span>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Generated Image */}
            {imageUrl && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                    <ImageIcon size={20} className="text-[#6E56CF]" />
                    Generated Image
                  </h3>
                  <div className="flex gap-2 bg-[#6E56CF] rounded-md text-white cursor-pointer">
                    <Button
                      size="sm"
                      variant="outline"
                      className='bg-[#6E56CF] cursor-pointer'
                      onClick={() => handleDownload(imageUrl, 'generated-image.jpg')}
                    >
                      <Download size={16} className="mr-1" />
                      Download
                    </Button>
                  </div>
                </div>
                <div className="relative w-full aspect-video rounded-lg overflow-hidden border border-gray-200 bg-gray-50">
                  {isLoadingImage && (
                    <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
                      <Loader2 className="w-8 h-8 animate-spin text-[#6E56CF]" />
                    </div>
                  )}
                  <Image
                    src={imageUrl}
                    alt="Generated image"
                    fill
                    className="object-contain"
                    onLoadStart={() => setIsLoadingImage(true)}
                    onLoad={() => setIsLoadingImage(false)}
                    onError={() => setIsLoadingImage(false)}
                  />
                </div>
              </div>
            )}

            {/* Generated Video */}
            {videoUrl && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                    <VideoIcon size={20} className="text-[#6E56CF]" />
                    Generated Video
                  </h3>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDownload(videoUrl, 'generated-video.mp4')}
                    >
                      <Download size={16} className="mr-1" />
                      Download
                    </Button>
                  </div>
                </div>
                <div className="relative w-full aspect-video rounded-lg overflow-hidden border border-gray-200 bg-gray-50">
                  <video
                    src={videoUrl}
                    controls
                    className="w-full h-full object-contain"
                  >
                    Your browser does not support the video tag.
                  </video>
                </div>
              </div>
            )}

            {/* Clear button */}
            {/* <div className="flex justify-center pt-4">
                <div className="flex gap-2 bg-[#6E56CF] rounded-md text-white cursor-pointer">
              <Button
                variant="outline"
                size="sm"
                onClick={handleClear}
                className='bg-[#6E56CF] cursor-pointer'
                >
                    Clear All
                </Button>
                </div>
            </div> */}
          </div>
        )}
      </div>
    </div>
  );
}

