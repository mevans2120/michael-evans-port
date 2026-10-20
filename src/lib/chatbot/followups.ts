// src/lib/chatbot/followups.ts
/**
 * Follow-up questions travel as a machine-readable trailer on the last line
 * of the assistant's answer:
 *
 *   FOLLOWUPS: ["question one", "question two"]
 *
 * This module is imported by both the API route (for logging/validation)
 * and the chat UI (to hide the trailer and render buttons).
 */

export const FOLLOWUP_MARKER = 'FOLLOWUPS:';
export const MAX_FOLLOWUPS = 2;

export interface SplitResult {
  answer: string;
  followUps: string[];
}

/**
 * The marker only counts when it starts a line: index 0 or right after `\n`.
 * A marker buried mid-sentence is ordinary prose and stays in the answer.
 */
function findAnchoredMarker(text: string): number {
  let from = text.length;
  while (from >= 0) {
    const idx = text.lastIndexOf(FOLLOWUP_MARKER, from);
    if (idx === -1) return -1;
    if (idx === 0 || text[idx - 1] === '\n') return idx;
    from = idx - 1;
  }
  return -1;
}

/**
 * While streaming, the text may end with the first few characters of the
 * trailer (e.g. `\n\nFOLLOW`). Strip any proper prefix of `\n` + marker so the
 * UI never flashes it. Longest prefix is checked first.
 */
function stripPartialMarker(text: string): string {
  const anchored = '\n' + FOLLOWUP_MARKER;
  for (let len = anchored.length - 1; len >= 1; len--) {
    if (text.endsWith(anchored.slice(0, len))) {
      return text.slice(0, text.length - len).trimEnd();
    }
  }
  return text;
}

export function splitFollowUps(text: string): SplitResult {
  const idx = findAnchoredMarker(text);
  if (idx === -1) {
    return { answer: stripPartialMarker(text), followUps: [] };
  }

  const answer = text.slice(0, idx).trimEnd();
  const raw = text.slice(idx + FOLLOWUP_MARKER.length).trim();

  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    // Incomplete while streaming, or malformed. Hide it either way.
    return { answer, followUps: [] };
  }

  const followUps = Array.isArray(parsed)
    ? parsed
        .filter((q): q is string => typeof q === 'string')
        .map((q) => q.trim())
        .filter((q) => q.length > 0)
        .slice(0, MAX_FOLLOWUPS)
    : [];

  return { answer, followUps };
}
