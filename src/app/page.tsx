'use client'

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ArrowRight, Code, Briefcase, User, Sparkles, ExternalLink, X } from 'lucide-react';
import Navigation from "@/components/Navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { AIProjectsGrid } from "@/components/AIProjectsGrid";
import { AIProjectModal } from "@/components/AIProjectModal";
import { client } from "@/lib/sanity/client";
import { heroOptionsQuery } from "@/lib/sanity/queries";
import { transformHeroOptions } from "@/lib/sanity/transforms";
import type { HeroOption, AIProjectData } from "@/types/sanity";
import { logger } from "@/lib/logger";
import { useAllAIProjects } from "@/hooks/useAIProject";

// Fallback hero options if Sanity data fails to load
const FALLBACK_HERO_OPTIONS: HeroOption[] = [
  {
    prefix: 'shipped the first responsive',
    dropdown: 'airline website',
    link: '/case-studies/virgin-america',
    label: 'Virgin America',
    description: 'Revolutionized airline digital experience with the first fully responsive airline website',
    image: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=600&h=400&fit=crop',
    tags: ['UX Design', 'Responsive', 'Innovation'],
    color: 'from-red-500 to-pink-600'
  },
  {
    prefix: 'launched a restaurant with',
    dropdown: 'cliff diving',
    link: '/case-studies/casa-bonita',
    label: 'Casa Bonita',
    description: 'Brought a legendary Colorado restaurant back to life with immersive entertainment',
    image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=600&h=400&fit=crop',
    tags: ['Experience Design', 'Entertainment', 'Revival'],
    color: 'from-amber-500 to-orange-600'
  },
  {
    prefix: 'built production apps with',
    dropdown: 'AI',
    link: '/ai-showcase',
    label: 'AI App Showcase',
    description: 'Collection of production-ready AI applications solving real-world problems',
    image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=600&h=400&fit=crop',
    tags: ['AI/ML', 'Production Apps', 'Innovation'],
    color: 'from-blue-500 to-cyan-600'
  },
  {
    prefix: 'helped thousands',
    dropdown: 'focus',
    link: '/case-studies/before-launcher',
    label: 'Before Launcher',
    description: 'A minimalist Android launcher that helps users reduce phone addiction',
    image: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=600&h=400&fit=crop',
    tags: ['Mobile App', 'Productivity', 'Wellness'],
    color: 'from-green-500 to-emerald-600'
  },
];

export default function HomePage() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [imageLoaded, setImageLoaded] = useState<{ [key: number]: boolean }>({});
  const [sanityHeroOptions, setSanityHeroOptions] = useState<HeroOption[] | null>(null);
  const [isLoadingHeroOptions, setIsLoadingHeroOptions] = useState(true);
  const [selectedProject, setSelectedProject] = useState<AIProjectData | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const router = useRouter();

  // Site is always dark - no light mode
  const isDarkMode = true;

  // Fetch AI projects from Sanity
  const { data: aiProjects, loading: aiProjectsLoading, error: aiProjectsError } = useAllAIProjects();

  // Fetch hero options from Sanity
  useEffect(() => {
    async function fetchHeroOptions() {
      try {
        const data = await client.fetch(heroOptionsQuery);
        if (data && Array.isArray(data) && data.length > 0) {
          const transformed = transformHeroOptions(data);
          setSanityHeroOptions(transformed);
        }
      } catch (error) {
        logger.error('Failed to load hero options from Sanity:', error);
        // Will fall back to FALLBACK_HERO_OPTIONS
      } finally {
        setIsLoadingHeroOptions(false);
      }
    }
    fetchHeroOptions();
  }, []);

  // Use Sanity data if available, otherwise fallback
  const heroOptions = useMemo(() => {
    return sanityHeroOptions || FALLBACK_HERO_OPTIONS;
  }, [sanityHeroOptions]);

  useEffect(() => {
    if (!isOpen) {
      const interval = setInterval(() => {
        setIsTransitioning(true);
        setTimeout(() => {
          setCurrentIndex((prevIndex) => (prevIndex + 1) % heroOptions.length);
          setIsTransitioning(false);
        }, 500);
      }, 3500);

      return () => clearInterval(interval);
    }
  }, [isOpen]);

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const currentOption = heroOptions[currentIndex];

  const handleOptionClick = (index: number) => {
    setCurrentIndex(index);
    setIsOpen(false);
    setTimeout(() => {
      router.push(heroOptions[index].link);
    }, 300);
  };

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

  const capabilities = [
    { skill: "Product Strategy", years: "20" },
    { skill: "UX/UI Design", years: "15" },
    { skill: "Full-Stack Development", years: "10" },
    { skill: "AI/ML Integration", years: "5" },
  ];

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      isDarkMode
        ? 'bg-gradient-to-b from-gray-900 to-gray-950 text-gray-100'
        : 'bg-gradient-to-b from-slate-50 to-white text-gray-900'
    }`}>
      <Navigation />

      {/* Compact Hero Section */}
      <section className="px-6 relative min-h-[85vh] flex items-center">
        {/* Subtle decorative accent */}
        <div className={`absolute top-20 right-10 w-32 h-32 rounded-full blur-3xl ${
          isDarkMode ? 'bg-accent/20' : 'bg-purple-100 opacity-30'
        }`} />
        <div className="container mx-auto max-w-6xl relative z-10">
          <div className="max-w-5xl -mx-6 md:mx-0">
            <h1 className="text-4xl md:text-6xl font-light leading-relaxed h-[20rem] md:h-[16rem] relative">
              {/* Fixed position for "Michael Evans" */}
              <div className="absolute top-[40%] md:top-[35%]">
                <span className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>
                  Michael Evans
                </span>
              </div>

              {/* Changing text positioned below with consistent top offset */}
              <div className="absolute top-[calc(40%+3rem)] md:top-[calc(35%+4rem)]">
                <span className={`transition-opacity duration-500 ${isTransitioning ? 'opacity-0' : 'opacity-100'} ${
                  isDarkMode ? 'text-gray-100' : 'text-gray-900'
                }`}>
                  {currentOption.prefix}
                </span>{' '}
                <button
                  onClick={() => setIsOpen(!isOpen)}
                  className="inline-flex items-baseline gap-1 group"
                >
                  <span className={`underline underline-offset-4 decoration-2 transition-opacity duration-500 ${isTransitioning ? 'opacity-0' : 'opacity-100'} ${
                    isDarkMode ? 'text-accent' : 'text-purple-600'
                  }`}>
                    {currentOption.dropdown}
                  </span>
                </button>
              </div>
            </h1>
          </div>
        </div>
      </section>

      <Separator className={`mx-auto max-w-6xl ${isDarkMode ? 'bg-gray-800' : ''}`} />

      {/* About Section */}
      <section className="py-16 px-6">
        <div className="container mx-auto max-w-6xl">
          <div className="md:max-w-4xl -mx-6 md:mx-0">
            {/* Image and Heading */}
            <div className="flex gap-6 md:gap-8 items-center mb-4">
              {/* Image */}
              <div className="w-40 h-40 md:w-44 md:h-44 flex-shrink-0">
                <div className={`w-full h-full rounded-2xl overflow-hidden border ${
                  isDarkMode ? 'border-gray-800' : 'border-gray-200'
                }`}>
                  <div className="w-full h-full bg-gradient-to-br from-accent/20 to-indigo-500/30 flex items-center justify-center">
                    <span className={`text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>Photo</span>
                  </div>
                </div>
              </div>

              {/* Heading */}
              <div className="flex-1 min-w-0">
                <h2 className={`text-2xl font-light flex items-center gap-3 ${
                  isDarkMode ? 'text-gray-100' : 'text-gray-900'
                }`}>
                  Product Strategist & Creative Technologist
                  <span className={`w-12 h-px bg-gradient-to-r ${
                    isDarkMode ? 'from-accent/50 to-transparent' : 'from-accent to-transparent'
                  }`}></span>
                </h2>
              </div>
            </div>

            {/* Body Text - Full Width */}
            <div>
              <p className={`text-base mb-6 leading-relaxed ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                I help companies design and build products that blend strategic thinking with technical execution. With two decades of experience across product strategy, UX design, and full-stack development, I specialize in translating complex challenges into elegant, AI-powered solutions.
              </p>
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
              <span className={`w-12 h-px bg-gradient-to-r ${
                isDarkMode ? 'from-accent/50 to-transparent' : 'from-accent to-transparent'
              }`}></span>
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
              <span className={`w-12 h-px bg-gradient-to-r ${
                isDarkMode ? 'from-accent/50 to-transparent' : 'from-accent to-transparent'
              }`}></span>
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

      {/* Visual Grid Overlay Modal */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100]"
              onClick={() => setIsOpen(false)}
            />

            {/* Modal Content */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 50 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 50 }}
              transition={{ duration: 0.3, type: "spring", stiffness: 300, damping: 30 }}
              className="fixed inset-x-0 inset-y-0 md:inset-[5%] lg:inset-[10%] z-[101] flex items-center justify-center pointer-events-none"
            >
              <div className={`backdrop-blur-2xl border rounded-3xl shadow-2xl w-full h-full max-w-6xl max-h-[90vh] overflow-hidden pointer-events-auto ${
                isDarkMode ? 'bg-gray-900/95 border-gray-800/50' : 'bg-background/95 border-border/50'
              }`}>
                {/* Header */}
                <div className={`px-6 py-4 border-b flex items-center justify-between ${
                  isDarkMode
                    ? 'border-gray-800/30 bg-gradient-to-r from-accent/5 to-accent/10'
                    : 'border-border/30 bg-gradient-to-r from-accent/5 to-accent/10'
                }`}>
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-yellow-500 animate-pulse" />
                    <span className={`text-lg font-medium ${isDarkMode ? 'text-gray-100' : ''}`}>Choose Your Adventure</span>
                  </div>
                  <button
                    onClick={() => setIsOpen(false)}
                    className={`p-2 rounded-lg transition-colors ${
                      isDarkMode ? 'hover:bg-white/10' : 'hover:bg-white/10'
                    }`}
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Grid of options */}
                <div className="p-6 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 overflow-y-auto max-h-[calc(90vh-80px)]"
                     style={{ scrollbarWidth: 'thin', scrollbarColor: 'rgba(255,255,255,0.2) transparent' }}>
                  {heroOptions.map((option, index) => (
                    <motion.button
                      key={index}
                      onClick={() => handleOptionClick(index)}
                      onMouseEnter={() => setHoveredIndex(index)}
                      onMouseLeave={() => setHoveredIndex(null)}
                      className={`group relative rounded-xl overflow-hidden border transition-all duration-300 ${
                        index === currentIndex
                          ? isDarkMode
                            ? 'border-accent shadow-lg shadow-accent/20 ring-2 ring-accent/20'
                            : 'border-primary shadow-lg shadow-primary/20 ring-2 ring-primary/20'
                          : isDarkMode
                            ? 'border-gray-800/50 hover:border-accent/50'
                            : 'border-border/50 hover:border-accent/50'
                      } ${isDarkMode ? 'bg-gray-800' : 'bg-card'}`}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      whileHover={{ scale: 1.03, y: -4 }}
                      whileTap={{ scale: 0.97 }}
                    >
                      {/* Image container */}
                      <div className={`relative h-40 overflow-hidden ${
                        isDarkMode ? 'bg-gradient-to-br from-accent/10 to-accent/5' : 'bg-gradient-to-br from-accent/10 to-accent/5'
                      }`}>
                        {!imageLoaded[index] && (
                          <div className={`absolute inset-0 animate-pulse ${
                            isDarkMode ? 'bg-gradient-to-br from-accent/20 to-accent/10' : 'bg-gradient-to-br from-accent/20 to-accent/10'
                          }`} />
                        )}
                        <img
                          src={option.image}
                          alt={option.label}
                          className={`w-full h-full object-cover transition-all duration-700 ${
                            hoveredIndex === index ? 'scale-110' : 'scale-100'
                          } ${imageLoaded[index] ? 'opacity-100' : 'opacity-0'}`}
                          onLoad={() => setImageLoaded(prev => ({ ...prev, [index]: true }))}
                        />
                        <div className={`absolute inset-0 bg-gradient-to-t transition-opacity duration-300 ${
                          isDarkMode
                            ? 'from-gray-900 via-gray-900/80 to-transparent'
                            : 'from-background via-background/80 to-transparent'
                        } ${hoveredIndex === index ? 'opacity-100' : 'opacity-90'}`} />

                        {/* Overlay content */}
                        <div className="absolute bottom-0 left-0 right-0 p-4">
                          <h3 className={`text-lg font-semibold text-white mb-2 transition-all duration-300 ${
                            hoveredIndex === index ? 'translate-y-0' : 'translate-y-1'
                          }`}>
                            {option.label}
                          </h3>

                          {/* Full sentence with Michael Evans */}
                          <p className={`text-xs text-white/90 font-medium line-clamp-2 transition-all duration-300 ${
                            hoveredIndex === index ? 'opacity-100 translate-y-0' : 'opacity-80 translate-y-1'
                          }`}>
                            Michael Evans <span className="text-purple-300">{option.prefix} {option.dropdown}</span>
                          </p>
                        </div>

                        {/* Current indicator */}
                        {index === currentIndex && (
                          <motion.div
                            className="absolute top-3 right-3"
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: "spring", stiffness: 500, damping: 30 }}
                          >
                            <span className={`px-2 py-1 text-xs font-bold rounded-full shadow-lg flex items-center gap-1 ${
                              isDarkMode ? 'bg-accent text-white' : 'bg-primary text-primary-foreground'
                            }`}>
                              <span className="w-2 h-2 bg-white rounded-full animate-pulse" />
                              Active
                            </span>
                          </motion.div>
                        )}

                        {/* Hover arrow */}
                        <motion.div
                          className="absolute top-3 left-3 opacity-0 group-hover:opacity-100"
                          initial={false}
                          animate={{ x: hoveredIndex === index ? 0 : -10 }}
                          transition={{ duration: 0.2 }}
                        >
                          <ArrowRight className="w-5 h-5 text-white drop-shadow-lg" />
                        </motion.div>
                      </div>

                      {/* Tags */}
                      <div className={`p-3 ${isDarkMode ? 'bg-gray-900/50' : 'bg-background/50'}`}>
                        <div className="flex flex-wrap gap-1">
                          {option.tags.map((tag, tagIndex) => (
                            <span
                              key={tagIndex}
                              className={`px-2 py-0.5 text-[10px] font-medium rounded-full ${
                                isDarkMode
                                  ? 'bg-accent/20 text-purple-300'
                                  : 'bg-accent/20 text-accent-foreground'
                              }`}
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    </motion.button>
                  ))}
                </div>

                {/* Footer hint */}
                <div className={`px-6 py-3 border-t ${
                  isDarkMode
                    ? 'border-gray-800/30 bg-gradient-to-r from-accent/5 to-accent/10'
                    : 'border-border/30 bg-gradient-to-r from-accent/5 to-accent/10'
                }`}>
                  <p className={`text-xs text-center ${isDarkMode ? 'text-gray-400' : 'text-muted-foreground'}`}>
                    Click any option to navigate • Press ESC to close
                  </p>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}