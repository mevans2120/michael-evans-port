'use client'

import React from 'react'

interface MagazineHeroProps {
  badge?: string
  title: string
  subtitle?: string
}

/**
 * Hero section for magazine-style pages
 * Features category badge, large title, and italic subtitle
 */
export function MagazineHero({ badge, title, subtitle }: MagazineHeroProps) {
  return (
    <header className="mb-12">
      {badge && (
        <span className="font-sans text-[11px] uppercase tracking-[2px] text-accent dark:text-accent font-semibold mb-8 inline-block pb-2 border-b-2 border-accent dark:border-accent">
          {badge}
        </span>
      )}
      <h1 className="font-sans text-[clamp(42px,6vw,68px)] font-bold leading-[1.1] text-foreground mb-6 tracking-tight">
        {title}
      </h1>
      {subtitle && (
        <p className="font-serif text-[22px] leading-[1.5] text-muted-foreground font-light italic max-w-[680px]">
          {subtitle}
        </p>
      )}
    </header>
  )
}
