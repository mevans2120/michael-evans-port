'use client';

import { Menu } from 'lucide-react';
import { ThemeToggle } from '@/components/ui/theme-toggle';

interface MobileHeaderProps {
  onMenuClick: () => void;
  chatExpanded: boolean;
  mobileMenuOpen: boolean;
}

export function MobileHeader({ onMenuClick, chatExpanded, mobileMenuOpen }: MobileHeaderProps) {
  return (
    <header className="fixed top-0 left-0 right-0 h-16 bg-background border-b border-border z-50 md:hidden">
      <div className="flex items-center justify-between h-full px-6">
        {/* Logo - Always visible */}
        <div className="text-xl font-serif font-medium">
          M<span className="text-gradient">Evans</span>
        </div>

        {/* Controls - Hide when chat expanded */}
        {!chatExpanded && (
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <button
              onClick={onMenuClick}
              className="p-2 rounded-lg hover:bg-accent/10 transition-colors-smooth"
              aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
            >
              <Menu className="w-6 h-6 text-foreground" />
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
