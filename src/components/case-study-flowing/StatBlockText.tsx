/**
 * Stat Block: Free Text
 * Displays a text callout with optional heading
 * Usage: Provide technical context, methodology, or key insights
 */

interface StatBlockTextProps {
  heading?: string
  text: string
}

export function StatBlockText({ heading, text }: StatBlockTextProps) {
  return (
    <div className="my-12 p-8 bg-card dark:bg-card/50 rounded-lg border border-border">
      {heading && (
        <h4 className="text-lg font-semibold text-foreground mb-4">
          {heading}
        </h4>
      )}
      <p className="text-base text-muted-foreground leading-relaxed whitespace-pre-wrap">
        {text}
      </p>
    </div>
  )
}
