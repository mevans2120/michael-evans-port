import { Metadata } from 'next'
import { client } from '@/lib/sanity/client'
import { featuredCaseStudyQuery, projectsQuery } from '@/lib/sanity/queries'
import { CaseStudiesHero } from '@/components/case-studies/CaseStudiesHero'
import { SectionSeparator } from '@/components/case-studies/SectionSeparator'
import { FeaturedCaseStudies } from '@/components/FeaturedCaseStudies'

export const metadata: Metadata = {
  title: 'Case Studies | Michael Evans',
  description: 'Product launches, transformational projects, and measurable business impact across e-commerce, travel, and enterprise software.',
}

export default async function CaseStudiesPage() {
  // Fetch data in parallel
  const [featuredCaseStudy, allProjects] = await Promise.all([
    client.fetch(featuredCaseStudyQuery),
    client.fetch(projectsQuery)
  ])

  // Filter for case studies only and format for FeaturedCaseStudies component
  const caseStudies = allProjects
    .filter((project: any) => project.category === 'case-study')
    .map((project: any, index: number) => ({
      id: project._id,
      number: String(index + 1).padStart(2, '0'),
      category: project.featuredCategory || 'Case Study',
      title: project.title,
      metric: project.featuredMetric || '',
      description: project.featuredDescription || project.summary || '',
      slug: project.slug?.current || project.slug,
      order: project.order || index + 1
    }))

  return (
    <main>
      {/* Hero Section */}
      {featuredCaseStudy && (
        <CaseStudiesHero caseStudy={featuredCaseStudy} />
      )}

      {/* Separator */}
      <div className="container">
        <SectionSeparator />
      </div>

      {/* All Case Studies */}
      <section className="container pb-32">
        <div className="mb-16">
          <h2 className="text-3xl font-light text-foreground mb-2" style={{ fontFamily: 'var(--font-crimson-pro)' }}>
            All Case Studies
          </h2>
          <p className="text-muted-foreground">
            Product launches and transformational projects
          </p>
        </div>

        {caseStudies.length > 0 && (
          <FeaturedCaseStudies studies={caseStudies} />
        )}
      </section>
    </main>
  )
}
