'use client';

import { useMemo } from 'react';

interface SuggestedPromptsProps {
  onPromptClick: (prompt: string) => void;
  isLoading?: boolean;
  prompts?: string[];
  numberOfPromptsToShow?: number;
}

export function SuggestedPrompts({
  onPromptClick,
  isLoading = false,
  prompts: cmsPrompts,
  numberOfPromptsToShow = 2
}: SuggestedPromptsProps) {
  // Randomly select prompts when CMS data loads
  // Must call hooks unconditionally before any returns
  const selectedPrompts = useMemo(() => {
    if (!cmsPrompts || cmsPrompts.length === 0) {
      return [];
    }
    const shuffled = [...cmsPrompts].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, numberOfPromptsToShow);
  }, [cmsPrompts, numberOfPromptsToShow]); // Re-run when prompts load

  // Only show if we have prompts
  if (selectedPrompts.length === 0) {
    return null;
  }

  return (
    <div className="px-4 py-4 flex flex-col gap-2">
      <p className="text-sm text-chat-foreground/60 mb-2 chatbot-suggestion">Suggested questions:</p>
      {selectedPrompts.map((prompt, index) => (
        <button
          key={index}
          onClick={() => onPromptClick(prompt)}
          disabled={isLoading}
          className="
            group
            flex items-center
            px-4 py-3
            text-left
            text-sm
            bg-chat-suggestion
            hover:bg-chat-suggestion-hover
            border border-chat-input-border
            hover:border-accent/50
            rounded-lg
            cursor-pointer
            transition-colors duration-200
            disabled:opacity-50
            disabled:cursor-not-allowed
          "
        >
          <span className="text-sm text-chat-foreground/80 group-hover:text-chat-foreground chatbot-suggestion transition-colors duration-200">
            {prompt}
          </span>
        </button>
      ))}
    </div>
  );
}
