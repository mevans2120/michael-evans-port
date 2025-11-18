'use client'

import { useState, useEffect, useCallback } from 'react'
import Image from 'next/image'
import { buildImageUrl } from '@/lib/sanity/image-builder'
import { urlFor } from '@/sanity/lib/client'
import type { SanityImageSource } from '@sanity/image-url/lib/types/types'
import {
  Dialog,
  DialogContent,
  DialogClose,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
  type CarouselApi,
} from '@/components/ui/carousel'
import { X, ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'

export interface ImageCarouselImage {
  asset: SanityImageSource
  alt: string
  caption?: string
  _key?: string
}

interface ImageCarouselLightboxProps {
  images: ImageCarouselImage[]
  /** Optional CSS class for the grid container */
  className?: string
  /** Grid layout - defaults to 2 columns */
  columns?: 2 | 3
}

export function ImageCarouselLightbox({
  images,
  className,
  columns = 2
}: ImageCarouselLightboxProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [api, setApi] = useState<CarouselApi>()
  const [current, setCurrent] = useState(0)

  // Handle opening the lightbox with a specific image
  const handleImageClick = useCallback((index: number) => {
    setSelectedIndex(index)
    setIsOpen(true)
  }, [])

  // Update carousel to show selected image when dialog opens
  useEffect(() => {
    if (isOpen && api) {
      api.scrollTo(selectedIndex, true) // true = instant, no animation
    }
  }, [isOpen, selectedIndex, api])

  // Track current slide for caption display
  useEffect(() => {
    if (!api) return

    const onSelect = () => {
      setCurrent(api.selectedScrollSnap())
    }

    api.on('select', onSelect)
    onSelect() // Set initial state

    return () => {
      api.off('select', onSelect)
    }
  }, [api])

  // Keyboard navigation for the dialog
  useEffect(() => {
    if (!isOpen) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        e.preventDefault()
        api?.scrollPrev()
      } else if (e.key === 'ArrowRight') {
        e.preventDefault()
        api?.scrollNext()
      } else if (e.key === 'Escape') {
        e.preventDefault()
        setIsOpen(false)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, api])

  if (!images || images.length === 0) return null

  const gridCols = columns === 3 ? 'grid-cols-2 md:grid-cols-3' : 'grid-cols-2'

  return (
    <>
      {/* Thumbnail Grid */}
      <div className={cn('my-8', className)}>
        <div className={cn('grid gap-4', gridCols)}>
          {images.map((image, index) => {
            if (!image?.asset) return null

            const imageUrl = buildImageUrl(image, 'grid')

            return (
              <figure key={image._key || index} className="space-y-3">
                <button
                  onClick={() => handleImageClick(index)}
                  className="relative w-full h-auto rounded-lg overflow-hidden bg-muted block transition-smooth hover:opacity-80 focus-outline cursor-pointer"
                  aria-label={`View full size: ${image.alt || `Image ${index + 1}`}`}
                >
                  <img
                    src={imageUrl}
                    alt={image.alt || ''}
                    className="w-full h-auto object-contain rounded-lg"
                  />
                </button>
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

      {/* Lightbox Dialog */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent
          className="max-w-[95vw] w-full h-[95vh] p-0 border-0 bg-black/95 dark:bg-black/95 [&>button]:h-10 [&>button]:w-10 [&>button]:bg-black/50 [&>button]:hover:bg-black/70 [&>button]:rounded-full [&>button_svg]:h-6 [&>button_svg]:w-6 [&>button]:text-white/90"
          aria-describedby="carousel-description"
        >
          {/* Visually hidden title for accessibility */}
          <DialogTitle className="sr-only">
            Image Gallery - {current + 1} of {images.length}
          </DialogTitle>

          {/* Hidden description for accessibility */}
          <p id="carousel-description" className="sr-only">
            Image carousel lightbox. Use arrow keys to navigate between images, escape to close.
          </p>

          {/* Carousel */}
          <Carousel
            setApi={setApi}
            opts={{
              loop: true,
              startIndex: selectedIndex,
            }}
            className="w-full h-full flex items-center justify-center"
          >
            <CarouselContent className="h-full">
              {images.map((image, index) => {
                if (!image?.asset) return null

                const imageUrl = urlFor(image)
                  .width(1920)
                  .height(1080)
                  .fit('max')
                  .url()

                return (
                  <CarouselItem
                    key={image._key || index}
                    className="flex flex-col items-center justify-center h-full"
                  >
                    {/* Image container - leave space for caption */}
                    <div className={cn(
                      "relative w-full flex items-center justify-center px-4 md:px-16",
                      image.caption ? "h-[calc(100%-120px)] py-8" : "h-full py-12"
                    )}>
                      <img
                        src={imageUrl}
                        alt={image.alt || ''}
                        className="max-w-[75%] max-h-[75%] object-contain"
                      />
                    </div>

                    {/* Caption */}
                    {image.caption && (
                      <div className="w-full px-4 md:px-16 py-6 flex items-center justify-center">
                        <p className="text-sm text-white/90 text-center max-w-2xl">
                          {image.caption}
                        </p>
                      </div>
                    )}
                  </CarouselItem>
                )
              })}
            </CarouselContent>

            {/* Navigation Arrows */}
            <CarouselPrevious
              className="left-4 h-12 w-12 rounded-full bg-black/50 text-white/90 border-0 hover:bg-black/70 hover:text-white disabled:opacity-30"
              aria-label="Previous image"
            >
              <ChevronLeft className="h-6 w-6" />
            </CarouselPrevious>

            <CarouselNext
              className="right-4 h-12 w-12 rounded-full bg-black/50 text-white/90 border-0 hover:bg-black/70 hover:text-white disabled:opacity-30"
              aria-label="Next image"
            >
              <ChevronRight className="h-6 w-6" />
            </CarouselNext>
          </Carousel>

          {/* Image Counter */}
          <div className="absolute top-4 left-1/2 -translate-x-1/2 px-4 py-2 bg-black/50 rounded-full">
            <p className="text-sm text-white/90">
              {current + 1} / {images.length}
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
