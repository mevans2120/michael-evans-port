'use client'

import React from 'react'

interface MagazineBodyProps {
  children: React.ReactNode
}

/**
 * Wrapper for body text content
 * Applies serif font and comfortable line spacing
 */
export function MagazineBody({ children }: MagazineBodyProps) {
  return (
    <div className="font-serif text-[18px] leading-[1.8] text-foreground [&>p]:mb-7">
      {children}
    </div>
  )
}
