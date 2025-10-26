'use client';

import { useState, useRef } from 'react';
import { Play, Pause, SkipBack, SkipForward, Volume2, Scissors, Upload, Download, Loader, X, Search, CheckCircle, Settings } from 'lucide-react';
import { uploadVideoFromUrl, getVideoIdByTaskId, fetchChatSessions, getSessionDetailsAction, getTaskInfo } from '@/actions';
import { motion } from 'framer-motion';

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

  // Modal states
  const [isSessionModalOpen, setIsSessionModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'task' | 'sessions' | 'session-detail' | 'task-info'>('task');
  const [modalLoading, setModalLoading] = useState(false);
  const [modalResult, setModalResult] = useState<any>(null);
  const [modalError, setModalError] = useState<string | null>(null);

  // Form inputs
  const [taskIdForInfo, setTaskIdForInfo] = useState('');
  const [uniqueIdForSessions, setUniqueIdForSessions] = useState('');
  const [pageForSessions, setPageForSessions] = useState(1);
  const [sessionIdInput, setSessionIdInput] = useState('');
  const [uniqueIdForDetail, setUniqueIdForDetail] = useState('');

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

  const handleModalAction = async () => {
    setModalError(null);
    setModalResult(null);
    setModalLoading(true);

    try {
      let result: any;

      if (activeTab === 'task') {
        if (!taskIdForInfo.trim()) {
          setModalError('Please enter a task ID');
          setModalLoading(false);
          return;
        }
        result = await getTaskInfo({ taskId: taskIdForInfo, uniqueId: '1' });
      } else if (activeTab === 'sessions') {
        if (!uniqueIdForSessions.trim()) {
          setModalError('Please enter a unique ID');
          setModalLoading(false);
          return;
        }
        result = await fetchChatSessions({ uniqueId: uniqueIdForSessions, page: pageForSessions });
      } else if (activeTab === 'session-detail') {
        if (!sessionIdInput.trim() || !uniqueIdForDetail.trim()) {
          setModalError('Please enter both session ID and unique ID');
          setModalLoading(false);
          return;
        }
        result = await getSessionDetailsAction({ sessionId: sessionIdInput, uniqueId: uniqueIdForDetail });
      }

      if (result.success) {
        setModalResult(result);
      } else {
        setModalError(result.error || 'An error occurred');
      }
    } catch (error) {
      setModalError(error instanceof Error ? error.message : 'An error occurred');
    } finally {
      setModalLoading(false);
    }
  };

  return (
    <div className="flex flex-col bg-white text-gray-900 rounded-2xl h-full shadow-sm border border-gray-100">
      {/* Task Search Header */}
      <div className="px-4 py-3 bg-white border-b border-gray-200 flex items-center gap-3 rounded-t-2xl">
        {/* <div className="flex items-center gap-2 flex-1">
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
              </>
            )}
          </button>
        </div> */}
        <button
          onClick={() => {
            setIsSessionModalOpen(true);
            setModalResult(null);
            setModalError(null);
          }}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          title="Session Tools"
        >
          <Settings size={20} style={{ color: '#6E56CF' }} />
        </button>
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
          <div className="w-full max-w-4xl aspect-video bg-white rounded-xl flex items-center justify-center">
            <div className="text-center space-y-6">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-50 to-purple-100 rounded-full flex items-center justify-center mx-auto">
                <Upload size={28} className="text-[#6E56CF]" />
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

      {/* Session Modal */}
      {isSessionModalOpen && (
        <motion.div 
          className="fixed inset-0 flex items-center justify-center z-50 p-4 bg-black/20"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <motion.div 
            className="bg-white rounded-xl shadow-lg w-full max-w-2xl max-h-[80vh] overflow-y-auto"
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          >
            {/* Modal Header */}
            <div className="sticky top-0 px-6 py-4 border-b border-gray-200 flex items-center justify-between bg-white">
              <h2 className="text-lg font-semibold text-gray-900">Session Tools</h2>
              <button
                onClick={() => setIsSessionModalOpen(false)}
                className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X size={20} className="text-gray-600" />
              </button>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-gray-200 bg-gray-50">
              {[
                { id: 'task', label: 'Get Task Info' },
                { id: 'sessions', label: 'Fetch Sessions' },
                { id: 'session-detail', label: 'Session Details' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex-1 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                    activeTab === tab.id
                      ? 'border-[#6E56CF] text-[#6E56CF]'
                      : 'border-transparent text-gray-600 hover:text-gray-900'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-4">
              {/* Get Task Info Tab */}
              {activeTab === 'task' && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Task ID</label>
                    <input
                      type="text"
                      value={taskIdForInfo}
                      onChange={(e) => setTaskIdForInfo(e.target.value)}
                      placeholder="Enter task ID..."
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-900 placeholder-gray-500 focus:outline-none"
                      style={{ borderColor: taskIdForInfo ? '#6E56CF' : undefined }}
                    />
                  </div>
                </div>
              )}

              {/* Fetch Sessions Tab */}
              {activeTab === 'sessions' && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Unique ID</label>
                    <input
                      type="text"
                      value={uniqueIdForSessions}
                      onChange={(e) => setUniqueIdForSessions(e.target.value)}
                      placeholder="Enter unique ID..."
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-900 placeholder-gray-500 focus:outline-none"
                      style={{ borderColor: uniqueIdForSessions ? '#6E56CF' : undefined }}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Page</label>
                    <input
                      type="number"
                      value={pageForSessions}
                      onChange={(e) => setPageForSessions(Number(e.target.value))}
                      min="1"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-900 focus:outline-none"
                    />
                  </div>
                </div>
              )}

              {/* Session Details Tab */}
              {activeTab === 'session-detail' && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Session ID</label>
                    <input
                      type="text"
                      value={sessionIdInput}
                      onChange={(e) => setSessionIdInput(e.target.value)}
                      placeholder="Enter session ID..."
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-900 placeholder-gray-500 focus:outline-none"
                      style={{ borderColor: sessionIdInput ? '#6E56CF' : undefined }}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Unique ID</label>
                    <input
                      type="text"
                      value={uniqueIdForDetail}
                      onChange={(e) => setUniqueIdForDetail(e.target.value)}
                      placeholder="Enter unique ID..."
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-900 placeholder-gray-500 focus:outline-none"
                      style={{ borderColor: uniqueIdForDetail ? '#6E56CF' : undefined }}
                    />
                  </div>
                </div>
              )}

              {/* Error Display */}
              {modalError && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-sm text-red-700">{modalError}</p>
                </div>
              )}

              {/* Result Display */}
              {modalResult && (
                <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                  <p className="text-sm font-medium text-green-900 mb-2">Result:</p>
                  <pre className="text-xs text-green-700 overflow-auto max-h-64 bg-white p-2 rounded border border-green-100">
                    {JSON.stringify(modalResult, null, 2)}
                  </pre>
                </div>
              )}

              {/* Action Button */}
              <button
                onClick={handleModalAction}
                disabled={modalLoading}
                className="w-full px-4 py-2 bg-[#6E56CF] text-white rounded-lg text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-70 flex items-center justify-center gap-2"
              >
                {modalLoading ? (
                  <>
                    <Loader size={16} className="animate-spin" />
                    Loading...
                  </>
                ) : (
                  'Execute'
                )}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}
