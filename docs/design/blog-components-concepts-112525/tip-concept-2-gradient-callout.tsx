/**
 * Tip Component - Concept 2: Gradient Callout
 *
 * DESIGN RATIONALE:
 * - Eye-catching gradient border using brand purple
 * - Floating label badge creates visual distinction
 * - Demands attention for important tips
 * - Uses accent color system for brand consistency
 *
 * TRADEOFFS:
 * + Highly visible, great for key takeaways
 * + Uses brand colors, feels integrated
 * - More visually heavy, use sparingly
 * - Floating label requires more vertical space
 */

import * as React from "react";
import { cn } from "@/lib/utils";
import { Sparkles, Lightbulb, AlertTriangle } from "lucide-react";

interface TipProps {
  children: React.ReactNode;
  variant?: "default" | "pro" | "warning";
  className?: string;
}

const variantConfig = {
  default: {
    gradient: "from-purple-500/10 to-purple-600/5 dark:from-purple-400/10 dark:to-purple-500/5",
    border: "border-purple-500/30 dark:border-purple-400/30",
    badge: "border-purple-500/30 dark:border-purple-400/30 text-purple-600 dark:text-purple-400",
    icon: Lightbulb,
    label: "Tip",
  },
  pro: {
    gradient: "from-emerald-500/10 to-emerald-600/5 dark:from-emerald-400/10 dark:to-emerald-500/5",
    border: "border-emerald-500/30 dark:border-emerald-400/30",
    badge: "border-emerald-500/30 dark:border-emerald-400/30 text-emerald-600 dark:text-emerald-400",
    icon: Sparkles,
    label: "Pro Tip",
  },
  warning: {
    gradient: "from-amber-500/10 to-amber-600/5 dark:from-amber-400/10 dark:to-amber-500/5",
    border: "border-amber-500/30 dark:border-amber-400/30",
    badge: "border-amber-500/30 dark:border-amber-400/30 text-amber-600 dark:text-amber-400",
    icon: AlertTriangle,
    label: "Important",
  },
};

export function TipGradientCallout({ children, variant = "default", className }: TipProps) {
  const config = variantConfig[variant];
  const Icon = config.icon;

  return (
    <aside
      className={cn(
        "relative my-8 rounded-xl border p-5 pt-6",
        "bg-gradient-to-br",
        config.gradient,
        config.border,
        "transition-colors-smooth",
        className
      )}
      role="note"
    >
      {/* Floating Badge */}
      <div
        className={cn(
          "absolute -top-3 left-5",
          "bg-background px-3 py-1.5 rounded-full",
          "border",
          "flex items-center gap-1.5",
          config.badge
        )}
      >
        <Icon className="w-3.5 h-3.5" aria-hidden="true" />
        <span className="text-xs font-semibold uppercase tracking-wide">
          {config.label}
        </span>
      </div>

      <div className="text-[15px] text-foreground/90 leading-relaxed font-sans">
        {children}
      </div>
    </aside>
  );
}

// Usage Example from the article:
// <TipGradientCallout variant="pro">
//   Always save the research and planning docs as .md files.
// </TipGradientCallout>

export default TipGradientCallout;
