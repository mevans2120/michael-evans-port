/**
 * Application-wide constants
 *
 * This file contains configuration values and magic numbers used throughout the application.
 * Centralizing these values makes them easier to maintain and adjust.
 */

/**
 * Chatbot Configuration
 */
export const CHATBOT_CONFIG = {
  /**
   * Chat model temperature (0-1 scale).
   * Kept low: answers must stay grounded in the corpus, so faithfulness
   * matters more than creativity here.
   */
  CHAT_TEMPERATURE: 0.3,

  /** Model used for chat answers. Haiku 4.5 is current, fast, and inexpensive. */
  CHAT_MODEL: 'claude-haiku-4-5',

  /** Minimum corpus size (chars) below which the route refuses to answer rather than improvise. */
  MIN_CORPUS_CHARS: 20_000,

  /**
   * Maximum tokens in a chat response. A 90-word answer plus a link line and the
   * FOLLOWUPS trailer is about 220 tokens; 400 leaves headroom while making a
   * multi-paragraph answer impossible. If the trailer ever gets cut off, the
   * `chat.answer` log shows `followUps: []` and `npm run eval:chat` fails.
   */
  MAX_RESPONSE_TOKENS: 400,
} as const;

/**
 * Toast Notification Configuration
 */
export const TOAST_CONFIG = {
  /**
   * Maximum number of toasts to display simultaneously
   */
  TOAST_LIMIT: 1,

  /**
   * Toast auto-dismiss delay in milliseconds
   * Default: 5000ms (5 seconds)
   */
  TOAST_REMOVE_DELAY: 5000,
} as const;

/**
 * Responsive Breakpoints
 * Matches Tailwind CSS defaults for consistency
 */
export const BREAKPOINTS = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536,
} as const;

/**
 * Animation Durations (milliseconds)
 */
export const ANIMATION_DURATION = {
  /**
   * Short animations (hover effects, small transitions)
   */
  SHORT: 150,

  /**
   * Medium animations (modals, dropdowns)
   */
  MEDIUM: 300,

  /**
   * Long animations (page transitions, complex animations)
   */
  LONG: 500,
} as const;

/**
 * Z-Index Layers
 * Centralized z-index values to prevent conflicts
 */
export const Z_INDEX = {
  BACKGROUND: -1,
  NORMAL: 0,
  DROPDOWN: 10,
  STICKY: 20,
  MODAL_BACKDROP: 40,
  MODAL: 50,
  POPOVER: 60,
  TOOLTIP: 70,
} as const;
