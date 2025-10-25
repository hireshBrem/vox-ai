import { VideoEditorPanel } from '@/components/video-editor-panel';
import { VoiceAssistantPanel } from '@/components/voice-assistant-container';
import { ResizablePanels } from '@/components/resizable-panels';

export default function Home() {
  return (
    <div className="dark h-screen w-screen overflow-hidden text-foreground bg-neutral-300">
      <ResizablePanels
        leftPanel={<VideoEditorPanel />}
        rightPanel={<VoiceAssistantPanel />}
        initialLeftWidth={70}
        minLeftWidth={40}
        minRightWidth={25}
      />
    </div>
  );
}
