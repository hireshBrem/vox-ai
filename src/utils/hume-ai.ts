import { fetchAccessToken } from "hume";
import { generateImage, generateVideo } from './runware-ai';
import { queryVideo } from '@/actions';

export async function getHumeAccessToken(): Promise<string> {
  let accessToken = "";

  try {
    accessToken = await fetchAccessToken({
      apiKey: String(process.env.HUME_API_KEY),
      secretKey: String(process.env.HUME_SECRET_KEY),
    });
  } catch (error) {
    console.error("Failed to fetch Hume access token:", error);
  }

  return accessToken;
}

interface GenerateImageParams {
  prompt: string;
  width: number;
  height: number;
}

interface GenerateVideoParams {
  prompt: string;
  duration: number;
}

interface HumeSendHelpers {
  success: (content: unknown) => any;
  error: (e: { error: string; code: string; level: string; content: string }) => any;
}

/**
 * Handle tool call messages from Hume AI
 * @param toolCallMessage - The tool call message from Hume AI
 * @param send - The Hume send helpers (success and error methods)
 * @returns Tool response or error message
 */
export async function handleToolCall(
  toolCallMessage: any,
  send: HumeSendHelpers
): Promise<any> {
  const { name, parameters } = toolCallMessage;

  try {
    // Parse the parameters from the Tool Call message
    const parsedParams = JSON.parse(parameters);

    if (name === 'generate_image') {
      return await handleGenerateImage(parsedParams, send);
    } else if (name === 'generate_video') {
      return await handleGenerateVideo(parsedParams, send);
    } else if (name === 'query_video') {
      return await handleQueryVideo(parsedParams, send);
    } else {
      // Tool not found
      return send.error({
        error: 'Tool not found',
        code: 'TOOL_NOT_FOUND',
        level: 'error',
        content: `The tool "${name}" was not found. Available tools: generate_image, generate_video, query_video`,
      });
    }
  } catch (error) {
    console.error('Error handling tool call:', error);
    
    return send.error({
      error: 'Failed to parse tool parameters',
      code: 'PARSE_ERROR',
      level: 'error',
      content: error instanceof Error ? error.message : 'Unknown error occurred while processing tool call',
    });
  }
}

/**
 * Handle generate_image tool call
 */
async function handleGenerateImage(
  params: GenerateImageParams,
  send: HumeSendHelpers
): Promise<any> {
  try {
    // Validate required parameters
    if (!params.prompt) {
      return send.error({
        error: 'Missing required parameter',
        code: 'MISSING_PARAM',
        level: 'warn',
        content: 'The "prompt" parameter is required for image generation',
      });
    }

    if (!params.width || !params.height) {
      return send.error({
        error: 'Missing required parameters',
        code: 'MISSING_PARAMS',
        level: 'warn',
        content: 'Both "width" and "height" parameters are required for image generation',
      });
    }

    // Call the generate image function
    const result = await generateImage({
      prompt: params.prompt,
      width: params.width,
      height: params.height,
    });

    if (!result.success || !result.imageUrl) {
      return send.error({
        error: 'Image generation failed',
        code: 'GENERATION_FAILED',
        level: 'error',
        content: result.error || 'Failed to generate image. Please try again.',
      });
    }

    // Send successful response
    return send.success({
      success: true,
      imageUrl: result.imageUrl,
      prompt: params.prompt,
      width: params.width,
      height: params.height,
      message: `Successfully generated a ${params.width}x${params.height} image. You can view it at: ${result.imageUrl}`,
    });
  } catch (error) {
    console.error('Error in handleGenerateImage:', error);
    
    return send.error({
      error: 'Image generation error',
      code: 'UNEXPECTED_ERROR',
      level: 'error',
      content: error instanceof Error ? error.message : 'An unexpected error occurred during image generation',
    });
  }
}

/**
 * Handle generate_video tool call
 */
async function handleGenerateVideo(
  params: GenerateVideoParams,
  send: HumeSendHelpers
): Promise<any> {
  try {
    // Validate required parameters
    if (!params.prompt) {
      return send.error({
        error: 'Missing required parameter',
        code: 'MISSING_PARAM',
        level: 'warn',
        content: 'The "prompt" parameter is required for video generation',
      });
    }

    if (!params.duration) {
      return send.error({
        error: 'Missing required parameter',
        code: 'MISSING_PARAM',
        level: 'warn',
        content: 'The "duration" parameter is required for video generation',
      });
    }

    // Call the generate video function
    const result = await generateVideo({
      prompt: params.prompt,
      duration: params.duration,
    });

    if (!result.success || !result.videoUrl) {
      return send.error({
        error: 'Video generation failed',
        code: 'GENERATION_FAILED',
        level: 'error',
        content: result.error || 'Failed to generate video. Please try again.',
      });
    }

    // Send successful response
    return send.success({
      success: true,
      videoUrl: result.videoUrl,
      prompt: params.prompt,
      duration: params.duration,
      message: `Successfully generated a ${params.duration}-second video. You can view it at: ${result.videoUrl}`,
    });
  } catch (error) {
    console.error('Error in handleGenerateVideo:', error);
    
    return send.error({
      error: 'Video generation error',
      code: 'UNEXPECTED_ERROR',
      level: 'error',
      content: error instanceof Error ? error.message : 'An unexpected error occurred during video generation',
    });
  }
}

/**
 * Handle query_video tool call
 */
async function handleQueryVideo(
  params: {
    videoNos: string[];
    prompt: string;
    sessionId?: string;
    uniqueId?: string | null;
  },
  send: HumeSendHelpers
): Promise<any> {
  try {
    // Validate required parameters
    if (!params.videoNos || params.videoNos.length === 0) {
      return send.error({
        error: 'Missing required parameter',
        code: 'MISSING_PARAM',
        level: 'warn',
        content: 'The "videoNos" parameter is required and must contain at least one video ID',
      });
    }

    if (!params.prompt) {
      return send.error({
        error: 'Missing required parameter',
        code: 'MISSING_PARAM',
        level: 'warn',
        content: 'The "prompt" parameter is required for video query',
      });
    }

    // Call the queryVideo action
    const result = await queryVideo({
      videoNos: params.videoNos,
      prompt: params.prompt,
      sessionId: params.sessionId,
      uniqueId: params.uniqueId || 'default',
    });

    if (!result.success) {
      return send.error({
        error: 'Video query failed',
        code: 'QUERY_FAILED',
        level: 'error',
        content: result.error || 'Failed to query videos. Please try again.',
      });
    }

    // Send successful response
    return send.success({
      success: true,
      content: result.response?.content,
      refs: result.response?.refs,
      thinkings: result.response?.thinkings,
      sessionId: result.response?.sessionId,
      videoNos: params.videoNos,
      prompt: params.prompt,
      message: `Successfully queried ${params.videoNos.length} video(s): ${result.response?.content}`,
    });
  } catch (error) {
    console.error('Error in handleQueryVideo:', error);
    
    return send.error({
      error: 'Video query error',
      code: 'UNEXPECTED_ERROR',
      level: 'error',
      content: error instanceof Error ? error.message : 'An unexpected error occurred during video query',
    });
  }
}
