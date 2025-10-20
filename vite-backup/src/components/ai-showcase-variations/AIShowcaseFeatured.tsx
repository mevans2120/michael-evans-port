import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ExternalLink, Sparkles, ArrowRight, Clock, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface AIProject {
  title: string;
  description: string;
  link: string;
  status: 'Live' | 'In Progress' | 'Coming Soon';
}

interface AIShowcaseFeaturedProps {
  isDarkMode: boolean;
}

const aiProjects: AIProject[] = [
  {
    title: "Post Pal",
    description: "An AI-powered social media content assistant that helps create, schedule, and optimize posts across multiple platforms with intelligent suggestions and analytics.",
    link: "https://postpal.app",
    status: "Live"
  },
  {
    title: "Karuna's Website",
    description: "Karuna is a shaman who offers spiritual healing. Karuna wanted a site that was clean, and modern but was still mystical and unique.",
    link: "https://www.karunagatton.com/",
    status: "Live"
  },
  {
    title: "AI Research Agent",
    description: "An in-progress agentic app that scrapes sites and pursues multiple questions while performing research, filtering results for relevance.",
    link: "https://research-agent-sable.vercel.app/",
    status: "In Progress"
  },
  {
    title: "Department of Art",
    description: "A new project for DOA (the Department of Art production company) based in Portland. The goal is to see how quickly I can build an effective and excellent website for them using AI.",
    link: "#",
    status: "Coming Soon"
  }
];

/**
 * AIShowcaseFeatured - Variation 3
 *
 * An asymmetric grid layout with one large featured project and smaller tiles.
 * Features smooth project switching, hover effects, and dynamic transitions.
 * Creates visual hierarchy and draws attention to the featured work.
 */
const AIShowcaseFeatured: React.FC<AIShowcaseFeaturedProps> = ({ isDarkMode }) => {
  const [featuredIndex, setFeaturedIndex] = useState(0);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const featuredProject = aiProjects[featuredIndex];
  const otherProjects = aiProjects.filter((_, index) => index !== featuredIndex);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Live':
        return isDarkMode
          ? 'bg-green-500/20 text-green-400 border-green-500/30'
          : 'bg-green-100 text-green-700 border-green-300';
      case 'In Progress':
        return isDarkMode
          ? 'bg-blue-500/20 text-blue-400 border-blue-500/30'
          : 'bg-blue-100 text-blue-700 border-blue-300';
      default:
        return isDarkMode
          ? 'bg-purple-500/20 text-purple-400 border-purple-500/30'
          : 'bg-purple-100 text-purple-700 border-purple-300';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Live':
        return <CheckCircle2 className="w-4 h-4" />;
      case 'In Progress':
        return <Clock className="w-4 h-4" />;
      default:
        return <Sparkles className="w-4 h-4" />;
    }
  };

  return (
    <section className="py-20 px-6 relative">
      {/* Background decoration */}
      <div className={`absolute right-1/4 top-1/4 w-96 h-96 rounded-full blur-3xl ${
        isDarkMode ? 'bg-indigo-500/10' : 'bg-indigo-100 opacity-20'
      }`} />

      <div className="container mx-auto max-w-6xl relative z-10">
        {/* Section Header */}
        <div className="mb-12 -mx-6 md:mx-0">
          <div className="flex items-center gap-3 mb-2">
            <Sparkles className={`w-6 h-6 ${isDarkMode ? 'text-indigo-400' : 'text-indigo-600'}`} />
            <h2 className={`text-2xl font-light ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}>
              AI-Powered Projects
            </h2>
            <span className={`w-12 h-px bg-gradient-to-r ${
              isDarkMode ? 'from-indigo-400/50 to-transparent' : 'from-indigo-400 to-transparent'
            }`} />
          </div>
          <p className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>
            Production apps and experiments built with AI assistance
          </p>
        </div>

        {/* Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 -mx-6 md:mx-0">
          {/* Featured Project - Takes up 2 columns and 2 rows on large screens */}
          <AnimatePresence mode="wait">
            <motion.div
              key={featuredIndex}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3 }}
              className="lg:col-span-2 lg:row-span-2"
            >
              <div className={`h-full backdrop-blur-sm rounded-2xl border overflow-hidden transition-all ${
                isDarkMode
                  ? 'bg-gray-900/60 border-indigo-500/30 hover:border-indigo-500/50'
                  : 'bg-white/80 border-indigo-200 hover:border-indigo-300'
              }`}>
                {/* Featured Content */}
                <div className="p-8 h-full flex flex-col">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-6">
                    <Badge
                      variant="outline"
                      className={`text-sm px-4 py-1.5 border ${getStatusColor(featuredProject.status)}`}
                    >
                      <span className="flex items-center gap-2">
                        {getStatusIcon(featuredProject.status)}
                        {featuredProject.status}
                      </span>
                    </Badge>
                    <span className={`text-xs px-3 py-1 rounded-full ${
                      isDarkMode
                        ? 'bg-indigo-500/20 text-indigo-400'
                        : 'bg-indigo-100 text-indigo-700'
                    }`}>
                      Featured
                    </span>
                  </div>

                  {/* Title and Description */}
                  <div className="flex-1">
                    <h3 className={`text-3xl font-light mb-4 ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}>
                      {featuredProject.title}
                    </h3>
                    <p className={`text-lg leading-relaxed ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      {featuredProject.description}
                    </p>
                  </div>

                  {/* CTA */}
                  {featuredProject.status !== 'Coming Soon' && (
                    <div className="mt-8">
                      <Button
                        size="lg"
                        className={`group ${
                          isDarkMode
                            ? 'bg-indigo-500/20 hover:bg-indigo-500/30 border border-indigo-500/50 hover:border-indigo-400 text-indigo-400'
                            : 'bg-indigo-500 hover:bg-indigo-600 text-white'
                        }`}
                        onClick={() => window.open(featuredProject.link, '_blank')}
                      >
                        View Project
                        <ExternalLink className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </Button>
                    </div>
                  )}
                </div>

                {/* Visual indicator of interactivity */}
                <div className={`h-1 bg-gradient-to-r ${
                  isDarkMode
                    ? 'from-indigo-500 via-purple-500 to-pink-500'
                    : 'from-indigo-400 via-purple-400 to-pink-400'
                }`} />
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Smaller Project Tiles */}
          {otherProjects.map((project, index) => {
            const originalIndex = aiProjects.findIndex((p) => p.title === project.title);
            const isHovered = hoveredIndex === originalIndex;

            return (
              <motion.button
                key={originalIndex}
                onClick={() => setFeaturedIndex(originalIndex)}
                onMouseEnter={() => setHoveredIndex(originalIndex)}
                onMouseLeave={() => setHoveredIndex(null)}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`group text-left backdrop-blur-sm rounded-xl border transition-all ${
                  isDarkMode
                    ? 'bg-gray-900/40 border-gray-800 hover:border-indigo-500/50 hover:bg-gray-900/60'
                    : 'bg-white/60 border-gray-200 hover:border-indigo-300 hover:bg-white/80'
                }`}
              >
                <div className="p-6 h-full flex flex-col">
                  {/* Status Badge */}
                  <div className="mb-4">
                    <Badge
                      variant="outline"
                      className={`text-xs px-3 py-1 border ${getStatusColor(project.status)}`}
                    >
                      <span className="flex items-center gap-1.5">
                        {getStatusIcon(project.status)}
                        {project.status}
                      </span>
                    </Badge>
                  </div>

                  {/* Title */}
                  <h4 className={`text-lg font-normal mb-3 transition-colors ${
                    isDarkMode
                      ? 'text-gray-100 group-hover:text-indigo-400'
                      : 'text-gray-900 group-hover:text-indigo-600'
                  }`}>
                    {project.title}
                  </h4>

                  {/* Description */}
                  <p className={`text-sm line-clamp-3 flex-1 ${
                    isDarkMode ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                    {project.description}
                  </p>

                  {/* Action Indicator */}
                  <div className="mt-4 flex items-center justify-between">
                    <span className={`text-xs font-medium transition-colors ${
                      isDarkMode
                        ? 'text-gray-500 group-hover:text-indigo-400'
                        : 'text-gray-400 group-hover:text-indigo-600'
                    }`}>
                      {isHovered ? 'View details' : 'Click to feature'}
                    </span>
                    <ArrowRight className={`w-4 h-4 transition-all ${
                      isHovered
                        ? 'translate-x-1 ' + (isDarkMode ? 'text-indigo-400' : 'text-indigo-600')
                        : isDarkMode ? 'text-gray-600' : 'text-gray-400'
                    }`} />
                  </div>
                </div>
              </motion.button>
            );
          })}
        </div>

        {/* Navigation Dots */}
        <div className="flex justify-center gap-2 mt-8">
          {aiProjects.map((_, index) => (
            <button
              key={index}
              onClick={() => setFeaturedIndex(index)}
              className={`w-2 h-2 rounded-full transition-all ${
                index === featuredIndex
                  ? isDarkMode
                    ? 'w-8 bg-indigo-400'
                    : 'w-8 bg-indigo-600'
                  : isDarkMode
                    ? 'bg-gray-700 hover:bg-gray-600'
                    : 'bg-gray-300 hover:bg-gray-400'
              }`}
              aria-label={`Show ${aiProjects[index].title}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default AIShowcaseFeatured;
