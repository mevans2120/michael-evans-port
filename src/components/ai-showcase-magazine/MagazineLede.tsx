'use client'

import React from 'react'

interface MagazineLedeProps {
  children: string
}

/**
 * Lede paragraph - introductory paragraph with accent border
 * Larger text size, left border accent
 */
export function MagazineLede({ children }: MagazineLedeProps) {
  return (
    <p className="text-[20px] leading-[1.6] text-foreground mb-12 font-normal border-l-4 border-accent dark:border-accent pl-7 max-w-[720px]">
      {children}
    </p>
  )
}
