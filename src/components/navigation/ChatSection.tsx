'use client';

import { useState } from 'react';
import { useNavigation } from '@/contexts/NavigationContext';
import { useIsDesktop } from '@/hooks/useMediaQuery';
import { Sparkles, ChevronDown, Send } from 'lucide-react';
import { SuggestedPrompts } from './SuggestedPrompts';

interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant';
}

export function ChatSection() {
  const { panelState, chatExpanded, setChatExpanded } = useNavigation();
  const isDesktop = useIsDesktop();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: "Hi! I can help you explore Michael's portfolio. What would you like to know?",
      role: 'assistant'
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [hasInteracted, setHasInteracted] = useState(false);

  const isExpanded = panelState === 'expanded';
  const showChatContent = isDesktop ? isExpanded : chatExpanded;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputValue,
      role: 'user'
    };
    setMessages([...messages, userMessage]);
    setInputValue('');

    // TODO: Send to AI backend
  };

  const handleInputFocus = () => {
    // Expand chat when input is focused
    setChatExpanded(true);
    setHasInteracted(true);
  };

  const handlePromptClick = (prompt: string) => {
    setInputValue(prompt);
    if (!isDesktop) {
      setChatExpanded(true);
    }
  };

  const handleHeaderClick = () => {
    if (!chatExpanded) {
      setChatExpanded(true);
      setHasInteracted(true);
    }
  };

  return (
    <div
      className={`flex flex-col border-t md:border-t-0 border-neutral-800 ${
        isDesktop && chatExpanded
          ? 'absolute inset-0 z-10 bg-neutral-900'
          : !isDesktop && chatExpanded
          ? 'absolute bottom-0 left-0 right-0 z-10 bg-neutral-900'
          : ''
      }`}
      style={{
        height: isDesktop
          ? (chatExpanded ? '100%' : '34%')
          : (chatExpanded ? '50vh' : 'auto')
      }}
    >
      {/* Chat Header */}
      <div
        className="px-8 py-6 border-b border-neutral-800 flex items-center justify-between flex-shrink-0"
        onClick={handleHeaderClick}
        style={{ cursor: !chatExpanded ? 'pointer' : 'default' }}
      >
        <div className="flex items-center gap-4">
          <Sparkles className="w-4 h-4 text-purple-400" />
          {(!isDesktop || isExpanded || chatExpanded) && (
            <h2 className="text-lg font-medium text-white">AI Assistant</h2>
          )}
        </div>
        {chatExpanded && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              setChatExpanded(false);
            }}
            className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 transition-all"
            aria-label="Collapse chat"
          >
            <ChevronDown className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Chat Messages */}
      {showChatContent && (
        <div className="flex-1 overflow-y-auto px-4 py-4">
          {messages.map((message) => (
            <div key={message.id} className="mb-4">
              <div
                className={`
                  px-4 py-2.5 rounded-lg
                  ${message.role === 'assistant'
                    ? 'bg-neutral-800 text-neutral-200'
                    : 'bg-purple-600 text-white ml-auto'
                  }
                `}
              >
                <p className="text-sm">{message.content}</p>
              </div>
            </div>
          ))}

          {/* Suggested Prompts - Show below welcome message when expanded */}
          {messages.length === 1 && hasInteracted && chatExpanded && (
            <SuggestedPrompts onPromptClick={handlePromptClick} />
          )}
        </div>
      )}

      {/* Chat Input */}
      {showChatContent && (
        <form
          onSubmit={handleSubmit}
          className="px-4 py-3 border-t border-neutral-800 flex gap-2 flex-shrink-0"
        >
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onFocus={handleInputFocus}
            placeholder="Ask about Michael's work..."
            className="flex-1 px-3 py-2 text-sm bg-neutral-800 border border-neutral-700 text-white placeholder-neutral-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
          <button
            type="submit"
            className="p-2 bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors"
          >
            <Send className="w-4 h-4 text-white" />
          </button>
        </form>
      )}
    </div>
  );
}
