'use client'

import { cn } from '@/lib/utils'
import { CaseStudySectionHeader } from './CaseStudySectionHeader'

interface Metric {
  label: string
  value: string
  description?: string
}

interface CaseStudyMetricsProps {
  metrics: Metric[]
  heading?: string
  label?: string
  className?: string
}

/**
 * Metrics grid with large gradient numbers
 * Preserves exact design from inline styles:
 * - Card background: rgba(255, 255, 255, 0.03)
 * - Card border: rgba(255, 255, 255, 0.1)
 * - Metric value: gradient from hsl(276, 100%, 75%) to hsl(280, 100%, 80%)
 * - Description: #a0a0a0
 */
export function CaseStudyMetrics({
  metrics,
  heading = 'Quantifiable Impact',
  label = 'Key Metrics',
  className
}: CaseStudyMetricsProps) {
  if (!metrics || metrics.length === 0) return null

  return (
    <section
      className={cn("relative py-32 z-10", className)}
      style={{ background: 'rgba(199, 128, 245, 0.03)' }}
    >
      <div className="container max-w-[1200px] mx-auto px-8">
        <CaseStudySectionHeader label={label} heading={heading} />

        <div
          className="grid gap-8 mt-16"
          style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))' }}
        >
          {metrics.map((metric, index) => (
            <div
              key={index}
              className="rounded-3xl px-8 py-12 text-center"
              style={{
                background: 'rgba(255, 255, 255, 0.03)',
                border: '1px solid rgba(255, 255, 255, 0.1)'
              }}
            >
              {/* Metric Value with Gradient */}
              <div
                className="font-bold mb-4 leading-none bg-gradient-to-br from-purple-400 dark:from-purple-300 to-purple-300 dark:to-purple-200 bg-clip-text text-transparent"
                style={{ fontSize: '3.5rem' }}
              >
                {metric.value}
              </div>

              {/* Metric Label */}
              <div className="text-lg font-medium mb-2">
                {metric.label}
              </div>

              {/* Metric Description */}
              {metric.description && (
                <div className="text-sm" style={{ color: '#a0a0a0' }}>
                  {metric.description}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
