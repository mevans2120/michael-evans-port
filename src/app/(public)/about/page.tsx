'use client'

import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { client } from '@/lib/sanity/client'
import { PortableText } from '@portabletext/react'
import { logger } from '@/lib/logger'

// TypeScript interfaces
interface QuickFact {
  label: string
  value: string
}

interface Capability {
  title: string
  description: string
  isNew: boolean
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

interface SelectedProject {
  title: string
  metric: string
  description: string
  order: number
}

interface AboutData {
  name: string
  profileImage: string
  heroHeadline: string
  heroSubheadline: string
  heroIntro: string
  quickFacts: QuickFact[]
  capabilities: Capability[]
  sections: Section[]
  selectedProjects: SelectedProject[]
  availability: boolean
  availabilityText: string
  ctaText: string
  ctaButtonText: string
}

export default function AboutPage() {
  const [data, setData] = useState<AboutData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchAboutData() {
      try {
        const result = await client.fetch(`
          *[_type == "profile"] | order(_updatedAt desc)[0] {
            name,
            "profileImage": profileImage.asset->url,
            heroHeadline,
            heroSubheadline,
            heroIntro,
            quickFacts,
            capabilities,
            sections[] {
              heading,
              slug,
              content,
              subsections,
              visible
            },
            selectedProjects[] | order(order asc),
            availability,
            availabilityText,
            ctaText,
            ctaButtonText
          }
        `)

        setData(result)
      } catch (error) {
        logger.error('Failed to fetch about page data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchAboutData()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-950 flex items-center justify-center">
        <div className="text-gray-400 text-lg">Loading...</div>
      </div>
    )
  }

  if (!data) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-950 flex items-center justify-center">
        <div className="text-gray-400 text-lg">Content not found</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-950 text-gray-100">
      {/* Blur orbs for atmosphere */}
      <div className="fixed top-[10%] left-[10%] w-[400px] h-[400px] rounded-full bg-purple-500 opacity-20 blur-[100px] pointer-events-none -z-10" />
      <div className="fixed bottom-[20%] right-[10%] w-[400px] h-[400px] rounded-full bg-purple-600 opacity-20 blur-[100px] pointer-events-none -z-10" />

      <div className="max-w-5xl mx-auto px-6 md:px-10 py-20 md:py-32">
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

        {/* Dynamic Content Sections */}
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

              {/* Main section content */}
              {section.content && (
                <div className="prose prose-invert prose-lg max-w-none mb-8">
                  <PortableText value={section.content} />
                </div>
              )}

              {/* Subsections */}
              {section.subsections && section.subsections.map((subsection, subIndex) => (
                <div key={subIndex} className="mt-10">
                  <h3 className="text-2xl md:text-3xl font-normal text-purple-400 mb-4">
                    {subsection.heading}
                  </h3>
                  {subsection.content && (
                    <div className="prose prose-invert prose-lg max-w-none">
                      <PortableText value={subsection.content} />
                    </div>
                  )}
                </div>
              ))}
            </section>
          )
        })}

        {/* Capabilities List */}
        {data.capabilities && data.capabilities.length > 0 && (
          <div className="my-20 md:my-32">
            <ul className="space-y-0">
              {data.capabilities.map((capability, index) => (
                <li
                  key={index}
                  className="py-4 border-b border-purple-400/10 flex items-baseline transition-all duration-300 hover:border-purple-400 hover:pl-2"
                >
                  <span className="text-purple-400 font-bold mr-4">—</span>
                  <div>
                    <strong className="text-gray-50">{capability.title}</strong>
                    {capability.description && (
                      <span className="text-gray-400"> — {capability.description}</span>
                    )}
                    {capability.isNew && (
                      <em className="text-purple-400 ml-2">(new!)</em>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Selected Projects */}
        {data.selectedProjects && data.selectedProjects.length > 0 && (
          <section className="my-20 md:my-32">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-normal mb-10 text-gray-50 relative pb-4">
              Projects I'm Proud Of
              <span className="absolute bottom-0 left-0 w-16 h-px bg-gradient-to-r from-purple-400 to-transparent" />
            </h2>
            <div className="space-y-0">
              {data.selectedProjects.map((project, index) => (
                <div
                  key={index}
                  className="py-10 border-b border-purple-400/10 transition-all duration-300 hover:border-purple-400"
                >
                  <h3 className="text-2xl md:text-3xl font-medium text-gray-50 mb-2">
                    {project.title}
                  </h3>
                  {project.metric && (
                    <div className="text-purple-400 font-medium mb-4 text-base">
                      {project.metric}
                    </div>
                  )}
                  {project.description && (
                    <p className="text-gray-400 leading-relaxed">
                      {project.description}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

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
