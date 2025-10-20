import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, ExternalLink, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface AIProject {
  title: string;
  description: string;
  link: string;
  status: 'Live' | 'In Progress' | 'Coming Soon';
}

interface AIShowcaseCarouselProps {
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
 * AIShowcaseCarousel - Variation 1
 *
 * A horizontal scrolling carousel design with large preview cards.
 * Features smooth transitions, progress indicators, and swipe gestures.
 * Visually distinct from the grid layout with emphasis on individual projects.
 */
const AIShowcaseCarousel: React.FC<AIShowcaseCarouselProps> = ({ isDarkMode }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);

  const paginate = (newDirection: number) => {
    setDirection(newDirection);
    setCurrentIndex((prevIndex) => {
      let nextIndex = prevIndex + newDirection;
      if (nextIndex < 0) nextIndex = aiProjects.length - 1;
      if (nextIndex >= aiProjects.length) nextIndex = 0;
      return nextIndex;
    });
  };

  // Auto-advance carousel
  useEffect(() => {
    const timer = setInterval(() => {
      paginate(1);
    }, 5000);
    return () => clearInterval(timer);
  }, [currentIndex]);

  const currentProject = aiProjects[currentIndex];

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 1000 : -1000,
      opacity: 0
    })
  };

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

  return (
    <section className="py-20 px-6 relative overflow-hidden">
      {/* Background decoration */}
      <div className={`absolute left-1/3 top-20 w-96 h-96 rounded-full blur-3xl ${
        isDarkMode ? 'bg-cyan-500/10' : 'bg-cyan-100 opacity-20'
      }`} />

      <div className="container mx-auto max-w-6xl relative z-10">
        {/* Section Header */}
        <div className="mb-12 -mx-6 md:mx-0 text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Sparkles className={`w-6 h-6 ${isDarkMode ? 'text-cyan-400' : 'text-cyan-600'}`} />
            <h2 className={`text-3xl font-light ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}>
              AI Experiments & Production Apps
            </h2>
          </div>
          <p className={`text-lg ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            Exploring the possibilities of AI-assisted development
          </p>
        </div>

        {/* Carousel Container */}
        <div className="relative">
          {/* Main Carousel Card */}
          <div className={`relative h-[500px] rounded-2xl overflow-hidden backdrop-blur-sm border ${
            isDarkMode
              ? 'bg-gray-900/60 border-cyan-500/20'
              : 'bg-white/80 border-cyan-200'
          }`}>
            <AnimatePresence initial={false} custom={direction}>
              <motion.div
                key={currentIndex}
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{
                  x: { type: "spring", stiffness: 300, damping: 30 },
                  opacity: { duration: 0.2 }
                }}
                className="absolute inset-0 p-12 flex flex-col justify-between"
              >
                {/* Project Content */}
                <div>
                  <div className="flex items-start justify-between mb-6">
                    <Badge variant="outline" className={`text-sm px-4 py-1.5 border ${getStatusColor(currentProject.status)}`}>
                      {currentProject.status}
                    </Badge>
                    <span className={`text-sm font-medium ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                      {currentIndex + 1} / {aiProjects.length}
                    </span>
                  </div>

                  <h3 className={`text-4xl font-light mb-6 ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}>
                    {currentProject.title}
                  </h3>

                  <p className={`text-xl leading-relaxed max-w-3xl ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    {currentProject.description}
                  </p>
                </div>

                {/* CTA Button */}
                {currentProject.status !== 'Coming Soon' && (
                  <div>
                    <Button
                      variant="outline"
                      size="lg"
                      className={`group ${
                        isDarkMode
                          ? 'border-cyan-500/50 hover:bg-cyan-500/10 hover:border-cyan-400 text-cyan-400'
                          : 'border-cyan-300 hover:bg-cyan-50 hover:border-cyan-400 text-cyan-700'
                      }`}
                      onClick={() => window.open(currentProject.link, '_blank')}
                    >
                      View Project
                      <ExternalLink className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Navigation Buttons */}
          <button
            onClick={() => paginate(-1)}
            className={`absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full backdrop-blur-sm border transition-all ${
              isDarkMode
                ? 'bg-gray-900/80 border-cyan-500/30 hover:bg-cyan-500/20 hover:border-cyan-400'
                : 'bg-white/80 border-cyan-200 hover:bg-cyan-50 hover:border-cyan-300'
            }`}
          >
            <ChevronLeft className={`w-6 h-6 mx-auto ${isDarkMode ? 'text-cyan-400' : 'text-cyan-600'}`} />
          </button>

          <button
            onClick={() => paginate(1)}
            className={`absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full backdrop-blur-sm border transition-all ${
              isDarkMode
                ? 'bg-gray-900/80 border-cyan-500/30 hover:bg-cyan-500/20 hover:border-cyan-400'
                : 'bg-white/80 border-cyan-200 hover:bg-cyan-50 hover:border-cyan-300'
            }`}
          >
            <ChevronRight className={`w-6 h-6 mx-auto ${isDarkMode ? 'text-cyan-400' : 'text-cyan-600'}`} />
          </button>

          {/* Progress Indicators */}
          <div className="flex justify-center gap-2 mt-8">
            {aiProjects.map((_, index) => (
              <button
                key={index}
                onClick={() => {
                  setDirection(index > currentIndex ? 1 : -1);
                  setCurrentIndex(index);
                }}
                className={`h-1.5 rounded-full transition-all ${
                  index === currentIndex
                    ? isDarkMode
                      ? 'w-12 bg-cyan-400'
                      : 'w-12 bg-cyan-600'
                    : isDarkMode
                      ? 'w-8 bg-gray-700 hover:bg-gray-600'
                      : 'w-8 bg-gray-300 hover:bg-gray-400'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Thumbnail Strip */}
        <div className="mt-8 flex gap-4 justify-center overflow-x-auto pb-4 -mx-6 px-6 md:mx-0 md:px-0">
          {aiProjects.map((project, index) => (
            <button
              key={index}
              onClick={() => {
                setDirection(index > currentIndex ? 1 : -1);
                setCurrentIndex(index);
              }}
              className={`flex-shrink-0 px-4 py-2 rounded-lg backdrop-blur-sm border transition-all ${
                index === currentIndex
                  ? isDarkMode
                    ? 'bg-cyan-500/20 border-cyan-500/50'
                    : 'bg-cyan-50 border-cyan-300'
                  : isDarkMode
                    ? 'bg-gray-900/40 border-gray-800 hover:border-cyan-500/30'
                    : 'bg-white/60 border-gray-200 hover:border-cyan-200'
              }`}
            >
              <span className={`text-sm font-medium ${
                index === currentIndex
                  ? isDarkMode ? 'text-cyan-400' : 'text-cyan-700'
                  : isDarkMode ? 'text-gray-400' : 'text-gray-600'
              }`}>
                {project.title}
              </span>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AIShowcaseCarousel;
