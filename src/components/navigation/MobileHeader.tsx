'use client';

import Link from 'next/link';
import { Menu } from 'lucide-react';

interface MobileHeaderProps {
  onMenuClick: () => void;
  chatExpanded: boolean;
  mobileMenuOpen: boolean;
}

export function MobileHeader({ onMenuClick, chatExpanded, mobileMenuOpen }: MobileHeaderProps) {
  // Hide entire header when chat is expanded - chat will show its own header
  if (chatExpanded) {
    return null;
  }

  return (
    <header className="fixed top-0 left-0 right-0 h-16 bg-background border-b border-border z-[60] md:hidden">
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
