// video editing functions using creatomate
/*
capabilities:
- trim video
- rotate video
- resize video
*/
interface VideoElement {
  type: 'video';
  source: string;
  trim_start?: number;
  trim_duration?: number;
}

interface CreatomateRenderRequest {
  source: {
    output_format: 'mp4' | 'webm' | 'gif';
    elements: VideoElement[];
  };
}

interface CreatomateRenderResponse {
  id: string;
  status: string;
  [key: string]: any;
}

const API_KEY = process.env.NEXT_PUBLIC_CREATOMATE_API_KEY || '';
const API_URL = 'https://api.creatomate.com/v1/renders';

export async function renderVideo(
  request: CreatomateRenderRequest
): Promise<CreatomateRenderResponse> {
  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(request)
    });

    if (!response.ok) {
      throw new Error(`Creatomate API error: ${response.statusText}`);
    }

    const data = await response.json();
    console.log('Creatomate render response:', data);
    return data;
  } catch (error) {
    console.error('Creatomate render failed:', error);
    throw error;
  }
}

export async function renderVideoFromUrl(
  videoUrl: string,
  trimStart?: number,
  trimDuration?: number
): Promise<CreatomateRenderResponse> {
  const request: CreatomateRenderRequest = {
    source: {
      output_format: 'mp4',
      elements: [
        {
          type: 'video',
          source: videoUrl,
          trim_start: trimStart,
          trim_duration: trimDuration
        }
      ]
    }
  };

  return renderVideo(request);
}

export async function trimVideo(
  videoUrl: string,
  startTime: number,
  endTime: number
): Promise<CreatomateRenderResponse> {
  const trimDuration = endTime - startTime;

  if (trimDuration <= 0) {
    throw new Error('End time must be greater than start time');
  }

  const request: CreatomateRenderRequest = {
    source: {
      output_format: 'mp4',
      elements: [
        {
          type: 'video',
          source: videoUrl,
          trim_start: startTime,
          trim_duration: trimDuration
        }
      ]
    }
  };

  return renderVideo(request);
}
