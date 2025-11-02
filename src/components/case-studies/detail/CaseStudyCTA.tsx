'use client'

import { cn } from '@/lib/utils'
import Link from 'next/link'

interface CaseStudyCTAProps {
  href?: string
  children?: React.ReactNode
  className?: string
}

/**
 * CTA button for case study pages
 * Preserves exact design from inline styles:
 * - Purple gradient background (purple-600 to purple-400)
 * - Hover: slight translate up
 */
export function CaseStudyCTA({
  href = '/case-studies',
  children = 'View More Case Studies',
  className
}: CaseStudyCTAProps) {
  return (
    <div className={cn("container max-w-[1200px] mx-auto px-8 pb-32", className)}>
      <div className="text-center pt-20 border-t border-white/10">
        <Link
          href={href}
          className="inline-block px-12 py-5 bg-gradient-to-r from-purple-600 dark:from-purple-500 to-purple-400 dark:to-purple-300 text-white font-semibold rounded-lg text-lg transition-all duration-300 hover:-translate-y-1"
        >
          {children}
        </Link>
      </div>
    </div>
  )
}
