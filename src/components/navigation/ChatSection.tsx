'use client';

import { useState, useRef, useEffect } from 'react';
import { useChat } from '@ai-sdk/react';
import { useNavigation } from '@/contexts/NavigationContext';
import { useIsDesktop } from '@/hooks/useMediaQuery';
import { Sparkles, ChevronDown, Send, User, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { SuggestedPrompts } from './SuggestedPrompts';
import '../chatbot/chatbot.css';

export function ChatSection() {
  const { panelState, chatExpanded, setChatExpanded, setChatInputFocused, signalChatCloseComplete } = useNavigation();
  const isDesktop = useIsDesktop();
  const [hasInteracted, setHasInteracted] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const { messages: chatMessages, sendMessage, status, error } = useChat({
    onFinish: () => {
      // Scroll to bottom when assistant responds
      setTimeout(() => {
        scrollRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
      }, 100);
    },
    onError: (error) => {
      console.error('Chat error:', error);
    },
  });

  const [input, setInput] = useState('');
  const isLoading = status === 'streaming';

  // Add welcome message to the start
  const messages = chatMessages.length === 0 ? [
    {
      id: 'welcome',
      role: 'assistant' as const,
      content: "Hi! I can help you explore Michael's portfolio. What would you like to know?"
    }
  ] : chatMessages;

  const isExpanded = panelState === 'expanded';
  const showChatContent = isDesktop ? isExpanded : chatExpanded;

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: 'smooth', block: 'end' });
    }
  }, [messages]);

  // Auto-focus input when chat expands
  useEffect(() => {
    if (chatExpanded && inputRef.current) {
      inputRef.current.focus();
    }
  }, [chatExpanded]);

  const handleInputFocus = () => {
    // Expand chat when input is focused
    setChatExpanded(true);
    setHasInteracted(true);
    setChatInputFocused(true);
  };

  const handlePromptClick = (prompt: string) => {
    if (!isDesktop) {
      setChatExpanded(true);
    }
    setChatInputFocused(true); // Expand width when using chat
    sendMessage({ text: prompt });
  };

  const handleHeaderClick = () => {
    // Always allow expanding when clicking the header
    setChatExpanded(true);
    setHasInteracted(true);
    setChatInputFocused(true); // Expand width when chat opens
  };

  // Parse follow-up questions from assistant messages
  const parseFollowUpQuestions = (text: string): { mainContent: string; questions: string[] } => {
    // Match the entire follow-up section including the header
    const followUpPattern = /\*\*Follow-up questions:\*\*\s*\n((?:- .+\n?)+)/i;
    const match = text.match(followUpPattern);

    if (!match) {
      return { mainContent: text, questions: [] };
    }

    // Remove the entire follow-up section (including the header) from main content
    const mainContent = text.substring(0, match.index).trim();
    const questionsText = match[1];
    const questions = questionsText
      .split('\n')
      .filter(line => line.trim().startsWith('-'))
      .map(line => line.trim().substring(1).trim());

    return { mainContent, questions };
  };

  return (
    <motion.div
      className={`chat-section flex flex-col border-t md:border-t-0 border-neutral-800 bg-neutral-900 ${
        isDesktop && chatExpanded
          ? 'absolute inset-0 z-10'
          : !isDesktop && chatExpanded
          ? 'absolute bottom-0 left-0 right-0 z-10'
          : ''
      }`}
      layout
      animate={{
        height: isDesktop
          ? (chatExpanded ? '100%' : '34%')
          : (chatExpanded ? '50vh' : 'auto'),
      }}
      transition={{
        duration: 0.3,
        ease: [0.4, 0, 0.2, 1],
      }}
      onAnimationComplete={() => {
        if (!chatExpanded) {
          setChatInputFocused(false);
          signalChatCloseComplete(); // Signal that chat close animation is complete
        }
      }}
    >
      {/* Chat Header */}
      <div
        className={`px-8 py-6 border-b border-neutral-800 flex items-center justify-between flex-shrink-0 ${
          !chatExpanded ? 'cursor-pointer hover:bg-neutral-800/50 transition-colors' : ''
        }`}
        onClick={!chatExpanded ? handleHeaderClick : undefined}
      >
        <div className="flex items-center gap-4">
          {!chatExpanded && <Sparkles className="w-4 h-4 text-purple-400" />}
          {(!isDesktop || isExpanded) && !chatExpanded && (
            <h2 className="text-lg font-medium text-white font-serif">
              AI Assistant
            </h2>
          )}
        </div>
        {chatExpanded && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              // Simply close - animations handled by Framer Motion
              setChatExpanded(false);
              setChatInputFocused(false);
            }}
            className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 transition-all"
            aria-label="Collapse chat"
          >
            <ChevronDown className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Chat Messages - Always render when there are messages, but hide with CSS when collapsed */}
      <div
        className={`flex-1 overflow-y-auto px-4 py-4 bg-neutral-900 transition-all duration-300 ease-in-out hide-scrollbar ${
          !showChatContent && !chatExpanded ? 'hidden' : ''
        } ${
          chatExpanded ? 'opacity-100 translate-y-0' : 'opacity-100 translate-y-0'
        }`}
      >
          {messages.map((message) => {
            // Extract text from v5 message format
            const textPart = 'parts' in message ? message.parts?.find(part => part.type === 'text') : undefined;
            const content = textPart?.text || ('content' in message ? message.content : '') || '';
            const isUser = message.role === 'user';
            const { mainContent, questions } = !isUser && message.role === 'assistant'
              ? parseFollowUpQuestions(content)
              : { mainContent: content, questions: [] };

            const isCollapsedWithChat = panelState === 'partial' && chatExpanded;

            return (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
                className={`flex gap-3 mb-4 ${isUser ? 'flex-row-reverse' : ''} ${isCollapsedWithChat ? 'justify-center' : ''}`}
              >
                {/* Avatar - Only show for assistant when chat is expanded */}
                {(isUser || chatExpanded) && !isCollapsedWithChat && (
                  <motion.div
                    initial={!isUser && chatExpanded ? { opacity: 0, scale: 0.8 } : false}
                    animate={!isUser && chatExpanded ? { opacity: 1, scale: 1 } : {}}
                    transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
                    className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
                      isUser ? 'bg-purple-600 text-white' : 'bg-neutral-800'
                    }`}
                  >
                    {isUser ? <User className="h-4 w-4" /> : <Sparkles className="h-4 w-4 text-purple-400" />}
                  </motion.div>
                )}

                {/* Show only sparkle icon when collapsed */}
                {isCollapsedWithChat && !isUser && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
                    className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-neutral-800"
                  >
                    <Sparkles className="h-4 w-4 text-purple-400" />
                  </motion.div>
                )}

                {/* Message Content - Hidden when collapsed */}
                <AnimatePresence mode="wait">
                {!isCollapsedWithChat && (
                  <motion.div
                    key="message-content"
                    initial={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    className={`flex flex-col gap-1 max-w-[80%] ${isUser ? 'items-end' : ''}`}>
                  <div
                    className={`rounded-lg px-4 py-2 chatbot-message ${
                      isUser
                        ? 'bg-purple-600 text-white text-sm'
                        : 'bg-neutral-800 text-white'
                    }`}
                  >
                    <div className="prose prose-sm prose-invert max-w-none prose-headings:mt-3 prose-headings:mb-2 prose-p:my-2 prose-ul:my-2 prose-ol:my-2 prose-li:my-0 prose-p:text-sm prose-li:text-sm [&>*]:text-sm">
                      <ReactMarkdown
                        remarkPlugins={[remarkGfm]}
                        components={{
                          h1: ({ node, ...props }) => <h1 className="text-lg font-bold" {...props} />,
                          h2: ({ node, ...props }) => <h2 className="text-base font-bold" {...props} />,
                          h3: ({ node, ...props }) => <h3 className="text-sm font-semibold" {...props} />,
                          p: ({ node, ...props }) => <p className="text-sm" {...props} />,
                          ul: ({ node, ...props }) => <ul className="list-disc pl-4 text-sm" {...props} />,
                          ol: ({ node, ...props }) => <ol className="list-decimal pl-4 text-sm" {...props} />,
                          li: ({ node, ...props }) => <li className="text-sm" {...props} />,
                          code: ({ node, inline, ...props }: any) =>
                            inline ? (
                              <code className="px-1 py-0.5 rounded text-sm font-mono bg-black/20" {...props} />
                            ) : (
                              <code className="block bg-black/20 p-2 rounded my-2 text-sm font-mono" {...props} />
                            ),
                          a: ({ node, ...props }) => (
                            <a className="underline hover:no-underline text-sm" {...props} />
                          ),
                        }}
                      >
                        {mainContent}
                      </ReactMarkdown>
                    </div>
                  </div>

                  {/* Follow-up question suggestions */}
                  {questions.length > 0 && (
                    <div className="flex flex-col gap-2 mt-2">
                      {questions.map((question, index) => (
                        <button
                          key={index}
                          onClick={() => handlePromptClick(question)}
                          className="text-left text-sm chatbot-followup px-3 py-2 rounded-lg bg-neutral-800/50 hover:bg-neutral-800 transition-colors border border-neutral-700/50 hover:border-neutral-700 text-neutral-300"
                        >
                          {question}
                        </button>
                      ))}
                    </div>
                  )}
                </motion.div>
                )}
                </AnimatePresence>
              </motion.div>
            );
          })}

          {/* Loading indicator */}
          {isLoading && (
            <div className="flex items-center gap-2 text-neutral-400 mb-4">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span className="text-sm">Thinking...</span>
            </div>
          )}

          {/* Error message */}
          {error && (
            <div className="rounded-lg bg-red-900/20 border border-red-900/50 p-3 text-sm text-red-400 mb-4">
              <p className="font-medium">Error</p>
              <p className="text-xs mt-1">
                {error.message || 'Something went wrong. Please try again.'}
              </p>
            </div>
          )}

          {/* Suggested Prompts - Show below welcome message when expanded */}
          <AnimatePresence mode="wait">
          {messages.length === 1 && chatExpanded && !(panelState === 'partial' && chatExpanded) && (
            <motion.div
              key="suggested-prompts"
              initial={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <SuggestedPrompts onPromptClick={handlePromptClick} />
            </motion.div>
          )}
          </AnimatePresence>

          <div ref={scrollRef} />
      </div>

      {/* Chat Input - Always rendered but conditionally visible */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (!input.trim() || isLoading) return;
          sendMessage({ text: input });
          setInput('');
        }}
        className={`px-4 py-3 border-t border-neutral-800 flex gap-2 flex-shrink-0 transition-none ${
          !showChatContent ? 'hidden' : ''
        } ${
          panelState === 'partial' && chatExpanded ? 'hidden' : ''
        }`}
      >
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onFocus={handleInputFocus}
          placeholder="Ask about Michael's work..."
          disabled={isLoading}
          className="flex-1 px-3 py-2 text-sm bg-neutral-800 border border-neutral-700 text-white placeholder-neutral-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed transition-none"
          style={{ width: '100%', minWidth: 0 }}
        />
        <button
          type="submit"
          disabled={isLoading || !input?.trim()}
          className="p-2 bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <Loader2 className="w-4 h-4 text-white animate-spin" />
          ) : (
            <Send className="w-4 h-4 text-white" />
          )}
        </button>
      </form>
    </motion.div>
  );
}
