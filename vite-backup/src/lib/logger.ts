/**
 * Production-safe logging utility
 *
 * Logs only appear in development mode to avoid polluting production console.
 * Use this instead of console.log/error/warn throughout the application.
 */

const isDevelopment = import.meta.env.DEV;

export const logger = {
  log: (...args: any[]) => {
    if (isDevelopment) {
      console.log(...args);
    }
  },

  error: (...args: any[]) => {
    if (isDevelopment) {
      console.error(...args);
    }
  },

  warn: (...args: any[]) => {
    if (isDevelopment) {
      console.warn(...args);
    }
  },

  info: (...args: any[]) => {
    if (isDevelopment) {
      console.info(...args);
    }
  },

  /**
   * Always log errors, even in production (for error tracking)
   */
  critical: (...args: any[]) => {
    console.error('[CRITICAL]', ...args);
  },
};
