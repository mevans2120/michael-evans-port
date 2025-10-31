'use client'

import React from 'react'
import { cn } from '@/lib/utils'

interface TechPillsProps {
  technologies: string[]
  className?: string
}

/**
 * Technology pills component for displaying tech stack tags
 * Shows technology names in pill-shaped badges
 */
export function TechPills({ technologies, className }: TechPillsProps) {
  return (
    <div className={cn("flex flex-wrap gap-3 justify-center", className)}>
      {technologies.map((tech, index) => (
        <span
          key={index}
          className={cn(
            "px-4 py-2 rounded-full text-sm",
            "bg-purple-500/10 border border-purple-500/30",
            "text-purple-200 font-medium",
            "hover:bg-purple-500/20 hover:border-purple-500/50",
            "transition-colors duration-200"
          )}
        >
          {tech}
        </span>
      ))}
    </div>
  )
}
