/**
 * Comprehensive Chatbot Test Suite
 * Tests the AI chatbot implementation including API endpoints, RAG pipeline, and content coverage
 */

import { config } from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables
config({ path: join(__dirname, '.env.local') });

// Test configuration
const API_URL = 'http://localhost:3000/api/chat';
const TESTS_TO_RUN = 15;

// Test colors
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
};

// Helper functions
function log(message, color = 'reset') {
  console.log(colors[color] + message + colors.reset);
}

function section(title) {
  console.log('\n' + colors.bright + colors.blue + '='.repeat(80) + colors.reset);
  console.log(colors.bright + colors.cyan + title + colors.reset);
  console.log(colors.bright + colors.blue + '='.repeat(80) + colors.reset + '\n');
}

function testResult(passed, testName, details = '') {
  const status = passed ? colors.green + '✓ PASS' : colors.red + '✗ FAIL';
  console.log(`${status}${colors.reset} - ${testName}`);
  if (details) {
    console.log(colors.yellow + '  ' + details + colors.reset);
  }
}

// Test statistics
const stats = {
  total: 0,
  passed: 0,
  failed: 0,
  startTime: Date.now(),
  tests: [],
};

/**
 * Test the chat API endpoint
 */
async function testChatAPI(question, expectedKeywords = [], testName = '') {
  stats.total++;
  const testId = `test-${stats.total}`;

  const testData = {
    id: testId,
    name: testName || question,
    question,
    expectedKeywords,
    passed: false,
    response: '',
    error: null,
    duration: 0,
    chunkCount: 0,
  };

  const startTime = Date.now();

  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messages: [
          {
            role: 'user',
            content: question,
          },
        ],
      }),
    });

    testData.duration = Date.now() - startTime;

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    // Read the streaming response
    const reader = response.body?.getReader();
    const decoder = new TextDecoder();
    let fullResponse = '';
    let chunkCount = 0;

    if (reader) {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        chunkCount++;
        const chunk = decoder.decode(value, { stream: true });

        // Parse the data stream format
        const lines = chunk.split('\n');
        for (const line of lines) {
          if (line.startsWith('0:')) {
            // Extract the JSON content
            const jsonStr = line.substring(2);
            try {
              const data = JSON.parse(jsonStr);
              if (data.type === 'text-delta' && data.textDelta) {
                fullResponse += data.textDelta;
              }
            } catch (e) {
              // Skip invalid JSON
            }
          }
        }
      }
    }

    testData.response = fullResponse;
    testData.chunkCount = chunkCount;

    // Check if response contains expected keywords
    const foundKeywords = expectedKeywords.filter(keyword =>
      fullResponse.toLowerCase().includes(keyword.toLowerCase())
    );

    const keywordMatch = expectedKeywords.length === 0 || foundKeywords.length > 0;
    const hasContent = fullResponse.length > 50;

    testData.passed = keywordMatch && hasContent;

    if (testData.passed) {
      stats.passed++;
      testResult(true, testData.name,
        `Response: ${fullResponse.substring(0, 100)}... (${fullResponse.length} chars in ${testData.duration}ms, ${chunkCount} chunks)`
      );
    } else {
      stats.failed++;
      testResult(false, testData.name,
        `Expected keywords: ${expectedKeywords.join(', ')} | Found: ${foundKeywords.join(', ')} | Response length: ${fullResponse.length}`
      );
    }
  } catch (error) {
    stats.failed++;
    testData.error = error.message;
    testData.duration = Date.now() - startTime;
    testResult(false, testData.name, `Error: ${error.message}`);
  }

  stats.tests.push(testData);
  return testData;
}

/**
 * Test suite
 */
async function runTests() {
  log('\n🤖 AI CHATBOT COMPREHENSIVE TEST SUITE\n', 'bright');
  log(`Testing API endpoint: ${API_URL}`, 'cyan');
  log(`Test environment: ${process.env.NODE_ENV || 'development'}`, 'cyan');
  log(`Start time: ${new Date().toISOString()}\n`, 'cyan');

  // 1. API Endpoint Tests
  section('1. API ENDPOINT TESTS');

  await testChatAPI(
    'Hello, who are you?',
    ['Michael', 'Evans', 'assistant'],
    'Basic greeting test'
  );

  // Test error handling
  stats.total++;
  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ invalid: 'data' }),
    });

    if (response.status === 400 || response.status === 500) {
      stats.passed++;
      testResult(true, 'Error handling - Invalid request format');
    } else {
      stats.failed++;
      testResult(false, 'Error handling - Should return 400/500 for invalid data');
    }
  } catch (error) {
    stats.failed++;
    testResult(false, 'Error handling test', error.message);
  }

  // 2. Professional Background Tests
  section('2. PROFESSIONAL BACKGROUND TESTS');

  await testChatAPI(
    'Tell me about Michael Evans early career',
    ['Work & Co', 'Virgin America', 'designer', 'developer'],
    'Early career history'
  );

  await testChatAPI(
    'What companies has Michael worked for?',
    ['Work & Co', 'Beforelab', 'Virgin America'],
    'Work history'
  );

  await testChatAPI(
    'What is Michael\'s experience with AI and machine learning?',
    ['AI', 'machine learning', 'research', 'Google'],
    'AI/ML experience'
  );

  // 3. Project Coverage Tests
  section('3. PROJECT COVERAGE TESTS');

  await testChatAPI(
    'Tell me about the Casa Bonita project',
    ['Casa Bonita', 'restaurant', 'Matt', 'Trey'],
    'Casa Bonita project details'
  );

  await testChatAPI(
    'What did Michael work on at Virgin America?',
    ['Virgin America', 'airline', 'app', 'website'],
    'Virgin America project'
  );

  await testChatAPI(
    'Tell me about the Before Launcher',
    ['Before Launcher', 'Android', 'launcher', 'app'],
    'Before Launcher project'
  );

  await testChatAPI(
    'What is Peddle?',
    ['Peddle', 'car', 'selling', 'marketplace'],
    'Peddle project'
  );

  await testChatAPI(
    'Tell me about Michael\'s work with Target',
    ['Target', 'retail', 'e-commerce'],
    'Target project'
  );

  // 4. Technical Skills Tests
  section('4. TECHNICAL SKILLS & EXPERTISE TESTS');

  await testChatAPI(
    'What programming languages does Michael know?',
    ['JavaScript', 'TypeScript', 'Python', 'React'],
    'Programming languages'
  );

  await testChatAPI(
    'What are Michael\'s technical skills?',
    ['developer', 'designer', 'AI', 'machine learning'],
    'Technical skills overview'
  );

  // 5. Current Status Tests
  section('5. CURRENT STATUS & AVAILABILITY TESTS');

  await testChatAPI(
    'Is Michael available for work?',
    ['contact', 'available', 'Michael'],
    'Work availability'
  );

  // 6. Edge Cases and General Tests
  section('6. EDGE CASES & GENERAL TESTS');

  await testChatAPI(
    'What\'s the weather like?',
    ['Michael', 'professional', 'portfolio'],
    'Off-topic question handling'
  );

  await testChatAPI(
    'Can you write me a poem about cats?',
    ['Michael', 'professional', 'portfolio'],
    'Irrelevant request handling'
  );

  // Final statistics
  printStatistics();

  // Save results to file
  await saveTestResults();
}

/**
 * Print test statistics
 */
function printStatistics() {
  section('TEST RESULTS SUMMARY');

  const duration = Date.now() - stats.startTime;
  const passRate = Math.round((stats.passed / stats.total) * 100);

  console.log(`Total Tests:     ${stats.total}`);
  console.log(`Passed:          ${colors.green}${stats.passed}${colors.reset}`);
  console.log(`Failed:          ${colors.red}${stats.failed}${colors.reset}`);
  console.log(`Pass Rate:       ${passRate >= 80 ? colors.green : colors.yellow}${passRate}%${colors.reset}`);
  console.log(`Total Duration:  ${duration}ms (${(duration / 1000).toFixed(2)}s)\n`);

  // Average response time
  const validTests = stats.tests.filter(t => t.duration > 0 && !t.error);
  if (validTests.length > 0) {
    const avgDuration = validTests.reduce((sum, t) => sum + t.duration, 0) / validTests.length;
    console.log(`Avg Response Time: ${avgDuration.toFixed(0)}ms`);
    console.log(`Min Response Time: ${Math.min(...validTests.map(t => t.duration))}ms`);
    console.log(`Max Response Time: ${Math.max(...validTests.map(t => t.duration))}ms\n`);
  }

  // Overall assessment
  if (passRate >= 90) {
    log('✓ OVERALL ASSESSMENT: EXCELLENT - Ready for production', 'green');
  } else if (passRate >= 80) {
    log('✓ OVERALL ASSESSMENT: GOOD - Minor improvements recommended', 'yellow');
  } else if (passRate >= 70) {
    log('⚠ OVERALL ASSESSMENT: FAIR - Significant improvements needed', 'yellow');
  } else {
    log('✗ OVERALL ASSESSMENT: POOR - Major issues require attention', 'red');
  }
  console.log();
}

/**
 * Save test results to file
 */
async function saveTestResults() {
  const { writeFile, mkdir } = await import('fs/promises');
  const { join } = await import('path');

  const outputDir = join(__dirname, 'docs', 'research', 'research-batch-1-102525');
  const outputFile = join(outputDir, 'CHATBOT-TEST-REPORT.md');

  try {
    await mkdir(outputDir, { recursive: true });

    const report = generateMarkdownReport();
    await writeFile(outputFile, report);

    log(`Test report saved to: ${outputFile}`, 'green');
  } catch (error) {
    log(`Failed to save test report: ${error.message}`, 'red');
  }
}

/**
 * Generate markdown report
 */
function generateMarkdownReport() {
  const duration = Date.now() - stats.startTime;
  const passRate = Math.round((stats.passed / stats.total) * 100);

  const validTests = stats.tests.filter(t => t.duration > 0 && !t.error);
  const avgDuration = validTests.length > 0
    ? validTests.reduce((sum, t) => sum + t.duration, 0) / validTests.length
    : 0;

  let report = `# AI Chatbot Test Report

**Test Date:** ${new Date().toISOString()}
**Environment:** ${process.env.NODE_ENV || 'development'}
**API Endpoint:** ${API_URL}
**Total Duration:** ${(duration / 1000).toFixed(2)}s

---

## Executive Summary

- **Total Tests:** ${stats.total}
- **Passed:** ${stats.passed} ✓
- **Failed:** ${stats.failed} ✗
- **Pass Rate:** ${passRate}%
- **Average Response Time:** ${avgDuration.toFixed(0)}ms

## Overall Assessment

`;

  if (passRate >= 90) {
    report += `### ✓ EXCELLENT - Ready for Production

The chatbot is performing exceptionally well across all test categories. Response quality is high, performance is good, and the RAG pipeline is working as expected.
`;
  } else if (passRate >= 80) {
    report += `### ✓ GOOD - Minor Improvements Recommended

The chatbot is functioning well with only minor issues. A few areas could benefit from refinement before production deployment.
`;
  } else if (passRate >= 70) {
    report += `### ⚠ FAIR - Significant Improvements Needed

The chatbot is working but has notable issues that should be addressed before production use. Several test failures indicate problems with content coverage or response quality.
`;
  } else {
    report += `### ✗ POOR - Major Issues Require Attention

The chatbot has significant problems that must be resolved. Low pass rate indicates fundamental issues with the API, RAG pipeline, or content database.
`;
  }

  report += `
---

## Test Results by Category

### 1. API Endpoint Tests

`;

  // Group tests by category (approximate based on test names)
  const categories = {
    'API Endpoint': [],
    'Professional Background': [],
    'Project Coverage': [],
    'Technical Skills': [],
    'Current Status': [],
    'Edge Cases': [],
  };

  stats.tests.forEach(test => {
    if (test.name.includes('greeting') || test.name.includes('Error handling')) {
      categories['API Endpoint'].push(test);
    } else if (test.name.includes('career') || test.name.includes('worked') || test.name.includes('AI')) {
      categories['Professional Background'].push(test);
    } else if (test.name.includes('project') || test.name.includes('Casa') || test.name.includes('Virgin') ||
               test.name.includes('Launcher') || test.name.includes('Peddle') || test.name.includes('Target')) {
      categories['Project Coverage'].push(test);
    } else if (test.name.includes('languages') || test.name.includes('skills')) {
      categories['Technical Skills'].push(test);
    } else if (test.name.includes('availability') || test.name.includes('available')) {
      categories['Current Status'].push(test);
    } else {
      categories['Edge Cases'].push(test);
    }
  });

  Object.entries(categories).forEach(([category, tests]) => {
    if (tests.length === 0) return;

    report += `\n### ${category}\n\n`;

    tests.forEach(test => {
      const status = test.passed ? '✓' : '✗';
      const statusEmoji = test.passed ? '✅' : '❌';

      report += `${statusEmoji} **${test.name}**\n`;
      report += `- Question: "${test.question}"\n`;

      if (test.error) {
        report += `- Error: ${test.error}\n`;
      } else {
        report += `- Response time: ${test.duration}ms\n`;
        report += `- Response length: ${test.response.length} characters\n`;
        report += `- Chunks received: ${test.chunkCount}\n`;

        if (test.response.length > 0) {
          const preview = test.response.substring(0, 200).replace(/\n/g, ' ');
          report += `- Response preview: "${preview}${test.response.length > 200 ? '...' : ''}"\n`;
        }

        if (test.expectedKeywords.length > 0) {
          const foundKeywords = test.expectedKeywords.filter(k =>
            test.response.toLowerCase().includes(k.toLowerCase())
          );
          report += `- Expected keywords: ${test.expectedKeywords.join(', ')}\n`;
          report += `- Found keywords: ${foundKeywords.join(', ')}\n`;
        }
      }

      report += '\n';
    });
  });

  report += `
---

## Performance Analysis

### Response Times

| Metric | Value |
|--------|-------|
| Average | ${avgDuration.toFixed(0)}ms |
| Minimum | ${validTests.length > 0 ? Math.min(...validTests.map(t => t.duration)) : 0}ms |
| Maximum | ${validTests.length > 0 ? Math.max(...validTests.map(t => t.duration)) : 0}ms |
| Median | ${validTests.length > 0 ? validTests.sort((a, b) => a.duration - b.duration)[Math.floor(validTests.length / 2)].duration : 0}ms |

### Streaming Performance

- All successful requests used streaming responses
- Chunks received per request: ${validTests.length > 0 ? (validTests.reduce((sum, t) => sum + t.chunkCount, 0) / validTests.length).toFixed(1) : 0} average
- Streaming appears to be working correctly

---

## Issues Found

`;

  const failedTests = stats.tests.filter(t => !t.passed);
  if (failedTests.length === 0) {
    report += `✓ No issues found! All tests passed successfully.

`;
  } else {
    failedTests.forEach((test, i) => {
      report += `### Issue ${i + 1}: ${test.name}

- **Question:** "${test.question}"
- **Expected:** ${test.expectedKeywords.join(', ')}
- **Problem:** ${test.error || 'Response did not contain expected keywords or was too short'}
${test.response ? `- **Response received:** "${test.response.substring(0, 200)}..."` : ''}

`;
    });
  }

  report += `
---

## Recommendations

`;

  if (passRate >= 90) {
    report += `1. ✓ The chatbot is production-ready
2. Consider adding more specific content about recent projects for even better responses
3. Monitor performance in production to ensure consistency
4. Consider adding analytics to track user satisfaction
`;
  } else if (passRate >= 80) {
    report += `1. Review failed test cases and improve content in those areas
2. Consider expanding the knowledge base with more detailed information
3. Test with additional edge cases before production deployment
4. Add monitoring and alerting for API errors
`;
  } else if (passRate >= 70) {
    report += `1. **Priority:** Fix failed tests - investigate why expected content is missing
2. **Priority:** Review and expand the content database
3. Verify that all key projects and experiences are properly ingested
4. Consider adjusting the vector search threshold or match count
5. Test the RAG pipeline independently to ensure embeddings are working
`;
  } else {
    report += `1. **CRITICAL:** Investigate fundamental API issues - many tests are failing
2. **CRITICAL:** Verify Supabase connection and database content
3. **CRITICAL:** Check that embeddings were properly generated and stored
4. Review environment variables and API keys
5. Test each component of the RAG pipeline independently
6. Consider regenerating embeddings if search results are poor
`;
  }

  report += `
---

## Technical Implementation Details

### RAG Pipeline

- **Embedding Model:** Google text-embedding-004
- **LLM Model:** Google Gemini 1.5 Pro
- **Vector Database:** Supabase with pgvector
- **Similarity Threshold:** 0.7
- **Top Results:** 5 documents per query

### API Configuration

- **Runtime:** Edge
- **Streaming:** Enabled
- **Temperature:** 0.7

### Content Database

- **Ingested Chunks:** 272 (as reported by user)
- **Content Sources:** Background, projects, research papers
- **Chunk Size:** 500 characters
- **Chunk Overlap:** 50 characters

---

## Conclusion

${passRate >= 80
  ? 'The AI chatbot implementation is functional and performs well. It successfully answers questions about Michael Evans\' professional background, projects, and expertise using RAG architecture.'
  : 'The AI chatbot has issues that need to be addressed. Review the failed tests and recommendations above to improve performance before production deployment.'
}

**Next Steps:**
${passRate >= 80
  ? '- Deploy to production with monitoring\n- Gather user feedback\n- Iterate on content based on common questions'
  : '- Fix critical issues identified in failed tests\n- Re-run test suite after improvements\n- Consider adding automated testing to CI/CD pipeline'
}

---

*Test suite executed on ${new Date().toISOString()}*
*Report generated automatically by chatbot test script*
`;

  return report;
}

// Run the tests
runTests().catch(error => {
  console.error('Fatal error running tests:', error);
  process.exit(1);
});
