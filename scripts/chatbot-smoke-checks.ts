// scripts/chatbot-smoke-checks.ts
/**
 * Known-answer checks for the production chatbot, run by the scheduled
 * GitHub Actions smoke test (.github/workflows/chatbot-smoke.yml):
 *
 *   1. A question the corpus answers must come back grounded and carry the
 *      follow-up trailer.
 *   2. A question the corpus cannot answer must come back with the exact
 *      refusal sentence.
 *
 * Usage:
 *   CHAT_BASE=https://mevans.space npx tsx scripts/chatbot-smoke-checks.ts
 *
 * Excluded from tsconfig; run via tsx. Constants are imported from the
 * chatbot modules so the checks cannot drift from the prompt.
 */
import { FOLLOWUP_MARKER } from '../src/lib/chatbot/followups';
import { REFUSAL_SENTENCE } from '../src/lib/chatbot/prompt';

const base = process.env.CHAT_BASE ?? 'http://localhost:3000';

interface KnownAnswerCheck {
  name: string;
  question: string;
  /** Return a failure reason, or null when the answer passes. */
  verify: (answer: string) => string | null;
}

const CHECKS: KnownAnswerCheck[] = [
  {
    name: 'grounded answer',
    question: 'Where did Michael grow up?',
    verify: (answer) => {
      if (!/Eugene/i.test(answer)) return 'expected the answer to mention Eugene';
      if (!answer.includes(FOLLOWUP_MARKER)) return `expected the ${FOLLOWUP_MARKER} trailer`;
      return null;
    },
  },
  {
    name: 'refusal',
    question: 'What did Michael build for NASA?',
    verify: (answer) =>
      answer.includes(REFUSAL_SENTENCE) ? null : `expected the refusal sentence "${REFUSAL_SENTENCE}"`,
  },
];

async function ask(question: string): Promise<string> {
  const res = await fetch(`${base}/api/chat`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({
      messages: [{ id: '1', role: 'user', parts: [{ type: 'text', text: question }] }],
    }),
  });
  if (!res.ok) throw new Error(`HTTP ${res.status} for "${question}"`);
  const raw = await res.text();
  let text = '';
  for (const line of raw.split('\n')) {
    if (!line.startsWith('data: ')) continue;
    try {
      const ev = JSON.parse(line.slice(6)) as { type?: string; delta?: string };
      if (ev.type === 'text-delta') text += ev.delta ?? '';
    } catch {
      /* ignore non-JSON lines */
    }
  }
  return text;
}

async function main() {
  console.warn(`Running ${CHECKS.length} known-answer check(s) against ${base}\n`);

  let failures = 0;
  for (const check of CHECKS) {
    const answer = await ask(check.question);
    const reason = check.verify(answer);
    if (reason) {
      failures++;
      console.error(`FAIL  ${check.name}: ${reason}\n      Q: ${check.question}\n      A: ${answer}\n`);
    } else {
      console.warn(`PASS  ${check.name}`);
    }
  }

  if (failures > 0) {
    console.error(`\n${failures} of ${CHECKS.length} known-answer checks failed.`);
    process.exit(1);
  }
  console.warn('\nPASS known-answer checks');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
