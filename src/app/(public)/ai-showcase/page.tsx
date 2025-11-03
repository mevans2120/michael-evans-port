import { sanityFetch } from '@/sanity/lib/live'
import { allAIShowcasesQuery } from '@/lib/sanity/queries'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import Contact from '@/components/Contact'

interface ShowcaseItem {
  _id: string
  title: string
  slug: string
  category: string
  featured: boolean
  order: number
  heroSection: {
    badge?: string
    title: string
    subtitle?: string
    summary?: string
  }
}

export const metadata = {
  title: 'AI Showcase | Michael Evans',
  description: 'Explore my AI-powered workflows, tools, and production projects',
}

export default async function AIShowcasePage() {
  const { data: showcases } = await sanityFetch({ query: allAIShowcasesQuery })

  return (
    <div className="min-h-screen bg-background text-foreground">
      <main id="main-content" role="main" className="pt-20 pb-12 px-6">
        <div className="container mx-auto max-w-7xl">
          {/* Header */}
          <div className="text-center mb-16 animate-fade-in">
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-light text-foreground mb-6">
              AI Showcase
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground font-light max-w-4xl mx-auto leading-relaxed">
              Explore my journey with AI-assisted development, from workflows and tools to production applications
            </p>
          </div>

          {/* Showcases Grid */}
          {showcases.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
              {showcases.map((showcase: ShowcaseItem, index: number) => (
                <Link
                  key={showcase._id}
                  href={`/ai-showcase/${showcase.slug}`}
                  className="group relative block"
                >
                  <div className="relative h-full p-8 md:p-10 rounded-2xl bg-ai-card border-2 border-ai-card-border hover:border-ai-card-border-hover transition-all duration-300 hover:shadow-xl hover:shadow-accent/10">
                    {/* Title */}
                    <h2 className="text-2xl md:text-3xl font-syne font-bold text-ai-card-foreground mb-4 group-hover:text-accent transition-colors">
                      {showcase.heroSection.title}
                    </h2>

                    {/* Subtitle */}
                    {showcase.heroSection.subtitle && (
                      <p className="text-lg text-muted-foreground mb-4 font-light">
                        {showcase.heroSection.subtitle}
                      </p>
                    )}

                    {/* CTA */}
                    <div className="flex items-center gap-2 text-accent hover:text-accent-light transition-colors">
                      <span className="text-sm font-medium">Learn more</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <p className="text-gray-400">No showcases available yet. Check back soon!</p>
            </div>
          )}

          {/* Back to Home */}
          <div className="text-center">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-sm font-medium text-accent hover:text-accent-light transition-colors"
            >
              <ArrowRight className="w-4 h-4 rotate-180" />
              Back to Home
            </Link>
          </div>
        </div>
      </main>

      <Contact />
    </div>
  )
}
