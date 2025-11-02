'use client'

import { cn } from '@/lib/utils'

interface CaseStudyAnnotationProps {
  title?: string
  content: string
  className?: string
}

/**
 * Annotation/callout box for important notes
 * Preserves exact design from inline styles:
 * - Background: rgba(199, 128, 245, 0.05) = purple-500/[0.05]
 * - Border-left: hsl(280, 100%, 80%) = purple-300
 * - Title color: purple-300
 * - Text: italic, #c0c0c0
 */
export function CaseStudyAnnotation({
  title,
  content,
  className
}: CaseStudyAnnotationProps) {
  return (
    <div
      className={cn(
        "mt-16 p-8 rounded-lg italic leading-relaxed",
        "bg-purple-500/[0.05] dark:bg-purple-400/[0.05]",
        "border-l-[3px] border-purple-300 dark:border-purple-200",
        className
      )}
      style={{
        fontSize: '0.95rem',
        lineHeight: '1.6',
        color: '#c0c0c0'
      }}
    >
      {title && (
        <strong className="not-italic text-purple-300 dark:text-purple-200">
          {title}:
        </strong>
      )}{' '}
      {content}
    </div>
  )
}
