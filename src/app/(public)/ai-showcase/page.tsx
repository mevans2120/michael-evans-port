import { client } from '@/lib/sanity/client'
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
  const showcases: ShowcaseItem[] = await client.fetch(allAIShowcasesQuery)

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
              {showcases.map((showcase, index) => (
                <Link
                  key={showcase._id}
                  href={`/ai-showcase/${showcase.slug}`}
                  className="group relative block"
                >
                  <div className="relative h-full p-8 md:p-10 rounded-2xl bg-gradient-to-br from-accent/10 to-accent/5 border border-accent/20 hover:border-accent/40 transition-all duration-300 hover:shadow-xl hover:shadow-accent/10">
                    {/* Featured Badge */}
                    {showcase.featured && (
                      <div className="absolute top-4 right-4">
                        <span className="inline-block px-3 py-1 rounded-full bg-accent/20 border border-accent/30 text-accent-light text-xs font-medium uppercase tracking-wider">
                          Featured
                        </span>
                      </div>
                    )}

                    {/* Category Badge */}
                    {showcase.heroSection.badge && (
                      <div className="mb-4">
                        <span className="inline-block px-3 py-1 rounded-full bg-accent/10 border border-accent/20 text-accent-light text-xs font-medium uppercase tracking-wider">
                          {showcase.heroSection.badge}
                        </span>
                      </div>
                    )}

                    {/* Title */}
                    <h2 className="text-2xl md:text-3xl font-syne font-bold text-white mb-4 group-hover:text-accent-light transition-colors">
                      {showcase.heroSection.title}
                    </h2>

                    {/* Subtitle */}
                    {showcase.heroSection.subtitle && (
                      <p className="text-lg text-accent-light mb-4 font-light">
                        {showcase.heroSection.subtitle}
                      </p>
                    )}

                    {/* Summary */}
                    {showcase.heroSection.summary && (
                      <p className="text-gray-300 mb-6 leading-relaxed line-clamp-3">
                        {showcase.heroSection.summary}
                      </p>
                    )}

                    {/* CTA */}
                    <div className="flex items-center gap-2 text-accent hover:text-accent-light transition-colors">
                      <span className="text-sm font-medium">Explore this showcase</span>
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
