'use client'

import React from 'react';
import { motion } from 'framer-motion';
import { AIProjectData } from '@/types/sanity';

interface AIProjectsGridProps {
  projects: AIProjectData[];
  onProjectClick: (project: AIProjectData) => void;
  limit?: number;
}

export function AIProjectsGrid({ projects, onProjectClick, limit }: AIProjectsGridProps) {
  const displayProjects = limit ? projects.slice(0, limit) : projects;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {displayProjects.map((project, index) => (
        <motion.div
          key={project.slug}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1, duration: 0.4 }}
          onClick={() => onProjectClick(project)}
          className="group relative bg-card border border-border rounded-2xl p-9 cursor-pointer transition-all duration-300 hover:border-accent hover:-translate-y-2 hover:shadow-elegant"
        >
          {/* Top bar gradient (hidden by default, appears on hover) */}
          <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-accent to-accent-light opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-t-2xl" />

          {/* Project Number */}
          <div className="text-sm font-bold text-muted-foreground mb-3 tracking-wider">
            {String(index + 1).padStart(2, '0')}
          </div>

          {/* Project Title */}
          <h3 className="text-2xl font-bold text-foreground mb-3">
            {project.title}
          </h3>

          {/* Project Description */}
          <p className="text-base text-muted-foreground leading-relaxed">
            {project.description}
          </p>

          {/* Minimal Visual CTA - Purple Dot */}
          <div
            className="absolute bottom-5 right-5 w-2 h-2 rounded-full bg-gradient-to-br from-accent to-accent-light opacity-30 group-hover:opacity-100 group-hover:scale-[2] group-hover:shadow-[0_0_20px_rgba(168,85,247,0.6)] transition-all duration-300"
            aria-hidden="true"
          />
        </motion.div>
      ))}
    </div>
  );
}
