'use client'

export default function StudioPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center max-w-md px-6">
        <h1 className="text-4xl font-light mb-4">Sanity Studio</h1>
        <p className="text-muted-foreground mb-8">
          The Sanity Studio has been migrated. Configure it separately or access it from your Sanity dashboard.
        </p>
        <a
          href="/"
          className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
        >
          Back to Home
        </a>
      </div>
    </div>
  )
}
