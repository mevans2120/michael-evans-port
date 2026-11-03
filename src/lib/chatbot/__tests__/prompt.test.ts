// src/lib/chatbot/__tests__/prompt.test.ts
import { describe, it, expect } from 'vitest';
import { buildInstructions, buildFormatRules, REFUSAL_SENTENCE } from '../prompt';

const pages = [
  { title: 'Before Launcher', url: '/case-studies/before-launcher', kind: 'case-study' as const },
  { title: 'How I AI in Q4 2025', url: '/blog/how-i-ai-in-q4-2025', kind: 'blog' as const },
];

describe('buildInstructions', () => {
  it('lists every linkable page with its exact URL', () => {
    const text = buildInstructions(pages);
    expect(text).toContain('[Before Launcher](/case-studies/before-launcher)');
    expect(text).toContain('[How I AI in Q4 2025](/blog/how-i-ai-in-q4-2025)');
  });

  it('includes the exact refusal sentence the smoke test looks for', () => {
    expect(buildInstructions(pages)).toContain(REFUSAL_SENTENCE);
  });

  it('does not contain the old fabrication instructions', () => {
    const text = buildInstructions(pages);
    expect(text).not.toMatch(/NEVER say "I don't have information"/i);
    expect(text).not.toMatch(/intelligent inferences/i);
  });

  it('asks for a bare link line with no "Learn more" label', () => {
    const text = buildInstructions(pages);
    expect(text).not.toContain('**Learn more:**');
    expect(text).toContain('\n[Title](url)\n');
  });

  it('pins the link format to the listed title and a relative path', () => {
    const text = buildInstructions(pages);
    expect(text).toContain('beginning with /');
    expect(text).toContain('never add a domain');
  });

  it('no longer carries the voice and follow-up sections (they moved after the corpus)', () => {
    const text = buildInstructions(pages);
    expect(text).not.toMatch(/## Voice/);
    expect(text).not.toMatch(/## Follow-up questions/);
    expect(text).not.toContain('FOLLOWUPS: [');
  });

  it('steers "latest" questions toward dated blog posts', () => {
    const text = buildInstructions(pages);
    expect(text).toMatch(/latest|most recent/i);
    expect(text).toContain('Published:');
  });
});

describe('buildFormatRules', () => {
  const rules = buildFormatRules();

  it('states a hard word limit and forbids lists', () => {
    expect(rules).toMatch(/under 90 words/i);
    expect(rules).toMatch(/no bullet/i);
    expect(rules).toMatch(/single paragraph/i);
  });

  it('explains the FOLLOWUPS trailer format', () => {
    expect(rules).toContain('FOLLOWUPS: [');
  });

  it('lets the model borrow follow-ups from other documents but never invent them', () => {
    expect(rules).toContain('VERBATIM');
    expect(rules).toContain('from other documents');
    expect(rules).toContain('Never write a question that is not in a list');
  });

  it('ends with the trailer rule so it is the last thing the model reads', () => {
    expect(rules.trimEnd().endsWith('Nothing may follow it.')).toBe(true);
  });

  it('is short enough to stay cheap outside the cache', () => {
    expect(rules.length).toBeLessThan(2_500);
  });
});
