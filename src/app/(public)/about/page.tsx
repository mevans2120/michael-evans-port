import { notFound } from 'next/navigation'
import { cachedSanityFetch } from '@/sanity/lib/fetch'
import { type Metadata } from 'next'
import AboutPageClient from '@/components/about/AboutPageClient'
import { generateSanityMetadata } from '@/lib/sanity/metadata'
import { generateProfilePageSchema, generateBreadcrumbSchema, type StructuredDataProfile } from '@/lib/structured-data'
import { JsonLd } from '@/components/JsonLd'
import type { PortableTextBlock } from 'sanity'

// Profile data type for the about page
interface ProfileData {
  _updatedAt: string
  name: string
  profileImage: {
    asset: {
      _ref: string
      _type: string
      url?: string
    }
    hotspot?: {
      x: number
      y: number
      height: number
      width: number
    }
    crop?: {
      top: number
      bottom: number
      left: number
      right: number
    }
  }
  profileImageUrl?: string
  heroHeadline: string
  heroSubheadline?: string
  heroIntro?: string
  title?: string
  quickFacts?: Array<{ label: string; value: string }>
  article?: PortableTextBlock[]
  skills?: Array<{ category: string; skills: string[] }>
  experience?: Array<{
    company: string
    role: string
    startDate?: string
    endDate?: string
    current?: boolean
    description?: string
  }>
  social?: {
    github?: string
    linkedin?: string
    twitter?: string
    bluesky?: string
    email?: string
  }
  seo?: {
    metaTitle?: string
    metaDescription?: string
    keywords?: string[]
    twitterCard?: 'summary' | 'summary_large_image'
    canonicalUrl?: string
    noIndex?: boolean
  }
}

const profileQuery = `
  *[_type == "profile"] | order(_updatedAt desc)[0] {
    _updatedAt,
    name,
    profileImage {
      asset->,
      hotspot,
      crop
    },
    "profileImageUrl": profileImage.asset->url,
    heroHeadline,
    heroSubheadline,
    heroIntro,
    title,
    quickFacts,
    article,
    skills,
    experience,
    social,
    seo {
      metaTitle,
      metaDescription,
      keywords,
      twitterCard,
      canonicalUrl,
      noIndex
    }
  }
`

export async function generateMetadata(): Promise<Metadata> {
  const { data: profile } = await cachedSanityFetch<ProfileData | null>({ query: profileQuery, tags: ['profile'] })

  return generateSanityMetadata({
    seo: profile?.seo,
    title: 'About | Michael Evans',
    description: profile?.heroSubheadline || 'Product Manager, UX Strategist, and AI Builder with 20 years of experience solving complex problems.',
    path: '/about',
  })
}

export default async function AboutPage() {
  const { data } = await cachedSanityFetch<ProfileData | null>({ query: profileQuery, tags: ['profile'] })

  if (!data) {
    notFound()
  }

  // Generate ProfilePage structured data
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://michael-evans.com'
  const profileData: StructuredDataProfile = {
    name: data.name,
    profileImageUrl: data.profileImageUrl,
    heroHeadline: data.heroHeadline,
    heroSubheadline: data.heroSubheadline,
    title: data.title,
    social: data.social,
    skills: data.skills,
    experience: data.experience,
  }
  const profilePageSchema = generateProfilePageSchema(
    profileData,
    siteUrl,
    data._updatedAt
  )
  const breadcrumbSchema = generateBreadcrumbSchema(
    [
      { name: 'Home', url: '/' },
      { name: 'About' },
    ],
    siteUrl
  )

  return (
    <>
      <JsonLd data={[profilePageSchema, breadcrumbSchema]} />
      <AboutPageClient data={data} />
    </>
  )
}
