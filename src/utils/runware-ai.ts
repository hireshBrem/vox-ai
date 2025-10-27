import { Runware } from '@runware/sdk-js';

interface RunwareGenerateImageParams {
  prompt: string;
  width: number;
  height: number;
}

interface RunwareGenerateVideoParams {
  prompt: string;
  duration: number;
  width?: number;
  height?: number;
}

interface RunwareImageResponse {
  success: boolean;
  imageUrl?: string;
  error?: string;
}

interface RunwareVideoResponse {
  success: boolean;
  videoUrl?: string;
  error?: string;
}

/**
 * Get or create a Runware instance
 */
export async function getRunwareInstance() {
  const apiKey = process.env.NEXT_PUBLIC_RUNWARE_API_KEY;
  
  if (!apiKey) {
    throw new Error('Runware API key is not configured. Please set NEXT_PUBLIC_RUNWARE_API_KEY environment variable.');
  }

  return new Runware({ apiKey });
}

/**
 * Generate an image using Runware AI
 * @param params - Image generation parameters
 * @returns Image generation result
 */
export async function generateImage(
  params: RunwareGenerateImageParams
): Promise<RunwareImageResponse> {
  try {
    const { prompt, width, height } = params;

    // Validate inputs
    if (!prompt || typeof prompt !== 'string') {
      return {
        success: false,
        error: 'Prompt is required and must be a valid string',
      };
    }

    if (!width || typeof width !== 'number' || width <= 0) {
      return {
        success: false,
        error: 'Width must be a positive number',
      };
    }

    if (!height || typeof height !== 'number' || height <= 0) {
      return {
        success: false,
        error: 'Height must be a positive number',
      };
    }

    console.log('Generating image with Runware AI:', { prompt, width, height });

    // Initialize Runware SDK
    const runware = await getRunwareInstance();

    // Generate image using Runware SDK
    const images = await runware.requestImages({
      positivePrompt: prompt,
      model: 'runware:101@1',
      width,
      height,
    });

    if (!images || images.length === 0) {
      return {
        success: false,
        error: 'No image generated',
      };
    }

    console.log('Image generated with Runware AI:', images[0].imageURL);

    // Set image url to localStorage and dispatch event for live updates
    const imageUrl = images[0]?.imageURL || '';
    if (imageUrl) {
      localStorage.setItem('generatedImageUrl', imageUrl);
      // Dispatch custom event to notify components about the change
      window.dispatchEvent(new CustomEvent('generatedContentUpdate', { 
        detail: { type: 'image', url: imageUrl } 
      }));
    }

    return {
      success: true,
      imageUrl: images[0].imageURL,
    };
  } catch (error) {
    console.error('Error generating image with Runware AI:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    };
  }
}

/**
 * Generate a video using Runware AI
 * @param params - Video generation parameters
 * @returns Video generation result
 */
export async function generateVideo(
  params: RunwareGenerateVideoParams
): Promise<RunwareVideoResponse> {
  try {
    const { prompt, duration, width = 1920, height = 1080 } = params;

    // Validate inputs
    if (!prompt || typeof prompt !== 'string') {
      return {
        success: false,
        error: 'Prompt is required and must be a valid string',
      };
    }

    if (!duration || typeof duration !== 'number' || duration <= 0) {
      return {
        success: false,
        error: 'Duration must be a positive number',
      };
    }

    if (duration > 60) {
      return {
        success: false,
        error: 'Duration cannot exceed 60 seconds',
      };
    }

    console.log('Generating video with Runware AI:', { prompt, duration, width, height });

    // Initialize Runware SDK
    const runware = await getRunwareInstance();

    // Connect to Runware (required for video generation)
    // Using type assertion since connect method availability depends on runtime instance type
    const runwareAny = runware as any;
    if (typeof runwareAny.connect === 'function') {
      await runwareAny.connect();
    }

    // Generate video using Runware SDK
    const response = await runware.videoInference({
      positivePrompt: prompt,
      model: 'klingai:5@3',
      duration,
      width,
      height,
    });

    // Handle both single object and array responses
    const videos = Array.isArray(response) ? response : [response];

    if (!videos || videos.length === 0) {
      return {
        success: false,
        error: 'No video generated',
      };
    }
    console.log('Video generated with Runware AI:', videos[0].videoURL);

    // Set video url to localStorage and dispatch event for live updates
    const videoUrl = videos[0]?.videoURL || '';
    if (videoUrl) {
      localStorage.setItem('generatedVideoUrl', videoUrl);
      // Dispatch custom event to notify components about the change
      window.dispatchEvent(new CustomEvent('generatedContentUpdate', { 
        detail: { type: 'video', url: videoUrl } 
      }));
    }

    return {
      success: true,
      videoUrl: videos[0].videoURL,
    };
  } catch (error) {
    console.error('Error generating video with Runware AI:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    };
  }
}

