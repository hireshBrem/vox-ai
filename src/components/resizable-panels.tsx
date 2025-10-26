'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import { GripVertical, Scissors, Sparkles } from 'lucide-react';
import { VideoEditorPanel } from './video-editor-panel';
import { VoiceAssistantPanel } from './voice-assistant-container';
import { GeneratePanel } from './generate-panel';

interface ResizablePanelsProps {
  accessToken: string;
  initialLeftWidth?: number; // percentage (0-100)
  minLeftWidth?: number; // percentage
  minRightWidth?: number; // percentage
}

export function ResizablePanels({
  accessToken,
  initialLeftWidth = 70,
  minLeftWidth = 30,
  minRightWidth = 20,
}: ResizablePanelsProps) {
  const [leftWidth, setLeftWidth] = useState(initialLeftWidth);
  const [isDragging, setIsDragging] = useState(false);
  const [agentMode, setAgentMode] = useState<'edit_videos' | 'generate_content'>('edit_videos');
  const containerRef = useRef<HTMLDivElement>(null);
  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isDragging || !containerRef.current) return;

    const containerRect = containerRef.current.getBoundingClientRect();
    const newLeftWidth = ((e.clientX - containerRect.left) / containerRect.width) * 100;
    
    // Apply constraints
    const clampedWidth = Math.max(
      minLeftWidth,
      Math.min(100 - minRightWidth, newLeftWidth)
    );
    
    setLeftWidth(clampedWidth);
  }, [isDragging, minLeftWidth, minRightWidth]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = 'col-resize';
      document.body.style.userSelect = 'none';
      
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
        document.body.style.cursor = '';
        document.body.style.userSelect = '';
      };
    }
  }, [isDragging, handleMouseMove, handleMouseUp]);

  return (
    <div 
      ref={containerRef}
      className="flex h-full w-full overflow-hidden"
    >
      {/* Left Panel */}
      <div 
        className="flex-shrink-0 min-w-0"
        style={{ width: `${leftWidth}%` }}
      >
        {/* Toggle */}
        <div className="pt-2 pb-1 flex justify-center">
          <div className="flex gap-1 bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setAgentMode('edit_videos')}
              className={`flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                agentMode === 'edit_videos'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Scissors size={14} />
              <span>Edit Videos</span>
            </button>
            <button
              onClick={() => setAgentMode('generate_content')}
              className={`flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                agentMode === 'generate_content'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Sparkles size={14} />
              <span>Generate</span>
            </button>
          </div>
        </div>
        
        {/* Panel Content */}
        <div className="h-[calc(100%-60px)] px-2">
          {agentMode === 'edit_videos' ? (
            <VideoEditorPanel />
          ) : (
            <GeneratePanel />
          )}
        </div>
      </div>

      {/* Resizable Divider */}
      <div
        className={`group relative flex-shrink-0 w-1 bg-gray-700 hover:bg-gray-600 cursor-col-resize transition-colors ${
          isDragging ? 'bg-blue-500' : 'dark:border-neutral-800'
        }`}
        onMouseDown={() => setIsDragging(true)}
      >
        {/* Visual indicator */}
        <div className="absolute inset-y-0 left-1/2 transform -translate-x-1/2 w-3 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
          <GripVertical size={12} className="text-gray-400" />
        </div>
        
        {/* Invisible wider hit area */}
        <div className="absolute inset-y-0 -left-2 -right-2 cursor-col-resize" />
      </div>

      {/* Right Panel */}
      <div 
        className="flex-1 min-w-0 p-2"
        style={{ width: `${100 - leftWidth}%` }}
      >
        <VoiceAssistantPanel accessToken={accessToken} />
      </div>
    </div>
  );
}
