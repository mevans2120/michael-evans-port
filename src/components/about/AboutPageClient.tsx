'use client'

import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { PortableText } from '@portabletext/react'

// TypeScript interfaces
interface QuickFact {
  label: string
  value: string
}

interface Subsection {
  heading: string
  content: any // PortableText content
}

interface Section {
  heading: string
  slug: { current: string }
  content: any // PortableText content
  subsections?: Subsection[]
  visible: boolean
}

interface AboutData {
  name: string
  profileImage: string
  heroHeadline: string
  heroSubheadline: string
  heroIntro: string
  quickFacts: QuickFact[]
  sections: Section[]
  availability: boolean
  availabilityText: string
  ctaText: string
  ctaButtonText: string
}

interface AboutPageClientProps {
  data: AboutData
}

export default function AboutPageClient({ data }: AboutPageClientProps) {
  if (!data) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-950 text-gray-100">
      {/* Blur orbs for atmosphere */}
      <div className="fixed top-[10%] left-[10%] w-[400px] h-[400px] rounded-full bg-purple-500 opacity-20 blur-[100px] pointer-events-none -z-10" />
      <div className="fixed bottom-[20%] right-[10%] w-[400px] h-[400px] rounded-full bg-purple-600 opacity-20 blur-[100px] pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-6 md:px-10 py-20 md:py-32">
        {/* Hero Section with Photo */}
        <div className="flex flex-col md:flex-row items-start md:items-center gap-12 md:gap-16 mb-20 md:mb-32 opacity-0 animate-fadeIn">
          <div className="flex-1">
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-semibold mb-6 text-gray-50">
              {data.name}
            </h1>
            <p className="text-xl md:text-2xl text-gray-400 mb-8 font-light">
              {data.heroHeadline}
            </p>
            {data.heroIntro && (
              <p className="text-lg md:text-xl text-gray-300 leading-relaxed">
                {data.heroIntro}
              </p>
            )}
          </div>
          {data.profileImage && (
            <div className="flex-shrink-0">
              <div className="relative w-48 h-48 md:w-52 md:h-52 lg:w-56 lg:h-56">
                <Image
                  src={data.profileImage}
                  alt={data.name}
                  fill
                  className="rounded-full object-cover border-2 border-purple-400/20"
                  priority
                />
              </div>
            </div>
          )}
        </div>

        {/* Quick Facts Grid */}
        {data.quickFacts && data.quickFacts.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 my-20 md:my-32 py-16 border-t border-b border-purple-400/10">
            {data.quickFacts.map((fact, index) => (
              <div
                key={index}
                className="opacity-0 animate-slideUp"
                style={{ animationDelay: `${index * 100}ms`, animationFillMode: 'forwards' }}
              >
                <div className="text-xs uppercase tracking-wider text-gray-500 mb-2">
                  {fact.label}
                </div>
                <div className="text-lg font-medium text-gray-50">
                  {fact.value}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Dynamic Content Sections - Two Column Layout */}
        {data.sections && data.sections.map((section, index) => {
          if (!section.visible) return null

          return (
            <section
              key={index}
              id={section.slug?.current}
              className="mb-20 md:mb-32"
            >
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-normal mb-10 text-gray-50 relative pb-4">
                {section.heading}
                <span className="absolute bottom-0 left-0 w-16 h-px bg-gradient-to-r from-purple-400 to-transparent" />
              </h2>

              {/* Main section content - Two columns on large screens */}
              {section.content && (
                <div className="lg:columns-2 lg:gap-x-12 space-y-0 prose prose-invert prose-lg max-w-none mb-8">
                  <PortableText value={section.content} />
                </div>
              )}

              {/* Subsections - Two columns on large screens */}
              {section.subsections && section.subsections.map((subsection, subIndex) => (
                <div key={subIndex} className="mt-10">
                  <h3 className="text-2xl md:text-3xl font-normal text-purple-400 mb-4">
                    {subsection.heading}
                  </h3>
                  {subsection.content && (
                    <div className="lg:columns-2 lg:gap-x-12 space-y-0 prose prose-invert prose-lg max-w-none">
                      <PortableText value={subsection.content} />
                    </div>
                  )}
                </div>
              ))}
            </section>
          )
        })}

        {/* CTA Section */}
        <section className="mt-20 md:mt-32">
          <div className="text-center">
            {data.ctaText && (
              <p className="text-lg md:text-xl text-gray-400 mb-8 max-w-2xl mx-auto">
                {data.ctaText}
              </p>
            )}
            <Link
              href="/contact"
              className="inline-block px-12 py-5 bg-gradient-to-r from-purple-500 to-purple-600 text-black font-semibold rounded-lg text-lg transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_20px_40px_rgba(168,85,247,0.4)]"
            >
              {data.ctaButtonText || "Let's Work Together"}
            </Link>
          </div>
        </section>
      </div>
    </div>
  )
}
