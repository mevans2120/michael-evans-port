#!/usr/bin/env npx tsx
/**
 * Phase 1 Optimization Test
 * Tests the 12 previously failing questions after Phase 1 optimizations
 */

const failingQuestions = [
  { id: 'Q1', question: "Where did Michael Evans grow up?" },
  { id: 'Q2', question: "What did Michael study in college?" },
  { id: 'Q3', question: "How did Michael get into technology?" },
  { id: 'Q7', question: "What was Michael's first job in tech?" },
  { id: 'Q10', question: "When did Michael become interested in AI?" },
  { id: 'Q17', question: "What did Michael build for HBO?" },
  { id: 'Q18', question: "Describe the Lyft project Michael worked on" },
  { id: 'Q24', question: "What AI projects has Michael built recently?" },
  { id: 'Q29', question: "Tell me about Michael opening the Portland office" },
  { id: 'SA-2', question: "How many people could the membership system handle?" },
  { id: 'SD-1', question: "How long did it take to solve?" },
  { id: 'SE-0', question: "What is Michael working on now?" }
];

async function testQuestion(id: string, question: string) {
  console.log(`\n${id}: ${question}`);
  console.log("-".repeat(50));

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
                text: question,
              },
            ],
          },
        ],
      }),
    });

    if (response.ok) {
      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let content = '';

      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          const chunk = decoder.decode(value);

          // Parse SSE format
          const lines = chunk.split('\n');
          for (const line of lines) {
            if (line.startsWith('data: ')) {
              try {
                const data = JSON.parse(line.substring(6));
                if (data.type === 'text-delta' && data.delta) {
                  content += data.delta;
                }
              } catch (e) {
                // Ignore parse errors
              }
            }
          }
        }
      }

      // Extract main response (before follow-ups)
      const mainContent = content.split('**Follow-up questions:**')[0].trim();

      // Check if it's an "I don't have" response
      const hasNoInfo = mainContent.toLowerCase().includes("i don't have") ||
                        mainContent.toLowerCase().includes("don't have specific") ||
                        mainContent.toLowerCase().includes("don't have information");

      if (hasNoInfo) {
        console.log(`❌ STILL FAILING - "I don't have information" response`);
        console.log(`Preview: ${mainContent.substring(0, 150)}...`);
      } else {
        console.log(`✅ FIXED - Has substantive answer`);
        console.log(`Preview: ${mainContent.substring(0, 150)}...`);
      }

    } else {
      console.log(`❌ Error: HTTP ${response.status}`);
    }
  } catch (error) {
    console.log(`❌ Error: ${error}`);
  }
}

async function runPhase1Test() {
  console.log("🧪 Testing Phase 1 Optimizations");
  console.log("=" .repeat(50));
  console.log("\nOptimizations applied:");
  console.log("✅ FAQ chunks added to vector DB");
  console.log("✅ Query expansion (Michael -> I/my/me)");
  console.log("✅ Retrieval: 30 results, 0.25 threshold");
  console.log("✅ Temperature: 0.6");
  console.log("\nTesting 12 previously failing questions...\n");

  let fixed = 0;
  let stillFailing = 0;

  for (const { id, question } of failingQuestions) {
    await testQuestion(id, question);

    // Check result and count
    // This is a simplified check - in reality we'd parse the response
    await new Promise(resolve => setTimeout(resolve, 2000)); // Rate limit
  }

  console.log("\n" + "=".repeat(50));
  console.log("📊 Phase 1 Test Complete");
  console.log("\nNote: Manual review needed to count exact success rate");
  console.log("Check above for ✅ FIXED vs ❌ STILL FAILING markers");
}

runPhase1Test().catch(console.error);