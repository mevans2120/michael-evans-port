'use client'

import React from 'react'

interface MagazineSectionHeaderProps {
  children: string
}

/**
 * Section header component
 * Small uppercase text with top border separator
 */
export function MagazineSectionHeader({ children }: MagazineSectionHeaderProps) {
  return (
    <h2 className="font-sans text-sm uppercase tracking-[2px] text-accent dark:text-accent font-bold my-20 pt-20 border-t border-border dark:border-border">
      {children}
    </h2>
  )
}
