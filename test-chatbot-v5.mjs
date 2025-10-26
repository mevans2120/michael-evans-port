/**
 * Comprehensive AI SDK v5 Chatbot Test
 * Tests the full flow: API -> Streaming -> Message Parsing
 */

import 'dotenv/config';

const API_URL = 'http://localhost:3000/api/chat';

// ANSI color codes
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[36m',
  gray: '\x1b[90m',
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

async function testChatbotAPI() {
  log('\n🧪 AI SDK v5 Chatbot Comprehensive Test\n', 'blue');

  const testMessage = {
    text: 'Tell me about the Casa Bonita project'
  };

  log('1. Testing API Request Format', 'yellow');
  log(`   Sending: ${JSON.stringify(testMessage)}`, 'gray');

  const requestBody = {
    messages: [
      {
        parts: [{ type: 'text', text: testMessage.text }],
        id: 'test-msg-' + Date.now(),
        role: 'user'
      }
    ]
  };

  log(`   Request body: ${JSON.stringify(requestBody, null, 2)}`, 'gray');

  try {
    log('\n2. Making API Request...', 'yellow');
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    log(`   Status: ${response.status} ${response.statusText}`,
        response.ok ? 'green' : 'red');
    log(`   Content-Type: ${response.headers.get('content-type')}`, 'gray');

    if (!response.ok) {
      const errorText = await response.text();
      log(`   Error Response: ${errorText}`, 'red');
      return false;
    }

    log('\n3. Parsing Streaming Response...', 'yellow');

    if (!response.body) {
      log('   ❌ No response body!', 'red');
      return false;
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let fullResponse = '';
    let chunkCount = 0;
    let textChunks = [];

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      chunkCount++;
      const chunk = decoder.decode(value, { stream: true });
      fullResponse += chunk;

      // Parse SSE format
      const lines = chunk.split('\n');
      for (const line of lines) {
        if (line.startsWith('data: ')) {
          const data = line.slice(6);
          if (data === '[DONE]') {
            log('   ✓ Stream completed', 'green');
            continue;
          }

          try {
            const parsed = JSON.parse(data);
            if (parsed.type === 'text-delta' && parsed.delta) {
              textChunks.push(parsed.delta);
              process.stdout.write(colors.green + parsed.delta + colors.reset);
            } else if (parsed.type === 'start') {
              log('\n   ✓ Stream started', 'green');
            } else if (parsed.type === 'finish') {
              log('\n   ✓ Stream finished', 'green');
            }
          } catch (e) {
            // Not JSON, skip
          }
        }
      }
    }

    const assembledText = textChunks.join('');

    log('\n\n4. Validation Results:', 'yellow');
    log(`   Total chunks received: ${chunkCount}`, 'gray');
    log(`   Text chunks extracted: ${textChunks.length}`, 'gray');
    log(`   Total text length: ${assembledText.length} characters`, 'gray');

    if (assembledText.length > 0) {
      log('\n   ✅ SUCCESS: Received text response!', 'green');
      log(`\n   First 200 chars: "${assembledText.substring(0, 200)}..."`, 'blue');
      return true;
    } else {
      log('\n   ❌ FAIL: No text in response!', 'red');
      log(`\n   Raw response preview:\n${fullResponse.substring(0, 500)}`, 'gray');
      return false;
    }

  } catch (error) {
    log(`\n❌ Test Failed: ${error.message}`, 'red');
    console.error(error);
    return false;
  }
}

// Test embedding extraction
async function testMessageExtraction() {
  log('\n\n5. Testing Message Format Extraction', 'yellow');

  const testCases = [
    {
      name: 'v5 UIMessage format',
      message: {
        parts: [{ type: 'text', text: 'Hello world' }],
        id: 'test-1',
        role: 'user'
      },
      expected: 'Hello world'
    },
    {
      name: 'v4 content format (fallback)',
      message: {
        content: 'Hello world',
        id: 'test-2',
        role: 'user'
      },
      expected: 'Hello world'
    }
  ];

  for (const test of testCases) {
    const extracted = test.message.parts?.[0]?.text || test.message.content || '';
    const passed = extracted === test.expected;
    log(`   ${passed ? '✅' : '❌'} ${test.name}: "${extracted}"`,
        passed ? 'green' : 'red');
  }
}

// Run all tests
async function runTests() {
  const startTime = Date.now();

  await testMessageExtraction();
  const apiSuccess = await testChatbotAPI();

  const duration = ((Date.now() - startTime) / 1000).toFixed(2);

  log(`\n${'='.repeat(60)}`, 'blue');
  if (apiSuccess) {
    log(`✅ ALL TESTS PASSED in ${duration}s`, 'green');
    log('The chatbot is working correctly!', 'green');
  } else {
    log(`❌ TESTS FAILED in ${duration}s`, 'red');
    log('Review the errors above to debug the issue.', 'red');
  }
  log('='.repeat(60) + '\n', 'blue');

  process.exit(apiSuccess ? 0 : 1);
}

runTests();
