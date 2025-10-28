'use client'

import { useEffect, useState } from "react";
import { CaseStudyNarrative } from "@/components/CaseStudyNarrative";
import { client } from "@/lib/sanity/client";
import { logger } from "@/lib/logger";

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

interface Section {
  _key: string;
  sectionLabel?: string;
  heading: string;
  content: any; // Portable Text content
  screenshots?: Screenshot[];
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
  images?: {
    image: {
      asset: {
        url: string;
      };
    };
    caption?: string;
  }[];
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
    }
  },
  images[] {
    image {
      asset-> {
        url
      }
    },
    caption
  }
}`;

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default function CaseStudyPage({ params }: PageProps) {
  const [slug, setSlug] = useState<string>('');

  useEffect(() => {
    params.then(p => setSlug(p.slug));
  }, [params]);
  const [project, setProject] = useState<CaseStudyData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchProject() {
      if (!slug) {
        setError('No project slug provided');
        setLoading(false);
        return;
      }

      try {
        logger.log(`📡 Fetching case study: ${slug}`);
        const data = await client.fetch(PROJECT_QUERY, { slug });

        if (!data) {
          setError(`Project "${slug}" not found`);
        } else {
          setProject(data);
          logger.log(`✅ Successfully loaded ${slug}`);
        }
      } catch (err) {
        logger.error('Error fetching project:', err);
        setError(err instanceof Error ? err.message : 'Failed to load project');
      } finally {
        setLoading(false);
      }
    }

    fetchProject();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <main className="pt-32 pb-12 px-6">
          <div className="container mx-auto max-w-4xl">
            <div className="flex items-center justify-center h-64">
              <p className="text-muted-foreground">Loading project...</p>
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="min-h-screen bg-background">
        <main className="pt-32 pb-12 px-6">
          <div className="container mx-auto max-w-4xl">
            <div className="mb-8">
              <a href="/" className="text-muted-foreground hover:text-foreground transition-colors">
                ← Back to Portfolio
              </a>
            </div>
            <div className="bg-destructive/10 border border-destructive rounded-lg p-6">
              <p className="text-destructive">{error || 'Project not found'}</p>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <CaseStudyNarrative
      title={project.title}
      subtitle={project.subtitle}
      category={project.category}
      heroImage={project.heroImage?.asset?.url}
      metrics={project.metrics}
      achievements={project.achievements}
      overview={project.overview}
      sections={project.sections}
      technologies={project.technologies}
    />
  );
}
