'use client'

import { ArrowRight, ExternalLink } from "lucide-react";
import { useRouter } from "next/navigation";
import Navigation from "@/components/Navigation";
import Contact from "@/components/Contact";
import { Button } from "@/components/ui/button";
import { useAllAIProjects } from "@/hooks/useAIProject";

export default function AIShowcasePage() {
  const router = useRouter();
  const { data: projects = [], loading, error } = useAllAIProjects();

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <main id="main-content" role="main" className="pt-20 pb-12 px-6">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center mb-16 animate-fade-in">
            <h1 className="text-6xl md:text-7xl font-light text-foreground mb-8">
              AI App Showcase
            </h1>
            <p className="text-2xl text-muted-foreground font-light max-w-4xl mx-auto leading-relaxed">
              A collection of production applications and prototypes built using AI tools.
              Each project demonstrates different approaches to AI-assisted development.
            </p>
          </div>

          {loading && (
            <div className="flex items-center justify-center h-64">
              <p className="text-muted-foreground">Loading projects...</p>
            </div>
          )}

          {error && (
            <div className="bg-destructive/10 border border-destructive rounded-lg p-6 mb-8">
              <p className="text-destructive">Error loading projects: {error}</p>
            </div>
          )}

          {!loading && !error && projects.length === 0 && (
            <div className="text-center py-16">
              <p className="text-muted-foreground">No AI projects found.</p>
            </div>
          )}

          {!loading && !error && projects.length > 0 && (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
              {projects.map((project, index) => (
                <div
                  key={project.slug}
                  className="bg-card border border-border rounded-lg overflow-hidden hover:shadow-elegant transition-all duration-300 animate-slide-up"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  {project.heroImage && (
                    <div className="aspect-video bg-secondary/20 overflow-hidden">
                      <img
                        src={project.heroImage}
                        alt={project.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  {!project.heroImage && (
                    <div className="aspect-video bg-secondary/20 flex items-center justify-center">
                      <div className="text-muted-foreground text-sm">Project Preview</div>
                    </div>
                  )}

                  <div className="p-6">
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="text-xl font-medium text-foreground">{project.title}</h3>
                      <span
                        className={`text-xs px-2 py-1 rounded-full ${
                          project.status === 'Live'
                            ? 'bg-green-500/20 text-green-300'
                            : project.status === 'In Progress'
                            ? 'bg-blue-500/20 text-blue-300'
                            : 'bg-yellow-500/20 text-yellow-300'
                        }`}
                      >
                        {project.status}
                      </span>
                    </div>

                    <p className="text-muted-foreground mb-4 leading-relaxed">
                      {project.description}
                    </p>

                    {project.status !== 'Coming Soon' && project.links?.live && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full group"
                        onClick={() => window.open(project.links.live, '_blank')}
                      >
                        View Project
                        <ExternalLink className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="text-center">
            <Button
              variant="outline"
              size="lg"
              className="group"
              onClick={() => router.back()}
            >
              <ArrowRight className="w-5 h-5 mr-2 rotate-180" />
              Back to Home
            </Button>
          </div>
        </div>
      </main>

      <Contact />
    </div>
  );
}