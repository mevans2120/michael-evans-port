import { type Metadata } from 'next'
import { cachedSanityFetch } from '@/sanity/lib/fetch'
import { servicesPageQuery } from '@/lib/sanity/queries'
import { generateSanityMetadata } from '@/lib/sanity/metadata'
import { JsonLd } from '@/components/JsonLd'
import { generateBreadcrumbSchema } from '@/lib/structured-data'
import { ServicesHero } from '@/components/services/ServicesHero'
import { ServiceEntry } from '@/components/services/ServiceEntry'
import { ServicesInterlude } from '@/components/services/ServicesInterlude'
import type { ServicesPageData } from '@/lib/sanity/types'

// Fallback content if CMS is empty
const fallbackContent: ServicesPageData = {
  _id: 'fallback',
  heroTitle: 'Services',
  heroSubtitle: 'How I help teams build better products.',
  serviceEntries: [
    {
      _key: '1',
      leadInText: "We have a vision, but no clear path. Can you help?",
      leadInAttribution: 'Common question',
      serviceTitle: 'Product Strategy',
      answerParagraphs: [
        "I work with teams to translate ambition into actionable plans. We'll clarify your vision, validate market opportunities, and create a roadmap that aligns your team and stakeholders.",
        'This usually means deep discovery, competitive analysis, and helping you prioritize ruthlessly so you can ship what matters most.',
      ],
    },
    {
      _key: '2',
      serviceTitle: 'AI/ML Implementation',
      answerParagraphs: [
        "Start with the business problem, not the technology. I help teams identify where AI can genuinely add value - then build practical solutions that actually ship to production.",
      ],
    },
  ],
  interludeText: 'Every project starts with a conversation.',
}

export async function generateMetadata(): Promise<Metadata> {
  const { data: pageData } = await cachedSanityFetch<ServicesPageData | null>({
    query: servicesPageQuery,
    tags: ['services'],
  })

  return generateSanityMetadata({
    seo: pageData?.seo,
    title: 'Services | Michael Evans',
    description:
      pageData?.heroSubtitle ||
      'Product strategy, AI/ML implementation, experience design, and technical leadership consulting.',
    path: '/services',
  })
}

export default async function ServicesPage() {
  const { data: pageData } = await cachedSanityFetch<ServicesPageData | null>({
    query: servicesPageQuery,
    tags: ['services'],
  })

  const content = pageData || fallbackContent
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://michael-evans.dev'

  // Structured data for SEO
  const breadcrumbSchema = generateBreadcrumbSchema(
    [{ name: 'Home', url: '/' }, { name: 'Services' }],
    siteUrl
  )

  return (
    <>
      <JsonLd data={[breadcrumbSchema]} />

      <div className="min-h-screen bg-background text-foreground relative">
        {/* Atmospheric blur orbs (matches About page) */}
        <div className="fixed top-[10%] left-[10%] w-[400px] h-[400px] bg-accent/15 rounded-full blur-[100px] pointer-events-none -z-10" />
        <div className="fixed bottom-[20%] right-[10%] w-[500px] h-[500px] bg-accent/10 rounded-full blur-[100px] pointer-events-none -z-10" />

        <main className="max-w-[700px] mx-auto px-6">
          {/* Hero */}
          <ServicesHero
            title={content.heroTitle}
            subtitle={content.heroSubtitle}
          />

          {/* Services Section */}
          <section className="pt-10 pb-20">
            <div
              className="flex flex-col gap-12 animate-in fade-in duration-700"
              style={{ animationDelay: '0.1s' }}
            >
              {content.serviceEntries.map((entry) => (
                <ServiceEntry
                  key={entry._key}
                  leadInText={entry.leadInText}
                  leadInAttribution={entry.leadInAttribution}
                  serviceTitle={entry.serviceTitle}
                  answerParagraphs={entry.answerParagraphs}
                />
              ))}
            </div>
          </section>

          {/* Interlude */}
          <ServicesInterlude text={content.interludeText} />
        </main>
      </div>
    </>
  )
}
