'use client';

import * as React from 'react';
import { useTheme } from 'next-themes';

/**
 * Easter egg theme toggle - barely visible text at page bottom
 * Shows "dark" or "light" that toggles between modes when clicked
 */
export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  // Prevent hydration mismatch
  React.useEffect(() => {
    setMounted(true);
  }, []);

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  if (!mounted) {
    return null;
  }

  return (
    <button
      onClick={toggleTheme}
      className="text-sm font-light text-muted-foreground/5 dark:text-muted-foreground/10 hover:text-muted-foreground/30 transition-colors duration-300 cursor-pointer select-none"
      aria-label="Toggle theme (Easter egg)"
    >
      {theme === 'dark' ? 'dark' : 'light'}
    </button>
  );
}
