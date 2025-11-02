'use client'

import React from 'react'
import { cn } from '@/lib/utils'

interface WorkflowStepProps {
  stepNumber: number
  title: string
  description: string
  icon?: string
  className?: string
}

/**
 * Workflow step card for PostPal horizontal workflow
 * Displays numbered step with title, description, and optional icon
 */
export function WorkflowStep({
  stepNumber,
  title,
  description,
  icon,
  className
}: WorkflowStepProps) {
  return (
    <div
      className={cn(
        // Sizing and snap
        "min-w-[350px] md:min-w-[400px] lg:min-w-[450px]",
        "snap-center",
        "flex flex-col",
        className
      )}
    >
      {/* Card */}
      <div
        className={cn(
          "flex-1 p-8 rounded-2xl",
          "bg-gradient-to-br from-accent/10 to-accent/5",
          "border border-accent/20",
          "hover:border-accent/40 transition-smooth",
          "hover:scale-[1.02]",
          "space-y-6"
        )}
      >
        {/* Step Number & Icon */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            {/* Step Number */}
            <div className={cn(
              "w-12 h-12 rounded-full",
              "bg-accent/20 border-2 border-accent",
              "flex items-center justify-center",
              "font-syne text-xl font-bold text-accent-light"
            )}>
              {stepNumber}
            </div>
          </div>

          {/* Icon */}
          {icon && (
            <div className="text-3xl">{icon}</div>
          )}
        </div>

        {/* Title */}
        <h3 className="font-syne text-2xl md:text-3xl font-bold text-white">
          {title}
        </h3>

        {/* Description */}
        <p className="text-base text-gray-300 leading-relaxed">
          {description}
        </p>
      </div>
    </div>
  )
}
