import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';
import { Separator } from "@/components/ui/separator";
import { OrnamentalCTA } from "@/components/ui/OrnamentalCTA";
import { FeaturedCaseStudies } from "@/components/FeaturedCaseStudies";
import { sanityFetch } from "@/sanity/lib/live";
import { homepageHeroQuery } from "@/lib/sanity/queries";
import { featuredBlogQuery } from "@/lib/sanity/queries/blog";
import { Metadata } from 'next';
import { generateSanityMetadata } from '@/lib/sanity/metadata';
import { buildImageUrl } from '@/lib/sanity/image-builder';

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

    // Fetch featured blog post
    sanityFetch({ query: featuredBlogQuery })
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

  // Featured Post section with fallbacks
  const featuredPost = {
    heading: homepage?.featuredPostSection?.heading || 'Featured Post',
    description: homepage?.featuredPostSection?.description || 'My journey with AI-assisted development',
    viewAllText: homepage?.featuredPostSection?.viewAllText || 'View all posts',
    viewAllLink: homepage?.featuredPostSection?.viewAllLinkType === 'external'
      ? homepage?.featuredPostSection?.viewAllExternalLink
      : homepage?.featuredPostSection?.viewAllInternalLink || '/blog'
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

              <OrnamentalCTA
                text={heroCta.text}
                href={heroCta.link}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Separator - decorative line under hero */}
      <div className="relative mt-[59px] px-6">
        <div className="container mx-auto max-w-6xl">
          <div className="max-w-5xl -mx-6 md:mx-0">
            <Separator />
          </div>
        </div>
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
              <OrnamentalCTA
                text={selectedWork.viewAllText}
                href={selectedWork.viewAllLink}
              />
            </div>
          </div>
        </section>
      )}

      {/* Featured Post Section */}
      {featuredShowcase && (
        <section className="py-20 px-6 relative">
          <div className="absolute right-1/4 top-1/2 w-40 h-40 rounded-full blur-3xl bg-accent/20" />
          <div className="container mx-auto max-w-6xl relative z-10 border-t border-border dark:border-border pt-20 -mt-20">
            <div className="mb-12 -mx-6 md:mx-0">
              <h2 className="text-2xl font-light mb-2 flex items-center gap-3 text-foreground">
                {featuredPost.heading}
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
              <p className="text-muted-foreground">{featuredPost.description}</p>
            </div>

            <div className="-mx-6 md:mx-0">
              <Link href={`/blog/${featuredShowcase.slug.current}`} className="block group mb-8">
                <div className="flex flex-col md:flex-row gap-8 items-start">
                  {/* Featured Image */}
                  {featuredShowcase.featuredImage?.asset && (
                    <div className="w-full md:w-1/3 flex-shrink-0">
                      <div className="relative aspect-[4/3] rounded-lg overflow-hidden bg-muted">
                        <Image
                          src={buildImageUrl(featuredShowcase.featuredImage, 'card')}
                          alt={featuredShowcase.featuredImage.alt || featuredShowcase.title}
                          fill
                          className="object-cover transition-opacity duration-300 group-hover:opacity-90"
                        />
                      </div>
                    </div>
                  )}

                  {/* Text Content */}
                  <div className="flex-1">
                    {/* Title */}
                    <h3 className="text-3xl md:text-4xl lg:text-5xl font-sans font-light leading-tight mb-6 text-foreground group-hover:text-accent-light transition-colors">
                      {featuredShowcase.title}
                    </h3>

                    {/* Brief Description with inline CTA */}
                    {featuredShowcase.excerpt && (
                      <p className="text-lg md:text-xl font-serif mb-6 leading-relaxed text-muted-foreground">
                        {featuredShowcase.excerpt}{' '}
                        <span className="text-lg md:text-xl font-medium text-accent hover:text-accent-light transition-colors underline whitespace-nowrap">
                          Learn more
                        </span>
                      </p>
                    )}
                  </div>
                </div>
              </Link>

              {/* View All Link */}
              <div className="mt-10">
                <OrnamentalCTA
                  text={featuredPost.viewAllText}
                  href={featuredPost.viewAllLink}
                />
              </div>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
