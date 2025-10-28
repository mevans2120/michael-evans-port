'use client'

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useMediaQuery } from '@/hooks/useMediaQuery';

interface CaseStudy {
  id: string;
  number: string;
  category: string;
  title: string;
  metric: string;
  description: string;
  slug: string;
  order: number;
}

interface FeaturedCaseStudiesProps {
  studies: CaseStudy[];
}

/**
 * FeaturedCaseStudies Component
 *
 * Displays featured case studies in a vertical stacked layout with:
 * - Large typography and generous spacing
 * - Progressive disclosure (hover on desktop, tap on mobile)
 * - Purple accent bar animation
 * - Gradient title effect on hover/tap
 *
 * Mobile Interaction:
 * - First tap: Expands description
 * - Second tap: Navigates to detail page
 *
 * Desktop Interaction:
 * - Hover: Shows description
 * - Click: Navigates to detail page
 */
export function FeaturedCaseStudies({ studies }: FeaturedCaseStudiesProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const isMobile = useMediaQuery('(max-width: 768px)');
  const router = useRouter();

  const handleClick = (id: string, slug: string) => {
    if (isMobile) {
      // Mobile: First tap expands, second tap navigates
      if (expandedId === id) {
        // Already expanded, navigate to detail page
        router.push(`/case-studies/${slug}`);
      } else {
        // Not expanded, expand it
        setExpandedId(id);
      }
    } else {
      // Desktop: Click navigates immediately
      router.push(`/case-studies/${slug}`);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent, id: string, slug: string) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleClick(id, slug);
    }
  };

  return (
    <div className="flex flex-col gap-16">
      {studies.map((study) => {
        const isExpanded = expandedId === study.id;

        return (
          <article
            key={study.id}
            className={`
              group relative py-14 border-b border-white/8 last:border-b-0
              cursor-pointer transition-all duration-[400ms] ease-out
              hover:pl-8
              ${isExpanded ? 'pl-8' : ''}
            `}
            onClick={() => handleClick(study.id, study.slug)}
            onKeyDown={(e) => handleKeyDown(e, study.id, study.slug)}
            tabIndex={0}
            role="button"
            aria-label={`Case study: ${study.title}. ${study.metric}. ${isExpanded ? 'Expanded. Press Enter to view details.' : 'Press Enter to expand.'}`}
            aria-expanded={isExpanded}
          >
            {/* Purple accent bar */}
            <div
              className={`
                absolute -left-10 top-1/2 -translate-y-1/2 w-1 bg-gradient-to-b
                from-purple-400 to-purple-300 rounded-full transition-all duration-[400ms]
                ${isExpanded ? 'h-30' : 'h-0 group-hover:h-30'}
              `}
            />

            {/* Header */}
            <div className="flex justify-between items-center mb-6 gap-10">
              <div className="flex-1">
                <div className="text-sm font-semibold text-purple-400 tracking-wider uppercase mb-5 font-sans">
                  {study.number} — {study.category}
                </div>
                <h3 className={`
                  text-5xl md:text-6xl font-semibold leading-tight mb-4
                  transition-all duration-300 font-sans
                  ${isExpanded ? 'bg-gradient-to-br from-purple-400 to-white bg-clip-text text-transparent' : 'group-hover:bg-gradient-to-br group-hover:from-purple-400 group-hover:to-white group-hover:bg-clip-text group-hover:text-transparent'}
                `}>
                  {study.title}
                </h3>
              </div>
              <div className={`
                text-xl font-semibold font-sans whitespace-nowrap
                transition-opacity duration-300
                ${isExpanded ? 'opacity-100' : 'opacity-60 group-hover:opacity-100'}
              `}>
                {study.metric}
              </div>
            </div>

            {/* Description - Expands on hover (desktop) or tap (mobile) */}
            <p className={`
              text-xl leading-relaxed text-gray-300 max-w-3xl
              transition-all duration-[400ms] ease-out overflow-hidden
              ${isExpanded ? 'max-h-48 opacity-100 mt-6' : 'max-h-0 opacity-0 group-hover:max-h-48 group-hover:opacity-100 group-hover:mt-6'}
            `}>
              {study.description}
            </p>
          </article>
        );
      })}
    </div>
  );
}
