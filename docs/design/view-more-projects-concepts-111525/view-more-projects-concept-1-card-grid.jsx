'use client'

import React from 'react'
import { ChevronRight, ExternalLink } from 'lucide-react'

/**
 * Concept 1: Card Grid
 *
 * Safe & Refined Approach
 * - Rich project cards with images and descriptions
 * - 3-column responsive grid layout
 * - Familiar card pattern that users understand
 * - Visual hierarchy with images, titles, and CTAs
 *
 * Design Rationale:
 * - Cards provide visual scanning and quick overview
 * - Images help with recognition and visual interest
 * - Clear CTAs guide next actions
 * - Hover states provide interactive feedback
 */

export function ViewMoreProjectsCardGrid() {
  const projects = [
    {
      id: 1,
      title: "Department of Art",
      category: "Film & TV Set Construction",
      description: "Professional portfolio showcasing high-resolution set construction work with optimized image loading.",
      image: "/api/placeholder/400/300",
      metric: "+200% engagement",
      slug: "department-of-art",
      color: "from-purple-600 to-purple-400"
    },
    {
      id: 2,
      title: "Opal Creek Consulting",
      category: "NetSuite ERP",
      description: "Enterprise consulting site with comprehensive security and professional B2B design.",
      image: "/api/placeholder/400/300",
      metric: "3x lead generation",
      slug: "opal-creek",
      color: "from-indigo-600 to-purple-500"
    },
    {
      id: 3,
      title: "Karuna Gatton",
      category: "Shamanic Healing",
      description: "Warm authentic site for healing services with integrated booking system.",
      image: "/api/placeholder/400/300",
      metric: "50% booking increase",
      slug: "karuna-gatton",
      color: "from-purple-500 to-pink-400"
    }
  ]

  return (
    <section className="w-full bg-background dark:bg-background py-24 px-6 border-t border-border dark:border-border">
      {/* Atmospheric background effects */}
      <div className="fixed top-[60%] left-[5%] w-[300px] h-[300px] rounded-full bg-accent/10 dark:bg-accent/10 blur-[100px] pointer-events-none -z-10 opacity-50" />
      <div className="fixed bottom-[10%] right-[15%] w-[400px] h-[400px] rounded-full bg-accent/5 dark:bg-accent/5 blur-[100px] pointer-events-none -z-10 opacity-50" />

      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="mb-16 animate-fade-in">
          <h2 className="text-4xl md:text-5xl font-light text-foreground dark:text-foreground mb-4"
              style={{ fontFamily: 'Crimson Pro, serif' }}>
            Explore More Work
          </h2>
          <p className="text-lg text-muted-foreground dark:text-muted-foreground max-w-2xl">
            Each project represents a unique challenge solved through thoughtful design and technical excellence.
          </p>
        </div>

        {/* Project Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project, index) => (
            <article
              key={project.id}
              className="group card-base dark:bg-card/50 overflow-hidden transition-all duration-300 hover:shadow-xl hover:scale-[1.02] animate-stagger cursor-pointer"
              style={{ animationDelay: `${index * 100}ms` }}
              onClick={() => console.log(`Navigate to /case-studies/${project.slug}`)}
              role="link"
              tabIndex={0}
              aria-label={`View case study: ${project.title}`}
            >
              {/* Image Container */}
              <div className="relative h-48 overflow-hidden bg-gradient-to-br from-accent/20 to-accent/10">
                <div className={`absolute inset-0 bg-gradient-to-br ${project.color} opacity-80`} />
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-full h-full object-cover mix-blend-overlay opacity-50"
                />
                {/* Metric Badge */}
                <div className="absolute top-4 right-4 px-3 py-1 bg-background/90 dark:bg-background/90 backdrop-blur-sm rounded-full">
                  <span className="text-xs font-semibold text-accent dark:text-accent">
                    {project.metric}
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                {/* Category */}
                <div className="text-xs font-semibold text-accent dark:text-accent uppercase tracking-wider mb-2">
                  {project.category}
                </div>

                {/* Title */}
                <h3 className="text-xl font-semibold text-foreground dark:text-foreground mb-3 group-hover:text-accent dark:group-hover:text-accent transition-colors">
                  {project.title}
                </h3>

                {/* Description */}
                <p className="text-sm text-muted-foreground dark:text-muted-foreground mb-4 line-clamp-2">
                  {project.description}
                </p>

                {/* CTA */}
                <div className="flex items-center text-accent dark:text-accent font-medium text-sm group-hover:gap-3 transition-all">
                  <span>View Case Study</span>
                  <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* View All Link */}
        <div className="mt-16 text-center animate-fade-in" style={{ animationDelay: '400ms' }}>
          <button
            className="inline-flex items-center gap-2 px-8 py-4 bg-accent/10 dark:bg-accent/10 hover:bg-accent/20 dark:hover:bg-accent/20 text-accent dark:text-accent font-medium rounded-full transition-all duration-300 hover:scale-105 focus-outline"
            onClick={() => console.log('Navigate to /case-studies')}
          >
            <span>View All Case Studies</span>
            <ExternalLink className="w-4 h-4" />
          </button>
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
      <ViewMoreProjectsCardGrid />
    </div>
  )
}