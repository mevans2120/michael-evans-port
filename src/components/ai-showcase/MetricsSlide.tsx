'use client'

import React from 'react'
import { cn } from '@/lib/utils'

interface Metric {
  value: string
  label: string
  description?: string
}

interface MetricsSlideProps {
  heading: string
  metrics: Metric[]
  className?: string
}

/**
 * Metrics slide component for displaying key statistics
 * Shows large metrics in a grid layout
 */
export function MetricsSlide({
  heading,
  metrics,
  className
}: MetricsSlideProps) {
  return (
    <section
      className={cn(
        // Regular section
        "w-full",
        // Flexbox layout
        "flex flex-col items-center justify-center",
        // Background
        "bg-gradient-to-br from-[#0a0a14] via-purple-950/20 dark:via-purple-900/20 to-[#0a0a14]",
        // Padding
        "px-8 md:px-16 lg:px-24 py-20 md:py-24",
        className
      )}
    >
      <div className="w-full max-w-6xl mx-auto space-y-16">
        {/* Heading */}
        <h2 className="font-syne text-3xl md:text-4xl lg:text-5xl font-bold text-white text-center">
          {heading}
        </h2>

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {metrics.map((metric, index) => (
            <div
              key={index}
              className={cn(
                "p-8 rounded-2xl",
                "bg-gradient-to-br from-purple-500/10 dark:from-purple-400/10 to-purple-900/5 dark:to-purple-800/5",
                "border border-purple-500/20 dark:border-purple-400/20",
                "hover:border-purple-500/40 dark:hover:border-purple-400/40 transition-colors duration-300",
                "text-center space-y-3"
              )}
            >
              {/* Value */}
              <div className="font-syne text-4xl md:text-5xl lg:text-6xl font-bold text-purple-300 dark:text-purple-200">
                {metric.value}
              </div>

              {/* Label */}
              <div className="text-lg md:text-xl text-white font-medium">
                {metric.label}
              </div>

              {/* Description */}
              {metric.description && (
                <div className="text-sm text-gray-400">
                  {metric.description}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
