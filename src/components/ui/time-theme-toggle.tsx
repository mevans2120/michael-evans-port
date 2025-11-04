'use client';

import * as React from 'react';
import { Sun, Moon as MoonIcon } from 'lucide-react';
import { useTimeBasedTheme } from '@/components/providers/TimeThemeProvider';
import { Button } from '@/components/ui/button';

export function TimeThemeToggle() {
  const { theme, isManualOverride, setManualOverride } = useTimeBasedTheme();

  const toggleTimeTheme = () => {
    if (isManualOverride) {
      // If manually overridden, reset to auto
      setManualOverride(null);
    } else {
      // Toggle to opposite of current auto theme
      setManualOverride(theme === 'day' ? 'evening' : 'day');
    }
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleTimeTheme}
      className="h-9 w-9 text-muted-foreground hover:text-foreground transition-colors relative"
      aria-label="Toggle time theme (coral/purple)"
      title={isManualOverride ? `Manual: ${theme === 'day' ? 'Coral' : 'Purple'} (click to reset)` : `Auto: ${theme === 'day' ? 'Coral' : 'Purple'}`}
    >
      {theme === 'day' ? (
        <Sun className={`h-5 w-5 ${isManualOverride ? 'text-accent' : ''}`} />
      ) : (
        <MoonIcon className={`h-5 w-5 ${isManualOverride ? 'text-accent' : ''}`} />
      )}
    </Button>
  );
}
