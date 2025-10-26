"use client";

import { VoiceProvider } from "@humeai/voice-react";
import { SparklingSphere } from "@/components/sparkling-sphere";
import { StartCall } from "@/components/start-call";
import { Orb } from "@/components/ui/orb"
import { useState } from "react";
import { Button } from "./ui/button";
import { AnimatePresence } from "framer-motion";
import { motion } from "framer-motion";
import { Loader2Icon, PhoneIcon, PhoneOffIcon } from "lucide-react";
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

  const [agentState, setAgentState] = useState<"thinking" | "listening" | "talking" | null>(null)

  return (
    <VoiceProvider>
      <div className="flex h-full flex-col bg-neutral-100">
        <div className="flex-1 overflow-y-auto p-6 flex items-center justify-center flex-col gap-4">
            {/* <SparklingSphere /> */}
            <Orb agentState={agentState} seed={(1 + 1) * 1000} volumeMode="manual" className="w-32 h-32" colors={["#6E56CF", "#6E56CF"]} />
            <p className="text-lg font-semibold text-black">Customer Support</p>
            <p className="text-sm text-neutral-500">Tap to start voice chat</p>
            <Button
            onClick={() => setAgentState("listening")}
            size="icon"
            variant="default"
            className="h-12 w-12 rounded-full"
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
                ) : agentState === "talking" ? (
                <motion.div
                    key="listening"
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.5 }}
                >
                    <PhoneOffIcon className="h-5 w-5" />
                </motion.div>
                ) : (
                <motion.div
                    key="start"
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.5 }}
                >
                    <PhoneIcon className="h-5 w-5" />
                </motion.div>
                )}
            </AnimatePresence>
            </Button>
        </div>
        
          {/* <StartCall accessToken={accessToken} /> */}
      </div>
    </VoiceProvider>
  );
}
