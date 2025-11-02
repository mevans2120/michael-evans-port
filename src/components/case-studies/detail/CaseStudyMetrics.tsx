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
    <section className={cn("relative py-32 z-10 bg-accent/[0.03]", className)}>
      <div className="container max-w-[1200px] mx-auto px-8">
        <CaseStudySectionHeader label={label} heading={heading} />

        <div
          className="grid gap-8 mt-16"
          style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))' }}
        >
          {metrics.map((metric, index) => (
            <div key={index} className="metric-card px-8 py-12 text-center">
              {/* Metric Value with Gradient */}
              <div className="font-bold mb-4 leading-none bg-gradient-to-br from-accent to-accent-light bg-clip-text text-transparent text-[3.5rem]">
                {metric.value}
              </div>

              {/* Metric Label */}
              <div className="text-lg font-medium mb-2">
                {metric.label}
              </div>

              {/* Metric Description */}
              {metric.description && (
                <div className="text-sm text-muted-foreground">
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
