// Load environment variables from .env files
import { config } from 'dotenv';
config({ path: '.env.local' });
config({ path: '.env' });

import { transformImage, transformVideo } from './src/utils/runware-ai';
import fs from 'fs';
import path from 'path';

/**
 * Convert file to base64 data URI
 */
function fileToDataUri(filePath: string, mimeType: string): string {
  const absolutePath = path.resolve(filePath);
  const fileData = fs.readFileSync(absolutePath);
  const base64Data = fileData.toString('base64');
  return `data:${mimeType};base64,${base64Data}`;
}

/**
 * Test transformImage function
 */
async function testTransformImage() {
  console.log('\n========== Testing transformImage ==========\n');

  // Load astronaut image as data URI
  let astronautDataUri = '';
  try {
    astronautDataUri = fileToDataUri('./astronaut.jpeg', 'image/jpeg');
    console.log('✅ Loaded astronaut.jpeg as data URI');
  } catch (error) {
    console.error('❌ Failed to load astronaut.jpeg:', error instanceof Error ? error.message : error);
    return;
  }

  // Transform astronaut image
  console.log('\nTransforming astronaut image - make it more vibrant and colorful\n');
  try {
    const result = await transformImage({
      seedImage: astronautDataUri,
      prompt: 'make the astronaut and space more vibrant and colorful, enhance the colors of Earth in background',
      strength: 0.7,
      width: 1024,
      height: 1024,
      steps: 30,
      cfgScale: 7.5,
    });
    console.log('Result:', result);
  } catch (error) {
    console.error('Error:', error instanceof Error ? error.message : error);
  }
}

/**
 * Test transformVideo function
 */
async function testTransformVideo() {
  console.log('\n========== Testing transformVideo ==========\n');

  // Load turtle video as data URI
  let turtleDataUri = '';
  try {
    turtleDataUri = fileToDataUri('./turtle.mp4', 'video/mp4');
    console.log('✅ Loaded turtle.mp4 as data URI');
  } catch (error) {
    console.error('❌ Failed to load turtle.mp4:', error instanceof Error ? error.message : error);
    return;
  }
//   log first 100 characters of turtleDataUri
console.log('turtleDataUri', turtleDataUri.substring(0, 100));
  // Transform turtle video
  console.log('\nTransforming turtle video - enhance colors and vibrancy\n');
  try {
    const result = await transformVideo({
      seedVideo: turtleDataUri,
      prompt: 'enhance the turtle video with vibrant colors, make water shimmer, add more detail and clarity',
      strength: 0.6,
      duration: 8,
      width: 1920,
      height: 1080,
      outputFormat: 'MP4',
      outputQuality: 95,
    });
    console.log('Result:', result);
  } catch (error) {
    console.error('Error:', error instanceof Error ? error.message : error);
  }
}

/**
 * Run all tests
 */
async function runAllTests() {
  try {
    // await testTransformImage();
    await testTransformVideo();
    console.log('\n========== All tests completed ==========\n');
  } catch (error) {
    console.error('Test suite error:', error);
    process.exit(1);
  }
}

// Run tests
runAllTests();
