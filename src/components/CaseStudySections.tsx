'use client'

import React from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';

// Hero Section
interface CaseStudyHeroProps {
  title: string;
  subtitle?: string;
  category?: string;
  heroImage?: string;
  tags?: string[];
}

export function CaseStudyHero({ title, subtitle, category, heroImage, tags }: CaseStudyHeroProps) {
  return (
    <section className="relative w-full min-h-screen flex items-center justify-center px-6 py-20">
      {/* Background Image (if provided) */}
      {heroImage && (
        <div className="absolute inset-0 z-0">
          <div className="relative w-full h-full">
            <Image
              src={heroImage}
              alt={title}
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/60 to-background" />
          </div>
        </div>
      )}

      {/* Content */}
      <div className="relative z-10 container mx-auto max-w-5xl text-center">
        {category && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-6"
          >
            <span className="inline-block px-4 py-2 bg-accent/10 border border-accent/30 rounded-full text-sm text-accent font-semibold uppercase tracking-wider">
              {category}
            </span>
          </motion.div>
        )}

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-5xl md:text-7xl font-bold text-foreground mb-6 bg-gradient-to-r from-accent to-accent-light bg-clip-text text-transparent"
        >
          {title}
        </motion.h1>

        {subtitle && (
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-xl md:text-2xl text-muted-foreground font-light leading-relaxed max-w-3xl mx-auto"
          >
            {subtitle}
          </motion.p>
        )}

        {tags && tags.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-8 flex flex-wrap justify-center gap-3"
          >
            {tags.map((tag, index) => (
              <span
                key={index}
                className="px-4 py-2 bg-card border border-border rounded-lg text-sm text-foreground"
              >
                {tag}
              </span>
            ))}
          </motion.div>
        )}
      </div>
    </section>
  );
}

// Problem Section
interface CaseStudyProblemProps {
  title?: string;
  problem: string;
  context?: string;
}

export function CaseStudyProblem({ title = "The Challenge", problem, context }: CaseStudyProblemProps) {
  return (
    <section className="relative w-full min-h-screen flex items-center justify-center px-6 py-20 bg-card/30">
      <div className="container mx-auto max-w-4xl">
        <h2 className="text-sm font-bold text-accent uppercase tracking-wider mb-6">
          {title}
        </h2>

        <p className="text-3xl md:text-4xl font-light text-foreground leading-relaxed mb-8">
          {problem}
        </p>

        {context && (
          <p className="text-lg text-muted-foreground leading-relaxed">
            {context}
          </p>
        )}
      </div>
    </section>
  );
}

// Solution Section
interface CaseStudySolutionProps {
  title?: string;
  solution: string;
  approach?: string;
  methodology?: string[];
}

export function CaseStudySolution({ title = "The Solution", solution, approach, methodology }: CaseStudySolutionProps) {
  return (
    <section className="relative w-full min-h-screen flex items-center justify-center px-6 py-20">
      <div className="container mx-auto max-w-4xl">
        <h2 className="text-sm font-bold text-accent uppercase tracking-wider mb-6">
          {title}
        </h2>

        <p className="text-3xl md:text-4xl font-light text-foreground leading-relaxed mb-8">
          {solution}
        </p>

        {approach && (
          <p className="text-lg text-muted-foreground leading-relaxed mb-8">
            {approach}
          </p>
        )}

        {methodology && methodology.length > 0 && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-foreground">Methodology</h3>
            <ul className="space-y-3">
              {methodology.map((item, index) => (
                <li key={index} className="flex items-start">
                  <span className="text-accent mr-3 mt-1">•</span>
                  <span className="text-foreground">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </section>
  );
}

// Metrics Section
interface Metric {
  value: string;
  label: string;
  description?: string;
}

interface CaseStudyMetricsProps {
  title?: string;
  metrics: Metric[];
}

export function CaseStudyMetrics({ title = "Key Metrics", metrics }: CaseStudyMetricsProps) {
  return (
    <section className="relative w-full min-h-screen flex items-center justify-center px-6 py-20 bg-card/30">
      <div className="container mx-auto max-w-6xl">
        <h2 className="text-sm font-bold text-accent uppercase tracking-wider mb-12 text-center">
          {title}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {metrics.map((metric, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-background border border-border rounded-2xl p-8 text-center"
            >
              <div className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-accent to-accent-light bg-clip-text text-transparent mb-4">
                {metric.value}
              </div>
              <div className="text-lg font-semibold text-foreground mb-2">
                {metric.label}
              </div>
              {metric.description && (
                <p className="text-sm text-muted-foreground">
                  {metric.description}
                </p>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// Outcomes Section
interface CaseStudyOutcomesProps {
  title?: string;
  achievements: string[];
  impact?: string;
}

export function CaseStudyOutcomes({ title = "Outcomes & Impact", achievements, impact }: CaseStudyOutcomesProps) {
  return (
    <section className="relative w-full min-h-screen flex items-center justify-center px-6 py-20">
      <div className="container mx-auto max-w-4xl">
        <h2 className="text-sm font-bold text-accent uppercase tracking-wider mb-8">
          {title}
        </h2>

        {impact && (
          <p className="text-2xl md:text-3xl font-light text-foreground leading-relaxed mb-10">
            {impact}
          </p>
        )}

        <div className="space-y-4">
          {achievements.map((achievement, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="flex items-start group"
            >
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-accent to-accent-light flex items-center justify-center mr-4 mt-1">
                <span className="text-background font-bold text-sm">{index + 1}</span>
              </div>
              <p className="text-lg text-foreground group-hover:text-accent transition-colors">
                {achievement}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// Gallery Section
interface GalleryImage {
  url: string;
  caption?: string;
}

interface CaseStudyGalleryProps {
  title?: string;
  images: GalleryImage[];
}

export function CaseStudyGallery({ title = "Project Gallery", images }: CaseStudyGalleryProps) {
  return (
    <section className="relative w-full min-h-screen flex items-center justify-center px-6 py-20 bg-card/30">
      <div className="container mx-auto max-w-6xl">
        <h2 className="text-sm font-bold text-accent uppercase tracking-wider mb-12 text-center">
          {title}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {images.map((image, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group relative aspect-video rounded-2xl overflow-hidden border border-border hover:border-accent transition-colors"
            >
              <Image
                src={image.url}
                alt={image.caption || `Gallery image ${index + 1}`}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-300"
              />
              {image.caption && (
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-background/90 to-transparent p-4">
                  <p className="text-sm text-foreground">{image.caption}</p>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
