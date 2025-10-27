'use client'

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { AIProjectsGrid } from "@/components/AIProjectsGrid";
import { AIProjectModal } from "@/components/AIProjectModal";
import { client } from "@/lib/sanity/client";
import type { AIProjectData } from "@/types/sanity";
import { logger } from "@/lib/logger";
import { useAllAIProjects } from "@/hooks/useAIProject";

export default function HomePage() {
  const [selectedProject, setSelectedProject] = useState<AIProjectData | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [tagline, setTagline] = useState<string>('Building products at the intersection of user empathy, technical possibility, and business value');

  // Site is always dark - no light mode
  const isDarkMode = true;

  // Fetch AI projects from Sanity
  const { data: aiProjects, loading: aiProjectsLoading, error: aiProjectsError } = useAllAIProjects();

  // Fetch profile data from Sanity
  useEffect(() => {
    async function fetchProfileData() {
      try {
        const data = await client.fetch(`*[_type == "profile"] | order(_updatedAt desc)[0] {
          "profileImage": profileImage.asset->url,
          tagline
        }`);
        if (data?.profileImage) {
          setProfileImage(data.profileImage);
        }
        if (data?.tagline) {
          setTagline(data.tagline);
        }
      } catch (error) {
        logger.error('Failed to load profile data from Sanity:', error);
      }
    }
    fetchProfileData();
  }, []);

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

  const caseStudies = [
    {
      title: "Virgin America",
      description: "First responsive airline website",
      metric: "15% conversion lift",
      link: "/case-studies/virgin-america",
      tag: "UX Design"
    },
    {
      title: "Casa Bonita",
      description: "Restaurant with immersive entertainment",
      metric: "Cultural icon revival",
      link: "/case-studies/casa-bonita",
      tag: "Experience"
    },
    {
      title: "Before Launcher",
      description: "Minimalist Android launcher",
      metric: "100K+ users",
      link: "/case-studies/before-launcher",
      tag: "Mobile"
    },
  ];


  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      isDarkMode
        ? 'bg-gradient-to-b from-gray-900 to-gray-950 text-gray-100'
        : 'bg-gradient-to-b from-slate-50 to-white text-gray-900'
    }`}>
      {/* Logo Header */}
      <nav className="fixed top-0 left-0 right-0 z-40 bg-transparent pointer-events-none">
        <div className="container mx-auto px-6 py-4">
          <Link href="/" className="text-lg font-medium text-foreground inline-block pointer-events-auto">
            M<span className="text-gradient">Evans</span>
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="px-6 relative min-h-[85vh] flex items-center pt-20">
        <div className="container mx-auto max-w-6xl">
          <div className="max-w-5xl -mx-6 md:mx-0">
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
        </div>
      </section>

      <Separator className={`mx-auto max-w-6xl ${isDarkMode ? 'bg-gray-800' : ''}`} />

      {/* Featured Work Section */}
      <section className="py-20 px-6 relative">
        <div className={`absolute left-1/4 top-1/2 w-40 h-40 rounded-full blur-3xl ${
          isDarkMode ? 'bg-accent/20' : 'bg-purple-100 opacity-20'
        }`} />
        <div className="container mx-auto max-w-6xl relative z-10">
          <div className="mb-12 -mx-6 md:mx-0">
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

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 -mx-6 md:mx-0">
            {caseStudies.map((study, index) => (
              <Link
                key={index}
                href={study.link}
                className="group block"
              >
                <Card className={`transition-all duration-300 backdrop-blur-sm ${
                  isDarkMode
                    ? 'border-gray-800 hover:border-accent/50 bg-gray-900/60 hover:shadow-accent/10 hover:shadow-lg'
                    : 'border-gray-200 hover:border-purple-300 hover:shadow-lg bg-white/80'
                }`}>
                  <CardHeader className="pb-4">
                    <Badge variant="outline" className={`w-fit mb-3 text-xs ${
                      isDarkMode
                        ? 'border-accent/50 text-accent bg-accent/10'
                        : 'border-purple-200 text-purple-700 bg-purple-50'
                    }`}>
                      {study.tag}
                    </Badge>
                    <CardTitle className={`text-lg font-normal transition-colors ${
                      isDarkMode
                        ? 'text-gray-100 group-hover:text-accent'
                        : 'text-gray-900 group-hover:text-purple-600'
                    }`}>
                      {study.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className={`text-sm mb-4 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      {study.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className={`text-sm font-medium ${isDarkMode ? 'text-gray-200' : 'text-gray-900'}`}>
                        {study.metric}
                      </span>
                      <ArrowRight className={`w-4 h-4 transition-colors ${
                        isDarkMode
                          ? 'text-gray-600 group-hover:text-accent'
                          : 'text-gray-400 group-hover:text-purple-600'
                      }`} />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* AI Projects Section */}
      <section className="py-20 px-6 relative">
        <div className={`absolute right-1/4 top-1/2 w-40 h-40 rounded-full blur-3xl ${
          isDarkMode ? 'bg-accent/20' : 'bg-purple-100 opacity-20'
        }`} />
        <div className="container mx-auto max-w-6xl relative z-10">
          <div className="mb-12 -mx-6 md:mx-0">
            <h2 className={`text-2xl font-light mb-2 flex items-center gap-3 ${
              isDarkMode ? 'text-gray-100' : 'text-gray-900'
            }`}>
              AI Projects
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
            <p className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>Production-ready AI applications</p>
          </div>

          {aiProjectsLoading ? (
            <div className={`text-center py-12 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Loading AI projects...
            </div>
          ) : aiProjectsError ? (
            <div className={`text-center py-12 ${isDarkMode ? 'text-red-400' : 'text-red-600'}`}>
              Error loading projects: {aiProjectsError}
            </div>
          ) : aiProjects.length > 0 ? (
            <div className="-mx-6 md:mx-0">
              <AIProjectsGrid
                projects={aiProjects}
                onProjectClick={handleProjectClick}
                limit={6}
              />
            </div>
          ) : (
            <div className={`text-center py-12 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              No AI projects found
            </div>
          )}

          {aiProjects.length > 6 && (
            <div className="mt-10 text-center">
              <Link
                href="/ai-showcase"
                className={`inline-flex items-center gap-2 text-sm font-medium transition-colors ${
                  isDarkMode
                    ? 'text-accent hover:text-purple-300'
                    : 'text-purple-600 hover:text-purple-700'
                }`}
              >
                View all AI projects
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* AI Project Modal */}
      <AIProjectModal
        project={selectedProject}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </div>
  );
}