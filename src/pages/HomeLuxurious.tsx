import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ArrowUpRight, Sparkles, Award, Crown, Diamond } from 'lucide-react';
import Navigation from "@/components/Navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface HeroOption {
  prefix: string;
  dropdown: string;
  link: string;
  label: string;
  accent: string;
}

const heroOptions: HeroOption[] = [
  {
    prefix: 'shipped the first responsive',
    dropdown: 'airline website',
    link: '/case-studies/virgin-america',
    label: 'Virgin America',
    accent: 'from-rose-600 to-pink-700'
  },
  {
    prefix: 'launched a restaurant with',
    dropdown: 'cliff diving',
    link: '/case-studies/casa-bonita',
    label: 'Casa Bonita',
    accent: 'from-amber-600 to-orange-700'
  },
  {
    prefix: 'built production apps with',
    dropdown: 'AI',
    link: '/ai-showcase',
    label: 'AI Showcase',
    accent: 'from-violet-600 to-indigo-700'
  },
  {
    prefix: 'helped thousands',
    dropdown: 'focus',
    link: '/case-studies/before-launcher',
    label: 'Before Launcher',
    accent: 'from-emerald-600 to-teal-700'
  },
];

const HomeLuxurious: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);

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
      subtitle: "Digital Excellence",
      description: "Pioneered the first responsive airline website, setting new standards for digital travel experiences",
      metric: "15% Conversion Lift",
      awards: ["Webby Award", "UX Award", "Cannes Lions"],
      gradient: "from-rose-600 to-pink-700",
      link: "/case-studies/virgin-america"
    },
    {
      title: "Casa Bonita",
      subtitle: "Experiential Design",
      description: "Revived a cultural icon with immersive entertainment and theatrical dining experiences",
      metric: "Cultural Renaissance",
      awards: ["Experience Design", "Innovation Award"],
      gradient: "from-amber-600 to-orange-700",
      link: "/case-studies/casa-bonita"
    },
    {
      title: "Before Launcher",
      subtitle: "Mindful Technology",
      description: "Created a minimalist launcher helping thousands reclaim their attention and focus",
      metric: "100,000+ Lives Improved",
      awards: ["Product Hunt", "Google Play Editor's Choice"],
      gradient: "from-emerald-600 to-teal-700",
      link: "/case-studies/before-launcher"
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-white">
      {/* Luxury pattern overlay */}
      <div className="fixed inset-0 opacity-[0.015] pointer-events-none">
        <svg width="100%" height="100%">
          <pattern id="luxury-pattern" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
            <circle cx="20" cy="20" r="1" fill="white" />
          </pattern>
          <rect width="100%" height="100%" fill="url(#luxury-pattern)" />
        </svg>
      </div>

      <Navigation />

      {/* Premium Hero Section */}
      <section className="relative pt-32 pb-20 px-6 overflow-hidden">
        {/* Animated gradient orbs */}
        <motion.div
          className="absolute top-20 right-20 w-96 h-96 bg-gradient-to-r from-amber-500/20 to-orange-500/20 rounded-full blur-3xl"
          animate={{
            x: [0, 50, 0],
            y: [0, -30, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
        />
        <motion.div
          className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-r from-violet-500/20 to-indigo-500/20 rounded-full blur-3xl"
          animate={{
            x: [0, -30, 0],
            y: [0, 50, 0],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "linear"
          }}
        />

        <div className="container mx-auto max-w-6xl relative z-10">
          <div className="max-w-4xl">
            <div className="mb-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="inline-flex items-center gap-2 text-amber-400 mb-6"
              >
                <Crown className="w-4 h-4" />
                <span className="text-sm font-light tracking-widest uppercase">Premium Portfolio</span>
              </motion.div>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-light mb-8 leading-tight">
              <span className="bg-gradient-to-r from-amber-300 via-amber-400 to-amber-300 bg-clip-text text-transparent">
                Michael Evans
              </span>
              <br />
              <span className={`text-gray-300 transition-opacity duration-150 ${isTransitioning ? 'opacity-0' : 'opacity-100'}`}>
                {currentOption.prefix}
              </span>{' '}
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="inline-flex items-baseline gap-2 group"
              >
                <span className={`bg-gradient-to-r ${currentOption.accent} bg-clip-text text-transparent font-medium transition-opacity duration-150 ${isTransitioning ? 'opacity-0' : 'opacity-100'}`}>
                  {currentOption.dropdown}
                </span>
                <ChevronDown className="w-4 h-4 text-amber-400 group-hover:text-amber-300 transition-colors" />
              </button>
            </h1>

            <p className="text-xl text-gray-400 font-light leading-relaxed">
              Crafting exceptional digital experiences at the intersection of
              <span className="text-amber-400/80"> strategy</span>,
              <span className="text-amber-400/80"> design</span>, and
              <span className="text-amber-400/80"> innovation</span>
            </p>
          </div>
        </div>
      </section>

      {/* Signature Projects */}
      <section className="py-20 px-6 relative">
        <div className="container mx-auto max-w-6xl">
          <div className="mb-16 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 text-amber-400 mb-4"
            >
              <Diamond className="w-4 h-4" />
              <span className="text-sm font-light tracking-widest uppercase">Signature Work</span>
              <Diamond className="w-4 h-4" />
            </motion.div>
            <h2 className="text-3xl md:text-4xl font-light text-white">
              Exceptional Projects, Extraordinary Results
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {caseStudies.map((study, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -8 }}
                onHoverStart={() => setHoveredCard(index)}
                onHoverEnd={() => setHoveredCard(null)}
              >
                <Link to={study.link} className="block h-full">
                  <Card className="relative h-full bg-gradient-to-b from-slate-800/50 to-slate-900/50 border-slate-700/50 backdrop-blur-sm overflow-hidden group">
                    {/* Gradient accent line */}
                    <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${study.gradient}`} />

                    {/* Hover glow effect */}
                    <motion.div
                      className={`absolute inset-0 bg-gradient-to-r ${study.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-500`}
                    />

                    <CardContent className="p-8">
                      <div className="mb-6">
                        <h3 className="text-2xl font-light text-white mb-2">
                          {study.title}
                        </h3>
                        <p className="text-sm text-amber-400/80 font-light tracking-wide uppercase">
                          {study.subtitle}
                        </p>
                      </div>

                      <p className="text-gray-400 mb-8 leading-relaxed">
                        {study.description}
                      </p>

                      <div className="mb-6">
                        <div className={`text-lg font-light bg-gradient-to-r ${study.gradient} bg-clip-text text-transparent`}>
                          {study.metric}
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-xs text-gray-500">
                          <Award className="w-3 h-3" />
                          <span>Recognition</span>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {study.awards.map((award, i) => (
                            <Badge
                              key={i}
                              variant="outline"
                              className="text-[10px] border-slate-700 text-gray-400 bg-slate-800/50"
                            >
                              {award}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      <motion.div
                        className="mt-6 flex items-center gap-2 text-amber-400 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <span className="text-sm">View Case Study</span>
                        <ArrowUpRight className="w-4 h-4" />
                      </motion.div>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Excellence Metrics */}
      <section className="py-20 px-6 relative">
        <div className="container mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-r from-slate-800/30 via-slate-800/50 to-slate-800/30 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-12"
          >
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              {[
                { label: "Years of Excellence", value: "20+" },
                { label: "Award-Winning Projects", value: "15+" },
                { label: "Lives Impacted", value: "1M+" },
                { label: "Industries Transformed", value: "8" },
              ].map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <div className="text-3xl md:text-4xl font-light bg-gradient-to-r from-amber-400 to-amber-300 bg-clip-text text-transparent mb-2">
                    {stat.value}
                  </div>
                  <div className="text-xs text-gray-500 uppercase tracking-wider">
                    {stat.label}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Services */}
      <section className="py-20 px-6 relative">
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: <Sparkles className="w-6 h-6" />,
                title: "AI Innovation",
                description: "Pioneering next-generation AI applications",
                link: "/ai-showcase"
              },
              {
                icon: <Crown className="w-6 h-6" />,
                title: "Premium Design",
                description: "Crafting luxury digital experiences",
                link: "/capabilities"
              },
              {
                icon: <Diamond className="w-6 h-6" />,
                title: "Strategic Excellence",
                description: "Transforming visions into reality",
                link: "/about"
              }
            ].map((service, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Link to={service.link} className="block group">
                  <div className="bg-gradient-to-b from-slate-800/30 to-slate-900/30 backdrop-blur-sm border border-slate-700/50 rounded-xl p-8 hover:border-amber-400/30 transition-all duration-500">
                    <div className="text-amber-400 mb-4">
                      {service.icon}
                    </div>
                    <h3 className="text-xl font-light text-white mb-3">
                      {service.title}
                    </h3>
                    <p className="text-gray-400 text-sm leading-relaxed mb-4">
                      {service.description}
                    </p>
                    <div className="flex items-center gap-2 text-amber-400/60 group-hover:text-amber-400 transition-colors">
                      <span className="text-sm">Explore</span>
                      <ArrowUpRight className="w-3 h-3" />
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Luxurious Dropdown Modal */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-slate-950/95 backdrop-blur-xl z-50"
              onClick={() => setIsOpen(false)}
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-2xl"
            >
              <div className="bg-gradient-to-b from-slate-800/90 to-slate-900/90 backdrop-blur-2xl border border-slate-700/50 rounded-2xl shadow-2xl p-8">
                <div className="mb-6 text-center">
                  <div className="inline-flex items-center gap-2 text-amber-400 mb-3">
                    <Sparkles className="w-4 h-4" />
                    <span className="text-sm font-light tracking-widest uppercase">Select Experience</span>
                    <Sparkles className="w-4 h-4" />
                  </div>
                </div>

                <div className="space-y-3">
                  {heroOptions.map((option, index) => (
                    <Link
                      key={index}
                      to={option.link}
                      onClick={() => setIsOpen(false)}
                      className={`block relative overflow-hidden rounded-xl transition-all duration-300 ${
                        index === currentIndex
                          ? 'bg-gradient-to-r from-slate-700/50 to-slate-800/50 border border-amber-400/50'
                          : 'bg-slate-800/30 border border-slate-700/30 hover:border-slate-600/50'
                      }`}
                    >
                      <div className="p-6">
                        <div className="text-sm text-gray-400 mb-2">
                          {option.prefix} {option.dropdown}
                        </div>
                        <div className="flex items-center justify-between">
                          <span className={`text-lg font-light bg-gradient-to-r ${option.accent} bg-clip-text text-transparent`}>
                            {option.label}
                          </span>
                          <ArrowUpRight className="w-4 h-4 text-amber-400/60" />
                        </div>
                      </div>
                      {index === currentIndex && (
                        <motion.div
                          className={`absolute inset-0 bg-gradient-to-r ${option.accent} opacity-5`}
                          layoutId="highlight"
                        />
                      )}
                    </Link>
                  ))}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default HomeLuxurious;