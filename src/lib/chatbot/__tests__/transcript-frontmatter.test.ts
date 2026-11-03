import { describe, it, expect } from 'vitest';
import { parseTranscriptFrontmatter } from '../transcript-frontmatter';

describe('parseTranscriptFrontmatter', () => {
  it('returns the body untouched and no questions when there is no frontmatter', () => {
    const result = parseTranscriptFrontmatter('# Title\n\nBody text');
    expect(result.questions).toEqual([]);
    expect(result.body).toBe('# Title\n\nBody text');
  });

  it('extracts a questions list and strips the frontmatter from the body', () => {
    const input = [
      '---',
      'questions:',
      '  - What is the Before Launcher?',
      '  - How did the notification filter work?',
      '---',
      '# Before Launcher',
      'Body',
    ].join('\n');
    const result = parseTranscriptFrontmatter(input);
    expect(result.questions).toEqual([
      'What is the Before Launcher?',
      'How did the notification filter work?',
    ]);
    expect(result.body).toBe('# Before Launcher\nBody');
  });

  it('ignores unknown frontmatter keys', () => {
    const input = '---\ntitle: X\nquestions:\n  - Q1\n---\nBody';
    expect(parseTranscriptFrontmatter(input).questions).toEqual(['Q1']);
  });

  it('handles CRLF line endings', () => {
    const input = '---\r\nquestions:\r\n  - Q1\r\n---\r\nBody';
    const result = parseTranscriptFrontmatter(input);
    expect(result.questions).toEqual(['Q1']);
    expect(result.body).toBe('Body');
  });
});
