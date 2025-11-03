'use client'

import React from 'react'
import Link from 'next/link'

interface EditorialCTAProps {
  text: string
  link: string
}

/**
 * Editorial call-to-action component
 * Displays a centered CTA button at the end of case studies
 */
export function EditorialCTA({ text, link }: EditorialCTAProps) {
  const isExternal = link.startsWith('http')

  return (
    <section className="max-w-4xl mx-auto px-6 py-16">
      <div className="text-center">
        {isExternal ? (
          <a
            href={link}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block px-8 py-4 bg-accent dark:bg-accent text-accent-foreground dark:text-accent-foreground font-sans font-semibold text-base rounded hover:opacity-90 transition-opacity"
          >
            {text}
          </a>
        ) : (
          <Link
            href={link}
            className="inline-block px-8 py-4 bg-accent dark:bg-accent text-accent-foreground dark:text-accent-foreground font-sans font-semibold text-base rounded hover:opacity-90 transition-opacity"
          >
            {text}
          </Link>
        )}
      </div>
    </section>
  )
}
