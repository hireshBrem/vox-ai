"use server";

import { indexVideoFromURL, getVideoIdByTaskId as getVideoIdByTaskIdUtil } from "@/utils/memories-ai";

interface UploadVideoFromUrlParams {
  videoUrls: string[];
  uniqueId?: string;
  callbackUrl?: string;
  quality?: number;
  isPublic?: boolean;
}

interface UploadVideoResult {
  success: boolean;
  taskId?: string;
  error?: string;
}

/**
 * Server action to upload videos from platform URLs (TikTok, Instagram, YouTube, etc.)
 * @param params - Upload parameters including video URLs and optional settings
 * @returns Upload result with task ID or error message
 */
export async function uploadVideoFromUrl(
  params: UploadVideoFromUrlParams
): Promise<UploadVideoResult> {
  try {
    const {
      videoUrls,
      uniqueId = "default",
      callbackUrl,
      quality = 720,
      isPublic = false,
    } = params;

    // Validate inputs
    if (!videoUrls || videoUrls.length === 0) {
      return {
        success: false,
        error: "Video URLs are required",
      };
    }

    if (videoUrls.some((url) => !url || typeof url !== "string")) {
      return {
        success: false,
        error: "All video URLs must be valid strings",
      };
    }

    if (quality && (quality < 360 || quality > 4096)) {
      return {
        success: false,
        error: "Quality must be between 360 and 4096",
      };
    }

    // Call the Memories AI API
    const response = await indexVideoFromURL(videoUrls, {
      uniqueId,
      callbackUrl,
      quality,
      isPublic,
    });
    // console.log('indexVideoFromURL response:', response);

    if (!response) {
      return {
        success: false,
        error: "Failed to upload videos",
      };
    }

    if (!response.success) {
      return {
        success: false,
        error: response.msg || "Unknown error occurred",
      };
    }

    return {
      success: true,
      taskId: response.data?.taskId,
    };
  } catch (error) {
    console.error("Error in uploadVideoFromUrl:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "An unexpected error occurred",
    };
  }
}

interface GetVideoIdByTaskIdParams {
  taskId: string;
}

interface VideoDetail {
  video_no: string;
  video_name: string;
  duration: string;
  video_url: string;
  status: string;
  size: number | null;
  fps: number | null;
  width: number | null;
  height: number | null;
  create_time: string;
  resolution_label: string | null;
}

interface GetVideoIdByTaskIdResult {
  success: boolean;
  videos?: VideoDetail[];
  error?: string;
}

/**
 * Server action to get video IDs by task ID
 * @param params - Parameters including task ID
 * @returns Result with video details or error message
 */
export async function getVideoIdByTaskId(
  params: GetVideoIdByTaskIdParams
): Promise<GetVideoIdByTaskIdResult> {
  try {
    const { taskId } = params;

    // Validate inputs
    if (!taskId || typeof taskId !== "string") {
      return {
        success: false,
        error: "Task ID is required and must be a valid string",
      };
    }

    // Call the Memories AI API
    const response = await getVideoIdByTaskIdUtil(taskId);
    console.log('getVideoIdByTaskId response:', response?.data);
    if (!response) {
      return {
        success: false,
        error: "Failed to retrieve video IDs",
      };
    }

    if (!response.success) {
      return {
        success: false,
        error: response.msg || "Unknown error occurred",
      };
    }

    return {
      success: true,
      videos: response.data?.videos,
    };
  } catch (error) {
    console.error("Error in getVideoIdByTaskId:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "An unexpected error occurred",
    };
  }
}