import * as filestack from 'filestack-js';

const client = filestack.init(process.env.NEXT_PUBLIC_FILESTACK_API_KEY || '');

export async function uploadVideo(file: File): Promise<string> {
  try {
    const result = await client.upload(file);
    console.log('Upload result:', result);
    return result.url;
  } catch (error) {
    console.error('Upload failed:', error);
    throw error;
  }
}

export function getFilestackClient() {
  return client;
}
