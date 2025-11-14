'use client'

import React from 'react'
import Image from 'next/image'
import { urlFor } from '@/sanity/lib/image'
import { SanityImageSource } from '@sanity/image-url/lib/types/types'

interface VisualCard {
  image?: SanityImageSource
  placeholderText?: string
  caption?: string
  _key?: string
}

interface VisualCardsProps {
  cards: VisualCard[]
}

/**
 * Visual cards component for screenshots and images
 * Displays images in a responsive grid with captions
 */
export function VisualCards({ cards }: VisualCardsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-12">
      {cards.map((card, index) => (
        <div
          key={card._key || index}
          className="bg-card dark:bg-card border border-border dark:border-border shadow-card overflow-hidden"
        >
          {card.image ? (
            <div className="relative w-full h-auto bg-muted">
              <img
                src={urlFor(card.image).width(800).url()}
                alt={card.caption || 'Case study visual'}
                className="w-full h-auto object-contain"
              />
            </div>
          ) : card.placeholderText ? (
            <div className="aspect-video w-full bg-muted flex items-center justify-center p-8">
              <p className="font-sans text-sm text-muted-foreground text-center">
                {card.placeholderText}
              </p>
            </div>
          ) : null}

          {card.caption && (
            <div className="p-4">
              <p className="font-serif text-sm text-muted-foreground">
                {card.caption}
              </p>
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
