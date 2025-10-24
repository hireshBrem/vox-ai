'use client';

import { useState, useRef } from 'react';
import { Play, Pause, SkipBack, SkipForward, Volume2, Scissors, Upload, Download } from 'lucide-react';

export function VideoEditorPanel() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(50);
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);
  const [videoUrl, setVideoUrl] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handlePlayPause = () => {
    if (videoRef.current) {
      if (videoRef.current.paused) {
        videoRef.current.play();
        setIsPlaying(true);
      } else {
        videoRef.current.pause();
        setIsPlaying(false);
      }
    }
  };

  const handleSkipBack = () => {
    if (videoRef.current) {
      videoRef.current.currentTime = Math.max(0, videoRef.current.currentTime - 5);
    }
  };

  const handleSkipForward = () => {
    if (videoRef.current) {
      videoRef.current.currentTime = Math.min(videoRef.current.duration, videoRef.current.currentTime + 5);
    }
  };

  const handleVolumeChange = (newVolume: number) => {
    setVolume(newVolume);
    if (videoRef.current) {
      videoRef.current.volume = newVolume / 100;
    }
  };

  return (
    <div className="flex flex-col bg-neutral-200 text-black rounded-2xl h-full">
      {/* Header */}
      {isVideoLoaded ? (
        <div className="flex-1 flex rounded-2xl">
          <div className="flex-1 flex flex-col">
            {/* Video Canvas */}
            <div className="flex-1 bg-neutral-100 flex items-center justify-center border-b border-neutral-300">
              <video
                ref={videoRef}
                src={videoUrl} // Use videoUrl for the video source
                className="w-full max-w-4xl aspect-video rounded border border-neutral-300"
                onLoadedMetadata={() => {
                  if (videoRef.current) {
                    setDuration(videoRef.current.duration);
                  }
                }}
                onTimeUpdate={() => {
                  if (videoRef.current) {
                    setCurrentTime(videoRef.current.currentTime);
                  }
                }}
                onPlay={() => setIsPlaying(true)}
                onPause={() => setIsPlaying(false)}
              ></video>
            </div>

            {/* Timeline */}
            {/* Removed Timeline */}

            {/* Controls */}
            <div className="px-4 py-3 bg-neutral-100 flex items-center justify-between rounded-b-2xl border-t border-neutral-300">
              <div className="flex items-center gap-3">
                <button 
                  onClick={handleSkipBack}
                  className="p-2 hover:bg-neutral-300 rounded transition-colors"
                >
                  <SkipBack size={20} className="text-neutral-700" />
                </button>
                <button 
                  onClick={handlePlayPause}
                  className="p-2 hover:bg-neutral-300 rounded transition-colors"
                >
                  {isPlaying ? <Pause size={20} className="text-neutral-700" /> : <Play size={20} className="text-neutral-700" />}
                </button>
                <button 
                  onClick={handleSkipForward}
                  className="p-2 hover:bg-neutral-300 rounded transition-colors"
                >
                  <SkipForward size={20} className="text-neutral-700" />
                </button>
                
                <div className="flex items-center gap-2 ml-4">
                  <Volume2 size={16} className="text-neutral-600" />
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={volume}
                    onChange={(e) => handleVolumeChange(Number(e.target.value))}
                    className="w-20 h-1 bg-neutral-300 rounded-lg appearance-none cursor-pointer accent-purple-500"
                  />
                  <span className="text-xs text-neutral-600 w-8">{volume}%</span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-sm text-neutral-600">
                  {formatTime(currentTime)} / {formatTime(duration)}
                </span>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center">
          <div className="w-full max-w-4xl aspect-video bg-neutral-100 rounded border border-neutral-300 flex items-center justify-center">
            <div className="text-center">
              <div className="w-16 h-16 bg-neutral-200 rounded-full flex items-center justify-center mb-4 mx-auto">
                <Upload size={24} className="text-neutral-500" />
              </div>
              <p className="text-neutral-700">No video loaded</p>
              <p className="text-sm text-neutral-600 mt-1">Drag and drop or import a video to get started</p>
              <input 
                type="file" 
                accept="video/*" 
                ref={fileInputRef} 
                style={{ display: 'none' }}
                onChange={(event) => {
                  if (event.target.files && event.target.files.length > 0) {
                    const file = event.target.files[0];
                    const reader = new FileReader();
                    reader.onloadend = () => {
                      setVideoUrl(reader.result as string);
                      setIsVideoLoaded(true);
                    };
                    reader.readAsDataURL(file);
                  }
                }}
              />
              <button 
                onClick={() => fileInputRef.current?.click()}
                className="mt-4 px-4 py-2 hover:opacity-90 rounded text-sm text-white transition-opacity"
                style={{ backgroundColor: '#6E56CF' }}
              >
                Upload Video
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
