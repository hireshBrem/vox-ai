interface MemoriesAIVideo {
  id: string;
  filename: string;
  status: 'processing' | 'completed' | 'failed';
  duration: number;
  indexedAt: string;
}

interface MemoriesAIMemory {
  id: string;
  timestamp: number;
  content: string;
  type: 'visual' | 'audio' | 'text';
  confidence: number;
}

interface MemoriesAIResponse {
  success: boolean;
  data?: any;
  error?: string;
}

interface ChatRequest {
  session_id?: string;
  prompt: string;
  unique_id?: string;
}

interface ChatReference {
  video: {
    video_no: string;
    video_name: string;
    duration: string;
  };
  refItems: Array<{
    type: string;
    startTime: number;
    endTime: number;
    text: string;
  }>;
}

interface ChatThinking {
  title: string;
  content: string;
}

interface ChatPersonalResponse {
  code: string;
  msg: string;
  data: {
    role: string;
    content: string;
    refs?: ChatReference[];
    thinkings?: ChatThinking[];
  };
  session_id: string;
  failed: boolean;
  success: boolean;
}

interface StreamChunkData {
  token?: string;
  [key: string]: any;
}

const BASE_URL = 'https://api.memories.ai';

async function getAuthHeaders(): Promise<HeadersInit> {
  const apiKey = process.env.MEMORIES_AI_API_KEY;

  if (!apiKey) {
    throw new Error('MEMORIES_AI_API_KEY environment variable is not set');
  }

  return {
    "Authorization": `${apiKey}`,
    // "Content-Type": "application/json",
  };
}

interface IndexVideoFromURLRequest {
  video_urls: string[];
  unique_id?: string;
  callback_url?: string;
  quality?: number;
}

interface IndexVideoFromURLResponse {
  code: string;
  msg: string;
  data: {
    taskId: string;
  };
  failed: boolean;
  success: boolean;
}

export async function indexVideoFromURL(
  videoUrls: string[],
  options?: {
    uniqueId?: string;
    callbackUrl?: string;
    quality?: number;
    isPublic?: boolean;
  }
): Promise<IndexVideoFromURLResponse | null> {
  try {
    const endpoint = options?.isPublic
      ? '/serve/api/v1/scraper_url_public'
      : '/serve/api/v1/scraper_url';

    const payload: IndexVideoFromURLRequest = {
      video_urls: videoUrls,
      unique_id: options?.uniqueId || '2132',
      callback_url: options?.callbackUrl || 'https://b274aeb3353b.ngrok-free.app/api/memories/webhook',
      quality: options?.quality || 720,
    };
    
    const params = new URLSearchParams();
    params.append('video_urls', JSON.stringify(payload.video_urls));
    params.append('unique_id', payload.unique_id || 'default');
    if (payload.callback_url) {
      params.append('callback_url', payload.callback_url);
    }
    params.append('quality', payload.quality?.toString() || '720');

    const fullURL = `${BASE_URL}${endpoint}?${params.toString()}`;

    console.log('fullURL:', fullURL);
    
    const response = await fetch(fullURL, {
      method: "POST",
      headers: {
        "Authorization": `${process.env.MEMORIES_AI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({video_urls: payload.video_urls}),
    });

    if (!response.ok) {
      console.error(`Failed to index video from URL: ${response.statusText}`);
      return null;
    }

    const data = await response.json() as IndexVideoFromURLResponse;
    console.log('data:', data);
    return data;
  } catch (error) {
    console.error('Error indexing video from URL:', error);
    return null;
  }
}

export async function indexVideoFromURLToPrivateLibrary(
  videoUrls: string[],
  options?: {
    uniqueId?: string;
    callbackUrl?: string;
    quality?: number;
  }
): Promise<IndexVideoFromURLResponse | null> {
  return indexVideoFromURL(videoUrls, {
    ...options,
    isPublic: false,
  });
}

export async function indexVideoFromURLToPublicLibrary(
  videoUrls: string[],
  options?: {
    uniqueId?: string;
    callbackUrl?: string;
    quality?: number;
  }
): Promise<IndexVideoFromURLResponse | null> {
  return indexVideoFromURL(videoUrls, {
    ...options,
    isPublic: true,
  });
}

interface GetVideoIdByTaskIdResponse {
  code: string;
  msg: string;
  data: {
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
  };
  failed: boolean;
  success: boolean;
}

export async function getVideoIdByTaskId(
  taskId: string,
  options?: {
    uniqueId?: string;
  }
): Promise<GetVideoIdByTaskIdResponse | null> {
  try {
    const params = new URLSearchParams();
    params.append('task_id', taskId);
    params.append('unique_id', '1');

    const fullURL = `${BASE_URL}/serve/api/v1/get_video_ids_by_task_id?${params.toString()}`;

    console.log('getVideoIdByTaskId URL:', fullURL);

    const response = await fetch(fullURL, {
      method: 'GET',
      headers: {
        "Authorization": `${process.env.MEMORIES_AI_API_KEY}`,
      },
    });

    if (!response.ok) {
      console.error(`Failed to get video IDs by task ID: ${response.statusText}`);
      return null;
    }

    const data = await response.json() as GetVideoIdByTaskIdResponse;
    console.log('getVideoIdByTaskId response:', data);
    return data;
  } catch (error) {
    console.error('Error getting video IDs by task ID:', error);
    return null;
  }
}

export async function indexVideo(videoPath: string): Promise<MemoriesAIResponse> {
  try {
    const headers = await getAuthHeaders();
    const formData = new FormData();

    // In a real implementation, you would read the file from videoPath
    // For now, we'll assume the video is already available as a blob or file
    formData.append('file', new Blob(), videoPath);

    const response = await fetch(`${BASE_URL}/videos/index`, {
      method: 'POST',
      headers,
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`Failed to index video: ${response.statusText}`);
    }

    const data = await response.json();
    return {
      success: true,
      data,
    };
  } catch (error) {
    console.error('Error indexing video:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    };
  }
}

export async function getVideoIndex(videoId: string): Promise<MemoriesAIVideo | null> {
  try {
    const headers = await getAuthHeaders();

    const response = await fetch(`${BASE_URL}/videos/${videoId}`, {
      method: 'GET',
      headers: headers as HeadersInit,
    });

    if (!response.ok) {
      console.error(`Failed to fetch video index: ${response.statusText}`);
      return null;
    }

    const data = await response.json();
    return data as MemoriesAIVideo;
  } catch (error) {
    console.error('Error fetching video index:', error);
    return null;
  }
}

export async function searchMemories(query: string, videoId?: string): Promise<MemoriesAIMemory[]> {
  try {
    const headers = await getAuthHeaders();
    const params = new URLSearchParams({ q: query });

    if (videoId) {
      params.append('videoId', videoId);
    }

    const response = await fetch(`${BASE_URL}/memories/search?${params.toString()}`, {
      method: 'GET',
      headers: headers as HeadersInit,
    });

    if (!response.ok) {
      console.error(`Failed to search memories: ${response.statusText}`);
      return [];
    }

    const data = await response.json();
    return data.results as MemoriesAIMemory[];
  } catch (error) {
    console.error('Error searching memories:', error);
    return [];
  }
}

export async function getMemoryInsights(videoId: string): Promise<MemoriesAIResponse> {
  try {
    const headers = await getAuthHeaders();

    const response = await fetch(`${BASE_URL}/videos/${videoId}/insights`, {
      method: 'GET',
      headers: headers as HeadersInit,
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch insights: ${response.statusText}`);
    }

    const data = await response.json();
    return {
      success: true,
      data,
    };
  } catch (error) {
    console.error('Error fetching memory insights:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    };
  }
}

export async function deleteVideoIndex(videoId: string): Promise<MemoriesAIResponse> {
  try {
    const headers = await getAuthHeaders();

    const response = await fetch(`${BASE_URL}/videos/${videoId}`, {
      method: 'DELETE',
      headers: headers as HeadersInit,
    });

    if (!response.ok) {
      throw new Error(`Failed to delete video index: ${response.statusText}`);
    }

    return {
      success: true,
      data: { videoId },
    };
  } catch (error) {
    console.error('Error deleting video index:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    };
  }
}

export async function getVideoMemories(videoId: string): Promise<MemoriesAIMemory[]> {
  try {
    const headers = await getAuthHeaders();

    const response = await fetch(`${BASE_URL}/videos/${videoId}/memories`, {
      method: 'GET',
      headers: headers as HeadersInit,
    });

    if (!response.ok) {
      console.error(`Failed to fetch video memories: ${response.statusText}`);
      return [];
    }

    const data = await response.json();
    return data.memories as MemoriesAIMemory[];
  } catch (error) {
    console.error('Error fetching video memories:', error);
    return [];
  }
}

export async function chatPersonal(
  prompt: string,
  sessionId?: string,
  uniqueId?: string
): Promise<ChatPersonalResponse | null> {
  try {
    const headers = await getAuthHeaders();

    const payload: ChatRequest = {
      session_id: sessionId,
      prompt,
      unique_id: uniqueId || 'default',
    };

    const response = await fetch(`${BASE_URL}/serve/api/v1/chat`, {
      method: 'POST',
      headers: headers as HeadersInit,
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      console.error(`Failed to chat: ${response.statusText}`);
      return null;
    }

    const data = await response.json() as ChatPersonalResponse;
    return data;
  } catch (error) {
    console.error('Error in chat personal:', error);
    return null;
  }
}

export async function chatPersonalStream(
  prompt: string,
  onChunk: (chunk: string) => void,
  sessionId?: string,
  uniqueId?: string
): Promise<void> {
  try {
    const headers = await getAuthHeaders();

    const payload: ChatRequest = {
      session_id: sessionId,
      prompt,
      unique_id: uniqueId || 'default',
    };

    const response = await fetch(`${BASE_URL}/serve/api/v1/chat?stream=true`, {
      method: 'POST',
      headers: {
        ...(headers as Record<string, string>),
        'Accept': 'text/event-stream',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error(`Failed to stream chat: ${response.statusText}`);
    }

    const reader = response.body?.getReader();
    if (!reader) {
      throw new Error('Response body is not readable');
    }

    const decoder = new TextDecoder();
    let buffer = '';

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n');

      // Keep the last incomplete line in the buffer
      buffer = lines.pop() || '';

      for (const line of lines) {
        if (line.startsWith('data: ')) {
          const jsonStr = line.slice(6).trim();

          if (jsonStr === '[DONE]') {
            continue;
          }

          try {
            const chunk = JSON.parse(jsonStr) as StreamChunkData;
            if (chunk.token) {
              onChunk(chunk.token);
            }
          } catch (parseError) {
            console.error('Error parsing stream chunk:', parseError);
          }
        }
      }
    }

    // Process any remaining buffer
    if (buffer.startsWith('data: ')) {
      const jsonStr = buffer.slice(6).trim();
      if (jsonStr !== '[DONE]') {
        try {
          const chunk = JSON.parse(jsonStr) as StreamChunkData;
          if (chunk.token) {
            onChunk(chunk.token);
          }
        } catch (parseError) {
          console.error('Error parsing final stream chunk:', parseError);
        }
      }
    }
  } catch (error) {
    console.error('Error in chat personal stream:', error);
    throw error;
  }
}

export async function createChatSession(): Promise<string | null> {
  try {
    const headers = await getAuthHeaders();

    const response = await fetch(`${BASE_URL}/serve/api/v1/chat_session`, {
      method: 'POST',
      headers: headers as HeadersInit,
      body: JSON.stringify({}),
    });

    if (!response.ok) {
      console.error(`Failed to create chat session: ${response.statusText}`);
      return null;
    }

    const data = await response.json() as { session_id: string };
    return data.session_id;
  } catch (error) {
    console.error('Error creating chat session:', error);
    return null;
  }
}

export async function getChatHistory(
  sessionId: string
): Promise<Array<{ role: string; content: string }> | null> {
  try {
    const headers = await getAuthHeaders();

    const response = await fetch(`${BASE_URL}/serve/api/v1/chat_history/${sessionId}`, {
      method: 'GET',
      headers: headers as HeadersInit,
    });

    if (!response.ok) {
      console.error(`Failed to fetch chat history: ${response.statusText}`);
      return null;
    }

    const data = await response.json() as { messages: Array<{ role: string; content: string }> };
    return data.messages;
  } catch (error) {
    console.error('Error fetching chat history:', error);
    return null;
  }
}

export async function clearChatSession(sessionId: string): Promise<boolean> {
  try {
    const headers = await getAuthHeaders();

    const response = await fetch(`${BASE_URL}/serve/api/v1/chat_session/${sessionId}`, {
      method: 'DELETE',
      headers: headers as HeadersInit,
    });

    if (!response.ok) {
      console.error(`Failed to clear chat session: ${response.statusText}`);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error clearing chat session:', error);
    return false;
  }
}

interface ListSessionsResponse {
  code: string;
  msg: string;
  data: {
    sessions?: Array<{
      session_id: string;
      unique_id: string;
      created_at: string;
      updated_at: string;
      [key: string]: any;
    }>;
    total?: number;
    page?: number;
  };
  failed: boolean;
  success: boolean;
}

export async function listChatSessions(
  uniqueId: string,
  options?: {
    page?: number;
  }
): Promise<ListSessionsResponse | null> {
  try {
    const page = options?.page || 1;
    const params = new URLSearchParams();
    params.append('page', page.toString());
    params.append('unique_id', uniqueId);

    const fullURL = `${BASE_URL}/serve/api/v1/list_sessions?${params.toString()}`;

    console.log('listChatSessions URL:', fullURL);

    const response = await fetch(fullURL, {
      method: 'GET',
      headers: {
        "Authorization": `${process.env.MEMORIES_AI_API_KEY}`,
      },
    });

    if (!response.ok) {
      console.error(`Failed to list chat sessions: ${response.statusText}`);
      return null;
    }

    const data = await response.json() as ListSessionsResponse;
    console.log('listChatSessions response:', data);
    return data;
  } catch (error) {
    console.error('Error listing chat sessions:', error);
    return null;
  }
}

export async function getSessionDetails(
  sessionId: string,
  uniqueId: string
): Promise<ListSessionsResponse | null> {
  try {
    const params = new URLSearchParams();
    params.append('session_id', sessionId);
    params.append('unique_id', uniqueId);

    const fullURL = `${BASE_URL}/serve/api/v1/get_session_detail?${params.toString()}`;

    console.log('getSessionDetails URL:', fullURL);

    const response = await fetch(fullURL, {
      method: 'GET',
      headers: {
        "Authorization": `${process.env.MEMORIES_AI_API_KEY}`,
      },
    });

    if (!response.ok) {
      console.error(`Failed to get session details: ${response.statusText}`);
      return null;
    }

    const data = await response.json() as ListSessionsResponse;
    console.log('getSessionDetails response:', data);
    return data;
  } catch (error) {
    console.error('Error getting session details:', error);
    return null;
  }
}

interface QueryVideoRequest {
  video_nos: string[];
  prompt: string;
  session_id?: string;
  unique_id?: string;
}

export async function queryVideo(
  videoNos: string[],
  prompt: string,
  sessionId?: string,
  uniqueId?: string
): Promise<ChatPersonalResponse | null> {
  try {
    const headers = await getAuthHeaders();

    const payload: QueryVideoRequest = {
      video_nos: videoNos,
      prompt,
      session_id: sessionId,
      unique_id: uniqueId || 'default',
    };

    const response = await fetch(`${BASE_URL}/serve/api/v1/chat`, {
      method: 'POST',
      headers: headers as HeadersInit,
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      console.error(`Failed to query video: ${response.statusText}`);
      return null;
    }

    const data = await response.json() as ChatPersonalResponse;
    console.log('queryVideo response:', data);
    return data;
  } catch (error) {
    console.error('Error querying video:', error);
    return null;
  }
}
