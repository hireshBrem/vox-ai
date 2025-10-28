// Load environment variables from .env files
import { config } from 'dotenv';
config({ path: '.env.local' });
config({ path: '.env' });

import { getRunwareInstance } from '@/utils/runware-ai';

async function testGetRunwareInstance() {
  console.log('Testing getRunwareInstance...\n');
  console.log('Environment variables check:');
  console.log('RUNWARE_API_KEY:', process.env.RUNWARE_API_KEY ? '✅ Set' : '❌ Not set');
  console.log('NEXT_PUBLIC_RUNWARE_API_KEY:', process.env.NEXT_PUBLIC_RUNWARE_API_KEY ? '✅ Set' : '❌ Not set');
  console.log('');
    
  try {
    const runware = getRunwareInstance();
    console.log('✅ Successfully created Runware instance');
    console.log('Instance type:', (runware as any).constructor.name);
    console.log('Instance:', runware);
  } catch (error) {
    console.error('❌ Error creating Runware instance:', error);
    if (error instanceof Error) {
      console.error('Error message:', error.message);
    }
  }
}

testGetRunwareInstance();


