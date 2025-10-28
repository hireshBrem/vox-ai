"use client";

import { useVoice } from "@humeai/voice-react";

export function Messages() {
  const { messages } = useVoice();

  if (messages.length === 0) {
    return (
      <div className="flex items-center justify-center h-full text-neutral-500">
        <div className="text-center">
          <p className="text-lg font-semibold mb-2">No messages yet</p>
          <p className="text-sm">
            Start a session to begin chatting with the voice assistant
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {messages.map((msg, index) => {
        // Filter to only show actual chat messages
        if (msg.type !== "user_message" && msg.type !== "assistant_message") {
          return null;
        }

        const isUser = msg.message.role === "user";

        return (
          <div
            key={`${msg.type}-${index}`}
            className={`flex ${isUser ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                isUser
                  ? "text-white rounded-br-none"
                  : "bg-neutral-200 text-neutral-900 rounded-bl-none"
              }`}
              style={isUser ? { backgroundColor: '#6E56CF' } : {}}
            >
              <p className="text-sm font-semibold mb-1 opacity-75">
                {isUser ? "You" : "Assistant"}
              </p>
              <p className="text-sm">{msg.message.content}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
