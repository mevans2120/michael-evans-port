'use client'

import React from 'react'
import { PortableText } from '@portabletext/react'
import type { AIShowcase } from '@/types/aiShowcase'
import {
  MagazineLayout,
  MagazineHero,
  MagazineLede,
  MagazineBody,
  MagazinePullQuote,
  MagazineMetrics,
  MagazineTechStack,
  MagazineSeparator,
  MagazineSectionHeader,
  MagazineComparisonGrid,
} from '@/components/ai-showcase-magazine'

interface AIShowcasePageMagazineProps {
  showcase: AIShowcase
}

/**
 * Magazine-style layout for AI Showcase pages
 * Features flowing article format with editorial typography
 */
export function AIShowcasePageMagazine({ showcase }: AIShowcasePageMagazineProps) {
  return (
    <MagazineLayout>
      {/* Hero */}
      <MagazineHero
        badge={showcase.heroSection.badge}
        title={showcase.heroSection.title}
        subtitle={showcase.heroSection.subtitle}
      />

      {/* Lede */}
      {showcase.heroSection.summary && (
        <MagazineLede>{showcase.heroSection.summary}</MagazineLede>
      )}

      <MagazineSeparator />

      {/* Content Slides → Flowing Article */}
      {showcase.slides?.map((slide, index) => (
        <React.Fragment key={index}>
          {/* Section Header */}
          {slide.sectionLabel && (
            <MagazineSectionHeader>{slide.sectionLabel}</MagazineSectionHeader>
          )}

          {/* Portable Text Content */}
          {slide.content && slide.content.length > 0 && (
            <MagazineBody>
              <PortableText value={slide.content} />
            </MagazineBody>
          )}

          {/* Quote Box */}
          {slide.quoteBox && (
            <MagazinePullQuote
              quote={slide.quoteBox.quote}
              attribution={slide.quoteBox.attribution}
            />
          )}

          {/* Comparison Grid */}
          {slide.comparisonBoxes && slide.comparisonBoxes.length > 0 && (
            <MagazineComparisonGrid boxes={slide.comparisonBoxes} />
          )}

          {/* Tech Pills */}
          {slide.techPills && slide.techPills.length > 0 && (
            <MagazineTechStack technologies={slide.techPills} />
          )}

          {/* Add subtle separator between major sections */}
          {slide.sectionLabel && index < (showcase.slides?.length ?? 0) - 1 && (
            <MagazineSeparator />
          )}
        </React.Fragment>
      ))}

      {/* Metrics */}
      {showcase.metrics && showcase.metrics.length > 0 && (
        <>
          <MagazineSectionHeader>The Results</MagazineSectionHeader>
          <MagazineMetrics metrics={showcase.metrics} />
        </>
      )}

      {/* Final separator before CTA */}
      <MagazineSeparator />

      {/* CTA or closing text can go here */}
    </MagazineLayout>
  )
}
