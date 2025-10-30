'use client'

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Separator } from "@/components/ui/separator";
import { AIProjectsGrid } from "@/components/AIProjectsGrid";
import { AIProjectModal } from "@/components/AIProjectModal";
import { FeaturedCaseStudies } from "@/components/FeaturedCaseStudies";
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

  // Fetch featured case studies from Sanity
  const [featuredCaseStudies, setFeaturedCaseStudies] = useState<any[]>([]);
  useEffect(() => {
    async function fetchFeaturedCaseStudies() {
      try {
        const data = await client.fetch(`
          *[_type == "project" && featured == true] | order(order asc) {
            _id,
            title,
            "slug": slug.current,
            featuredCategory,
            featuredMetric,
            featuredDescription,
            order
          }
        `);

        if (data && data.length > 0) {
          // Map Sanity data to component format
          const mapped = data.map((project: any, index: number) => ({
            id: project._id,
            number: String(index + 1).padStart(2, '0'),
            category: project.featuredCategory || 'Case Study',
            title: project.title,
            metric: project.featuredMetric || '',
            description: project.featuredDescription || '',
            slug: project.slug,
            order: project.order || index + 1
          }));
          setFeaturedCaseStudies(mapped);
        }
      } catch (error) {
        logger.error('Failed to load featured case studies from Sanity:', error);
        // Fall back to hardcoded data if Sanity fails
        setFeaturedCaseStudies(defaultFeaturedCaseStudies);
      }
    }
    fetchFeaturedCaseStudies();
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

  // Default fallback data if Sanity is unavailable
  const defaultFeaturedCaseStudies = [
    {
      id: "virgin-america",
      number: "01",
      category: "UX Design",
      title: "Virgin America",
      metric: "15% conversion lift",
      description: "Created the first responsive airline website, reimagining booking flows by focusing on decisions rather than clicks — achieving industry recognition and measurable business impact.",
      slug: "virgin-america",
      order: 1
    },
    {
      id: "casa-bonita",
      number: "02",
      category: "Experience Design",
      title: "Casa Bonita",
      metric: "Cultural icon revival",
      description: "Revived a beloved Colorado landmark by reimagining the customer experience, balancing nostalgia with modern hospitality design — from reservation flows to in-venue wayfinding.",
      slug: "casa-bonita",
      order: 2
    },
    {
      id: "before-launcher",
      number: "03",
      category: "Mobile Product",
      title: "Before Launcher",
      metric: "100K+ users",
      description: "Built a minimalist Android launcher focused on intentionality over distraction, reducing phone time through thoughtful UX and becoming a finalist for App of the Year.",
      slug: "before-launcher",
      order: 3
    }
  ];


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
          <div className="mb-20 -mx-6 md:mx-0">
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