import { notFound } from 'next/navigation';
import { client } from "@/lib/sanity/client";
import { PortableText } from '@portabletext/react';
import { urlFor } from '@/lib/sanity/client';
import Image from 'next/image';
import { Metadata } from 'next';
import {
  CaseStudyHero,
  CaseStudySection,
  CaseStudySectionHeader,
  CaseStudyAnnotation,
  CaseStudyMetrics,
  CaseStudyAchievements,
  CaseStudyCTA,
} from '@/components/case-studies/detail';

interface Screenshot {
  image: {
    asset: {
      _ref: string;
      url?: string;
    };
  };
  caption?: string;
  layout: 'grid' | 'large';
}

interface Annotation {
  title?: string;
  content?: string;
}

interface Section {
  _key: string;
  sectionLabel?: string;
  heading: string;
  content: any; // Portable Text content
  screenshots?: Screenshot[];
  annotation?: Annotation;
}

interface CaseStudyData {
  title: string;
  subtitle: string;
  description: string;
  category: string;
  heroImage?: {
    asset: {
      url: string;
    };
  };
  metrics: {
    label: string;
    value: string;
    description?: string;
  }[];
  achievements: string[];
  technologies?: string[];
  overview?: {
    problem?: string;
    solution?: string;
    role?: string;
    company?: string;
    timeline?: string;
  };
  sections?: Section[];
}

const PROJECT_QUERY = `*[_type == "project" && slug.current == $slug][0] {
  title,
  "subtitle": summary,
  description,
  category,
  heroImage {
    asset-> {
      url
    }
  },
  metrics[] {
    label,
    value,
    description
  },
  achievements,
  technologies,
  overview {
    role,
    company,
    timeline,
    problem,
    solution
  },
  sections[] {
    _key,
    sectionLabel,
    heading,
    content,
    screenshots[] {
      image {
        asset-> {
          _ref,
          url
        }
      },
      caption,
      layout
    },
    annotation {
      title,
      content
    }
  }
}`;

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

// Generate static params for all case studies at build time
export async function generateStaticParams() {
  const projects = await client.fetch<{ slug: string }[]>(
    `*[_type == "project" && category == "case-study"]{ "slug": slug.current }`
  );

  return projects.map((project) => ({
    slug: project.slug,
  }));
}

// Revalidate every hour (ISR - Incremental Static Regeneration)
export const revalidate = 3600;

// Generate metadata for SEO
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = await client.fetch<CaseStudyData>(PROJECT_QUERY, { slug });

  if (!project) {
    return {
      title: 'Case Study Not Found',
    };
  }

  return {
    title: `${project.title} | Michael Evans`,
    description: project.subtitle || project.description,
  };
}

// Portable Text components for rich text rendering - FIXED: purple color now has dark mode variant
const portableTextComponents = {
  marks: {
    strong: ({ children }: any) => (
      <strong className="text-purple-300 dark:text-purple-200">{children}</strong>
    ),
  },
};

export default async function CaseStudyPage({ params }: PageProps) {
  const { slug } = await params;
  const project = await client.fetch<CaseStudyData>(PROJECT_QUERY, { slug });

  if (!project) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0a0a14] to-[#050510] text-white overflow-x-hidden">
      {/* Atmospheric blur orbs */}
      <div
        className="blur-orb-1 fixed pointer-events-none -z-10"
        style={{
          top: '10%',
          left: '10%',
          width: '400px',
          height: '400px',
          borderRadius: '50%',
          background: 'hsl(280, 100%, 70%)',
          opacity: 0.15,
          filter: 'blur(100px)',
        }}
      />
      <div
        className="blur-orb-2 fixed pointer-events-none -z-10"
        style={{
          bottom: '20%',
          right: '10%',
          width: '500px',
          height: '500px',
          borderRadius: '50%',
          background: 'hsl(276, 100%, 75%)',
          opacity: 0.15,
          filter: 'blur(100px)',
        }}
      />

      {/* Hero Section - REFACTORED into component */}
      <CaseStudyHero
        category={project.category}
        title={project.title}
        subtitle={project.subtitle}
        technologies={project.technologies}
      />

      {/* Dynamic Sections - PARTIALLY REFACTORED */}
      {project.sections?.map((section, index) => (
        <CaseStudySection
          key={section._key}
          variant={index % 2 === 0 ? 'default' : 'alternate'}
        >
          <CaseStudySectionHeader
            label={section.sectionLabel}
            heading={section.heading}
          />

          {/* PortableText Content */}
          {section.content && (
            <div className="prose prose-invert max-w-[900px]">
              <PortableText
                value={section.content}
                components={portableTextComponents}
              />
            </div>
          )}

          {/* Annotation - REFACTORED into component */}
          {section.annotation && section.annotation.content && (
            <CaseStudyAnnotation
              title={section.annotation.title}
              content={section.annotation.content}
            />
          )}

          {/* Screenshots - PRESERVED as-is (complex logic) */}
          {section.screenshots && section.screenshots.length > 0 && (
            <div className="mt-16">
              {/* Grid screenshots */}
              {section.screenshots.filter(s => s.layout === 'grid').length > 0 && (
                <div className="grid gap-8 mb-8" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))' }}>
                  {section.screenshots.filter(s => s.layout === 'grid').map((screenshot, idx) => {
                    const imageUrl = screenshot.image.asset.url || urlFor(screenshot.image.asset).url();
                    return (
                      <div key={idx}>
                        <div className="relative rounded-2xl overflow-hidden" style={{ aspectRatio: '16 / 10', background: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
                          {imageUrl ? (
                            <Image src={imageUrl} alt={screenshot.caption || ''} fill className="object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-center px-8 text-sm" style={{ background: 'linear-gradient(135deg, rgba(199, 128, 245, 0.1), rgba(199, 128, 245, 0.05))', color: '#707070' }}>
                              Screenshot placeholder
                            </div>
                          )}
                        </div>
                        {screenshot.caption && (
                          <div className="mt-4 text-sm text-center" style={{ color: '#a0a0a0' }}>
                            {screenshot.caption}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Large screenshots */}
              {section.screenshots.filter(s => s.layout === 'large').map((screenshot, idx) => {
                const imageUrl = screenshot.image.asset.url || urlFor(screenshot.image.asset).url();
                return (
                  <div key={`large-${idx}`} className="max-w-[1100px] mx-auto mb-8">
                    <div className="relative rounded-2xl overflow-hidden" style={{ aspectRatio: '16 / 9', background: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
                      {imageUrl ? (
                        <Image src={imageUrl} alt={screenshot.caption || ''} fill className="object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-center px-8 text-sm" style={{ background: 'linear-gradient(135deg, rgba(199, 128, 245, 0.1), rgba(199, 128, 245, 0.05))', color: '#707070' }}>
                          Large screenshot placeholder
                        </div>
                      )}
                    </div>
                    {screenshot.caption && (
                      <div className="mt-4 text-sm text-center" style={{ color: '#a0a0a0' }}>
                        {screenshot.caption}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </CaseStudySection>
      ))}

      {/* Metrics Section - REFACTORED into component */}
      {project.metrics && project.metrics.length > 0 && (
        <CaseStudyMetrics metrics={project.metrics} />
      )}

      {/* Achievements Section - REFACTORED into component */}
      {project.achievements && project.achievements.length > 0 && (
        <CaseStudyAchievements achievements={project.achievements} />
      )}

      {/* CTA - REFACTORED into component */}
      <CaseStudyCTA />
    </div>
  );
}
