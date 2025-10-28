"use client";

import {
  useVoice,
  VoiceReadyState,
} from "@humeai/voice-react";
import { Mic, MicOff } from "lucide-react";
import { useState } from "react";

interface StartCallProps {
  accessToken: string;
}

export function StartCall({ accessToken }: StartCallProps) {
  const { connect, disconnect, readyState } = useVoice();
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isConnected = readyState === VoiceReadyState.OPEN;

  const handleConnect = async () => {
    setIsConnecting(true);
    setError(null);

    try {
      await connect({
        auth: { type: "accessToken", value: accessToken },
      });
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to connect to voice assistant"
      );
      setIsConnecting(false);
    }
  };

  const handleDisconnect = () => {
    disconnect();
    setError(null);
  };

  return (
    <div className="flex flex-col gap-3">
      {error && (
        <div className="text-sm text-red-700 bg-red-100 p-2 rounded border border-red-300">
          {error}
        </div>
      )}
      <button
        onClick={isConnected ? handleDisconnect : handleConnect}
        disabled={isConnecting}
        className={`flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-semibold transition-all duration-200 ${
          isConnected
            ? "bg-red-600 hover:bg-red-700 text-white"
            : "text-white disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90"
        }`}
        style={!isConnected ? { backgroundColor: '#6E56CF' } : {}}
      >
        {isConnected ? (
          <>
            <MicOff className="w-5 h-5" />
            End Session
          </>
        ) : isConnecting ? (
          <>
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            Connecting...
          </>
        ) : (
          <>
            <Mic className="w-5 h-5" />
            Start Session
          </>
        )}
      </button>
      {isConnected && (
        <div className="text-center text-sm text-green-600">
          <div className="flex items-center justify-center gap-2">
            <div className="w-2 h-2 bg-green-600 rounded-full animate-pulse" />
            Connected
          </div>
        </div>
      )}
    </div>
  );
}
