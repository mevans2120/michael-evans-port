import { notFound } from 'next/navigation';
import { client } from "@/lib/sanity/client";
import { PortableText } from '@portabletext/react';
import { urlFor } from '@/lib/sanity/client';
import Image from 'next/image';
import { Metadata } from 'next';

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

// Portable Text components for rich text rendering
const portableTextComponents = {
  marks: {
    strong: ({ children }: any) => (
      <strong style={{ color: 'hsl(280, 100%, 80%)' }}>{children}</strong>
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

      {/* Hero Section */}
      <section className="hero relative min-h-screen flex items-center justify-center text-center px-8 py-32">
        <div className="relative z-10 max-w-5xl mx-auto">
          {/* Category Badge */}
          {project.category && (
            <div
              className="inline-block px-6 py-2 mb-8 rounded-full text-xs font-semibold uppercase tracking-[0.1em]"
              style={{
                background: 'rgba(199, 128, 245, 0.1)',
                border: '1px solid rgba(199, 128, 245, 0.3)',
                color: 'hsl(280, 100%, 80%)',
              }}
            >
              {project.category}
            </div>
          )}

          {/* Hero Title with Gradient */}
          <h1
            className="font-semibold mb-8"
            style={{
              fontSize: 'clamp(3rem, 8vw, 5rem)',
              lineHeight: '1.1',
              background: 'linear-gradient(135deg, hsl(280, 100%, 80%), hsl(0, 0%, 98%))',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            {project.title}
          </h1>

          {/* Hero Subtitle */}
          {project.subtitle && (
            <p
              className="font-light leading-relaxed max-w-3xl mx-auto mb-8"
              style={{
                fontSize: 'clamp(1.25rem, 3vw, 1.75rem)',
                color: '#a0a0a0',
              }}
            >
              {project.subtitle}
            </p>
          )}

          {/* Tech Tags */}
          {project.technologies && project.technologies.length > 0 && (
            <div className="flex flex-wrap gap-4 justify-center mt-12">
              {project.technologies.map((tech) => (
                <span
                  key={tech}
                  className="px-6 py-3 rounded-xl text-sm"
                  style={{
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                  }}
                >
                  {tech}
                </span>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Dynamic Sections */}
      {project.sections?.map((section, index) => {
        const bgStyle = index % 2 === 0 ? {} : { background: 'rgba(199, 128, 245, 0.03)' };

        return (
          <section key={section._key} className="relative py-32 z-10" style={bgStyle}>
            <div className="container max-w-[1200px] mx-auto px-8">
              {section.sectionLabel && (
                <div className="text-xs font-bold uppercase mb-8" style={{ letterSpacing: '0.15em', color: 'hsl(280, 100%, 80%)' }}>
                  {section.sectionLabel}
                </div>
              )}

              <h2 className="font-light mb-8 relative pb-4" style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', lineHeight: '1.3' }}>
                {section.heading}
                <span className="absolute bottom-0 left-0 w-16 h-px" style={{ background: 'linear-gradient(to right, hsl(280, 100%, 80%), transparent)' }} />
              </h2>

              {section.content && (
                <div className="prose prose-invert max-w-[900px]">
                  <PortableText
                    value={section.content}
                    components={portableTextComponents}
                  />
                </div>
              )}

              {/* Annotation */}
              {section.annotation && section.annotation.content && (
                <div className="mt-16 p-8 rounded-lg text-[0.95rem] leading-[1.6] italic" style={{ background: 'rgba(199, 128, 245, 0.05)', borderLeft: '3px solid hsl(280, 100%, 80%)', color: '#c0c0c0' }}>
                  {section.annotation.title && (
                    <strong className="not-italic" style={{ color: 'hsl(280, 100%, 80%)' }}>
                      {section.annotation.title}:
                    </strong>
                  )}{' '}
                  {section.annotation.content}
                </div>
              )}

              {/* Screenshots */}
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
            </div>
          </section>
        );
      })}

      {/* Metrics Section */}
      {project.metrics && project.metrics.length > 0 && (
        <section className="relative py-32 z-10" style={{ background: 'rgba(199, 128, 245, 0.03)' }}>
          <div className="container max-w-[1200px] mx-auto px-8">
            <div className="text-xs font-bold uppercase mb-8" style={{ letterSpacing: '0.15em', color: 'hsl(280, 100%, 80%)' }}>
              Key Metrics
            </div>

            <h2 className="font-light mb-8 relative pb-4" style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', lineHeight: '1.3' }}>
              Quantifiable Impact
              <span className="absolute bottom-0 left-0 w-16 h-px" style={{ background: 'linear-gradient(to right, hsl(280, 100%, 80%), transparent)' }} />
            </h2>

            <div className="grid gap-8 mt-16" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))' }}>
              {project.metrics.map((metric, index) => (
                <div key={index} className="rounded-3xl px-8 py-12 text-center" style={{ background: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
                  <div className="font-bold mb-4 leading-none" style={{ fontSize: '3.5rem', background: 'linear-gradient(135deg, hsl(276, 100%, 75%), hsl(280, 100%, 80%))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                    {metric.value}
                  </div>
                  <div className="text-lg font-medium mb-2">
                    {metric.label}
                  </div>
                  {metric.description && (
                    <div className="text-sm" style={{ color: '#a0a0a0' }}>
                      {metric.description}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Achievements Section */}
      {project.achievements && project.achievements.length > 0 && (
        <section className="relative py-32 z-10">
          <div className="container max-w-[1200px] mx-auto px-8">
            <div className="text-xs font-bold uppercase mb-8" style={{ letterSpacing: '0.15em', color: 'hsl(280, 100%, 80%)' }}>
              Outcomes & Impact
            </div>

            <h2 className="font-light mb-8 relative pb-4" style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', lineHeight: '1.3' }}>
              Industry-Defining Success
              <span className="absolute bottom-0 left-0 w-16 h-px" style={{ background: 'linear-gradient(to right, hsl(280, 100%, 80%), transparent)' }} />
            </h2>

            <div className="mt-12 max-w-[900px]">
              {project.achievements.map((achievement, index) => (
                <div key={index} className="mb-7 pl-8 relative">
                  <span className="absolute rounded-full" style={{ left: 0, top: '0.6rem', width: '6px', height: '6px', background: 'hsl(280, 100%, 80%)' }} />
                  <div className="leading-[1.7]" style={{ fontSize: '1.25rem', color: '#fafafa' }}>
                    {achievement}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <div className="container max-w-[1200px] mx-auto px-8 pb-32">
        <div className="text-center pt-20 border-t border-white/10">
          <a
            href="/case-studies"
            className="inline-block px-12 py-5 bg-gradient-to-r from-purple-600 to-purple-400 text-white font-semibold rounded-lg text-lg transition-all duration-300 hover:-translate-y-1"
          >
            View More Case Studies
          </a>
        </div>
      </div>
    </div>
  );
}
