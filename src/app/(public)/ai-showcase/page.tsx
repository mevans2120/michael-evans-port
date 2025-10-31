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
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-950 text-gray-100">
      <main id="main-content" role="main" className="pt-20 pb-12 px-6">
        <div className="container mx-auto max-w-7xl">
          {/* Header */}
          <div className="text-center mb-16 animate-fade-in">
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-light text-white mb-6">
              AI Showcase
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 font-light max-w-4xl mx-auto leading-relaxed">
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
                  <div className="relative h-full p-8 md:p-10 rounded-2xl bg-gradient-to-br from-purple-500/10 to-purple-900/5 border border-purple-500/20 hover:border-purple-500/40 transition-all duration-300 hover:shadow-xl hover:shadow-purple-500/10">
                    {/* Featured Badge */}
                    {showcase.featured && (
                      <div className="absolute top-4 right-4">
                        <span className="inline-block px-3 py-1 rounded-full bg-purple-500/20 border border-purple-500/30 text-purple-300 text-xs font-medium uppercase tracking-wider">
                          Featured
                        </span>
                      </div>
                    )}

                    {/* Category Badge */}
                    {showcase.heroSection.badge && (
                      <div className="mb-4">
                        <span className="inline-block px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-300 text-xs font-medium uppercase tracking-wider">
                          {showcase.heroSection.badge}
                        </span>
                      </div>
                    )}

                    {/* Title */}
                    <h2 className="text-2xl md:text-3xl font-syne font-bold text-white mb-4 group-hover:text-purple-300 transition-colors">
                      {showcase.heroSection.title}
                    </h2>

                    {/* Subtitle */}
                    {showcase.heroSection.subtitle && (
                      <p className="text-lg text-purple-200 mb-4 font-light">
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
                    <div className="flex items-center gap-2 text-purple-300 group-hover:text-purple-200 transition-colors">
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
              className="inline-flex items-center gap-2 text-sm font-medium text-purple-300 hover:text-purple-200 transition-colors"
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
