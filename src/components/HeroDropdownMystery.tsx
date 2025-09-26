import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const heroOptions = [
  {
    prefix: 'shipped the first responsive',
    dropdown: 'airline website',
    link: '/case-studies/virgin-america',
    symbol: '✈️',
    color: 'from-red-500 to-pink-500',
    pattern: 'diagonal-lines'
  },
  {
    prefix: 'launched a restaurant with indoor cliff diving and a',
    dropdown: 'haunted house',
    link: '/case-studies/casa-bonita',
    symbol: '🏰',
    color: 'from-amber-500 to-orange-500',
    pattern: 'zigzag'
  },
  {
    prefix: 'has built four production applications with AI, and',
    dropdown: 'many prototypes',
    link: '/ai-showcase',
    symbol: '🤖',
    color: 'from-blue-500 to-cyan-500',
    pattern: 'dots'
  },
  {
    prefix: 'did AI research when he built a useful app in',
    dropdown: 'an hour',
    link: '/ai-research',
    symbol: '🔬',
    color: 'from-purple-500 to-indigo-500',
    pattern: 'waves'
  },
  {
    prefix: 'helped hundreds of thousands of android',
    dropdown: 'users focus',
    link: '/case-studies/before-launcher',
    symbol: '🎯',
    color: 'from-green-500 to-emerald-500',
    pattern: 'circles'
  },
  {
    prefix: 'is basically a',
    dropdown: 'farmer',
    link: '/about',
    symbol: '🌾',
    color: 'from-yellow-500 to-lime-500',
    pattern: 'organic'
  },
  {
    prefix: 'grew up in a',
    dropdown: 'purple house',
    link: '/about',
    symbol: '🏠',
    color: 'from-violet-500 to-purple-500',
    pattern: 'hexagons'
  }
];

const patterns = {
  'diagonal-lines': (
    <pattern id="diagonal-lines" patternUnits="userSpaceOnUse" width="10" height="10">
      <path d="M0,10 L10,0" stroke="currentColor" strokeWidth="0.5" opacity="0.3" />
      <path d="M-2,2 L2,-2" stroke="currentColor" strokeWidth="0.5" opacity="0.3" />
      <path d="M8,12 L12,8" stroke="currentColor" strokeWidth="0.5" opacity="0.3" />
    </pattern>
  ),
  'zigzag': (
    <pattern id="zigzag" patternUnits="userSpaceOnUse" width="20" height="10">
      <path d="M0,5 L5,0 L10,5 L15,0 L20,5" stroke="currentColor" strokeWidth="0.5" fill="none" opacity="0.3" />
    </pattern>
  ),
  'dots': (
    <pattern id="dots" patternUnits="userSpaceOnUse" width="20" height="20">
      <circle cx="2" cy="2" r="1" fill="currentColor" opacity="0.3" />
      <circle cx="12" cy="12" r="1" fill="currentColor" opacity="0.3" />
      <circle cx="2" cy="12" r="1" fill="currentColor" opacity="0.2" />
      <circle cx="12" cy="2" r="1" fill="currentColor" opacity="0.2" />
    </pattern>
  ),
  'waves': (
    <pattern id="waves" patternUnits="userSpaceOnUse" width="40" height="10">
      <path d="M0,5 Q10,0 20,5 T40,5" stroke="currentColor" strokeWidth="0.5" fill="none" opacity="0.3" />
    </pattern>
  ),
  'circles': (
    <pattern id="circles" patternUnits="userSpaceOnUse" width="30" height="30">
      <circle cx="15" cy="15" r="10" stroke="currentColor" strokeWidth="0.5" fill="none" opacity="0.3" />
      <circle cx="15" cy="15" r="5" stroke="currentColor" strokeWidth="0.5" fill="none" opacity="0.2" />
    </pattern>
  ),
  'organic': (
    <pattern id="organic" patternUnits="userSpaceOnUse" width="50" height="50">
      <path d="M10,25 Q20,10 30,25 T50,25" stroke="currentColor" strokeWidth="0.5" fill="none" opacity="0.3" />
      <path d="M0,40 Q15,30 25,40" stroke="currentColor" strokeWidth="0.5" fill="none" opacity="0.2" />
    </pattern>
  ),
  'hexagons': (
    <pattern id="hexagons" patternUnits="userSpaceOnUse" width="30" height="26">
      <polygon points="15,1 27,7 27,19 15,25 3,19 3,7" stroke="currentColor" strokeWidth="0.5" fill="none" opacity="0.3" />
    </pattern>
  )
};

const HeroDropdownMystery: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isOpen) {
      const interval = setInterval(() => {
        setIsTransitioning(true);
        setTimeout(() => {
          setCurrentIndex((prevIndex) => (prevIndex + 1) % heroOptions.length);
          setIsTransitioning(false);
        }, 150);
      }, 4000);

      return () => clearInterval(interval);
    }
  }, [isOpen]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const currentOption = heroOptions[currentIndex];

  const handleOptionClick = (index: number) => {
    setCurrentIndex(index);
    setIsOpen(false);
    navigate(heroOptions[index].link);
  };

  return (
    <section className="min-h-screen flex items-center justify-center relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-background via-secondary/30 to-accent/10" />

      <svg className="absolute w-0 h-0">
        <defs>
          {Object.values(patterns)}
        </defs>
      </svg>

      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-6xl mx-auto text-left">
          <h1 className="text-4xl md:text-6xl lg:text-7xl xl:text-8xl font-light mb-8 leading-tight text-left">
            <span className="inline text-purple-600 dark:text-purple-400">Michael Evans</span>{' '}
            <span className={`text-foreground inline transition-opacity duration-150 ${isTransitioning ? 'opacity-0' : 'opacity-100'}`}>
              {currentOption.prefix}
            </span>{' '}
            <div className="inline-block relative" ref={dropdownRef}>
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="group relative inline-flex items-baseline gap-2 cursor-pointer"
              >
                <span className={`bg-gradient-to-r ${currentOption.color} bg-clip-text text-transparent transition-all duration-150 ${isTransitioning ? 'opacity-0' : 'opacity-100'} font-medium`}>
                  {currentOption.dropdown}
                </span>
                <motion.span
                  animate={{ rotate: isOpen ? 180 : 0 }}
                  transition={{ duration: 0.3, type: "spring", stiffness: 200 }}
                  className="text-3xl md:text-4xl lg:text-5xl"
                >
                  {currentOption.symbol}
                </motion.span>
              </button>

              <AnimatePresence>
                {isOpen && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9, y: -20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: -20 }}
                    transition={{ duration: 0.3, type: "spring", stiffness: 300 }}
                    className="absolute top-full mt-4 left-1/2 -translate-x-1/2 w-96 p-4 bg-background/95 backdrop-blur-xl border border-border/50 rounded-2xl shadow-2xl"
                  >
                    <div className="grid grid-cols-3 gap-3">
                      {heroOptions.map((option, index) => (
                        <motion.button
                          key={index}
                          onClick={() => handleOptionClick(index)}
                          onMouseEnter={() => setHoveredIndex(index)}
                          onMouseLeave={() => setHoveredIndex(null)}
                          className={`relative aspect-square rounded-xl overflow-hidden bg-gradient-to-br ${option.color} p-0.5 transition-all duration-300 ${
                            index === currentIndex ? 'ring-2 ring-offset-2 ring-offset-background ring-primary' : ''
                          }`}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <div className="relative w-full h-full rounded-xl bg-background/80 backdrop-blur flex items-center justify-center">
                            <svg className="absolute inset-0 w-full h-full opacity-20">
                              <rect width="100%" height="100%" fill={`url(#${option.pattern})`} />
                            </svg>
                            <motion.div
                              animate={{
                                scale: hoveredIndex === index ? 1.2 : 1,
                                rotate: hoveredIndex === index ? [0, -5, 5, -5, 0] : 0
                              }}
                              transition={{ duration: 0.3 }}
                              className="text-4xl z-10"
                            >
                              {option.symbol}
                            </motion.div>
                          </div>
                        </motion.button>
                      ))}
                    </div>

                    <AnimatePresence mode="wait">
                      {hoveredIndex !== null && (
                        <motion.div
                          key={hoveredIndex}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 10 }}
                          transition={{ duration: 0.2 }}
                          className="mt-4 p-3 rounded-lg bg-accent/20 backdrop-blur"
                        >
                          <p className="text-sm text-muted-foreground text-center">
                            <span className="text-2xl mr-2">{heroOptions[hoveredIndex].symbol}</span>
                            <span className="italic">Discover what lies beyond...</span>
                          </p>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    <div className="mt-4 text-center">
                      <p className="text-xs text-muted-foreground/60">Click a symbol to explore</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </h1>
        </div>
      </div>
    </section>
  );
};

export default HeroDropdownMystery;