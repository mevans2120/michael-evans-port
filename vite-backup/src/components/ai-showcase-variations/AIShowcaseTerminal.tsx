import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Terminal, ExternalLink, Play, CheckCircle2, Clock, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface AIProject {
  title: string;
  description: string;
  link: string;
  status: 'Live' | 'In Progress' | 'Coming Soon';
}

interface AIShowcaseTerminalProps {
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
 * AIShowcaseTerminal - Variation 2
 *
 * A tech-forward terminal/code editor inspired design.
 * Features monospace fonts, command-line aesthetics, and matrix-style animations.
 * Perfect for showcasing the technical/experimental nature of AI projects.
 */
const AIShowcaseTerminal: React.FC<AIShowcaseTerminalProps> = ({ isDarkMode }) => {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
  const [typedText, setTypedText] = useState('');
  const [cursorVisible, setCursorVisible] = useState(true);

  const fullText = '$ ls -la ./ai-projects/';

  // Typing animation effect
  useEffect(() => {
    if (typedText.length < fullText.length) {
      const timeout = setTimeout(() => {
        setTypedText(fullText.slice(0, typedText.length + 1));
      }, 50);
      return () => clearTimeout(timeout);
    }
  }, [typedText]);

  // Cursor blink effect
  useEffect(() => {
    const interval = setInterval(() => {
      setCursorVisible((prev) => !prev);
    }, 530);
    return () => clearInterval(interval);
  }, []);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Live':
        return <CheckCircle2 className="w-4 h-4 text-green-400" />;
      case 'In Progress':
        return <Clock className="w-4 h-4 text-blue-400" />;
      default:
        return <Sparkles className="w-4 h-4 text-purple-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Live':
        return 'text-green-400';
      case 'In Progress':
        return 'text-blue-400';
      default:
        return 'text-purple-400';
    }
  };

  return (
    <section className="py-20 px-6 relative overflow-hidden">
      {/* Matrix-style background effect */}
      <div className={`absolute inset-0 opacity-5 ${isDarkMode ? 'opacity-10' : ''}`}>
        <div className="absolute top-0 left-0 text-xs font-mono leading-tight whitespace-pre">
          {Array.from({ length: 20 }).map((_, i) => (
            <div key={i} className={isDarkMode ? 'text-green-400' : 'text-green-600'}>
              {Array.from({ length: 80 }).map(() => Math.random() > 0.5 ? '1' : '0').join('')}
            </div>
          ))}
        </div>
      </div>

      <div className="container mx-auto max-w-6xl relative z-10">
        {/* Terminal Window */}
        <div className={`rounded-xl overflow-hidden border shadow-2xl ${
          isDarkMode
            ? 'bg-gray-950 border-gray-800'
            : 'bg-gray-900 border-gray-800'
        }`}>
          {/* Terminal Header */}
          <div className={`px-4 py-3 flex items-center gap-2 border-b ${
            isDarkMode ? 'bg-gray-900 border-gray-800' : 'bg-gray-800 border-gray-700'
          }`}>
            <div className="flex gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500" />
              <div className="w-3 h-3 rounded-full bg-yellow-500" />
              <div className="w-3 h-3 rounded-full bg-green-500" />
            </div>
            <div className="flex-1 flex items-center justify-center gap-2">
              <Terminal className="w-4 h-4 text-gray-400" />
              <span className="text-sm text-gray-400 font-mono">ai-showcase.terminal</span>
            </div>
          </div>

          {/* Terminal Content */}
          <div className="p-6 font-mono text-sm">
            {/* Command Line */}
            <div className="mb-6">
              <span className="text-green-400">michael@portfolio</span>
              <span className="text-gray-400">:</span>
              <span className="text-blue-400">~/projects</span>
              <span className="text-gray-400">$ </span>
              <span className="text-gray-100">{typedText}</span>
              {cursorVisible && <span className="inline-block w-2 h-4 bg-green-400 ml-1 animate-pulse" />}
            </div>

            {typedText === fullText && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                {/* Output Header */}
                <div className="mb-4 text-gray-500 text-xs">
                  total {aiProjects.length} projects
                </div>

                {/* Project List */}
                <div className="space-y-2">
                  {aiProjects.map((project, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.3 + index * 0.1 }}
                      className={`rounded-lg border transition-all ${
                        expandedIndex === index
                          ? isDarkMode
                            ? 'bg-gray-900 border-green-500/50'
                            : 'bg-gray-800 border-green-500/50'
                          : isDarkMode
                            ? 'bg-gray-900/50 border-gray-800 hover:border-gray-700'
                            : 'bg-gray-800/50 border-gray-700 hover:border-gray-600'
                      }`}
                    >
                      {/* Project Header (always visible) */}
                      <button
                        onClick={() => setExpandedIndex(expandedIndex === index ? null : index)}
                        className="w-full px-4 py-3 flex items-center gap-3 text-left"
                      >
                        {getStatusIcon(project.status)}
                        <span className="text-gray-400 text-xs min-w-[100px]">
                          [{project.status.toUpperCase()}]
                        </span>
                        <span className="flex-1 text-gray-100">
                          {project.title}
                        </span>
                        <Play className={`w-4 h-4 transition-transform ${
                          expandedIndex === index ? 'rotate-90 text-green-400' : 'text-gray-500'
                        }`} />
                      </button>

                      {/* Expanded Content */}
                      {expandedIndex === index && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3 }}
                          className={`border-t overflow-hidden ${
                            isDarkMode ? 'border-gray-800' : 'border-gray-700'
                          }`}
                        >
                          <div className="p-4 space-y-4">
                            {/* Description */}
                            <div className="space-y-2">
                              <div className="text-gray-500 text-xs">
                                <span className="text-green-400">// </span>Description
                              </div>
                              <p className="text-gray-300 text-sm leading-relaxed pl-4 border-l-2 border-green-500/30">
                                {project.description}
                              </p>
                            </div>

                            {/* Status Info */}
                            <div className="flex items-center gap-4 text-xs">
                              <div>
                                <span className="text-gray-500">status: </span>
                                <span className={getStatusColor(project.status)}>
                                  "{project.status}"
                                </span>
                              </div>
                              {project.status !== 'Coming Soon' && (
                                <div>
                                  <span className="text-gray-500">url: </span>
                                  <span className="text-blue-400">"{project.link}"</span>
                                </div>
                              )}
                            </div>

                            {/* Action Button */}
                            {project.status !== 'Coming Soon' && (
                              <div className="pt-2">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="bg-green-500/10 border-green-500/30 hover:bg-green-500/20 hover:border-green-500/50 text-green-400 font-mono text-xs"
                                  onClick={() => window.open(project.link, '_blank')}
                                >
                                  $ open --url {project.link}
                                  <ExternalLink className="w-3 h-3 ml-2" />
                                </Button>
                              </div>
                            )}
                          </div>
                        </motion.div>
                      )}
                    </motion.div>
                  ))}
                </div>

                {/* Footer Command */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1 }}
                  className="mt-6 flex items-center gap-2"
                >
                  <span className="text-green-400">michael@portfolio</span>
                  <span className="text-gray-400">:</span>
                  <span className="text-blue-400">~/projects</span>
                  <span className="text-gray-400">$ </span>
                  <span className="inline-block w-2 h-4 bg-green-400 animate-pulse" />
                </motion.div>
              </motion.div>
            )}
          </div>
        </div>

        {/* Terminal Caption */}
        <div className="mt-4 text-center">
          <p className={`text-sm font-mono ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>
            <span className="text-green-400">#!/bin/bash</span> - AI-powered development experiments
          </p>
        </div>
      </div>
    </section>
  );
};

export default AIShowcaseTerminal;
