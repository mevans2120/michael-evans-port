import React from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Separator } from "@/components/ui/separator";
import { FeaturedCaseStudies } from "@/components/FeaturedCaseStudies";
import { client } from "@/lib/sanity/client";
import { featuredAIShowcaseQuery, homepageHeroQuery } from "@/lib/sanity/queries";
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Michael Evans | AI/ML Portfolio',
  description: 'Portfolio showcasing AI/ML expertise, creative technology solutions, and professional case studies.',
}

export default async function HomePage() {
  // Fetch all data in parallel for performance
  const [homepage, caseStudiesData, featuredShowcase] = await Promise.all([
    // Fetch homepage content
    client.fetch(homepageHeroQuery),

    // Fetch featured case studies
    client.fetch(`
      *[_type == "project" && featured == true] | order(order asc) {
        _id,
        title,
        "slug": slug.current,
        featuredCategory,
        featuredMetric,
        featuredDescription,
        order
      }
    `),

    // Fetch featured AI showcase
    client.fetch(featuredAIShowcaseQuery)
  ])

  // Hero section with fallbacks
  const tagline = homepage?.tagline || 'builds products'
  const description = homepage?.description || 'Shipping innovative digital products since 2007, across a variety of industries and technologies.'
  const heroCta = {
    text: homepage?.heroCta?.text || 'Learn more about my background',
    link: homepage?.heroCta?.linkType === 'external'
      ? homepage?.heroCta?.externalLink
      : homepage?.heroCta?.internalLink || '/about'
  }

  // Selected Work section with fallbacks
  const selectedWork = {
    heading: homepage?.selectedWorkSection?.heading || 'Selected Work',
    description: homepage?.selectedWorkSection?.description || 'Case studies and product launches'
  }

  // AI Showcase section with fallbacks
  const aiShowcase = {
    heading: homepage?.aiShowcaseSection?.heading || 'AI Showcase',
    description: homepage?.aiShowcaseSection?.description || 'My journey with AI-assisted development',
    viewAllText: homepage?.aiShowcaseSection?.viewAllText || 'View all showcases',
    viewAllLink: homepage?.aiShowcaseSection?.viewAllLinkType === 'external'
      ? homepage?.aiShowcaseSection?.viewAllExternalLink
      : homepage?.aiShowcaseSection?.viewAllInternalLink || '/ai-showcase'
  }

  // Map case studies data to component format
  const featuredCaseStudies = caseStudiesData && caseStudiesData.length > 0
    ? caseStudiesData.map((project: any, index: number) => ({
        id: project._id,
        number: String(index + 1).padStart(2, '0'),
        category: project.featuredCategory || 'Case Study',
        title: project.title,
        metric: project.featuredMetric || '',
        description: project.featuredDescription || '',
        slug: project.slug,
        order: project.order || index + 1
      }))
    : []

  return (
    <div className="min-h-screen relative bg-background text-foreground transition-colors duration-300">
      {/* Hero Section */}
      <section className="px-6 relative min-h-[85vh] flex items-center pt-20">
        <div className="container mx-auto max-w-6xl">
          <div className="max-w-5xl -mx-6 md:mx-0">
            <div className="animate-in fade-in duration-700">
              {/* Main Text */}
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-sans font-light leading-tight mb-6 text-foreground">
                <span className="text-gradient">Michael Evans</span> {tagline}
              </h1>

              {/* Description */}
              <p className="text-xl md:text-2xl font-serif mb-8 text-muted-foreground">
                {description}
              </p>

              <Link
                href={heroCta.link}
                className="inline-flex items-center gap-2 text-sm font-medium transition-colors text-accent hover:text-purple-300"
              >
                {heroCta.text}
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Separator - positioned to peek above viewport */}
      <div className="relative -mt-8">
        <Separator className="mx-auto max-w-6xl" />
      </div>

      {/* Featured Work Section */}
      {featuredCaseStudies.length > 0 && (
        <section className="py-20 px-6 relative mt-8">
          <div className="absolute left-1/4 top-1/2 w-40 h-40 rounded-full blur-3xl bg-accent/20" />
          <div className="container mx-auto max-w-6xl relative z-10">
            <div className="mb-20 -mx-6 md:mx-0">
              <h2 className="text-2xl font-light mb-2 flex items-center gap-3 text-foreground">
                {selectedWork.heading}
                <svg width="48" height="8" viewBox="0 0 48 8" className="w-12" xmlns="http://www.w3.org/2000/svg">
                  <defs>
                    <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#c084fc" stopOpacity="1" />
                      <stop offset="50%" stopColor="#ffffff" stopOpacity="1" />
                      <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                  <line x1="0" y1="4" x2="48" y2="4" stroke="url(#lineGradient)" strokeWidth="0.5" />
                </svg>
              </h2>
              <p className="text-muted-foreground">{selectedWork.description}</p>
            </div>

            <div className="-mx-6 md:mx-0">
              <FeaturedCaseStudies studies={featuredCaseStudies} />
            </div>
          </div>
        </section>
      )}

      {/* AI Showcase Section */}
      {featuredShowcase && (
        <section className="py-20 px-6 relative">
          <div className="absolute right-1/4 top-1/2 w-40 h-40 rounded-full blur-3xl bg-accent/20" />
          <div className="container mx-auto max-w-6xl relative z-10">
            <div className="mb-12 -mx-6 md:mx-0">
              <h2 className="text-2xl font-light mb-2 flex items-center gap-3 text-foreground">
                {aiShowcase.heading}
                <svg width="48" height="8" viewBox="0 0 48 8" className="w-12" xmlns="http://www.w3.org/2000/svg">
                  <defs>
                    <linearGradient id="lineGradient2" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#c084fc" stopOpacity="1" />
                      <stop offset="50%" stopColor="#ffffff" stopOpacity="1" />
                      <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                  <line x1="0" y1="4" x2="48" y2="4" stroke="url(#lineGradient2)" strokeWidth="0.5" />
                </svg>
              </h2>
              <p className="text-muted-foreground">{aiShowcase.description}</p>
            </div>

            <div className="-mx-6 md:mx-0">
              <Link href={`/ai-showcase/${featuredShowcase.slug}`} className="block group mb-8">
                {/* Title */}
                <h3 className="text-3xl md:text-4xl lg:text-5xl font-sans font-light leading-tight mb-6 text-foreground group-hover:text-purple-300 transition-colors">
                  {featuredShowcase.heroSection.title}
                </h3>

                {/* Brief Description */}
                {featuredShowcase.heroSection.summary && (
                  <p className="text-lg md:text-xl font-serif mb-6 leading-relaxed text-muted-foreground">
                    {featuredShowcase.heroSection.summary}
                  </p>
                )}

                {/* CTA */}
                <div className="inline-flex items-center gap-2 text-sm font-medium text-accent hover:text-purple-300 transition-colors">
                  <span>Explore</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>

              {/* View All Link */}
              <div className="mt-10">
                <Link
                  href={aiShowcase.viewAllLink}
                  className="inline-flex items-center gap-2 text-sm font-medium text-accent hover:text-purple-300 transition-colors"
                >
                  {aiShowcase.viewAllText}
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
