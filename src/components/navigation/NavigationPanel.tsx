'use client';

import React, { type ReactNode, useEffect, useState } from 'react';
import { useNavigation } from '@/contexts/NavigationContext';
import { useIsDesktop } from '@/hooks/useMediaQuery';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface NavigationPanelProps {
  children: ReactNode;
}

export function NavigationPanel({ children }: NavigationPanelProps) {
  const { panelState, setPanelState, chatInputFocused, chatExpanded, chatCloseAnimationComplete, setChatExpanded, setChatInputFocused } = useNavigation();
  const isDesktop = useIsDesktop();
  const [hasInteracted, setHasInteracted] = useState(false);

  // Enable transitions only after user interaction
  useEffect(() => {
    if (chatInputFocused || chatExpanded) {
      setHasInteracted(true);
    }
  }, [chatInputFocused, chatExpanded]);

  // Reset chat state when panel collapses
  useEffect(() => {
    if (panelState === 'partial') {
      setChatExpanded(false);
      setChatInputFocused(false);
    }
  }, [panelState, setChatExpanded, setChatInputFocused]);

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

  // Get dynamic width classes based on state
  const getWidthClasses = () => {
    if (!isDesktop) return 'w-full';

    switch (panelState) {
      case 'partial':
        return 'lg:w-[81px]';
      case 'expanded': {
        const shouldBeWide = (chatInputFocused || chatExpanded) && !chatCloseAnimationComplete;
        return shouldBeWide ? 'lg:w-[455px]' : 'lg:w-[320px]';
      }
      default:
        return 'lg:w-[81px]';
    }
  };

  return (
    <div
      data-testid="navigation-panel"
      className={cn(
        "hidden lg:flex",
        "lg:relative",
        "lg:bottom-auto",
        "lg:left-auto",
        getWidthClasses(),
        "lg:h-full",
        "bg-navigation",
        "lg:flex-shrink-0",
        "z-50",
        "lg:border-t-0",
        hasInteracted && "transition-[width] duration-normal ease-smooth"
      )}
      onClick={panelState === 'partial' ? handleClick : undefined}
    >
      <div className="relative flex-1 flex flex-col h-full overflow-hidden">
        {children}

        {/* Purple border - positioned absolutely within inner container */}
        {isDesktop && (
          <div
            className={cn(
              "absolute right-0 top-0 bottom-0 w-[2px] z-[100]",
              "pointer-events-none",
              "transition-colors duration-200",
              showBorder ? "bg-accent" : "bg-accent/40"
            )}
          />
        )}

        {/* Hover detection and clickable area on right edge - Desktop only */}
        {isDesktop && (
          <button
            className="absolute right-0 top-0 bottom-0 w-[85px] -mr-[77px] z-[101] cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
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
              "bg-accent/20 hover:bg-accent/30",
              "rounded transition-all",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
            )}
            aria-label={panelState === 'expanded' ? 'Collapse navigation' : 'Expand navigation'}
          >
            <ChevronLeft
              className={cn(
                "w-4 h-4 text-accent transition-transform",
                panelState === 'partial' && "rotate-180"
              )}
            />
          </button>
        )}
      </div>
    </div>
  );
}
