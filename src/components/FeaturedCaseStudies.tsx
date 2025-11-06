'use client'

import React from 'react';
import { useRouter } from 'next/navigation';

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
 * - Always visible descriptions with hover enhancement
 * - Purple accent bar animation
 * - Gradient title effect on hover
 *
 * Mobile & Desktop Interaction:
 * - Tap/Click: Navigates to detail page
 * - Hover (desktop): Brightens description text
 */
export function FeaturedCaseStudies({ studies }: FeaturedCaseStudiesProps) {
  const router = useRouter();

  const handleClick = (slug: string) => {
    router.push(`/case-studies/${slug}`);
  };

  const handleKeyDown = (e: React.KeyboardEvent, slug: string) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleClick(slug);
    }
  };

  return (
    <div className="flex flex-col gap-12">
      {studies.map((study) => {
        return (
          <article
            key={study.id}
            className="relative border-b border-white/8 last:border-b-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-[#050510] focus-visible:rounded-lg"
            onClick={() => handleClick(study.slug)}
            onKeyDown={(e) => handleKeyDown(e, study.slug)}
            tabIndex={0}
            role="button"
            aria-label={`Case study: ${study.title}. ${study.metric}. Press Enter to view details.`}
          >
            {/* Inner hover area with equal vertical spacing */}
            <div className="group cursor-pointer pt-6 pb-[60px] active:scale-[0.99] md:active:scale-100 flex flex-col gap-6">
              {/* Category */}
              <div className="text-xs md:text-sm font-semibold text-accent tracking-wider uppercase font-sans">
                {study.category}
              </div>

              {/* Title + Metric */}
              <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 md:gap-10">
                <h3 className="text-4xl md:text-5xl lg:text-6xl font-semibold leading-tight font-sans transition-colors duration-600 group-hover:text-accent-light">
                  {study.title}
                </h3>
                <div className="text-lg md:text-xl font-semibold font-sans whitespace-nowrap opacity-60">
                  {study.metric}
                </div>
              </div>

              {/* Description - Always visible with hover enhancement */}
              <div className="grid grid-rows-[1fr] opacity-100">
                <div className="overflow-hidden">
                  <p className="text-lg md:text-xl leading-relaxed text-muted-foreground max-w-3xl font-serif transition-colors group-hover:text-foreground">
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
