import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ArrowRight, Sparkles, X } from 'lucide-react';

interface HeroOption {
  prefix: string;
  dropdown: string;
  link: string;
  label: string;
  description: string;
  image: string;
  tags: string[];
  color: string;
}

const heroOptions: HeroOption[] = [
  {
    prefix: 'shipped the first responsive',
    dropdown: 'airline website',
    link: '/case-studies/virgin-america',
    label: 'Virgin America',
    description: 'Revolutionized airline digital experience with the first fully responsive airline website',
    image: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=600&h=400&fit=crop',
    tags: ['UX Design', 'Responsive', 'Innovation'],
    color: 'from-red-500 to-pink-600'
  },
  {
    prefix: 'launched a restaurant with indoor cliff diving and a',
    dropdown: 'haunted house',
    link: '/case-studies/casa-bonita',
    label: 'Casa Bonita',
    description: 'Brought a legendary Colorado restaurant back to life with immersive entertainment',
    image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=600&h=400&fit=crop',
    tags: ['Experience Design', 'Entertainment', 'Revival'],
    color: 'from-amber-500 to-orange-600'
  },
  {
    prefix: 'has built four production applications with AI, and',
    dropdown: 'many prototypes',
    link: '/ai-showcase',
    label: 'AI App Showcase',
    description: 'Collection of production-ready AI applications solving real-world problems',
    image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=600&h=400&fit=crop',
    tags: ['AI/ML', 'Production Apps', 'Innovation'],
    color: 'from-blue-500 to-cyan-600'
  },
  {
    prefix: 'did AI research when he built a useful app in',
    dropdown: 'an hour',
    link: '/ai-research',
    label: 'AI Research',
    description: 'Rapid prototyping and research in artificial intelligence applications',
    image: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=600&h=400&fit=crop',
    tags: ['Research', 'Rapid Prototyping', 'AI'],
    color: 'from-purple-500 to-indigo-600'
  },
  {
    prefix: 'helped hundreds of thousands of android',
    dropdown: 'users focus',
    link: '/case-studies/before-launcher',
    label: 'Before Launcher',
    description: 'A minimalist Android launcher that helps users reduce phone addiction',
    image: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=600&h=400&fit=crop',
    tags: ['Mobile App', 'Productivity', 'Wellness'],
    color: 'from-green-500 to-emerald-600'
  },
  {
    prefix: 'is basically a',
    dropdown: 'farmer',
    link: '/about',
    label: 'About Michael',
    description: 'Creative technologist with a passion for sustainable living and innovation',
    image: 'https://images.unsplash.com/photo-1500937107185-c1e4490a2f15?w=600&h=400&fit=crop',
    tags: ['Personal', 'Sustainability', 'Philosophy'],
    color: 'from-yellow-500 to-lime-600'
  },
  {
    prefix: 'grew up in a',
    dropdown: 'purple house',
    link: '/about',
    label: 'Background',
    description: 'A unique upbringing that shaped a creative approach to technology',
    image: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=600&h=400&fit=crop',
    tags: ['Personal Story', 'Creative Origins'],
    color: 'from-violet-500 to-purple-600'
  }
];

const HeroDropdownVisual: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [imageLoaded, setImageLoaded] = useState<{ [key: number]: boolean }>({});
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
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const currentOption = heroOptions[currentIndex];

  const handleOptionClick = (index: number) => {
    setCurrentIndex(index);
    setIsOpen(false);
    setTimeout(() => {
      navigate(heroOptions[index].link);
    }, 300);
  };

  return (
    <section className="min-h-screen flex items-center justify-center relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-background via-secondary/30 to-accent/10" />

      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-300" />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-6xl mx-auto text-left animate-fade-in">
          <h1 className="text-4xl md:text-6xl lg:text-7xl xl:text-8xl font-light mb-8 leading-tight text-left">
            <span className="inline" style={{color: 'hsl(var(--name-purple))'}}>Michael Evans</span>{' '}
            <span className={`text-foreground inline transition-opacity duration-150 ${isTransitioning ? 'opacity-0' : 'opacity-100'}`}>
              {currentOption.prefix}
            </span>{' '}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="group inline-flex items-baseline gap-1"
            >
              <span className={`text-primary transition-opacity duration-150 ${isTransitioning ? 'opacity-0' : 'opacity-100'}`}>
                {currentOption.dropdown}
              </span>
              <ChevronDown className="w-4 h-4 md:w-6 md:h-6 text-primary group-hover:text-accent transition-colors" />
            </button>
          </h1>
        </div>
      </div>

      {/* Modal */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100]"
              onClick={() => setIsOpen(false)}
            />

            {/* Modal Content */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 50 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 50 }}
              transition={{ duration: 0.3, type: "spring", stiffness: 300, damping: 30 }}
              className="fixed inset-x-0 inset-y-0 md:inset-[5%] lg:inset-[10%] z-[101] flex items-center justify-center pointer-events-none"
            >
              <div className="bg-background/95 backdrop-blur-2xl border border-border/50 rounded-3xl shadow-2xl w-full h-full max-w-6xl max-h-[90vh] overflow-hidden pointer-events-auto">
                {/* Header */}
                <div className="px-6 py-4 border-b border-border/30 bg-gradient-to-r from-accent/5 to-accent/10 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-yellow-500 animate-pulse" />
                    <span className="text-lg font-medium">Choose Your Adventure</span>
                  </div>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="p-2 rounded-lg hover:bg-white/10 transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Grid of options */}
                <div className="p-6 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 overflow-y-auto max-h-[calc(90vh-80px)]"
                     style={{ scrollbarWidth: 'thin', scrollbarColor: 'rgba(255,255,255,0.2) transparent' }}>
                  {heroOptions.map((option, index) => (
                    <motion.button
                      key={index}
                      onClick={() => handleOptionClick(index)}
                      onMouseEnter={() => setHoveredIndex(index)}
                      onMouseLeave={() => setHoveredIndex(null)}
                      className={`group relative rounded-xl overflow-hidden bg-card border transition-all duration-300 ${
                        index === currentIndex
                          ? 'border-primary shadow-lg shadow-primary/20 ring-2 ring-primary/20'
                          : 'border-border/50 hover:border-accent/50'
                      }`}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      whileHover={{ scale: 1.03, y: -4 }}
                      whileTap={{ scale: 0.97 }}
                    >
                      {/* Image container */}
                      <div className="relative h-40 overflow-hidden bg-gradient-to-br from-accent/10 to-accent/5">
                        {!imageLoaded[index] && (
                          <div className="absolute inset-0 bg-gradient-to-br from-accent/20 to-accent/10 animate-pulse" />
                        )}
                        <img
                          src={option.image}
                          alt={option.label}
                          className={`w-full h-full object-cover transition-all duration-700 ${
                            hoveredIndex === index ? 'scale-110' : 'scale-100'
                          } ${imageLoaded[index] ? 'opacity-100' : 'opacity-0'}`}
                          onLoad={() => setImageLoaded(prev => ({ ...prev, [index]: true }))}
                        />
                        <div className={`absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent transition-opacity duration-300 ${
                          hoveredIndex === index ? 'opacity-100' : 'opacity-90'
                        }`} />

                        {/* Overlay content */}
                        <div className="absolute bottom-0 left-0 right-0 p-4">
                          <h3 className={`text-lg font-semibold text-white mb-2 transition-all duration-300 ${
                            hoveredIndex === index ? 'translate-y-0' : 'translate-y-1'
                          }`}>
                            {option.label}
                          </h3>

                          {/* Full sentence with Michael Evans */}
                          <p className={`text-xs text-white/90 font-medium line-clamp-2 transition-all duration-300 ${
                            hoveredIndex === index ? 'opacity-100 translate-y-0' : 'opacity-80 translate-y-1'
                          }`}>
                            Michael Evans <span className="text-purple-300">{option.prefix} {option.dropdown}</span>
                          </p>
                        </div>

                        {/* Current indicator */}
                        {index === currentIndex && (
                          <motion.div
                            className="absolute top-3 right-3"
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: "spring", stiffness: 500, damping: 30 }}
                          >
                            <span className="px-2 py-1 text-xs font-bold bg-primary text-primary-foreground rounded-full shadow-lg flex items-center gap-1">
                              <span className="w-2 h-2 bg-white rounded-full animate-pulse" />
                              Active
                            </span>
                          </motion.div>
                        )}

                        {/* Hover arrow */}
                        <motion.div
                          className="absolute top-3 left-3 opacity-0 group-hover:opacity-100"
                          initial={false}
                          animate={{ x: hoveredIndex === index ? 0 : -10 }}
                          transition={{ duration: 0.2 }}
                        >
                          <ArrowRight className="w-5 h-5 text-white drop-shadow-lg" />
                        </motion.div>
                      </div>

                      {/* Tags */}
                      <div className="p-3 bg-background/50">
                        <div className="flex flex-wrap gap-1">
                          {option.tags.map((tag, tagIndex) => (
                            <span
                              key={tagIndex}
                              className="px-2 py-0.5 text-[10px] font-medium bg-accent/20 text-accent-foreground rounded-full"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    </motion.button>
                  ))}
                </div>

                {/* Footer hint */}
                <div className="px-6 py-3 border-t border-border/30 bg-gradient-to-r from-accent/5 to-accent/10">
                  <p className="text-xs text-muted-foreground text-center">
                    Click any option to navigate • Press ESC to close
                  </p>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </section>
  );
};

export default HeroDropdownVisual;