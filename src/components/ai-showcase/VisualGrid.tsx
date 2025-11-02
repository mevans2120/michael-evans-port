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
            "bg-gradient-to-br from-accent/10 to-accent/5",
            "border border-accent/20",
            "hover:border-accent/40 transition-smooth",
            "group"
          )}
        >
          {/* Image or Placeholder */}
          <div className="relative aspect-video bg-accent/5">
            {card.image ? (
              <Image
                src={card.image.url}
                alt={card.image.alt}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-normal"
              />
            ) : card.placeholderText ? (
              <div className="absolute inset-0 flex items-center justify-center p-8">
                <p className="text-center text-lg text-accent-light/60 font-medium">
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
