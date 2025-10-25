'use client';

/**
 * Floating Chat Button
 * Appears in bottom-right corner of all pages
 */

import { MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface ChatButtonProps {
  onClick: () => void;
  isOpen: boolean;
  unreadCount?: number;
}

export function ChatButton({ onClick, isOpen, unreadCount = 0 }: ChatButtonProps) {
  return (
    <Button
      onClick={onClick}
      size="lg"
      className={cn(
        'fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg transition-all duration-200 z-50',
        'hover:scale-110 hover:shadow-xl',
        'focus-visible:ring-2 focus-visible:ring-offset-2',
        isOpen && 'scale-95 shadow-md'
      )}
      aria-label={isOpen ? 'Close chat' : 'Open chat'}
    >
      <MessageCircle className="h-6 w-6" />
      {unreadCount > 0 && (
        <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white">
          {unreadCount > 9 ? '9+' : unreadCount}
        </span>
      )}
    </Button>
  );
}
