'use client'

import React from 'react'
import { cn } from '@/lib/utils'

interface HeroSlideProps {
  badge?: string
  title: string
  subtitle?: string
  summary?: string
  className?: string
}

/**
 * Hero slide component for AI Showcase opening
 * Features large title with optional badge, subtitle, and summary
 */
export function HeroSlide({
  badge,
  title,
  subtitle,
  summary,
  className
}: HeroSlideProps) {
  return (
    <section
      className={cn(
        // Regular hero section
        "w-full min-h-[70vh]",
        // Flexbox centering
        "flex items-center justify-center",
        // Gradient background
        "bg-gradient-to-br from-[#0a0a14] via-accent/5 to-[#0a0a14]",
        // Padding
        "px-8 md:px-16 lg:px-24 py-20 md:py-32",
        className
      )}
    >
      <div className="max-w-5xl mx-auto text-center space-y-8">
        {/* Badge */}
        {badge && (
          <div className="inline-block">
            <span className="inline-block px-4 py-2 rounded-full bg-accent/10 border border-accent/20 text-accent-light text-sm font-medium tracking-wide uppercase">
              {badge}
            </span>
          </div>
        )}

        {/* Title */}
        <h1 className="font-syne text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-tight">
          {title}
        </h1>

        {/* Subtitle */}
        {subtitle && (
          <p className="text-xl md:text-2xl text-accent-light font-light max-w-3xl mx-auto">
            {subtitle}
          </p>
        )}

        {/* Summary */}
        {summary && (
          <p className="text-base md:text-lg text-gray-300 max-w-2xl mx-auto leading-relaxed">
            {summary}
          </p>
        )}
      </div>
    </section>
  )
}
