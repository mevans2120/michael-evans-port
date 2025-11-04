import { Metadata } from 'next'
import { urlFor, client } from './client'

interface SanityImage {
  asset?: {
    _ref: string
    _type: string
  }
  alt?: string
}

export interface SanitySEO {
  metaTitle?: string
  metaDescription?: string
  keywords?: string[]
  ogTitle?: string
  ogDescription?: string
  ogImage?: SanityImage
  twitterCard?: 'summary' | 'summary_large_image'
  twitterTitle?: string
  twitterDescription?: string
  twitterImage?: SanityImage
  canonicalUrl?: string
  noIndex?: boolean
}

interface GlobalSEOSettings {
  siteName?: string
  defaultMetaDescription?: string
  defaultOgImage?: SanityImage
  twitterHandle?: string
  author?: string
  siteUrl?: string
  keywords?: string[]
}

interface GenerateMetadataOptions {
  seo?: SanitySEO
  title: string // Fallback title (e.g., page title)
  description?: string // Fallback description
  path?: string // Current page path for canonical URL
  featuredImage?: SanityImage // Featured image from the document
  defaultImage?: string // Default OG image URL (hardcoded fallback)
}

// Cache global settings to avoid repeated fetches
let globalSettingsCache: GlobalSEOSettings | null = null

async function getGlobalSEOSettings(): Promise<GlobalSEOSettings> {
  if (globalSettingsCache) {
    return globalSettingsCache
  }

  try {
    const settings = await client.fetch<GlobalSEOSettings>(
      `*[_type == "seoSettings"][0] {
        siteName,
        defaultMetaDescription,
        defaultOgImage {
          asset,
          alt
        },
        twitterHandle,
        author,
        siteUrl,
        keywords
      }`
    )
    globalSettingsCache = settings || {}
    return globalSettingsCache
  } catch (error) {
    console.warn('Failed to fetch global SEO settings, using defaults:', error)
    return {}
  }
}

/**
 * Generate Next.js metadata from Sanity SEO data with intelligent fallbacks
 *
 * Priority order:
 * - SEO field values (if set)
 * - Page-specific values (title, description, featuredImage)
 * - Global SEO settings from Sanity
 * - Hardcoded fallback values
 */
export async function generateSanityMetadata({
  seo,
  title,
  description,
  path,
  featuredImage,
  defaultImage = '/default-og-image.png',
}: GenerateMetadataOptions): Promise<Metadata> {
  // Fetch global SEO settings
  const globalSettings = await getGlobalSEOSettings()

  // Determine base URL from global settings or environment
  const baseUrl = globalSettings.siteUrl || process.env.NEXT_PUBLIC_SITE_URL || 'https://michael-evans-port.vercel.app'

  // Titles with fallback chain
  const metaTitle = seo?.metaTitle || title
  const ogTitle = seo?.ogTitle || seo?.metaTitle || title
  const twitterTitle = seo?.twitterTitle || seo?.ogTitle || seo?.metaTitle || title

  // Descriptions with fallback chain: seo → page → global → empty
  const metaDescription = seo?.metaDescription || description || globalSettings.defaultMetaDescription || ''
  const ogDescription = seo?.ogDescription || seo?.metaDescription || description || globalSettings.defaultMetaDescription || ''
  const twitterDescription = seo?.twitterDescription || seo?.ogDescription || seo?.metaDescription || description || globalSettings.defaultMetaDescription || ''

  // Images with fallback chain: seo.ogImage → featuredImage → global.defaultOgImage → hardcoded defaultImage
  let ogImageUrl: string | undefined = defaultImage

  if (seo?.ogImage?.asset) {
    ogImageUrl = urlFor(seo.ogImage).width(1200).height(630).url()
  } else if (featuredImage?.asset) {
    ogImageUrl = urlFor(featuredImage).width(1200).height(630).url()
  } else if (globalSettings.defaultOgImage?.asset) {
    ogImageUrl = urlFor(globalSettings.defaultOgImage).width(1200).height(630).url()
  }

  // Twitter image: seo.twitterImage → seo.ogImage → featuredImage → global → hardcoded
  let twitterImageUrl: string | undefined = ogImageUrl

  if (seo?.twitterImage?.asset) {
    twitterImageUrl = urlFor(seo.twitterImage).width(1200).height(675).url()
  }

  // Keywords with fallback to global settings
  const keywords = seo?.keywords && seo.keywords.length > 0
    ? seo.keywords
    : globalSettings.keywords || []

  // Canonical URL
  const canonical = seo?.canonicalUrl || (path ? `${baseUrl}${path}` : undefined)

  // Twitter handle with fallback to global settings
  const twitterHandle = globalSettings.twitterHandle ? `@${globalSettings.twitterHandle}` : '@mevans212'

  const metadata: Metadata = {
    title: metaTitle,
    description: metaDescription,

    // Robots
    ...(seo?.noIndex && { robots: { index: false, follow: false } }),

    // Keywords
    ...(keywords.length > 0 && { keywords }),

    // Canonical URL
    ...(canonical && { alternates: { canonical } }),

    // Open Graph
    openGraph: {
      title: ogTitle,
      description: ogDescription,
      url: canonical,
      siteName: globalSettings.siteName || 'Michael Evans Portfolio',
      locale: 'en_US',
      type: 'website',
      ...(ogImageUrl && {
        images: [{
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: seo?.ogImage?.alt || featuredImage?.alt || globalSettings.defaultOgImage?.alt || ogTitle,
        }],
      }),
    },

    // Twitter
    twitter: {
      card: seo?.twitterCard || 'summary_large_image',
      title: twitterTitle,
      description: twitterDescription,
      ...(twitterImageUrl && {
        images: [twitterImageUrl],
      }),
      // Twitter handle from global settings
      creator: twitterHandle,
      site: twitterHandle,
    },
  }

  return metadata
}
