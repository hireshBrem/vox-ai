"use client";

import Chat from "./chat";

interface ChatWrapperProps {
  accessToken: string;
}

function ChatWrapper({ accessToken }: ChatWrapperProps) {
  return <Chat accessToken={accessToken} />;
}

export default ChatWrapper;

