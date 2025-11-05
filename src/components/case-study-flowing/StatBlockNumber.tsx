/**
 * Stat Block: Big Number
 * Displays a large number with accompanying label
 * Usage: Emphasize quantitative impact (e.g., "8% conversion improvement")
 */

interface StatBlockNumberProps {
  number: string
  label: string
}

export function StatBlockNumber({ number, label }: StatBlockNumberProps) {
  return (
    <div className="my-12 p-8 bg-accent/5 dark:bg-accent/10 border-l-4 border-accent rounded-lg">
      <div className="text-6xl md:text-7xl font-bold text-accent mb-3">
        {number}
      </div>
      <div className="text-lg text-muted-foreground">
        {label}
      </div>
    </div>
  )
}
