import Image from 'next/image'
import { urlFor } from '@/sanity/lib/client'
import type { SanityImageSource } from '@sanity/image-url/lib/types/types'

interface ImageGridImage {
  asset: SanityImageSource
  alt: string
  caption?: string
  _key?: string
}

interface ImageGridProps {
  images: ImageGridImage[]
}

export function ImageGrid({ images }: ImageGridProps) {
  if (!images || images.length === 0) return null

  return (
    <div className="my-8">
      <div className="grid grid-cols-2 gap-4">
        {images.map((image) => {
          if (!image?.asset) return null

          const imageUrl = urlFor(image).url()

          return (
            <figure key={image._key} className="space-y-3">
              <div className="relative w-full h-auto rounded-lg overflow-hidden bg-muted">
                <img
                  src={imageUrl}
                  alt={image.alt || ''}
                  className="w-full h-auto object-contain rounded-lg"
                />
              </div>
              {image.caption && (
                <figcaption className="text-sm text-muted-foreground">
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
