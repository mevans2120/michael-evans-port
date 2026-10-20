// src/app/api/chat/route.ts
/**
 * Chat API Route
 *
 * Whole-corpus design: the complete knowledge base (transcripts + Sanity content,
 * ~50k tokens) is sent as a prompt-cached system block on every request.
 * There is no vector database. See docs/chatbot-functionality-audit-2026-10-09.md
 * section 6, option B, for the reasoning.
 */

import { streamText, convertToModelMessages, type UIMessage } from 'ai';
import { anthropic } from '@ai-sdk/anthropic';
import { buildCorpus } from '@/lib/chatbot/corpus';
import { buildInstructions, REFUSAL_SENTENCE } from '@/lib/chatbot/prompt';
import { splitFollowUps } from '@/lib/chatbot/followups';
import { logChatEvent } from '@/lib/chatbot/events';
import { CHATBOT_CONFIG } from '@/lib/constants';

// Node.js runtime (default). The Edge runtime is deprecated on Vercel and
// is not needed for streaming.
export const maxDuration = 60;

interface ChatRequestBody {
  messages?: UIMessage[];
  sessionId?: string;
}

function latestUserText(messages: UIMessage[]): string {
  const last = messages[messages.length - 1];
  if (!last || last.role !== 'user') return '';
  return last.parts
    .filter((p): p is Extract<typeof p, { type: 'text' }> => p.type === 'text')
    .map((p) => p.text)
    .join('\n')
    .trim();
}

function unavailable(sessionId: string, reason: string): Response {
  logChatEvent('chat.unavailable', { sessionId, reason });
  return new Response(JSON.stringify({ error: 'Chat is temporarily unavailable' }), {
    status: 503,
    headers: { 'Content-Type': 'application/json', 'X-Session-ID': sessionId },
  });
}

export async function POST(req: Request) {
  const started = Date.now();
  let sessionId = crypto.randomUUID();

  try {
    const body = (await req.json()) as ChatRequestBody;
    const messages = body.messages;
    sessionId = body.sessionId || sessionId;

    if (!Array.isArray(messages) || messages.length === 0) {
      return new Response('Invalid request: messages must be a non-empty array', { status: 400 });
    }

    const question = latestUserText(messages);
    if (!question) {
      return new Response('Invalid request: last message must be a user text message', { status: 400 });
    }

    const corpus = await buildCorpus();
    if (corpus.chars < CHATBOT_CONFIG.MIN_CORPUS_CHARS) {
      return unavailable(sessionId, `corpus too small: ${corpus.chars} chars`);
    }

    logChatEvent('chat.question', {
      sessionId,
      turn: messages.length,
      text: question,
      corpusChars: corpus.chars,
    });

    const result = streamText({
      model: anthropic(CHATBOT_CONFIG.CHAT_MODEL),
      temperature: CHATBOT_CONFIG.CHAT_TEMPERATURE,
      // The `system` string and the leading system message below are merged by
      // the AI SDK into one consecutive system block, which the Anthropic
      // provider emits as two `system` text blocks. Only the corpus block
      // carries cache_control, so the instructions can change without
      // invalidating the cached corpus prefix... as long as they stay first.
      system: buildInstructions(corpus.pages),
      messages: [
        {
          role: 'system',
          content: `# Knowledge base\n\n${corpus.text}`,
          providerOptions: {
            anthropic: { cacheControl: { type: 'ephemeral', ttl: '1h' } },
          },
        },
        ...convertToModelMessages(messages),
      ],
      async onFinish({ text, usage, providerMetadata }) {
        const { answer, followUps } = splitFollowUps(text);
        const bank = new Set(corpus.questionBank);
        const offBank = followUps.filter((q) => !bank.has(q));
        // @ai-sdk/anthropic@2.0.40 surfaces cache writes on provider metadata
        // and cache reads on the standard usage object (`cachedInputTokens`).
        const anthropicMeta = providerMetadata?.anthropic as
          | { cacheCreationInputTokens?: number | null }
          | undefined;

        logChatEvent('chat.answer', {
          sessionId,
          ms: Date.now() - started,
          chars: answer.length,
          refused: answer.includes(REFUSAL_SENTENCE),
          followUps,
          followUpsOffBank: offBank,
          inputTokens: usage.inputTokens ?? null,
          outputTokens: usage.outputTokens ?? null,
          cacheWrite: anthropicMeta?.cacheCreationInputTokens ?? null,
          cacheRead: usage.cachedInputTokens ?? null,
        });
      },
    });

    const response = result.toUIMessageStreamResponse();
    response.headers.set('X-Session-ID', sessionId);
    return response;
  } catch (error) {
    logChatEvent('chat.error', {
      sessionId,
      message: error instanceof Error ? error.message : String(error),
    });
    return new Response(JSON.stringify({ error: 'Failed to process chat request' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
