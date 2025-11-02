'use client'

import React from 'react'

interface MagazineMetricsProps {
  metrics: Array<{
    value: string
    label: string
    description?: string
  }>
}

/**
 * Metrics grid component
 * Inverted color scheme (dark background) with prominent numbers
 */
export function MagazineMetrics({ metrics }: MagazineMetricsProps) {
  return (
    <div className="bg-white dark:bg-neutral-900 text-foreground p-12 my-16 grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-8">
      {metrics.map((metric, index) => (
        <div key={index} className="text-center">
          <span className="font-sans text-[48px] font-bold text-accent block mb-2">
            {metric.value}
          </span>
          <span className="font-serif text-sm uppercase tracking-[1px] text-muted-foreground">
            {metric.label}
          </span>
        </div>
      ))}
    </div>
  )
}
