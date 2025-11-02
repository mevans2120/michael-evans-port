'use client';

import { useEffect } from 'react';
import { useTimeBasedTheme } from '@/hooks/useTimeBasedTheme';

// Day colors (Coral)
const DAY_COLORS = {
  accent: '20 90% 55%',        // Coral-orange #F46A25
  accentLight: '25 95% 60%',   // Lighter coral #F57D39
  accentForeground: '0 0% 100%', // White text
  buttonPrimary: '20 90% 50%', // Slightly darker coral for buttons
};

// Evening colors (Purple)
const EVENING_COLORS = {
  accent: '270 80% 60%',       // Purple
  accentLight: '270 70% 70%',  // Lighter purple
  accentForeground: '0 0% 100%', // White text
  buttonPrimary: '276 70% 47%', // Darker purple for buttons
};

export function TimeThemeProvider({ children }: { children: React.ReactNode }) {
  const { theme } = useTimeBasedTheme();

  useEffect(() => {
    const colors = theme === 'day' ? DAY_COLORS : EVENING_COLORS;

    // Update CSS variables
    document.documentElement.style.setProperty('--accent', colors.accent);
    document.documentElement.style.setProperty('--accent-light', colors.accentLight);
    document.documentElement.style.setProperty('--accent-foreground', colors.accentForeground);
    document.documentElement.style.setProperty('--color-button-primary', colors.buttonPrimary);
  }, [theme]);

  return <>{children}</>;
}
