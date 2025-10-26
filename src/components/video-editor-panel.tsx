'use client';

import { useState, useRef } from 'react';
import { Play, Pause, SkipBack, SkipForward, Volume2, Scissors, Upload, Download, Loader, X, Search, CheckCircle } from 'lucide-react';
import { uploadVideoFromUrl, getVideoIdByTaskId } from '@/actions';

export function VideoEditorPanel() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(50);
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);
  const [videoUrl, setVideoUrl] = useState<string>('');
  const [urlInput, setUrlInput] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploadSuccess, setUploadSuccess] = useState<string | null>(null);
  const [taskId, setTaskId] = useState<string | null>(null);
  const [taskIdInput, setTaskIdInput] = useState('');
  const [isFetchingTask, setIsFetchingTask] = useState(false);
  const [taskVideos, setTaskVideos] = useState<any[]>([]);
  const [taskError, setTaskError] = useState<string | null>(null);
  const [videoTitle, setVideoTitle] = useState<string>('');
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
  }

  const handleUrlSubmit = async () => {
    setUploadError(null);
    setUploadSuccess(null);

    if (!urlInput.trim()) {
      setUploadError('Please enter a valid URL');
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await uploadVideoFromUrl({
        videoUrls: [urlInput],
      });

      if (result.success) {
        setUploadSuccess(`Video uploaded successfully! Task ID: ${result.taskId}`);
        setTaskId(result.taskId || null);
        setVideoUrl(urlInput);
        setIsVideoLoaded(true);
        setUrlInput('');
      } else {
        setUploadError(result.error || 'Failed to upload video');
      }
    } catch (error) {
      setUploadError(error instanceof Error ? error.message : 'An error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClearVideo = () => {
    setIsVideoLoaded(false);
    setVideoUrl('');
    setTaskId(null);
    setCurrentTime(0);
    setDuration(0);
    setIsPlaying(false);
    setUploadSuccess(null);
    setVideoTitle('');
  };

  const handleFetchTaskDetails = async () => {
    setTaskError(null);
    setTaskVideos([]);

    if (!taskIdInput.trim()) {
      setTaskError('Please enter a task ID');
      return;
    }

    setIsFetchingTask(true);
    try {
      const result = await getVideoIdByTaskId({
        taskId: taskIdInput,
      });
      console.log('result:', result);

      if (result.success && result.videos && result.videos.length > 0) {
        setTaskVideos(result.videos);
        setTaskId(taskIdInput);
        
        // Load the first video automatically
        const firstVideo = result.videos[0];
        setVideoUrl(firstVideo.video_url);
        setVideoTitle(firstVideo.video_name);
        setIsVideoLoaded(true);
      } else {
        setTaskError(result.error || 'Failed to fetch task details or no videos found');
      }
    } catch (error) {
      setTaskError(error instanceof Error ? error.message : 'An error occurred');
    } finally {
      setIsFetchingTask(false);
    }
  };

  return (
    <div className="flex flex-col bg-white text-gray-900 rounded-2xl h-full shadow-sm border border-gray-100">
      {/* Task Search Header */}
      <div className="px-4 py-3 bg-white border-b border-gray-200 flex items-center gap-3">
        <div className="flex items-center gap-2 flex-1">
          <Search size={18} className="text-gray-500" />
          <input
            type="text"
            placeholder="Enter Task ID..."
            value={taskIdInput}
            onChange={(e) => setTaskIdInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleFetchTaskDetails()}
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-900 placeholder-gray-500 focus:outline-none bg-gray-50"
            style={{ 
              outlineColor: '#6E56CF',
              borderColor: taskIdInput ? '#6E56CF' : undefined
            }}
            disabled={isFetchingTask}
          />
          <button
            onClick={handleFetchTaskDetails}
            disabled={isFetchingTask}
            className="px-4 py-2 rounded-lg text-sm font-medium text-white transition-all flex items-center gap-2 disabled:opacity-70"
            style={{ backgroundColor: '#6E56CF' }}
          >
            {isFetchingTask ? (
              <>
                <Loader size={16} className="animate-spin" />
                <span className="text-xs">Loading...</span>
              </>
            ) : (
              <>
                <Search size={16} />
                <span className="text-xs">Fetch</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Task Details Display */}
      {taskVideos.length > 0 && (
        <div className="px-4 py-3 bg-green-50 border-b border-green-200 flex items-center gap-3">
          <CheckCircle size={18} className="text-green-600" />
          <div className="flex-1">
            <p className="text-sm font-medium text-green-900">Task loaded successfully</p>
            <p className="text-xs text-green-700 mt-0.5">Found {taskVideos.length} video(s)</p>
          </div>
        </div>
      )}

      {/* Task Error Display */}
      {taskError && (
        <div className="px-4 py-3 bg-red-50 border-b border-red-200">
          <p className="text-sm text-red-700">{taskError}</p>
        </div>
      )}

      {/* Header */}
      {isVideoLoaded && (
        <div className="px-4 py-3 bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200 rounded-t-2xl flex items-center justify-between">
          <div className="flex items-center gap-3 flex-1">
            <div className="w-2 h-2 rounded-full bg-purple-500"></div>
            <div className="flex-1 min-w-0">
              <h2 className="text-sm font-semibold text-gray-900 truncate">{videoTitle || 'Video Editor'}</h2>
            </div>
          </div>
          {taskId && (
            <div className="flex items-center gap-4">
              <div className="text-xs bg-white px-3 py-1.5 rounded-full border border-gray-200">
                <span className="text-gray-600">Task ID: </span>
                <span className="font-mono font-semibold" style={{ color: '#6E56CF' }}>{taskId}</span>
              </div>
              <button
                onClick={handleClearVideo}
                className="p-1.5 hover:bg-gray-200 rounded-lg transition-colors text-gray-600"
              >
                <X size={18} />
              </button>
            </div>
          )}
        </div>
      )}

      {/* Content */}
      {isVideoLoaded ? (
        <div className="flex-1 flex rounded-2xl">
          <div className="flex-1 flex flex-col">
            {/* Video Canvas */}
            <div className="flex-1 bg-gray-900 flex items-center justify-center border-b border-gray-200">
              <video
                ref={videoRef}
                src={videoUrl}
                className="w-full max-w-4xl aspect-video rounded-lg"
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

            {/* Controls */}
            <div className="px-4 py-4 bg-white flex items-center justify-between rounded-b-2xl border-t border-gray-200">
              <div className="flex items-center gap-3">
                <button 
                  onClick={handleSkipBack}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <SkipBack size={20} className="text-gray-700" />
                </button>
                <button 
                  onClick={handlePlayPause}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  style={{ backgroundColor: '#f3f0ff' }}
                >
                  {isPlaying ? <Pause size={20} style={{ color: '#6E56CF' }} /> : <Play size={20} style={{ color: '#6E56CF' }} />}
                </button>
                <button 
                  onClick={handleSkipForward}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <SkipForward size={20} className="text-gray-700" />
                </button>
                
                <div className="flex items-center gap-2 ml-4">
                  <Volume2 size={16} className="text-gray-600" />
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={volume}
                    onChange={(e) => handleVolumeChange(Number(e.target.value))}
                    className="w-20 h-1 bg-gray-300 rounded-lg appearance-none cursor-pointer"
                    style={{ accentColor: '#6E56CF' }}
                  />
                  <span className="text-xs text-gray-600 w-8">{volume}%</span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">
                  {formatTime(currentTime)} / {formatTime(duration)}
                </span>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center">
          <div className="w-full max-w-4xl aspect-video bg-gray-50 rounded-xl border-2 border-dashed border-gray-300 flex items-center justify-center">
            <div className="text-center space-y-6">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-50 to-purple-100 rounded-full flex items-center justify-center mx-auto">
                <Upload size={28} className="text-purple-600" />
              </div>
              <div>
                <p className="text-lg font-semibold text-gray-900">No video loaded</p>
                <p className="text-sm text-gray-600 mt-1">Drag and drop or import a video to get started</p>
              </div>
              
              {/* URL Input Section */}
              <div className="pt-4 space-y-3">
                <div className="flex gap-2 justify-center">
                  <input 
                    type="text" 
                    placeholder="Enter video URL (YouTube, TikTok, Instagram, etc.)"
                    value={urlInput}
                    onChange={(e) => setUrlInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleUrlSubmit()}
                    className="px-4 py-2.5 border border-gray-300 rounded-lg text-sm text-gray-900 placeholder-gray-500 focus:outline-none w-80 bg-white"
                    style={{ 
                      outlineColor: '#6E56CF',
                      borderColor: '#6E56CF'
                    }}
                    disabled={isSubmitting}
                  />
                  <button 
                    onClick={handleUrlSubmit}
                    disabled={isSubmitting}
                    className="px-6 py-2.5 text-white rounded-lg text-sm transition-colors flex items-center gap-2 font-medium disabled:opacity-70"
                    style={{ backgroundColor: '#6E56CF' }}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader size={16} className="animate-spin" />
                        Uploading...
                      </>
                    ) : (
                      'Submit URL'
                    )}
                  </button>
                </div>

                {/* Error Message */}
                {uploadError && (
                  <div className="text-sm text-red-700 bg-red-50 p-3 rounded-lg border border-red-200">
                    {uploadError}
                  </div>
                )}

                {/* Success Message */}
                {uploadSuccess && (
                  <div className="text-sm text-green-700 bg-green-50 p-3 rounded-lg border border-green-200">
                    {uploadSuccess}
                  </div>
                )}
              </div>

              <div className="pt-2">
                <p className="text-gray-500 text-xs">or</p>
              </div>
              
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
                className="px-6 py-2.5 hover:bg-gray-100 rounded-lg text-sm text-gray-900 transition-colors border border-gray-300 font-medium bg-white"
              >
                Upload File
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
