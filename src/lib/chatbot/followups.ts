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

export function splitFollowUps(text: string): SplitResult {
  const idx = text.lastIndexOf(FOLLOWUP_MARKER);
  if (idx === -1) {
    return { answer: text, followUps: [] };
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
