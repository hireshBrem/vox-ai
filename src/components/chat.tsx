"use client";

import { VoiceProvider } from "@humeai/voice-react";
import { SparklingSphere } from "@/components/sparkling-sphere";
import { StartCall } from "@/components/start-call";

interface ChatProps {
  accessToken: string;
}

export default function Chat({ accessToken }: ChatProps) {
  if (!accessToken) {
    return (
      <div className="flex items-center justify-center h-full text-neutral-600 bg-neutral-100">
        <div className="text-center">
          <p className="text-lg font-semibold mb-2">Authentication Error</p>
          <p className="text-sm text-neutral-500">
            Failed to fetch access token. Please check your API credentials.
          </p>
        </div>
      </div>
    );
  }

  return (
    <VoiceProvider>
      <div className="flex h-full flex-col bg-neutral-100">
        <div className="flex-1 overflow-y-auto p-6 flex items-center justify-center">
          <SparklingSphere />
        </div>
        <div className="border-t border-neutral-300 p-4 bg-neutral-100">
          <StartCall accessToken={accessToken} />
        </div>
      </div>
    </VoiceProvider>
  );
}
