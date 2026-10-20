'use client';

import { useNavigation } from '@/contexts/NavigationContext';
import { Sparkles, ChevronUp } from 'lucide-react';
import type { ChatPromptsData } from '@/lib/sanity/queries';
import { ChatSection } from './ChatSection';

interface MobileChatFooterProps {
  chatPrompts: ChatPromptsData | null;
}

export function MobileChatFooter({ chatPrompts }: MobileChatFooterProps) {
  const { chatExpanded, setChatExpanded, setMobileChatSource } = useNavigation();

  const handleExpand = () => {
    setMobileChatSource('footer');
    setChatExpanded(true);
  };

  // When expanded, render full ChatSection (mobile only)
  if (chatExpanded) {
    return (
      <div className="lg:hidden">
        <ChatSection isMobileVersion={true} chatPrompts={chatPrompts} />
      </div>
    );
  }

  // Collapsed state - slim 64px footer
  return (
    <div className="fixed bottom-0 left-0 right-0 h-16 bg-chat border-t border-chat-border z-[100] lg:hidden">
      <button
        onClick={handleExpand}
        className="w-full h-full px-8 flex items-center justify-between hover:bg-chat-suggestion/50 transition-colors-smooth"
        aria-label="Expand AI Assistant"
      >
        <div className="flex items-center gap-3">
          <Sparkles className="w-4 h-4 text-accent" />
          <span className="text-base font-medium text-chat-foreground font-serif">
            AI Assistant
          </span>
        </div>
        <ChevronUp className="w-4 h-4 text-accent/60" />
      </button>
    </div>
  );
}