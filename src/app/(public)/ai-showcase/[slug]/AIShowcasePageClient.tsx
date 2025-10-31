'use client'

import React from 'react'
import { PortableText } from '@portabletext/react'
import type { AIShowcase } from '@/types/aiShowcase'
import {
  ScrollingSlidesLayout,
  SlideNavigation,
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
  // Calculate total number of slides for navigation
  const totalSlides = 1 + // hero
    (showcase.slides?.length || 0) + // content slides
    (showcase.timelinePhases || showcase.workflowSteps || showcase.projectCards ? 1 : 0) + // horizontal slide
    (showcase.metrics ? 1 : 0) // metrics slide

  return (
    <>
      <ScrollingSlidesLayout>
        {/* Hero Slide */}
        <HeroSlide
          badge={showcase.heroSection.badge}
          title={showcase.heroSection.title}
          subtitle={showcase.heroSection.subtitle}
          summary={showcase.heroSection.summary}
        />

        {/* Content Slides */}
        {showcase.slides?.map((slide, index) => (
          <ContentSlide
            key={index}
            sectionLabel={slide.sectionLabel}
            heading={slide.heading}
            variant={index % 3 === 0 ? 'default' : index % 3 === 1 ? 'dark' : 'darker'}
          >
            {/* Portable Text Content */}
            {slide.content && slide.content.length > 0 && (
              <div className="prose prose-invert max-w-none">
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
        ))}

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

      {/* Slide Navigation */}
      <SlideNavigation slideCount={totalSlides} />
    </>
  )
}
