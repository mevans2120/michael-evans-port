'use client'

import React from 'react'

interface MagazineTechStackProps {
  technologies: string[]
}

/**
 * Technology stack tags component
 * Interactive tags with hover effects
 */
export function MagazineTechStack({ technologies }: MagazineTechStackProps) {
  return (
    <div className="flex flex-wrap gap-3 my-10">
      {technologies.map((tech, index) => (
        <span
          key={index}
          className="font-sans text-[13px] px-4 py-2 bg-background dark:bg-card border-[1.5px] border-border dark:border-border text-foreground dark:text-foreground font-semibold transition-smooth hover:border-accent dark:hover:border-accent hover:text-accent dark:hover:text-accent hover:-translate-y-0.5 hover:shadow-md"
        >
          {tech}
        </span>
      ))}
    </div>
  )
}
