'use client';

import { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { useNavigation } from '@/contexts/NavigationContext';
import { useIsDesktop } from '@/hooks/useMediaQuery';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface NavigationPanelProps {
  children: ReactNode;
}

export function NavigationPanel({ children }: NavigationPanelProps) {
  const { panelState, setPanelState, chatInputFocused, chatExpanded, chatCloseAnimationComplete } = useNavigation();
  const isDesktop = useIsDesktop();

  // Calculate panel width based on state and device
  const getPanelWidth = () => {
    if (!isDesktop) return '100%';

    switch (panelState) {
      case 'partial':
        return '80px';
      case 'expanded':
        // Expand when chat is active, contract only after close animation completes
        const shouldBeWide = (chatInputFocused || chatExpanded) && !chatCloseAnimationComplete;
        return shouldBeWide ? '455px' : '420px';
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

  // Handle purple border click to toggle panel
  const handleBorderClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (panelState === 'expanded') {
      setPanelState('partial');
    } else if (panelState === 'partial') {
      setPanelState('expanded');
    }
  };

  return (
    <motion.div
      className={`
        fixed md:relative
        bottom-0 md:bottom-auto
        left-0 md:left-auto
        w-full md:w-auto
        h-auto md:h-full
        bg-neutral-900
        flex
        md:flex-shrink-0
        z-50
        border-t md:border-t-0
        md:border-r
        border-purple-500
      `}
      initial={{ width: isDesktop ? getPanelWidth() : '100%' }}
      animate={{
        width: isDesktop ? getPanelWidth() : '100%',
      }}
      transition={{
        duration: 0.3,
        ease: [0.4, 0, 0.2, 1],
        // No delay - sequencing handled by state
      }}
      style={{
        height: isDesktop ? '100%' : 'auto',
        cursor: panelState === 'partial' ? 'pointer' : 'default',
      }}
      onClick={panelState === 'partial' ? handleClick : undefined}
    >
      {/* Clickable purple border with chevron indicator - Desktop only */}
      {isDesktop && (
        <button
          onClick={handleBorderClick}
          className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-16 bg-purple-500 hover:bg-purple-600 transition-colors flex items-center justify-center cursor-pointer group"
          aria-label={panelState === 'expanded' ? 'Collapse navigation' : 'Expand navigation'}
        >
          <ChevronLeft
            className={`w-3 h-3 text-white transition-transform ${
              panelState === 'partial' ? 'rotate-180' : ''
            }`}
          />
        </button>
      )}
      {children}
    </motion.div>
  );
}
