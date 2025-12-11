/**
 * Tip Component - Concept 1: Subtle Card
 *
 * DESIGN RATIONALE:
 * - Clean, minimal card with soft background tint
 * - Left border accent provides visual anchor without overwhelming
 * - Integrates seamlessly with prose content
 * - Uses existing design system colors (amber for tips/warnings)
 *
 * TRADEOFFS:
 * + Unobtrusive, doesn't break reading flow
 * + Familiar pattern (Stripe, Vercel docs)
 * - May be too subtle for critical tips
 * - Limited visual differentiation for multiple tip types
 */

import * as React from "react";
import { cn } from "@/lib/utils";
import { Lightbulb } from "lucide-react";

interface TipProps {
  children: React.ReactNode;
  variant?: "default" | "pro" | "warning";
  className?: string;
}

const variantStyles = {
  default: {
    container: "bg-amber-500/[0.08] dark:bg-amber-400/[0.08] border-l-amber-500 dark:border-l-amber-400",
    label: "text-amber-600 dark:text-amber-400",
    icon: "text-amber-500 dark:text-amber-400",
  },
  pro: {
    container: "bg-emerald-500/[0.08] dark:bg-emerald-400/[0.08] border-l-emerald-500 dark:border-l-emerald-400",
    label: "text-emerald-600 dark:text-emerald-400",
    icon: "text-emerald-500 dark:text-emerald-400",
  },
  warning: {
    container: "bg-rose-500/[0.08] dark:bg-rose-400/[0.08] border-l-rose-500 dark:border-l-rose-400",
    label: "text-rose-600 dark:text-rose-400",
    icon: "text-rose-500 dark:text-rose-400",
  },
};

const variantLabels = {
  default: "Tip",
  pro: "Pro Tip",
  warning: "Important",
};

export function TipSubtleCard({ children, variant = "default", className }: TipProps) {
  const styles = variantStyles[variant];
  const label = variantLabels[variant];

  return (
    <aside
      className={cn(
        "border-l-[3px] rounded-r-lg py-4 px-5 my-6",
        "transition-colors-smooth",
        styles.container,
        className
      )}
      role="note"
    >
      <div className="flex items-center gap-2 mb-2">
        <Lightbulb className={cn("w-4 h-4", styles.icon)} aria-hidden="true" />
        <span
          className={cn(
            "text-[13px] font-semibold uppercase tracking-wide",
            styles.label
          )}
        >
          {label}
        </span>
      </div>
      <div className="text-[15px] text-foreground/90 leading-relaxed font-sans">
        {children}
      </div>
    </aside>
  );
}

// Usage Example from the article:
// <TipSubtleCard>
//   Always save the research and planning docs as .md files.
// </TipSubtleCard>
//
// <TipSubtleCard variant="pro">
//   If you discover failures during the build process, fix them right then and there.
// </TipSubtleCard>

export default TipSubtleCard;
