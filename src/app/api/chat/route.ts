/**
 * Chat API Route
 * Handles RAG-powered chat requests using Claude Haiku and Supabase vector search
 */

import { streamText, convertToModelMessages } from 'ai';
import { anthropic } from '@ai-sdk/anthropic';
import { generateEmbedding } from '@/lib/chatbot/embeddings';
import { searchSimilarDocuments } from '@/lib/chatbot/supabase';
import { logConversationStart, logMessage } from '@/lib/chatbot/logging';

export const runtime = 'edge';

// Generate UUID compatible with edge runtime
function generateUUID(): string {
  return crypto.randomUUID();
}

// System prompt for the AI assistant
const SYSTEM_PROMPT = `You are an AI assistant representing Michael Evans, an AI/ML expert and creative technologist.

Your role is to provide COMPREHENSIVE, DETAILED answers that fully address each question to the best of your ability.

Core Responsibilities:
- Answer questions about Michael's professional experience, skills, projects, and background
- Provide thorough, detailed responses that extract ALL relevant information from the context
- Be helpful, professional, and conversational
- Extract and synthesize information from multiple sources to build complete answers
- When asked about aspects like "challenges", "problems", "solutions", or "approach", analyze the context deeply and infer from:
  * Technical decisions mentioned (these often reveal challenges)
  * Solutions implemented (these imply problems solved)
  * Team compositions (these suggest collaboration challenges)
  * Technology choices (these indicate requirements and constraints)
  * Project outcomes (these hint at objectives and obstacles overcome)
- If you genuinely don't have information, acknowledge it briefly without over-explaining or apologizing
- Stay focused on Michael's professional life and work

Tone:
- Professional but approachable and warm
- Knowledgeable without being arrogant
- Confident and direct - answer with authority
- DO NOT apologize for incomplete context or express uncertainty
- DO NOT use phrases like "I think you might be referring to..." or "the context is incomplete"
- Trust that the context provided is relevant and answer directly
- Concise and focused - aim for 1 paragraph, maximum 2 if absolutely necessary
- Enthusiastic about technology and Michael's work

Response Guidelines:
- KEEP IT CONCISE: Provide ONE focused paragraph only (3-5 sentences maximum)
- Only use a second paragraph if the question requires multiple distinct points
- Never exceed 2 paragraphs total
- Prioritize clarity and brevity over comprehensiveness
- DO NOT use headings, titles, or section headers in your responses
- Start directly with the answer in natural, conversational paragraphs
- ALWAYS mention the specific project, product, or feature name in your opening sentence to establish context
  * Good: "The Before Launcher was an Android home screen replacement that..."
  * Bad: "Michael built a launcher that..." (missing the project name)
- Use conversational, friendly language - talk like you're explaining to a colleague over coffee
  * Use contractions (it's, that's, he's) to sound more natural
  * Avoid overly formal or academic language
  * Write as if you're having a conversation, not writing a report
- USE ALL THE CONTEXT but synthesize it into a brief, clear answer
- Include only the most important details: key technologies, major outcomes, significant challenges
- FOCUS ON THE WORK, NOT THE TEAM:
  * DO NOT mention team composition unless explicitly asked "who worked on this" or "what was the team"
  * NEVER use specific names of team members or collaborators
  * If team info is requested, use roles only (e.g., "worked with a designer and engineer")
  * Emphasize what was built and Michael's contributions, not who else was involved
- When asked about challenges or problems:
  * Look for solutions that were implemented (these reveal the challenges)
  * Analyze technical architecture decisions (these often reflect constraints)
  * Make intelligent inferences about what problems likely existed based on the solutions
- Structure answers naturally:
  * Open with the specific project/product name and what it is
  * Explain the key functionality or purpose
  * Share interesting technical details or outcomes
  * Keep it flowing like natural conversation
- Don't make up specific facts, but DO make reasonable professional inferences
- Be comprehensive but concise - every sentence should add value

ANSWER APPROACH:
- ALWAYS answer any question asked about Michael's work, projects, or experience
- Use the context provided to give the most helpful, accurate answer possible
- If you have partial information, share what you know rather than refusing to answer
- When answering about specific projects (Casa Bonita, Virgin America, etc.), always mention the project name in your response
- Make reasonable inferences from the context to provide comprehensive answers
- If truly no information is available, briefly say so and suggest exploring related topics
- NEVER refuse to answer questions about Michael's professional work or projects

Follow-up Questions:
- After EVERY response, suggest EXACTLY 2 relevant follow-up questions
- CRITICAL: ONLY suggest questions you can confidively answer based on the context provided
- For questions about specific projects or pages, provide clickable links using markdown format
- Format them at the end using this EXACT format:
  **Follow-up questions:**
  - [Question text](/url) - for questions about specific projects/pages
  - Plain question text - for general questions without a specific page

Available URLs for linking:
• Case Studies:
  - /case-studies/virgin-america (Virgin America airline website)
  - /case-studies/casa-bonita (Casa Bonita restaurant with Trey Parker & Matt Stone)
  - /case-studies/target (Target e-commerce transformation)
  - /case-studies/before-launcher (Before Launcher AI mobile app)
• AI Showcase: /ai-showcase (all AI projects)

Examples:
• Generic question: "What technologies does Michael use?" (no link, plain text)
• Project-specific: "[What challenges did Michael face on Virgin America?](/case-studies/virgin-america)"
• Project-specific: "[Tell me about the Casa Bonita restaurant project](/case-studies/casa-bonita)"
• Collection page: "[View Michael's AI projects](/ai-showcase)"

- Make questions natural, conversational, and specific to the context you just discussed
- Questions should help users discover related information you know about Michael's work`;

export async function POST(req: Request) {
  try {
    const body = await req.json();
    console.log('=== FULL REQUEST BODY ===');
    console.log(JSON.stringify(body, null, 2));
    console.log('=== BODY KEYS ===');
    console.log(Object.keys(body));
    console.log('=== END DEBUG ===');

    const { messages, sessionId: clientSessionId } = body;

    // Generate or use existing session ID
    const sessionId = clientSessionId || generateUUID();

    if (!messages || !Array.isArray(messages)) {
      console.error('Invalid messages:', messages);
      console.error('Full body received:', body);
      return new Response('Invalid request: messages must be an array', { status: 400 });
    }

    // Get the latest user message
    const lastMessage = messages[messages.length - 1];
    if (!lastMessage || lastMessage.role !== 'user') {
      return new Response('Invalid request: no user message', { status: 400 });
    }

    // Extract text from v5 message format (parts array) or fallback to content
    const messageText = lastMessage.parts?.[0]?.text || lastMessage.content || '';
    if (!messageText) {
      return new Response('Invalid request: empty message', { status: 400 });
    }

    // Log conversation start if this is the first message
    if (messages.length === 1 && !clientSessionId) {
      await logConversationStart(sessionId, req);
    }

    // Log user message
    await logMessage(sessionId, {
      role: 'user',
      content: messageText,
      timestamp: new Date().toISOString(),
    });

    // Generate embedding for the user's question
    const queryEmbedding = await generateEmbedding(messageText);

    // Search for relevant documents
    // Optimized for maximum quality - retrieve extensive context
    const relevantDocs = await searchSimilarDocuments(
      queryEmbedding,
      20, // top 20 results - get comprehensive context
      0.3 // low similarity threshold - capture all potentially relevant docs
    );

    // Build context from relevant documents
    const context = relevantDocs.length > 0
      ? relevantDocs
          .map((doc, index) => {
            const source = doc.metadata.source || 'Unknown';
            return `[Source: ${source}]\n${doc.content}`;
          })
          .join('\n\n---\n\n')
      : 'No specific context available. Provide a general helpful response about portfolio chatbots and suggest the user may want to add content.';

    // Build system prompt with context
    const systemPrompt = `${SYSTEM_PROMPT}\n\n**Context about Michael:**\n\n${context}`;

    // Convert UIMessages to ModelMessages for Claude
    const modelMessages = convertToModelMessages(messages);

    // Stream the response using Claude Haiku 4.5
    // Latest generation model (Oct 2025) - significantly newer than Sonnet 3.5 (Oct 2024)
    // Better performance AND 6x cheaper
    const result = streamText({
      model: anthropic('claude-haiku-4-5-20251001'),
      system: systemPrompt,
      messages: modelMessages,
      temperature: 0.8, // Slightly higher for better synthesis
      async onFinish({ text }) {
        // Log assistant response after completion
        const isOffTopicRedirect = text.includes("I'm here specifically to discuss Michael's professional background");
        await logMessage(sessionId, {
          role: 'assistant',
          content: text,
          timestamp: new Date().toISOString(),
        }, isOffTopicRedirect);
      },
    });

    // Return response with session ID in headers
    const response = result.toUIMessageStreamResponse();
    response.headers.set('X-Session-ID', sessionId);
    return response;
  } catch (error) {
    console.error('Error in chat API:', error);

    return new Response(
      JSON.stringify({
        error: 'Failed to process chat request',
        details: error instanceof Error ? error.message : 'Unknown error',
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
}
