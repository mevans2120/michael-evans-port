'use client'

import React, { useState } from 'react';
import Link from 'next/link';
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
              relative py-20 md:py-24 border-b border-white/8 last:border-b-0
              ${isExpanded ? 'pl-4' : ''}
              focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-[#050510] focus-visible:rounded-lg
            `}
            onClick={() => handleClick(study.id, study.slug)}
            onKeyDown={(e) => handleKeyDown(e, study.id, study.slug)}
            tabIndex={0}
            role="button"
            aria-label={`Case study: ${study.title}. ${study.metric}. ${isExpanded ? 'Expanded. Press Enter to view details.' : 'Press Enter to expand.'}`}
            aria-expanded={isExpanded}
          >
            {/* Inner hover area with vertical buffer zones */}
            <div className="group cursor-pointer -my-8 py-8 active:scale-[0.99] md:active:scale-100">
              {/* Header */}
              <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6 gap-4 md:gap-10">
                <div className="flex-1">
                  <div className="text-xs md:text-sm font-semibold text-accent tracking-wider uppercase mb-3 md:mb-5 font-sans">
                    {study.number} — {study.category}
                  </div>
                  <h3 className={`
                    text-4xl md:text-5xl lg:text-6xl font-semibold leading-tight font-sans
                    transition-colors duration-600
                    ${isExpanded ? 'text-accent' : 'group-hover:text-accent'}
                  `}>
                    {study.title}
                  </h3>
                </div>
                <div className="text-lg md:text-xl font-semibold font-sans whitespace-nowrap opacity-60">
                  {study.metric}
                </div>
              </div>

              {/* Description - Grid wrapper for no layout shift */}
              <div className={`
                grid transition-[grid-template-rows,opacity] duration-[1200ms] ease-out
                ${isExpanded ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0 group-hover:grid-rows-[1fr] group-hover:opacity-100'}
              `}>
                <div className="overflow-hidden">
                  <p className="text-lg md:text-xl leading-relaxed text-muted-foreground max-w-3xl font-serif">
                    {study.description}
                  </p>
                </div>
              </div>
            </div>
          </article>
        );
      })}
    </div>
  );
}
