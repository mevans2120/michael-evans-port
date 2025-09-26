import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

interface HeroOption {
  prefix: string;
  dropdown: string;
  link: string;
  label: string;
  shortLabel: string;
}

const heroOptions: HeroOption[] = [
  {
    prefix: 'shipped the first responsive',
    dropdown: 'airline website',
    link: '/case-studies/virgin-america',
    label: 'Virgin America',
    shortLabel: 'VA'
  },
  {
    prefix: 'launched a restaurant with indoor cliff diving and a',
    dropdown: 'haunted house',
    link: '/case-studies/casa-bonita',
    label: 'Casa Bonita',
    shortLabel: 'CB'
  },
  {
    prefix: 'has built four production applications with AI, and',
    dropdown: 'many prototypes',
    link: '/ai-showcase',
    label: 'AI Applications',
    shortLabel: 'AI'
  },
  {
    prefix: 'did AI research when he built a useful app in',
    dropdown: 'an hour',
    link: '/ai-research',
    label: 'AI Research',
    shortLabel: 'R'
  },
  {
    prefix: 'helped hundreds of thousands of android',
    dropdown: 'users focus',
    link: '/case-studies/before-launcher',
    label: 'Before Launcher',
    shortLabel: 'BL'
  },
  {
    prefix: 'is basically a',
    dropdown: 'farmer',
    link: '/about',
    label: 'About',
    shortLabel: 'A'
  },
  {
    prefix: 'grew up in a',
    dropdown: 'purple house',
    link: '/about',
    label: 'Background',
    shortLabel: 'BG'
  }
];

const HeroDropdownClean: React.FC = () => {
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

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen]);

  const currentOption = heroOptions[currentIndex];

  const handleOptionClick = (index: number) => {
    setCurrentIndex(index);
    setIsOpen(false);
    setTimeout(() => {
      navigate(heroOptions[index].link);
    }, 200);
  };

  return (
    <section className="min-h-screen flex items-center justify-center relative overflow-hidden">
      {/* Subtle gradient background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-b from-background to-background/95" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-accent/5 via-transparent to-transparent" />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-6xl mx-auto text-left">
          <h1 className="text-4xl md:text-6xl lg:text-7xl xl:text-8xl font-light mb-8 leading-tight text-left tracking-tight">
            <span className="inline text-foreground/80">Michael Evans</span>{' '}
            <span className={`text-foreground/60 inline transition-all duration-300 ${isTransitioning ? 'opacity-0 blur-sm' : 'opacity-100 blur-0'}`}>
              {currentOption.prefix}
            </span>{' '}
            <div className="inline-block relative" ref={dropdownRef}>
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="group relative inline-flex items-baseline cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded-sm"
                aria-label="Select project"
                aria-expanded={isOpen}
                aria-haspopup="true"
              >
                <span className={`text-foreground transition-all duration-300 ${isTransitioning ? 'opacity-0 blur-sm' : 'opacity-100 blur-0'} font-normal relative`}>
                  {currentOption.dropdown}
                  <motion.span
                    className="absolute -bottom-1 left-0 right-0 h-px bg-foreground/20 origin-left"
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: isOpen ? 1 : 0 }}
                    transition={{ duration: 0.2, ease: "easeOut" }}
                  />
                  <span className="absolute -bottom-1 left-0 right-0 h-px bg-foreground/10" />
                </span>
              </button>

              <AnimatePresence>
                {isOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.2, ease: "easeOut" }}
                    className="absolute top-full mt-3 left-0 min-w-[280px] bg-background border border-border/50 rounded-md shadow-lg overflow-hidden"
                  >
                    {/* Minimal header */}
                    <div className="px-4 py-3 border-b border-border/30">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Select Project</span>
                        <span className="text-xs text-muted-foreground/50">↑↓ Navigate</span>
                      </div>
                    </div>

                    {/* Clean list of options */}
                    <div className="py-2">
                      {heroOptions.map((option, index) => (
                        <motion.button
                          key={index}
                          onClick={() => handleOptionClick(index)}
                          onMouseEnter={() => setHoveredIndex(index)}
                          onMouseLeave={() => setHoveredIndex(null)}
                          className={`w-full text-left px-4 py-3 flex items-center justify-between group transition-colors duration-150 ${
                            index === currentIndex
                              ? 'bg-accent/10'
                              : hoveredIndex === index
                              ? 'bg-accent/5'
                              : 'bg-transparent'
                          }`}
                          initial={{ x: -20, opacity: 0 }}
                          animate={{ x: 0, opacity: 1 }}
                          transition={{ delay: index * 0.03, duration: 0.2 }}
                        >
                          <div className="flex items-center gap-3">
                            <span className={`text-xs font-mono w-8 text-center py-0.5 px-1 rounded transition-colors duration-150 ${
                              index === currentIndex
                                ? 'bg-foreground text-background'
                                : hoveredIndex === index
                                ? 'bg-foreground/10 text-foreground'
                                : 'bg-border/30 text-muted-foreground'
                            }`}>
                              {option.shortLabel}
                            </span>
                            <span className={`text-sm transition-colors duration-150 ${
                              index === currentIndex
                                ? 'text-foreground font-medium'
                                : hoveredIndex === index
                                ? 'text-foreground'
                                : 'text-foreground/70'
                            }`}>
                              {option.label}
                            </span>
                          </div>

                          {/* Subtle indicator */}
                          <motion.span
                            initial={{ opacity: 0, x: -4 }}
                            animate={{
                              opacity: hoveredIndex === index || index === currentIndex ? 1 : 0,
                              x: hoveredIndex === index || index === currentIndex ? 0 : -4
                            }}
                            transition={{ duration: 0.15 }}
                            className="text-muted-foreground/50 text-xs"
                          >
                            {index === currentIndex ? '•' : '→'}
                          </motion.span>
                        </motion.button>
                      ))}
                    </div>

                    {/* Footer with keyboard hint */}
                    <div className="px-4 py-2 border-t border-border/30">
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-muted-foreground/50">Press ESC to close</span>
                        <div className="flex items-center gap-2">
                          {heroOptions.map((_, index) => (
                            <motion.span
                              key={index}
                              className={`w-1 h-1 rounded-full transition-colors duration-300 ${
                                index === currentIndex ? 'bg-foreground' : 'bg-border'
                              }`}
                              animate={{
                                scale: index === currentIndex ? 1.2 : 1
                              }}
                              transition={{ duration: 0.2 }}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Subtle cycling indicator when closed */}
              {!isOpen && (
                <motion.div
                  className="absolute -bottom-8 left-0 flex items-center gap-1"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1 }}
                >
                  {heroOptions.map((_, index) => (
                    <motion.span
                      key={index}
                      className={`w-1 h-1 rounded-full transition-all duration-300 ${
                        index === currentIndex
                          ? 'bg-foreground/60 w-8'
                          : 'bg-foreground/20'
                      }`}
                    />
                  ))}
                </motion.div>
              )}
            </div>
          </h1>

          {/* Subtle call to action */}
          <motion.p
            className="mt-12 text-muted-foreground/60 text-sm tracking-wide"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.5 }}
          >
            Click to explore different projects
          </motion.p>
        </div>
      </div>
    </section>
  );
};

export default HeroDropdownClean;