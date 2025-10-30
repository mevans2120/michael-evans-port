/**
 * Shared animation configuration for consistent timing and easing
 * across the navigation and chat system.
 */

export const ANIMATION_DURATION = {
  fast: 0.2,      // 200ms - Quick transitions (message fade-in, button hover)
  normal: 0.3,    // 300ms - Standard transitions (chat expand/collapse, panel width)
  slow: 0.4,      // 400ms - Slow transitions (major layout changes)
} as const;

export const ANIMATION_EASING = {
  standard: [0.4, 0, 0.2, 1],     // Material Design standard easing
  emphasized: [0.4, 0, 0.1, 1],   // More pronounced deceleration
  decelerate: [0, 0, 0.2, 1],     // Starts fast, slows down
} as const;

export const CHAT_ANIMATION = {
  duration: ANIMATION_DURATION.normal,
  ease: ANIMATION_EASING.standard,
} as const;

export const PANEL_ANIMATION = {
  duration: ANIMATION_DURATION.normal,
  ease: ANIMATION_EASING.standard,
} as const;

export const MESSAGE_ANIMATION = {
  duration: ANIMATION_DURATION.fast,
  ease: ANIMATION_EASING.standard,
} as const;
