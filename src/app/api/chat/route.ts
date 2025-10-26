/**
 * Chat API Route
 * Handles RAG-powered chat requests using Claude Haiku and Supabase vector search
 */

import { streamText } from 'ai';
import { anthropic } from '@ai-sdk/anthropic';
import { generateEmbedding } from '@/lib/chatbot/embeddings';
import { searchSimilarDocuments } from '@/lib/chatbot/supabase';

export const runtime = 'edge';

// System prompt for the AI assistant
const SYSTEM_PROMPT = `You are an AI assistant representing Michael Evans, an AI/ML expert and creative technologist.

Your role is to:
- Answer questions about Michael's professional experience, skills, projects, and background
- Be helpful, professional, and conversational
- Provide specific examples and details when available
- If you don't know something, say so honestly
- Stay focused on Michael's professional life and work

Tone:
- Professional but approachable
- Knowledgeable without being arrogant
- Clear and concise
- Enthusiastic about technology

Guidelines:
- Use the context provided to give accurate, detailed answers
- Cite specific projects or experiences when relevant
- If asked about availability for work, be positive but direct them to contact Michael
- Don't make up information not in the context
- For off-topic questions, politely redirect to Michael's professional background`;

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

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

    // Generate embedding for the user's question
    const queryEmbedding = await generateEmbedding(messageText);

    // Search for relevant documents
    const relevantDocs = await searchSimilarDocuments(
      queryEmbedding,
      5, // top 5 results
      0.7 // minimum similarity threshold
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

    // Construct the enhanced prompt with context
    const enhancedMessages = [
      {
        role: 'system' as const,
        content: `${SYSTEM_PROMPT}\n\n**Context about Michael:**\n\n${context}`,
      },
      ...messages,
    ];

    // Stream the response using Claude Haiku 3.5
    const result = streamText({
      model: anthropic('claude-3-5-haiku-20241022'),
      messages: enhancedMessages,
      temperature: 0.7,
    });

    return result.toUIMessageStreamResponse();
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
