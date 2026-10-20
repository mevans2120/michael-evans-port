// vitest.global-setup.ts
/**
 * `src/lib/chatbot/generated/transcripts.json` is gitignored and built from the
 * transcript sources. Vite resolves the real import path before `vi.mock` can
 * intercept it, so a fresh checkout fails the corpus tests until the file
 * exists. Build it once here when it is missing.
 */
import { existsSync } from 'node:fs';
import { execSync } from 'node:child_process';
import path from 'node:path';

const GENERATED = path.resolve(__dirname, 'src/lib/chatbot/generated/transcripts.json');

export default function setup(): void {
  if (existsSync(GENERATED)) return;
  console.warn(`[vitest] ${GENERATED} missing; building transcript corpus`);
  execSync('npx tsx scripts/build-transcript-corpus.ts', { stdio: 'inherit', cwd: __dirname });
}
