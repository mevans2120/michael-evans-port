'use client'

import React from 'react'
import { cn } from '@/lib/utils'

interface MagazineLayoutProps {
  children: React.ReactNode
  className?: string
}

/**
 * Main container for magazine-style showcase pages
 * Provides centered column layout with comfortable reading width
 */
export function MagazineLayout({ children, className }: MagazineLayoutProps) {
  return (
    <article
      className={cn(
        "max-w-[920px] mx-auto",
        "px-8 md:px-10 py-16 md:py-20",
        "bg-background",
        className
      )}
    >
      {children}
    </article>
  )
}
