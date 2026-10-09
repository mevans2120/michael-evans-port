// scripts/build-transcript-corpus.ts
/**
 * Compiles content/chatbot/transcripts/*.md|txt into a single JSON module
 * that the chat route imports. Run automatically via `prebuild` and `pretest`.
 */
import * as fs from 'node:fs';
import * as path from 'node:path';
import { parseTranscriptFrontmatter } from '../src/lib/chatbot/transcript-frontmatter';

interface TranscriptDoc {
  id: string;
  title: string;
  body: string;
  questions: string[];
}

const SOURCE_DIR = path.join(process.cwd(), 'content/chatbot/transcripts');
const OUT_DIR = path.join(process.cwd(), 'src/lib/chatbot/generated');
const OUT_FILE = path.join(OUT_DIR, 'transcripts.json');

function titleFromFilename(file: string): string {
  return file
    .replace(/\.(md|txt)$/i, '')
    .replace(/[_-]+/g, ' ')
    .trim();
}

function main() {
  if (!fs.existsSync(SOURCE_DIR)) {
    throw new Error(`Transcript directory not found: ${SOURCE_DIR}`);
  }

  const docs: TranscriptDoc[] = fs
    .readdirSync(SOURCE_DIR)
    .filter((file) => /\.(md|txt)$/i.test(file))
    .filter((file) => !file.includes('_Raw'))
    .sort()
    .map((file) => {
      const raw = fs.readFileSync(path.join(SOURCE_DIR, file), 'utf-8');
      const { questions, body } = parseTranscriptFrontmatter(raw);
      return { id: `transcript:${file}`, title: titleFromFilename(file), body: body.trim(), questions };
    });

  fs.mkdirSync(OUT_DIR, { recursive: true });
  fs.writeFileSync(OUT_FILE, JSON.stringify(docs, null, 0));

  const chars = docs.reduce((n, d) => n + d.body.length, 0);
  const questions = docs.reduce((n, d) => n + d.questions.length, 0);
  console.warn(`[build-transcript-corpus] ${docs.length} files, ${chars} chars, ${questions} questions → ${path.relative(process.cwd(), OUT_FILE)}`);
}

main();
