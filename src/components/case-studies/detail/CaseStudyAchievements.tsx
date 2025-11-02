'use client'

import { cn } from '@/lib/utils'
import { CaseStudySectionHeader } from './CaseStudySectionHeader'

interface CaseStudyAchievementsProps {
  achievements: string[]
  heading?: string
  label?: string
  className?: string
}

/**
 * Achievements list with purple bullet points
 * Preserves exact design from inline styles:
 * - Purple bullet: hsl(280, 100%, 80%) = purple-300
 * - Text size: 1.25rem
 * - Text color: #fafafa (very light gray, close to white)
 */
export function CaseStudyAchievements({
  achievements,
  heading = 'Industry-Defining Success',
  label = 'Outcomes & Impact',
  className
}: CaseStudyAchievementsProps) {
  if (!achievements || achievements.length === 0) return null

  return (
    <section className={cn("relative py-32 z-10", className)}>
      <div className="container max-w-[1200px] mx-auto px-8">
        <CaseStudySectionHeader label={label} heading={heading} />

        <div className="mt-12 max-w-[900px]">
          {achievements.map((achievement, index) => (
            <div key={index} className="mb-7 pl-8 relative">
              {/* Purple bullet */}
              <span
                className="absolute rounded-full bg-purple-300 dark:bg-purple-200"
                style={{
                  left: 0,
                  top: '0.6rem',
                  width: '6px',
                  height: '6px'
                }}
              />
              {/* Achievement text */}
              <div
                className="leading-[1.7]"
                style={{
                  fontSize: '1.25rem',
                  color: '#fafafa'
                }}
              >
                {achievement}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
