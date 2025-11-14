/**
 * Portrait Image List Component
 * Renders 1-10 portrait-oriented images in a horizontal scrolling row with thick black borders and captions
 * Supports horizontal scrolling when images exceed viewport width
 * Features scroll snapping for smooth navigation between images
 */

import Image from 'next/image'
import { urlFor } from '@/sanity/lib/client'
import type { SanityImageSource } from '@sanity/image-url/lib/types/types'

interface PortraitImage {
  asset: SanityImageSource
  alt: string
  caption?: string
  _key?: string
}

interface PortraitImageListProps {
  images: PortraitImage[]
}

export function PortraitImageList({ images }: PortraitImageListProps) {
  if (!images || images.length === 0) return null

  return (
    <div className="my-8">
      <div className="flex gap-4 overflow-x-auto scroll-smooth snap-x snap-mandatory px-4 scrollbar-hide">
        {images.map((image) => {
          if (!image?.asset) return null

          const imageUrl = urlFor(image).url()

          return (
            <figure key={image._key} className="flex-shrink-0 flex flex-col gap-3 w-fit snap-start">
              <div className="border-accent border-[4px] rounded-[6px] overflow-hidden bg-muted">
                <img
                  src={imageUrl}
                  alt={image.alt || ''}
                  className="h-[500px] w-auto object-contain rounded-[2px] block max-w-full"
                />
              </div>
              {image.caption && (
                <figcaption className="text-sm text-muted-foreground text-center w-0 min-w-full">
                  {image.caption}
                </figcaption>
              )}
            </figure>
          )
        })}
      </div>
    </div>
  )
}
