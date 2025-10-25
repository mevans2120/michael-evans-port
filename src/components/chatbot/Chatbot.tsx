'use client';

/**
 * Main Chatbot Component
 * Combines the floating button and chat interface
 */

import { useState } from 'react';
import { ChatButton } from './ChatButton';
import { ChatInterface } from './ChatInterface';

export function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <ChatButton
        onClick={() => setIsOpen(!isOpen)}
        isOpen={isOpen}
      />
      <ChatInterface
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
      />
    </>
  );
}
