// scripts/validate-chat-prompts.ts
/**
 * Posts every active CMS suggested prompt to /api/chat and fails if the
 * assistant refuses or omits the follow-up trailer. Usage:
 *   npm run validate:prompts                       # against http://localhost:3000
 *   CHAT_BASE=https://mevans.space npm run validate:prompts
 *
 * Excluded from tsconfig; run via tsx. The refusal sentence and follow-up
 * marker are imported from the chatbot modules so they cannot drift.
 */
import { createClient } from 'next-sanity';

import { FOLLOWUP_MARKER } from '../src/lib/chatbot/followups';
import { REFUSAL_SENTENCE } from '../src/lib/chatbot/prompt';
import { askWithRetry } from './lib/chat-client';

const base = process.env.CHAT_BASE ?? 'http://localhost:3000';

const sanity = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? '5n331bys',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET ?? 'production',
  apiVersion: '2024-01-01',
  useCdn: true,
});

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

const FOLLOWUP_TRAILER = new RegExp(`${escapeRegExp(FOLLOWUP_MARKER)}\\s*\\[`);

interface ChatPromptsDoc {
  prompts: { text: string }[] | null;
}

async function main() {
  const data = await sanity.fetch<ChatPromptsDoc | null>(
    `*[_type == "chatPrompts"][0]{ prompts[active == true]{ text } }`
  );
  const prompts = (data?.prompts ?? []).map((p) => p.text.trim()).filter((t) => t.length > 0);
  if (prompts.length === 0) throw new Error('No active prompts found in Sanity');
  console.warn(`Checking ${prompts.length} active prompt(s) against ${base}\n`);

  let failures = 0;
  let errors = 0;
  for (const prompt of prompts) {
    let answer: string;
    try {
      answer = await askWithRetry(base, prompt);
    } catch (err) {
      errors++;
      console.error(`ERROR  ${prompt}  ${err instanceof Error ? err.message : String(err)}`);
      continue;
    }
    const refused = answer.includes(REFUSAL_SENTENCE);
    const hasFollowUps = FOLLOWUP_TRAILER.test(answer);
    const ok = !refused && hasFollowUps;
    if (!ok) failures++;
    console.warn(
      `${ok ? 'PASS' : 'FAIL'}  ${prompt}${refused ? '  (refused)' : ''}${hasFollowUps ? '' : '  (no follow-ups)'}`
    );
  }

  if (failures > 0 || errors > 0) {
    console.error(
      `\n${failures} of ${prompts.length} suggested prompts are not answerable; ${errors} errored (timeout or stream error).`
    );
    process.exit(1);
  }
  console.warn(`\nAll ${prompts.length} suggested prompts answerable.`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
