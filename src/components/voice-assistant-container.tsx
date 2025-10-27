"use client";

import ChatWrapper from "./voice-assistant-panel";

interface VoiceAssistantPanelProps {
  accessToken: string;
  agentMode: 'edit_videos' | 'generate_content';
}

export function VoiceAssistantPanel({ accessToken, agentMode }: VoiceAssistantPanelProps) {

  return (
    <div className="flex h-full flex-col bg-neutral-900 rounded-2xl overflow-hidden">
      <ChatWrapper accessToken={accessToken} agentMode={agentMode} />
    </div>
  );
}
