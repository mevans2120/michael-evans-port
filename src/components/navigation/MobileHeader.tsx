'use client';

import Link from 'next/link';
import { Menu } from 'lucide-react';
import { useScrollDirection } from '@/hooks/useScrollDirection';
import { useMobileHeader } from '@/contexts/MobileHeaderContext';
import { cn } from '@/lib/utils';
import { useEffect } from 'react';

interface MobileHeaderProps {
  onMenuClick: () => void;
  chatExpanded: boolean;
  mobileMenuOpen: boolean;
}

export function MobileHeader({ onMenuClick, chatExpanded, mobileMenuOpen }: MobileHeaderProps) {
  const { scrollDirection, isAtTop } = useScrollDirection();
  const { setHeaderVisible } = useMobileHeader();

  // Determine if header should be hidden
  // Show if: scrolling up OR at top OR menu is open
  // Hide if: scrolling down AND not at top AND menu is closed
  const shouldHide = scrollDirection === 'down' && !isAtTop && !mobileMenuOpen;

  // Update context so layout can adjust padding
  useEffect(() => {
    if (!chatExpanded) {
      setHeaderVisible(!shouldHide);
    }
  }, [shouldHide, setHeaderVisible, chatExpanded]);

  // Hide entire header when chat is expanded - chat will show its own header
  if (chatExpanded) {
    return null;
  }

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 h-16 bg-background border-b border-border z-[60] lg:hidden",
        "transition-transform duration-normal ease-smooth",
        shouldHide ? "-translate-y-full" : "translate-y-0"
      )}
    >
      <div className="flex items-center justify-between h-full px-6">
        {/* Logo - Now clickable */}
        <Link
          href="/"
          className="flex items-center gap-2 text-xl font-serif font-medium leading-none hover:opacity-80 transition-opacity focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 rounded"
          aria-label="Home"
        >
          <span>M<span className="text-gradient">Evans</span></span>
        </Link>

        {/* Hamburger Menu */}
        <button
          onClick={onMenuClick}
          className="p-2 rounded-lg hover:bg-accent/10 transition-colors-smooth focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
          aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
        >
          <Menu className="w-6 h-6 text-foreground" />
        </button>
      </div>
    </header>
  );
}
