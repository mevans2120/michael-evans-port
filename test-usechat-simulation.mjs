/**
 * Simulate what useChat hook sees from the API
 * This tests the exact format of messages the React component would receive
 */

import 'dotenv/config';

const API_URL = 'http://localhost:3000/api/chat';

// Simulate the message state that useChat would maintain
class UseChatSimulator {
  constructor() {
    this.messages = [];
    this.currentAssistantMessage = null;
  }

  // Parse UI Message Stream (what v5 sends)
  async sendMessage(text) {
    console.log('\n📤 Sending message:', text);

    // Add user message to state
    const userMessage = {
      id: 'msg-' + Date.now(),
      role: 'user',
      parts: [{ type: 'text', text }]
    };
    this.messages.push(userMessage);
    console.log('➕ Added user message:', userMessage);

    // Make API request
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages: this.messages }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('❌ API Error:', error);
      return;
    }

    console.log('\n📥 Parsing stream from API...');

    // Initialize assistant message
    this.currentAssistantMessage = {
      id: 'msg-' + (Date.now() + 1),
      role: 'assistant',
      parts: []
    };

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let textBuffer = '';

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      const chunk = decoder.decode(value, { stream: true });
      const lines = chunk.split('\n');

      for (const line of lines) {
        if (line.startsWith('data: ')) {
          const data = line.slice(6).trim();
          if (data === '[DONE]') continue;

          try {
            const event = JSON.parse(data);

            switch (event.type) {
              case 'start':
                console.log('   🟢 Stream started');
                break;

              case 'start-step':
                console.log('   🔵 Step started');
                break;

              case 'text-start':
                console.log('   📝 Text part started (id:', event.id + ')');
                // Add new text part
                this.currentAssistantMessage.parts.push({
                  type: 'text',
                  text: ''
                });
                break;

              case 'text-delta':
                console.log('   ➕ Text delta:', JSON.stringify(event.delta));
                // Append to current text part
                if (this.currentAssistantMessage.parts.length > 0) {
                  const lastPart = this.currentAssistantMessage.parts[this.currentAssistantMessage.parts.length - 1];
                  if (lastPart.type === 'text') {
                    lastPart.text += event.delta;
                    textBuffer += event.delta;
                  }
                }
                break;

              case 'text-end':
                console.log('   ✅ Text part ended');
                break;

              case 'finish-step':
                console.log('   🔵 Step finished');
                break;

              case 'finish':
                console.log('   🏁 Stream finished');
                break;
            }
          } catch (e) {
            // Not JSON, skip
          }
        }
      }
    }

    // Add assistant message to state
    this.messages.push(this.currentAssistantMessage);
    console.log('\n✅ Added assistant message:', this.currentAssistantMessage);

    return textBuffer;
  }

  // Simulate what the React component would extract
  extractContent(message) {
    // This is what our ChatInterface does
    const content = message.parts?.[0]?.text || message.content || '';
    return content;
  }

  printMessages() {
    console.log('\n📋 Final message state (what React would see):');
    console.log('='.repeat(60));

    this.messages.forEach((msg, idx) => {
      console.log(`\nMessage ${idx}:`);
      console.log('  ID:', msg.id);
      console.log('  Role:', msg.role);
      console.log('  Parts:', JSON.stringify(msg.parts, null, 4));
      console.log('  Has content property:', 'content' in msg);

      const extracted = this.extractContent(msg);
      console.log('  Extracted text:', JSON.stringify(extracted.substring(0, 100)));
      console.log('  Extracted length:', extracted.length);

      if (extracted.length === 0) {
        console.log('  ❌ WARNING: Empty text would be displayed!');
      } else {
        console.log('  ✅ Text would display correctly');
      }
    });

    console.log('\n' + '='.repeat(60));
  }
}

async function runSimulation() {
  console.log('🧪 Simulating useChat hook behavior\n');

  const chat = new UseChatSimulator();

  await chat.sendMessage('Tell me about the Casa Bonita project');

  chat.printMessages();

  // Summary
  const assistantMessages = chat.messages.filter(m => m.role === 'assistant');
  if (assistantMessages.length > 0) {
    const lastMsg = assistantMessages[assistantMessages.length - 1];
    const text = chat.extractContent(lastMsg);

    console.log('\n📊 Summary:');
    if (text.length > 0) {
      console.log('✅ Assistant message would display:', text.length, 'characters');
      console.log('   Preview:', text.substring(0, 150) + '...');
    } else {
      console.log('❌ Assistant message would be BLANK!');
      console.log('   Parts structure:', JSON.stringify(lastMsg.parts, null, 2));
    }
  }
}

runSimulation().catch(console.error);
