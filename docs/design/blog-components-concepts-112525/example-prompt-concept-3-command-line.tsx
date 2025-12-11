/**
 * Example Prompt Component - Concept 3: Command Line
 *
 * DESIGN RATIONALE:
 * - Terminal aesthetic with code-block styling
 * - Window chrome (dots) adds visual interest
 * - Cyan prompt indicator draws attention
 * - Technical and distinctive for developer audience
 *
 * TRADEOFFS:
 * + Memorable, distinctive design
 * + Clear visual hierarchy
 * - Heavier visual weight
 * - Monospace may be less readable for long prompts
 */

import * as React from "react";
import { cn } from "@/lib/utils";
import { Copy, Check } from "lucide-react";

interface ExamplePromptProps {
  children: React.ReactNode;
  filename?: string;
  copyable?: boolean;
  className?: string;
}

export function ExamplePromptCommandLine({
  children,
  filename = "prompt.txt",
  copyable = true,
  className,
}: ExamplePromptProps) {
  const [copied, setCopied] = React.useState(false);
  const textContent = typeof children === "string" ? children : "";

  const handleCopy = async () => {
    if (textContent) {
      await navigator.clipboard.writeText(textContent);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <figure className={cn("my-6", className)}>
      <div
        className={cn(
          "rounded-lg overflow-hidden",
          "bg-[#0d1117]",
          "border border-[#30363d]"
        )}
      >
        {/* Window Header */}
        <div className="flex items-center justify-between px-4 py-2.5 bg-[#161b22] border-b border-[#30363d]">
          <div className="flex items-center gap-3">
            <div className="flex gap-1.5">
              <span className="w-3 h-3 rounded-full bg-[#f85149]" />
              <span className="w-3 h-3 rounded-full bg-[#f0883e]" />
              <span className="w-3 h-3 rounded-full bg-[#3fb950]" />
            </div>
            <span className="text-[11px] text-[#8b949e] font-mono">
              {filename}
            </span>
          </div>

          {copyable && textContent && (
            <button
              onClick={handleCopy}
              className={cn(
                "p-1.5 rounded-md",
                "text-[#8b949e] hover:text-[#c9d1d9]",
                "hover:bg-[#30363d]",
                "transition-colors duration-150"
              )}
              aria-label={copied ? "Copied!" : "Copy prompt"}
            >
              {copied ? (
                <Check className="w-4 h-4 text-[#3fb950]" />
              ) : (
                <Copy className="w-4 h-4" />
              )}
            </button>
          )}
        </div>

        {/* Prompt Content */}
        <div className="p-4 font-mono">
          <div className="flex items-start gap-2">
            <span className="text-cyan-400 select-none" aria-hidden="true">
              &gt;
            </span>
            <p className="text-[13px] text-[#c9d1d9] leading-relaxed">
              {children}
            </p>
          </div>
        </div>
      </div>
    </figure>
  );
}

// Usage Examples from the article:
//
// <ExamplePromptCommandLine>
//   Can you create a phased approach for implementing this web (and soon to be mobile)
//   app monorepo? Since this is such a large undertaking, can your plan include
//   additional research phases before we dive deep into specific functional areas?
// </ExamplePromptCommandLine>
//
// <ExamplePromptCommandLine filename="start-phase.txt">
//   Let's get started on phase 1
// </ExamplePromptCommandLine>

export default ExamplePromptCommandLine;
