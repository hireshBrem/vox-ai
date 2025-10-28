/**
 * json2video API utility functions
 * Documentation: https://json2video.com/docs
 */

// Type definitions
export interface Json2VideoElement {
  type: 'video' | 'image' | 'text' | 'audio';
  src: string;
  seek?: number; // Start time in seconds
  duration?: number; // Duration in seconds
  start?: number; // When to start in the scene timeline
  width?: string | number;
  height?: string | number;
  x?: string | number;
  y?: string | number;
  [key: string]: any; // Allow additional properties
}

export interface Json2VideoScene {
  elements: Json2VideoElement[];
  duration?: number;
  background?: string;
  [key: string]: any;
}

export interface Json2VideoRequest {
  resolution: 'sd' | 'hd' | 'full-hd' | '4k' | string;
  scenes: Json2VideoScene[];
  quality?: 'low' | 'medium' | 'high';
  soundtrack?: string;
  webhook?: string;
  cache?: boolean;
  [key: string]: any;
}

export interface Json2VideoResponse {
  success: boolean;
  project: string;
  movie: string;
  status: 'pending' | 'rendering' | 'done' | 'error';
  message?: string;
  error?: string;
}

// API Configuration
const JSON2VIDEO_API_BASE_URL = 'https://api.json2video.com/v2';

/**
 * Trim a video using json2video API
 * @param videoUrl - URL of the video to trim
 * @param startTime - Start time in seconds
 * @param endTime - End time in seconds
 * @param apiKey - Optional API key (defaults to environment variable)
 * @returns Promise with the API response
 */
export async function trimVideo(
  videoUrl: string,
  startTime: number,
  endTime: number,
  apiKey?: string
): Promise<Json2VideoResponse> {
  const seekTime = startTime;
  const duration = endTime - startTime;

  if (duration <= 0) {
    throw new Error('End time must be greater than start time');
  }

  // Get API key from parameter or environment
  const key = apiKey || process.env.JSON2VIDEO_API_KEY || process.env.NEXT_PUBLIC_JSON2VIDEO_API_KEY;
  if (!key) {
    throw new Error('JSON2VIDEO_API_KEY environment variable is not set');
  }

  const request: Json2VideoRequest = {
    resolution: 'hd',
    scenes: [
      {
        elements: [
          {
            type: 'video',
            src: videoUrl,
            seek: seekTime,
            duration: duration,
          },
        ],
      },
    ],
  };

  const response = await fetch(`${JSON2VIDEO_API_BASE_URL}/movies`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': key,
    },
    body: JSON.stringify(request),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`json2video API error: ${response.status} - ${errorText}`);
  }

  return response.json();
}
