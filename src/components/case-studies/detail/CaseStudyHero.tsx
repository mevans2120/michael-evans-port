'use client'

import { cn } from '@/lib/utils'

interface CaseStudyHeroProps {
  category?: string
  title: string
  subtitle?: string
  technologies?: string[]
  className?: string
}

/**
 * Hero section for case study detail pages
 * Preserves exact design from inline styles:
 * - Category badge: rgba(199, 128, 245, 0.1) background, rgba(199, 128, 245, 0.3) border, hsl(280, 100%, 80%) text
 * - Title gradient: linear-gradient(135deg, hsl(280, 100%, 80%), hsl(0, 0%, 98%))
 * - Subtitle: #a0a0a0
 * - Tech tags: rgba(255, 255, 255, 0.05) background, rgba(255, 255, 255, 0.1) border
 */
export function CaseStudyHero({
  category,
  title,
  subtitle,
  technologies,
  className
}: CaseStudyHeroProps) {
  return (
    <section className={cn("hero relative min-h-screen flex items-center justify-center text-center px-8 py-32", className)}>
      <div className="relative z-10 max-w-5xl mx-auto">
        {/* Category Badge */}
        {category && (
          <div
            className="inline-block px-6 py-2 mb-8 rounded-full text-xs font-semibold uppercase"
            style={{
              background: 'rgba(199, 128, 245, 0.1)',
              border: '1px solid rgba(199, 128, 245, 0.3)',
              color: 'hsl(280, 100%, 80%)',
              letterSpacing: '0.1em'
            }}
          >
            {category}
          </div>
        )}

        {/* Hero Title with Gradient */}
        <h1
          className="font-semibold mb-8"
          style={{
            fontSize: 'clamp(3rem, 8vw, 5rem)',
            lineHeight: '1.1',
            background: 'linear-gradient(135deg, hsl(280, 100%, 80%), hsl(0, 0%, 98%))',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text'
          }}
        >
          {title}
        </h1>

        {/* Hero Subtitle */}
        {subtitle && (
          <p
            className="font-light leading-relaxed max-w-3xl mx-auto mb-8"
            style={{
              fontSize: 'clamp(1.25rem, 3vw, 1.75rem)',
              color: '#a0a0a0'
            }}
          >
            {subtitle}
          </p>
        )}

        {/* Tech Tags */}
        {technologies && technologies.length > 0 && (
          <div className="flex flex-wrap gap-4 justify-center mt-12">
            {technologies.map((tech) => (
              <span
                key={tech}
                className="px-6 py-3 rounded-xl text-sm"
                style={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(255, 255, 255, 0.1)'
                }}
              >
                {tech}
              </span>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
