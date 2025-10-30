'use client';

import { motion } from 'framer-motion';
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
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="px-4 py-4 flex flex-col gap-2"
    >
      <p className="text-sm text-neutral-500 mb-2 chatbot-suggestion">Suggested questions:</p>
      {prompts.map((prompt, index) => (
        <motion.button
          key={index}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{
            duration: 0.3,
            delay: index * 0.1,
            type: "spring",
            stiffness: 100
          }}
          whileHover={{ scale: 1.02, x: 4 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => onPromptClick(prompt)}
          className="
            group
            flex items-center
            px-4 py-3
            text-left
            text-sm
            bg-neutral-800
            hover:bg-neutral-750
            border border-neutral-700
            hover:border-purple-500/50
            rounded-lg
            transition-all duration-200
            cursor-pointer
          "
        >
          <span className="text-sm text-neutral-200 group-hover:text-white chatbot-suggestion">
            {prompt}
          </span>
        </motion.button>
      ))}
    </motion.div>
  );
}
