'use client'

import React from 'react'
import { PortableText } from '@portabletext/react'
import type { AIShowcase } from '@/types/aiShowcase'
import {
  ScrollingSlidesLayout,
  HeroSlide,
  ContentSlide,
  HorizontalTimelineSlide,
  TimelinePhase,
  WorkflowStep,
  ProjectCard,
  MetricsSlide,
  QuoteBox,
  ComparisonGrid,
  VisualGrid,
  TechPills,
} from '@/components/ai-showcase'

interface AIShowcasePageClientProps {
  showcase: AIShowcase
}

export function AIShowcasePageClient({ showcase }: AIShowcasePageClientProps) {
  return (
    <ScrollingSlidesLayout>
        {/* Hero Slide */}
        <HeroSlide
          badge={showcase.heroSection.badge}
          title={showcase.heroSection.title}
          subtitle={showcase.heroSection.subtitle}
          summary={showcase.heroSection.summary}
        />

        {/* Content Slides */}
        {showcase.slides?.map((slide, index) => {
          // Use two columns if there's substantial text content and no other elements
          const hasSubstantialText = slide.content && slide.content.length > 2
          const hasOtherElements = slide.quoteBox || slide.comparisonBoxes || slide.visualCards || slide.techPills
          const useTwoColumns = hasSubstantialText && !hasOtherElements

          return (
            <ContentSlide
              key={index}
              sectionLabel={slide.sectionLabel}
              heading={slide.heading}
              variant={index % 3 === 0 ? 'default' : index % 3 === 1 ? 'dark' : 'darker'}
              columns={useTwoColumns ? 2 : 1}
            >
              {/* Portable Text Content */}
              {slide.content && slide.content.length > 0 && (
                <div className="prose prose-invert max-w-none prose-headings:text-purple-200 prose-p:text-gray-300 prose-h3:text-xl prose-h3:font-syne prose-h3:font-semibold prose-h3:mb-3">
                  <PortableText value={slide.content} />
                </div>
              )}

            {/* Quote Box */}
            {slide.quoteBox && (
              <QuoteBox
                quote={slide.quoteBox.quote}
                attribution={slide.quoteBox.attribution}
              />
            )}

            {/* Comparison Grid */}
            {slide.comparisonBoxes && slide.comparisonBoxes.length > 0 && (
              <ComparisonGrid
                boxes={slide.comparisonBoxes}
                columns={slide.comparisonBoxes.length === 2 ? 2 : 3}
              />
            )}

            {/* Visual Grid */}
            {slide.visualCards && slide.visualCards.length > 0 && (
              <VisualGrid
                cards={slide.visualCards}
                columns={slide.visualCards.length === 2 ? 2 : 3}
              />
            )}

            {/* Tech Pills */}
            {slide.techPills && slide.techPills.length > 0 && (
              <TechPills technologies={slide.techPills} />
            )}
            </ContentSlide>
          )
        })}

        {/* Horizontal Scrolling Slide */}
        {(showcase.timelinePhases || showcase.workflowSteps || showcase.projectCards) && (
          <HorizontalTimelineSlide
            sectionLabel={showcase.horizontalSectionLabel}
            heading={showcase.horizontalSectionHeading || 'Timeline'}
          >
            {/* Timeline Phases (AI Workflow) */}
            {showcase.timelinePhases?.map((phase) => (
              <TimelinePhase
                key={phase._id}
                phase={phase.phase}
                title={phase.title}
                description={phase.description}
              />
            ))}

            {/* Workflow Steps (PostPal) */}
            {showcase.workflowSteps?.map((step) => (
              <WorkflowStep
                key={step._id}
                stepNumber={step.stepNumber}
                title={step.title}
                description={step.description}
                icon={step.icon}
              />
            ))}

            {/* Project Cards (Marketing Sites) */}
            {showcase.projectCards?.map((card) => (
              <ProjectCard
                key={card._id}
                projectName={card.projectName}
                projectType={card.projectType}
                description={card.description}
                technologies={card.technologies}
                icon={card.icon}
              />
            ))}
          </HorizontalTimelineSlide>
        )}

        {/* Metrics Slide */}
        {showcase.metrics && showcase.metrics.length > 0 && (
          <MetricsSlide
            heading="Impact & Results"
            metrics={showcase.metrics}
          />
        )}
    </ScrollingSlidesLayout>
  )
}
