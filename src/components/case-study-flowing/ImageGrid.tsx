import { ImageCarouselLightbox } from '@/components/ImageCarouselLightbox'
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

  return <ImageCarouselLightbox images={images} columns={2} />
}
