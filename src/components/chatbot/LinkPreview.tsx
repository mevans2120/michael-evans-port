'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';
import { ExternalLink, FileText } from 'lucide-react';
import { useNavigation } from '@/contexts/NavigationContext';
import { useIsDesktop } from '@/hooks/useMediaQuery';

/**
 * TypeScript interfaces
 */
interface LinkMetadata {
  title: string;
  category: string;
  description: string;
  imageUrl: string;
}

interface LinkPreviewProps {
  href: string;
  children?: React.ReactNode;
  className?: string;
}

/**
 * Client-side cache for link metadata
 * Key: URL, Value: { data, timestamp }
 */
const metadataCache = new Map<string, { data: LinkMetadata | null; timestamp: number }>();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

/**
 * Parse URL to extract type and slug for internal links
 */
function parseInternalLink(href: string): { type: 'project' | 'blog'; slug: string } | null {
  // Match /case-studies/slug or /blog/slug
  const caseStudyMatch = href.match(/^\/case-studies\/([^/]+)$/);
  const blogMatch = href.match(/^\/blog\/([^/]+)$/);

  if (caseStudyMatch) {
    return { type: 'project', slug: caseStudyMatch[1] };
  }

  if (blogMatch) {
    return { type: 'blog', slug: blogMatch[1] };
  }

  return null;
}

/**
 * LinkPreview Component
 *
 * Displays rich preview cards for internal case study and blog links.
 * Fetches metadata from /api/link-metadata and caches results client-side.
 *
 * Features:
 * - Automatic metadata fetching for internal links
 * - Client-side caching (5 minutes)
 * - Skeleton loading states
 * - Responsive design (mobile vertical, desktop horizontal)
 * - Fallback for missing images/descriptions
 * - Full accessibility support
 */
export function LinkPreview({ href, children, className }: LinkPreviewProps) {
  const [metadata, setMetadata] = useState<LinkMetadata | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(false);

  const linkInfo = parseInternalLink(href);
  const isInternalPreview = linkInfo !== null;

  useEffect(() => {
    // Only fetch metadata for internal case study/showcase links
    if (!isInternalPreview) {
      return;
    }

    // Check cache first
    const cached = metadataCache.get(href);
    const now = Date.now();

    if (cached && now - cached.timestamp < CACHE_DURATION) {
      setMetadata(cached.data);
      return;
    }

    // Fetch metadata
    const fetchMetadata = async () => {
      setIsLoading(true);
      setError(false);

      try {
        const params = new URLSearchParams({
          type: linkInfo.type,
          slug: linkInfo.slug,
        });

        const response = await fetch(`/api/link-metadata?${params}`);

        if (!response.ok) {
          throw new Error('Failed to fetch metadata');
        }

        const data: LinkMetadata = await response.json();

        // Cache the result
        metadataCache.set(href, { data, timestamp: now });

        setMetadata(data);
      } catch (err) {
        console.error('Error fetching link metadata:', err);
        setError(true);

        // Cache the error state (prevent repeated failed requests)
        metadataCache.set(href, { data: null, timestamp: now });
      } finally {
        setIsLoading(false);
      }
    };

    fetchMetadata();
  }, [href, isInternalPreview, linkInfo]);

  // Render standard link for external URLs or if error occurred
  if (!isInternalPreview || error) {
    return (
      <Link
        href={href}
        className={cn(
          'text-accent dark:text-accent-light hover:underline inline-flex items-center gap-1',
          className
        )}
        target={href.startsWith('http') ? '_blank' : undefined}
        rel={href.startsWith('http') ? 'noopener noreferrer' : undefined}
      >
        {children || href}
        {href.startsWith('http') && (
          <ExternalLink className="w-3 h-3" aria-label="Opens in new tab" />
        )}
      </Link>
    );
  }

  // Show skeleton while loading
  if (isLoading) {
    return <LinkPreviewSkeleton />;
  }

  // Render rich preview card if metadata is available
  if (metadata) {
    return (
      <LinkPreviewCard
        href={href}
        metadata={metadata}
        className={className}
      />
    );
  }

  // Fallback to standard link if no metadata (shouldn't happen with caching)
  return (
    <Link
      href={href}
      className={cn(
        'text-accent dark:text-accent-light hover:underline',
        className
      )}
    >
      {children || href}
    </Link>
  );
}

/**
 * LinkPreviewSkeleton
 *
 * Loading state skeleton for the link preview card
 */
function LinkPreviewSkeleton() {
  return (
    <div className="my-4 rounded-lg border border-border bg-card overflow-hidden">
      <div className="flex flex-col md:flex-row gap-4 p-4">
        {/* Image skeleton */}
        <Skeleton className="w-full md:w-32 h-32 rounded-lg flex-shrink-0" />

        {/* Content skeleton */}
        <div className="flex-1 space-y-2">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-6 w-3/4" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
        </div>
      </div>
    </div>
  );
}

/**
 * LinkPreviewCard
 *
 * Rich preview card displaying metadata for case studies and blog posts
 */
interface LinkPreviewCardProps {
  href: string;
  metadata: LinkMetadata;
  className?: string;
}

function LinkPreviewCard({ href, metadata, className }: LinkPreviewCardProps) {
  const [imageError, setImageError] = useState(false);
  const hasImage = metadata.imageUrl && !imageError;

  // Detect internal links (starts with / but not //)
  const isInternalLink = href.startsWith('/') && !href.startsWith('//');

  // Get navigation context and mobile detection
  const { chatExpanded, setChatExpanded } = useNavigation();
  const isDesktop = useIsDesktop();

  const handleClick = () => {
    // Only trigger loading for internal navigation
    if (isInternalLink) {
      window.dispatchEvent(new CustomEvent('navigation-start'));

      // Auto-minimize chat on mobile when navigating
      if (!isDesktop && chatExpanded) {
        setChatExpanded(false);
      }
    }
  };

  return (
    <Link
      href={href}
      onClick={handleClick}
      target={isInternalLink ? undefined : '_blank'}
      rel={isInternalLink ? undefined : 'noopener noreferrer'}
      className={cn(
        'my-4 block rounded-lg border border-border bg-card hover:border-accent dark:hover:border-accent-light',
        'transition-smooth hover:shadow-card focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
        'group',
        className
      )}
      aria-label={`View ${metadata.category}: ${metadata.title}${!isInternalLink ? ' (opens in new tab)' : ''}`}
    >
      <div className="flex flex-col md:flex-row gap-4 p-4 md:min-h-[164px]">
        {/* Image - taller aspect ratio on mobile */}
        {hasImage ? (
          <div className="relative w-full md:w-32 h-48 md:h-32 rounded-lg overflow-hidden flex-shrink-0 bg-muted">
            <Image
              src={metadata.imageUrl}
              alt={metadata.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-slow"
              onError={() => setImageError(true)}
            />
          </div>
        ) : (
          <div className="w-full md:w-32 h-48 md:h-32 rounded-lg flex-shrink-0 bg-gradient-purple flex items-center justify-center">
            <FileText className="w-12 h-12 text-white opacity-80" aria-hidden="true" />
          </div>
        )}

        {/* Content - flex column to maintain consistent height */}
        <div className="flex-1 min-w-0 flex flex-col">
          {/* Category badge */}
          <div className="text-xs font-medium text-accent dark:text-accent-light uppercase tracking-wider mb-1">
            {metadata.category}
          </div>

          {/* Title */}
          <h3 className="text-lg font-semibold text-foreground mb-2 line-clamp-2 group-hover:text-accent dark:group-hover:text-accent-light transition-colors">
            {metadata.title}
          </h3>

          {/* Description - hidden on mobile, shown on desktop with consistent height */}
          <div className="hidden md:block flex-1">
            {metadata.description ? (
              <p className="text-sm text-muted-foreground line-clamp-3">
                {metadata.description}
              </p>
            ) : (
              <p className="text-sm text-muted-foreground italic">
                Click to view {metadata.category.toLowerCase()}
              </p>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
