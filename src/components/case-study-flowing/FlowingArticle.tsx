/**
 * Flowing Article Wrapper
 * Main component for rendering case study articles in flowing editorial format
 */

import type { PortableTextBlock } from 'sanity'
import { ArticleContent } from './ArticleContent'

interface FlowingArticleProps {
  article: PortableTextBlock[]
  className?: string
}

export function FlowingArticle({ article, className = '' }: FlowingArticleProps) {
  if (!article || article.length === 0) {
    return null
  }

  return (
    <article className={`container max-w-4xl mx-auto px-6 pb-8 md:pb-12 ${className}`}>
      <ArticleContent content={article} />
    </article>
  )
}
