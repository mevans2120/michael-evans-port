import { notFound } from 'next/navigation'
import { client } from '@/lib/sanity/client'
import { Metadata } from 'next'
import AboutPageClient from '@/components/about/AboutPageClient'

export const metadata: Metadata = {
  title: 'About | Michael Evans',
  description: 'Product Manager, UX Strategist, and AI Builder with 20 years of experience solving complex problems.',
}

export default async function AboutPage() {
  const data = await client.fetch(`
    *[_type == "profile"] | order(_updatedAt desc)[0] {
      name,
      "profileImage": profileImage.asset->url,
      heroHeadline,
      heroSubheadline,
      heroIntro,
      quickFacts,
      capabilities,
      sections[] {
        heading,
        slug,
        content,
        subsections,
        visible
      },
      selectedProjects[] | order(order asc),
      availability,
      availabilityText,
      ctaText,
      ctaButtonText
    }
  `)

  if (!data) {
    notFound()
  }

  return <AboutPageClient data={data} />
}
