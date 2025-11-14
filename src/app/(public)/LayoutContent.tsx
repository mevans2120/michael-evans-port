'use client';

import { useMobileHeader } from '@/contexts/MobileHeaderContext';
import { useNavigation } from '@/contexts/NavigationContext';
import { cn } from '@/lib/utils';

interface LayoutContentProps {
  children: React.ReactNode;
}

export function LayoutContent({ children }: LayoutContentProps) {
  const { headerVisible } = useMobileHeader();
  const { chatExpanded } = useNavigation();

  return (
    <div
      className={cn(
        'flex h-dvh w-screen bg-background overflow-hidden lg:pt-0',
        'transition-all duration-normal ease-smooth',
        // Always keep padding if chat is expanded (it has its own header)
        // Otherwise, toggle padding based on header visibility
        chatExpanded ? 'pt-16' : (headerVisible ? 'pt-16' : 'pt-0')
      )}
    >
      {children}
    </div>
  );
}
