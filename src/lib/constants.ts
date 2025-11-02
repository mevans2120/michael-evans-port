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
   * Maximum number of search results to return from hybrid search
   */
  SEARCH_RESULT_LIMIT: 30,

  /**
   * Minimum similarity score threshold (0-1 scale)
   * Results below this threshold are filtered out
   */
  SIMILARITY_THRESHOLD: 0.25,

  /**
   * Weights for hybrid search (semantic + keyword)
   * Must sum to 1.0 for balanced results
   */
  SEARCH_WEIGHTS: {
    semantic: 0.7,
    keyword: 0.3,
  },

  /**
   * Chat model temperature (0-1 scale)
   * Higher values (0.8) produce more creative responses
   * Lower values (0.2) produce more focused, deterministic responses
   */
  CHAT_TEMPERATURE: 0.8,

  /**
   * Maximum tokens in chat response
   */
  MAX_RESPONSE_TOKENS: 1000,
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
