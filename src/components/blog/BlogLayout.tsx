import React from 'react';

interface BlogLayoutProps {
  children: React.ReactNode;
}

/**
 * BlogLayout Component
 *
 * Simple article wrapper providing:
 * - Centered column with max-width
 * - Appropriate padding and spacing
 * - Semantic HTML structure
 */
export function BlogLayout({ children }: BlogLayoutProps) {
  return (
    <article className="w-full max-w-[920px] mx-auto px-6 md:px-8 py-16 md:py-20">
      <div className="space-y-12">
        {children}
      </div>
    </article>
  );
}
