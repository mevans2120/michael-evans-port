'use client';

/**
 * Main Chat Interface
 * Modal dialog containing the chat conversation and input
 */

import { useState, useRef, useEffect } from 'react';
import { useChat } from '@ai-sdk/react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ChatMessage } from './ChatMessage';
import { cn } from '@/lib/utils';

interface ChatInterfaceProps {
  isOpen: boolean;
  onClose: () => void;
}

const SUGGESTED_QUESTIONS = [
  "What's Michael's experience with AI/ML?",
  'Tell me about the Casa Bonita project',
  'What technologies does Michael work with?',
  "What's Michael's background?",
];

export function ChatInterface({ isOpen, onClose }: ChatInterfaceProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [input, setInput] = useState('');

  const { messages, sendMessage, status, error } = useChat({
    api: '/api/chat',
    onFinish: () => {
      // Scroll to bottom when assistant responds
      setTimeout(() => {
        scrollRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
      }, 100);
    },
  });

  const isLoading = status === 'streaming';

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: 'smooth', block: 'end' });
    }
  }, [messages]);

  // Focus input when chat opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const handleSuggestedQuestion = (question: string) => {
    sendMessage({ text: question });
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;
    sendMessage({ text: input });
    setInput('');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 md:hidden"
          />

          {/* Chat Modal */}
          <motion.div
            initial={{ opacity: 0, y: 100, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 100, scale: 0.95 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className={cn(
              'fixed z-50 flex flex-col bg-background border shadow-2xl',
              // Mobile: full screen
              'inset-0 rounded-none md:inset-auto',
              // Desktop: bottom-right corner
              'md:bottom-24 md:right-6 md:w-[400px] md:h-[600px] md:rounded-lg'
            )}
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b px-4 py-3">
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-green-500" />
                <h2 className="font-semibold">Ask about Michael</h2>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={onClose}
                className="h-8 w-8"
                aria-label="Close chat"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            {/* Messages */}
            <ScrollArea className="flex-1 p-4">
              <div className="space-y-4">
                {messages.length === 0 ? (
                  // Empty state with suggested questions
                  <div className="flex flex-col items-center justify-center h-full min-h-[400px] text-center">
                    <div className="mb-4 text-muted-foreground">
                      <p className="mb-2">Hi! I'm an AI assistant trained on Michael's portfolio.</p>
                      <p className="text-sm">Ask me anything about his experience, projects, or skills.</p>
                    </div>
                    <div className="w-full space-y-2">
                      <p className="text-sm font-medium mb-2">Suggested questions:</p>
                      {SUGGESTED_QUESTIONS.map((question, index) => (
                        <Button
                          key={index}
                          variant="outline"
                          size="sm"
                          onClick={() => handleSuggestedQuestion(question)}
                          className="w-full text-left justify-start text-sm h-auto py-2 px-3"
                        >
                          {question}
                        </Button>
                      ))}
                    </div>
                  </div>
                ) : (
                  <>
                    {messages.map((message) => {
                      // Extract text from v5 message parts array
                      const content = message.parts?.[0]?.text || message.content || '';
                      return (
                        <ChatMessage
                          key={message.id}
                          role={message.role}
                          content={content}
                          timestamp={new Date().toISOString()}
                        />
                      );
                    })}

                    {/* Loading indicator */}
                    {isLoading && (
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <span className="text-sm">Thinking...</span>
                      </div>
                    )}

                    {/* Error message */}
                    {error && (
                      <div className="rounded-lg bg-destructive/10 p-3 text-sm text-destructive">
                        <p className="font-medium">Error</p>
                        <p className="text-xs mt-1">
                          {error.message || 'Something went wrong. Please try again.'}
                        </p>
                      </div>
                    )}
                  </>
                )}
                <div ref={scrollRef} />
              </div>
            </ScrollArea>

            {/* Input */}
            <form onSubmit={onSubmit} className="border-t p-4">
              <div className="flex gap-2">
                <Input
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask a question..."
                  disabled={isLoading}
                  className="flex-1"
                  autoComplete="off"
                />
                <Button type="submit" size="icon" disabled={isLoading || !input.trim()}>
                  {isLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Send className="h-4 w-4" />
                  )}
                </Button>
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                AI-powered assistant trained on Michael's portfolio
              </p>
            </form>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
