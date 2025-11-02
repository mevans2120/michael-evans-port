'use client'

import React from 'react'
import { cn } from '@/lib/utils'

interface ProjectCardProps {
  projectName: string
  projectType: string
  description: string
  technologies?: string[]
  icon?: string
  className?: string
}

/**
 * Project card for Marketing Sites horizontal showcase
 * Displays project name, type, description, technologies, and icon
 */
export function ProjectCard({
  projectName,
  projectType,
  description,
  technologies,
  icon,
  className
}: ProjectCardProps) {
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
          "bg-gradient-to-br from-purple-500/10 dark:from-purple-400/10 to-purple-900/5 dark:to-purple-800/5",
          "border border-purple-500/20 dark:border-purple-400/20",
          "hover:border-purple-500/40 dark:hover:border-purple-400/40 transition-all duration-300",
          "hover:scale-[1.02]",
          "space-y-6"
        )}
      >
        {/* Header with Icon */}
        <div className="flex items-start justify-between">
          <div className="flex-1 space-y-2">
            {/* Project Name */}
            <h3 className="font-syne text-2xl md:text-3xl font-bold text-white">
              {projectName}
            </h3>

            {/* Project Type */}
            <div className="text-sm text-purple-300 dark:text-purple-200">
              {projectType}
            </div>
          </div>

          {/* Icon */}
          {icon && (
            <div className="text-4xl ml-4">{icon}</div>
          )}
        </div>

        {/* Description */}
        <p className="text-base text-gray-300 leading-relaxed">
          {description}
        </p>

        {/* Technologies */}
        {technologies && technologies.length > 0 && (
          <div className="flex flex-wrap gap-2 pt-2">
            {technologies.map((tech, index) => (
              <span
                key={index}
                className={cn(
                  "px-3 py-1 rounded-full text-xs",
                  "bg-purple-500/10 dark:bg-purple-400/10 border border-purple-500/30 dark:border-purple-400/30",
                  "text-purple-200 dark:text-purple-100"
                )}
              >
                {tech}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
