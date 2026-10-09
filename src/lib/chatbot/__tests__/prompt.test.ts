// src/lib/chatbot/__tests__/prompt.test.ts
import { describe, it, expect } from 'vitest';
import { buildInstructions, REFUSAL_SENTENCE } from '../prompt';

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

  it('explains the FOLLOWUPS trailer format', () => {
    expect(buildInstructions(pages)).toContain('FOLLOWUPS: [');
  });
});
