'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { X, Home, User, Briefcase, Monitor } from 'lucide-react';

interface HamburgerMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export function HamburgerMenu({ isOpen, onClose }: HamburgerMenuProps) {
  const pathname = usePathname();

  const navigationItems = [
    { href: '/', label: 'Home', icon: Home },
    { href: '/about', label: 'About', icon: User },
    { href: '/case-studies', label: 'Case Studies', icon: Briefcase },
    { href: '/ai-showcase', label: 'AI Showcase', icon: Monitor }
  ];

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-navigation backdrop-blur-sm z-60 md:hidden transition-opacity duration-normal"
        onClick={onClose}
        aria-label="Close menu"
      />

      {/* Menu Content */}
      <nav className="fixed inset-0 flex flex-col items-center justify-center z-65 md:hidden">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-2 rounded-lg hover:bg-navigation-link-hover-bg transition-colors-smooth"
          aria-label="Close menu"
        >
          <X className="w-6 h-6 text-navigation-foreground" />
        </button>

        {/* Navigation Links */}
        <div className="flex flex-col gap-4 w-full max-w-xs px-8">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={`flex items-center gap-4 px-8 py-6 text-lg font-sans rounded-lg transition-colors-smooth ${
                  isActive
                    ? 'text-navigation-link-hover'
                    : 'text-navigation-link hover:text-navigation-link-hover hover:bg-navigation-link-hover-bg'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
}
