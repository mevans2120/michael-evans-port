import { notFound } from 'next/navigation'
import { sanityFetch } from '@/sanity/lib/live'
import { client } from '@/lib/sanity/client'
import { Metadata } from 'next'
import {
  EditorialHero,
  EditorialMetrics,
  ContentSlide,
  EditorialCTA,
} from '@/components/case-study-editorial'

interface EditorialCaseStudyData {
  title: string
  slug: {
    current: string
  }
  category: string
  heroSection?: {
    badge?: string
    title?: string
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
    title,
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
      image,
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

// Revalidate every hour (ISR - Incremental Static Regeneration)
export const revalidate = 3600

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

  return {
    title: `${project.title} | Michael Evans`,
    description: project.heroSection?.subtitle || project.heroSection?.summary,
  }
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
        title={project.heroSection?.title || project.title}
        subtitle={project.heroSection?.subtitle}
        summary={project.heroSection?.summary}
        overview={project.overview}
      />

      {/* Metrics (if present) */}
      {project.metrics && project.metrics.length > 0 && (
        <EditorialMetrics metrics={project.metrics} />
      )}

      {/* Content Slides */}
      {project.slides?.map((slide: any) => (
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
      ))}

      {/* Technologies Section */}
      {project.technologies && project.technologies.length > 0 && (
        <section className="max-w-4xl mx-auto px-6 py-16 border-t border-border dark:border-border">
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

      {/* Call to Action */}
      {project.callToAction && (
        <EditorialCTA text={project.callToAction.text} link={project.callToAction.link} />
      )}
    </div>
  )
}
