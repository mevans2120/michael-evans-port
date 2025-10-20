import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Sparkles, Terminal, LayoutGrid, Grid3x3 } from 'lucide-react';
import Navigation from '@/components/Navigation';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';

// Import Bento variations
import BentoImageBehind from '@/components/ai-showcase-variations/BentoImageBehind';
import BentoImageIcon from '@/components/ai-showcase-variations/BentoImageIcon';
import BentoImageSide from '@/components/ai-showcase-variations/BentoImageSide';

interface VariationInfo {
  id: string;
  name: string;
  icon: React.ReactNode;
  description: string;
  strengths: string[];
  component: React.ComponentType<{ isDarkMode: boolean }>;
}

/**
 * AIShowcaseDesignTest
 *
 * Test page displaying all 4 AI Showcase design variations.
 * Allows comparison of different design approaches side-by-side.
 *
 * Navigate to: /ai-showcase-design-test
 */
const AIShowcaseDesignTest: React.FC = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [activeVariation, setActiveVariation] = useState<string | null>(null);

  // Detect browser dark mode preference
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    setIsDarkMode(mediaQuery.matches);

    const handleChange = (e: MediaQueryListEvent) => {
      setIsDarkMode(e.matches);
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  const variations: VariationInfo[] = [
    {
      id: 'image-behind',
      name: 'Image Behind Text',
      icon: <LayoutGrid className="w-5 h-5" />,
      description: 'Large background images with overlay text',
      strengths: [
        'Dramatic visual-first presentation',
        'Strong brand imagery',
        'Creates emotional connection',
        'Images set the mood and context',
        'Perfect for visually rich portfolios'
      ],
      component: BentoImageBehind
    },
    {
      id: 'image-icon',
      name: 'Icon Images',
      icon: <Grid3x3 className="w-5 h-5" />,
      description: 'Smaller icon-sized images with content focus',
      strengths: [
        'Professional and clean appearance',
        'Text remains primary focus',
        'Easy to scan and read',
        'Works well with varied image quality',
        'Balanced information hierarchy'
      ],
      component: BentoImageIcon
    },
    {
      id: 'image-side',
      name: 'Side-by-Side Layout',
      icon: <Sparkles className="w-5 h-5" />,
      description: 'Magazine-style with images as visual anchors',
      strengths: [
        'Editorial magazine aesthetic',
        'Balanced visual weight',
        'Images complement content',
        'Flexible responsive behavior',
        'Professional and modern'
      ],
      component: BentoImageSide
    }
  ];

  return (
    <div
      className={`min-h-screen transition-colors duration-300 ${
        isDarkMode
          ? 'bg-gradient-to-b from-gray-900 to-gray-950 text-gray-100'
          : 'bg-gradient-to-b from-slate-50 to-white text-gray-900'
      }`}
    >
      <Navigation />

      {/* Page Header */}
      <section className="px-6 pt-24 pb-12">
        <div className="container mx-auto max-w-6xl">
          <Link
            to="/"
            className={`inline-flex items-center gap-2 text-sm font-medium mb-8 transition-colors ${
              isDarkMode
                ? 'text-purple-400 hover:text-purple-300'
                : 'text-purple-600 hover:text-purple-700'
            }`}
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className={`text-4xl md:text-5xl font-light mb-4 ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}>
              AI Showcase Bento Variations
            </h1>
            <p className={`text-lg max-w-3xl ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Three Bento layout variations with different image treatments.
              Each showcases the same AI projects with unique visual approaches.
            </p>
          </motion.div>
        </div>
      </section>

      <Separator className={`mx-auto max-w-6xl ${isDarkMode ? 'bg-gray-800' : ''}`} />

      {/* Variation Selector */}
      <section className="px-6 py-8">
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            {variations.map((variation, index) => (
              <motion.button
                key={variation.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                onClick={() => {
                  const element = document.getElementById(variation.id);
                  if (element) {
                    element.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    setActiveVariation(variation.id);
                  }
                }}
                className={`text-left p-4 rounded-xl border backdrop-blur-sm transition-all ${
                  activeVariation === variation.id
                    ? isDarkMode
                      ? 'bg-purple-500/20 border-purple-500/50'
                      : 'bg-purple-50 border-purple-300'
                    : isDarkMode
                      ? 'bg-gray-900/60 border-gray-800 hover:border-purple-500/30'
                      : 'bg-white/80 border-gray-200 hover:border-purple-300'
                }`}
              >
                <div className={`flex items-center gap-3 mb-2 ${
                  activeVariation === variation.id
                    ? isDarkMode ? 'text-purple-400' : 'text-purple-600'
                    : isDarkMode ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  {variation.icon}
                  <span className={`font-medium ${
                    activeVariation === variation.id
                      ? isDarkMode ? 'text-purple-400' : 'text-purple-600'
                      : isDarkMode ? 'text-gray-100' : 'text-gray-900'
                  }`}>
                    {variation.name}
                  </span>
                </div>
                <p className={`text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                  {variation.description}
                </p>
              </motion.button>
            ))}
          </div>
        </div>
      </section>

      {/* Variations Display */}
      {variations.map((variation, index) => {
        const Component = variation.component;
        return (
          <div key={variation.id}>
            {/* Variation Header */}
            <section id={variation.id} className="px-6 py-8 scroll-mt-20">
              <div className="container mx-auto max-w-6xl">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5 }}
                  className={`backdrop-blur-sm rounded-2xl border p-6 mb-8 ${
                    isDarkMode
                      ? 'bg-gray-900/60 border-gray-800'
                      : 'bg-white/80 border-gray-200'
                  }`}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                        isDarkMode ? 'bg-purple-500/20' : 'bg-purple-100'
                      }`}>
                        {variation.icon}
                      </div>
                      <div>
                        <h2 className={`text-2xl font-light mb-1 ${
                          isDarkMode ? 'text-gray-100' : 'text-gray-900'
                        }`}>
                          Variation {index + 1}: {variation.name}
                        </h2>
                        <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                          {variation.description}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Strengths */}
                  <div>
                    <h3 className={`text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      Key Strengths:
                    </h3>
                    <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {variation.strengths.map((strength, i) => (
                        <li key={i} className={`text-sm flex items-start gap-2 ${
                          isDarkMode ? 'text-gray-400' : 'text-gray-600'
                        }`}>
                          <span className={isDarkMode ? 'text-purple-400' : 'text-purple-600'}>•</span>
                          {strength}
                        </li>
                      ))}
                    </ul>
                  </div>
                </motion.div>
              </div>
            </section>

            {/* Render Component */}
            <Component isDarkMode={isDarkMode} />

            {/* Separator between variations */}
            {index < variations.length - 1 && (
              <div className="px-6 py-12">
                <Separator className={`mx-auto max-w-6xl ${isDarkMode ? 'bg-gray-800' : ''}`} />
              </div>
            )}
          </div>
        );
      })}

      {/* Final Recommendations Section */}
      <section className="px-6 py-20">
        <div className="container mx-auto max-w-6xl">
          <Separator className={`mb-12 ${isDarkMode ? 'bg-gray-800' : ''}`} />

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className={`backdrop-blur-sm rounded-2xl border p-8 ${
              isDarkMode
                ? 'bg-gray-900/60 border-purple-500/30'
                : 'bg-white/80 border-purple-200'
            }`}
          >
            <h2 className={`text-2xl font-light mb-6 ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}>
              Recommendations
            </h2>

            <div className="space-y-6">
              <div>
                <h3 className={`text-lg font-medium mb-2 ${isDarkMode ? 'text-purple-400' : 'text-purple-600'}`}>
                  Image Behind Text
                </h3>
                <p className={`mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Creates the most dramatic, emotional presentation with full-bleed background images and overlay text.
                  Perfect for projects with strong visual identities.
                </p>
              </div>

              <div>
                <h3 className={`text-lg font-medium mb-2 ${isDarkMode ? 'text-purple-400' : 'text-purple-600'}`}>
                  Icon Images
                </h3>
                <p className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>
                  Most professional and text-focused approach. Images serve as visual identifiers without competing for attention.
                  Works well when content is the priority.
                </p>
              </div>

              <div>
                <h3 className={`text-lg font-medium mb-2 ${isDarkMode ? 'text-purple-400' : 'text-purple-600'}`}>
                  Side-by-Side Layout
                </h3>
                <p className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>
                  Balanced magazine-style approach where images and content share equal weight.
                  Offers the best of both worlds with flexibility across different card sizes.
                </p>
              </div>

              <div>
                <h3 className={`text-lg font-medium mb-2 ${isDarkMode ? 'text-purple-400' : 'text-purple-600'}`}>
                  Implementation Notes
                </h3>
                <ul className={`space-y-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  <li>• All variations use the same Bento grid layout with varied card sizes</li>
                  <li>• Fully responsive and dark mode compatible</li>
                  <li>• Status badges removed for cleaner presentation</li>
                  <li>• Category labels included for each project</li>
                  <li>• Components can be easily integrated into HomeMinimal.tsx</li>
                </ul>
              </div>
            </div>

            <div className="mt-8 flex gap-4">
              <Button
                variant="outline"
                asChild
                className={isDarkMode
                  ? 'border-purple-500/50 hover:bg-purple-500/10 text-purple-400'
                  : 'border-purple-300 hover:bg-purple-50 text-purple-700'
                }
              >
                <Link to="/">Return to Homepage</Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default AIShowcaseDesignTest;
