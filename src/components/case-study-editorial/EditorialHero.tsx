'use client'

import React from 'react'

interface EditorialHeroProps {
  badge?: string
  title: string
  subtitle?: string
  summary?: string
  overview?: {
    role?: string
    company?: string
    timeline?: string
  }
}

/**
 * Editorial hero component for case studies
 * Magazine-style header with badge, title, subtitle, and overview
 */
export function EditorialHero({ badge, title, subtitle, summary, overview }: EditorialHeroProps) {
  return (
    <header className="max-w-4xl mx-auto px-6 py-16 md:py-24">
      {badge && (
        <div className="font-sans text-xs uppercase tracking-[2px] text-accent dark:text-accent font-semibold mb-6">
          {badge}
        </div>
      )}

      <h1 className="font-sans text-[56px] md:text-[72px] lg:text-[84px] font-bold text-foreground dark:text-foreground leading-[1.05] mb-8">
        {title}
      </h1>

      {subtitle && (
        <p className="font-sans text-[24px] md:text-[28px] text-muted-foreground leading-[1.4] mb-8">
          {subtitle}
        </p>
      )}

      {summary && (
        <p className="font-serif text-[18px] text-foreground dark:text-foreground leading-relaxed mb-12 max-w-3xl">
          {summary}
        </p>
      )}

      {overview && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-8 border-t border-border dark:border-border">
          {overview.role && (
            <div>
              <div className="font-sans text-xs uppercase tracking-[2px] text-muted-foreground mb-2">
                Role
              </div>
              <div className="font-sans text-base text-foreground dark:text-foreground">
                {overview.role}
              </div>
            </div>
          )}
          {overview.company && (
            <div>
              <div className="font-sans text-xs uppercase tracking-[2px] text-muted-foreground mb-2">
                Company
              </div>
              <div className="font-sans text-base text-foreground dark:text-foreground">
                {overview.company}
              </div>
            </div>
          )}
          {overview.timeline && (
            <div>
              <div className="font-sans text-xs uppercase tracking-[2px] text-muted-foreground mb-2">
                Timeline
              </div>
              <div className="font-sans text-base text-foreground dark:text-foreground">
                {overview.timeline}
              </div>
            </div>
          )}
        </div>
      )}
    </header>
  )
}
