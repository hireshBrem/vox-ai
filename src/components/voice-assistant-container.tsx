"use client";

import ChatWrapper from "@/components/voice-assistant-panel";

interface VoiceAssistantPanelProps {
  accessToken: string;
  agentMode: 'edit_videos' | 'generate_content';
  sessionId?: string | null;
  videoNumber?: string;
}

export function VoiceAssistantPanel({ accessToken, agentMode, sessionId, videoNumber }: VoiceAssistantPanelProps) {
    console.log('video number', videoNumber);
    console.log('session id', sessionId);
  return (
    <div className="flex h-full flex-col bg-neutral-900 rounded-2xl overflow-hidden">
      <ChatWrapper accessToken={accessToken} agentMode={agentMode} sessionId={sessionId} videoNumber={videoNumber} />
    </div>
  );
}
