import { describe, it, expect, vi, afterEach } from 'vitest';
import { logChatEvent } from '../events';

describe('logChatEvent', () => {
  afterEach(() => vi.restoreAllMocks());

  it('writes one JSON line to console.info with an event name and timestamp', () => {
    const spy = vi.spyOn(console, 'info').mockImplementation(() => {});
    logChatEvent('chat.answer', { sessionId: 's1', chars: 120 });
    expect(spy).toHaveBeenCalledTimes(1);
    const line = JSON.parse(spy.mock.calls[0][0] as string);
    expect(line.event).toBe('chat.answer');
    expect(line.sessionId).toBe('s1');
    expect(line.chars).toBe(120);
    expect(typeof line.ts).toBe('string');
  });

  it('truncates long string fields to keep log lines bounded', () => {
    const spy = vi.spyOn(console, 'info').mockImplementation(() => {});
    logChatEvent('chat.question', { text: 'x'.repeat(2000) });
    const line = JSON.parse(spy.mock.calls[0][0] as string);
    expect(line.text.length).toBeLessThanOrEqual(500);
  });
});
