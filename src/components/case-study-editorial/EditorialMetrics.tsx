'use client'

import React from 'react'

interface Metric {
  value: string
  label: string
  description?: string
}

interface EditorialMetricsProps {
  metrics: Metric[]
}

/**
 * Editorial metrics component for displaying key results
 * Grid layout showcasing important statistics and outcomes
 */
export function EditorialMetrics({ metrics }: EditorialMetricsProps) {
  return (
    <section className="max-w-4xl mx-auto px-6 py-16">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {metrics.map((metric, index) => (
          <div key={index} className="text-center md:text-left">
            <div className="font-sans text-[48px] md:text-[56px] font-bold text-accent dark:text-accent leading-none mb-3">
              {metric.value}
            </div>
            <div className="font-sans text-sm uppercase tracking-[2px] text-foreground dark:text-foreground font-semibold mb-2">
              {metric.label}
            </div>
            {metric.description && (
              <div className="font-serif text-sm text-muted-foreground leading-relaxed">
                {metric.description}
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  )
}
