"use client";

import { VoiceProvider, useVoice, VoiceReadyState } from "@humeai/voice-react";
import { Orb } from "@/components/ui/orb"
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { AnimatePresence } from "framer-motion";
import { motion } from "framer-motion";
import { Loader2Icon, PhoneIcon, XIcon } from "lucide-react";
import { handleToolCall } from "@/utils/hume-ai";

interface ChatProps {
  accessToken: string;
  agentMode: 'edit_videos' | 'generate_content';
  sessionId?: string | null;
  videoNumber?: string;
  videoUrl?: string;
}

function ChatContent({ accessToken, agentMode, sessionId, videoNumber, videoUrl }: ChatProps) {
  const { connect, disconnect, readyState, messages, sendSessionSettings, sendUserInput } = useVoice();
  const [agentState, setAgentState] = useState<"thinking" | "listening" | "talking" | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isDisconnecting, setIsDisconnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [contextInjected, setContextInjected] = useState(false);

  const isConnected = readyState === VoiceReadyState.OPEN;

  // Debug logging for connection state
  useEffect(() => {
    console.log('🔍 Connection State Debug:', {
      readyState,
      isConnected,
      videoNumber,
      videoUrl,
      sendSessionSettingsAvailable: !!sendSessionSettings,
      contextInjected
    });
  }, [readyState, isConnected, videoNumber, videoUrl, sendSessionSettings, contextInjected]);

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

  // Reset context injection flag when disconnected
  useEffect(() => {
    if (!isConnected) {
      setContextInjected(false);
      console.log('🔄 Context injection flag reset (disconnected)');
    }
  }, [isConnected]);

  // Inject persistent context for videoNumber when connected
  useEffect(() => {
    console.log('🔍 Context Injection Effect Triggered:', {
      isConnected,
      videoNumber,
      videoUrl,
      contextInjected,
      hasVideoNumber: !!videoNumber,
      hasVideoUrl: !!videoUrl,
      readyState
    });

    // Only inject once per connection, and only if we have the required data
    if (isConnected && videoNumber && !contextInjected) {
      console.log('✨ Attempting to inject context...');
      
      const contextText = videoUrl 
        ? `Current Video: VideoNumber=${videoNumber}, VideoURL=${videoUrl}. Use this context for all interactions in this session.`
        : `Current Video: VideoNumber=${videoNumber}. Use this context for all interactions in this session.`;
      
      // Use a timeout to ensure the connection is fully established
      const timer = setTimeout(() => {
        try {
          console.log('📤 Sending context injection...');
          
          // Try sendSessionSettings if available
          if (sendSessionSettings) {
            console.log('   Using sendSessionSettings method');
            sendSessionSettings({
              context: {
                text: contextText,
                type: 'persistent'
              }
            });
            setContextInjected(true);
            console.log('✅ Context injected successfully via sendSessionSettings');
            console.log('   VideoNumber:', videoNumber);
            if (videoUrl) console.log('   VideoURL:', videoUrl);
          } else {
            console.warn('⚠️ sendSessionSettings not available, trying alternative method');
            
            // Alternative: Try using sendUserInput as a fallback
            if (sendUserInput) {
              console.log('   Using sendUserInput as fallback');
              sendUserInput(contextText);
              setContextInjected(true);
              console.log('✅ Context injected successfully via sendUserInput');
            } else {
              console.error('❌ No method available to inject context');
            }
          }
          
        } catch (err) {
          console.error('❌ Error injecting context:', err);
        }
      }, 1000); // Increased timeout to ensure connection is ready
      
      return () => clearTimeout(timer);
    } else {
      const reasons = [];
      if (!isConnected) reasons.push('not connected');
      if (!videoNumber) reasons.push('no videoNumber');
      if (contextInjected) reasons.push('already injected');
      
      if (reasons.length > 0) {
        console.log(`⏸️ Skipping context injection: ${reasons.join(', ')}`);
      }
    }
  }, [isConnected, videoNumber, videoUrl, contextInjected, readyState, sendSessionSettings, sendUserInput])

  

  const handleConnect = async () => {
    setIsConnecting(true);
    setError(null);
    setContextInjected(false); // Reset context injection flag

    try {
      const configId = agentMode === 'edit_videos' 
        ? '1945e668-7e5c-49ee-9cba-262db73ef625' 
        : 'eda435d3-0a9f-4b87-9ab5-b6c44e76453e';
      
      console.log('🔌 Connecting to Hume AI...', {
        configId,
        agentMode,
        videoNumber,
        videoUrl
      });

      // Build connection config
      const connectionConfig: any = {
        auth: { type: "accessToken", value: accessToken },
        configId,
      };

      // Add context during connection if videoNumber is available
      if (videoNumber) {
        const contextText = videoUrl 
          ? `Current Video: VideoNumber=${videoNumber}, VideoURL=${videoUrl}. Use this context for all interactions in this session.`
          : `Current Video: VideoNumber=${videoNumber}. Use this context for all interactions in this session.`;
        connectionConfig.sessionSettings = {
          context: {
            text: contextText,
            type: 'persistent'
          }
        };
        console.log('📝 Adding context to connection config:', contextText);
      }
      
      await connect(connectionConfig);
      console.log('✅ Connected to Hume AI');
    } catch (err) {
      console.error('❌ Connection failed:', err);
      setError(
        err instanceof Error ? err.message : "Failed to connect to voice assistant"
      );
      setIsConnecting(false);
      setAgentState(null);
    }
  };

  const handleDisconnect = () => {
    console.log('🔌 Disconnecting from Hume AI...');
    setIsDisconnecting(true);
    setContextInjected(false); // Reset context injection flag
    disconnect();
    setError(null);
    setAgentState(null);
    setIsConnecting(false);
    // Reset disconnecting state after a brief moment
    setTimeout(() => {
      setIsDisconnecting(false);
    }, 100);
    console.log('✅ Disconnected from Hume AI');
  };

  return (
    <div className="flex h-full flex-col bg-neutral-100">
      {/* <button className="absolute top-0 right-0 text-red-300" onClick={() => console.log('messages', messages)}>Log messages</button> */}
      <div className="flex-1 overflow-y-auto p-6 flex items-center justify-center flex-col gap-4">
        {error && (
          <div className="text-sm text-red-700 bg-red-100 p-3 rounded-lg border border-red-300 max-w-md">
            {error}
          </div>
        )}
        {sessionId && videoNumber && (
          <div className="text-xs bg-purple-50 border border-purple-200 rounded-lg p-3 max-w-md">
            <p className="font-semibold text-purple-900 mb-1">Session Log</p>
            <div className="space-y-0.5 text-purple-700">
              <div><span className="font-medium">SessionID:</span> <span className="font-mono text-purple-600">{sessionId}</span></div>
              <div><span className="font-medium">Video#:</span> <span className="font-mono text-purple-600">{videoNumber}</span></div>
            </div>
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

export default function Chat({ accessToken, agentMode, sessionId, videoNumber, videoUrl }: ChatProps) {
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
      <ChatContent accessToken={accessToken} agentMode={agentMode} sessionId={sessionId} videoNumber={videoNumber} videoUrl={videoUrl} />
    </VoiceProvider>
  );
}
