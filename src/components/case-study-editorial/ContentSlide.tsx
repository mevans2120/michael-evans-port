'use client'

import React from 'react'
import { PortableText } from '@portabletext/react'
import { QuoteBox } from './QuoteBox'
import { ComparisonBoxes } from './ComparisonBoxes'
import { VisualCards } from './VisualCards'
import { DesignAnnotation } from './DesignAnnotation'

interface ContentSlideProps {
  sectionLabel?: string
  heading?: string
  content?: any[] // Portable Text blocks
  quoteBox?: {
    quote: string
    attribution?: string
  }
  comparisonBoxes?: Array<{
    label?: string
    title?: string
    text: string
    stat?: string
    icon?: string
    _key?: string
  }>
  visualCards?: Array<{
    image?: any
    placeholderText?: string
    caption?: string
    _key?: string
  }>
  annotation?: {
    title: string
    content: string
  }
}

/**
 * Content slide component for editorial case studies
 * Wraps all editorial components in a magazine-style layout
 */
export function ContentSlide({
  sectionLabel,
  heading,
  content,
  quoteBox,
  comparisonBoxes,
  visualCards,
  annotation,
}: ContentSlideProps) {
  return (
    <section className="max-w-4xl mx-auto px-6 py-16">
      {sectionLabel && (
        <div className="font-sans text-xs uppercase tracking-[2px] text-accent dark:text-accent font-semibold mb-4">
          {sectionLabel}
        </div>
      )}

      {heading && (
        <h2 className="font-sans text-[42px] md:text-[52px] font-bold text-foreground dark:text-foreground leading-[1.1] mb-8">
          {heading}
        </h2>
      )}

      {content && content.length > 0 && (
        <div className="font-serif text-[18px] text-foreground dark:text-foreground leading-relaxed mb-8 prose prose-lg max-w-none">
          <PortableText
            value={content}
            components={{
              marks: {
                strong: ({ children }) => (
                  <strong className="text-accent dark:text-accent font-semibold">
                    {children}
                  </strong>
                ),
              },
            }}
          />
        </div>
      )}

      {comparisonBoxes && comparisonBoxes.length > 0 && (
        <ComparisonBoxes boxes={comparisonBoxes} />
      )}

      {quoteBox && <QuoteBox quote={quoteBox.quote} attribution={quoteBox.attribution} />}

      {visualCards && visualCards.length > 0 && <VisualCards cards={visualCards} />}

      {annotation && <DesignAnnotation title={annotation.title} content={annotation.content} />}
    </section>
  )
}
