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
        return 'md:w-[56px]';
      case 'expanded':
        const shouldBeWide = (chatInputFocused || chatExpanded) && !chatCloseAnimationComplete;
        return shouldBeWide ? 'md:w-[455px]' : 'md:w-[320px]';
      default:
        return 'md:w-[56px]';
    }
  };

  return (
    <div
      data-testid="navigation-panel"
      className={cn(
        "fixed md:relative",
        "bottom-0 md:bottom-auto",
        "left-0 md:left-auto",
        "w-full",
        getWidthClasses(),
        "h-auto md:h-full",
        "bg-navigation",
        "flex md:flex-shrink-0",
        "z-50",
        "border-t md:border-t-0",
        "animate-in fade-in duration-500",
        hasInteracted && "transition-[width] duration-normal ease-smooth"
      )}
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
              "transition-colors duration-200",
              showBorder ? "bg-accent" : "bg-accent/40"
            )}
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
              "bg-accent/20 hover:bg-accent/30",
              "rounded transition-all"
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
