import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { CaseStudyBackground } from './CaseStudyBackground'

interface CaseStudy {
  title: string
  slug: { current: string }
  summary: string
  description: string
  metrics?: Array<{
    label: string
    value: string
    description?: string
  }>
  heroImage?: {
    asset?: {
      _id: string
      url: string
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

  return (
    <section className="relative min-h-[75vh] flex items-center py-28 md:py-32 overflow-hidden">
      {/* Background layers */}
      <CaseStudyBackground image={caseStudy.heroImage} />

      {/* Content */}
      <div className="container relative z-10 max-w-5xl">
        <div className="max-w-[900px]">
          {/* Label */}
          <div className="inline-block text-sm font-semibold tracking-widest uppercase text-purple-300 dark:text-purple-200 mb-6">
            Featured Case Study
          </div>

          {/* Title */}
          <h1
            className="text-5xl md:text-7xl lg:text-8xl font-light leading-tight mb-8"
            style={{
              fontFamily: 'var(--font-crimson-pro)',
              background: 'linear-gradient(135deg, #c084fc 0%, #ffffff 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}
          >
            {caseStudy.title}
          </h1>

          {/* Primary Metric */}
          {primaryMetric && (
            <div className="flex items-center gap-4 text-2xl font-semibold text-purple-300 dark:text-purple-200 mb-6">
              <div className="w-10 h-0.5 bg-gradient-to-r from-purple-400 dark:from-purple-300 to-transparent" />
              {primaryMetric.value}
            </div>
          )}

          {/* Description */}
          <p className="text-xl leading-relaxed text-gray-200 max-w-[700px] mb-12">
            {caseStudy.description}
          </p>

          {/* CTA */}
          <Link
            href={`/case-studies/${caseStudy.slug.current}`}
            className="inline-flex items-center gap-3 px-8 py-4 rounded-lg font-semibold text-black bg-gradient-to-br from-purple-500 to-purple-400 dark:from-purple-400 dark:to-purple-300 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-purple-500/40 transition-all duration-300"
          >
            View Case Study
            <ArrowRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </section>
  )
}
