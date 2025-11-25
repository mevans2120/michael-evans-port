import { notFound } from 'next/navigation'
import { sanityFetch } from '@/sanity/lib/live'
import { type Metadata } from 'next'
import AboutPageClient from '@/components/about/AboutPageClient'
import { generateSanityMetadata } from '@/lib/sanity/metadata'
import { generateProfilePageSchema, generateBreadcrumbSchema, type StructuredDataProfile } from '@/lib/structured-data'
import { JsonLd } from '@/components/JsonLd'

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
  const { data: profile } = await sanityFetch({ query: profileQuery })

  return generateSanityMetadata({
    seo: profile?.seo,
    title: 'About | Michael Evans',
    description: profile?.heroSubheadline || 'Product Manager, UX Strategist, and AI Builder with 20 years of experience solving complex problems.',
    path: '/about',
  })
}

export default async function AboutPage() {
  const { data } = await sanityFetch({ query: profileQuery })

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
