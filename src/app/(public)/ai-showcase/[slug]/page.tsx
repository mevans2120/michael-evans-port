import { notFound } from 'next/navigation'
import { client } from '@/lib/sanity/client'
import { aiShowcaseBySlugQuery, allAIShowcaseSlugsQuery } from '@/lib/sanity/queries/aiShowcase'
import type { AIShowcase } from '@/types/aiShowcase'
import { AIShowcasePageClient } from './AIShowcasePageClient'

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
  const showcase = await client.fetch<AIShowcase>(aiShowcaseBySlugQuery, {
    slug,
  })

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
  const showcase = await client.fetch<AIShowcase>(aiShowcaseBySlugQuery, {
    slug,
  })

  if (!showcase) {
    notFound()
  }

  return <AIShowcasePageClient showcase={showcase} />
}
