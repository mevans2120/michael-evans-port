'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useNavigation } from '@/contexts/NavigationContext';
import { useIsDesktop } from '@/hooks/useMediaQuery';
import {
  Home,
  User,
  Briefcase,
  Monitor,
  ChevronRight
} from 'lucide-react';

export function NavigationMenu() {
  const { panelState, setPanelState } = useNavigation();
  const isDesktop = useIsDesktop();
  const pathname = usePathname();

  const isExpanded = panelState === 'expanded';

  const togglePanel = (e: React.MouseEvent) => {
    e.stopPropagation();
    setPanelState(isExpanded ? 'partial' : 'expanded');
  };

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
      <nav className="flex flex-row md:flex-col gap-2 md:gap-8 h-full overflow-x-auto md:overflow-y-auto justify-around md:justify-start px-2 md:px-0">
        {/* Close Button - Desktop Only */}
        {isDesktop && (
          <button
            onClick={togglePanel}
            className="flex items-center gap-4 px-8 py-6 text-lg text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors rounded-lg"
          >
            <ChevronRight
              className="w-4 h-4 transition-transform duration-300"
              style={{
                transform: panelState === 'expanded' ? 'rotate(0deg)' : 'rotate(180deg)'
              }}
            />
            {isExpanded && 'Close'}
          </button>
        )}

        {/* Navigation Items */}
        {navigationItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href ||
                          (item.href !== '/' && pathname?.startsWith(item.href));

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`
                flex items-center gap-4 px-8 py-6 text-lg
                transition-colors rounded-lg
                ${isActive
                  ? 'text-purple-400 bg-neutral-800'
                  : 'text-neutral-400 hover:text-white hover:bg-neutral-800'
                }
              `}
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
