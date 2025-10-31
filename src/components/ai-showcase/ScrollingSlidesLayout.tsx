'use client'

import React from 'react'
import { cn } from '@/lib/utils'

interface ScrollingSlidesLayoutProps {
  children: React.ReactNode
  className?: string
}

/**
 * Main container for showcase page
 * Provides smooth scrolling long-form page layout
 */
export function ScrollingSlidesLayout({
  children,
  className
}: ScrollingSlidesLayoutProps) {
  return (
    <div
      className={cn(
        // Regular page scroll
        "min-h-screen w-full",
        "scroll-smooth",
        className
      )}
    >
      {children}
    </div>
  )
}
