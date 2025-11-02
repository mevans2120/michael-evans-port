'use client';

import { useMemo } from 'react';

interface SuggestedPromptsProps {
  onPromptClick: (prompt: string) => void;
}

export function SuggestedPrompts({ onPromptClick }: SuggestedPromptsProps) {
  const allPrompts = [
    "Tell me about the first responsive airline website",
    "What's the story behind launching a restaurant with cliff diving?",
    "Show me production AI applications you've built",
    "How did you help thousands of people focus?"
  ];

  // Randomly select 2 prompts on component mount
  const prompts = useMemo(() => {
    const shuffled = [...allPrompts].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, 2);
  }, []);

  return (
    <div className="px-4 py-4 flex flex-col gap-2">
      <p className="text-sm text-neutral-500 mb-2 chatbot-suggestion">Suggested questions:</p>
      {prompts.map((prompt, index) => (
        <button
          key={index}
          onClick={() => onPromptClick(prompt)}
          className="
            group
            flex items-center
            px-4 py-3
            text-left
            text-sm
            bg-chat-suggestion
            hover:bg-chat-suggestion-hover
            border border-chat-input-border
            hover:border-purple-500/50 dark:hover:border-purple-400/50
            rounded-lg
            cursor-pointer
            transition-colors duration-200
          "
        >
          <span className="text-sm text-neutral-200 group-hover:text-white chatbot-suggestion transition-colors duration-200">
            {prompt}
          </span>
        </button>
      ))}
    </div>
  );
}
