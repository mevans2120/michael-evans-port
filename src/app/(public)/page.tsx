import React from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Separator } from "@/components/ui/separator";
import { FeaturedCaseStudies } from "@/components/FeaturedCaseStudies";
import { sanityFetch } from "@/sanity/lib/live";
import { featuredAIShowcaseQuery, homepageHeroQuery } from "@/lib/sanity/queries";
import { Metadata } from 'next';
import { generateSanityMetadata } from '@/lib/sanity/metadata';

export async function generateMetadata(): Promise<Metadata> {
  const { data: homepage } = await sanityFetch({ query: homepageHeroQuery });

  return generateSanityMetadata({
    seo: homepage?.seo,
    title: 'Michael Evans | AI/ML Portfolio',
    description: homepage?.description || 'Portfolio showcasing AI/ML expertise, creative technology solutions, and professional case studies.',
    path: '/',
  });
}

export default async function HomePage() {
  // Fetch all data in parallel for performance with live preview support
  const [{ data: homepage }, { data: caseStudiesData }, { data: featuredShowcase }] = await Promise.all([
    // Fetch homepage content
    sanityFetch({ query: homepageHeroQuery }),

    // Fetch featured case studies
    sanityFetch({ query: `
      *[_type == "project" && featured == true] | order(order asc) {
        _id,
        title,
        "slug": slug.current,
        category,
        featuredMetric,
        featuredDescription,
        order
      }
    ` }),

    // Fetch featured AI showcase
    sanityFetch({ query: featuredAIShowcaseQuery })
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
    description: homepage?.selectedWorkSection?.description || 'Case studies and product launches',
    viewAllText: homepage?.selectedWorkSection?.viewAllText || 'View all case studies',
    viewAllLink: homepage?.selectedWorkSection?.viewAllLinkType === 'external'
      ? homepage?.selectedWorkSection?.viewAllExternalLink
      : homepage?.selectedWorkSection?.viewAllInternalLink || '/case-studies'
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
        category: project.category || 'Case Study',
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
      <section data-testid="hero" className="px-6 relative min-h-[85vh] flex items-center pt-20">
        <div className="container mx-auto max-w-6xl">
          <div className="max-w-5xl -mx-6 md:mx-0">
            <div className="animate-in fade-in duration-700">
              {/* Main Text */}
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-sans font-light leading-tight mb-6 text-foreground">
                Michael <span className="text-gradient">Evans</span> {tagline}
              </h1>

              {/* Description */}
              <p className="text-xl md:text-2xl font-serif mb-8 text-muted-foreground">
                {description}
              </p>

              <Link
                href={heroCta.link}
                className="inline-flex items-center gap-2 text-sm font-medium transition-colors text-accent hover:text-accent-light"
              >
                {heroCta.text}
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Separator - aligned with chat input border */}
      <div className="relative mt-[59px]">
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
                <svg width="48" height="8" viewBox="0 0 48 8" className="w-12 [&_stop:nth-child(1)]:text-accent [&_stop:nth-child(2)]:text-foreground [&_stop:nth-child(3)]:text-foreground" xmlns="http://www.w3.org/2000/svg">
                  <defs>
                    <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="hsl(var(--accent))" stopOpacity="1" />
                      <stop offset="50%" stopColor="hsl(var(--foreground))" stopOpacity="1" />
                      <stop offset="100%" stopColor="hsl(var(--foreground))" stopOpacity="0" />
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

            {/* View All Link */}
            <div className="mt-10 -mx-6 md:mx-0">
              <Link
                href={selectedWork.viewAllLink}
                className="inline-flex items-center gap-2 text-sm font-medium text-accent hover:text-accent-light transition-colors"
              >
                {selectedWork.viewAllText}
                <ArrowRight className="w-4 h-4" />
              </Link>
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
                      <stop offset="0%" stopColor="hsl(var(--accent))" stopOpacity="1" />
                      <stop offset="50%" stopColor="hsl(var(--foreground))" stopOpacity="1" />
                      <stop offset="100%" stopColor="hsl(var(--foreground))" stopOpacity="0" />
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
                <h3 className="text-3xl md:text-4xl lg:text-5xl font-sans font-light leading-tight mb-6 text-foreground group-hover:text-accent-light transition-colors">
                  {featuredShowcase.heroSection.title}
                </h3>

                {/* Brief Description with inline CTA */}
                {featuredShowcase.heroSection.summary && (
                  <p className="text-lg md:text-xl font-serif mb-6 leading-relaxed text-muted-foreground">
                    {featuredShowcase.heroSection.summary}{' '}
                    <span className="text-lg md:text-xl font-medium text-accent hover:text-accent-light transition-colors underline whitespace-nowrap">
                      Learn more
                    </span>
                  </p>
                )}
              </Link>

              {/* View All Link */}
              <div className="mt-10">
                <Link
                  href={aiShowcase.viewAllLink}
                  className="inline-flex items-center gap-2 text-sm font-medium text-accent hover:text-accent-light transition-colors"
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
