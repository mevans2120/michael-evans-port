'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useNavigation } from '@/contexts/NavigationContext';
import { useIsDesktop } from '@/hooks/useMediaQuery';
import { motion } from 'framer-motion';
import {
  Home,
  User,
  Briefcase,
  Monitor
} from 'lucide-react';

export function NavigationMenu() {
  const { panelState, chatExpanded } = useNavigation();
  const isDesktop = useIsDesktop();
  const pathname = usePathname();

  const isExpanded = panelState === 'expanded';

  const navigationItems = [
    { href: '/', label: 'Home', icon: Home },
    { href: '/about', label: 'About', icon: User },
    { href: '/case-studies', label: 'Case Studies', icon: Briefcase },
    { href: '/ai-showcase', label: 'AI Showcase', icon: Monitor }
  ];

  return (
    <div
      className="py-4 md:border-b border-neutral-800"
      style={{ height: isDesktop ? '66%' : 'auto' }}
    >
      <nav
        className="flex flex-row md:flex-col gap-2 md:gap-8 h-full overflow-x-auto md:overflow-y-auto justify-around md:justify-start px-2 md:px-0 hide-scrollbar"
        style={{
          scrollbarWidth: 'none', // Firefox
          msOverflowStyle: 'none', // IE/Edge
        }}
      >
        {/* MEvans Logo - Desktop Only */}
        {isDesktop && (
          <Link href="/" className="px-8 pt-2 pb-6 flex items-center gap-2 relative z-20 hover:opacity-80 transition-opacity cursor-pointer">
            {panelState === 'expanded' ? (
              <>
                <span className="text-lg font-medium font-serif">
                  M<span className="text-gradient">Evans</span>
                </span>
                {chatExpanded && (
                  <span className="text-lg font-medium text-white font-serif">
                    AI Assistant
                  </span>
                )}
              </>
            ) : (
              <span className="text-lg font-medium font-serif">
                M<span className="text-gradient">E</span>
              </span>
            )}
          </Link>
        )}

        {/* Navigation Items */}
        {navigationItems.map((item) => {
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-4 px-8 py-6 text-lg font-sans text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors rounded-lg"
            >
              <Icon className="w-4 h-4" />
              {isExpanded && isDesktop && item.label}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
