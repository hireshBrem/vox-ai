"use server";

import { indexVideoFromURL, getVideoIdByTaskId as getVideoIdByTaskIdUtil, listChatSessions, getSessionDetails, queryVideo as queryVideoUtil } from "@/utils/memories-ai";

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

interface ListChatSessionsParams {
  uniqueId: string;
  page?: number;
}

interface ChatSession {
  session_id: string;
  unique_id: string;
  created_at: string;
  updated_at: string;
  [key: string]: any;
}

interface ListChatSessionsResult {
  success: boolean;
  sessions?: ChatSession[];
  total?: number;
  page?: number;
  error?: string;
}

/**
 * Server action to fetch chat sessions
 * @param params - Parameters including unique ID and optional page number
 * @returns Result with chat sessions or error message
 */
export async function fetchChatSessions(
  params: ListChatSessionsParams
): Promise<ListChatSessionsResult> {
  try {
    const { uniqueId, page } = params;

    // Validate inputs
    if (!uniqueId || typeof uniqueId !== "string") {
      return {
        success: false,
        error: "Unique ID is required and must be a valid string",
      };
    }

    if (page !== undefined && (typeof page !== "number" || page < 1)) {
      return {
        success: false,
        error: "Page must be a positive number",
      };
    }

    // Call the Memories AI API
    const response = await listChatSessions(uniqueId, { page });
    console.log('fetchChatSessions response:', response?.data);

    if (!response) {
      return {
        success: false,
        error: "Failed to fetch chat sessions",
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
      sessions: response.data?.sessions,
      total: response.data?.total,
      page: response.data?.page,
    };
  } catch (error) {
    console.error("Error in fetchChatSessions:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "An unexpected error occurred",
    };
  }
}

interface GetSessionDetailsParams {
  sessionId: string;
  uniqueId: string;
}

interface SessionDetails {
  session_id: string;
  unique_id: string;
  created_at: string;
  updated_at: string;
  [key: string]: any;
}

interface GetSessionDetailsResult {
  success: boolean;
  session?: SessionDetails;
  error?: string;
}

/**
 * Server action to get details for a specific chat session
 * @param params - Parameters including session ID
 * @returns Result with session details or error message
 */
export async function getSessionDetailsAction(
  params: GetSessionDetailsParams
): Promise<GetSessionDetailsResult> {
  try {
    const { sessionId, uniqueId } = params;

    // Validate inputs
    if (!sessionId || typeof sessionId !== "string") {
      return {
        success: false,
        error: "Session ID is required and must be a valid string",
      };
    }

    if (!uniqueId || typeof uniqueId !== "string") {
      return {
        success: false,
        error: "Unique ID is required and must be a valid string",
      };
    }

    // Call the Memories AI API
    const response = await getSessionDetails(sessionId, uniqueId);
    console.log('getSessionDetails response:', response?.data);

    if (!response) {
      return {
        success: false,
        error: "Failed to retrieve session details",
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
      session: response.data?.sessions?.[0],
    };
  } catch (error) {
    console.error("Error in getSessionDetailsAction:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "An unexpected error occurred",
    };
  }
}

interface GetTaskInfoParams {
  taskId: string;
  uniqueId?: string;
}

interface TaskInfo {
  video_ids?: string[];
  videos?: Array<{
    duration: string;
    size: number | null;
    status: string;
    fps: number | null;
    width: number | null;
    height: number | null;
    video_no: string;
    video_name: string;
    create_time: string;
    video_url: string;
    resolution_label: string | null;
  }>;
}

interface GetTaskInfoResult {
  success: boolean;
  taskInfo?: TaskInfo;
  error?: string;
}

/**
 * Server action to get task information
 * @param params - Parameters including task ID and optional unique ID
 * @returns Result with task information or error message
 */
export async function getTaskInfo(
  params: GetTaskInfoParams
): Promise<GetTaskInfoResult> {
  try {
    const { taskId, uniqueId = "1" } = params;

    // Validate inputs
    if (!taskId || typeof taskId !== "string") {
      return {
        success: false,
        error: "Task ID is required and must be a valid string",
      };
    }

    if (uniqueId && typeof uniqueId !== "string") {
      return {
        success: false,
        error: "Unique ID must be a valid string",
      };
    }

    // Call the Memories AI API via utility function
    const response = await getVideoIdByTaskIdUtil(taskId);
    console.log("getTaskInfo response:", response?.data);

    if (!response) {
      return {
        success: false,
        error: "Failed to retrieve task information",
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
      taskInfo: {
        video_ids: response.data?.video_ids,
        videos: response.data?.videos,
      },
    };
  } catch (error) {
    console.error("Error in getTaskInfo:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "An unexpected error occurred",
    };
  }
}

interface QueryVideoParams {
  videoNos: string[];
  prompt: string;
  sessionId?: string;
  uniqueId?: string;
}

interface QueryVideoResult {
  success: boolean;
  response?: any;
  error?: string;
}

/**
 * Server action to query videos using Memories AI chat
 * @param params - Parameters including video IDs, prompt, session ID, and unique ID
 * @returns Result with chat response or error message
 */
export async function queryVideo(
  params: QueryVideoParams
): Promise<QueryVideoResult> {
  try {
    const { videoNos, prompt, sessionId, uniqueId } = params;

    // Validate inputs
    if (!videoNos || videoNos.length === 0) {
      return {
        success: false,
        error: "Video IDs are required",
      };
    }

    if (videoNos.some((id) => !id || typeof id !== "string")) {
      return {
        success: false,
        error: "All video IDs must be valid strings",
      };
    }

    if (!prompt || typeof prompt !== "string") {
      return {
        success: false,
        error: "Prompt is required and must be a valid string",
      };
    }

    // Call the Memories AI API
    const response = await queryVideoUtil(videoNos, prompt, sessionId, uniqueId);
    console.log("queryVideo response:", response);

    if (!response) {
      return {
        success: false,
        error: "Failed to query videos",
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
      response: {
        content: response.data?.content,
        refs: response.data?.refs,
        thinkings: response.data?.thinkings,
        sessionId: response.session_id,
      },
    };
  } catch (error) {
    console.error("Error in queryVideo:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "An unexpected error occurred",
    };
  }
}

export async function queryVideoFunction(){
    
}


