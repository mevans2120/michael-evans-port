import { MetadataRoute } from 'next'
import { client } from '@/sanity/lib/client'
import { groq } from 'next-sanity'

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://mevans.space'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Fetch all published case studies
  const caseStudies = await client.fetch<Array<{ slug: string; _updatedAt: string }>>(
    groq`*[_type == "project" && defined(slug.current)] {
      "slug": slug.current,
      _updatedAt
    }`
  )

  // Fetch all published blog posts
  const blogPosts = await client.fetch<Array<{ slug: string; _updatedAt: string }>>(
    groq`*[_type == "blog" && defined(slug.current)] {
      "slug": slug.current,
      _updatedAt
    }`
  )

  // Static routes
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/case-studies`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.5,
    },
  ]

  // Dynamic case study routes
  const caseStudyRoutes: MetadataRoute.Sitemap = caseStudies.map((study) => ({
    url: `${baseUrl}/case-studies/${study.slug}`,
    lastModified: new Date(study._updatedAt),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }))

  // Dynamic blog post routes
  const blogRoutes: MetadataRoute.Sitemap = blogPosts.map((post) => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: new Date(post._updatedAt),
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }))

  return [...staticRoutes, ...caseStudyRoutes, ...blogRoutes]
}
