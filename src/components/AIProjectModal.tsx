'use client'

import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { AIProjectData } from '@/types/sanity';

interface AIProjectModalProps {
  project: AIProjectData | null;
  isOpen: boolean;
  onClose: () => void;
}

export function AIProjectModal({ project, isOpen, onClose }: AIProjectModalProps) {
  // Handle ESC key to close modal
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      // Prevent body scroll when modal is open
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!project) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-black/95 backdrop-blur-md z-[100]"
            onClick={onClose}
            aria-hidden="true"
          />

          {/* Modal Content */}
          <div className="fixed inset-0 z-[101] flex items-center justify-center p-4 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 40 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 40 }}
              transition={{ duration: 0.4, type: 'spring', stiffness: 300, damping: 30 }}
              className="bg-background border-2 border-border rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-y-auto pointer-events-auto relative"
              onClick={(e) => e.stopPropagation()}
              role="dialog"
              aria-modal="true"
              aria-labelledby="modal-title"
            >
              {/* Header */}
              <div className="sticky top-0 z-10 px-10 py-8 bg-background/95 backdrop-blur-lg border-b border-border">
                <div className="pr-12">
                  <h2
                    id="modal-title"
                    className="text-4xl font-bold bg-gradient-to-r from-accent to-accent-light bg-clip-text text-transparent mb-3"
                  >
                    {project.title}
                  </h2>
                  <p className="text-lg text-muted-foreground font-medium">
                    {project.subtitle}
                  </p>
                </div>

                {/* Close Button */}
                <button
                  onClick={onClose}
                  className="absolute top-8 right-8 w-12 h-12 rounded-full bg-accent/10 border-2 border-transparent hover:border-accent hover:bg-gradient-to-br hover:from-accent hover:to-accent-light text-accent hover:text-background transition-all duration-200 flex items-center justify-center group"
                  aria-label="Close modal"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Body */}
              <div className="px-10 py-8">
                {/* Project Overview Grid */}
                <div className="grid md:grid-cols-2 gap-8 mb-10">
                  <div>
                    <h3 className="text-sm font-bold text-accent uppercase tracking-wider mb-3">
                      Project Overview
                    </h3>
                    <p className="text-foreground leading-relaxed">
                      {project.description}
                    </p>
                    {project.overview?.problem && (
                      <p className="text-foreground leading-relaxed mt-4">
                        <strong className="text-accent">Problem:</strong> {project.overview.problem}
                      </p>
                    )}
                    {project.overview?.solution && (
                      <p className="text-foreground leading-relaxed mt-4">
                        <strong className="text-accent">Solution:</strong> {project.overview.solution}
                      </p>
                    )}
                  </div>

                  <div>
                    <h3 className="text-sm font-bold text-accent uppercase tracking-wider mb-3">
                      Tech Stack
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {project.techStack.map((tech, index) => (
                        <span
                          key={index}
                          className="px-4 py-2 bg-accent/10 border border-accent/30 rounded-lg text-sm text-accent font-semibold"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Key Metrics */}
                {project.metrics && project.metrics.length > 0 && (
                  <div className="mb-10">
                    <h3 className="text-sm font-bold text-accent uppercase tracking-wider mb-4">
                      Key Metrics
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {project.metrics.map((metric, index) => (
                        <div
                          key={index}
                          className="bg-accent/10 border border-accent rounded-xl p-6 text-center"
                        >
                          <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-accent to-accent-light bg-clip-text text-transparent mb-2">
                            {metric.value}
                          </div>
                          <div className="text-sm text-muted-foreground uppercase tracking-wide font-semibold">
                            {metric.label}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* AI Components */}
                {project.aiComponents && project.aiComponents.length > 0 && (
                  <div className="mb-10">
                    <h3 className="text-sm font-bold text-accent uppercase tracking-wider mb-4">
                      AI Components
                    </h3>
                    <div className="space-y-4">
                      {project.aiComponents.map((component, index) => (
                        <div
                          key={index}
                          className="bg-card border border-border rounded-xl p-5"
                        >
                          <div className="flex justify-between items-start mb-2">
                            <h4 className="font-bold text-foreground">{component.name}</h4>
                            <span className="text-xs px-3 py-1 bg-accent/20 text-accent rounded-full font-semibold">
                              {component.technology}
                            </span>
                          </div>
                          <p className="text-muted-foreground text-sm leading-relaxed">
                            {component.description}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Key Features/Achievements */}
                {project.achievements && project.achievements.length > 0 && (
                  <div className="mb-10">
                    <h3 className="text-sm font-bold text-accent uppercase tracking-wider mb-4">
                      Key Features & Achievements
                    </h3>
                    <ul className="space-y-2 text-foreground">
                      {project.achievements.map((achievement, index) => (
                        <li key={index} className="flex items-start">
                          <span className="text-accent mr-3">•</span>
                          <span>{achievement}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* CTA Button */}
                {project.links?.live && (
                  <div className="mt-8">
                    <a
                      href={project.links.live}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-accent to-accent-light hover:from-accent/90 hover:to-accent-light/90 text-background font-bold rounded-xl transition-all duration-200 hover:-translate-y-1 hover:shadow-[0_12px_24px_rgba(168,85,247,0.4)]"
                    >
                      View Live Project →
                    </a>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
