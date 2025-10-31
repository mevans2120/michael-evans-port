'use client'

import React from 'react'
import { cn } from '@/lib/utils'

interface ContentSlideProps {
  sectionLabel?: string
  heading: string
  children: React.ReactNode
  className?: string
  variant?: 'default' | 'dark' | 'darker'
}

/**
 * General-purpose content slide
 * Supports section label, heading, and flexible content children
 */
export function ContentSlide({
  sectionLabel,
  heading,
  children,
  className,
  variant = 'default'
}: ContentSlideProps) {
  const backgroundClasses = {
    default: 'bg-gradient-to-br from-[#0a0a14] via-purple-950/10 to-[#0a0a14]',
    dark: 'bg-gradient-to-br from-[#0a0a14] via-purple-900/10 to-[#050510]',
    darker: 'bg-[#050510]'
  }

  return (
    <section
      className={cn(
        // Full viewport slide
        "h-screen w-full",
        "snap-start snap-always",
        // Flexbox layout
        "flex flex-col items-center justify-center",
        // Background gradient
        backgroundClasses[variant],
        // Padding
        "px-8 md:px-16 lg:px-24 py-16",
        className
      )}
    >
      <div className="w-full max-w-6xl mx-auto space-y-12">
        {/* Header */}
        <header className="text-center space-y-4">
          {/* Section Label */}
          {sectionLabel && (
            <div className="text-xs md:text-sm uppercase tracking-widest text-purple-400 font-medium">
              {sectionLabel}
            </div>
          )}

          {/* Heading */}
          <h2 className="font-syne text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-tight">
            {heading}
          </h2>
        </header>

        {/* Content */}
        <div className="space-y-8">
          {children}
        </div>
      </div>
    </section>
  )
}
