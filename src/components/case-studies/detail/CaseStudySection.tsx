'use client'

import { cn } from '@/lib/utils'

interface CaseStudySectionProps {
  children: React.ReactNode
  variant?: 'default' | 'alternate'
  className?: string
}

/**
 * Generic section wrapper with optional alternating background
 * Preserves exact design from inline styles:
 * - Default: transparent background
 * - Alternate: rgba(199, 128, 245, 0.03) purple tint
 * - Consistent padding and z-index
 */
export function CaseStudySection({
  children,
  variant = 'default',
  className
}: CaseStudySectionProps) {
  return (
    <section
      className={cn(
        "relative py-32 z-10",
        variant === 'alternate' && "bg-accent/[0.03]",
        className
      )}
    >
      <div className="container max-w-[1200px] mx-auto px-8">
        {children}
      </div>
    </section>
  )
}
