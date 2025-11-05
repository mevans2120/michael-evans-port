import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { CaseStudyBackground } from './CaseStudyBackground'
import { OrnamentalCTA } from '@/components/ui/OrnamentalCTA'

interface CaseStudy {
  title: string
  slug: { current: string }
  category?: string

  // Editorial format
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

  // Featured image
  featuredImage?: {
    asset?: {
      _id: string
      url: string
      metadata?: {
        dimensions?: any
        lqip?: string
      }
    }
    alt?: string
  }
}

interface CaseStudiesHeroProps {
  caseStudy: CaseStudy
}

export function CaseStudiesHero({ caseStudy }: CaseStudiesHeroProps) {
  // Get primary metric (first metric or custom logic)
  const primaryMetric = caseStudy.metrics?.[0]

  // Use editorial format fields
  const displayTitle = caseStudy.heroSection?.title || caseStudy.title
  const displayDescription = caseStudy.heroSection?.subtitle
    || caseStudy.heroSection?.summary
    || ''

  const displayImage = caseStudy.featuredImage

  return (
    <section className="relative min-h-[75vh] flex items-center py-28 md:py-32 overflow-hidden">
      {/* Background layers */}
      <CaseStudyBackground image={displayImage} />

      {/* Content */}
      <div className="container relative z-10 max-w-5xl">
        <div className="max-w-[900px]">
          {/* Label */}
          <div className="inline-block text-sm font-semibold tracking-widest uppercase text-accent-light mb-6">
            {caseStudy.category || 'Case Study'}
          </div>

          {/* Title */}
          <h1
            className="text-5xl md:text-7xl lg:text-8xl font-light leading-tight mb-8 text-gradient"
          >
            {displayTitle}
          </h1>

          {/* Primary Metric */}
          {primaryMetric && (
            <div className="flex items-center gap-4 text-2xl font-semibold text-accent-light mb-6">
              <div className="w-10 h-0.5 bg-gradient-to-r from-accent to-transparent" />
              {primaryMetric.value}
            </div>
          )}

          {/* Description */}
          {displayDescription && (
            <p className="text-xl leading-relaxed text-gray-200 max-w-[700px] mb-12">
              {displayDescription}
            </p>
          )}

          {/* CTA */}
          <OrnamentalCTA
            text="View Case Study"
            href={`/case-studies/${caseStudy.slug.current}`}
          />
        </div>
      </div>

      {/* Randomly Selected Badge - Bottom Left */}
      <div className="absolute bottom-8 left-8 z-20">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-background/80 backdrop-blur-sm border border-border text-xs font-medium text-muted-foreground">
          <svg
            viewBox="0 0 16 16"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            className="w-3 h-3"
          >
            <circle cx="8" cy="8" r="6" />
            <path d="M8 5v6M5 8h6" />
          </svg>
          Randomly Selected
        </div>
      </div>
    </section>
  )
}
