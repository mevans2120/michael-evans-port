// src/lib/chatbot/corpus.ts
/**
 * Assembles the chatbot knowledge base into a single system block.
 *
 * Sources:
 *  - Transcripts: compiled at build time into generated/transcripts.json
 *  - Sanity: projects, profile, blog posts (fetched via fetchAllSanityContent)
 *
 * The result is small enough (~50k tokens) to send whole with prompt caching.
 */
import transcripts from '@/lib/chatbot/generated/transcripts.json';
import { fetchAllSanityContent } from './sanity-fetcher';

export interface CorpusPage {
  title: string;
  url: string;
  /** `/about` is intentionally absent: prompt.ts hardcodes that link. */
  kind: 'case-study' | 'blog';
}

export interface Corpus {
  text: string;
  pages: CorpusPage[];
  questionBank: string[];
  chars: number;
}

interface TranscriptDoc {
  id: string;
  title: string;
  body: string;
  questions: string[];
}

function escapeAttr(value: string): string {
  return value.replace(/"/g, '&quot;');
}

/**
 * Bodies come from CMS content and transcripts, so a stray `</document>` must
 * not be able to close a block early. A zero-width space after `<` breaks the
 * tag without visibly altering the text.
 */
function neutralizeTags(body: string): string {
  return body.replace(/<(\/?)(document|suggested-questions)\b/gi, '<$1​$2');
}

function cleanQuestions(questions: string[]): string[] {
  return questions.map((q) => q.trim()).filter((q) => q.length > 0);
}

function wrap(id: string, title: string, body: string, url?: string, questions: string[] = []): string {
  const urlAttr = url ? ` url="${escapeAttr(url)}"` : '';
  const q = questions.length > 0 ? `\n<suggested-questions>\n${questions.map((s) => `- ${s}`).join('\n')}\n</suggested-questions>` : '';
  return `<document id="${escapeAttr(id)}" title="${escapeAttr(title)}"${urlAttr}>\n${neutralizeTags(body.trim())}${q}\n</document>`;
}

function kindFor(url: string): CorpusPage['kind'] | null {
  if (url.startsWith('/case-studies/')) return 'case-study';
  if (url.startsWith('/blog/')) return 'blog';
  return null;
}

export async function buildCorpus(): Promise<Corpus> {
  const transcriptDocs = transcripts as TranscriptDoc[];
  const sanityDocs = await fetchAllSanityContent();

  const blocks: string[] = [];
  const pages: CorpusPage[] = [];
  const questions = new Set<string>();

  for (const t of transcriptDocs) {
    const qs = cleanQuestions(t.questions);
    blocks.push(wrap(t.id, t.title, t.body, undefined, qs));
    qs.forEach((q) => questions.add(q));
  }

  for (const d of sanityDocs) {
    const url = typeof d.metadata.url === 'string' ? d.metadata.url : undefined;
    const chatbotOnly = d.metadata.chatbotOnly === true;
    const qs = cleanQuestions(d.metadata.questions);
    blocks.push(wrap(d.metadata.source_id, d.metadata.title, d.content, url, qs));
    qs.forEach((q) => questions.add(q));
    // chatbotOnly documents have no public page, so they stay out of the manifest.
    if (url && !chatbotOnly) {
      const kind = kindFor(url);
      if (kind) pages.push({ title: d.metadata.title, url, kind });
    }
  }

  const text = blocks.join('\n\n');
  return { text, pages, questionBank: Array.from(questions), chars: text.length };
}
