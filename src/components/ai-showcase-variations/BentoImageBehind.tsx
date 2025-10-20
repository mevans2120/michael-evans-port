'use client'

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

interface AIProject {
  title: string;
  description: string;
  link: string;
  status: 'Live' | 'In Progress' | 'Coming Soon';
  category: string;
  image: string;
}

interface BentoImageBehindProps {
  isDarkMode: boolean;
}

const aiProjects: AIProject[] = [
  {
    title: "Post Pal",
    description: "An AI-powered social media content assistant that helps create, schedule, and optimize posts across multiple platforms with intelligent suggestions and analytics.",
    link: "/ai-projects/post-pal",
    status: "Live",
    category: "Medical Mobile & Web",
    image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&h=600&fit=crop"
  },
  {
    title: "KarunaGatton.com",
    description: "Karuna is a shaman who offers spiritual healing. Karuna wanted a site that was clean, and modern but was still mystical and unique.",
    link: "/ai-projects/karuna-gatton",
    status: "Live",
    category: "Lead Management & Product Marketing",
    image: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800&h=600&fit=crop"
  },
  {
    title: "AI Research Agent",
    description: "An in-progress agentic app that scrapes sites and pursues multiple questions while performing research, filtering results for relevance.",
    link: "/ai-projects/ai-research-agent",
    status: "In Progress",
    category: "Research Automation",
    image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&h=600&fit=crop"
  },
  {
    title: "DepartmentOfArt.com",
    description: "A new project for DOA (the Department of Art production company) based in Portland. The goal is to see how quickly I can build an effective and excellent website for them using AI.",
    link: "/ai-projects/department-of-art",
    status: "Coming Soon",
    category: "Lead Management & Product Marketing",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=600&fit=crop"
  }
];

/**
 * BentoImageBehind - Variation 1
 *
 * Large background images with text overlaid on top.
 * Creates a dramatic, visual-first presentation.
 */
const BentoImageBehind: React.FC<BentoImageBehindProps> = ({ isDarkMode }) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const getAccentColor = (index: number) => {
    const colors = [
      { dark: 'from-pink-500 to-rose-500', light: 'from-pink-400 to-rose-400' },
      { dark: 'from-blue-500 to-cyan-500', light: 'from-blue-400 to-cyan-400' },
      { dark: 'from-purple-500 to-indigo-500', light: 'from-purple-400 to-indigo-400' },
      { dark: 'from-orange-500 to-amber-500', light: 'from-orange-400 to-amber-400' },
    ];
    const color = colors[index % colors.length];
    return isDarkMode ? color.dark : color.light;
  };

  const gridClasses = [
    'md:col-span-2 md:row-span-2', // Large card (0) - Post Pal
    'md:col-span-1 md:row-span-1', // Small card (1) - Karuna
    'md:col-span-1 md:row-span-1', // Small card (2) - AI Research Agent
    'md:col-span-2 md:row-span-1', // Wide card (3) - DOA
  ];

  return (
    <section className="py-20 px-6 relative overflow-hidden">
      {/* Background decoration */}
      <div className={`absolute left-1/4 top-1/4 w-96 h-96 rounded-full blur-3xl ${
        isDarkMode ? 'bg-pink-500/10' : 'bg-pink-100 opacity-20'
      }`} />

      <div className="container mx-auto max-w-6xl relative z-10">
        {/* Section Header */}
        <div className="mb-12 -mx-6 md:mx-0">
          <h2 className={`text-2xl font-light mb-2 flex items-center gap-3 ${
            isDarkMode ? 'text-gray-100' : 'text-gray-900'
          }`}>
            AI Projects
            <span className={`w-12 h-px bg-gradient-to-r ${
              isDarkMode ? 'from-purple-400/50 to-transparent' : 'from-purple-400 to-transparent'
            }`}></span>
          </h2>
          <p className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>
            Production apps and experiments
          </p>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 auto-rows-[minmax(250px,auto)] gap-4 -mx-6 md:mx-0">
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
                <div className="group relative h-full rounded-2xl overflow-hidden transition-all duration-300 border border-transparent hover:border-white/20">
                  {/* Background Image */}
                  <div className="absolute inset-0">
                    <img
                      src={project.image}
                      alt={project.title}
                      className={`w-full h-full object-cover transition-transform duration-700 ${
                        isHovered ? 'scale-110' : 'scale-100'
                      }`}
                    />
                    {/* Dark overlay */}
                    <div className={`absolute inset-0 bg-gradient-to-t transition-opacity duration-300 ${
                      isDarkMode
                        ? 'from-gray-900 via-gray-900/95 to-gray-900/90'
                        : 'from-gray-900 via-gray-900/90 to-gray-900/80'
                    } ${isHovered ? 'opacity-95' : 'opacity-90'}`} />
                  </div>

                  {/* Gradient accent bar */}
                  <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${getAccentColor(index)} z-10`} />

                  {/* Content */}
                  <div className="relative z-10 p-6 h-full flex flex-col justify-between">
                    {/* Category badge */}
                    <div>
                      <div className="inline-block px-3 py-1 rounded-lg text-xs font-medium bg-white/10 backdrop-blur-sm text-white/90 mb-4">
                        {project.category}
                      </div>
                    </div>

                    <div>
                      {/* Title */}
                      <h3 className={`font-normal mb-3 text-white ${
                        isLarge ? 'text-2xl' : isWide ? 'text-xl' : 'text-lg'
                      }`}>
                        {project.title}
                      </h3>

                      {/* Description */}
                      <p className={`mb-4 leading-relaxed text-white/80 ${
                        isLarge ? 'text-base line-clamp-3' : 'text-sm line-clamp-2'
                      }`}>
                        {project.description}
                      </p>

                      {/* Action button */}
                      <motion.div
                        animate={{ y: isHovered ? 0 : 10, opacity: isHovered ? 1 : 0.8 }}
                        transition={{ duration: 0.2 }}
                      >
                        <Link href={project.link}>
                          <Button
                            variant="ghost"
                            size={isLarge ? 'default' : 'sm'}
                            className="w-full bg-white/10 hover:bg-white/20 text-white backdrop-blur-sm border border-white/20"
                          >
                            <span className="mr-2">View Project</span>
                            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                          </Button>
                        </Link>
                      </motion.div>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default BentoImageBehind;
