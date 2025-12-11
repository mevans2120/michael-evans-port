/**
 * Example Prompt Component - Concept 2: Chat Bubble
 *
 * DESIGN RATIONALE:
 * - Conversational UI inspired by chat interfaces
 * - Shows prompt as a message with user avatar
 * - Contextualizes prompts as dialogue with AI
 * - Gradient avatar reinforces brand colors
 *
 * TRADEOFFS:
 * + Immediately recognizable as "user input"
 * + Feels modern and contextual for AI content
 * - Takes more vertical space
 * - Avatar may feel redundant if used frequently
 */

import * as React from "react";
import { cn } from "@/lib/utils";
import { User } from "lucide-react";

interface ExamplePromptProps {
  children: React.ReactNode;
  showAvatar?: boolean;
  className?: string;
}

export function ExamplePromptChatBubble({
  children,
  showAvatar = true,
  className,
}: ExamplePromptProps) {
  return (
    <figure className={cn("my-6", className)}>
      <figcaption className="text-xs font-medium text-muted-foreground mb-3 uppercase tracking-wide">
        Example Prompt
      </figcaption>

      <div className="flex gap-3 items-start">
        {showAvatar && (
          <div
            className={cn(
              "w-8 h-8 rounded-full flex-shrink-0",
              "bg-gradient-to-br from-purple-500 to-indigo-500",
              "dark:from-purple-400 dark:to-indigo-400",
              "flex items-center justify-center",
              "shadow-sm"
            )}
            aria-hidden="true"
          >
            <User className="w-4 h-4 text-white" />
          </div>
        )}

        <div
          className={cn(
            "flex-1 rounded-2xl rounded-tl-sm",
            "bg-card dark:bg-neutral-900",
            "border border-border",
            "px-5 py-4",
            "transition-colors-smooth"
          )}
        >
          <p className="text-[14px] text-foreground leading-relaxed font-sans">
            {children}
          </p>
        </div>
      </div>
    </figure>
  );
}

// Usage Examples from the article:
//
// <ExamplePromptChatBubble>
//   Can you create a phased approach for implementing this web (and soon to be mobile)
//   app monorepo? Since this is such a large undertaking, can your plan include
//   additional research phases before we dive deep into specific functional areas?
// </ExamplePromptChatBubble>
//
// <ExamplePromptChatBubble showAvatar={false}>
//   Let's get started on phase 1
// </ExamplePromptChatBubble>

export default ExamplePromptChatBubble;
