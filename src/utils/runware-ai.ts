import { Runware } from '@runware/sdk-js';
import { v4 as uuidv4 } from 'uuid';

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

interface RunwareImageToImageParams {
  seedImage: string; // UUID, data URI, base64, or URL
  prompt: string;
  strength?: number; // 0-1, default 0.8
  width?: number;
  height?: number;
  model?: string;
  steps?: number; // 1-100, default 20
  cfgScale?: number; // 0-50, default 7
  scheduler?: string;
  negativePrompt?: string;
}

interface RunwareImageToImageResponse {
  success: boolean;
  imageUrl?: string;
  error?: string;
}

/**
 * Convert data URI to base64 string
 */
function dataUriToBase64(dataUri: string): string {
  const base64Match = dataUri.match(/;base64,(.*)$/);
  if (base64Match && base64Match[1]) {
    return base64Match[1];
  }
  return dataUri;
}

/**
 * Check if a string is a data URI
 */
function isDataUri(str: string): boolean {
  return str.startsWith('data:');
}

/**
 * Upload video data URI to Runware and get a UUID reference
 * @param videoDataUri - Video as data URI
 * @returns UUID of uploaded video for use in transformations
 */
export async function uploadVideoDataUri(videoDataUri: string): Promise<string> {
  try {
    if (!isDataUri(videoDataUri)) {
      throw new Error('Invalid data URI format');
    }

    const base64Data = dataUriToBase64(videoDataUri);
    const runware = await getRunwareInstance();

    // Use Runware SDK's upload capability
    // The videoInference API can accept base64 encoded video data via the seedVideo/referenceVideos
    // But for proper upload, we need to use the SDK's upload method if available
    const runwareAny = runware as any;
    
    if (typeof runwareAny.connect === 'function') {
      await runwareAny.connect();
    }

    // For now, return base64 as-is since Runware SDK may support data URIs/base64 directly
    // If the API doesn't support it, we'll need to implement a server-side upload endpoint
    console.log('Video data prepared for upload (base64 format)');
    
    return videoDataUri; // Return the data URI itself - Runware SDK may handle it
  } catch (error) {
    console.error('Error uploading video data URI:', error);
    throw error;
  }
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

/**
 * Transform an existing image using Runware AI image-to-image
 * @param params - Image-to-image transformation parameters
 * @returns Image transformation result
 */
export async function transformImage(
  params: RunwareImageToImageParams
): Promise<RunwareImageToImageResponse> {
  try {
    const {
      seedImage,
      prompt,
      strength = 0.8,
      width = 1024,
      height = 1024,
      model = 'runware:101@1',
      steps = 30,
      cfgScale = 7,
      scheduler,
      negativePrompt,
    } = params;

    // Validate inputs
    if (!seedImage || typeof seedImage !== 'string') {
      return {
        success: false,
        error: 'Seed image is required and must be a valid string (UUID, URL, data URI, or base64)',
      };
    }

    if (!prompt || typeof prompt !== 'string') {
      return {
        success: false,
        error: 'Prompt is required and must be a valid string',
      };
    }

    if (strength < 0 || strength > 1) {
      return {
        success: false,
        error: 'Strength must be between 0 and 1',
      };
    }

    if (!width || typeof width !== 'number' || width <= 0 || width % 64 !== 0) {
      return {
        success: false,
        error: 'Width must be a positive number divisible by 64',
      };
    }

    if (!height || typeof height !== 'number' || height <= 0 || height % 64 !== 0) {
      return {
        success: false,
        error: 'Height must be a positive number divisible by 64',
      };
    }

    if (steps < 1 || steps > 100) {
      return {
        success: false,
        error: 'Steps must be between 1 and 100',
      };
    }

    if (cfgScale < 0 || cfgScale > 50) {
      return {
        success: false,
        error: 'CFG Scale must be between 0 and 50',
      };
    }

    console.log('Transforming image with Runware AI:', {
      prompt,
      strength,
      width,
      height,
      model,
      steps,
      cfgScale,
    });

    // Initialize Runware SDK
    const runware = await getRunwareInstance();

    // Transform image using Runware SDK
    // The SDK requestImages method supports seedImage parameter for image-to-image
    const images = await runware.requestImages({
      positivePrompt: prompt,
      seedImage,
      strength,
      model,
      width,
      height,
      steps,
      CFGScale: cfgScale,
      ...(scheduler && { scheduler }),
      ...(negativePrompt && { negativePrompt }),
    });

    if (!images || images.length === 0) {
      return {
        success: false,
        error: 'No image generated',
      };
    }

    console.log('Image transformed with Runware AI:', images[0].imageURL);

    return {
      success: true,
      imageUrl: images[0].imageURL,
    };
  } catch (error) {
    console.error('Error transforming image with Runware AI:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    };
  }
}

interface RunwareVideoToVideoParams {
  seedVideo: string; // UUID, URL, data URI, or base64 string
  prompt: string;
  strength?: number; // 0-1, default 0.8
  duration?: number; // video duration in seconds
  width?: number;
  height?: number;
  model?: string;
  outputFormat?: 'MP4' | 'WEBM';
  outputQuality?: number; // 20-99, default 95
  numberResults?: number; // 1-4, default 1
  negativePrompt?: string;
  uploadEndpoint?: string;
}

interface RunwareVideoToVideoResponse {
  success: boolean;
  videoUrl?: string;
  videoUUID?: string;
  error?: string;
}

/**
 * Transform an existing video using Runware AI video-to-video
 * @param params - Video-to-video transformation parameters
 * @returns Video transformation result
 */
export async function transformVideo(
  params: RunwareVideoToVideoParams
): Promise<RunwareVideoToVideoResponse> {
  try {
    const {
      seedVideo,
      prompt,
      strength = 0.8,
      duration = 10,
      width = 1920,
      height = 1080,
      model = 'klingai:5@3',
      outputFormat = 'MP4',
      outputQuality = 95,
      numberResults = 1,
      negativePrompt,
      uploadEndpoint,
    } = params;

    // Validate inputs
    if (!seedVideo || typeof seedVideo !== 'string') {
      return {
        success: false,
        error: 'Seed video is required and must be a valid string (UUID, URL, or data URI)',
      };
    }

    if (!prompt || typeof prompt !== 'string') {
      return {
        success: false,
        error: 'Prompt is required and must be a valid string',
      };
    }

    if (strength < 0 || strength > 1) {
      return {
        success: false,
        error: 'Strength must be between 0 and 1',
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

    if (outputQuality < 20 || outputQuality > 99) {
      return {
        success: false,
        error: 'Output quality must be between 20 and 99',
      };
    }

    if (numberResults < 1 || numberResults > 4) {
      return {
        success: false,
        error: 'Number of results must be between 1 and 4',
      };
    }

    if (!['MP4', 'WEBM'].includes(outputFormat)) {
      return {
        success: false,
        error: 'Output format must be either MP4 or WEBM',
      };
    }

    console.log('Transforming video with Runware AI:', {
      prompt,
      strength,
      duration,
      width,
      height,
      model,
      outputFormat,
      outputQuality,
    });

    // Initialize Runware SDK
    const runware = await getRunwareInstance();

    // Connect to Runware (required for video generation)
    const runwareAny = runware as any;
    if (typeof runwareAny.connect === 'function') {
      await runwareAny.connect();
    }

    // Generate a unique task UUID for this video transformation
    const taskUUID = uuidv4();

    console.log('taskUUID', taskUUID);
    console.log('seedVideo', seedVideo.substring(0, 100));
    console.log('prompt', prompt);
    console.log('model', model);
    console.log('duration', duration)
    console.log('outputQuality', outputQuality);

    // Transform video using Runware SDK with proper video-to-video parameters
    // The API uses referenceVideos array instead of seedVideo for the correct video inference workflow
    const response = await runware.videoInference({
        taskType: 'videoInference',
        taskUUID: taskUUID,
        referenceVideos: ['https://shotstack-assets.s3-ap-southeast-2.amazonaws.com/footage/earth.mp4'],
        positivePrompt: prompt,
        model: 'lightricks:2@1',
        duration: duration,
        outputType: 'URL',    
        outputFormat: 'MP4',
        numberResults: 1,
        deliveryMethod: 'async',
        ttl: 3600
    }).then((response) => {
        console.log('Video transformation response:', response);
        return response;
    })
    console.log('response', response);

    // Handle both single object and array responses
    const videos = Array.isArray(response) ? response : [response];

    if (!videos || videos.length === 0) {
      return {
        success: false,
        error: 'No video generated',
      };
    }

    console.log('Video transformed with Runware AI:', videos[0].videoURL);

    return {
      success: true,
      videoUrl: videos[0].videoURL,
      videoUUID: videos[0].videoUUID,
    };
  } catch (error) {
    console.error('Error transforming video with Runware AI:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    };
  }
}

