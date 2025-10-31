import React from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Separator } from "@/components/ui/separator";
import { FeaturedCaseStudies } from "@/components/FeaturedCaseStudies";
import { client } from "@/lib/sanity/client";
import { featuredAIShowcaseQuery } from "@/lib/sanity/queries";
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Michael Evans | AI/ML Portfolio',
  description: 'Portfolio showcasing AI/ML expertise, creative technology solutions, and professional case studies.',
}

export default async function HomePage() {
  // Site is always dark - no light mode
  const isDarkMode = true;

  // Fetch all data in parallel for performance
  const [profileData, caseStudiesData, featuredShowcase] = await Promise.all([
    // Fetch profile data
    client.fetch(`*[_type == "profile"] | order(_updatedAt desc)[0] {
      "profileImage": profileImage.asset->url,
      tagline
    }`),

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

  const profileImage = profileData?.profileImage || null
  const tagline = profileData?.tagline || ''

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
    <div className={`min-h-screen relative transition-colors duration-300 ${
      isDarkMode
        ? 'bg-gradient-to-b from-gray-900 to-gray-950 text-gray-100'
        : 'bg-gradient-to-b from-slate-50 to-white text-gray-900'
    }`}>
      {/* Hero Section */}
      <section className="px-6 relative min-h-[85vh] flex items-center pt-20">
        <div className="container mx-auto max-w-6xl">
          <div className="max-w-5xl -mx-6 md:mx-0">
            {tagline && (
              <div className="animate-in fade-in duration-700">
                {/* Main Text */}
                <h1 className={`text-4xl md:text-5xl lg:text-6xl font-light leading-tight mb-8 ${
                  isDarkMode ? 'text-gray-100' : 'text-gray-900'
                }`}>
                  <span className="text-gradient">Michael Evans</span> {tagline}
                </h1>
                <Link
                  href="/about"
                  className={`inline-flex items-center gap-2 text-sm font-medium transition-colors ${
                    isDarkMode
                      ? 'text-accent hover:text-purple-300'
                      : 'text-purple-600 hover:text-purple-700'
                  }`}
                >
                  Learn more about my background
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Separator - positioned to peek above viewport */}
      <div className="relative -mt-8">
        <Separator className={`mx-auto max-w-6xl ${isDarkMode ? 'bg-gray-800' : ''}`} />
      </div>

      {/* Featured Work Section */}
      {tagline && featuredCaseStudies.length > 0 && (
        <section className="py-20 px-6 relative mt-8">
          <div className={`absolute left-1/4 top-1/2 w-40 h-40 rounded-full blur-3xl ${
            isDarkMode ? 'bg-accent/20' : 'bg-purple-100 opacity-20'
          }`} />
          <div className="container mx-auto max-w-6xl relative z-10">
            <div className="mb-20 -mx-6 md:mx-0 opacity-0">
              <h2 className={`text-2xl font-light mb-2 flex items-center gap-3 ${
                isDarkMode ? 'text-gray-100' : 'text-gray-900'
              }`}>
                Selected Work
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
              <p className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>Case studies and product launches</p>
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
          <div className={`absolute right-1/4 top-1/2 w-40 h-40 rounded-full blur-3xl ${
            isDarkMode ? 'bg-accent/20' : 'bg-purple-100 opacity-20'
          }`} />
          <div className="container mx-auto max-w-6xl relative z-10">
            <div className="mb-12 -mx-6 md:mx-0">
              <h2 className={`text-2xl font-light mb-2 flex items-center gap-3 ${
                isDarkMode ? 'text-gray-100' : 'text-gray-900'
              }`}>
                AI Showcase
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
              <p className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>My journey with AI-assisted development</p>
            </div>

            <div className="-mx-6 md:mx-0">
              <Link href={`/ai-showcase/${featuredShowcase.slug}`} className="block group">
                <div className="relative p-6 md:p-8 rounded-2xl bg-gradient-to-br from-purple-500/10 to-purple-900/5 border border-purple-500/20 hover:border-purple-500/40 transition-all duration-300 hover:shadow-xl hover:shadow-purple-500/10">
                  {/* Title */}
                  <h3 className="text-2xl md:text-3xl font-syne font-bold text-white mb-3 group-hover:text-purple-300 transition-colors">
                    {featuredShowcase.heroSection.title}
                  </h3>

                  {/* Brief Description */}
                  {featuredShowcase.heroSection.summary && (
                    <p className="text-gray-300 mb-6 leading-relaxed line-clamp-2">
                      {featuredShowcase.heroSection.summary}
                    </p>
                  )}

                  {/* CTA */}
                  <div className="flex items-center gap-2 text-purple-300 group-hover:text-purple-200 transition-colors">
                    <span className="text-sm font-medium">Explore</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </Link>

              {/* View All Link */}
              <div className="mt-10 text-center">
                <Link
                  href="/ai-showcase"
                  className={`inline-flex items-center gap-2 text-sm font-medium transition-colors ${
                    isDarkMode
                      ? 'text-accent hover:text-purple-300'
                      : 'text-purple-600 hover:text-purple-700'
                  }`}
                >
                  View all showcases
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
