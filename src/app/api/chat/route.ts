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

/** Only the most recent N messages are forwarded to the model; older turns are dropped. */
const MAX_MESSAGES = 12;

/** Upper bound on a single text part, in characters, to cap per-request input cost. */
const MAX_TEXT_PART_CHARS = 4_000;

/** Client-supplied session ids must look like a UUID; anything else is replaced. */
const SESSION_ID_PATTERN = /^[0-9a-f-]{36}$/i;

type TextPart = Extract<UIMessage['parts'][number], { type: 'text' }>;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

/**
 * Validate and normalise the client-supplied message list. Returns null if any
 * message is malformed, has a disallowed role, or carries an oversized text
 * part. Non-text parts are dropped silently. Only the last MAX_MESSAGES
 * messages are kept.
 */
function sanitizeMessages(input: unknown): UIMessage[] | null {
  if (!Array.isArray(input) || input.length === 0) return null;

  const recent = input.slice(-MAX_MESSAGES);
  const out: UIMessage[] = [];

  for (const raw of recent) {
    if (!isRecord(raw)) return null;
    if (raw.role !== 'user' && raw.role !== 'assistant') return null;
    if (!Array.isArray(raw.parts)) return null;

    const parts: TextPart[] = [];
    for (const part of raw.parts) {
      if (!isRecord(part) || part.type !== 'text' || typeof part.text !== 'string') continue;
      if (part.text.length > MAX_TEXT_PART_CHARS) return null;
      parts.push({ type: 'text', text: part.text });
    }

    out.push({
      id: typeof raw.id === 'string' ? raw.id : crypto.randomUUID(),
      role: raw.role,
      parts,
    });
  }

  return out;
}

function latestUserText(messages: UIMessage[]): string {
  const last = messages[messages.length - 1];
  if (!last || last.role !== 'user') return '';
  return last.parts
    .filter((p): p is TextPart => p.type === 'text')
    .map((p) => p.text)
    .join('\n')
    .trim();
}

/**
 * Plain-text error body. `@ai-sdk/react` throws `new Error(await response.text())`
 * and the UI renders `error.message`, so JSON here would surface as raw JSON.
 */
function textResponse(body: string, status: number, extraHeaders: Record<string, string> = {}): Response {
  return new Response(body, {
    status,
    headers: { 'Content-Type': 'text/plain; charset=utf-8', ...extraHeaders },
  });
}

function badRequest(reason: string): Response {
  return textResponse(`Invalid request: ${reason}`, 400);
}

function unavailable(sessionId: string, reason: string): Response {
  logChatEvent('chat.unavailable', { sessionId, reason });
  return textResponse('Chat is temporarily unavailable.', 503, { 'X-Session-ID': sessionId });
}

export async function POST(req: Request) {
  const started = Date.now();
  let sessionId = crypto.randomUUID();

  try {
    let body: unknown;
    try {
      body = await req.json();
    } catch {
      return badRequest('body must be valid JSON');
    }
    if (!isRecord(body)) {
      return badRequest('body must be a JSON object');
    }

    if (typeof body.sessionId === 'string' && SESSION_ID_PATTERN.test(body.sessionId)) {
      sessionId = body.sessionId;
    }

    const messages = sanitizeMessages(body.messages);
    if (!messages) {
      return badRequest(
        `messages must be a non-empty array of user/assistant messages with text parts under ${MAX_TEXT_PART_CHARS} characters`,
      );
    }

    const question = latestUserText(messages);
    if (!question) {
      return badRequest('last message must be a user text message');
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
      maxOutputTokens: CHATBOT_CONFIG.MAX_RESPONSE_TOKENS,
      // The `system` string and the leading system message below are merged by
      // the AI SDK into one consecutive system block, which the Anthropic
      // provider emits as two `system` text blocks: instructions first, then
      // the corpus. Caching is a prefix match, so the instructions are part of
      // the cached prefix. Editing the prompt invalidates the cache once (one
      // cache write, cheap); after that every request reads the whole prefix
      // from cache again. Do not reorder these.
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
      // Provider failures (bad key, 529 overloaded) surface inside the stream,
      // not as a thrown error from streamText, so the outer catch never sees them.
      onError({ error }) {
        logChatEvent('chat.error', {
          sessionId,
          phase: 'stream',
          message: error instanceof Error ? error.message : String(error),
        });
      },
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

    // Drain the stream independently of the HTTP response so onFinish still
    // fires (and logs) when the client disconnects mid-stream. Not awaited.
    void result.consumeStream();

    const response = result.toUIMessageStreamResponse();
    response.headers.set('X-Session-ID', sessionId);
    return response;
  } catch (error) {
    logChatEvent('chat.error', {
      sessionId,
      phase: 'request',
      message: error instanceof Error ? error.message : String(error),
    });
    return textResponse('Something went wrong processing your message.', 500);
  }
}
