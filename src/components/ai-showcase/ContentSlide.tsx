'use client'

import React from 'react'
import { cn } from '@/lib/utils'

interface ContentSlideProps {
  sectionLabel?: string
  heading: string
  children: React.ReactNode
  className?: string
  variant?: 'default' | 'dark' | 'darker'
  columns?: 1 | 2
}

/**
 * General-purpose content slide
 * Supports section label, heading, and flexible content children
 * Can display content in 1 or 2 columns
 */
export function ContentSlide({
  sectionLabel,
  heading,
  children,
  className,
  variant = 'default',
  columns = 1
}: ContentSlideProps) {
  const backgroundClasses = {
    default: 'bg-gradient-to-br from-[#0a0a14] via-purple-950/10 dark:via-purple-900/10 to-[#0a0a14]',
    dark: 'bg-gradient-to-br from-[#0a0a14] via-purple-900/10 dark:via-purple-800/10 to-[#050510]',
    darker: 'bg-[#050510]'
  }

  return (
    <section
      className={cn(
        // Regular section
        "w-full",
        // Background gradient
        backgroundClasses[variant],
        // Padding
        "px-8 md:px-16 lg:px-24 py-20 md:py-24",
        className
      )}
    >
      <div className="w-full max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <header className="space-y-4 mb-12">
          {/* Section Label */}
          {sectionLabel && (
            <div className="text-xs md:text-sm uppercase tracking-widest text-purple-400 dark:text-purple-300 font-medium">
              {sectionLabel}
            </div>
          )}

          {/* Heading */}
          <h2 className="font-syne text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-tight">
            {heading}
          </h2>
        </header>

        {/* Content */}
        <div className={cn(
          columns === 2
            ? "lg:columns-2 lg:gap-x-12 space-y-0"
            : "space-y-8"
        )}>
          {children}
        </div>
      </div>
    </section>
  )
}
