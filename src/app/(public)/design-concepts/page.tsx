'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import MinimalProfessional from '@/components/design-concepts/MinimalProfessional';
import TerminalDark from '@/components/design-concepts/TerminalDark';
import WarmDepth from '@/components/design-concepts/WarmDepth';

type ConceptType = 'minimal' | 'terminal' | 'warm';

interface ConceptOption {
  id: ConceptType;
  name: string;
  description: string;
  component: React.ComponentType;
}

const concepts: ConceptOption[] = [
  {
    id: 'minimal',
    name: 'Minimal Professional',
    description: 'Clean, refined aesthetic with subtle shadows',
    component: MinimalProfessional
  },
  {
    id: 'terminal',
    name: 'Terminal Dark',
    description: 'Bold, distinctive with neon green accents',
    component: TerminalDark
  },
  {
    id: 'warm',
    name: 'Warm Depth',
    description: 'Premium design with rich gradients',
    component: WarmDepth
  }
];

export default function DesignConceptsPage() {
  const [selectedConcept, setSelectedConcept] = useState<ConceptType>('minimal');
  const [showSwitcher, setShowSwitcher] = useState(true);

  const CurrentConcept = concepts.find(c => c.id === selectedConcept)?.component || MinimalProfessional;

  return (
    <div className="relative h-screen w-screen overflow-hidden">
      {/* Concept Display */}
      <AnimatePresence mode="wait">
        <motion.div
          key={selectedConcept}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="h-full w-full"
        >
          <CurrentConcept />
        </motion.div>
      </AnimatePresence>

      {/* Concept Switcher */}
      <AnimatePresence>
        {showSwitcher && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50"
          >
            <div className="bg-white/95 backdrop-blur-lg rounded-2xl shadow-2xl border border-neutral-200 p-2 min-w-[600px]">
              {/* Header */}
              <div className="px-4 py-3 border-b border-neutral-200 flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-semibold text-neutral-900">
                    Design Concepts Preview
                  </h3>
                  <p className="text-xs text-neutral-500 mt-0.5">
                    Click to switch between concepts
                  </p>
                </div>
                <button
                  onClick={() => setShowSwitcher(false)}
                  className="text-xs text-neutral-500 hover:text-neutral-900 transition-colors"
                >
                  Hide
                </button>
              </div>

              {/* Concept Buttons */}
              <div className="grid grid-cols-3 gap-2 p-2">
                {concepts.map((concept) => (
                  <button
                    key={concept.id}
                    onClick={() => setSelectedConcept(concept.id)}
                    className={`relative p-4 rounded-xl text-left transition-all ${
                      selectedConcept === concept.id
                        ? 'bg-neutral-900 text-white shadow-lg scale-105'
                        : 'bg-neutral-50 text-neutral-900 hover:bg-neutral-100 hover:scale-102'
                    }`}
                  >
                    {/* Active Indicator */}
                    {selectedConcept === concept.id && (
                      <motion.div
                        layoutId="active-concept"
                        className="absolute inset-0 bg-neutral-900 rounded-xl"
                        transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                      />
                    )}

                    <div className="relative">
                      <h4 className="text-sm font-semibold mb-1">
                        {concept.name}
                      </h4>
                      <p className={`text-xs leading-relaxed ${
                        selectedConcept === concept.id
                          ? 'text-neutral-300'
                          : 'text-neutral-600'
                      }`}>
                        {concept.description}
                      </p>

                      {selectedConcept === concept.id && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="absolute -top-2 -right-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center"
                        >
                          <svg
                            className="w-4 h-4 text-white"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={3}
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                        </motion.div>
                      )}
                    </div>
                  </button>
                ))}
              </div>

              {/* Footer Info */}
              <div className="px-4 py-3 border-t border-neutral-200 flex items-center justify-between">
                <p className="text-xs text-neutral-500">
                  Each concept shows collapsible AI chat panel with different aesthetics
                </p>
                <a
                  href="/docs/design/concepts-batch-1-102725/overview.md"
                  target="_blank"
                  className="text-xs text-neutral-900 hover:underline font-medium"
                >
                  View Documentation
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Show Switcher Button (when hidden) */}
      {!showSwitcher && (
        <motion.button
          initial={{ y: 100 }}
          animate={{ y: 0 }}
          onClick={() => setShowSwitcher(true)}
          className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 px-6 py-3 bg-neutral-900 text-white text-sm font-medium rounded-full shadow-xl hover:bg-neutral-800 transition-colors"
        >
          Show Concept Switcher
        </motion.button>
      )}
    </div>
  );
}
