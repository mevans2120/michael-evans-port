'use client'

import React from 'react'
import { PortableText } from '@portabletext/react'
import { CaseStudySection } from './CaseStudySection'
import { urlFor } from '@/lib/sanity/client'
import Image from 'next/image'

interface Metric {
  label: string
  value: string
  description?: string
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
    <div className="min-h-screen bg-gradient-to-b from-[#0a0a14] to-[#050510] text-foreground">
      {/* Blur orbs for atmosphere - using exact HSL values from wireframe */}
      <div className="fixed top-[10%] left-[10%] w-[400px] h-[400px] rounded-full bg-[hsl(280,100%,70%)] opacity-15 blur-[100px] pointer-events-none -z-10" />
      <div className="fixed bottom-[20%] right-[10%] w-[500px] h-[500px] rounded-full bg-[hsl(276,100%,75%)] opacity-15 blur-[100px] pointer-events-none -z-10" />

      <div className="max-w-5xl mx-auto px-6 md:px-10 py-20 md:py-32">
        {/* Back Link */}
        <a
          href="/case-studies"
          className="inline-block text-muted-foreground hover:text-[hsl(var(--name-purple))] transition-colors mb-12"
        >
          ← Back to Case Studies
        </a>

        {/* Hero Section */}
        <header className="mb-20 md:mb-32">
          {category && (
            <div className="inline-block px-6 py-2 bg-[hsl(var(--name-purple)/0.1)] border border-[hsl(var(--name-purple)/0.3)] rounded-full text-xs font-semibold uppercase tracking-wider text-[hsl(var(--name-purple))] mb-8">
              {category}
            </div>
          )}
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-semibold mb-6 bg-gradient-to-r from-[hsl(var(--name-purple))] to-foreground bg-clip-text text-transparent">
            {title}
          </h1>
          {subtitle && (
            <p className="text-xl md:text-2xl text-muted-foreground font-light leading-relaxed max-w-3xl">
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
          <section className="mb-20 md:mb-32">
            <h2 className="text-3xl md:text-4xl font-serif font-normal mb-10 text-foreground">
              Key Metrics
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {metrics.map((metric, index) => (
                <div key={index} className="bg-white/[0.03] border border-white/10 rounded-3xl p-12 text-center">
                  <div className="text-6xl md:text-7xl font-bold font-serif bg-gradient-to-r from-[hsl(276,100%,75%)] to-[hsl(var(--name-purple))] bg-clip-text text-transparent mb-4">
                    {metric.value}
                  </div>
                  <div className="text-lg font-medium text-foreground mb-2 font-serif">
                    {metric.label}
                  </div>
                  {metric.description && (
                    <div className="text-sm text-muted-foreground">
                      {metric.description}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Achievements Section */}
        {achievements && achievements.length > 0 && (
          <section className="mb-20 md:mb-32">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif font-light mb-10 text-foreground relative pb-4">
              Key Achievements
              <span className="absolute bottom-0 left-0 w-16 h-px bg-gradient-to-r from-[hsl(var(--name-purple))] to-transparent" />
            </h2>
            <div className="space-y-6">
              {achievements.map((achievement, index) => (
                <div
                  key={index}
                  className="relative pl-8 text-lg text-foreground/90 leading-relaxed font-sans"
                >
                  <span className="absolute left-0 top-3 w-1.5 h-1.5 rounded-full bg-[hsl(var(--name-purple))]" />
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
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif font-light mb-10 text-foreground relative pb-4">
              Technologies Used
              <span className="absolute bottom-0 left-0 w-16 h-px bg-gradient-to-r from-[hsl(var(--name-purple))] to-transparent" />
            </h2>
            <div className="flex flex-wrap gap-3">
              {technologies.map((tech, index) => (
                <span
                  key={index}
                  className="px-4 py-2 bg-[hsl(var(--name-purple)/0.1)] border border-[hsl(var(--name-purple)/0.2)] rounded-full text-sm text-[hsl(var(--accent-light))] font-serif"
                >
                  {tech}
                </span>
              ))}
            </div>
          </section>
        )}

        {/* Back to Top / CTA */}
        <div className="text-center pt-20 border-t border-white/10">
          <a
            href="/case-studies"
            className="inline-block px-12 py-5 bg-gradient-to-r from-[hsl(var(--accent))] to-[hsl(var(--name-purple))] text-background font-semibold rounded-lg text-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_20px_40px_rgba(199,128,245,0.4)]"
          >
            View More Case Studies
          </a>
        </div>
      </div>
    </div>
  )
}
