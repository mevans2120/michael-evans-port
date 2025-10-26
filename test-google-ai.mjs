/**
 * Test Google AI API
 */

import { config } from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { google } from '@ai-sdk/google';
import { embed, generateText } from 'ai';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables
config({ path: join(__dirname, '.env.local') });

const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY;

console.log('Testing Google AI API...\n');
console.log('API Key:', apiKey ? `${apiKey.substring(0, 20)}...` : 'MISSING');

if (!apiKey) {
  console.error('\n❌ Missing Google AI API key');
  process.exit(1);
}

async function testGoogleAI() {
  try {
    // Test 1: Generate embedding
    console.log('\n1. Testing text embedding...');
    const testText = 'Michael Evans is an AI and ML expert';

    const { embedding } = await embed({
      model: google.textEmbeddingModel('text-embedding-004'),
      value: testText,
    });

    console.log(`✓ Generated embedding with ${embedding.length} dimensions`);
    console.log(`  First 5 values: [${embedding.slice(0, 5).map(v => v.toFixed(4)).join(', ')}]`);

    // Test 2: Generate text with Gemini
    console.log('\n2. Testing Gemini text generation...');

    const { text } = await generateText({
      model: google('gemini-pro'),
      prompt: 'Say hello in one sentence.',
    });

    console.log(`✓ Generated text: "${text}"`);

    console.log('\n✅ All Google AI tests passed!');
    return true;
  } catch (error) {
    console.error('\n❌ Error:', error.message);
    if (error.cause) {
      console.error('Cause:', error.cause);
    }
    return false;
  }
}

testGoogleAI()
  .then(success => process.exit(success ? 0 : 1))
  .catch(error => {
    console.error('Fatal error:', error);
    process.exit(1);
  });
