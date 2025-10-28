'use client'

import { useState } from "react";
import { ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";
import Contact from "@/components/Contact";
import { Button } from "@/components/ui/button";
import { AIProjectsGrid } from "@/components/AIProjectsGrid";
import { AIProjectModal } from "@/components/AIProjectModal";
import { useAllAIProjects } from "@/hooks/useAIProject";
import type { AIProjectData } from "@/types/sanity";

export default function AIShowcasePage() {
  const router = useRouter();
  const { data: projects = [], loading, error } = useAllAIProjects();
  const [selectedProject, setSelectedProject] = useState<AIProjectData | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleProjectClick = (project: AIProjectData) => {
    setSelectedProject(project);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setTimeout(() => {
      setSelectedProject(null);
    }, 300);
  };

  return (
    <div className="min-h-screen bg-background">

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
            <div className="mb-16">
              <AIProjectsGrid
                projects={projects}
                onProjectClick={handleProjectClick}
              />
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

      {/* AI Project Modal */}
      <AIProjectModal
        project={selectedProject}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </div>
  );
}