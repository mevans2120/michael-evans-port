'use client';

import { useState, useRef, useEffect } from 'react';
import { useChat } from '@ai-sdk/react';
import { useNavigation } from '@/contexts/NavigationContext';
import { useIsDesktop } from '@/hooks/useMediaQuery';
import { Sparkles, ChevronDown, Send, User, Loader2 } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { SuggestedPrompts } from './SuggestedPrompts';
import '../chatbot/chatbot.css';

export function ChatSection() {
  const { panelState, chatExpanded, setChatExpanded, chatInputFocused, setChatInputFocused, signalChatCloseComplete } = useNavigation();
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
  const isCollapsed = panelState === 'partial';

  // Get dynamic height classes based on state
  const getHeightClasses = () => {
    if (!isDesktop) {
      return chatExpanded ? 'h-[50vh]' : 'h-auto';
    }
    return chatExpanded ? 'md:h-full' : 'md:h-[34%]';
  };

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: 'smooth', block: 'end' });
    }
  }, [messages]);

  // Auto-focus input when chat expands (but not when it collapses)
  useEffect(() => {
    if (chatExpanded && inputRef.current && document.activeElement !== inputRef.current) {
      // Small delay to avoid conflicts with blur
      setTimeout(() => {
        if (chatExpanded) {
          inputRef.current?.focus();
        }
      }, 100);
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

  // Render minimal chat header when collapsed
  if (isCollapsed && isDesktop) {
    return (
      <div
        data-testid="chat-section"
        className="chat-section border-t-0 bg-chat flex items-center justify-center py-4 h-[34%]"
      >
        <Sparkles className="w-4 h-4 text-accent" />
      </div>
    );
  }

  return (
    <div
      data-testid="chat-section"
      key={`chat-${chatExpanded}`}
      className={`chat-section grid grid-rows-[auto_1fr_auto] border-t-0 bg-chat ${getHeightClasses()} ${
        isDesktop && chatExpanded
          ? 'absolute inset-0 z-10'
          : !isDesktop && chatExpanded
          ? 'absolute bottom-0 left-0 right-0 z-10 border-t border-chat-border'
          : ''
      }`}
    >
      {/* Chat Header */}
      <div
        className={`px-8 py-6 border-b border-chat-border flex items-center justify-between flex-shrink-0 ${
          !chatExpanded ? 'cursor-pointer hover:bg-chat-suggestion/50 transition-colors' : ''
        }`}
        onClick={(e) => {
          if (!chatExpanded) {
            handleHeaderClick();
          }
        }}
      >
        <div className="flex items-center gap-4 pointer-events-none">
          {!chatExpanded && <Sparkles className="w-4 h-4 text-accent" />}
          <h2 className={`text-lg font-medium text-chat-foreground font-serif ${chatExpanded ? 'ml-16' : ''}`}>
            AI Assistant
          </h2>
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation();

            if (chatExpanded) {
              setChatExpanded(false);
              setChatInputFocused(false);
            } else {
              setChatExpanded(true);
              setHasInteracted(true);
              setChatInputFocused(true);
            }
          }}
          className={`p-1.5 rounded-lg transition-all relative z-50 ${
            chatExpanded
              ? 'text-chat-foreground hover:bg-chat-suggestion/30'
              : 'text-accent/60 hover:text-accent'
          }`}
          aria-label={chatExpanded ? "Collapse chat" : "Expand chat"}
        >
          <ChevronDown className={`w-4 h-4 transition-transform ${!chatExpanded ? 'rotate-180' : ''}`} />
        </button>
      </div>

      {/* Chat Messages - Always render when there are messages, but hide with CSS when collapsed */}
      <div
        className={`overflow-y-auto px-4 py-4 bg-chat hide-scrollbar ${
          !showChatContent && !chatExpanded ? 'hidden' : ''
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
              <div
                key={message.id}
                className={`flex gap-3 mb-4 ${isUser ? 'flex-row-reverse' : ''} ${isCollapsedWithChat ? 'justify-center' : ''}`}
              >
                {/* Avatar - Only show for assistant when chat is expanded */}
                {(isUser || chatExpanded) && !isCollapsedWithChat && (
                  <div
                    className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
                      isUser ? 'bg-accent text-white' : 'bg-chat-message'
                    }`}
                  >
                    {isUser ? <User className="h-4 w-4" /> : <Sparkles className="h-4 w-4 text-accent" />}
                  </div>
                )}

                {/* Show only sparkle icon when collapsed */}
                {isCollapsedWithChat && !isUser && (
                  <div
                    className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-chat-message"
                  >
                    <Sparkles className="h-4 w-4 text-accent" />
                  </div>
                )}

                {/* Message Content - Hidden when collapsed */}
                {!isCollapsedWithChat && (
                  <div
                    className={`flex flex-col gap-1 max-w-[80%] ${isUser ? 'items-end' : ''}`}>
                  <div
                    className={`rounded-lg px-4 py-2 chatbot-message ${
                      isUser
                        ? 'bg-accent text-white text-sm'
                        : 'bg-chat-message dark:text-foreground text-white'
                    }`}
                  >
                    <div className="prose prose-sm max-w-none prose-headings:mt-3 prose-headings:mb-2 prose-p:my-2 prose-ul:my-2 prose-ol:my-2 prose-li:my-0 prose-p:text-sm prose-li:text-sm [&>*]:text-sm dark:[&>*]:text-foreground [&>*]:text-white">
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
                          code: ({ node, inline, className, children, ...props }: {
                            node?: unknown;
                            inline?: boolean;
                            className?: string;
                            children?: React.ReactNode;
                          }) =>
                            inline ? (
                              <code className="px-1 py-0.5 rounded text-sm font-mono bg-code-block" {...props}>{children}</code>
                            ) : (
                              <code className="block bg-code-block p-2 rounded my-2 text-sm font-mono" {...props}>{children}</code>
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
                          className="text-left text-sm chatbot-followup px-3 py-2 rounded-lg bg-chat-suggestion/50 hover:bg-chat-suggestion transition-colors border border-chat-input-border/50 hover:border-chat-input-border text-chat-foreground/80"
                        >
                          {question}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                )}
              </div>
            );
          })}

          {/* Loading indicator */}
          {isLoading && (
            <div className="flex gap-3 mb-4">
              {/* Avatar - matches assistant message style */}
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-chat-message">
                <Sparkles className="h-4 w-4 text-accent" />
              </div>

              {/* Three-dot pulse container */}
              <div className="flex items-center justify-center gap-2 bg-chat-message px-4 py-3 rounded-lg">
                <div className="w-2 h-2 rounded-full bg-accent animate-elegant-pulse" />
                <div className="w-2 h-2 rounded-full bg-accent animate-elegant-pulse" />
                <div className="w-2 h-2 rounded-full bg-accent animate-elegant-pulse" />
              </div>
            </div>
          )}

          {/* Error message */}
          {error && (
            <div className="rounded-lg bg-error border border-error-border p-3 text-sm text-error-text mb-4">
              <p className="font-medium">Error</p>
              <p className="text-xs mt-1">
                {error.message || 'Something went wrong. Please try again.'}
              </p>
            </div>
          )}

          {/* Suggested Prompts - Show below welcome message when expanded */}
          {messages.length === 1 && chatExpanded && !(panelState === 'partial' && chatExpanded) && (
            <SuggestedPrompts onPromptClick={handlePromptClick} />
          )}

          <div ref={scrollRef} />
      </div>

      {/* Chat Input - Grid row with auto height to stay fixed during animations */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (!input.trim() || isLoading) return;
          sendMessage({ text: input });
          setInput('');
        }}
        className={`px-4 py-3 border-t border-chat-border flex gap-2 flex-shrink-0 ${
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
          className="flex-1 px-3 py-2 text-base font-serif bg-accent border border-accent text-white placeholder:text-white/60 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-light disabled:opacity-50 disabled:cursor-not-allowed transition-none w-full min-w-0"
        />
        <button
          type="submit"
          disabled={isLoading || !input?.trim()}
          className="p-2 bg-accent hover:bg-accent/90 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <Loader2 className="w-4 h-4 text-white animate-spin" />
          ) : (
            <Send className="w-4 h-4 text-white" />
          )}
        </button>
      </form>
    </div>
  );
}
