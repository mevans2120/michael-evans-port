'use client';

import { useEffect, useState } from 'react';
import { useTimeBasedTheme } from '@/components/providers/TimeThemeProvider';
import { useDynamicFavicon } from '@/hooks/useDynamicFavicon';

/**
 * FaviconGenerator component
 *
 * Sets the browser favicon ONCE on page load based on:
 * - Time-based theme (day = coral, evening = purple)
 * - Browser's color scheme preference (not our site's toggle)
 *
 * Does not update when user toggles our site's theme
 */
export function FaviconGenerator() {
  const { theme: timeTheme } = useTimeBasedTheme();
  const [mounted, setMounted] = useState(false);

  // Prevent hydration mismatch - only render on client
  useEffect(() => {
    setMounted(true);
  }, []);

  // Get accent color based on time theme (day/evening)
  const accentColor = timeTheme === 'day'
    ? '20 90% 55%'   // Coral (day)
    : '270 80% 60%'; // Purple (evening)

  // Get text color based on BROWSER's preference (not our site's theme)
  const browserPrefersDark = typeof window !== 'undefined'
    ? window.matchMedia('(prefers-color-scheme: dark)').matches
    : false;

  const textColor = browserPrefersDark
    ? '0 0% 98%'    // Near white (dark mode)
    : '0 0% 3.1%';  // Near black (light mode)

  // Set favicon once on mount only
  useDynamicFavicon({
    accentColor,
    textColor,
    enabled: mounted,
    updateOnChange: false, // Only set once, never update
  });

  return null;
}
