'use client';

/**
 * Chat Message Component
 * Displays individual messages in the chat interface
 */

import { motion } from 'framer-motion';
import { User, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ChatMessageProps {
  role: 'user' | 'assistant';
  content: string;
  timestamp?: string;
  sources?: string[];
}

export function ChatMessage({ role, content, timestamp, sources }: ChatMessageProps) {
  const isUser = role === 'user';

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className={cn('flex gap-3 mb-4', isUser && 'flex-row-reverse')}
    >
      {/* Avatar */}
      <div
        className={cn(
          'flex h-8 w-8 shrink-0 items-center justify-center rounded-full',
          isUser ? 'bg-primary text-primary-foreground' : 'bg-muted'
        )}
      >
        {isUser ? <User className="h-4 w-4" /> : <Sparkles className="h-4 w-4" />}
      </div>

      {/* Message Content */}
      <div className={cn('flex flex-col gap-1 max-w-[80%]', isUser && 'items-end')}>
        <div
          className={cn(
            'rounded-lg px-4 py-2 text-sm',
            isUser
              ? 'bg-primary text-primary-foreground'
              : 'bg-muted text-foreground'
          )}
        >
          <p className="whitespace-pre-wrap break-words">{content}</p>
        </div>

        {/* Timestamp and Sources */}
        {(timestamp || sources) && (
          <div className="flex flex-col gap-1 px-1">
            {timestamp && (
              <span className="text-xs text-muted-foreground">
                {new Date(timestamp).toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </span>
            )}
            {sources && sources.length > 0 && (
              <div className="text-xs text-muted-foreground">
                Sources: {sources.join(', ')}
              </div>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
}
