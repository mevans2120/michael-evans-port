'use client'
import Link from "next/link";
import { ArrowRight, ExternalLink, Github } from "lucide-react";
import Navigation from "@/components/Navigation";
import { useAIProject } from "@/hooks/useAIProject";

export default function DepartmentOfArtPage() {
  const { data: project, loading, error } = useAIProject('department-of-art');

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
              <Link href="/" className="text-muted-foreground hover:text-foreground transition-colors">
                ← Back to Portfolio
              </Link>
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
            {/* Coming Soon Badge */}
            <div className="inline-block px-4 py-2 bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 rounded-lg mb-4 font-medium text-sm">
              Coming Soon
            </div>

            <h1 className="text-4xl md:text-5xl font-light mb-4 text-foreground">
              {project.title}
            </h1>
            <p className="text-xl text-muted-foreground font-light mb-8">
              {project.subtitle}
            </p>

            {/* Links */}
            {(project.links.live || project.links.github) && (
              <div className="flex gap-4 mb-8">
                {project.links.live && (
                  <a
                    href={project.links.live}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 border border-border rounded-lg hover:bg-secondary transition-colors"
                  >
                    <ExternalLink size={16} />
                    Visit Live Site
                  </a>
                )}
                {project.links.github && (
                  <a
                    href={project.links.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 border border-border rounded-lg hover:bg-secondary transition-colors"
                  >
                    <Github size={16} />
                    View on GitHub
                  </a>
                )}
              </div>
            )}

            {/* Project Overview */}
            <div className="bg-secondary/30 rounded-2xl p-8 mb-8">
              <h2 className="text-2xl font-medium mb-4">Project Overview</h2>

              <div className="space-y-4 mb-6">
                <div>
                  <h3 className="font-medium text-foreground mb-2">Problem</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {project.overview.problem}
                  </p>
                </div>
                <div>
                  <h3 className="font-medium text-foreground mb-2">Solution</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {project.overview.solution}
                  </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
                  <div>
                    <h3 className="font-medium text-foreground mb-2">Role</h3>
                    <p className="text-muted-foreground">{project.overview.role}</p>
                  </div>
                  <div>
                    <h3 className="font-medium text-foreground mb-2">Timeline</h3>
                    <p className="text-muted-foreground">{project.overview.timeline}</p>
                  </div>
                </div>
              </div>

              {/* Metrics */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-6">
                {project.metrics.map((metric, index) => (
                  <div key={index}>
                    <h3 className="font-medium text-foreground mb-2">{metric.label}</h3>
                    <p className="text-2xl font-light text-primary">{metric.value}</p>
                  </div>
                ))}
              </div>

              {/* Target Achievements */}
              <h3 className="font-medium text-foreground mb-4">Target Achievements</h3>
              <ul className="text-muted-foreground space-y-2">
                {project.achievements.map((achievement, index) => (
                  <li key={index}>• {achievement}</li>
                ))}
              </ul>
            </div>

            {/* Technical Architecture */}
            <div className="bg-secondary/30 rounded-2xl p-8 mb-8">
              <h2 className="text-2xl font-medium mb-4">Planned Technical Architecture</h2>

              <div className="mb-6">
                <h3 className="font-medium text-foreground mb-3">Tech Stack</h3>
                <div className="flex flex-wrap gap-2">
                  {project.techStack.map((tech, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-primary/10 text-primary rounded-lg text-sm font-medium"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="font-medium text-foreground mb-4">AI Components (Planned)</h3>
                <div className="space-y-4">
                  {project.aiComponents.map((component, index) => (
                    <div key={index} className="border-l-2 border-primary/30 pl-4">
                      <h4 className="font-medium text-foreground mb-1">{component.name}</h4>
                      <p className="text-muted-foreground text-sm mb-2">
                        {component.description}
                      </p>
                      <p className="text-xs text-muted-foreground/70">
                        Technology: {component.technology}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Development Process */}
            <div className="bg-secondary/30 rounded-2xl p-8 mb-8">
              <h2 className="text-2xl font-medium mb-4">Planned Development Process</h2>

              <div className="space-y-6">
                {project.developmentProcess.map((phase, index) => (
                  <div key={index}>
                    <h3 className="font-medium text-foreground mb-2">{phase.phase}</h3>
                    <p className="text-muted-foreground mb-3">
                      {phase.description}
                    </p>
                    <ul className="text-muted-foreground text-sm space-y-1 pl-4">
                      {phase.outcomes.map((outcome, outcomeIndex) => (
                        <li key={outcomeIndex}>• {outcome}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>

            {/* Expected Learnings */}
            <div className="bg-secondary/30 rounded-2xl p-8 mb-8">
              <h2 className="text-2xl font-medium mb-4">Expected Learnings</h2>
              <ul className="text-muted-foreground space-y-3">
                {project.learnings.map((learning, index) => (
                  <li key={index} className="leading-relaxed">• {learning}</li>
                ))}
              </ul>
            </div>

            {/* CTA */}
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
};


