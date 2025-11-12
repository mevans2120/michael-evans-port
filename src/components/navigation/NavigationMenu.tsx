'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useNavigation } from '@/contexts/NavigationContext';
import {
  Home,
  User,
  Briefcase,
  Pen
} from 'lucide-react';

export function NavigationMenu() {
  const { panelState, chatExpanded } = useNavigation();
  const pathname = usePathname();

  const isExpanded = panelState === 'expanded';
  const isCollapsed = panelState === 'partial';

  const navigationItems = [
    { href: '/', label: 'Home', icon: Home },
    { href: '/about', label: 'About', icon: User },
    { href: '/case-studies', label: 'Case Studies', icon: Briefcase },
    { href: '/blog', label: 'Posts', icon: Pen }
  ];

  return (
    <div
      className="py-4 md:border-b border-navigation-border h-auto md:h-[66%]"
    >
      <nav
        className="flex flex-row md:flex-col gap-2 md:gap-8 h-full overflow-x-auto md:overflow-y-auto justify-around md:justify-start px-2 md:px-0 hide-scrollbar"
      >
        {/* MEvans Logo - Desktop Only */}
        <Link
          href="/"
          className={`${isCollapsed ? 'justify-center' : 'px-8'} pt-2 pb-6 hidden md:flex items-center gap-2 relative z-20 hover:opacity-80 transition-opacity cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 ${
            chatExpanded ? 'pointer-events-none' : ''
          }`}
        >
            {panelState === 'expanded' ? (
              <span className={`text-lg font-medium font-serif ${chatExpanded ? 'text-chat-foreground' : ''}`}>
                M<span className="text-gradient">Evans</span>
              </span>
            ) : (
              <span className="text-lg font-medium font-serif">
                M<span className="text-gradient">E</span>
              </span>
            )}
        </Link>

        {/* Navigation Items - Desktop Only (hidden on mobile, now in hamburger menu) */}
        {navigationItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`hidden md:flex items-center gap-4 ${isCollapsed ? 'justify-center' : 'px-8'} py-6 text-lg font-sans transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent relative z-10 ${
                isActive
                  ? 'text-navigation-link-hover'
                  : 'text-navigation-link hover:text-navigation-link-hover hover:bg-navigation-link-hover-bg'
              }`}
            >
              <Icon className="w-4 h-4" />
              {isExpanded && <span className="hidden md:inline">{item.label}</span>}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
