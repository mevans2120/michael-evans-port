'use client';

import dynamic from 'next/dynamic';

// Phase 1.4: Lazy load admin component (dev-only, skip SSR)
const ChatLogsClient = dynamic(
  () => import('./ChatLogsClient'),
  {
    ssr: false,
    loading: () => (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex items-center gap-2">
          <div className="animate-pulse">Loading admin dashboard...</div>
        </div>
      </div>
    ),
  }
);

export default function ChatLogsPage() {
  return <ChatLogsClient />;
}
