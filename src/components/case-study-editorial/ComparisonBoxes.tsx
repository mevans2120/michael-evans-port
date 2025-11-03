'use client'

import React from 'react'

interface ComparisonBox {
  label?: string
  title?: string
  text: string
  stat?: string
  icon?: string
  _key?: string
}

interface ComparisonBoxesProps {
  boxes: ComparisonBox[]
}

/**
 * Comparison boxes for problem/solution or before/after scenarios
 * 2-column layout on desktop, stacks on mobile
 */
export function ComparisonBoxes({ boxes }: ComparisonBoxesProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-12">
      {boxes.map((box, index) => (
        <div
          key={box._key || index}
          className="p-8 bg-card dark:bg-card border border-border dark:border-border shadow-card"
        >
          {box.icon && (
            <div className="text-[40px] mb-4">{box.icon}</div>
          )}
          {box.label && (
            <div className="font-sans text-xs uppercase tracking-[2px] text-accent dark:text-accent font-semibold mb-3">
              {box.label}
            </div>
          )}
          {box.stat && (
            <div className="font-sans text-[36px] font-bold text-foreground dark:text-foreground mb-2">
              {box.stat}
            </div>
          )}
          {box.title && (
            <h3 className="font-sans text-[20px] font-semibold text-foreground dark:text-foreground mb-3">
              {box.title}
            </h3>
          )}
          {box.text && (
            <p className="font-serif text-base text-muted-foreground leading-relaxed">
              {box.text}
            </p>
          )}
        </div>
      ))}
    </div>
  )
}
