"use client";

import Chat from "./chat";

interface ChatWrapperProps {
  accessToken: string;
  agentMode: 'edit_videos' | 'generate_content';
}

function ChatWrapper({ accessToken, agentMode }: ChatWrapperProps) {
  return <Chat accessToken={accessToken} agentMode={agentMode} />;
}

export default ChatWrapper;

