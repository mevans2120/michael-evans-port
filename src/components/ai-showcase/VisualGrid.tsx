'use client'

import React from 'react'
import Image from 'next/image'
import { cn } from '@/lib/utils'

interface VisualCard {
  image?: {
    url: string
    alt: string
  }
  placeholderText?: string
  caption?: string
}

interface VisualGridProps {
  cards: VisualCard[]
  columns?: 2 | 3
  className?: string
}

/**
 * Visual grid component for displaying images or image placeholders
 * Shows visual cards in a 2 or 3 column grid
 */
export function VisualGrid({
  cards,
  columns = 2,
  className
}: VisualGridProps) {
  const gridCols = {
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
  }

  return (
    <div className={cn("grid gap-6", gridCols[columns], className)}>
      {cards.map((card, index) => (
        <div
          key={index}
          className={cn(
            "rounded-2xl overflow-hidden",
            "bg-gradient-to-br from-purple-500/10 dark:from-purple-400/10 to-purple-900/5 dark:to-purple-800/5",
            "border border-purple-500/20 dark:border-purple-400/20",
            "hover:border-purple-500/40 dark:hover:border-purple-400/40 transition-all duration-300",
            "group"
          )}
        >
          {/* Image or Placeholder */}
          <div className="relative aspect-video bg-purple-950/20 dark:bg-purple-900/20">
            {card.image ? (
              <Image
                src={card.image.url}
                alt={card.image.alt}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-300"
              />
            ) : card.placeholderText ? (
              <div className="absolute inset-0 flex items-center justify-center p-8">
                <p className="text-center text-lg text-purple-300/60 dark:text-purple-200/60 font-medium">
                  {card.placeholderText}
                </p>
              </div>
            ) : null}
          </div>

          {/* Caption */}
          {card.caption && (
            <div className="p-4 text-sm text-gray-300">
              {card.caption}
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
