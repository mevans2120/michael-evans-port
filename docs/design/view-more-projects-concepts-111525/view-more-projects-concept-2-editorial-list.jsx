'use client'

import React, { useState } from 'react'
import { ArrowUpRight, Circle } from 'lucide-react'

/**
 * Concept 2: Editorial List
 *
 * Bold & Distinctive Approach
 * - Minimal text-focused list matching magazine aesthetic
 * - Large typography with generous whitespace
 * - Subtle hover interactions that don't break reading flow
 * - Numbers and typography create visual rhythm
 *
 * Design Rationale:
 * - Maintains editorial feel from case study content
 * - Typography-first approach reduces cognitive switch
 * - Generous spacing creates breathing room
 * - Progressive disclosure on hover adds detail without clutter
 */

export function ViewMoreProjectsEditorialList() {
  const [hoveredIndex, setHoveredIndex] = useState(null)

  const projects = [
    {
      id: 1,
      number: "01",
      title: "Department of Art",
      category: "Film & TV Set Construction",
      location: "Portland",
      description: "Professional portfolio showcasing high-resolution set construction work",
      year: "2024",
      slug: "department-of-art"
    },
    {
      id: 2,
      number: "02",
      title: "Opal Creek Consulting",
      category: "NetSuite ERP",
      location: "Portland",
      description: "Enterprise consulting site with comprehensive security features",
      year: "2024",
      slug: "opal-creek"
    },
    {
      id: 3,
      number: "03",
      title: "Karuna Gatton",
      category: "Shamanic Healing",
      location: "Eugene",
      description: "Warm authentic site for healing services with booking integration",
      year: "2023",
      slug: "karuna-gatton"
    }
  ]

  return (
    <section className="w-full bg-background dark:bg-background py-32 px-6">
      <div className="max-w-5xl mx-auto">
        {/* Section Header - Editorial Style */}
        <div className="mb-20 border-t border-border dark:border-border pt-16">
          <div className="flex flex-col md:flex-row md:items-baseline md:justify-between mb-8">
            <h2 className="text-5xl md:text-6xl font-light text-foreground dark:text-foreground"
                style={{ fontFamily: 'Crimson Pro, serif' }}>
              Continue Exploring
            </h2>
            <div className="text-sm text-muted-foreground dark:text-muted-foreground uppercase tracking-[2px] mt-4 md:mt-0">
              Selected Works
            </div>
          </div>
        </div>

        {/* Project List - Editorial Layout */}
        <div className="space-y-0">
          {projects.map((project, index) => (
            <article
              key={project.id}
              className="group border-b border-border dark:border-border last:border-b-0 transition-all duration-500"
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              <button
                className="w-full text-left py-10 md:py-14 focus-visible:outline-none focus-visible:bg-accent/5 dark:focus-visible:bg-accent/5"
                onClick={() => console.log(`Navigate to /case-studies/${project.slug}`)}
                aria-label={`View ${project.title} case study`}
              >
                <div className="relative">
                  {/* Main Content Row */}
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                    {/* Number & Title */}
                    <div className="flex items-baseline gap-6 md:gap-10">
                      <span className="text-2xl md:text-3xl font-light text-accent/60 dark:text-accent/60
                                     group-hover:text-accent dark:group-hover:text-accent transition-colors duration-500"
                            style={{ fontFamily: 'JetBrains Mono, monospace' }}>
                        {project.number}
                      </span>
                      <h3 className="text-3xl md:text-4xl lg:text-5xl font-light text-foreground dark:text-foreground
                                   group-hover:text-accent dark:group-hover:text-accent transition-colors duration-500"
                          style={{ fontFamily: 'Inter, sans-serif' }}>
                        {project.title}
                      </h3>
                    </div>

                    {/* Arrow Icon */}
                    <div className="hidden md:flex items-center">
                      <ArrowUpRight className="w-6 h-6 text-accent/40 dark:text-accent/40
                                             group-hover:text-accent dark:group-hover:text-accent
                                             transition-all duration-500
                                             group-hover:translate-x-1 group-hover:-translate-y-1" />
                    </div>
                  </div>

                  {/* Metadata Row */}
                  <div className="flex flex-wrap items-center gap-4 mt-4 ml-0 md:ml-[96px]">
                    <span className="text-sm font-medium text-accent dark:text-accent uppercase tracking-wider">
                      {project.category}
                    </span>
                    <Circle className="w-1 h-1 fill-muted-foreground text-muted-foreground" />
                    <span className="text-sm text-muted-foreground dark:text-muted-foreground">
                      {project.location}
                    </span>
                    <Circle className="w-1 h-1 fill-muted-foreground text-muted-foreground" />
                    <span className="text-sm text-muted-foreground dark:text-muted-foreground">
                      {project.year}
                    </span>
                  </div>

                  {/* Description - Progressive Disclosure */}
                  <div className={`overflow-hidden transition-all duration-500 ml-0 md:ml-[96px]
                                 ${hoveredIndex === index ? 'max-h-20 opacity-100' : 'max-h-0 opacity-0'}`}>
                    <p className="text-lg text-muted-foreground dark:text-muted-foreground mt-4 max-w-2xl leading-relaxed"
                       style={{ fontFamily: 'Crimson Pro, serif' }}>
                      {project.description}
                    </p>
                  </div>
                </div>
              </button>
            </article>
          ))}
        </div>

        {/* Footer Action - Editorial Style */}
        <div className="mt-24 pt-12 border-t border-border dark:border-border">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <p className="text-lg text-muted-foreground dark:text-muted-foreground mb-6 md:mb-0"
               style={{ fontFamily: 'Crimson Pro, serif' }}>
              Interested in seeing more work?
            </p>
            <button
              className="inline-flex items-center gap-3 text-accent dark:text-accent hover:gap-4 transition-all duration-300"
              onClick={() => console.log('Navigate to /case-studies')}
            >
              <span className="text-lg font-medium">Browse All Projects</span>
              <ArrowUpRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}

// Render the component
export default function ConceptDemo() {
  return (
    <div className="min-h-screen bg-background">
      {/* Mock case study content above */}
      <div className="max-w-4xl mx-auto px-6 py-20">
        <div className="prose prose-lg dark:prose-invert">
          <h1>Case Study Content</h1>
          <p className="text-muted-foreground">
            [End of case study content would be here...]
          </p>
        </div>
      </div>

      {/* The View More Projects component */}
      <ViewMoreProjectsEditorialList />
    </div>
  )
}