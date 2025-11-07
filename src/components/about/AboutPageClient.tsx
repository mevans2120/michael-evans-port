'use client'

import React from 'react'
import { AboutHero } from './AboutHero'
import { AboutArticle } from './AboutArticle'
import { AboutFooter } from './AboutFooter'

interface SanityImage {
  asset: {
    _ref: string
    _type: string
  }
  hotspot?: {
    x: number
    y: number
    height: number
    width: number
  }
  crop?: {
    top: number
    bottom: number
    left: number
    right: number
  }
}

interface QuickFact {
  label: string
  value: string
}

interface AboutData {
  name: string
  profileImage: SanityImage
  heroHeadline: string
  heroSubheadline?: string
  heroIntro?: string
  quickFacts?: QuickFact[]
  article?: any[] // Portable Text blocks
  availability?: boolean
  availabilityText?: string
  ctaText?: string
  ctaButtonText?: string
}

interface AboutPageClientProps {
  data: AboutData
}

export default function AboutPageClient({ data }: AboutPageClientProps) {
  if (!data) {
    return null
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Atmospheric blur orbs */}
      <div className="fixed top-[10%] left-[10%] w-[400px] h-[400px] rounded-full bg-accent/15 dark:bg-accent/15 blur-[100px] pointer-events-none -z-10" />
      <div className="fixed bottom-[20%] right-[10%] w-[500px] h-[500px] rounded-full bg-accent/10 dark:bg-accent/10 blur-[100px] pointer-events-none -z-10" />

      {/* Hero */}
      <AboutHero
        name={data.name}
        profileImage={data.profileImage}
        heroHeadline={data.heroHeadline}
        heroSubheadline={data.heroSubheadline}
        heroIntro={data.heroIntro}
        quickFacts={data.quickFacts}
      />

      {/* Article Content */}
      {data.article && data.article.length > 0 && (
        <AboutArticle article={data.article} />
      )}

      {/* Footer with CTA */}
      <AboutFooter
        availability={data.availability}
        availabilityText={data.availabilityText}
        ctaText={data.ctaText}
        ctaButtonText={data.ctaButtonText}
      />
    </div>
  )
}
