'use client'

import React from 'react'
import { PortableText } from '@portabletext/react'
import { CaseStudySection } from './CaseStudySection'
import { urlFor } from '@/lib/sanity/client'
import Image from 'next/image'

interface Metric {
  label: string
  value: string
}

interface Achievement {
  _key?: string
  children?: { text: string }[]
}

interface Screenshot {
  image: {
    asset: {
      _ref: string
      url?: string
    }
  }
  caption?: string
  layout: 'grid' | 'large'
}

interface Section {
  _key: string
  sectionLabel?: string
  heading: string
  content: any // Portable Text content
  screenshots?: Screenshot[]
}

interface Overview {
  role?: string
  company?: string
  timeline?: string
}

interface CaseStudyNarrativeProps {
  title: string
  subtitle?: string
  category?: string
  heroImage?: string
  metrics?: Metric[]
  achievements?: string[]
  overview?: Overview
  sections?: Section[]
  technologies?: string[]
}

export function CaseStudyNarrative({
  title,
  subtitle,
  category,
  heroImage,
  metrics,
  achievements,
  overview,
  sections,
  technologies,
}: CaseStudyNarrativeProps) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-950 text-gray-100">
      {/* Blur orbs for atmosphere - matching About page */}
      <div className="fixed top-[10%] left-[10%] w-[400px] h-[400px] rounded-full bg-purple-500 opacity-20 blur-[100px] pointer-events-none -z-10" />
      <div className="fixed bottom-[20%] right-[10%] w-[400px] h-[400px] rounded-full bg-purple-600 opacity-20 blur-[100px] pointer-events-none -z-10" />

      <div className="max-w-5xl mx-auto px-6 md:px-10 py-20 md:py-32">
        {/* Back Link */}
        <a
          href="/case-studies"
          className="inline-block text-gray-400 hover:text-purple-400 transition-colors mb-12"
        >
          ← Back to Case Studies
        </a>

        {/* Hero Section */}
        <header className="mb-20 md:mb-32">
          {category && (
            <div className="text-xs uppercase tracking-wider text-purple-400 mb-4">
              {category}
            </div>
          )}
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-semibold mb-6 text-gray-50">
            {title}
          </h1>
          {subtitle && (
            <p className="text-xl md:text-2xl text-gray-400 font-light leading-relaxed max-w-3xl">
              {subtitle}
            </p>
          )}

          {/* Hero Image */}
          {heroImage && (
            <div className="mt-12 relative aspect-[16/9] rounded-2xl overflow-hidden border border-purple-400/10">
              <Image
                src={heroImage}
                alt={title}
                fill
                className="object-cover"
                priority
              />
            </div>
          )}

          {/* Overview Metadata */}
          {overview && (overview.role || overview.company || overview.timeline) && (
            <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-8 py-8 border-t border-b border-purple-400/10">
              {overview.role && (
                <div>
                  <div className="text-xs uppercase tracking-wider text-gray-500 mb-2">
                    Role
                  </div>
                  <div className="text-base text-gray-200">
                    {overview.role}
                  </div>
                </div>
              )}
              {overview.company && (
                <div>
                  <div className="text-xs uppercase tracking-wider text-gray-500 mb-2">
                    Company
                  </div>
                  <div className="text-base text-gray-200">
                    {overview.company}
                  </div>
                </div>
              )}
              {overview.timeline && (
                <div>
                  <div className="text-xs uppercase tracking-wider text-gray-500 mb-2">
                    Timeline
                  </div>
                  <div className="text-base text-gray-200">
                    {overview.timeline}
                  </div>
                </div>
              )}
            </div>
          )}
        </header>

        {/* Metrics Section */}
        {metrics && metrics.length > 0 && (
          <section className="mb-20 md:mb-32 py-16 bg-gray-900/50 rounded-2xl px-8 md:px-12">
            <h2 className="text-3xl md:text-4xl font-normal mb-10 text-gray-50">
              Key Metrics
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {metrics.map((metric, index) => (
                <div key={index} className="text-center">
                  <div className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-400 to-purple-600 bg-clip-text text-transparent mb-2">
                    {metric.value}
                  </div>
                  <div className="text-sm text-gray-400 uppercase tracking-wide">
                    {metric.label}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Achievements Section */}
        {achievements && achievements.length > 0 && (
          <section className="mb-20 md:mb-32">
            <h2 className="text-3xl md:text-4xl font-normal mb-10 text-gray-50 relative pb-4">
              Key Achievements
              <span className="absolute bottom-0 left-0 w-16 h-px bg-gradient-to-r from-purple-400 to-transparent" />
            </h2>
            <div className="space-y-6">
              {achievements.map((achievement, index) => (
                <div
                  key={index}
                  className="relative pl-8 text-lg text-gray-300 leading-relaxed"
                >
                  <span className="absolute left-0 top-3 w-1.5 h-1.5 rounded-full bg-purple-400" />
                  {achievement}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Dynamic Sections */}
        {sections && sections.map((section, index) => (
          <CaseStudySection
            key={section._key || index}
            sectionLabel={section.sectionLabel}
            heading={section.heading}
            content={section.content}
            screenshots={section.screenshots}
            index={index}
          />
        ))}

        {/* Technologies Section */}
        {technologies && technologies.length > 0 && (
          <section className="mb-20 md:mb-32">
            <h2 className="text-3xl md:text-4xl font-normal mb-10 text-gray-50 relative pb-4">
              Technologies Used
              <span className="absolute bottom-0 left-0 w-16 h-px bg-gradient-to-r from-purple-400 to-transparent" />
            </h2>
            <div className="flex flex-wrap gap-3">
              {technologies.map((tech, index) => (
                <span
                  key={index}
                  className="px-4 py-2 bg-purple-400/10 border border-purple-400/20 rounded-full text-sm text-purple-300"
                >
                  {tech}
                </span>
              ))}
            </div>
          </section>
        )}

        {/* Back to Top / CTA */}
        <div className="text-center pt-20 border-t border-purple-400/10">
          <a
            href="/case-studies"
            className="inline-block px-12 py-5 bg-gradient-to-r from-purple-500 to-purple-600 text-black font-semibold rounded-lg text-lg transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_20px_40px_rgba(168,85,247,0.4)]"
          >
            View More Case Studies
          </a>
        </div>
      </div>
    </div>
  )
}
