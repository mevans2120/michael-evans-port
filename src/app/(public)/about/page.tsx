import { notFound } from 'next/navigation'
import { sanityFetch } from '@/sanity/lib/live'
import { Metadata } from 'next'
import AboutPageClient from '@/components/about/AboutPageClient'
import { generateSanityMetadata } from '@/lib/sanity/metadata'

const profileQuery = `
  *[_type == "profile"] | order(_updatedAt desc)[0] {
    name,
    profileImage {
      asset->,
      hotspot,
      crop
    },
    heroHeadline,
    heroSubheadline,
    heroIntro,
    quickFacts,
    article,
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

// ISR: Revalidate every 6 hours (Phase 3.4)
// Webhook provides instant updates when publishing in Sanity
export const revalidate = 21600; // 6 hours

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

  return <AboutPageClient data={data} />
}
