'use client'

import React from 'react'
import { cn } from '@/lib/utils'

interface ScrollingSlidesLayoutProps {
  children: React.ReactNode
  className?: string
}

/**
 * Main container for scrolling slides showcase
 * Provides full-viewport scrolling with snap behavior
 */
export function ScrollingSlidesLayout({
  children,
  className
}: ScrollingSlidesLayoutProps) {
  return (
    <div
      className={cn(
        // Full viewport height with scroll
        "h-screen w-full",
        // Scroll snap behavior
        "overflow-y-scroll scroll-smooth",
        "snap-y snap-mandatory",
        // Hide scrollbar
        "scrollbar-hide",
        className
      )}
    >
      {children}
    </div>
  )
}
