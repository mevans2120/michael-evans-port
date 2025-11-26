import React from 'react';

interface BlogLayoutProps {
  children: React.ReactNode;
}

/**
 * BlogLayout Component
 *
 * Article wrapper providing:
 * - Centered container with max-width 920px
 * - Appropriate padding and spacing
 * - Semantic HTML structure
 *
 * Margin notes float right with text wrapping around them.
 */
export function BlogLayout({ children }: BlogLayoutProps) {
  return (
    <article className="w-full max-w-[920px] mx-auto px-6 md:px-8 py-16 md:py-20">
      {children}
    </article>
  );
}
