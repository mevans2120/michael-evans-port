'use client';

import { useEffect, useState } from 'react';
import { useTimeBasedTheme } from '@/hooks/useTimeBasedTheme';
import { useTheme } from 'next-themes';
import { useDynamicFavicon } from '@/hooks/useDynamicFavicon';

/**
 * FaviconGenerator component
 *
 * Dynamically updates the browser favicon based on:
 * - Time-based theme (day = coral, evening = purple)
 * - Color mode (light = dark text, dark = light text)
 *
 * Integrates with existing TimeThemeProvider and ThemeProvider
 * Uses design system color tokens for consistency
 */
export function FaviconGenerator() {
  const { theme: timeTheme } = useTimeBasedTheme();
  const { theme: colorMode, systemTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Prevent hydration mismatch - only render on client
  useEffect(() => {
    setMounted(true);
  }, []);

  // Determine actual color mode (resolve 'system' to actual value)
  const resolvedColorMode = colorMode === 'system' ? systemTheme : colorMode;

  // Get accent color based on time theme (matches TimeThemeProvider)
  const accentColor = timeTheme === 'day'
    ? '20 90% 55%'   // Coral (day)
    : '270 80% 60%'; // Purple (evening)

  // Get text color based on color mode
  const textColor = resolvedColorMode === 'dark'
    ? '0 0% 98%'    // Near white (dark mode)
    : '0 0% 3.1%';  // Near black (light mode)

  // Update favicon using the hook
  useDynamicFavicon({
    accentColor,
    textColor,
    enabled: mounted, // Only enable after client-side mount
  });

  // This component doesn't render anything
  return null;
}
