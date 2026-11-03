/**
 * Structured, one-line JSON events for the chatbot. These go to stdout via
 * console.info, which Vercel captures as runtime logs. Searchable with:
 *   vercel logs <deployment> | grep '"event":"chat.'
 */

type Scalar = string | number | boolean | null | undefined;
type EventFields = Record<string, Scalar | Scalar[]>;

/** Upper bound on any string field, ellipsis included, so log lines stay bounded. */
const MAX_STRING = 500;

function truncate(value: string): string {
  return value.length > MAX_STRING ? value.slice(0, MAX_STRING - 1) + '…' : value;
}

function bound(value: Scalar | Scalar[]): Scalar | Scalar[] {
  if (typeof value === 'string') {
    return truncate(value);
  }
  if (Array.isArray(value)) {
    return value.map((v) => (typeof v === 'string' ? truncate(v) : v));
  }
  return value;
}

export function logChatEvent(event: string, fields: EventFields = {}): void {
  const line: Record<string, unknown> = { event, ts: new Date().toISOString() };
  for (const [k, v] of Object.entries(fields)) {
    line[k] = bound(v);
  }
  console.info(JSON.stringify(line));
}
