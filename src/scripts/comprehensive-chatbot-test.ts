/**
 * Comprehensive Chatbot Test Suite
 * Tests 40 questions including 10 follow-ups to validate chatbot performance
 */

interface TestQuestion {
  id: string;
  question: string;
  category: string;
  isFollowUp?: boolean;
  parentId?: string;
}

interface TestResult {
  id: string;
  question: string;
  category: string;
  response: string;
  responseLength: number;
  followUps: Array<{
    text: string;
    hasLink: boolean;
    url?: string;
  }>;
  accuracy: 'accurate' | 'partial' | 'incorrect' | 'unknown';
  relevance: 'high' | 'medium' | 'low';
  responseTime: number;
  hasFollowUps: boolean;
  followUpLinkCount: number;
  notes: string;
}

interface ConversationScenario {
  id: string;
  name: string;
  initial: string;
  followUps: string[];
}

// Color codes for terminal output
const terminalColors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
  magenta: '\x1b[35m',
};

// All 40 test questions
const testQuestions: TestQuestion[] = [
  // Background & Education (5)
  { id: 'Q1', question: "Where did Michael Evans grow up?", category: 'Background' },
  { id: 'Q2', question: "What did Michael study in college?", category: 'Background' },
  { id: 'Q3', question: "How did Michael get into technology?", category: 'Background' },
  { id: 'Q4', question: "Tell me about Michael's early exposure to computers", category: 'Background' },
  { id: 'Q5', question: "What was Michael's first programming experience?", category: 'Background' },

  // Career Journey (5)
  { id: 'Q6', question: "How did Michael transition from English to tech?", category: 'Career' },
  { id: 'Q7', question: "What was Michael's first job in tech?", category: 'Career' },
  { id: 'Q8', question: "Describe Michael's career progression", category: 'Career' },
  { id: 'Q9', question: "What companies has Michael worked for?", category: 'Career' },
  { id: 'Q10', question: "When did Michael become interested in AI?", category: 'Career' },

  // Major Projects (8)
  { id: 'Q11', question: "What was special about the Virgin America website?", category: 'Projects' },
  { id: 'Q12', question: "Tell me about the Casa Bonita restaurant project", category: 'Projects' },
  { id: 'Q13', question: "What work did Michael do for Target?", category: 'Projects' },
  { id: 'Q14', question: "Explain the Before Launcher project", category: 'Projects' },
  { id: 'Q15', question: "What improvement did Michael achieve for Lyft?", category: 'Projects' },
  { id: 'Q16', question: "What was the Aesop case study result?", category: 'Projects' },
  { id: 'Q17', question: "Tell me about Post Pal", category: 'Projects' },
  { id: 'Q18', question: "Describe the AI Research Agent project", category: 'Projects' },

  // Technical Skills (5)
  { id: 'Q19', question: "What programming languages does Michael know?", category: 'Technical' },
  { id: 'Q20', question: "What is Michael's approach to technical architecture?", category: 'Technical' },
  { id: 'Q21', question: "How does Michael work with AI tools?", category: 'Technical' },
  { id: 'Q22', question: "What frameworks has Michael used?", category: 'Technical' },
  { id: 'Q23', question: "Describe Michael's full-stack capabilities", category: 'Technical' },

  // AI & Innovation (5)
  { id: 'Q24', question: "What AI projects has Michael built recently?", category: 'AI' },
  { id: 'Q25', question: "What is agentic engineering or vibe coding?", category: 'AI' },
  { id: 'Q26', question: "What's Michael's 'oh shit' moment with AI?", category: 'AI' },
  { id: 'Q27', question: "How many people did Michael interview for his AI research?", category: 'AI' },
  { id: 'Q28', question: "What is the AI Builders Collective?", category: 'AI' },

  // Leadership & Strategy (5)
  { id: 'Q29', question: "Tell me about Michael opening the Portland office", category: 'Leadership' },
  { id: 'Q30', question: "What leadership lessons did Michael learn at Work & Co?", category: 'Leadership' },
  { id: 'Q31', question: "What's important for working with younger generations?", category: 'Leadership' },
  { id: 'Q32', question: "What leadership roles has Michael held?", category: 'Leadership' },
  { id: 'Q33', question: "Why did Michael move from San Francisco to Portland?", category: 'Leadership' },

  // Challenges & Solutions (7)
  { id: 'Q34', question: "What was the hardest technical challenge Michael faced?", category: 'Challenges' },
  { id: 'Q35', question: "How did Michael solve the Casa Bonita queuing problem?", category: 'Challenges' },
  { id: 'Q36', question: "What challenges did Virgin America present?", category: 'Challenges' },
  { id: 'Q37', question: "Why did the Before Launcher fail as a business?", category: 'Challenges' },
  { id: 'Q38', question: "How does Michael handle multi-source research synthesis?", category: 'Challenges' },
  { id: 'Q39', question: "What's Michael's approach to offline-first mobile architecture?", category: 'Challenges' },
  { id: 'Q40', question: "How does Michael verify features in production?", category: 'Challenges' },
];

// Conversation scenarios with follow-ups
const conversationScenarios: ConversationScenario[] = [
  {
    id: 'A',
    name: 'Project Deep Dive',
    initial: 'Tell me about the Casa Bonita project',
    followUps: [
      'What specific technology stack was used?',
      'How many people could the membership system handle?'
    ]
  },
  {
    id: 'B',
    name: 'Technical Details',
    initial: 'What AI projects has Michael built?',
    followUps: [
      'Tell me more about the AI Research Agent',
      'What makes Post Pal innovative?'
    ]
  },
  {
    id: 'C',
    name: 'Career Progression',
    initial: "Explain Michael's career journey",
    followUps: [
      'What motivated the transition from Huge to Work & Co?',
      'Why did Michael start his own company?'
    ]
  },
  {
    id: 'D',
    name: 'Problem Solving',
    initial: "What was Michael's biggest challenge?",
    followUps: [
      'How long did it take to solve?',
      'What was the impact of the solution?'
    ]
  },
  {
    id: 'E',
    name: 'Current Work',
    initial: 'What is agentic engineering?',
    followUps: [
      "How is this different from traditional development?",
      'What tools does Michael use for this?'
    ]
  }
];

async function sendChatQuery(
  query: string,
  sessionId?: string
): Promise<{ content: string; followUps: any[]; responseTime: number } | null> {
  const startTime = Date.now();

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
      console.error(`HTTP error! status: ${response.status}`);
      return null;
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

    // Collect all text deltas
    for (const line of lines) {
      if (line.startsWith('data: ')) {
        try {
          const jsonStr = line.substring(6);
          const parsed = JSON.parse(jsonStr);

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
    let followUps: any[] = [];

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

    const responseTime = Date.now() - startTime;
    return { content, followUps, responseTime };
  } catch (error) {
    console.error(`Error sending query: ${error}`);
    return null;
  }
}

function countParagraphs(text: string): number {
  const mainContent = text.split('**Follow-up questions:**')[0].trim();
  const paragraphs = mainContent.split(/\n\n+/).filter(p => p.trim().length > 0);
  return paragraphs.length;
}

function evaluateAccuracy(question: string, response: string): 'accurate' | 'partial' | 'incorrect' | 'unknown' {
  const lowerResponse = response.toLowerCase();

  // CRITICAL: Check for admission of not knowing
  const admitsNotKnowing = [
    "i don't have information",
    "i don't have specific information",
    "not found in my knowledge",
    "i couldn't find",
    "no information available",
    "i don't have details",
    "not mentioned in",
    "i cannot find",
    "no specific information"
  ].some(phrase => lowerResponse.includes(phrase));

  // Check for hallucination indicators (making up specific facts)
  const hasSpecificClaim = /\b\d+\s*(percent|%|years?|months?|people|employees|users)\b/i.test(response);
  const hasCompanyName = /\b(Work & Co|Huge|Target|Virgin America|Casa Bonita|Before Labs?|Lyft|Aesop|HBO|Alaska Airlines)\b/i.test(response);
  const hasTechnicalDetail = /\b(React|Next\.js|TypeScript|Node|Python|AWS|API|database|frontend|backend)\b/i.test(response);

  // If admits not knowing, this is GOOD - mark as 'unknown' (which is correct behavior)
  if (admitsNotKnowing) {
    return 'unknown';
  }

  // Check for relevant content based on question topic
  const questionTopics: { [key: string]: RegExp[] } = {
    'grow up': [/oregon|eugene|childhood|early|hometown/i],
    'college': [/university|colorado|boulder|english|degree|study|education/i],
    'casa bonita': [/restaurant|trey|parker|stone|south park|denver|cliff diving|membership/i],
    'virgin america': [/airline|flight|responsive|website|travel/i],
    'before launcher': [/android|launcher|app|distraction|minimalist/i],
    'target': [/retail|store|client|project|work/i],
    'lyft': [/ride|driver|improvement|conversion|onboarding/i],
    'aesop': [/skincare|beauty|improvement|conversion|checkout/i],
    'post pal': [/recovery|surgery|health|medical|procedure|app/i],
    'portland': [/office|portland|work & co|oregon|team/i],
    'agentic': [/agentic|vibe coding|ai|engineering|development/i],
    'ai': [/artificial intelligence|machine learning|ai|llm|chatgpt|claude/i],
  };

  const lowerQuestion = question.toLowerCase();

  // Check if response contains relevant content for the question
  for (const [topic, patterns] of Object.entries(questionTopics)) {
    if (lowerQuestion.includes(topic)) {
      const hasRelevantContent = patterns.some(pattern => pattern.test(response));

      if (hasRelevantContent) {
        // Has relevant content and specific details
        if (hasSpecificClaim || hasCompanyName || hasTechnicalDetail) {
          return 'accurate'; // Providing specific, relevant information
        }
        return 'partial'; // Relevant but general information
      }
    }
  }

  // If response has substantial content but no topic match
  if (response.length > 100) {
    if (hasSpecificClaim || hasCompanyName || hasTechnicalDetail) {
      return 'incorrect'; // Making claims about wrong topic - potential hallucination
    }
    return 'partial'; // General response that might be helpful
  }

  // Short response without admission of not knowing
  return 'incorrect';
}

function evaluateRelevance(followUps: any[], response: string): 'high' | 'medium' | 'low' {
  if (followUps.length === 0) return 'low';

  // Check if follow-ups relate to the response content
  const responseWords = response.toLowerCase().split(/\s+/);
  let relevantCount = 0;

  for (const followUp of followUps) {
    const followUpWords = followUp.text.toLowerCase().split(/\s+/);
    const commonWords = followUpWords.filter(word =>
      responseWords.includes(word) && word.length > 3
    );
    if (commonWords.length > 0) relevantCount++;
  }

  const relevanceRatio = relevantCount / followUps.length;
  if (relevanceRatio >= 0.75) return 'high';
  if (relevanceRatio >= 0.5) return 'medium';
  return 'low';
}

async function testSingleQuestion(question: TestQuestion, sessionId: string): Promise<TestResult> {
  console.log(`  Testing ${question.id}: ${terminalColors.cyan}${question.question}${terminalColors.reset}`);

  const response = await sendChatQuery(question.question, sessionId);

  if (!response) {
    return {
      id: question.id,
      question: question.question,
      category: question.category,
      response: '',
      responseLength: 0,
      followUps: [],
      accuracy: 'incorrect',
      relevance: 'low',
      responseTime: 0,
      hasFollowUps: false,
      followUpLinkCount: 0,
      notes: 'No response received',
    };
  }

  const paragraphCount = countParagraphs(response.content);
  const accuracy = evaluateAccuracy(question.question, response.content);
  const relevance = evaluateRelevance(response.followUps, response.content);
  const followUpLinkCount = response.followUps.filter(f => f.hasLink).length;

  return {
    id: question.id,
    question: question.question,
    category: question.category,
    response: response.content.substring(0, 200) + (response.content.length > 200 ? '...' : ''),
    responseLength: paragraphCount,
    followUps: response.followUps,
    accuracy,
    relevance,
    responseTime: response.responseTime,
    hasFollowUps: response.followUps.length > 0,
    followUpLinkCount,
    notes: '',
  };
}

async function testConversationScenario(
  scenario: ConversationScenario,
  sessionId: string
): Promise<TestResult[]> {
  console.log(`\n${terminalColors.magenta}Testing Scenario ${scenario.id}: ${scenario.name}${terminalColors.reset}`);

  const results: TestResult[] = [];

  // Send initial question
  console.log(`  Initial: ${terminalColors.cyan}${scenario.initial}${terminalColors.reset}`);
  const initialResponse = await sendChatQuery(scenario.initial, sessionId);

  if (initialResponse) {
    results.push({
      id: `S${scenario.id}-0`,
      question: scenario.initial,
      category: 'Scenario',
      response: initialResponse.content.substring(0, 200) + '...',
      responseLength: countParagraphs(initialResponse.content),
      followUps: initialResponse.followUps,
      accuracy: evaluateAccuracy(scenario.initial, initialResponse.content),
      relevance: evaluateRelevance(initialResponse.followUps, initialResponse.content),
      responseTime: initialResponse.responseTime,
      hasFollowUps: initialResponse.followUps.length > 0,
      followUpLinkCount: initialResponse.followUps.filter(f => f.hasLink).length,
      notes: `Scenario ${scenario.id} initial`,
    });
  }

  // Send follow-up questions
  for (let i = 0; i < scenario.followUps.length; i++) {
    const followUp = scenario.followUps[i];
    console.log(`  Follow-up ${i + 1}: ${terminalColors.cyan}${followUp}${terminalColors.reset}`);

    await new Promise(resolve => setTimeout(resolve, 2000)); // Delay between requests

    const followUpResponse = await sendChatQuery(followUp, sessionId);

    if (followUpResponse) {
      results.push({
        id: `S${scenario.id}-${i + 1}`,
        question: followUp,
        category: 'Follow-up',
        response: followUpResponse.content.substring(0, 200) + '...',
        responseLength: countParagraphs(followUpResponse.content),
        followUps: followUpResponse.followUps,
        accuracy: evaluateAccuracy(followUp, followUpResponse.content),
        relevance: evaluateRelevance(followUpResponse.followUps, followUpResponse.content),
        responseTime: followUpResponse.responseTime,
        hasFollowUps: followUpResponse.followUps.length > 0,
        followUpLinkCount: followUpResponse.followUps.filter(f => f.hasLink).length,
        notes: `Scenario ${scenario.id} follow-up ${i + 1}`,
      });
    }
  }

  return results;
}

async function runComprehensiveTest() {
  console.log(`${terminalColors.bright}${terminalColors.blue}🚀 Starting Comprehensive Chatbot Test${terminalColors.reset}`);
  console.log(`Testing ${testQuestions.length} questions + ${conversationScenarios.length} conversation scenarios`);
  console.log('=' .repeat(70));

  const allResults: TestResult[] = [];
  const sessionId = crypto.randomUUID();

  // Phase 1: Test individual questions
  console.log(`\n${terminalColors.bright}Phase 1: Testing Individual Questions${terminalColors.reset}`);
  console.log('-' .repeat(50));

  const categories = [...new Set(testQuestions.map(q => q.category))];

  for (const category of categories) {
    console.log(`\n${terminalColors.yellow}Category: ${category}${terminalColors.reset}`);
    const categoryQuestions = testQuestions.filter(q => q.category === category);

    for (const question of categoryQuestions) {
      const result = await testSingleQuestion(question, sessionId);
      allResults.push(result);

      // Show quick status
      const statusIcon = result.accuracy === 'accurate' ? '✅' :
                        result.accuracy === 'partial' ? '⚠️' : '❌';
      const linkIcon = result.followUpLinkCount > 0 ? '🔗' : '  ';
      console.log(`    ${statusIcon} ${linkIcon} ${result.responseTime}ms | ${result.responseLength} para`);

      // Add delay between requests
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
  }

  // Phase 2: Test conversation scenarios
  console.log(`\n${terminalColors.bright}Phase 2: Testing Conversation Scenarios${terminalColors.reset}`);
  console.log('-' .repeat(50));

  for (const scenario of conversationScenarios) {
    const scenarioResults = await testConversationScenario(scenario, `scenario-${scenario.id}`);
    allResults.push(...scenarioResults);
    await new Promise(resolve => setTimeout(resolve, 3000)); // Longer delay between scenarios
  }

  // Generate comprehensive report
  console.log('\n' + '=' .repeat(70));
  console.log(`${terminalColors.bright}${terminalColors.blue}📊 Test Results Summary${terminalColors.reset}\n`);

  // Calculate metrics
  const totalQuestions = allResults.length;
  const accurateResponses = allResults.filter(r => r.accuracy === 'accurate').length;
  const partialResponses = allResults.filter(r => r.accuracy === 'partial').length;
  const incorrectResponses = allResults.filter(r => r.accuracy === 'incorrect').length;
  const unknownResponses = allResults.filter(r => r.accuracy === 'unknown').length;

  const highRelevance = allResults.filter(r => r.relevance === 'high').length;
  const mediumRelevance = allResults.filter(r => r.relevance === 'medium').length;
  const lowRelevance = allResults.filter(r => r.relevance === 'low').length;

  const withFollowUps = allResults.filter(r => r.hasFollowUps).length;
  const withLinks = allResults.filter(r => r.followUpLinkCount > 0).length;

  const avgResponseTime = allResults.reduce((sum, r) => sum + r.responseTime, 0) / totalQuestions;
  const avgParagraphs = allResults.reduce((sum, r) => sum + r.responseLength, 0) / totalQuestions;

  const oneParagraph = allResults.filter(r => r.responseLength === 1).length;
  const twoParagraphs = allResults.filter(r => r.responseLength === 2).length;
  const moreParagraphs = allResults.filter(r => r.responseLength > 2).length;

  // Display summary
  console.log(`${terminalColors.bright}Response Quality:${terminalColors.reset}`);
  console.log(`  Accurate:  ${terminalColors.green}${accurateResponses}/${totalQuestions} (${((accurateResponses/totalQuestions)*100).toFixed(1)}%)${terminalColors.reset} - Provided specific, relevant information`);
  console.log(`  Partial:   ${terminalColors.yellow}${partialResponses}/${totalQuestions} (${((partialResponses/totalQuestions)*100).toFixed(1)}%)${terminalColors.reset} - Provided general but relevant info`);
  console.log(`  Unknown:   ${terminalColors.green}${unknownResponses}/${totalQuestions} (${((unknownResponses/totalQuestions)*100).toFixed(1)}%)${terminalColors.reset} - Correctly admitted lack of info`);
  console.log(`  Incorrect: ${terminalColors.red}${incorrectResponses}/${totalQuestions} (${((incorrectResponses/totalQuestions)*100).toFixed(1)}%)${terminalColors.reset} - Potential hallucination or off-topic`);

  console.log(`\n${terminalColors.bright}Hallucination Check:${terminalColors.reset}`);
  const safeResponses = accurateResponses + partialResponses + unknownResponses;
  const hallucinationRisk = incorrectResponses;
  console.log(`  Safe responses: ${terminalColors.green}${safeResponses}/${totalQuestions} (${((safeResponses/totalQuestions)*100).toFixed(1)}%)${terminalColors.reset}`);
  console.log(`  Hallucination risk: ${terminalColors.red}${hallucinationRisk}/${totalQuestions} (${((hallucinationRisk/totalQuestions)*100).toFixed(1)}%)${terminalColors.reset}`);

  console.log(`\n${terminalColors.bright}Follow-up Relevance:${terminalColors.reset}`);
  console.log(`  High:   ${terminalColors.green}${highRelevance}/${totalQuestions} (${((highRelevance/totalQuestions)*100).toFixed(1)}%)${terminalColors.reset}`);
  console.log(`  Medium: ${terminalColors.yellow}${mediumRelevance}/${totalQuestions} (${((mediumRelevance/totalQuestions)*100).toFixed(1)}%)${terminalColors.reset}`);
  console.log(`  Low:    ${terminalColors.red}${lowRelevance}/${totalQuestions} (${((lowRelevance/totalQuestions)*100).toFixed(1)}%)${terminalColors.reset}`);

  console.log(`\n${terminalColors.bright}Response Characteristics:${terminalColors.reset}`);
  console.log(`  With Follow-ups: ${withFollowUps}/${totalQuestions} (${((withFollowUps/totalQuestions)*100).toFixed(1)}%)`);
  console.log(`  With Links:      ${withLinks}/${totalQuestions} (${((withLinks/totalQuestions)*100).toFixed(1)}%)`);
  console.log(`  Avg Response:    ${avgResponseTime.toFixed(0)}ms`);
  console.log(`  Avg Paragraphs:  ${avgParagraphs.toFixed(1)}`);

  console.log(`\n${terminalColors.bright}Paragraph Distribution:${terminalColors.reset}`);
  console.log(`  1 paragraph:  ${oneParagraph}/${totalQuestions} (${((oneParagraph/totalQuestions)*100).toFixed(1)}%)`);
  console.log(`  2 paragraphs: ${twoParagraphs}/${totalQuestions} (${((twoParagraphs/totalQuestions)*100).toFixed(1)}%)`);
  console.log(`  3+ paragraphs: ${moreParagraphs}/${totalQuestions} (${((moreParagraphs/totalQuestions)*100).toFixed(1)}%)`);

  // Category breakdown
  console.log(`\n${terminalColors.bright}Performance by Category:${terminalColors.reset}`);
  for (const category of [...categories, 'Scenario', 'Follow-up']) {
    const categoryResults = allResults.filter(r => r.category === category);
    if (categoryResults.length === 0) continue;

    const catAccurate = categoryResults.filter(r => r.accuracy === 'accurate').length;
    const catWithLinks = categoryResults.filter(r => r.followUpLinkCount > 0).length;
    const catAvgTime = categoryResults.reduce((sum, r) => sum + r.responseTime, 0) / categoryResults.length;

    console.log(`  ${category.padEnd(12)}: ${catAccurate}/${categoryResults.length} accurate, ${catWithLinks} with links, ${catAvgTime.toFixed(0)}ms avg`);
  }

  // Save detailed results
  const report = {
    timestamp: new Date().toISOString(),
    summary: {
      totalQuestions,
      accuracy: {
        accurate: accurateResponses,
        partial: partialResponses,
        incorrect: incorrectResponses,
        unknown: unknownResponses,
      },
      relevance: {
        high: highRelevance,
        medium: mediumRelevance,
        low: lowRelevance,
      },
      metrics: {
        withFollowUps,
        withLinks,
        avgResponseTime,
        avgParagraphs,
      },
      paragraphDistribution: {
        one: oneParagraph,
        two: twoParagraphs,
        moreThanTwo: moreParagraphs,
      },
    },
    results: allResults,
  };

  const fs = await import('fs');
  const reportPath = '/Users/michaelevans/michael-evans-port-main/docs/chatbot-comprehensive-results.json';
  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));

  console.log(`\n${terminalColors.bright}${terminalColors.green}✅ Comprehensive test complete!${terminalColors.reset}`);
  console.log(`Detailed results saved to: ${reportPath}`);

  // Final verdict - based on safe responses (no hallucinations)
  const safeRate = safeResponses / totalQuestions;
  const relevantAccurateRate = (accurateResponses + partialResponses) / totalQuestions;

  const verdict = safeRate >= 0.95 && relevantAccurateRate >= 0.5 ? `${terminalColors.green}EXCELLENT` :
                  safeRate >= 0.90 && relevantAccurateRate >= 0.4 ? `${terminalColors.green}GOOD` :
                  safeRate >= 0.85 && relevantAccurateRate >= 0.3 ? `${terminalColors.yellow}FAIR` :
                  `${terminalColors.red}NEEDS IMPROVEMENT`;

  console.log(`\n${terminalColors.bright}Final Verdict: ${verdict}${terminalColors.reset}`);
  console.log(`  Safety rate: ${(safeRate * 100).toFixed(1)}% (no hallucinations)`);
  console.log(`  Relevant content rate: ${(relevantAccurateRate * 100).toFixed(1)}% (accurate + partial responses)`);
}

// Run the comprehensive test
runComprehensiveTest().catch(console.error);