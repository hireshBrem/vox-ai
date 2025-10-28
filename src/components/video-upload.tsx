'use client';
import React, { useState } from 'react';
import { uploadVideo } from '@/utils/filestack';

function VideoUpload() {
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    console.log('handleFileChange');
    const file = event.target.files?.[0];
    if (file) {
      setIsLoading(true);
      try {
        const url = await uploadVideo(file);
        setVideoUrl(url); // public URL of the uploaded video
      } catch (error) {
        console.error('Upload failed:', error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <div>
      <input
        type="file"
        accept="video/mp4"
        onChange={handleFileChange}
        disabled={isLoading}
      />
      {videoUrl && (
        <video controls width="400">
          <source src={videoUrl} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      )}
    </div>
  );
}

export default VideoUpload;
