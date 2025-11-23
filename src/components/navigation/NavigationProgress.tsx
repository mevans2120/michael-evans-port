'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { useNavigation } from '@/contexts/NavigationContext';
import { useIsDesktop } from '@/hooks/useMediaQuery';

/**
 * NavigationProgress Component
 *
 * Displays a minimal three-dot loading overlay during internal page navigation.
 * - Triggered by custom 'navigation-start' event
 * - Automatically hides when pathname changes (navigation complete)
 * - Only shows for internal navigation (external links excluded)
 * - Dynamically positions based on navigation panel width
 * - Auto-updates when navigation state changes
 * - Respects prefers-reduced-motion
 */
export function NavigationProgress() {
  const [isNavigating, setIsNavigating] = useState(false);
  const pathname = usePathname();
  const { panelState, chatExpanded, chatInputFocused, chatCloseAnimationComplete } = useNavigation();
  const isDesktop = useIsDesktop();

  useEffect(() => {
    const handleNavigationStart = () => setIsNavigating(true);

    window.addEventListener('navigation-start', handleNavigationStart);

    return () => {
      window.removeEventListener('navigation-start', handleNavigationStart);
    };
  }, []);

  useEffect(() => {
    // Hide loading when pathname changes (navigation complete)
    setIsNavigating(false);
  }, [pathname]);

  useEffect(() => {
    // Safety fallback: force clear loading state after 2.5 seconds
    // This ensures loading never gets stuck even if pathname doesn't update
    if (!isNavigating) return;

    const timeout = setTimeout(() => {
      setIsNavigating(false);
    }, 2500);

    return () => clearTimeout(timeout);
  }, [isNavigating]);

  // Calculate left position based on navigation state
  const calculateLeftPosition = (): number => {
    if (!isDesktop) return 0; // Mobile: full width

    switch (panelState) {
      case 'partial':
        return 81; // Collapsed navigation width
      case 'expanded': {
        const shouldBeWide = (chatInputFocused || chatExpanded) && !chatCloseAnimationComplete;
        return shouldBeWide ? 455 : 320; // Expanded with chat : normal expanded
      }
      default:
        return 81;
    }
  };

  const leftPosition = calculateLeftPosition();

  // Don't render if not navigating
  if (!isNavigating) return null;

  return (
    <div
      className="fixed inset-y-0 right-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm"
      style={{ left: `${leftPosition}px` }}
      role="status"
      aria-live="polite"
      aria-label="Loading page"
    >
      <div className="flex gap-2" aria-hidden="true">
        <div className="w-3 h-3 rounded-full bg-accent dark:bg-accent-light animate-elegant-pulse" style={{ animationDelay: '0ms' }} />
        <div className="w-3 h-3 rounded-full bg-accent dark:bg-accent-light animate-elegant-pulse" style={{ animationDelay: '150ms' }} />
        <div className="w-3 h-3 rounded-full bg-accent dark:bg-accent-light animate-elegant-pulse" style={{ animationDelay: '300ms' }} />
      </div>
      <span className="sr-only">Loading page...</span>
    </div>
  );
}
