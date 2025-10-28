"use client";

import ChatWrapper from "@/components/voice-assistant-panel";

interface VoiceAssistantPanelProps {
  accessToken: string;
  agentMode: 'edit_videos' | 'generate_content';
  sessionId?: string | null;
  videoNumber?: string;
  videoUrl?: string;
}

export function VoiceAssistantPanel({ accessToken, agentMode, sessionId, videoNumber, videoUrl }: VoiceAssistantPanelProps) {
    console.log('video number', videoNumber);
    console.log('session id', sessionId);
    console.log('video url', videoUrl);
  return (
    <div className="flex h-full flex-col bg-neutral-900 rounded-2xl overflow-hidden">
      <ChatWrapper accessToken={accessToken} agentMode={agentMode} sessionId={sessionId} videoNumber={videoNumber} videoUrl={videoUrl} />
    </div>
  );
}
