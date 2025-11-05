/**
 * Stat Block: Quote
 * Displays a memorable quote with attribution
 * Usage: Add human perspective or key insight (e.g., stakeholder feedback)
 */

interface StatBlockQuoteProps {
  quote: string
  attribution?: string
}

export function StatBlockQuote({ quote, attribution }: StatBlockQuoteProps) {
  return (
    <div className="my-12 p-8 bg-muted/30 dark:bg-muted/10 rounded-lg border-l-4 border-accent">
      <blockquote className="text-2xl md:text-3xl font-light text-foreground leading-relaxed mb-4">
        &ldquo;{quote}&rdquo;
      </blockquote>
      {attribution && (
        <p className="text-sm text-muted-foreground italic">
          {attribution}
        </p>
      )}
    </div>
  )
}
