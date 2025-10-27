import { useState, useEffect } from 'react';

/**
 * Custom hook for reactive media query matching
 * @param query - Media query string (e.g., "(min-width: 768px)")
 * @returns boolean indicating if the media query matches
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
 * Helper hook for checking if viewport is desktop (>= 768px)
 * Uses the same breakpoint as useIsMobile for consistency
 */
export function useIsDesktop(): boolean {
  return useMediaQuery('(min-width: 768px)');
}
