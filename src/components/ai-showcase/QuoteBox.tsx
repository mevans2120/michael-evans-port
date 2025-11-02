'use client'

import React from 'react'
import { cn } from '@/lib/utils'

interface QuoteBoxProps {
  quote: string
  attribution?: string
  className?: string
}

/**
 * Quote box component for pullquotes
 * Displays a styled quote with optional attribution
 */
export function QuoteBox({ quote, attribution, className }: QuoteBoxProps) {
  return (
    <blockquote
      className={cn(
        "p-8 rounded-2xl",
        "bg-gradient-to-br from-purple-500/10 dark:from-purple-400/10 to-purple-900/5 dark:to-purple-800/5",
        "border-l-4 border-purple-400 dark:border-purple-300",
        "space-y-4",
        className
      )}
    >
      {/* Quote */}
      <p className="text-lg md:text-xl text-white font-light italic leading-relaxed">
        "{quote}"
      </p>

      {/* Attribution */}
      {attribution && (
        <footer className="text-sm text-purple-300 dark:text-purple-200">
          {attribution}
        </footer>
      )}
    </blockquote>
  )
}
