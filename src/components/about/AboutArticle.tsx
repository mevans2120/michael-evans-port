/**
 * About Article Wrapper
 * Main component for rendering about page article in flowing editorial format
 * Reuses the ArticleContent renderer from case-study-flowing
 */

import { ArticleContent } from '@/components/case-study-flowing/ArticleContent'

interface AboutArticleProps {
  article: any[]
  className?: string
}

export function AboutArticle({ article, className = '' }: AboutArticleProps) {
  if (!article || article.length === 0) {
    return null
  }

  return (
    <article className={`container max-w-4xl mx-auto px-6 pt-4 md:pt-6 pb-16 md:pb-24 ${className}`}>
      <ArticleContent content={article} />
    </article>
  )
}
