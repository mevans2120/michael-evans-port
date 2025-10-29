/**
 * Chatbot Evaluation Test Script
 * Tests three improvements: response length, Casa Bonita recognition, and follow-up links
 */

interface TestCase {
  id: string;
  query: string;
  category: 'length' | 'casa-bonita' | 'links';
  expectedPatterns?: string[];
  maxParagraphs?: number;
}

interface TestResult {
  id: string;
  query: string;
  passed: boolean;
  details: string;
  response: string;
  followUps: any[];
  paragraphCount: number;
}

// Color codes for terminal output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
};

const testCases: TestCase[] = [
  // Length tests
  {
    id: '1.1',
    query: 'What is Michael Evans known for?',
    category: 'length',
    maxParagraphs: 1,
  },
  {
    id: '1.2',
    query: "Explain Michael's entire career journey from college to now",
    category: 'length',
    maxParagraphs: 2, // Complex topic allowed 2 paragraphs
  },
  {
    id: '1.3',
    query: 'Tell me about Virgin America',
    category: 'length',
    maxParagraphs: 1,
    expectedPatterns: ['Virgin America'],
  },

  // Casa Bonita tests
  {
    id: '2.1',
    query: 'Tell me about the restaurant project',
    category: 'casa-bonita',
    expectedPatterns: ['Casa Bonita', 'Trey Parker', 'Matt Stone'],
  },
  {
    id: '2.2',
    query: 'What restaurant work has Michael done?',
    category: 'casa-bonita',
    expectedPatterns: ['Casa Bonita'],
  },
  {
    id: '2.3',
    query: 'What technology did Michael build for Casa Bonita?',
    category: 'casa-bonita',
    expectedPatterns: ['reservation', 'queuing', 'membership'],
  },

  // Follow-up links tests
  {
    id: '3.1',
    query: "What are Michael's major projects?",
    category: 'links',
    expectedPatterns: ['/case-studies/'],
  },
  {
    id: '3.2',
    query: 'What AI work has Michael done?',
    category: 'links',
    expectedPatterns: ['/ai-showcase'],
  },
  {
    id: '3.3',
    query: "Tell me about Michael's experience",
    category: 'links',
  },
];

async function sendChatQuery(query: string, sessionId?: string): Promise<any> {
  try {
    const response = await fetch('http://localhost:3000/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messages: [
          {
            role: 'user',
            parts: [
              {
                type: 'text',
                text: query,
              },
            ],
          },
        ],
        sessionId: sessionId || undefined,
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    // Read the streaming response
    const reader = response.body?.getReader();
    const decoder = new TextDecoder();
    let fullResponse = '';

    if (reader) {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        fullResponse += decoder.decode(value);
      }
    }

    // Parse the Server-Sent Events response
    const lines = fullResponse.split('\n');
    let content = '';
    let followUps: any[] = [];

    // Collect all text deltas
    for (const line of lines) {
      if (line.startsWith('data: ')) {
        try {
          const jsonStr = line.substring(6); // Remove "data: " prefix
          const parsed = JSON.parse(jsonStr);

          // Accumulate text deltas
          if (parsed.type === 'text-delta' && parsed.delta) {
            content += parsed.delta;
          }
        } catch (e) {
          // Skip malformed JSON
        }
      }
    }

    // Extract follow-up questions
    const followUpPattern = /\*\*Follow-up questions:\*\*\n((?:- .+\n?)+)/i;
    const match = content.match(followUpPattern);
    if (match) {
      const questions = match[1]
        .split('\n')
        .filter(line => line.trim().startsWith('-'))
        .map(line => {
          const text = line.trim().substring(1).trim();
          const linkPattern = /^\[([^\]]+)\]\(([^)]+)\)$/;
          const linkMatch = text.match(linkPattern);
          if (linkMatch) {
            return { text: linkMatch[1], url: linkMatch[2], hasLink: true };
          }
          return { text, hasLink: false };
        });
      followUps = questions;
    }

    return { content, followUps };
  } catch (error) {
    console.error(`Error sending query: ${error}`);
    return null;
  }
}

function countParagraphs(text: string): number {
  // Remove follow-up questions section
  const mainContent = text.split('**Follow-up questions:**')[0].trim();

  // Split by double newlines (paragraph breaks)
  const paragraphs = mainContent
    .split(/\n\n+/)
    .filter(p => p.trim().length > 0);

  return paragraphs.length;
}

function evaluateTest(testCase: TestCase, response: any): TestResult {
  if (!response) {
    return {
      id: testCase.id,
      query: testCase.query,
      passed: false,
      details: 'No response received',
      response: '',
      followUps: [],
      paragraphCount: 0,
    };
  }

  const { content, followUps } = response;
  const paragraphCount = countParagraphs(content);
  let passed = true;
  let details = '';

  // Check paragraph count
  if (testCase.maxParagraphs && paragraphCount > testCase.maxParagraphs) {
    passed = false;
    details += `Expected max ${testCase.maxParagraphs} paragraphs, got ${paragraphCount}. `;
  }

  // Check expected patterns
  if (testCase.expectedPatterns) {
    for (const pattern of testCase.expectedPatterns) {
      if (!content.toLowerCase().includes(pattern.toLowerCase())) {
        passed = false;
        details += `Missing expected pattern: "${pattern}". `;
      }
    }
  }

  // Check for follow-up links in link tests
  if (testCase.category === 'links') {
    const hasLinks = followUps.some((f: any) => f.hasLink);
    if (!hasLinks && testCase.expectedPatterns) {
      passed = false;
      details += 'No follow-up links found. ';
    }

    // Check specific link patterns
    if (testCase.expectedPatterns && hasLinks) {
      const allUrls = followUps.filter((f: any) => f.hasLink).map((f: any) => f.url).join(' ');
      for (const pattern of testCase.expectedPatterns) {
        if (!allUrls.includes(pattern)) {
          passed = false;
          details += `Missing expected URL pattern: "${pattern}". `;
        }
      }
    }
  }

  if (passed) {
    details = 'All checks passed';
  }

  return {
    id: testCase.id,
    query: testCase.query,
    passed,
    details,
    response: content.substring(0, 200) + '...',
    followUps,
    paragraphCount,
  };
}

async function runTests() {
  console.log(`${colors.bright}${colors.blue}🧪 Starting Chatbot Evaluation Tests${colors.reset}\n`);
  console.log('=' .repeat(60));

  const results: TestResult[] = [];
  const sessionId = crypto.randomUUID();

  for (const testCase of testCases) {
    console.log(`\n${colors.bright}Test ${testCase.id}:${colors.reset} ${testCase.query}`);
    console.log(`Category: ${testCase.category}`);

    const response = await sendChatQuery(testCase.query, sessionId);
    const result = evaluateTest(testCase, response);
    results.push(result);

    if (result.passed) {
      console.log(`${colors.green}✓ PASSED${colors.reset}: ${result.details}`);
    } else {
      console.log(`${colors.red}✗ FAILED${colors.reset}: ${result.details}`);
    }

    console.log(`Paragraphs: ${result.paragraphCount}`);
    if (result.followUps.length > 0) {
      console.log(`Follow-ups: ${result.followUps.length} (${result.followUps.filter(f => f.hasLink).length} with links)`);
    }

    // Add delay between requests
    await new Promise(resolve => setTimeout(resolve, 2000));
  }

  // Print summary
  console.log('\n' + '=' .repeat(60));
  console.log(`${colors.bright}${colors.blue}📊 Test Summary${colors.reset}\n`);

  const categories = ['length', 'casa-bonita', 'links'];
  let totalPassed = 0;
  let totalTests = 0;

  for (const category of categories) {
    const categoryResults = results.filter(r => testCases.find(t => t.id === r.id)?.category === category);
    const passed = categoryResults.filter(r => r.passed).length;
    const total = categoryResults.length;
    totalPassed += passed;
    totalTests += total;

    const percentage = ((passed / total) * 100).toFixed(0);
    const color = passed === total ? colors.green : passed > 0 ? colors.yellow : colors.red;

    console.log(`${category.padEnd(15)} ${color}${passed}/${total} (${percentage}%)${colors.reset}`);
  }

  console.log('-' .repeat(30));
  const overallPercentage = ((totalPassed / totalTests) * 100).toFixed(0);
  const overallColor = totalPassed === totalTests ? colors.green : totalPassed > totalTests / 2 ? colors.yellow : colors.red;
  console.log(`${colors.bright}Overall:        ${overallColor}${totalPassed}/${totalTests} (${overallPercentage}%)${colors.reset}`);

  // Write detailed results to file
  const fs = await import('fs');
  const reportPath = '/Users/michaelevans/michael-evans-port-main/docs/chatbot-eval-results.json';
  const report = {
    timestamp: new Date().toISOString(),
    summary: {
      totalTests,
      passed: totalPassed,
      failed: totalTests - totalPassed,
      percentage: overallPercentage,
    },
    results,
  };

  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
  console.log(`\n${colors.bright}Detailed results saved to: ${reportPath}${colors.reset}`);
}

// Run tests
runTests().catch(console.error);