'use client'

import React from 'react'

interface MagazinePullQuoteProps {
  quote: string
  attribution?: string
}

/**
 * Pull quote component for highlighting important quotes
 * Features large text, accent border, and card background
 */
export function MagazinePullQuote({ quote, attribution }: MagazinePullQuoteProps) {
  return (
    <blockquote className="font-sans text-[28px] leading-[1.4] font-semibold text-foreground my-14 p-10 bg-card dark:bg-card border-l-[6px] border-accent dark:border-accent shadow-card dark:shadow-card italic">
      {quote}
      {attribution && (
        <footer className="font-serif text-sm text-muted-foreground mt-4 not-italic font-normal">
          {attribution}
        </footer>
      )}
    </blockquote>
  )
}
