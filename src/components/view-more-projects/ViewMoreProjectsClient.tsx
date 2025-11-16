'use client'

import React from 'react'
import { LinkPreview } from '@/components/chatbot/LinkPreview'
import { OrnamentalCTA } from '@/components/ui/OrnamentalCTA'
import { cn } from '@/lib/utils'

interface ViewMoreProjectsClientProps {
  projects: Array<{
    slug: string
    title: string
  }>
  settings: {
    heading: string
    subheading: string
    layoutStyle: 'grid' | 'list' | 'carousel'
    ctaButton?: {
      enabled: boolean
      text?: string
      link?: string
      style?: 'primary' | 'secondary' | 'outline' | 'ghost'
    }
    animation?: {
      enableAnimation: boolean
      staggerDelay?: number
    }
  }
}

/**
 * Client component that displays the View More Projects section
 * Uses the LinkPreview component for consistent card treatment
 */
export function ViewMoreProjectsClient({ projects, settings }: ViewMoreProjectsClientProps) {
  // Get layout classes based on style
  const getLayoutClasses = () => {
    switch (settings.layoutStyle) {
      case 'list':
        return 'flex flex-col gap-4'
      case 'carousel':
        // For now, carousel will fall back to grid
        // TODO: Implement carousel functionality if needed
        return 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'
      case 'grid':
      default:
        // Responsive grid: 1 column on mobile, 2 on tablet, 3 on desktop if 3+ projects
        if (projects.length >= 3) {
          return 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'
        }
        return 'grid grid-cols-1 md:grid-cols-2 gap-4'
    }
  }

  return (
    <section className="relative w-full py-20 px-6 overflow-hidden">
      {/* Atmospheric background effects */}
      <div className="absolute top-[20%] left-[5%] w-[300px] h-[300px] rounded-full bg-accent/10 blur-[100px] pointer-events-none -z-10 opacity-50" />
      <div className="absolute bottom-[10%] right-[15%] w-[400px] h-[400px] rounded-full bg-accent/5 blur-[100px] pointer-events-none -z-10 opacity-50" />

      <div className="max-w-4xl mx-auto">
        {/* Section Header - matching homepage style */}
        <div className={cn(
          "mb-12",
          settings.animation?.enableAnimation && "animate-fade-in"
        )}>
          <h2 className="text-2xl font-light mb-2 flex items-center gap-3 text-foreground">
            {settings.heading}
            {/* Decorative gradient line ornament - same as homepage */}
            <svg
              className="w-12 h-2 opacity-40"
              viewBox="0 0 48 8"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <rect
                width="48"
                height="1"
                y="3.5"
                fill="url(#gradient-line)"
              />
              <defs>
                <linearGradient
                  id="gradient-line"
                  x1="0"
                  y1="0"
                  x2="48"
                  y2="0"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop stopColor="hsl(var(--accent))" />
                  <stop offset="1" stopColor="hsl(var(--accent))" stopOpacity="0" />
                </linearGradient>
              </defs>
            </svg>
          </h2>
          {settings.subheading && (
            <p className="text-muted-foreground max-w-3xl">
              {settings.subheading}
            </p>
          )}
        </div>

        {/* Project Cards using LinkPreview */}
        <div className={getLayoutClasses()}>
          {projects.map((project, index) => (
            <div
              key={project.slug}
              className={cn(
                settings.animation?.enableAnimation && "animate-stagger"
              )}
              style={{
                animationDelay: settings.animation?.enableAnimation
                  ? `${(settings.animation?.staggerDelay || 100) * index}ms`
                  : undefined
              }}
            >
              <LinkPreview href={`/case-studies/${project.slug}`}>
                {project.title}
              </LinkPreview>
            </div>
          ))}
        </div>

        {/* Optional CTA - using OrnamentalCTA to match homepage */}
        {settings.ctaButton?.enabled && settings.ctaButton.text && settings.ctaButton.link && (
          <div className={cn(
            "mt-16",
            settings.animation?.enableAnimation && "animate-fade-in"
          )}>
            <OrnamentalCTA
              text={settings.ctaButton.text}
              href={settings.ctaButton.link}
            />
          </div>
        )}
      </div>
    </section>
  )
}