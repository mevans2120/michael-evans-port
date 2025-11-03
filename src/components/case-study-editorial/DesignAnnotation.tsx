'use client'

import React from 'react'

interface DesignAnnotationProps {
  title: string
  content: string
}

/**
 * Design annotation component for callouts and technical notes
 * Displays important design decisions or technical considerations
 */
export function DesignAnnotation({ title, content }: DesignAnnotationProps) {
  return (
    <aside className="my-12 p-8 bg-muted dark:bg-muted border-l-4 border-accent dark:border-accent">
      <h4 className="font-sans text-sm uppercase tracking-[2px] text-accent dark:text-accent font-semibold mb-3">
        {title}
      </h4>
      <p className="font-serif text-base text-foreground dark:text-foreground leading-relaxed">
        {content}
      </p>
    </aside>
  )
}
