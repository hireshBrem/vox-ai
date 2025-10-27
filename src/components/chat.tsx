"use client";

import { VoiceProvider, useVoice, VoiceReadyState } from "@humeai/voice-react";
import { SparklingSphere } from "@/components/sparkling-sphere";
import { StartCall } from "@/components/start-call";
import { Orb } from "@/components/ui/orb"
import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { AnimatePresence } from "framer-motion";
import { motion } from "framer-motion";
import { Loader2Icon, PhoneIcon, PhoneOffIcon, XIcon } from "lucide-react";
import { handleToolCall } from "@/utils/hume-tool-handler";

interface ChatProps {
  accessToken: string;
  agentMode: 'edit_videos' | 'generate_content';
}

function ChatContent({ accessToken, agentMode }: ChatProps) {
  const { connect, disconnect, readyState, messages } = useVoice();
  const [agentState, setAgentState] = useState<"thinking" | "listening" | "talking" | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isDisconnecting, setIsDisconnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isConnected = readyState === VoiceReadyState.OPEN;

  // Update agentState based on connection status
  useEffect(() => {
    console.log("messages", messages);
    console.log("agentState", agentState);
    if (isDisconnecting) {
      setAgentState(null);
    } else if (isConnecting) {
      setAgentState("thinking");
    } else if (isConnected) {
      setAgentState("listening");
    } else {
      setAgentState(null);
    }
  }, [isConnecting, isConnected, isDisconnecting])

  

  const handleConnect = async () => {
    setIsConnecting(true);
    setError(null);

    try {
      const configId = agentMode === 'edit_videos' 
        ? '1945e668-7e5c-49ee-9cba-262db73ef625' 
        : 'eda435d3-0a9f-4b87-9ab5-b6c44e76453e';
      
      await connect({
        auth: { type: "accessToken", value: accessToken },
        configId,
      });
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to connect to voice assistant"
      );
      setIsConnecting(false);
      setAgentState(null);
    }
  };

  const handleDisconnect = () => {
    setIsDisconnecting(true);
    disconnect();
    setError(null);
    setAgentState(null);
    setIsConnecting(false);
    // Reset disconnecting state after a brief moment
    setTimeout(() => {
      setIsDisconnecting(false);
    }, 100);
  };

  return (
    <div className="flex h-full flex-col bg-neutral-100">
      <div className="flex-1 overflow-y-auto p-6 flex items-center justify-center flex-col gap-4">
        {error && (
          <div className="text-sm text-red-700 bg-red-100 p-3 rounded-lg border border-red-300 max-w-md">
            {error}
          </div>
        )}
        <Orb 
          agentState={agentState} 
          seed={(1 + 1) * 1000} 
          volumeMode="manual" 
          className="w-32 h-32" 
          colors={["#6E56CF", "#6E56CF"]} 
        />
        <p className="text-lg font-semibold text-black">Start Conversation</p>
        <p className="text-sm text-neutral-500">
          {isConnected ? "Connected - Speak now" : "Tap to start voice chat"}
        </p>
        {!isConnected ? (
          <Button
            onClick={handleConnect}
            disabled={isConnecting}
            size="icon"
            variant="default"
            className="h-12 w-12 rounded-full cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <AnimatePresence mode="wait">
              {agentState === "thinking" ? (
                <motion.div
                  key="loading"
                  initial={{ opacity: 0, rotate: 0 }}
                  animate={{ opacity: 1, rotate: 360 }}
                  exit={{ opacity: 0 }}
                  transition={{
                    rotate: { duration: 1, repeat: Infinity, ease: "linear" },
                  }}
                >
                  <Loader2Icon className="h-5 w-5" />
                </motion.div>
              ) : (
                <motion.div
                  key="start"
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.5 }}
                >
                  <PhoneIcon className="h-5 w-5 cursor-pointer" />
                </motion.div>
              )}
            </AnimatePresence>
          </Button>
        ) : (
          <>
            {/* <div className="text-center text-sm text-green-600 mb-2">
              <div className="flex items-center justify-center gap-2">
                <div className="w-2 h-2 bg-green-600 rounded-full animate-pulse" />
                Active Session
              </div>
            </div> */}
            <Button
              onClick={handleDisconnect}
              size="icon"
              variant="destructive"
              className="h-12 w-12 rounded-full cursor-pointer"
            >
              <XIcon className="h-5 w-5" />
            </Button>
          </>
        )}
      </div>
    </div>
  );
}

export default function Chat({ accessToken, agentMode }: ChatProps) {
  // Handle tool calls
  const handleToolCallMessage = async (
    message: any,
    send: any
  ) => {
    console.log('Received tool call:', message);

    try {
      const result = await handleToolCall(message, send);
      console.log('Tool call result:', result);
      return result;
    } catch (err) {
      console.error('Error handling tool call:', err);
      return send.error({
        error: 'Tool execution failed',
        code: 'TOOL_ERROR',
        level: 'error',
        content: err instanceof Error ? err.message : 'Unknown error occurred',
      });
    }
  };

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
    <VoiceProvider onToolCall={handleToolCallMessage}>  
      <ChatContent accessToken={accessToken} agentMode={agentMode} />
    </VoiceProvider>
  );
}
