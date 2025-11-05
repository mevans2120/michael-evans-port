import { Metadata } from 'next'
import { sanityFetch } from '@/sanity/lib/live'
import { allFeaturedCaseStudiesQuery, projectsQuery } from '@/lib/sanity/queries'
import { CaseStudiesHero } from '@/components/case-studies/CaseStudiesHero'
import { SectionSeparator } from '@/components/case-studies/SectionSeparator'
import { FeaturedCaseStudies } from '@/components/FeaturedCaseStudies'
import { generateSanityMetadata } from '@/lib/sanity/metadata'

export async function generateMetadata(): Promise<Metadata> {
  return generateSanityMetadata({
    title: 'Case Studies | Michael Evans',
    description: 'Product launches, transformational projects, and measurable business impact across e-commerce, travel, and enterprise software.',
    path: '/case-studies',
  })
}

export default async function CaseStudiesPage() {
  // Fetch data in parallel
  const [{ data: featuredProjects }, { data: allProjects }] = await Promise.all([
    sanityFetch({ query: allFeaturedCaseStudiesQuery }),
    sanityFetch({ query: projectsQuery })
  ])

  // Randomly select one featured project
  const randomCaseStudy = featuredProjects && featuredProjects.length > 0
    ? featuredProjects[Math.floor(Math.random() * featuredProjects.length)]
    : null

  // Format all projects for FeaturedCaseStudies component
  const caseStudies = allProjects
    .map((project: any, index: number) => ({
      id: project._id,
      number: String(index + 1).padStart(2, '0'),
      category: project.category || 'Case Study',
      title: project.title,
      metric: project.featuredMetric || '',
      // Use featuredDescription or heroSection.summary
      description: project.featuredDescription
        || project.heroSection?.summary
        || '',
      slug: project.slug?.current || project.slug,
      order: project.order || index + 1
    }))

  return (
    <main>
      {/* Hero Section */}
      {randomCaseStudy && (
        <CaseStudiesHero caseStudy={randomCaseStudy} />
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
