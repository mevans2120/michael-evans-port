import { notFound } from 'next/navigation'
import { sanityFetch } from '@/sanity/lib/live'
import { client } from '@/sanity/lib/client'
import { aiShowcaseBySlugQuery, allAIShowcaseSlugsQuery } from '@/lib/sanity/queries/aiShowcase'
import type { AIShowcase } from '@/types/aiShowcase'
import { AIShowcasePageMagazine } from './AIShowcasePageMagazine'

interface PageProps {
  params: Promise<{
    slug: string
  }>
}

// Generate static params for all showcases
export async function generateStaticParams() {
  const showcases = await client.fetch<{ slug: string }[]>(allAIShowcaseSlugsQuery)
  return showcases.map((showcase) => ({
    slug: showcase.slug,
  }))
}

// Generate metadata
export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params
  const { data: showcase } = await sanityFetch({ query: aiShowcaseBySlugQuery, params: { slug } })

  if (!showcase) {
    return {
      title: 'Showcase Not Found',
    }
  }

  return {
    title: `${showcase.title} | Michael Evans`,
    description: showcase.heroSection.summary || showcase.heroSection.subtitle || showcase.title,
  }
}

export default async function AIShowcasePage({ params }: PageProps) {
  const { slug } = await params
  const { data: showcase } = await sanityFetch({ query: aiShowcaseBySlugQuery, params: { slug } })

  if (!showcase) {
    notFound()
  }

  return <AIShowcasePageMagazine showcase={showcase} />
}
