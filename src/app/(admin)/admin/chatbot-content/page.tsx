'use client';

import dynamic from 'next/dynamic';

// Dynamically import the client component to avoid SSR issues
const ChatbotContentClient = dynamic(
  () => import('./ChatbotContentClient'),
  { ssr: false }
);

export default function ChatbotContentPage() {
  return <ChatbotContentClient />;
}
