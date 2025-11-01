'use client';

import React, { ReactNode, useEffect, useState } from 'react';
import { useNavigation } from '@/contexts/NavigationContext';
import { useIsDesktop } from '@/hooks/useMediaQuery';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface NavigationPanelProps {
  children: ReactNode;
}

export function NavigationPanel({ children }: NavigationPanelProps) {
  const { panelState, setPanelState, chatInputFocused, chatExpanded, chatCloseAnimationComplete } = useNavigation();
  const isDesktop = useIsDesktop();
  const [hasInteracted, setHasInteracted] = useState(false);

  // Enable transitions only after user interaction
  useEffect(() => {
    if (chatInputFocused || chatExpanded) {
      setHasInteracted(true);
    }
  }, [chatInputFocused, chatExpanded]);

  // Calculate panel width based on state and device
  const getPanelWidth = () => {
    if (!isDesktop) return '100%';

    switch (panelState) {
      case 'partial':
        return '56px';
      case 'expanded':
        // Expand when chat is active, contract only after close animation completes
        const shouldBeWide = (chatInputFocused || chatExpanded) && !chatCloseAnimationComplete;
        return shouldBeWide ? '455px' : '320px';
      default:
        return '56px';
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

  const [isBorderHovered, setIsBorderHovered] = React.useState(false);
  const [isAnimating, setIsAnimating] = React.useState(false);

  // Determine border color class
  const showBorder = panelState === 'partial' || isBorderHovered || isAnimating;

  return (
    <div
      data-testid="navigation-panel"
      className={cn(
        "fixed md:relative",
        "bottom-0 md:bottom-auto",
        "left-0 md:left-auto",
        "w-full",
        "h-auto md:h-full",
        "bg-navigation",
        "flex md:flex-shrink-0",
        "z-50",
        "border-t md:border-t-0",
        "animate-in fade-in duration-500",
      )}
      style={{
        width: isDesktop ? getPanelWidth() : '100%',
        transition: hasInteracted ? 'width 300ms cubic-bezier(0.4, 0, 0.2, 1)' : 'none',
      }}
      onClick={panelState === 'partial' ? handleClick : undefined}
    >
      <div className="relative flex-1 flex">
        {children}

        {/* Purple border - positioned absolutely within inner container */}
        {isDesktop && (
          <div
            className={cn(
              "absolute right-0 top-0 bottom-0 w-[2px] z-[100]",
              "pointer-events-none",
              "transition-colors duration-200"
            )}
            style={{
              backgroundColor: showBorder ? 'rgb(168, 85, 247)' : 'rgba(168, 85, 247, 0.4)',
            }}
          />
        )}

        {/* Hover detection and clickable area on right edge - Desktop only */}
        {isDesktop && (
          <button
            className="absolute right-0 top-0 bottom-0 w-16 -mr-14 z-[101] cursor-pointer"
            onClick={handleBorderClick}
            onMouseEnter={() => setIsBorderHovered(true)}
            onMouseLeave={() => setIsBorderHovered(false)}
            aria-label={panelState === 'expanded' ? 'Collapse navigation' : 'Expand navigation'}
          />
        )}

        {/* Clickable chevron button on purple border - Desktop only */}
        {isDesktop && (isBorderHovered || isAnimating || panelState === 'partial') && (
          <button
            onClick={handleBorderClick}
            onMouseEnter={() => setIsBorderHovered(true)}
            onMouseLeave={() => setIsBorderHovered(false)}
            className={cn(
              "absolute right-0 top-1/2",
              "translate-x-1/2 -translate-y-1/2",
              "w-6 h-10",
              "flex items-center justify-center",
              "z-[102]",
              "bg-purple-500/20 hover:bg-purple-500/30",
              "rounded transition-all"
            )}
            aria-label={panelState === 'expanded' ? 'Collapse navigation' : 'Expand navigation'}
          >
            <ChevronLeft
              className={cn(
                "w-4 h-4 text-purple-400 transition-transform",
                panelState === 'partial' && "rotate-180"
              )}
            />
          </button>
        )}
      </div>
    </div>
  );
}
