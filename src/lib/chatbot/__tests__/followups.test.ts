// src/lib/chatbot/__tests__/followups.test.ts
import { describe, it, expect } from 'vitest';
import { FOLLOWUP_MARKER, splitFollowUps } from '../followups';

describe('splitFollowUps', () => {
  it('returns the whole text and no questions when there is no marker', () => {
    expect(splitFollowUps('Just an answer.')).toEqual({ answer: 'Just an answer.', followUps: [] });
  });

  it('strips a complete trailer and parses the questions', () => {
    const text = `Answer here.\n\n${FOLLOWUP_MARKER} ["What is X?","How about Y?"]`;
    expect(splitFollowUps(text)).toEqual({ answer: 'Answer here.', followUps: ['What is X?', 'How about Y?'] });
  });

  it('hides a partially streamed trailer without exposing raw JSON', () => {
    const text = `Answer here.\n\n${FOLLOWUP_MARKER} ["What is`;
    expect(splitFollowUps(text)).toEqual({ answer: 'Answer here.', followUps: [] });
  });

  it('drops non-string entries and trims whitespace', () => {
    const text = `A\n${FOLLOWUP_MARKER} ["  Q1 ", 42, null]`;
    expect(splitFollowUps(text).followUps).toEqual(['Q1']);
  });

  it('keeps at most 2 questions', () => {
    const text = `A\n${FOLLOWUP_MARKER} ["1","2","3"]`;
    expect(splitFollowUps(text).followUps).toEqual(['1', '2']);
  });
});
