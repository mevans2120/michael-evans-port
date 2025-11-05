import React from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

interface OrnamentalCTAProps {
  text: string;
  href: string;
  className?: string;
}

/**
 * Ornamental CTA link with decorative gradient line and boxed arrow
 *
 * Features:
 * - Decorative gradient line that extends on hover
 * - Boxed arrow with border and background effects
 * - Smooth transitions and animations
 * - Full keyboard accessibility
 * - Dark mode support via design system tokens
 */
export function OrnamentalCTA({ text, href, className }: OrnamentalCTAProps) {
  return (
    <Link
      href={href}
      className={cn(
        // Group for hover effects
        "group",
        // Layout
        "inline-flex items-center gap-3",
        // Typography
        "text-[15px] font-medium",
        // Colors
        "text-accent hover:text-accent-light",
        // Transitions
        "transition-colors duration-300",
        // Focus styles
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        // Relative positioning for pseudo-element
        "relative",
        className
      )}
    >
      {/* Decorative gradient line (no animation) */}
      <span
        className="block w-[32px] h-[1px]"
        aria-hidden="true"
        style={{
          // Using inline style for gradient colors from design system
          background: 'linear-gradient(90deg, transparent, hsl(var(--accent)), hsl(var(--accent-light)))'
        }}
      />

      {/* Text */}
      <span>{text}</span>

      {/* Arrow (no animation) */}
      <span
        className="flex items-center justify-center"
        aria-hidden="true"
      >
        {/* Arrow SVG */}
        <svg
          viewBox="0 0 16 16"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          className="w-3.5 h-3.5"
        >
          <path d="M3 8h10M9 4l4 4-4 4"/>
        </svg>
      </span>
    </Link>
  );
}
