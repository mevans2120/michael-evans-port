'use client';

/**
 * Chat Message Component
 * Displays individual messages in the chat interface
 */

import { motion } from 'framer-motion';
import { User, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface ChatMessageProps {
  role: 'user' | 'assistant' | 'system' | 'function' | 'data' | 'tool';
  content: string;
  timestamp?: string;
  sources?: string[];
  onSuggestionClick?: (question: string) => void;
}

export function ChatMessage({ role, content, timestamp, sources, onSuggestionClick }: ChatMessageProps) {
  const isUser = role === 'user';

  // Parse follow-up questions from assistant messages
  const parseFollowUpQuestions = (text: string): { mainContent: string; questions: string[] } => {
    const followUpPattern = /\*\*Follow-up questions:\*\*\n((?:- .+\n?)+)/i;
    const match = text.match(followUpPattern);

    if (!match) {
      return { mainContent: text, questions: [] };
    }

    const mainContent = text.substring(0, match.index);
    const questionsText = match[1];
    const questions = questionsText
      .split('\n')
      .filter(line => line.trim().startsWith('-'))
      .map(line => line.trim().substring(1).trim());

    return { mainContent, questions };
  };

  const { mainContent, questions } = !isUser && role === 'assistant'
    ? parseFollowUpQuestions(content)
    : { mainContent: content, questions: [] };

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
              : 'bg-muted'
          )}
        >
          <div className={cn(
            'prose prose-sm max-w-none prose-headings:mt-3 prose-headings:mb-2 prose-p:my-2 prose-ul:my-2 prose-ol:my-2 prose-li:my-0',
            // Force readable text color based on background
            isUser
              ? '[&_*]:text-primary-foreground'
              : '[&_*]:text-foreground [&_code]:text-foreground [&_a]:text-foreground [&_strong]:text-foreground [&_em]:text-foreground'
          )}>
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                // Style headings
                h1: ({ node, ...props }) => <h1 className="text-lg font-bold" {...props} />,
                h2: ({ node, ...props }) => <h2 className="text-base font-bold" {...props} />,
                h3: ({ node, ...props }) => <h3 className="text-sm font-semibold" {...props} />,
                // Style lists
                ul: ({ node, ...props }) => <ul className="list-disc pl-4" {...props} />,
                ol: ({ node, ...props }) => <ol className="list-decimal pl-4" {...props} />,
                // Style code
                code: ({ node, inline, ...props }: any) =>
                  inline ? (
                    <code className="px-1 py-0.5 rounded text-xs font-semibold" {...props} />
                  ) : (
                    <code className="block bg-background/10 p-2 rounded my-2 text-xs" {...props} />
                  ),
                // Style links
                a: ({ node, ...props }) => (
                  <a className="underline hover:no-underline" {...props} />
                ),
              }}
            >
              {mainContent}
            </ReactMarkdown>
          </div>
        </div>

        {/* Follow-up question suggestions */}
        {questions.length > 0 && onSuggestionClick && (
          <div className="flex flex-col gap-2 mt-3">
            {questions.map((question, index) => (
              <button
                key={index}
                onClick={() => onSuggestionClick(question)}
                className="text-left text-sm px-3 py-2 rounded-lg bg-muted/50 hover:bg-muted transition-colors border border-border/50 hover:border-border"
              >
                {question}
              </button>
            ))}
          </div>
        )}

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
