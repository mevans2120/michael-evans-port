// scripts/lib/chat-client.ts
/**
 * Shared client for the check scripts: POSTs one user question to /api/chat
 * and reassembles the assistant text from the UI message stream. Throws
 * (naming the question) on non-2xx status, on timeout (the route's maxDuration
 * is 60s), and on an `{ type: 'error', errorText }` chunk, which the AI SDK
 * emits with HTTP 200 when the model call fails mid-stream.
 */

/** Override via CHAT_TIMEOUT_MS; mainly for exercising the timeout path in tests. */
const TIMEOUT_MS = Number(process.env.CHAT_TIMEOUT_MS) || 90_000;

interface StreamChunk {
  type?: string;
  delta?: string;
  errorText?: string;
}

export async function ask(base: string, question: string): Promise<string> {
  let res: Response;
  try {
    res = await fetch(`${base}/api/chat`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        messages: [{ id: 'q', role: 'user', parts: [{ type: 'text', text: question }] }],
      }),
      signal: AbortSignal.timeout(TIMEOUT_MS),
    });
  } catch (err) {
    if (err instanceof Error && err.name === 'TimeoutError') {
      throw new Error(`Timed out after ${TIMEOUT_MS}ms waiting for "${question}"`);
    }
    throw err;
  }
  if (!res.ok) throw new Error(`HTTP ${res.status} for "${question}"`);

  const raw = await res.text();
  let text = '';
  const errors: string[] = [];
  for (const line of raw.split('\n')) {
    if (!line.startsWith('data: ')) continue;
    try {
      const ev = JSON.parse(line.slice(6)) as StreamChunk;
      if (ev.type === 'text-delta') text += ev.delta ?? '';
      if (ev.type === 'error') errors.push(ev.errorText ?? '(no errorText)');
    } catch {
      /* ignore non-JSON lines such as [DONE] */
    }
  }
  if (errors.length > 0) {
    throw new Error(`Stream error for "${question}": ${errors.join('; ')}`);
  }
  return text;
}

/** Calls ask() and retries once after a pause when it throws. */
export async function askWithRetry(base: string, question: string, pauseMs = 5_000): Promise<string> {
  try {
    return await ask(base, question);
  } catch (err) {
    console.warn(`RETRY  ${question}  ${err instanceof Error ? err.message : String(err)}`);
    await new Promise((resolve) => setTimeout(resolve, pauseMs));
    return ask(base, question);
  }
}
