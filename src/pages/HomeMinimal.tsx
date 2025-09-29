import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ArrowRight, Code, Briefcase, User, Sparkles, ExternalLink } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

interface HeroOption {
  prefix: string;
  dropdown: string;
  link: string;
  label: string;
}

const heroOptions: HeroOption[] = [
  {
    prefix: 'shipped the first responsive',
    dropdown: 'airline website',
    link: '/case-studies/virgin-america',
    label: 'Virgin America',
  },
  {
    prefix: 'launched a restaurant with',
    dropdown: 'cliff diving',
    link: '/case-studies/casa-bonita',
    label: 'Casa Bonita',
  },
  {
    prefix: 'built production apps with',
    dropdown: 'AI',
    link: '/ai-showcase',
    label: 'AI Showcase',
  },
  {
    prefix: 'helped thousands',
    dropdown: 'focus',
    link: '/case-studies/before-launcher',
    label: 'Before Launcher',
  },
];

const HomeMinimal: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

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

  useEffect(() => {
    if (!isOpen) {
      const interval = setInterval(() => {
        setIsTransitioning(true);
        setTimeout(() => {
          setCurrentIndex((prevIndex) => (prevIndex + 1) % heroOptions.length);
          setIsTransitioning(false);
        }, 150);
      }, 3500);

      return () => clearInterval(interval);
    }
  }, [isOpen]);

  const currentOption = heroOptions[currentIndex];

  const caseStudies = [
    {
      title: "Virgin America",
      description: "First responsive airline website",
      metric: "15% conversion lift",
      link: "/case-studies/virgin-america",
      tag: "UX Design"
    },
    {
      title: "Casa Bonita",
      description: "Restaurant with immersive entertainment",
      metric: "Cultural icon revival",
      link: "/case-studies/casa-bonita",
      tag: "Experience"
    },
    {
      title: "Before Launcher",
      description: "Minimalist Android launcher",
      metric: "100K+ users",
      link: "/case-studies/before-launcher",
      tag: "Mobile"
    },
  ];

  const capabilities = [
    { skill: "Product Strategy", years: "20" },
    { skill: "UX/UI Design", years: "15" },
    { skill: "Full-Stack Development", years: "10" },
    { skill: "AI/ML Integration", years: "5" },
  ];

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      isDarkMode
        ? 'bg-gradient-to-b from-gray-900 to-gray-950 text-gray-100'
        : 'bg-gradient-to-b from-slate-50 to-white text-gray-900'
    }`}>
      {/* Inverted Navigation on Load */}
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isDarkMode
            ? 'bg-gray-900/80 backdrop-blur-md shadow-sm border-b border-gray-800'
            : 'bg-white/80 backdrop-blur-md shadow-sm'
        }`}
        role="navigation"
        aria-label="Main navigation"
      >
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className={`text-lg font-medium ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}>
              Michael <span className="text-gradient">Evans</span>
            </Link>

            <Link
              to="/"
              className={`flex items-center gap-2 text-sm transition-colors ${
                isDarkMode
                  ? 'text-gray-400 hover:text-gray-100'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <span>Home</span>
            </Link>
          </div>
        </div>
      </nav>

      {/* Compact Hero Section */}
      <section className="pt-32 pb-16 px-6 relative">
        {/* Subtle decorative accent */}
        <div className={`absolute top-20 right-10 w-32 h-32 rounded-full blur-3xl ${
          isDarkMode ? 'bg-purple-500/20' : 'bg-purple-100 opacity-30'
        }`} />
        <div className="container mx-auto max-w-6xl relative z-10">
          <div className="max-w-3xl">
            <h1 className="text-3xl md:text-4xl font-light mb-6 leading-relaxed">
              <span className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>Michael Evans</span>{' '}
              <span className={`transition-opacity duration-150 ${isTransitioning ? 'opacity-0' : 'opacity-100'} ${
                isDarkMode ? 'text-gray-100' : 'text-gray-900'
              }`}>
                {currentOption.prefix}
              </span>{' '}
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="inline-flex items-baseline gap-1 group"
              >
                <span className={`underline underline-offset-4 decoration-2 transition-opacity duration-150 ${isTransitioning ? 'opacity-0' : 'opacity-100'} ${
                  isDarkMode ? 'text-purple-400' : 'text-purple-600'
                }`}>
                  {currentOption.dropdown}
                </span>
                <ChevronDown className={`w-3 h-3 transition-colors ${
                  isDarkMode
                    ? 'text-purple-400 group-hover:text-purple-300'
                    : 'text-purple-500 group-hover:text-purple-700'
                }`} />
              </button>
            </h1>
            <p className={`text-lg font-light ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Product strategist and creative technologist
            </p>
          </div>
        </div>
      </section>

      <Separator className={`mx-auto max-w-6xl ${isDarkMode ? 'bg-gray-800' : ''}`} />

      {/* Featured Work Section */}
      <section className="py-20 px-6 relative">
        <div className={`absolute left-1/4 top-1/2 w-40 h-40 rounded-full blur-3xl ${
          isDarkMode ? 'bg-purple-500/20' : 'bg-purple-100 opacity-20'
        }`} />
        <div className="container mx-auto max-w-6xl relative z-10">
          <div className="mb-12">
            <h2 className={`text-2xl font-light mb-2 flex items-center gap-3 ${
              isDarkMode ? 'text-gray-100' : 'text-gray-900'
            }`}>
              Selected Work
              <span className={`w-12 h-px bg-gradient-to-r ${
                isDarkMode ? 'from-purple-400/50 to-transparent' : 'from-purple-400 to-transparent'
              }`}></span>
            </h2>
            <p className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>Case studies and product launches</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {caseStudies.map((study, index) => (
              <Link
                key={index}
                to={study.link}
                className="group block"
              >
                <Card className={`transition-all duration-300 backdrop-blur-sm ${
                  isDarkMode
                    ? 'border-gray-800 hover:border-purple-500/50 bg-gray-900/60 hover:shadow-purple-500/10 hover:shadow-lg'
                    : 'border-gray-200 hover:border-purple-300 hover:shadow-lg bg-white/80'
                }`}>
                  <CardHeader className="pb-4">
                    <Badge variant="outline" className={`w-fit mb-3 text-xs ${
                      isDarkMode
                        ? 'border-purple-500/50 text-purple-400 bg-purple-500/10'
                        : 'border-purple-200 text-purple-700 bg-purple-50'
                    }`}>
                      {study.tag}
                    </Badge>
                    <CardTitle className={`text-lg font-normal transition-colors ${
                      isDarkMode
                        ? 'text-gray-100 group-hover:text-purple-400'
                        : 'text-gray-900 group-hover:text-purple-600'
                    }`}>
                      {study.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className={`text-sm mb-4 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      {study.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className={`text-sm font-medium ${isDarkMode ? 'text-gray-200' : 'text-gray-900'}`}>
                        {study.metric}
                      </span>
                      <ArrowRight className={`w-4 h-4 transition-colors ${
                        isDarkMode
                          ? 'text-gray-600 group-hover:text-purple-400'
                          : 'text-gray-400 group-hover:text-purple-600'
                      }`} />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <Separator className={`mx-auto max-w-6xl ${isDarkMode ? 'bg-gray-800' : ''}`} />

      {/* Capabilities Section */}
      <section className="py-20 px-6 relative">
        <div className={`absolute right-1/4 top-1/3 w-48 h-48 rounded-full blur-3xl ${
          isDarkMode ? 'bg-indigo-500/20' : 'bg-indigo-100 opacity-20'
        }`} />
        <div className="container mx-auto max-w-6xl relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
            <div className={`backdrop-blur-sm rounded-2xl p-8 border ${
              isDarkMode
                ? 'bg-gray-900/60 border-gray-800'
                : 'bg-white/60 border-gray-100'
            }`}>
              <h2 className={`text-2xl font-light mb-6 flex items-center gap-3 ${
                isDarkMode ? 'text-gray-100' : 'text-gray-900'
              }`}>
                Expertise
                <span className={`w-12 h-px bg-gradient-to-r ${
                  isDarkMode ? 'from-purple-400/50 to-transparent' : 'from-purple-400 to-transparent'
                }`}></span>
              </h2>
              <div className="space-y-6">
                {capabilities.map((cap, index) => (
                  <div key={index} className={`flex items-center justify-between pb-3 border-b ${
                    isDarkMode ? 'border-gray-800' : 'border-gray-200'
                  }`}>
                    <span className={`font-medium ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}>{cap.skill}</span>
                    <span className={`text-sm font-medium ${
                      isDarkMode ? 'text-purple-400' : 'text-purple-600'
                    }`}>{cap.years} years</span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h2 className={`text-2xl font-light mb-6 flex items-center gap-3 ${
                isDarkMode ? 'text-gray-100' : 'text-gray-900'
              }`}>
                Current Focus
                <span className={`w-12 h-px bg-gradient-to-r ${
                  isDarkMode ? 'from-purple-400/50 to-transparent' : 'from-purple-400 to-transparent'
                }`}></span>
              </h2>
              <div className="space-y-4">
                <Link to="/ai-showcase" className={`group flex items-center justify-between p-4 border transition-all rounded-lg backdrop-blur-sm ${
                  isDarkMode
                    ? 'border-gray-800 hover:border-purple-500/50 hover:bg-purple-500/10 bg-gray-900/60'
                    : 'border-gray-200 hover:border-purple-300 hover:bg-purple-50/50 bg-white/60'
                }`}>
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      isDarkMode ? 'bg-purple-500/20' : 'bg-purple-100'
                    }`}>
                      <Sparkles className={`w-4 h-4 ${isDarkMode ? 'text-purple-400' : 'text-purple-600'}`} />
                    </div>
                    <span className={`transition-colors ${
                      isDarkMode
                        ? 'text-gray-100 group-hover:text-purple-400'
                        : 'text-gray-900 group-hover:text-purple-700'
                    }`}>AI Applications</span>
                  </div>
                  <ArrowRight className={`w-4 h-4 transition-colors ${
                    isDarkMode
                      ? 'text-gray-600 group-hover:text-purple-400'
                      : 'text-gray-400 group-hover:text-purple-600'
                  }`} />
                </Link>
                <Link to="/ai-research" className={`group flex items-center justify-between p-4 border transition-all rounded-lg backdrop-blur-sm ${
                  isDarkMode
                    ? 'border-gray-800 hover:border-purple-500/50 hover:bg-purple-500/10 bg-gray-900/60'
                    : 'border-gray-200 hover:border-purple-300 hover:bg-purple-50/50 bg-white/60'
                }`}>
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      isDarkMode ? 'bg-purple-500/20' : 'bg-purple-100'
                    }`}>
                      <Code className={`w-4 h-4 ${isDarkMode ? 'text-purple-400' : 'text-purple-600'}`} />
                    </div>
                    <span className={`transition-colors ${
                      isDarkMode
                        ? 'text-gray-100 group-hover:text-purple-400'
                        : 'text-gray-900 group-hover:text-purple-700'
                    }`}>Research Projects</span>
                  </div>
                  <ArrowRight className={`w-4 h-4 transition-colors ${
                    isDarkMode
                      ? 'text-gray-600 group-hover:text-purple-400'
                      : 'text-gray-400 group-hover:text-purple-600'
                  }`} />
                </Link>
                <Link to="/about" className={`group flex items-center justify-between p-4 border transition-all rounded-lg backdrop-blur-sm ${
                  isDarkMode
                    ? 'border-gray-800 hover:border-purple-500/50 hover:bg-purple-500/10 bg-gray-900/60'
                    : 'border-gray-200 hover:border-purple-300 hover:bg-purple-50/50 bg-white/60'
                }`}>
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      isDarkMode ? 'bg-purple-500/20' : 'bg-purple-100'
                    }`}>
                      <User className={`w-4 h-4 ${isDarkMode ? 'text-purple-400' : 'text-purple-600'}`} />
                    </div>
                    <span className={`transition-colors ${
                      isDarkMode
                        ? 'text-gray-100 group-hover:text-purple-400'
                        : 'text-gray-900 group-hover:text-purple-700'
                    }`}>About & Contact</span>
                  </div>
                  <ArrowRight className={`w-4 h-4 transition-colors ${
                    isDarkMode
                      ? 'text-gray-600 group-hover:text-purple-400'
                      : 'text-gray-400 group-hover:text-purple-600'
                  }`} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Minimal Dropdown Modal */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-white/90 backdrop-blur-sm z-50"
              onClick={() => setIsOpen(false)}
            />

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className={`fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 border rounded-2xl shadow-2xl p-8 max-w-md w-full ${
                isDarkMode
                  ? 'bg-gray-900 border-gray-800'
                  : 'bg-white border-gray-200'
              }`}
            >
              <div className="space-y-3">
                {heroOptions.map((option, index) => (
                  <Link
                    key={index}
                    to={option.link}
                    onClick={() => setIsOpen(false)}
                    className={`block p-4 border rounded-xl transition-all ${
                      isDarkMode
                        ? index === currentIndex
                          ? 'border-purple-500 bg-purple-500/20 shadow-sm'
                          : 'border-gray-800 hover:border-purple-500/50 hover:bg-purple-500/10'
                        : index === currentIndex
                          ? 'border-purple-400 bg-purple-50/50 shadow-sm'
                          : 'border-gray-200 hover:border-purple-200 hover:bg-purple-50/30'
                    }`}
                  >
                    <div className={`text-sm mb-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      {option.prefix} {option.dropdown}
                    </div>
                    <div className={`font-medium flex items-center justify-between ${
                      isDarkMode
                        ? index === currentIndex ? 'text-purple-400' : 'text-gray-100'
                        : index === currentIndex ? 'text-purple-700' : 'text-gray-900'
                    }`}>
                      {option.label}
                      <ArrowRight className={`w-4 h-4 ${
                        isDarkMode
                          ? index === currentIndex ? 'text-purple-400' : 'text-gray-600'
                          : index === currentIndex ? 'text-purple-500' : 'text-gray-400'
                      }`} />
                    </div>
                  </Link>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default HomeMinimal;