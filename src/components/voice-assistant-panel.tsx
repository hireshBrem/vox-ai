"use client";

import Chat from "@/components/chat";

interface ChatWrapperProps {
  accessToken: string;
  agentMode: 'edit_videos' | 'generate_content';
  sessionId?: string | null;
  videoNumber?: string;
  videoUrl?: string;
}

function ChatWrapper({ accessToken, agentMode, sessionId, videoNumber, videoUrl }: ChatWrapperProps) {
  return <Chat accessToken={accessToken} agentMode={agentMode} sessionId={sessionId} videoNumber={videoNumber} videoUrl={videoUrl} />;
}

export default ChatWrapper;

