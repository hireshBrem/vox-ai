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

const API_KEY = process.env.NEXT_PUBLIC_CREATOMATE_API_KEY || '3723a6d8fc904b7b97587fdb0b69bfe7c3b32bae5014db47ac0f19a3b47711d8fc665084cf1c93ea0f40f3b68dfae408';
const API_URL = 'https://api.creatomate.com/v1/renders';

export async function renderVideo(
  request: CreatomateRenderRequest
): Promise<CreatomateRenderResponse> {
  try {
    // console.log('Creatomate render request:', );
    // console.log('API_KEY:', API_KEY);
    console.log('API_URL:', API_URL);
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

/**
 * Handle trim video request with schema validation
 * Schema:
 * {
 *   "type": "object",
 *   "required": ["video_url"],
 *   "properties": {
 *     "video_url": { "type": "string", "description": "The url of the video to be edited." },
 *     "start": { "type": "integer", "description": "The start time for trim in seconds" },
 *     "end": { "type": "integer", "description": "The end time for trim in seconds" }
 *   }
 * }
 */
interface HandleTrimVideoParams {
  video_url: string;
  start?: number;
  end?: number;
}

interface HandleTrimVideoResponse {
  success: boolean;
  data?: CreatomateRenderResponse;
  error?: string;
}

export async function handleTrimVideo(
  params: HandleTrimVideoParams
): Promise<HandleTrimVideoResponse> {
  try {
    const { video_url, start, end } = params;

    // Validate required parameter
    if (!video_url || typeof video_url !== 'string') {
      return {
        success: false,
        error: 'video_url is required and must be a valid string',
      };
    }
    // Validate trim parameters if provided
    const startTime = start ?? 0;
    const endTime = end ?? startTime;

    if (typeof startTime !== 'number' || typeof endTime !== 'number') {
      return {
        success: false,
        error: 'start and end times must be valid numbers',
      };
    }

    if (startTime < 0 || endTime < 0) {
      return {
        success: false,
        error: 'start and end times cannot be negative',
      };
    }

    if (startTime >= endTime) {
      return {
        success: false,
        error: 'end time must be greater than start time',
      };
    }

    // Perform the trim
    const response = await trimVideo(video_url, startTime, endTime);
    return {
      success: true,
      data: response,
    };
  } catch (error) {
    console.error('Error in handleTrimVideo:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'An unexpected error occurred',
    };
  }
}
