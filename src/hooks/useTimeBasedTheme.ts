'use client';

import { useState, useEffect, useCallback } from 'react';
import * as SunCalc from 'suncalc';

type TimeTheme = 'day' | 'evening';

// Portland, Oregon coordinates
const PORTLAND_LAT = 45.52;
const PORTLAND_LON = -122.68;

interface TimeBasedTheme {
  theme: TimeTheme;
  isDayTime: boolean;
  isEveningTime: boolean;
  sunrise: Date | null;
  sunset: Date | null;
  isManualOverride: boolean;
  setManualOverride: (theme: TimeTheme | null) => void;
}

// Global state for manual override (persists across component instances)
let globalManualOverride: TimeTheme | null = null;
const listeners = new Set<(theme: TimeTheme | null) => void>();

export function useTimeBasedTheme(): TimeBasedTheme {
  const [autoTheme, setAutoTheme] = useState<TimeTheme>('evening');
  const [manualOverride, setManualOverrideState] = useState<TimeTheme | null>(globalManualOverride);
  const [sunrise, setSunrise] = useState<Date | null>(null);
  const [sunset, setSunset] = useState<Date | null>(null);

  useEffect(() => {
    const updateTheme = () => {
      const now = new Date();

      // Get sunrise and sunset times for Portland
      const times = SunCalc.getTimes(now, PORTLAND_LAT, PORTLAND_LON);

      setSunrise(times.sunrise);
      setSunset(times.sunset);

      // Determine if it's currently day or evening
      const isDayTime = now >= times.sunrise && now < times.sunset;

      setAutoTheme(isDayTime ? 'day' : 'evening');
    };

    // Initial update
    updateTheme();

    // Update every minute to check for sunrise/sunset
    const interval = setInterval(updateTheme, 60000);

    return () => clearInterval(interval);
  }, []);

  // Listen for manual override changes
  useEffect(() => {
    const listener = (theme: TimeTheme | null) => {
      setManualOverrideState(theme);
    };

    listeners.add(listener);

    return () => {
      listeners.delete(listener);
    };
  }, []);

  const setManualOverride = useCallback((theme: TimeTheme | null) => {
    globalManualOverride = theme;
    listeners.forEach(listener => listener(theme));
  }, []);

  const theme = manualOverride ?? autoTheme;

  return {
    theme,
    isDayTime: theme === 'day',
    isEveningTime: theme === 'evening',
    sunrise,
    sunset,
    isManualOverride: manualOverride !== null,
    setManualOverride,
  };
}
