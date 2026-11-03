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

describe('splitFollowUps marker anchoring', () => {
  it('hides a partially streamed marker so the UI never flashes it', () => {
    expect(splitFollowUps('Answer.\n\nFOLLOW')).toEqual({ answer: 'Answer.', followUps: [] });
    expect(splitFollowUps('Answer.\nFOLLOWUPS')).toEqual({ answer: 'Answer.', followUps: [] });
    expect(splitFollowUps('Answer.\n')).toEqual({ answer: 'Answer.', followUps: [] });
  });

  it('ignores a marker that appears mid-sentence', () => {
    const text = 'I end with FOLLOWUPS: and a list.';
    expect(splitFollowUps(text)).toEqual({ answer: text, followUps: [] });
  });

  it('recognizes a marker at the start of a line', () => {
    expect(splitFollowUps(`A\n${FOLLOWUP_MARKER} ["x"]`).followUps).toEqual(['x']);
  });

  it('recognizes a marker at the very start of the text', () => {
    expect(splitFollowUps(`${FOLLOWUP_MARKER} ["x"]`)).toEqual({ answer: '', followUps: ['x'] });
  });

  it('does not treat a word that merely ends with the marker prefix as partial', () => {
    expect(splitFollowUps('Please FOLLOW')).toEqual({ answer: 'Please FOLLOW', followUps: [] });
  });
});
