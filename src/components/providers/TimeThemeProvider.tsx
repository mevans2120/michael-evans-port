'use client';

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import * as SunCalc from 'suncalc';

type TimeTheme = 'day' | 'evening';

// Portland, Oregon coordinates
const PORTLAND_LAT = 45.52;
const PORTLAND_LON = -122.68;

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

export function TimeThemeProvider({ children }: { children: ReactNode }) {
  const [sunrise, setSunrise] = useState<Date | null>(null);
  const [sunset, setSunset] = useState<Date | null>(null);
  const [autoTheme, setAutoTheme] = useState<TimeTheme>('evening');
  const [manualOverride, setManualOverrideState] = useState<TimeTheme | null>(null);

  // Single interval to update sunrise/sunset and auto theme
  useEffect(() => {
    const updateTheme = () => {
      const now = new Date();

      // Get sunrise and sunset times for Portland
      const times = SunCalc.getTimes(now, PORTLAND_LAT, PORTLAND_LON);

      // Only update if changed (avoid unnecessary re-renders)
      setSunrise(prev => {
        if (!prev || prev.getTime() !== times.sunrise.getTime()) {
          return times.sunrise;
        }
        return prev;
      });

      setSunset(prev => {
        if (!prev || prev.getTime() !== times.sunset.getTime()) {
          return times.sunset;
        }
        return prev;
      });

      // Determine if it's currently day or evening
      const isDayTime = now >= times.sunrise && now < times.sunset;
      setAutoTheme(isDayTime ? 'day' : 'evening');
    };

    // Initial update
    updateTheme();

    // Update every 5 minutes (sunrise/sunset don't change frequently)
    const interval = setInterval(updateTheme, 5 * 60 * 1000);

    return () => clearInterval(interval);
  }, []);

  const setManualOverride = useCallback((theme: TimeTheme | null) => {
    setManualOverrideState(theme);
  }, []);

  const theme = manualOverride ?? autoTheme;

  // Update CSS variables when theme changes
  useEffect(() => {
    const colors = theme === 'day' ? DAY_COLORS : EVENING_COLORS;

    document.documentElement.style.setProperty('--accent', colors.accent);
    document.documentElement.style.setProperty('--accent-light', colors.accentLight);
    document.documentElement.style.setProperty('--accent-foreground', colors.accentForeground);
    document.documentElement.style.setProperty('--color-button-primary', colors.buttonPrimary);
  }, [theme]);

  const value: TimeThemeContextType = {
    theme,
    isDayTime: theme === 'day',
    isEveningTime: theme === 'evening',
    sunrise,
    sunset,
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
