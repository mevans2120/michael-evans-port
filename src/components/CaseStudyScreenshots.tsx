'use client'

import React from 'react'
import Image from 'next/image'
import { urlFor } from '@/lib/sanity/client'

interface Screenshot {
  image: {
    asset: {
      _ref: string
      url?: string
    }
  }
  caption?: string
  layout: 'grid' | 'large'
}

interface CaseStudyScreenshotsProps {
  screenshots: Screenshot[]
}

export function CaseStudyScreenshots({ screenshots }: CaseStudyScreenshotsProps) {
  if (!screenshots || screenshots.length === 0) return null

  // Group screenshots by layout type
  const gridScreenshots = screenshots.filter((s) => s.layout === 'grid')
  const largeScreenshots = screenshots.filter((s) => s.layout === 'large')

  return (
    <div className="space-y-8 mt-12">
      {/* Grid Layout Screenshots */}
      {gridScreenshots.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {gridScreenshots.map((screenshot, index) => {
            const imageUrl =
              screenshot.image.asset.url || urlFor(screenshot.image.asset).url()

            return (
              <figure key={index} className="group">
                <div className="relative aspect-[16/10] rounded-xl overflow-hidden border border-purple-400/10 bg-gray-800/30 transition-all duration-300 group-hover:border-purple-400/30">
                  {imageUrl ? (
                    <Image
                      src={imageUrl}
                      alt={screenshot.caption || ''}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center text-gray-500 text-sm">
                      Screenshot placeholder
                    </div>
                  )}
                </div>
                {screenshot.caption && (
                  <figcaption className="mt-3 text-sm text-gray-500 italic">
                    {screenshot.caption}
                  </figcaption>
                )}
              </figure>
            )
          })}
        </div>
      )}

      {/* Large Layout Screenshots */}
      {largeScreenshots.map((screenshot, index) => {
        const imageUrl =
          screenshot.image.asset.url || urlFor(screenshot.image.asset).url()

        return (
          <figure key={`large-${index}`} className="group">
            <div className="relative aspect-[16/9] rounded-2xl overflow-hidden border border-purple-400/10 bg-gray-800/30 transition-all duration-300 group-hover:border-purple-400/30">
              {imageUrl ? (
                <Image
                  src={imageUrl}
                  alt={screenshot.caption || ''}
                  fill
                  className="object-cover"
                  priority={index === 0}
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center text-gray-500 text-sm">
                  Large screenshot placeholder
                </div>
              )}
            </div>
            {screenshot.caption && (
              <figcaption className="mt-4 text-center text-sm text-gray-500 italic">
                {screenshot.caption}
              </figcaption>
            )}
          </figure>
        )
      })}
    </div>
  )
}
