"use client";

import dynamic from "next/dynamic";

const DynamicChat = dynamic(() => import("./chat"), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center h-full text-neutral-400">
      Loading...
    </div>
  ),
});

interface ChatWrapperProps {
  accessToken: string;
}

function ChatWrapper({ accessToken }: ChatWrapperProps) {
  return <DynamicChat accessToken={accessToken} />;
}

export default ChatWrapper;

