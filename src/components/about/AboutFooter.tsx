'use client'

import React from 'react'
import Link from 'next/link'

interface AboutFooterProps {
  availability?: boolean
  availabilityText?: string
  ctaText?: string
  ctaButtonText?: string
}

/**
 * About page footer component
 * Displays availability status and call-to-action
 */
export function AboutFooter({
  availability = true,
  availabilityText,
  ctaText,
  ctaButtonText = "Let's Work Together"
}: AboutFooterProps) {
  // Don't render if no content
  if (!availabilityText && !ctaText) {
    return null
  }

  return (
    <footer className="max-w-4xl mx-auto px-6 pb-16 md:pb-24">
      <div className="pt-16 border-t border-border dark:border-border">
        {/* Availability Status */}
        {availability && availabilityText && (
          <div className="mb-12">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-3 h-3 rounded-full bg-green-500 dark:bg-green-400 animate-pulse" />
              <div className="font-sans text-sm uppercase tracking-[2px] text-muted-foreground">
                Available for Work
              </div>
            </div>
            <p className="font-serif text-lg text-foreground dark:text-foreground leading-relaxed max-w-2xl">
              {availabilityText}
            </p>
          </div>
        )}

        {/* Call to Action */}
        {ctaText && (
          <div>
            <p className="font-serif text-lg text-muted-foreground leading-relaxed mb-8 max-w-2xl">
              {ctaText}
            </p>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 px-8 py-4 bg-accent dark:bg-accent text-accent-foreground dark:text-accent-foreground font-sans font-semibold rounded-lg hover:bg-accent/90 dark:hover:bg-accent/90 transition-colors"
            >
              {ctaButtonText}
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 8l4 4m0 0l-4 4m4-4H3"
                />
              </svg>
            </Link>
          </div>
        )}
      </div>
    </footer>
  )
}
