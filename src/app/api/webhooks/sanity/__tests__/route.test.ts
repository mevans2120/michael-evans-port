/**
 * Sanity webhook route tests.
 *
 * Covers signature handling, draft filtering, and which cache tags each
 * document type invalidates. `next/cache` and the signature parser are mocked;
 * the route's own branching runs for real.
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { NextRequest } from 'next/server';

vi.mock('next/cache', () => ({
  revalidateTag: vi.fn(),
  revalidatePath: vi.fn(),
}));

vi.mock('next-sanity/webhook', () => ({
  parseBody: vi.fn(),
}));

vi.mock('@/lib/logger', () => ({
  logger: { log: vi.fn(), error: vi.fn(), warn: vi.fn() },
}));

import { revalidateTag } from 'next/cache';
import { parseBody } from 'next-sanity/webhook';
import { POST } from '../route';

interface Payload {
  _id: string;
  _type: string;
  _rev?: string;
  slug?: { current: string };
}

function makeRequest(): NextRequest {
  return new NextRequest('http://localhost:3000/api/webhooks/sanity', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: '{}',
  });
}

async function post(payload: Payload, isValidSignature = true) {
  vi.mocked(parseBody).mockResolvedValue({ isValidSignature, body: payload });
  const res = await POST(makeRequest());
  return { status: res.status, json: await res.json() };
}

describe('POST /api/webhooks/sanity', () => {
  const originalSecret = process.env.SANITY_WEBHOOK_SECRET;

  beforeEach(() => {
    vi.clearAllMocks();
    process.env.SANITY_WEBHOOK_SECRET = 'test-webhook-secret';
  });

  afterEach(() => {
    process.env.SANITY_WEBHOOK_SECRET = originalSecret;
  });

  it('invalidates the chatbot corpus for a project document', async () => {
    const { status, json } = await post({
      _id: 'project-1',
      _type: 'project',
      slug: { current: 'casa-bonita' },
    });

    expect(status).toBe(200);
    expect(revalidateTag).toHaveBeenCalledWith('chatbot-corpus');
    expect(json.chatbotCorpusInvalidated).toBe(true);
  });

  it('does not touch the chatbot corpus for a footer document', async () => {
    const { status, json } = await post({ _id: 'footer', _type: 'footer' });

    expect(status).toBe(200);
    expect(revalidateTag).not.toHaveBeenCalledWith('chatbot-corpus');
    expect(json.chatbotCorpusInvalidated).toBe(false);
  });

  it('invalidates the chat prompts cache for a chatPrompts document', async () => {
    const { status } = await post({ _id: 'chatPrompts', _type: 'chatPrompts' });

    expect(status).toBe(200);
    expect(revalidateTag).toHaveBeenCalledWith('chat-prompts');
  });

  it('skips draft documents without revalidating anything', async () => {
    const { status, json } = await post({
      _id: 'drafts.project-1',
      _type: 'project',
      slug: { current: 'casa-bonita' },
    });

    expect(status).toBe(200);
    expect(json.skipped).toBe(true);
    expect(revalidateTag).not.toHaveBeenCalled();
  });

  it('rejects an invalid signature with 401', async () => {
    const { status, json } = await post({ _id: 'project-1', _type: 'project' }, false);

    expect(status).toBe(401);
    expect(json.error).toBe('Invalid signature');
    expect(revalidateTag).not.toHaveBeenCalled();
  });
});
