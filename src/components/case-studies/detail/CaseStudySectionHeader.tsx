'use client'

import { cn } from '@/lib/utils'

interface CaseStudySectionHeaderProps {
  label?: string
  heading: string
  className?: string
}

/**
 * Reusable section header with optional label and purple underline
 * Preserves exact design from inline styles:
 * - Label: hsl(280, 100%, 80%) = #c084fc = purple-300
 * - Underline: purple gradient
 * - Font sizes: clamp(2rem, 5vw, 3.5rem)
 */
export function CaseStudySectionHeader({
  label,
  heading,
  className
}: CaseStudySectionHeaderProps) {
  return (
    <header className={cn("mb-8", className)}>
      {/* Section Label */}
      {label && (
        <div
          className="text-xs font-bold uppercase mb-8 text-purple-300 dark:text-purple-200"
          style={{ letterSpacing: '0.15em' }}
        >
          {label}
        </div>
      )}

      {/* Heading with Purple Underline */}
      <h2
        className="font-light mb-8 relative pb-4"
        style={{
          fontSize: 'clamp(2rem, 5vw, 3.5rem)',
          lineHeight: '1.3'
        }}
      >
        {heading}
        <span
          className="absolute bottom-0 left-0 w-16 h-px bg-gradient-to-r from-purple-400 dark:from-purple-300 to-transparent"
        />
      </h2>
    </header>
  )
}
