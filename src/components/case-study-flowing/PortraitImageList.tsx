/**
 * Portrait Image List Component
 * Renders 1-3 portrait-oriented images in a horizontal row with thick black borders and captions
 * Always displays horizontally (no responsive stacking)
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
      <div className="flex gap-4 justify-center">
        {images.map((image) => {
          if (!image?.asset) return null

          const imageUrl = urlFor(image.asset).url()

          return (
            <figure key={image._key} className="flex-shrink-0 space-y-3 max-w-[280px]">
              <div className="relative w-full aspect-[9/16] border-black border-[8px] rounded-[6px] overflow-hidden bg-muted">
                <Image
                  src={imageUrl}
                  alt={image.alt || ''}
                  fill
                  className="object-cover"
                />
              </div>
              {image.caption && (
                <figcaption className="text-sm text-muted-foreground text-center">
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
