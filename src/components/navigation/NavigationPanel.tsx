'use client';

import { ReactNode } from 'react';
import { useNavigation } from '@/contexts/NavigationContext';
import { useIsDesktop } from '@/hooks/useMediaQuery';

interface NavigationPanelProps {
  children: ReactNode;
}

export function NavigationPanel({ children }: NavigationPanelProps) {
  const { panelState, setPanelState } = useNavigation();
  const isDesktop = useIsDesktop();

  // Calculate panel width based on state and device
  const getPanelWidth = () => {
    if (!isDesktop) return '100%';

    switch (panelState) {
      case 'partial':
        return '80px';
      case 'expanded':
        return '420px';
      default:
        return '80px';
    }
  };

  // Handle click to expand when in partial state
  const handleClick = () => {
    if (panelState === 'partial') {
      setPanelState('expanded');
    }
  };

  return (
    <div
      className={`
        fixed md:relative
        bottom-0 md:bottom-auto
        right-0 md:right-auto
        w-full md:w-auto
        h-auto md:h-full
        bg-neutral-900
        border-t-2 md:border-t-0 md:border-l-2
        border-purple-500
        flex
        transition-all duration-300 ease-out
        md:flex-shrink-0
        z-50
      `}
      style={{
        width: isDesktop ? getPanelWidth() : '100%',
        height: isDesktop ? '100%' : 'auto',
        cursor: panelState === 'partial' ? 'pointer' : 'default'
      }}
      onClick={panelState === 'partial' ? handleClick : undefined}
    >
      {children}
    </div>
  );
}
