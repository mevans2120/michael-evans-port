'use client';

import { useIsDesktop } from '@/hooks/useMediaQuery';
import type { ChatPromptsData } from '@/lib/sanity/queries';
import { ChatSection } from './ChatSection';

interface ConditionalChatSectionProps {
  chatPrompts: ChatPromptsData | null;
}

export function ConditionalChatSection({ chatPrompts }: ConditionalChatSectionProps) {
  const isDesktop = useIsDesktop();

  // Only render ChatSection in NavigationPanel on desktop
  // On mobile, it will be rendered by MobileChatFooter
  if (!isDesktop) {
    return null;
  }

  return <ChatSection chatPrompts={chatPrompts} />;
}
