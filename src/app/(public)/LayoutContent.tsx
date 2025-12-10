'use client';

import { cn } from '@/lib/utils';

interface LayoutContentProps {
  children: React.ReactNode;
}

export function LayoutContent({ children }: LayoutContentProps) {
  return (
    <div
      className={cn(
        'flex h-dvh w-screen bg-background overflow-hidden lg:pt-0',
        // Mobile header is always visible, always need padding
        'pt-16'
      )}
    >
      {children}
    </div>
  );
}
