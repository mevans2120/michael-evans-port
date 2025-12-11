/**
 * Example Prompt Component - Concept 1: Blockquote Style
 *
 * DESIGN RATIONALE:
 * - Classic blockquote with subtle styling
 * - Italic serif text evokes traditional publishing
 * - Elegant and unobtrusive
 * - Minimal visual weight, integrates with prose
 *
 * TRADEOFFS:
 * + Familiar pattern, easy to understand
 * + Works well in long-form content
 * - May not stand out enough as "actionable"
 * - Italic can be harder to read at length
 */

import * as React from "react";
import { cn } from "@/lib/utils";

interface ExamplePromptProps {
  children: React.ReactNode;
  label?: string;
  className?: string;
}

export function ExamplePromptBlockquote({
  children,
  label = "Example Prompt",
  className,
}: ExamplePromptProps) {
  return (
    <figure
      className={cn(
        "my-6 border-l-2 border-muted-foreground/30 pl-5",
        className
      )}
    >
      <figcaption className="text-xs font-medium text-muted-foreground mb-2 uppercase tracking-wide">
        {label}
      </figcaption>
      <blockquote className="font-serif text-[17px] italic text-foreground/85 leading-relaxed">
        "{children}"
      </blockquote>
    </figure>
  );
}

// Usage Examples from the article:
//
// <ExamplePromptBlockquote>
//   Can you create a phased approach for implementing this web (and soon to be mobile)
//   app monorepo? Since this is such a large undertaking, can your plan include
//   additional research phases before we dive deep into specific functional areas?
// </ExamplePromptBlockquote>
//
// <ExamplePromptBlockquote label="Getting Started">
//   Let's get started on phase 1
// </ExamplePromptBlockquote>

export default ExamplePromptBlockquote;
