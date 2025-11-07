import React from 'react';
import { CalendarIcon, ClockIcon, UserIcon } from 'lucide-react';

interface BlogMetaProps {
  publishedAt: string;
  updatedAt?: string;
  author?: string;
  readingTime?: number;
}

/**
 * BlogMeta Component
 *
 * Displays blog post metadata:
 * - Published date
 * - Updated date (if different)
 * - Author
 * - Reading time estimate
 */
export function BlogMeta({ publishedAt, updatedAt, author, readingTime }: BlogMetaProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div className="flex flex-wrap items-center gap-4 md:gap-6 text-sm text-muted-foreground font-sans">
      {/* Published Date */}
      <div className="flex items-center gap-2">
        <CalendarIcon className="w-4 h-4" />
        <time dateTime={publishedAt}>
          {formatDate(publishedAt)}
        </time>
      </div>

      {/* Author */}
      {author && (
        <div className="flex items-center gap-2">
          <UserIcon className="w-4 h-4" />
          <span>{author}</span>
        </div>
      )}

      {/* Reading Time */}
      {readingTime && (
        <div className="flex items-center gap-2">
          <ClockIcon className="w-4 h-4" />
          <span>{readingTime} min read</span>
        </div>
      )}

      {/* Updated Date (if different from published) */}
      {updatedAt && updatedAt !== publishedAt && (
        <div className="flex items-center gap-2 text-xs">
          <span>Updated {formatDate(updatedAt)}</span>
        </div>
      )}
    </div>
  );
}
