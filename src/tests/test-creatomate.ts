// Load environment variables from .env files
import { config } from 'dotenv';
config({ path: '.env.local' });
config({ path: '.env' });

import { handleTrimVideo } from '@/utils/creatomate';

/**
 * Single test: handleTrimVideo with video_url, start, and end
 */
async function run() {
  console.log('\n========== Testing handleTrimVideo with start and end times ==========' + '\n');

  const videoUrl = 'https://shotstack-assets.s3-ap-southeast-2.amazonaws.com/footage/earth.mp4';
  const start = Number(process.env.TEST_TRIM_START ?? 5);
  const end = Number(process.env.TEST_TRIM_END ?? 15);

  console.log('Trimming video:');
  console.log(`  URL: ${videoUrl}`);
  console.log(`  Start: ${start} seconds`);
  console.log(`  End: ${end} seconds`);
  console.log('');

  try {
    const result = await handleTrimVideo({
      video_url: videoUrl,
      start,
      end,
    });

    if (result.success) {
      console.log('✅ Trim request successful');
      console.log('Response data:', JSON.stringify(result.data, null, 2));
    } else {
      console.log('❌ Trim request failed');
      console.log('Error:', result.error);
      process.exitCode = 1;
    }
  } catch (error) {
    console.error('❌ Test error:', error instanceof Error ? error.message : error);
    process.exitCode = 1;
  }
}

// Run single test
run();


