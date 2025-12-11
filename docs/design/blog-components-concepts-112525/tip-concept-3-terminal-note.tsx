/**
 * Tip Component - Concept 3: Terminal Note
 *
 * DESIGN RATIONALE:
 * - Developer-focused aesthetic inspired by terminal UIs
 * - Monospace typography reinforces technical context
 * - Command-line visual language ($ prompt indicator)
 * - Appeals to technical readers familiar with CLI tools
 *
 * TRADEOFFS:
 * + Distinctive, memorable design
 * + Perfect for dev/technical audience
 * - May feel out of place in non-technical content
 * - Monospace harder to read for longer text
 */

import * as React from "react";
import { cn } from "@/lib/utils";

interface TipProps {
  children: React.ReactNode;
  command?: string; // e.g., "tip --save" or "note --important"
  className?: string;
}

export function TipTerminalNote({
  children,
  command = "tip",
  className
}: TipProps) {
  return (
    <aside
      className={cn(
        "my-6 rounded-lg overflow-hidden",
        "bg-[#0d1117] dark:bg-[#0d1117]",
        "border border-[#30363d]",
        "font-mono",
        className
      )}
      role="note"
    >
      {/* Terminal Header */}
      <div className="flex items-center gap-2 px-4 py-2.5 bg-[#161b22] border-b border-[#30363d]">
        <div className="flex gap-1.5">
          <span className="w-3 h-3 rounded-full bg-[#f85149]" />
          <span className="w-3 h-3 rounded-full bg-[#f0883e]" />
          <span className="w-3 h-3 rounded-full bg-[#3fb950]" />
        </div>
        <span className="text-[11px] text-[#8b949e] ml-2">
          ~/workflow
        </span>
      </div>

      {/* Terminal Content */}
      <div className="p-4">
        <div className="flex items-start gap-2 mb-2">
          <span className="text-amber-400 select-none">$</span>
          <span className="text-[13px] text-[#8b949e]">{command}</span>
        </div>
        <div className="text-[13px] text-[#c9d1d9] leading-relaxed pl-5">
          {children}
        </div>
      </div>
    </aside>
  );
}

// Usage Example from the article:
// <TipTerminalNote command="tip --save">
//   Always save the research and planning docs as .md files.
// </TipTerminalNote>
//
// <TipTerminalNote command="note --important">
//   If you discover failures during the build process, fix them right then and there.
// </TipTerminalNote>

export default TipTerminalNote;
