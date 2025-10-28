"use client";

import Chat from "./chat";

interface ChatWrapperProps {
  accessToken: string;
  agentMode: 'edit_videos' | 'generate_content';
  sessionId?: string | null;
  videoNumber?: string;
}

function ChatWrapper({ accessToken, agentMode, sessionId, videoNumber }: ChatWrapperProps) {
  return <Chat accessToken={accessToken} agentMode={agentMode} sessionId={sessionId} videoNumber={videoNumber} />;
}

export default ChatWrapper;

