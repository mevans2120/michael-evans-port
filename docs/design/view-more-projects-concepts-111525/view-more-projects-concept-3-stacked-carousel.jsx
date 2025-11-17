'use client'

import React, { useState, useRef, useEffect } from 'react'
import { ChevronLeft, ChevronRight, ArrowRight, Sparkles } from 'lucide-react'

/**
 * Concept 3: Stacked Carousel
 *
 * Experimental & Dynamic Approach
 * - Interactive horizontal scroll with overlapping cards
 * - Playful depth and perspective effects
 * - Smooth animations and mobile-friendly swipe gestures
 * - Space-efficient while showing multiple options
 *
 * Design Rationale:
 * - Creates a discovery mindset through exploration
 * - Depth effects add visual interest without clutter
 * - Mobile-first with touch gestures
 * - Compact footprint while showing context
 */

export function ViewMoreProjectsStackedCarousel() {
  const [activeIndex, setActiveIndex] = useState(0)
  const [isDragging, setIsDragging] = useState(false)
  const [startX, setStartX] = useState(0)
  const [scrollX, setScrollX] = useState(0)
  const containerRef = useRef(null)

  const projects = [
    {
      id: 1,
      title: "Department of Art",
      category: "Film & TV",
      description: "Professional portfolio for set construction with optimized image galleries",
      metric: "+200% engagement",
      slug: "department-of-art",
      gradient: "from-purple-600 to-purple-400",
      icon: "🎬"
    },
    {
      id: 2,
      title: "Opal Creek",
      category: "Enterprise",
      description: "B2B consulting site with comprehensive security and case studies",
      metric: "3x leads",
      slug: "opal-creek",
      gradient: "from-indigo-600 to-purple-500",
      icon: "💼"
    },
    {
      id: 3,
      title: "Karuna Gatton",
      category: "Wellness",
      description: "Healing services site with integrated booking and payment systems",
      metric: "50% bookings",
      slug: "karuna-gatton",
      gradient: "from-purple-500 to-pink-400",
      icon: "✨"
    },
    {
      id: 4,
      title: "PostPal AI",
      category: "Healthcare",
      description: "AI-powered patient recovery platform with timeline generation",
      metric: "89% adherence",
      slug: "postpal",
      gradient: "from-blue-600 to-purple-500",
      icon: "🏥"
    }
  ]

  const handleNext = () => {
    setActiveIndex((prev) => (prev + 1) % projects.length)
  }

  const handlePrev = () => {
    setActiveIndex((prev) => (prev - 1 + projects.length) % projects.length)
  }

  // Touch/Mouse drag handlers
  const handleStart = (clientX) => {
    setIsDragging(true)
    setStartX(clientX)
  }

  const handleMove = (clientX) => {
    if (!isDragging) return
    const diff = clientX - startX
    setScrollX(diff)
  }

  const handleEnd = () => {
    if (!isDragging) return
    setIsDragging(false)

    if (Math.abs(scrollX) > 50) {
      if (scrollX > 0) {
        handlePrev()
      } else {
        handleNext()
      }
    }
    setScrollX(0)
  }

  // Calculate card positions and styles
  const getCardStyle = (index) => {
    const distance = (index - activeIndex + projects.length) % projects.length
    const normalizedDistance = distance > projects.length / 2 ? distance - projects.length : distance

    // Base positioning
    const translateX = normalizedDistance * 120 + scrollX * 0.3
    const translateZ = Math.abs(normalizedDistance) * -100
    const rotateY = normalizedDistance * -5
    const scale = 1 - Math.abs(normalizedDistance) * 0.15
    const opacity = 1 - Math.abs(normalizedDistance) * 0.3

    return {
      transform: `translateX(${translateX}px) translateZ(${translateZ}px) rotateY(${rotateY}deg) scale(${scale})`,
      opacity,
      zIndex: projects.length - Math.abs(normalizedDistance),
      transition: isDragging ? 'none' : 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)'
    }
  }

  return (
    <section className="w-full bg-background dark:bg-background py-24 px-6 overflow-hidden">
      {/* Animated Background Elements */}
      <div className="fixed top-[50%] left-[20%] w-[600px] h-[600px] rounded-full
                      bg-gradient-to-r from-accent/10 to-accent/5 dark:from-accent/10 dark:to-accent/5
                      blur-[120px] pointer-events-none -z-10 animate-slow-pulse" />

      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 mb-4">
            <Sparkles className="w-5 h-5 text-accent dark:text-accent animate-pulse" />
            <span className="text-sm font-medium text-accent dark:text-accent uppercase tracking-wider">
              Discover More
            </span>
            <Sparkles className="w-5 h-5 text-accent dark:text-accent animate-pulse" />
          </div>
          <h2 className="text-4xl md:text-5xl font-light text-foreground dark:text-foreground mb-4"
              style={{ fontFamily: 'Crimson Pro, serif' }}>
            Continue Your Journey
          </h2>
          <p className="text-lg text-muted-foreground dark:text-muted-foreground max-w-2xl mx-auto">
            Swipe through more transformative projects
          </p>
        </div>

        {/* Carousel Container */}
        <div
          ref={containerRef}
          className="relative h-[400px] md:h-[450px] flex items-center justify-center"
          style={{ perspective: '1200px' }}
          onMouseDown={(e) => handleStart(e.clientX)}
          onMouseMove={(e) => handleMove(e.clientX)}
          onMouseUp={handleEnd}
          onMouseLeave={handleEnd}
          onTouchStart={(e) => handleStart(e.touches[0].clientX)}
          onTouchMove={(e) => handleMove(e.touches[0].clientX)}
          onTouchEnd={handleEnd}
        >
          {/* Cards */}
          <div className="relative w-full max-w-md mx-auto" style={{ transformStyle: 'preserve-3d' }}>
            {projects.map((project, index) => (
              <div
                key={project.id}
                className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
                          w-[320px] md:w-[380px] cursor-grab active:cursor-grabbing
                          ${index === activeIndex ? 'pointer-events-auto' : 'pointer-events-none'}`}
                style={getCardStyle(index)}
              >
                <article
                  className={`card-elevated dark:bg-card/80 backdrop-blur-sm p-8 h-[320px]
                            border border-accent/20 dark:border-accent/20
                            ${index === activeIndex ? 'hover:border-accent/40 dark:hover:border-accent/40' : ''}`}
                  onClick={() => index === activeIndex && console.log(`Navigate to /case-studies/${project.slug}`)}
                >
                  {/* Card Content */}
                  <div className="flex flex-col h-full">
                    {/* Header */}
                    <div className="flex items-start justify-between mb-6">
                      <div>
                        <span className="text-4xl mb-3 block">{project.icon}</span>
                        <div className="text-xs font-semibold text-accent dark:text-accent uppercase tracking-wider">
                          {project.category}
                        </div>
                      </div>
                      <div className="px-3 py-1 bg-accent/10 dark:bg-accent/10 rounded-full">
                        <span className="text-xs font-semibold text-accent dark:text-accent">
                          {project.metric}
                        </span>
                      </div>
                    </div>

                    {/* Title */}
                    <h3 className="text-2xl font-semibold text-foreground dark:text-foreground mb-3">
                      {project.title}
                    </h3>

                    {/* Description */}
                    <p className="text-sm text-muted-foreground dark:text-muted-foreground mb-auto line-clamp-3">
                      {project.description}
                    </p>

                    {/* CTA - Only visible on active card */}
                    {index === activeIndex && (
                      <div className="flex items-center justify-between mt-6">
                        <span className="text-sm font-medium text-accent dark:text-accent">
                          View Case Study
                        </span>
                        <ArrowRight className="w-4 h-4 text-accent dark:text-accent" />
                      </div>
                    )}
                  </div>

                  {/* Gradient Overlay */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${project.gradient} opacity-5 rounded-lg pointer-events-none`} />
                </article>
              </div>
            ))}
          </div>

          {/* Navigation Buttons */}
          <button
            onClick={handlePrev}
            className="absolute left-4 md:left-8 z-20 p-3 rounded-full
                     bg-background/80 dark:bg-background/80 backdrop-blur-sm
                     border border-border dark:border-border
                     hover:bg-accent/10 dark:hover:bg-accent/10
                     hover:border-accent/30 dark:hover:border-accent/30
                     transition-all duration-300 group"
            aria-label="Previous project"
          >
            <ChevronLeft className="w-5 h-5 text-foreground dark:text-foreground group-hover:text-accent dark:group-hover:text-accent" />
          </button>

          <button
            onClick={handleNext}
            className="absolute right-4 md:right-8 z-20 p-3 rounded-full
                     bg-background/80 dark:bg-background/80 backdrop-blur-sm
                     border border-border dark:border-border
                     hover:bg-accent/10 dark:hover:bg-accent/10
                     hover:border-accent/30 dark:hover:border-accent/30
                     transition-all duration-300 group"
            aria-label="Next project"
          >
            <ChevronRight className="w-5 h-5 text-foreground dark:text-foreground group-hover:text-accent dark:group-hover:text-accent" />
          </button>
        </div>

        {/* Indicators */}
        <div className="flex items-center justify-center gap-2 mt-8">
          {projects.map((_, index) => (
            <button
              key={index}
              onClick={() => setActiveIndex(index)}
              className={`h-2 rounded-full transition-all duration-300
                        ${index === activeIndex
                          ? 'w-8 bg-accent dark:bg-accent'
                          : 'w-2 bg-accent/30 dark:bg-accent/30 hover:bg-accent/50 dark:hover:bg-accent/50'}`}
              aria-label={`Go to project ${index + 1}`}
            />
          ))}
        </div>

        {/* Mobile Swipe Hint */}
        <div className="text-center mt-8 md:hidden">
          <p className="text-sm text-muted-foreground dark:text-muted-foreground">
            Swipe to explore →
          </p>
        </div>

        {/* View All Link */}
        <div className="text-center mt-16">
          <button
            className="inline-flex items-center gap-3 px-6 py-3
                     text-accent dark:text-accent font-medium
                     border border-accent/30 dark:border-accent/30 rounded-full
                     hover:bg-accent/10 dark:hover:bg-accent/10
                     hover:border-accent/50 dark:hover:border-accent/50
                     transition-all duration-300"
            onClick={() => console.log('Navigate to /case-studies')}
          >
            <span>View All Case Studies</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </section>
  )
}

// Render the component
export default function ConceptDemo() {
  return (
    <div className="min-h-screen bg-background">
      {/* Mock case study content above */}
      <div className="max-w-4xl mx-auto px-6 py-20">
        <div className="prose prose-lg dark:prose-invert">
          <h1>Case Study Content</h1>
          <p className="text-muted-foreground">
            [End of case study content would be here...]
          </p>
        </div>
      </div>

      {/* The View More Projects component */}
      <ViewMoreProjectsStackedCarousel />
    </div>
  )
}