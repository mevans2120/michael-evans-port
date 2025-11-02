'use client';

import { useEffect } from 'react';
import { useTimeBasedTheme } from '@/hooks/useTimeBasedTheme';

// Day colors (Coral)
const DAY_COLORS = {
  accent: '20 90% 55%',        // Coral-orange #F46A25
  accentLight: '25 95% 60%',   // Lighter coral #F57D39
  accentForeground: '0 0% 100%', // White text
};

// Evening colors (Purple)
const EVENING_COLORS = {
  accent: '270 80% 60%',       // Purple
  accentLight: '270 70% 70%',  // Lighter purple
  accentForeground: '0 0% 100%', // White text
};

export function TimeThemeProvider({ children }: { children: React.ReactNode }) {
  const { theme } = useTimeBasedTheme();

  useEffect(() => {
    const colors = theme === 'day' ? DAY_COLORS : EVENING_COLORS;

    // Update CSS variables
    document.documentElement.style.setProperty('--accent', colors.accent);
    document.documentElement.style.setProperty('--accent-light', colors.accentLight);
    document.documentElement.style.setProperty('--accent-foreground', colors.accentForeground);
  }, [theme]);

  return <>{children}</>;
}
