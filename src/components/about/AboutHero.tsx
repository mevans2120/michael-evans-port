'use client'

import React from 'react'
import Image from 'next/image'
import imageUrlBuilder from '@sanity/image-url'
import { client } from '@/sanity/lib/client'

const builder = imageUrlBuilder(client)

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

interface AboutHeroProps {
  name: string
  profileImage?: SanityImage
  heroHeadline: string
  heroSubheadline?: string
  heroIntro?: string
  quickFacts?: QuickFact[]
}

/**
 * About page hero component
 * Editorial-style header with profile image, headline, and quick facts grid
 */
export function AboutHero({
  name,
  profileImage,
  heroHeadline,
  heroSubheadline,
  heroIntro,
  quickFacts
}: AboutHeroProps) {
  return (
    <header className="max-w-4xl mx-auto px-6 pt-16 md:pt-24 pb-4 md:pb-6">
      {/* Name and Profile Image Row */}
      <div className="flex flex-col md:flex-row items-start md:items-center gap-8 md:gap-12 mb-8">
        <div className="flex-1">
          <h1 className="font-sans text-[56px] md:text-[72px] lg:text-[84px] font-bold text-foreground dark:text-foreground leading-[1.05]">
            {name}
          </h1>
        </div>

        {/* Profile Image */}
        {profileImage && (
          <div className="flex-shrink-0">
            <div className="relative w-32 h-32 md:w-40 md:h-40 lg:w-48 lg:h-48">
              <Image
                src={builder.image(profileImage).width(384).height(384).fit('crop').url()}
                alt={name}
                fill
                className="rounded-full object-cover border-2 border-accent/20 dark:border-accent/20"
                priority
              />
            </div>
          </div>
        )}
      </div>

      {/* Headline */}
      {heroHeadline && (
        <p className="font-sans text-[24px] md:text-[28px] text-muted-foreground leading-[1.4] mb-8">
          {heroHeadline}
        </p>
      )}

      {/* Subheadline */}
      {heroSubheadline && (
        <p className="font-serif text-[18px] text-foreground dark:text-foreground leading-relaxed mb-12 max-w-3xl">
          {heroSubheadline}
        </p>
      )}

      {/* Intro */}
      {heroIntro && (
        <p className="font-serif text-[18px] text-foreground dark:text-foreground leading-relaxed mb-12 max-w-3xl">
          {heroIntro}
        </p>
      )}

      {/* Quick Facts Grid */}
      {quickFacts && quickFacts.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-12 mt-12 border-t border-border dark:border-border">
          {quickFacts.map((fact, index) => (
            <div key={index}>
              <div className="font-sans text-xs uppercase tracking-[2px] text-muted-foreground mb-2">
                {fact.label}
              </div>
              <div className="font-sans text-base text-foreground dark:text-foreground">
                {fact.value}
              </div>
            </div>
          ))}
        </div>
      )}
    </header>
  )
}
