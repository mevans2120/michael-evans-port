#!/usr/bin/env npx tsx
/**
 * Simple Chatbot Test Runner
 * Tests 5 key questions to verify chatbot is working
 */

const testQuestions = [
  "What is Michael Evans known for?",
  "Tell me about the Casa Bonita restaurant project",
  "What was special about the Virgin America website?",
  "What AI work has Michael done?",
  "Tell me about Michael's experience with the Before Launcher"
];

async function testChatbot() {
  console.log("🧪 Testing Chatbot with 5 Key Questions\n");
  console.log("=" .repeat(50));

  for (const question of testQuestions) {
    console.log(`\nQ: ${question}`);
    console.log("-".repeat(40));

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
              content: question
            }
          ]
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
        const preview = mainContent.substring(0, 200) + (mainContent.length > 200 ? '...' : '');
        console.log(`A: ${preview}`);

        // Check for follow-up questions
        if (content.includes('**Follow-up questions:**')) {
          console.log("✅ Has follow-up questions");
        }

        // Check for links
        if (content.includes('](/')) {
          console.log("🔗 Contains clickable links");
        }

      } else {
        console.log(`❌ Error: HTTP ${response.status}`);
      }
    } catch (error) {
      console.log(`❌ Error: ${error}`);
    }

    // Delay between requests
    await new Promise(resolve => setTimeout(resolve, 2000));
  }

  console.log("\n" + "=".repeat(50));
  console.log("✅ Quick test complete!");
}

testChatbot().catch(console.error);