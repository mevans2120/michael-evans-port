// scripts/eval-chat.ts
/**
 * Posts a fixed question set to a chat endpoint and reports answer length,
 * list usage, link validity, follow-up bank compliance, and refusals.
 *
 *   npm run eval:chat                         # against http://localhost:3000
 *   CHAT_BASE=https://mevans.space npm run eval:chat
 *   npm run eval:chat -- --json out.json      # also write raw results
 *
 * Exit code 1 when any threshold below is exceeded, so it can gate a change.
 */
import { writeFileSync } from 'node:fs';
import { askWithRetry } from './lib/chat-client';
import { splitFollowUps } from '../src/lib/chatbot/followups';
import { REFUSAL_SENTENCE } from '../src/lib/chatbot/prompt';

const base = process.env.CHAT_BASE ?? 'http://localhost:3000';
const linkBase = process.env.LINK_BASE ?? 'https://mevans.space';
const jsonFlag = process.argv.indexOf('--json');
const jsonOut = jsonFlag !== -1 ? process.argv[jsonFlag + 1] : undefined;

const QUESTIONS = [
  'What is the Before Launcher?',
  "Tell me Michael's latest work with AI",
  'What goes into building a successful product?',
  'Where did Michael grow up?',
  'What is the Gag Scale?',
  'Tell me about the Peacock project',
  'What did Michael build for NASA?',
  'What companies has Michael worked for?',
];

const THRESHOLDS = {
  avgWords: 110,
  maxWords: 150,
  bulletedAnswers: 0,
  brokenLinks: 0,
  emptyFollowUps: 0, // every answer must carry a parseable trailer
};

interface Result {
  question: string;
  words: number;
  bulleted: boolean;
  links: Record<string, number | 'external' | 'error'>;
  followUps: string[];
  refused: boolean;
  ms: number;
  body: string;
}

async function status(path: string): Promise<number | 'error'> {
  try {
    const r = await fetch(linkBase + path, { redirect: 'manual', signal: AbortSignal.timeout(20_000) });
    return r.status;
  } catch {
    return 'error';
  }
}

async function evaluate(question: string): Promise<Result> {
  const t0 = Date.now();
  const text = await askWithRetry(base, question);
  const ms = Date.now() - t0;
  const { answer, followUps } = splitFollowUps(text);
  const links: Result['links'] = {};
  for (const m of answer.matchAll(/\]\(([^)]+)\)/g)) {
    const href = m[1];
    links[href] = href.startsWith('/') ? await status(href) : 'external';
  }
  return {
    question,
    words: answer.split(/\s+/).filter(Boolean).length,
    bulleted: /^\s*[-*]\s+/m.test(answer),
    links,
    followUps,
    refused: answer.includes(REFUSAL_SENTENCE),
    ms,
    body: answer,
  };
}

async function main() {
  console.warn(`Evaluating ${QUESTIONS.length} questions against ${base}\n`);
  const results: Result[] = [];
  for (const q of QUESTIONS) {
    const r = await evaluate(q);
    results.push(r);
    const broken = Object.values(r.links).filter((s) => s === 404).length;
    console.warn(
      `${String(r.words).padStart(4)}w ${r.bulleted ? 'LIST ' : '     '}${broken ? `404x${broken} ` : '      '}${r.followUps.length}fu ${r.refused ? 'REFUSED ' : ''}${q}`,
    );
  }

  const words = results.map((r) => r.words);
  const summary = {
    avgWords: Math.round(words.reduce((a, b) => a + b, 0) / words.length),
    maxWords: Math.max(...words),
    bulletedAnswers: results.filter((r) => r.bulleted).length,
    brokenLinks: results.reduce((n, r) => n + Object.values(r.links).filter((s) => s === 404).length, 0),
    emptyFollowUps: results.filter((r) => r.followUps.length === 0).length,
    refusals: results.filter((r) => r.refused).length,
    avgMs: Math.round(results.reduce((a, r) => a + r.ms, 0) / results.length),
  };
  console.warn('\n' + JSON.stringify(summary, null, 2));

  if (jsonOut) writeFileSync(jsonOut, JSON.stringify({ base, summary, results }, null, 2));

  const failures = (Object.keys(THRESHOLDS) as (keyof typeof THRESHOLDS)[]).filter(
    (k) => summary[k] > THRESHOLDS[k],
  );
  if (failures.length > 0) {
    console.error(
      `\nThresholds exceeded: ${failures.map((k) => `${k}=${summary[k]} (max ${THRESHOLDS[k]})`).join(', ')}`,
    );
    process.exit(1);
  }
  console.warn('\nAll thresholds met.');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
