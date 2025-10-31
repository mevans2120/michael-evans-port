'use client'

import React from 'react'
import { cn } from '@/lib/utils'

interface TimelinePhaseProps {
  phase: string
  title: string
  description: string
  className?: string
}

/**
 * Timeline phase card for AI Workflow horizontal timeline
 * Displays phase label, title, and description in a card format
 */
export function TimelinePhase({
  phase,
  title,
  description,
  className
}: TimelinePhaseProps) {
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
      {/* Timeline Node */}
      <div className="flex items-center mb-6">
        <div className="w-4 h-4 rounded-full bg-purple-400 ring-4 ring-purple-400/20" />
        <div className="flex-1 h-px bg-purple-500/30 ml-4" />
      </div>

      {/* Card */}
      <div
        className={cn(
          "flex-1 p-8 rounded-2xl",
          "bg-gradient-to-br from-purple-500/10 to-purple-900/5",
          "border border-purple-500/20",
          "hover:border-purple-500/40 transition-all duration-300",
          "hover:scale-[1.02]",
          "space-y-4"
        )}
      >
        {/* Phase Label */}
        <div className="text-xs uppercase tracking-widest text-purple-400 font-medium">
          {phase}
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
