import { type Metadata } from 'next'
import { cachedSanityFetch } from '@/sanity/lib/fetch'
import { allFeaturedCaseStudiesQuery, allProjectsAlphabeticalQuery, caseStudiesIndexPageQuery } from '@/lib/sanity/queries'
import { CaseStudiesHero } from '@/components/case-studies/CaseStudiesHero'
import { SectionSeparator } from '@/components/case-studies/SectionSeparator'
import { FeaturedCaseStudies } from '@/components/FeaturedCaseStudies'
import { generateSanityMetadata } from '@/lib/sanity/metadata'
import { generateBreadcrumbSchema } from '@/lib/structured-data'
import { JsonLd } from '@/components/JsonLd'

interface Project {
  _id: string
  category?: string
  title: string
  featuredMetric?: string
  featuredDescription?: string
  slug: { current: string }
  order?: number
  heroSection?: {
    badge?: string
    title?: string
    subtitle?: string
    summary?: string
  }
  metrics?: Array<{
    label: string
    value: string
    description?: string
  }>
  featuredImage?: {
    asset?: {
      _id: string
      url: string
      metadata?: {
        dimensions?: {
          width: number
          height: number
          aspectRatio: number
        }
        lqip?: string
      }
    }
    alt?: string
  }
}

// Type for case studies index page data from Sanity
interface CaseStudiesIndexPageData {
  _id: string
  allCaseStudiesHeading?: string
  allCaseStudiesDescription?: string
  seo?: {
    metaTitle?: string
    metaDescription?: string
    keywords?: string[]
    twitterCard?: 'summary' | 'summary_large_image'
    canonicalUrl?: string
    noIndex?: boolean
  }
}

export async function generateMetadata(): Promise<Metadata> {
  const { data: pageData } = await cachedSanityFetch<CaseStudiesIndexPageData | null>({
    query: caseStudiesIndexPageQuery,
    tags: ['case-studies'],
  });

  return generateSanityMetadata({
    seo: pageData?.seo,
    title: 'Case Studies | Michael Evans',
    description: pageData?.allCaseStudiesDescription || 'Product launches, transformational projects, and measurable business impact across e-commerce, travel, and enterprise software.',
    path: '/case-studies',
  })
}

export default async function CaseStudiesPage() {
  // Fetch data in parallel with caching
  const [{ data: featuredProjects }, { data: allProjects }, { data: pageData }] = await Promise.all([
    cachedSanityFetch<Project[]>({ query: allFeaturedCaseStudiesQuery, tags: ['case-studies'] }),
    cachedSanityFetch<Project[]>({ query: allProjectsAlphabeticalQuery, tags: ['case-studies'] }),
    cachedSanityFetch<CaseStudiesIndexPageData | null>({ query: caseStudiesIndexPageQuery, tags: ['case-studies'] })
  ])

  // Randomly select one featured project
  const randomCaseStudy = featuredProjects && featuredProjects.length > 0
    ? featuredProjects[Math.floor(Math.random() * featuredProjects.length)]
    : null

  // Format all projects for FeaturedCaseStudies component
  const caseStudies = allProjects
    .map((project: Project, index: number) => ({
      id: project._id,
      number: String(index + 1).padStart(2, '0'),
      category: project.category || 'Case Study',
      title: project.title,
      metric: project.featuredMetric || '',
      description: project.featuredDescription || '',
      slug: project.slug?.current,
      order: project.order || index + 1
    }))

  const heading = pageData?.allCaseStudiesHeading || 'All Case Studies';
  const description = pageData?.allCaseStudiesDescription || 'Product launches and transformational projects';

  // Generate breadcrumb structured data
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://michael-evans.com'
  const breadcrumbSchema = generateBreadcrumbSchema(
    [
      { name: 'Home', url: '/' },
      { name: 'Case Studies' },
    ],
    siteUrl
  )

  return (
    <>
      <JsonLd data={breadcrumbSchema} />
      <main>
      {/* Hero Section */}
      {randomCaseStudy && (
        <CaseStudiesHero caseStudy={randomCaseStudy} />
      )}

      {/* Separator */}
      <div className="container">
        <SectionSeparator />
      </div>

      {/* All Case Studies */}
      <section className="container pb-32">
        <div className="mb-16">
          <h2 className="text-3xl font-light text-foreground mb-2" style={{ fontFamily: 'var(--font-crimson-pro)' }}>
            {heading}
          </h2>
          <p className="text-muted-foreground">
            {description}
          </p>
        </div>

        {caseStudies.length > 0 && (
          <FeaturedCaseStudies studies={caseStudies} />
        )}
      </section>
    </main>
    </>
  )
}
