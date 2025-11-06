'use client';

import { useIsDesktop } from '@/hooks/useMediaQuery';
import { ChatSection } from './ChatSection';

export function ConditionalChatSection() {
  const isDesktop = useIsDesktop();

  // Only render ChatSection in NavigationPanel on desktop
  // On mobile, it will be rendered by MobileChatFooter
  if (!isDesktop) {
    return null;
  }

  return <ChatSection />;
}