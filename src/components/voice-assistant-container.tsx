import { getHumeAccessToken } from "@/utils/hume-ai";
import ChatWrapper from "./voice-assistant-panel";

export async function VoiceAssistantPanel() {
  const accessToken = await getHumeAccessToken();

  return (
    <div className="flex h-full flex-col bg-neutral-900 rounded-2xl overflow-hidden">
      <ChatWrapper accessToken={accessToken} />
    </div>
  );
}
