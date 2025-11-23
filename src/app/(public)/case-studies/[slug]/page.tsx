import { notFound } from 'next/navigation'
import { sanityFetch } from '@/sanity/lib/live'
import { client } from '@/sanity/lib/client'
import { type Metadata } from 'next'
import { generateSanityMetadata } from '@/lib/sanity/metadata'
import {
  EditorialHero,
  EditorialMetrics,
  ContentSlide,
} from '@/components/case-study-editorial'
import { FlowingArticle } from '@/components/case-study-flowing'
import { ViewMoreProjects } from '@/components/view-more-projects'

interface EditorialCaseStudyData {
  title: string
  slug: {
    current: string
  }
  category: string
  heroSection?: {
    badge?: string
    subtitle?: string
    summary?: string
  }
  overview?: {
    role?: string
    company?: string
    timeline?: string
  }
  metrics?: Array<{
    value: string
    label: string
    description?: string
  }>
  article?: any[] // Flowing article content (new format)
  slides?: Array<{
    _key: string
    sectionLabel?: string
    heading?: string
    content?: any[] // Portable Text blocks
    quoteBox?: {
      quote: string
      attribution?: string
    }
    comparisonBoxes?: Array<{
      label?: string
      title?: string
      text: string
      stat?: string
      icon?: string
      _key?: string
    }>
    visualCards?: Array<{
      image?: any
      placeholderText?: string
      caption?: string
      _key?: string
    }>
    annotation?: {
      title: string
      content: string
    }
  }>
  technologies?: string[]
  callToAction?: {
    text: string
    link: string
  }
}

const EDITORIAL_PROJECT_QUERY = `*[_type == "project" && slug.current == $slug][0] {
  title,
  slug,
  category,
  heroSection {
    badge,
    subtitle,
    summary
  },
  overview {
    role,
    company,
    timeline
  },
  metrics[] {
    value,
    label,
    description
  },
  article[] {
    ...,
    _type == "image" => {
      ...,
      asset->{
        _id,
        url
      },
      crop,
      hotspot
    }
  },
  slides[] {
    _key,
    sectionLabel,
    heading,
    content,
    quoteBox {
      quote,
      attribution
    },
    comparisonBoxes[] {
      _key,
      label,
      title,
      text,
      stat,
      icon
    },
    visualCards[] {
      _key,
      image {
        asset->{
          _id,
          url
        },
        crop,
        hotspot,
        alt
      },
      placeholderText,
      caption
    },
    annotation {
      title,
      content
    }
  },
  technologies,
  callToAction {
    text,
    link
  },
  featuredImage {
    asset->{
      _id,
      url
    },
    crop,
    hotspot,
    alt
  },
  seo {
    metaTitle,
    metaDescription,
    keywords,
    twitterCard,
    canonicalUrl,
    noIndex
  }
}`

interface PageProps {
  params: Promise<{
    slug: string
  }>
}

// Generate static params for all case studies at build time
export async function generateStaticParams() {
  const projects = await client.fetch<{ slug: string }[]>(
    `*[_type == "project" && category == "Case Study"]{ "slug": slug.current }`
  )

  return projects.map((project) => ({
    slug: project.slug,
  }))
}

// Generate metadata for SEO
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const { data: project } = await sanityFetch({
    query: EDITORIAL_PROJECT_QUERY,
    params: { slug },
  })

  if (!project) {
    return {
      title: 'Case Study Not Found',
    }
  }

  return generateSanityMetadata({
    seo: project.seo,
    title: `${project.title} | Michael Evans`,
    description: project.heroSection?.subtitle || project.featuredDescription,
    path: `/case-studies/${slug}`,
    featuredImage: project.featuredImage,
  })
}

export default async function CaseStudyPage({ params }: PageProps) {
  const { slug } = await params
  const { data: project } = await sanityFetch({
    query: EDITORIAL_PROJECT_QUERY,
    params: { slug },
  })

  if (!project) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Atmospheric blur orbs */}
      <div className="fixed top-[10%] left-[10%] w-[400px] h-[400px] rounded-full bg-accent/15 dark:bg-accent/15 blur-[100px] pointer-events-none -z-10" />
      <div className="fixed bottom-[20%] right-[10%] w-[500px] h-[500px] rounded-full bg-accent/10 dark:bg-accent/10 blur-[100px] pointer-events-none -z-10" />

      {/* Editorial Hero */}
      <EditorialHero
        badge={project.heroSection?.badge}
        title={project.title}
        subtitle={project.heroSection?.subtitle}
        overview={project.overview}
        backgroundImage={project.featuredImage}
      />

      {/* Metrics (if present) */}
      {project.metrics && project.metrics.length > 0 && (
        <EditorialMetrics metrics={project.metrics} />
      )}

      {/* Content: Flowing Article (new format) or Slides (legacy format) */}
      {project.article && project.article.length > 0 ? (
        <FlowingArticle article={project.article} />
      ) : (
        project.slides?.map((slide: any) => (
          <ContentSlide
            key={slide._key}
            sectionLabel={slide.sectionLabel}
            heading={slide.heading}
            content={slide.content}
            quoteBox={slide.quoteBox}
            comparisonBoxes={slide.comparisonBoxes}
            visualCards={slide.visualCards}
            annotation={slide.annotation}
          />
        ))
      )}

      {/* Technologies Section */}
      {project.technologies && project.technologies.length > 0 && (
        <section className="max-w-4xl mx-auto px-6 pt-8 pb-16 border-b border-border dark:border-border">
          <h3 className="font-sans text-xs uppercase tracking-[2px] text-muted-foreground mb-6">
            Technologies Used
          </h3>
          <div className="flex flex-wrap gap-3">
            {project.technologies.map((tech: string, index: number) => (
              <span
                key={index}
                className="px-4 py-2 bg-muted dark:bg-muted text-foreground dark:text-foreground font-sans text-sm rounded-full border border-border dark:border-border"
              >
                {tech}
              </span>
            ))}
          </div>
        </section>
      )}

      {/* View More Projects Section */}
      <ViewMoreProjects currentSlug={slug} />
    </div>
  )
}
