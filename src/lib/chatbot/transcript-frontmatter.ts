/**
 * Minimal frontmatter parser for chatbot transcript files.
 * Supports exactly one key, `questions:`, as a YAML-style list of strings.
 * Anything else inside the frontmatter block is ignored.
 */

export interface TranscriptFrontmatter {
  questions: string[];
  body: string;
}

const FRONTMATTER_RE = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?/;

export function parseTranscriptFrontmatter(raw: string): TranscriptFrontmatter {
  const match = raw.match(FRONTMATTER_RE);
  if (!match) {
    return { questions: [], body: raw };
  }

  const block = match[1];
  const body = raw.slice(match[0].length);
  const questions: string[] = [];
  let inQuestions = false;

  for (const line of block.split(/\r?\n/)) {
    if (/^questions:\s*$/.test(line)) {
      inQuestions = true;
      continue;
    }
    if (inQuestions) {
      const item = line.match(/^\s*-\s+(.+?)\s*$/);
      if (item) {
        questions.push(item[1]);
        continue;
      }
      // A non-list line ends the questions block.
      inQuestions = false;
    }
  }

  return { questions, body };
}
