"use client";

import ChatWrapper from "./voice-assistant-panel";

export function VoiceAssistantPanel({ accessToken }: { accessToken: string }) {

  return (
    <div className="flex h-full flex-col bg-neutral-900 rounded-2xl overflow-hidden">
      <ChatWrapper accessToken={accessToken} />
    </div>
  );
}
