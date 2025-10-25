import { fetchAccessToken } from "hume";
import ChatWrapper from "./voice-assistant-panel";

export async function VoiceAssistantPanel() {
  let accessToken = "";

  try {
    accessToken = await fetchAccessToken({
      apiKey: String(process.env.HUME_API_KEY),
      secretKey: String(process.env.HUME_SECRET_KEY),
    });
  } catch (error) {
    console.error("Failed to fetch access token:", error);
  }

  return (
    <div className="flex h-full flex-col bg-neutral-900 rounded-2xl overflow-hidden">
      <ChatWrapper accessToken={accessToken} />
    </div>
  );
}
