'use client'

import { useEffect, useState } from "react";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import Navigation from "@/components/Navigation";
import { client } from "@/lib/sanity/client";
import { logger } from "@/lib/logger";

interface CaseStudyData {
  title: string;
  subtitle: string;
  description: string;
  category: string;
  metrics: {
    label: string;
    value: string;
  }[];
  achievements: string[];
}

const PROJECT_QUERY = `*[_type == "project" && slug.current == $slug][0] {
  title,
  "subtitle": summary,
  description,
  category,
  metrics[] {
    label,
    value
  },
  achievements
}`;

interface PageProps {
  params: {
    slug: string;
  };
}

export default function CaseStudyPage({ params }: PageProps) {
  const { slug } = params;
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

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <main id="main-content" role="main" className="pt-32 pb-12 px-6">
        <div className="container mx-auto max-w-4xl">
          <div className="mb-8">
            <Link href="/" className="text-muted-foreground hover:text-foreground transition-colors">
              ← Back to Portfolio
            </Link>
          </div>

          <div className="animate-fade-in">
            <h1 className="text-4xl md:text-5xl font-light mb-4 text-foreground">
              {project.title}
            </h1>
            <p className="text-xl text-muted-foreground font-light mb-8">
              {project.subtitle}
            </p>

            <div className="bg-secondary/30 rounded-2xl p-8 mb-8">
              <h2 className="text-2xl font-medium mb-4">Project Overview</h2>
              <p className="text-muted-foreground leading-relaxed mb-6">
                {project.description}
              </p>

              {project.metrics && project.metrics.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                  {project.metrics.map((metric, index) => (
                    <div key={index}>
                      <h3 className="font-medium text-foreground mb-2">{metric.label}</h3>
                      <p className="text-2xl font-light text-primary">{metric.value}</p>
                    </div>
                  ))}
                </div>
              )}

              {project.achievements && project.achievements.length > 0 && (
                <>
                  <h3 className="font-medium text-foreground mb-4">Key Achievements</h3>
                  <ul className="text-muted-foreground space-y-2">
                    {project.achievements.map((achievement, index) => (
                      <li key={index}>• {achievement}</li>
                    ))}
                  </ul>
                </>
              )}
            </div>

            <div className="text-center">
              <Link
                href="/"
                className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-medium"
              >
                View More Projects
                <ArrowRight size={18} />
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
