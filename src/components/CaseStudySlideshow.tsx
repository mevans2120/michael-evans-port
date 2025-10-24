'use client'

import React, { useRef, useState, useEffect, ReactNode } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface CaseStudySlideshowProps {
  children: ReactNode[];
  showProgress?: boolean;
  fullHeight?: boolean;
}

export function CaseStudySlideshow({
  children,
  showProgress = true,
  fullHeight = true
}: CaseStudySlideshowProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isScrolling, setIsScrolling] = useState(false);
  const totalSlides = React.Children.count(children);

  // Handle scroll to update current slide
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    let scrollTimeout: NodeJS.Timeout;

    const handleScroll = () => {
      setIsScrolling(true);
      clearTimeout(scrollTimeout);

      scrollTimeout = setTimeout(() => {
        setIsScrolling(false);
        const slideWidth = container.clientWidth;
        const scrollPosition = container.scrollLeft;
        const newSlideIndex = Math.round(scrollPosition / slideWidth);
        setCurrentSlide(newSlideIndex);
      }, 150);
    };

    container.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      container.removeEventListener('scroll', handleScroll);
      clearTimeout(scrollTimeout);
    };
  }, []);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        navigateToSlide(Math.max(0, currentSlide - 1));
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        navigateToSlide(Math.min(totalSlides - 1, currentSlide + 1));
      } else if (e.key === 'Home') {
        e.preventDefault();
        navigateToSlide(0);
      } else if (e.key === 'End') {
        e.preventDefault();
        navigateToSlide(totalSlides - 1);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentSlide, totalSlides]);

  const navigateToSlide = (index: number) => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const slideWidth = container.clientWidth;
    container.scrollTo({
      left: slideWidth * index,
      behavior: 'smooth'
    });
  };

  const handlePrevious = () => {
    navigateToSlide(Math.max(0, currentSlide - 1));
  };

  const handleNext = () => {
    navigateToSlide(Math.min(totalSlides - 1, currentSlide + 1));
  };

  return (
    <div className="relative w-full">
      {/* Horizontal Scroll Container */}
      <div
        ref={scrollContainerRef}
        className={`flex overflow-x-auto overflow-y-hidden scroll-smooth ${
          fullHeight ? 'h-screen' : 'h-auto'
        }`}
        style={{
          scrollSnapType: 'x mandatory',
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
        }}
      >
        {React.Children.map(children, (child, index) => (
          <div
            key={index}
            className="flex-shrink-0 w-full"
            style={{ scrollSnapAlign: 'start' }}
          >
            {child}
          </div>
        ))}
      </div>

      {/* Hide scrollbar for webkit browsers */}
      <style jsx>{`
        div::-webkit-scrollbar {
          display: none;
        }
      `}</style>

      {/* Navigation Arrows */}
      {currentSlide > 0 && (
        <button
          onClick={handlePrevious}
          className="fixed left-4 top-1/2 -translate-y-1/2 z-50 w-12 h-12 rounded-full bg-background/80 backdrop-blur-md border-2 border-border hover:border-accent hover:bg-accent/10 text-foreground hover:text-accent transition-all duration-200 flex items-center justify-center group"
          aria-label="Previous slide"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
      )}

      {currentSlide < totalSlides - 1 && (
        <button
          onClick={handleNext}
          className="fixed right-4 top-1/2 -translate-y-1/2 z-50 w-12 h-12 rounded-full bg-background/80 backdrop-blur-md border-2 border-border hover:border-accent hover:bg-accent/10 text-foreground hover:text-accent transition-all duration-200 flex items-center justify-center group"
          aria-label="Next slide"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      )}

      {/* Progress Indicator */}
      {showProgress && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 bg-background/80 backdrop-blur-md border border-border rounded-full px-4 py-2">
          {Array.from({ length: totalSlides }).map((_, index) => (
            <button
              key={index}
              onClick={() => navigateToSlide(index)}
              className={`transition-all duration-300 rounded-full ${
                index === currentSlide
                  ? 'w-8 h-2 bg-gradient-to-r from-accent to-accent-light'
                  : 'w-2 h-2 bg-muted-foreground/30 hover:bg-muted-foreground/50'
              }`}
              aria-label={`Go to slide ${index + 1}`}
              aria-current={index === currentSlide ? 'true' : 'false'}
            />
          ))}
        </div>
      )}

      {/* Slide Counter */}
      <div className="fixed top-8 right-8 z-50 bg-background/80 backdrop-blur-md border border-border rounded-full px-4 py-2 text-sm text-muted-foreground font-medium">
        {currentSlide + 1} / {totalSlides}
      </div>
    </div>
  );
}
