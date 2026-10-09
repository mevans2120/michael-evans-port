// src/lib/chatbot/__tests__/corpus.test.ts
import { describe, it, expect, vi } from 'vitest';

vi.mock('@/lib/chatbot/generated/transcripts.json', () => ({
  default: [
    { id: 'transcript:a.md', title: 'a', body: 'Alpha body', questions: ['Q-alpha'] },
    { id: 'transcript:b.md', title: 'b', body: 'Beta body', questions: [] },
  ],
}));

vi.mock('../sanity-fetcher', () => ({
  fetchAllSanityContent: vi.fn().mockResolvedValue([
    {
      content: '# Before Launcher\n\nCase study URL: /case-studies/before-launcher\n\nBody',
      metadata: {
        source: 'sanity_project',
        source_id: 'p1',
        title: 'Before Launcher',
        url: '/case-studies/before-launcher',
        questions: ['Q-bl'],
        updated_at: '2025-01-01',
      },
    },
    {
      content: '# Post',
      metadata: {
        source: 'sanity_blog',
        source_id: 'b1',
        title: 'How I AI',
        url: '/blog/how-i-ai-in-q4-2025',
        questions: [],
        updated_at: '2025-01-01',
      },
    },
  ]),
}));

import { buildCorpus } from '../corpus';

describe('buildCorpus', () => {
  it('concatenates transcripts and Sanity documents into one block with source headers', async () => {
    const corpus = await buildCorpus();
    expect(corpus.text).toContain('<document id="transcript:a.md" title="a">');
    expect(corpus.text).toContain('Alpha body');
    expect(corpus.text).toContain('<document id="p1" title="Before Launcher" url="/case-studies/before-launcher">');
  });

  it('collects a deduplicated question bank', async () => {
    const corpus = await buildCorpus();
    expect(corpus.questionBank).toEqual(['Q-alpha', 'Q-bl']);
  });

  it('builds a page manifest of linkable pages only', async () => {
    const corpus = await buildCorpus();
    expect(corpus.pages).toEqual([
      { title: 'Before Launcher', url: '/case-studies/before-launcher', kind: 'case-study' },
      { title: 'How I AI', url: '/blog/how-i-ai-in-q4-2025', kind: 'blog' },
    ]);
  });

  it('reports size so the route can refuse to run on an empty corpus', async () => {
    const corpus = await buildCorpus();
    expect(corpus.chars).toBeGreaterThan(50);
  });
});
