import { useState, useEffect } from 'react';

/**
 * Custom hook for reactive media query matching
 *
 * Provides a boolean that updates when the media query match status changes.
 * This hook is the single source of truth for responsive breakpoint detection.
 *
 * @param query - CSS media query string
 * @returns boolean indicating if the media query currently matches
 *
 * @example
 * // Check if viewport is mobile
 * const isMobile = useMediaQuery('(max-width: 767px)')
 *
 * @example
 * // Check if viewport is tablet or larger
 * const isTablet = useMediaQuery('(min-width: 768px)')
 *
 * @example
 * // Check for dark mode preference
 * const prefersDark = useMediaQuery('(prefers-color-scheme: dark)')
 *
 * @example
 * // Check for reduced motion preference
 * const prefersReducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)')
 */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const media = window.matchMedia(query);

    // Set initial value
    if (media.matches !== matches) {
      setMatches(media.matches);
    }

    // Create listener for changes
    const listener = () => setMatches(media.matches);

    // Add listener
    media.addEventListener('change', listener);

    // Cleanup
    return () => media.removeEventListener('change', listener);
  }, [matches, query]);

  return matches;
}

/**
 * Convenience hook for checking if viewport is desktop size or larger
 *
 * Uses Tailwind's 'md' breakpoint (768px) for consistency across the app.
 * This is the recommended way to check for desktop viewports.
 *
 * @returns true if viewport width >= 768px, false otherwise
 *
 * @example
 * const isDesktop = useIsDesktop()
 * return isDesktop ? <DesktopNav /> : <MobileNav />
 */
export function useIsDesktop(): boolean {
  return useMediaQuery('(min-width: 768px)');
}
