'use client';

import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from 'react';

type TimeTheme = 'day' | 'evening';

interface TimeThemeContextType {
  theme: TimeTheme;
  isDayTime: boolean;
  isEveningTime: boolean;
  sunrise: Date | null;
  sunset: Date | null;
  isManualOverride: boolean;
  setManualOverride: (theme: TimeTheme | null) => void;
}

const TimeThemeContext = createContext<TimeThemeContextType | undefined>(undefined);

// Day accent color HSL value (used to detect current theme from server-rendered CSS)
const DAY_ACCENT = '20 90% 55%';

/**
 * Detect initial theme from server-rendered CSS variables
 * Server sets --accent in layout.tsx based on SunCalc calculation
 * This ensures client hydration matches server state without importing SunCalc
 */
function getInitialThemeFromCSS(): TimeTheme {
  if (typeof window === 'undefined') {
    // SSR fallback - server will have set the correct values
    return 'evening';
  }

  const accent = getComputedStyle(document.documentElement)
    .getPropertyValue('--accent')
    .trim();

  // If accent matches day color, it's day time
  return accent === DAY_ACCENT ? 'day' : 'evening';
}

/**
 * TimeThemeProvider - Lightweight client-side provider for time-based theming
 *
 * Performance optimization: SunCalc calculations are done server-side only (layout.tsx)
 * Client just reads the server-rendered CSS variables and provides context
 * This removes 121KB from the client bundle and eliminates 280ms+ TBT
 *
 * See: docs/research/RESEARCH_2025-12-01_lighthouse-performance-optimization.md
 */
export function TimeThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<TimeTheme>('evening');
  const [manualOverride, setManualOverrideState] = useState<TimeTheme | null>(null);

  // Read theme from server-rendered CSS on mount
  useEffect(() => {
    setTheme(getInitialThemeFromCSS());
  }, []);

  const setManualOverride = useCallback((newTheme: TimeTheme | null) => {
    setManualOverrideState(newTheme);

    // If manual override is set, update CSS variables
    if (newTheme) {
      const colors = newTheme === 'day'
        ? {
            accent: '20 90% 55%',
            accentLight: '25 95% 60%',
            accentForeground: '0 0% 100%',
            buttonPrimary: '20 90% 50%',
          }
        : {
            accent: '270 80% 60%',
            accentLight: '270 70% 70%',
            accentForeground: '0 0% 100%',
            buttonPrimary: '276 70% 47%',
          };

      document.documentElement.style.setProperty('--accent', colors.accent);
      document.documentElement.style.setProperty('--accent-light', colors.accentLight);
      document.documentElement.style.setProperty('--accent-foreground', colors.accentForeground);
      document.documentElement.style.setProperty('--color-button-primary', colors.buttonPrimary);
    }
  }, []);

  const activeTheme = manualOverride ?? theme;

  const value: TimeThemeContextType = {
    theme: activeTheme,
    isDayTime: activeTheme === 'day',
    isEveningTime: activeTheme === 'evening',
    // Sunrise/sunset times not available client-side (calculated server-side only)
    // These are kept for API compatibility but return null
    sunrise: null,
    sunset: null,
    isManualOverride: manualOverride !== null,
    setManualOverride,
  };

  return (
    <TimeThemeContext.Provider value={value}>
      {children}
    </TimeThemeContext.Provider>
  );
}

export function useTimeBasedTheme(): TimeThemeContextType {
  const context = useContext(TimeThemeContext);

  if (!context) {
    throw new Error('useTimeBasedTheme must be used within TimeThemeProvider');
  }

  return context;
}
