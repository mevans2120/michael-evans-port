/**
 * ChatSection Integration Test
 * Tests that the new ChatSection component in the navigation panel works correctly
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

async function testChatSectionIntegration() {
  log('\n🧪 ChatSection Integration Test\n', 'blue');
  log('Testing the new navigation panel chat functionality', 'gray');
  log('This verifies the chat works as it would in the UI\n', 'gray');

  const testCases = [
    {
      name: 'Welcome message + Suggested prompt click',
      message: "What's the story behind launching a restaurant with cliff diving?",
      expectedKeywords: ['Casa Bonita', 'restaurant']
    },
    {
      name: 'Follow-up question test',
      message: 'Tell me about the first responsive airline website',
      expectedKeywords: ['Virgin America', 'airline', 'responsive']
    },
    {
      name: 'Technical question',
      message: 'Show me production AI applications you\'ve built',
      expectedKeywords: ['AI', 'application']
    }
  ];

  let passed = 0;
  let failed = 0;

  for (const test of testCases) {
    log(`\nTest: ${test.name}`, 'yellow');
    log(`Question: "${test.message}"`, 'gray');

    try {
      // Simulate what ChatSection sends (v5 format with parts array)
      const requestBody = {
        messages: [
          {
            parts: [{ type: 'text', text: test.message }],
            id: 'test-msg-' + Date.now(),
            role: 'user'
          }
        ]
      };

      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      // Parse streaming response (matches how ChatSection with useChat handles it)
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let fullResponse = '';
      let chunkCount = 0;

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        chunkCount++;
        const chunk = decoder.decode(value, { stream: true });

        // Parse SSE format (same as AI SDK does)
        const lines = chunk.split('\n');
        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6);
            if (data === '[DONE]') continue;

            try {
              const parsed = JSON.parse(data);
              if (parsed.type === 'text-delta' && parsed.delta) {
                fullResponse += parsed.delta;
              }
            } catch (e) {
              // Not JSON, skip
            }
          }
        }
      }

      // Validate response
      const foundKeywords = test.expectedKeywords.filter(keyword =>
        fullResponse.toLowerCase().includes(keyword.toLowerCase())
      );

      if (fullResponse.length > 50 && foundKeywords.length > 0) {
        log(`✅ PASS - ${foundKeywords.length}/${test.expectedKeywords.length} keywords found`, 'green');
        log(`Response (${fullResponse.length} chars, ${chunkCount} chunks):`, 'gray');
        log(`"${fullResponse.substring(0, 150)}..."`, 'gray');
        passed++;
      } else {
        log(`❌ FAIL - Keywords not found or response too short`, 'red');
        log(`Expected: ${test.expectedKeywords.join(', ')}`, 'yellow');
        log(`Found: ${foundKeywords.join(', ')}`, 'yellow');
        log(`Response: "${fullResponse.substring(0, 200)}"`, 'gray');
        failed++;
      }

    } catch (error) {
      log(`❌ FAIL - ${error.message}`, 'red');
      failed++;
    }
  }

  // Summary
  log('\n' + '='.repeat(60), 'blue');
  log(`\nTest Results:`, 'yellow');
  log(`  Passed: ${passed}/${testCases.length}`, passed === testCases.length ? 'green' : 'yellow');
  log(`  Failed: ${failed}/${testCases.length}`, failed === 0 ? 'green' : 'red');

  if (passed === testCases.length) {
    log('\n✅ ChatSection Integration: ALL TESTS PASSED', 'green');
    log('The navigation panel chat is working correctly!', 'green');
  } else {
    log('\n⚠️  ChatSection Integration: SOME TESTS FAILED', 'yellow');
    log(`${passed}/${testCases.length} tests passed`, 'yellow');
  }

  log('='.repeat(60) + '\n', 'blue');

  return passed === testCases.length;
}

// Run test
testChatSectionIntegration()
  .then(success => process.exit(success ? 0 : 1))
  .catch(error => {
    console.error('Fatal error:', error);
    process.exit(1);
  });
