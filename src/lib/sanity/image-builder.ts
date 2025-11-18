/**
 * Centralized Image URL Builder
 *
 * Provides predefined presets for consistent image sizing across the site.
 * All images should use this utility instead of calling urlFor() directly.
 *
 * @example
 * ```typescript
 * import { buildImageUrl } from '@/lib/sanity/image-builder'
 *
 * // Use predefined presets
 * const heroUrl = buildImageUrl(image, 'hero')
 * const cardUrl = buildImageUrl(image, 'card')
 * const articleUrl = buildImageUrl(image, 'article-full')
 * ```
 */

import { urlFor } from '@/sanity/lib/client'
import type { SanityImageSource } from '@sanity/image-url/lib/types/types'

/**
 * Available image presets
 *
 * - `hero`: Large hero images (1200x900 = 4:3 aspect, crop from top)
 * - `card`: Card thumbnails (600x450 = 4:3 aspect, crop from top)
 * - `article-full`: Full-width article images (1200w, flexible height)
 * - `article-float`: Floating article images (800w, flexible height)
 * - `portrait`: Portrait-oriented images (800w, flexible height)
 * - `visual-card`: Visual cards (800w, flexible height)
 * - `grid`: Grid images (800w, flexible height)
 */
export type ImagePreset =
  | 'hero'
  | 'card'
  | 'article-full'
  | 'article-float'
  | 'portrait'
  | 'visual-card'
  | 'grid'

interface PresetConfig {
  width?: number
  height?: number
  fit?: 'clip' | 'crop' | 'fill' | 'fillmax' | 'max' | 'scale' | 'min'
  crop?: 'top' | 'bottom' | 'left' | 'right' | 'center'
  quality?: number
  auto?: 'format'
}

/**
 * Preset configurations
 *
 * Each preset defines width, height, fit, crop, quality, and format settings.
 * Modify these to change image behavior globally.
 */
const PRESET_CONFIGS: Record<ImagePreset, PresetConfig> = {
  hero: {
    width: 1200,
    quality: 80,
    auto: 'format',
  },
  card: {
    width: 600,
    height: 450,
    quality: 80,
    auto: 'format',
  },
  'article-full': {
    width: 1200,
    quality: 80,
    auto: 'format',
  },
  'article-float': {
    width: 800,
    quality: 80,
    auto: 'format',
  },
  portrait: {
    width: 800,
    quality: 80,
    auto: 'format',
  },
  'visual-card': {
    width: 800,
    quality: 80,
    auto: 'format',
  },
  grid: {
    width: 800,
    quality: 80,
    auto: 'format',
  },
}

/**
 * Build a Sanity image URL using a predefined preset
 *
 * @param image - Sanity image source object
 * @param preset - Preset name (e.g., 'hero', 'card', 'article-full')
 * @returns Fully-formed Sanity CDN URL with size/quality parameters
 *
 * @example
 * ```typescript
 * const url = buildImageUrl(myImage, 'hero')
 * // Returns: https://cdn.sanity.io/images/.../image.jpg?w=1920&h=900&fit=crop&crop=top&q=85&auto=format
 * ```
 */
export function buildImageUrl(
  image: SanityImageSource,
  preset: ImagePreset
): string {
  const config = PRESET_CONFIGS[preset]
  let builder = urlFor(image)

  if (config.width) builder = builder.width(config.width)
  if (config.height) builder = builder.height(config.height)
  if (config.fit) builder = builder.fit(config.fit)
  if (config.crop) builder = builder.crop(config.crop)
  if (config.quality) builder = builder.quality(config.quality)
  if (config.auto) builder = builder.auto(config.auto)

  return builder.url()
}

/**
 * Convenience function for hero images
 * @param image - Sanity image source
 * @returns URL for hero image (1920x900, crop top)
 */
export const getHeroImageUrl = (image: SanityImageSource) =>
  buildImageUrl(image, 'hero')

/**
 * Convenience function for card thumbnails
 * @param image - Sanity image source
 * @returns URL for card image (600x450, crop top)
 */
export const getCardImageUrl = (image: SanityImageSource) =>
  buildImageUrl(image, 'card')

/**
 * Convenience function for article images
 * @param image - Sanity image source
 * @param floating - Whether image is floating (true) or full-width (false)
 * @returns URL for article image (1200w full / 800w float)
 */
export const getArticleImageUrl = (
  image: SanityImageSource,
  floating = false
) => buildImageUrl(image, floating ? 'article-float' : 'article-full')
