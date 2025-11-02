'use client'

import React from 'react'
import { cn } from '@/lib/utils'

interface ComparisonBox {
  label: string
  title?: string
  text: string
  stat?: string
  icon?: string
}

interface ComparisonGridProps {
  boxes: ComparisonBox[]
  columns?: 2 | 3
  className?: string
}

/**
 * Comparison grid component for problem/solution or before/after comparisons
 * Displays comparison boxes in a 2 or 3 column grid
 */
export function ComparisonGrid({
  boxes,
  columns = 2,
  className
}: ComparisonGridProps) {
  const gridCols = {
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
  }

  return (
    <div className={cn("grid gap-6", gridCols[columns], className)}>
      {boxes.map((box, index) => (
        <div
          key={index}
          className={cn(
            "p-8 rounded-2xl",
            "bg-gradient-to-br from-purple-500/10 dark:from-purple-400/10 to-purple-900/5 dark:to-purple-800/5",
            "border border-purple-500/20 dark:border-purple-400/20",
            "hover:border-purple-500/40 dark:hover:border-purple-400/40 transition-all duration-300",
            "space-y-4"
          )}
        >
          {/* Label & Icon */}
          <div className="flex items-start justify-between">
            <div className="text-xs uppercase tracking-widest text-purple-400 dark:text-purple-300 font-medium">
              {box.label}
            </div>
            {box.icon && (
              <div className="text-2xl">{box.icon}</div>
            )}
          </div>

          {/* Stat (if present) */}
          {box.stat && (
            <div className="font-syne text-3xl md:text-4xl font-bold text-purple-300 dark:text-purple-200">
              {box.stat}
            </div>
          )}

          {/* Title (if present) */}
          {box.title && (
            <h4 className="font-syne text-xl md:text-2xl font-bold text-white">
              {box.title}
            </h4>
          )}

          {/* Text */}
          <p className="text-base text-gray-300 leading-relaxed">
            {box.text}
          </p>
        </div>
      ))}
    </div>
  )
}
