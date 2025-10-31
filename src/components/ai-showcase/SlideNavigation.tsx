'use client'

import React, { useEffect, useState } from 'react'
import { cn } from '@/lib/utils'

interface SlideNavigationProps {
  slideCount: number
  className?: string
}

/**
 * Side navigation dots showing current slide position
 * Automatically tracks scroll position and highlights active slide
 */
export function SlideNavigation({ slideCount, className }: SlideNavigationProps) {
  const [activeSlide, setActiveSlide] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY
      const windowHeight = window.innerHeight
      const currentSlide = Math.round(scrollPosition / windowHeight)
      setActiveSlide(Math.min(currentSlide, slideCount - 1))
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [slideCount])

  const scrollToSlide = (index: number) => {
    const windowHeight = window.innerHeight
    window.scrollTo({
      top: windowHeight * index,
      behavior: 'smooth'
    })
  }

  return (
    <nav
      className={cn(
        "fixed right-8 top-1/2 -translate-y-1/2 z-50",
        "flex flex-col gap-4",
        className
      )}
      aria-label="Slide navigation"
    >
      {Array.from({ length: slideCount }).map((_, index) => (
        <button
          key={index}
          onClick={() => scrollToSlide(index)}
          className={cn(
            "w-3 h-3 rounded-full transition-all duration-300",
            "hover:scale-150 cursor-pointer",
            "ring-1 ring-purple-500/20",
            activeSlide === index
              ? "bg-purple-400 scale-150 ring-purple-400/50 shadow-lg shadow-purple-500/50"
              : "bg-white/20 hover:bg-purple-300/60 hover:ring-purple-300/40"
          )}
          aria-label={`Go to slide ${index + 1}`}
          aria-current={activeSlide === index ? 'true' : 'false'}
        />
      ))}
    </nav>
  )
}
