'use client'

import React from 'react'
import Image from 'next/image'
import { buildImageUrl } from '@/lib/sanity/image-builder'

interface EditorialHeroProps {
  badge?: string
  title: string
  subtitle?: string
  overview?: {
    role?: string
    company?: string
    timeline?: string
  }
  backgroundImage?: {
    asset?: {
      _id: string
      url: string
    }
    crop?: {
      top: number
      bottom: number
      left: number
      right: number
    }
    hotspot?: {
      x: number
      y: number
      height: number
      width: number
    }
    alt?: string
  }
}

/**
 * Editorial hero component for case studies
 * Split layout with content on left and image on right (desktop)
 * Stacked layout on mobile: content → image → overview
 */
export function EditorialHero({ badge, title, subtitle, overview, backgroundImage }: EditorialHeroProps) {
  // Build image URL using 'hero' preset (1920x900, crop top, quality 85)
  const imageUrl = backgroundImage?.asset
    ? buildImageUrl(backgroundImage, 'hero')
    : null

  return (
    <header className="pt-16 md:pt-24 pb-8 md:pb-12">
      <div className="max-w-4xl mx-auto px-6 w-full">

        {/* Content and Image Layout - Blog Post Style */}
        <div className="flex flex-col md:flex-row gap-8 items-start mb-8">
          {/* Left: Text Content */}
          <div className="flex-1">
            {badge && (
              <div className="font-sans text-xs uppercase tracking-[2px] text-accent dark:text-accent font-semibold mb-6">
                {badge}
              </div>
            )}

            <h1 className="text-[48px] md:text-[60px] lg:text-[72px] font-bold text-foreground dark:text-foreground leading-[1.05] mb-6">
              {title}
            </h1>

            {subtitle && (
              <p className="text-[20px] md:text-[24px] text-muted-foreground leading-[1.4]">
                {subtitle}
              </p>
            )}
          </div>

          {/* Right: Featured Image */}
          {imageUrl && (
            <div className="w-full md:w-1/3 flex-shrink-0 md:mt-[42px]">
              <div className="relative rounded-lg overflow-hidden bg-muted shadow-xl ring-1 ring-border/50 aspect-[4/3]">
                <Image
                  src={imageUrl}
                  alt={backgroundImage?.alt || ""}
                  fill
                  priority
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-contain transition-opacity duration-normal"
                />
              </div>
            </div>
          )}
        </div>

        {/* Overview metadata */}
        {overview && (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 pt-8 border-t border-border dark:border-border">
            {overview.role && (
              <div>
                <div className="font-sans text-xs uppercase tracking-[2px] text-muted-foreground mb-2">
                  Role
                </div>
                <div className="font-sans text-base text-foreground dark:text-foreground font-medium">
                  {overview.role}
                </div>
              </div>
            )}
            {overview.company && (
              <div>
                <div className="font-sans text-xs uppercase tracking-[2px] text-muted-foreground mb-2">
                  Company
                </div>
                <div className="font-sans text-base text-foreground dark:text-foreground font-medium">
                  {overview.company}
                </div>
              </div>
            )}
            {overview.timeline && (
              <div>
                <div className="font-sans text-xs uppercase tracking-[2px] text-muted-foreground mb-2">
                  Timeline
                </div>
                <div className="font-sans text-base text-foreground dark:text-foreground font-medium">
                  {overview.timeline}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  )
}
