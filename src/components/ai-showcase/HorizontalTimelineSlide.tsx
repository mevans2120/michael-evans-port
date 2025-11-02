'use client'

import React from 'react'
import { cn } from '@/lib/utils'

interface HorizontalTimelineSlideProps {
  sectionLabel?: string
  heading: string
  children: React.ReactNode
  className?: string
}

/**
 * Horizontal scrolling slide container
 * Provides horizontal scroll-snap behavior for timeline phases, workflow steps, or project cards
 */
export function HorizontalTimelineSlide({
  sectionLabel,
  heading,
  children,
  className
}: HorizontalTimelineSlideProps) {
  return (
    <section
      className={cn(
        // Regular section
        "w-full",
        // Flexbox layout
        "flex flex-col",
        // Background
        "bg-gradient-to-br from-[#050510] via-purple-950/15 dark:via-purple-900/15 to-[#0a0a14]",
        // Padding
        "py-20 md:py-24",
        className
      )}
    >
      {/* Header */}
      <header className="px-8 md:px-16 lg:px-24 mb-12 space-y-4">
        {/* Section Label */}
        {sectionLabel && (
          <div className="text-xs md:text-sm uppercase tracking-widest text-purple-400 dark:text-purple-300 font-medium">
            {sectionLabel}
          </div>
        )}

        {/* Heading */}
        <h2 className="font-syne text-3xl md:text-4xl lg:text-5xl font-bold text-white">
          {heading}
        </h2>
      </header>

      {/* Horizontal Scroll Container */}
      <div
        className={cn(
          "flex-1 overflow-x-auto overflow-y-hidden",
          "scroll-smooth snap-x snap-mandatory",
          "px-8 md:px-16 lg:px-24",
          // Hide scrollbar
          "scrollbar-hide"
        )}
      >
        {/* Horizontal Track */}
        <div className="flex gap-8 h-full pb-8">
          {children}
        </div>
      </div>
    </section>
  )
}
