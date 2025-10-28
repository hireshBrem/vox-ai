import { ResizablePanels } from '@/components/resizable-panels';
import { getHumeAccessToken } from '@/utils/hume-ai';

export default async function Home() {
    const accessToken = await getHumeAccessToken();

    return (
        <div className="dark h-screen w-screen overflow-hidden text-foreground bg-neutral-300">
        <ResizablePanels
            accessToken={accessToken as string}
            initialLeftWidth={70}
            minLeftWidth={40}
            minRightWidth={25}
        />
        </div>
    );
}
