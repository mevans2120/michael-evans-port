'use client'

import { useEffect, useState } from "react";
import Navigation from "@/components/Navigation";
import { CaseStudySlideshow } from "@/components/CaseStudySlideshow";
import {
  CaseStudyHero,
  CaseStudyProblem,
  CaseStudySolution,
  CaseStudyMetrics,
  CaseStudyOutcomes,
  CaseStudyGallery
} from "@/components/CaseStudySections";
import { client } from "@/lib/sanity/client";
import { logger } from "@/lib/logger";

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
    timeline?: string;
  };
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
  overview,
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
        <Navigation />
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
        <Navigation />
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

  // Build slides array
  const slides = [];

  // Slide 1: Hero
  slides.push(
    <CaseStudyHero
      title={project.title}
      subtitle={project.subtitle}
      category={project.category}
      heroImage={project.heroImage?.asset?.url}
      tags={project.technologies}
    />
  );

  // Slide 2: Problem (if exists)
  if (project.overview?.problem) {
    slides.push(
      <CaseStudyProblem
        problem={project.overview.problem}
        context={project.description}
      />
    );
  }

  // Slide 3: Solution (if exists)
  if (project.overview?.solution) {
    slides.push(
      <CaseStudySolution
        solution={project.overview.solution}
        approach={project.description}
      />
    );
  }

  // Slide 4: Metrics (if exists)
  if (project.metrics && project.metrics.length > 0) {
    slides.push(
      <CaseStudyMetrics metrics={project.metrics} />
    );
  }

  // Slide 5: Outcomes (if exists)
  if (project.achievements && project.achievements.length > 0) {
    slides.push(
      <CaseStudyOutcomes
        achievements={project.achievements}
        impact={project.subtitle}
      />
    );
  }

  // Slide 6: Gallery (if exists)
  if (project.images && project.images.length > 0) {
    const galleryImages = project.images.map(img => ({
      url: img.image.asset.url,
      caption: img.caption
    }));
    slides.push(
      <CaseStudyGallery images={galleryImages} />
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Fixed Navigation */}
      <div className="fixed top-0 left-0 right-0 z-50">
        <Navigation />
      </div>

      {/* Slideshow */}
      <CaseStudySlideshow showProgress fullHeight>
        {slides}
      </CaseStudySlideshow>
    </div>
  );
}
