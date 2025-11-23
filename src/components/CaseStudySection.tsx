'use client'

import React from 'react'
import { PortableText } from '@portabletext/react'
import type { PortableTextBlock } from 'sanity'
import { CaseStudyScreenshots } from './CaseStudyScreenshots'
import { urlFor } from '@/sanity/lib/client'
import Image from 'next/image'

// Type for PortableText component props
type PTProps = { children?: React.ReactNode }

interface Screenshot {
  image: {
    asset: {
      _ref: string
      url?: string
    }
  }
  caption?: string
  layout: 'grid' | 'large'
}

interface CaseStudySectionProps {
  sectionLabel?: string
  heading: string
  content: PortableTextBlock[]
  screenshots?: Screenshot[]
  index: number
}

// Custom Portable Text components
const portableTextComponents = {
  block: {
    normal: ({ children }: PTProps) => (
      <p className="text-xl text-foreground/80 leading-relaxed mb-6 font-sans font-light">{children}</p>
    ),
    h2: ({ children }: PTProps) => (
      <h2 className="text-2xl md:text-3xl font-serif font-normal text-accent mb-4 mt-8">
        {children}
      </h2>
    ),
    h3: ({ children }: PTProps) => (
      <h3 className="text-xl md:text-2xl font-serif font-normal text-foreground mb-3 mt-6">
        {children}
      </h3>
    ),
    blockquote: ({ children }: PTProps) => (
      <blockquote className="border-l-4 border-accent pl-6 py-2 my-6 italic text-muted-foreground">
        {children}
      </blockquote>
    ),
  },
  list: {
    bullet: ({ children }: PTProps) => (
      <ul className="space-y-3 my-6 ml-6">{children}</ul>
    ),
    number: ({ children }: PTProps) => (
      <ol className="space-y-3 my-6 ml-6 list-decimal">{children}</ol>
    ),
  },
  listItem: {
    bullet: ({ children }: PTProps) => (
      <li className="text-lg text-foreground/80 leading-relaxed relative pl-6 font-sans">
        <span className="absolute left-0 top-3 w-1.5 h-1.5 rounded-full bg-accent" />
        {children}
      </li>
    ),
    number: ({ children }: PTProps) => (
      <li className="text-lg text-foreground/80 leading-relaxed font-sans">{children}</li>
    ),
  },
  marks: {
    strong: ({ children }: PTProps) => (
      <strong className="font-semibold text-accent">{children}</strong>
    ),
    em: ({ children }: PTProps) => (
      <em className="italic text-foreground">{children}</em>
    ),
    code: ({ children }: PTProps) => (
      <code className="px-2 py-1 bg-background/50 rounded text-sm text-[hsl(var(--accent-light))] font-mono">
        {children}
      </code>
    ),
    link: ({ children, value }: PTProps) => (
      <a
        href={value.href}
        target="_blank"
        rel="noopener noreferrer"
        className="text-accent hover:text-accent-light underline transition-colors"
      >
        {children}
      </a>
    ),
  },
  types: {
    image: ({ value }: PTProps) => {
      if (!value?.asset) return null

      const imageUrl = value.asset.url || urlFor(value.asset).url()

      return (
        <figure className="my-8">
          <div className="relative aspect-[16/10] rounded-xl overflow-hidden border border-accent/10">
            <Image
              src={imageUrl}
              alt={value.caption || ''}
              fill
              className="object-cover"
            />
          </div>
          {value.caption && (
            <figcaption className="mt-3 text-center text-sm text-gray-500 italic">
              {value.caption}
            </figcaption>
          )}
        </figure>
      )
    },
  },
}

export function CaseStudySection({
  sectionLabel,
  heading,
  content,
  screenshots,
  index,
}: CaseStudySectionProps) {
  // Alternating background colors for visual rhythm
  const bgClass = index % 2 === 0 ? 'bg-transparent' : 'bg-accent/[0.03]'

  return (
    <section className={`mb-24 md:mb-40 py-20 md:py-32 ${bgClass} rounded-2xl px-0 md:px-8`}>
      {/* Section Label */}
      {sectionLabel && (
        <div className="text-xs font-bold uppercase tracking-[0.15em] text-accent mb-8 font-serif">
          {sectionLabel}
        </div>
      )}

      {/* Section Heading */}
      <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif font-light leading-tight mb-8 text-foreground relative pb-4">
        {heading}
        <span className="absolute bottom-0 left-0 w-16 h-px bg-gradient-to-r from-accent to-transparent" />
      </h2>

      {/* Portable Text Content */}
      {content && (
        <div className="prose prose-invert prose-lg max-w-none mb-8">
          <PortableText value={content} components={portableTextComponents} />
        </div>
      )}

      {/* Screenshots */}
      {screenshots && screenshots.length > 0 && (
        <CaseStudyScreenshots screenshots={screenshots} />
      )}
    </section>
  )
}
