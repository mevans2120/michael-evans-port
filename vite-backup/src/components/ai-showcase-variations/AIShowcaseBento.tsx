import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ExternalLink, Sparkles, Play, Zap, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface AIProject {
  title: string;
  description: string;
  link: string;
  status: 'Live' | 'In Progress' | 'Coming Soon';
}

interface AIShowcaseBentoProps {
  isDarkMode: boolean;
}

const aiProjects: AIProject[] = [
  {
    title: "Post Pal",
    description: "An AI-powered social media content assistant that helps create, schedule, and optimize posts across multiple platforms with intelligent suggestions and analytics.",
    link: "https://postpal.app",
    status: "Live",
    category: "Medical Mobile & Web"
  },
  {
    title: "KarunaGatton.com",
    description: "Karuna is a shaman who offers spiritual healing. Karuna wanted a site that was clean, and modern but was still mystical and unique.",
    link: "https://www.karunagatton.com/",
    status: "Live",
    category: "Lead Management & Product Marketing"
  },
  {
    title: "AI Research Agent",
    description: "An in-progress agentic app that scrapes sites and pursues multiple questions while performing research, filtering results for relevance.",
    link: "https://research-agent-sable.vercel.app/",
    status: "In Progress",
    category: "Research Automation"
  },
  {
    title: "DepartmentOfArt.com",
    description: "A new project for DOA (the Department of Art production company) based in Portland. The goal is to see how quickly I can build an effective and excellent website for them using AI.",
    link: "#",
    status: "Coming Soon",
    category: "Lead Management & Product Marketing"
  }
];

/**
 * AIShowcaseBento - Variation 4
 *
 * A modern bento-box / magazine style layout with varied card sizes.
 * Features masonry-like grid with dynamic hover states and smooth animations.
 * Creates visual interest through asymmetry and intentional whitespace.
 */
const AIShowcaseBento: React.FC<AIShowcaseBentoProps> = ({ isDarkMode }) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Live':
        return isDarkMode ? 'text-green-400' : 'text-green-600';
      case 'In Progress':
        return isDarkMode ? 'text-blue-400' : 'text-blue-600';
      default:
        return isDarkMode ? 'text-purple-400' : 'text-purple-600';
    }
  };

  const getStatusBg = (status: string) => {
    switch (status) {
      case 'Live':
        return isDarkMode
          ? 'bg-green-500/10 border-green-500/20'
          : 'bg-green-50 border-green-200';
      case 'In Progress':
        return isDarkMode
          ? 'bg-blue-500/10 border-blue-500/20'
          : 'bg-blue-50 border-blue-200';
      default:
        return isDarkMode
          ? 'bg-purple-500/10 border-purple-500/20'
          : 'bg-purple-50 border-purple-200';
    }
  };

  const getAccentColor = (index: number) => {
    const colors = [
      { dark: 'from-pink-500 to-rose-500', light: 'from-pink-400 to-rose-400' },
      { dark: 'from-blue-500 to-cyan-500', light: 'from-blue-400 to-cyan-400' },
      { dark: 'from-purple-500 to-indigo-500', light: 'from-purple-400 to-indigo-400' },
      { dark: 'from-orange-500 to-amber-500', light: 'from-orange-400 to-amber-400' },
      { dark: 'from-green-500 to-emerald-500', light: 'from-green-400 to-emerald-400' },
      { dark: 'from-violet-500 to-purple-500', light: 'from-violet-400 to-purple-400' },
    ];
    const color = colors[index % colors.length];
    return isDarkMode ? color.dark : color.light;
  };

  // Define varied card sizes for bento layout (4 projects)
  const gridClasses = [
    'md:col-span-2 md:row-span-2', // Large card (0) - Post Pal
    'md:col-span-1 md:row-span-1', // Small card (1) - Karuna
    'md:col-span-1 md:row-span-1', // Small card (2) - AI Research Agent
    'md:col-span-2 md:row-span-1', // Wide card (3) - DOA
  ];

  return (
    <section className="py-20 px-6 relative overflow-hidden">
      {/* Multi-layer background decoration */}
      <div className={`absolute left-1/4 top-1/4 w-96 h-96 rounded-full blur-3xl ${
        isDarkMode ? 'bg-pink-500/10' : 'bg-pink-100 opacity-20'
      }`} />
      <div className={`absolute right-1/3 bottom-1/4 w-80 h-80 rounded-full blur-3xl ${
        isDarkMode ? 'bg-cyan-500/10' : 'bg-cyan-100 opacity-20'
      }`} />

      <div className="container mx-auto max-w-6xl relative z-10">
        {/* Section Header */}
        <div className="mb-12 -mx-6 md:mx-0 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 mb-4 px-4 py-2 rounded-full backdrop-blur-sm border"
            style={{
              background: isDarkMode ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.02)',
              borderColor: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
            }}
          >
            <Zap className={`w-4 h-4 ${isDarkMode ? 'text-yellow-400' : 'text-yellow-600'}`} />
            <span className={`text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              AI-Powered Development
            </span>
          </motion.div>
          <h2 className={`text-3xl md:text-4xl font-light mb-4 ${
            isDarkMode ? 'text-gray-100' : 'text-gray-900'
          }`}>
            Production Apps & Experiments
          </h2>
          <p className={`text-lg max-w-2xl mx-auto ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            Exploring the intersection of AI assistance and creative development
          </p>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 auto-rows-[minmax(200px,auto)] gap-4 -mx-6 md:mx-0">
          {aiProjects.map((project, index) => {
            const isHovered = hoveredIndex === index;
            const isLarge = index === 0;
            const isWide = index === 3;

            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1, duration: 0.4 }}
                className={gridClasses[index]}
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                <div
                  className={`group relative h-full backdrop-blur-sm rounded-2xl border overflow-hidden transition-all duration-300 ${
                    isDarkMode
                      ? 'bg-gray-900/60 border-gray-800 hover:border-gray-700'
                      : 'bg-white/80 border-gray-200 hover:border-gray-300'
                  }`}
                >
                  {/* Gradient accent bar */}
                  <div
                    className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${getAccentColor(index)} transition-all duration-300 ${
                      isHovered ? 'opacity-100' : 'opacity-50'
                    }`}
                  />

                  <div className={`p-6 h-full flex flex-col ${isLarge ? 'justify-between' : ''}`}>
                    {/* Header with status and category */}
                    <div className="flex items-start justify-between mb-4 gap-2">
                      <div className={`px-3 py-1 rounded-full border text-xs font-medium ${getStatusBg(project.status)}`}>
                        <span className={getStatusColor(project.status)}>
                          {project.status}
                        </span>
                      </div>
                      <div className={`px-3 py-1 rounded-lg text-xs font-medium text-right ${
                        isDarkMode
                          ? 'bg-gray-800/50 text-gray-400'
                          : 'bg-gray-100 text-gray-600'
                      }`}>
                        {project.category}
                      </div>
                    </div>

                    {/* Title */}
                    <h3
                      className={`font-normal mb-3 transition-colors ${
                        isLarge ? 'text-2xl' : isWide ? 'text-xl' : 'text-lg'
                      } ${
                        isDarkMode
                          ? 'text-gray-100 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r'
                          : 'text-gray-900 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r'
                      } ${isHovered ? getAccentColor(index) : ''}`}
                    >
                      {project.title}
                    </h3>

                    {/* Description - Show different lengths based on card size */}
                    <p
                      className={`mb-4 leading-relaxed ${
                        isLarge ? 'text-base line-clamp-4' : 'text-sm line-clamp-3'
                      } ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}
                    >
                      {project.description}
                    </p>

                    {/* Spacer for smaller cards */}
                    {!isLarge && <div className="flex-1" />}

                    {/* Action button/indicator */}
                    {project.status !== 'Coming Soon' ? (
                      <motion.div
                        animate={{ y: isHovered ? 0 : 10, opacity: isHovered ? 1 : 0.7 }}
                        transition={{ duration: 0.2 }}
                      >
                        <Button
                          variant="ghost"
                          size={isLarge ? 'default' : 'sm'}
                          className={`w-full group/btn ${
                            isDarkMode
                              ? 'hover:bg-white/10 text-gray-300'
                              : 'hover:bg-gray-100 text-gray-700'
                          }`}
                          onClick={() => window.open(project.link, '_blank')}
                        >
                          <span className="mr-2">View Project</span>
                          <ExternalLink className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                        </Button>
                      </motion.div>
                    ) : (
                      <div className={`text-sm text-center py-2 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                        Coming soon
                      </div>
                    )}
                  </div>

                  {/* Hover effect overlay */}
                  <motion.div
                    animate={{ opacity: isHovered ? 0.05 : 0 }}
                    transition={{ duration: 0.3 }}
                    className={`absolute inset-0 bg-gradient-to-br ${getAccentColor(index)} pointer-events-none`}
                  />
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Footer info */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-12 text-center"
        >
          <p className={`text-sm ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>
            Each project demonstrates different AI-assisted development approaches and patterns
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default AIShowcaseBento;
