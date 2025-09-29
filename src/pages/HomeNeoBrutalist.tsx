import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ArrowRight, Zap, Grid, Box, Layers, Terminal, Globe } from 'lucide-react';
import Navigation from "@/components/Navigation";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface HeroOption {
  prefix: string;
  dropdown: string;
  link: string;
  label: string;
  color: string;
}

const heroOptions: HeroOption[] = [
  {
    prefix: 'SHIPPED THE FIRST RESPONSIVE',
    dropdown: 'AIRLINE WEBSITE',
    link: '/case-studies/virgin-america',
    label: 'VIRGIN AMERICA',
    color: 'bg-red-500'
  },
  {
    prefix: 'LAUNCHED A RESTAURANT WITH',
    dropdown: 'CLIFF DIVING',
    link: '/case-studies/casa-bonita',
    label: 'CASA BONITA',
    color: 'bg-orange-500'
  },
  {
    prefix: 'BUILT PRODUCTION APPS WITH',
    dropdown: 'AI',
    link: '/ai-showcase',
    label: 'AI SHOWCASE',
    color: 'bg-blue-500'
  },
  {
    prefix: 'HELPED THOUSANDS',
    dropdown: 'FOCUS',
    link: '/case-studies/before-launcher',
    label: 'BEFORE LAUNCHER',
    color: 'bg-green-500'
  },
];

const HomeNeoBrutalist: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [glitchActive, setGlitchActive] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      const interval = setInterval(() => {
        setIsTransitioning(true);
        setGlitchActive(true);
        setTimeout(() => {
          setCurrentIndex((prevIndex) => (prevIndex + 1) % heroOptions.length);
          setIsTransitioning(false);
          setTimeout(() => setGlitchActive(false), 100);
        }, 150);
      }, 3500);

      return () => clearInterval(interval);
    }
  }, [isOpen]);

  const currentOption = heroOptions[currentIndex];

  const projects = [
    {
      number: "001",
      title: "VIRGIN AMERICA",
      type: "WEB DESIGN",
      description: "RESPONSIVE AIRLINE INTERFACE",
      stat: "15% LIFT",
      color: "bg-red-500",
      borderColor: "border-red-500",
      link: "/case-studies/virgin-america"
    },
    {
      number: "002",
      title: "CASA BONITA",
      type: "EXPERIENCE",
      description: "IMMERSIVE ENTERTAINMENT SPACE",
      stat: "ICON STATUS",
      color: "bg-orange-500",
      borderColor: "border-orange-500",
      link: "/case-studies/casa-bonita"
    },
    {
      number: "003",
      title: "AI APPLICATIONS",
      type: "TECHNOLOGY",
      description: "PRODUCTION-READY AI TOOLS",
      stat: "4 APPS",
      color: "bg-blue-500",
      borderColor: "border-blue-500",
      link: "/ai-showcase"
    },
    {
      number: "004",
      title: "BEFORE LAUNCHER",
      type: "MOBILE APP",
      description: "MINIMALIST ANDROID LAUNCHER",
      stat: "100K USERS",
      color: "bg-green-500",
      borderColor: "border-green-500",
      link: "/case-studies/before-launcher"
    },
  ];

  const capabilities = [
    { icon: <Terminal className="w-6 h-6" />, label: "FULL-STACK", years: "10 YRS" },
    { icon: <Layers className="w-6 h-6" />, label: "PRODUCT", years: "20 YRS" },
    { icon: <Zap className="w-6 h-6" />, label: "AI/ML", years: "5 YRS" },
    { icon: <Globe className="w-6 h-6" />, label: "UX/UI", years: "15 YRS" },
  ];

  return (
    <div className="min-h-screen bg-yellow-50 text-black overflow-x-hidden">
      {/* Grid Pattern Background */}
      <div className="fixed inset-0 opacity-10 pointer-events-none">
        <div className="absolute inset-0" style={{
          backgroundImage: `repeating-linear-gradient(0deg, black 0px, transparent 1px, transparent 40px, black 41px),
                           repeating-linear-gradient(90deg, black 0px, transparent 1px, transparent 40px, black 41px)`
        }} />
      </div>

      <Navigation />

      {/* Hero Section */}
      <section className="relative pt-24 pb-16 px-4 md:px-8">
        <div className="container mx-auto max-w-7xl">
          {/* Decorative shapes */}
          <motion.div
            className="absolute top-20 right-10 w-32 h-32 bg-blue-500 rotate-12"
            animate={{ rotate: [12, -12, 12] }}
            transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
          />
          <motion.div
            className="absolute bottom-0 left-20 w-24 h-24 bg-red-500"
            animate={{ y: [0, -20, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          />

          <div className="relative z-10">
            {/* Name Header */}
            <div className="mb-8">
              <motion.div
                className="inline-block bg-black text-yellow-50 px-6 py-3 mb-4 transform -rotate-1"
                whileHover={{ rotate: 0 }}
              >
                <h2 className="text-2xl md:text-3xl font-black tracking-tight">
                  MICHAEL EVANS
                </h2>
              </motion.div>
            </div>

            {/* Interactive Sentence */}
            <div className="max-w-5xl">
              <h1 className={`text-3xl md:text-4xl lg:text-5xl font-black leading-tight uppercase ${glitchActive ? 'animate-pulse' : ''}`}>
                <span className={`inline-block transition-opacity duration-150 ${isTransitioning ? 'opacity-0' : 'opacity-100'}`}>
                  {currentOption.prefix}
                </span>{' '}
                <button
                  onClick={() => setIsOpen(!isOpen)}
                  className="inline-flex items-baseline gap-2 group relative"
                >
                  <span className={`${currentOption.color} text-white px-3 py-1 inline-block transform transition-all duration-150 hover:scale-105 ${isTransitioning ? 'opacity-0' : 'opacity-100'}`}>
                    {currentOption.dropdown}
                  </span>
                  <ChevronDown className="w-5 h-5 transform group-hover:rotate-180 transition-transform duration-300" />
                </button>
              </h1>

              <div className="mt-6 flex flex-wrap gap-3">
                <Badge className="bg-black text-yellow-50 hover:bg-gray-900 text-xs font-bold px-3 py-2 border-2 border-black">
                  STRATEGIST
                </Badge>
                <Badge className="bg-transparent text-black hover:bg-black hover:text-yellow-50 text-xs font-bold px-3 py-2 border-2 border-black">
                  DEVELOPER
                </Badge>
                <Badge className="bg-transparent text-black hover:bg-black hover:text-yellow-50 text-xs font-bold px-3 py-2 border-2 border-black">
                  DESIGNER
                </Badge>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Projects Grid */}
      <section className="py-16 px-4 md:px-8 bg-white border-t-8 border-black">
        <div className="container mx-auto max-w-7xl">
          <div className="mb-12">
            <h2 className="text-6xl md:text-7xl font-black mb-4">
              WORK
            </h2>
            <div className="h-2 bg-black w-32" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {projects.map((project, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ x: -8, y: -8 }}
                className="relative"
              >
                <Link to={project.link} className="block">
                  {/* Shadow card */}
                  <div className={`absolute inset-0 ${project.color} transform translate-x-2 translate-y-2`} />

                  {/* Main card */}
                  <Card className={`relative bg-yellow-50 border-4 border-black p-8 hover:bg-white transition-colors`}>
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <div className="text-xs font-black mb-1">{project.number}</div>
                        <h3 className="text-2xl font-black mb-2">{project.title}</h3>
                        <div className={`inline-block ${project.color} text-white text-xs font-bold px-2 py-1`}>
                          {project.type}
                        </div>
                      </div>
                      <motion.div
                        whileHover={{ rotate: 90 }}
                        className="bg-black text-yellow-50 p-2"
                      >
                        <ArrowRight className="w-6 h-6" />
                      </motion.div>
                    </div>

                    <p className="text-sm font-bold mb-4 uppercase">
                      {project.description}
                    </p>

                    <div className="border-t-4 border-black pt-4">
                      <div className="text-3xl font-black">{project.stat}</div>
                    </div>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Capabilities Section */}
      <section className="py-16 px-4 md:px-8 bg-black text-yellow-50">
        <div className="container mx-auto max-w-7xl">
          <div className="mb-12">
            <h2 className="text-6xl md:text-7xl font-black mb-4">
              SKILLS
            </h2>
            <div className="h-2 bg-yellow-50 w-32" />
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {capabilities.map((cap, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.1 }}
                className="bg-yellow-50 text-black border-4 border-yellow-50 p-6 text-center"
              >
                <div className="flex justify-center mb-4">
                  {cap.icon}
                </div>
                <div className="font-black text-sm mb-2">{cap.label}</div>
                <div className="text-2xl font-black">{cap.years}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16 px-4 md:px-8 bg-blue-500 border-t-8 border-black">
        <div className="container mx-auto max-w-7xl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Link to="/ai-research" className="group">
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="bg-yellow-50 border-4 border-black p-6 group-hover:bg-white transition-colors"
              >
                <Box className="w-8 h-8 mb-3" />
                <h3 className="font-black text-xl mb-2">AI RESEARCH</h3>
                <p className="text-sm font-bold uppercase">Rapid Prototyping</p>
                <ArrowRight className="w-5 h-5 mt-3 group-hover:translate-x-2 transition-transform" />
              </motion.div>
            </Link>

            <Link to="/about" className="group">
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="bg-yellow-50 border-4 border-black p-6 group-hover:bg-white transition-colors"
              >
                <Grid className="w-8 h-8 mb-3" />
                <h3 className="font-black text-xl mb-2">ABOUT</h3>
                <p className="text-sm font-bold uppercase">The Purple House</p>
                <ArrowRight className="w-5 h-5 mt-3 group-hover:translate-x-2 transition-transform" />
              </motion.div>
            </Link>

            <Link to="/capabilities" className="group">
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="bg-yellow-50 border-4 border-black p-6 group-hover:bg-white transition-colors"
              >
                <Layers className="w-8 h-8 mb-3" />
                <h3 className="font-black text-xl mb-2">SERVICES</h3>
                <p className="text-sm font-bold uppercase">Full Stack Solutions</p>
                <ArrowRight className="w-5 h-5 mt-3 group-hover:translate-x-2 transition-transform" />
              </motion.div>
            </Link>
          </div>
        </div>
      </section>

      {/* Neo-Brutalist Dropdown Modal */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/80 z-50"
              onClick={() => setIsOpen(false)}
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.8, rotate: -5 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              exit={{ opacity: 0, scale: 0.8, rotate: 5 }}
              className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-xl"
            >
              {/* Shadow */}
              <div className="absolute inset-0 bg-black transform translate-x-4 translate-y-4" />

              {/* Main modal */}
              <div className="relative bg-yellow-50 border-8 border-black p-8">
                <h2 className="text-3xl font-black mb-6 uppercase">Select Path</h2>

                <div className="space-y-4">
                  {heroOptions.map((option, index) => (
                    <Link
                      key={index}
                      to={option.link}
                      onClick={() => setIsOpen(false)}
                      className="block"
                    >
                      <motion.div
                        whileHover={{ x: -4, y: -4 }}
                        className={`relative border-4 border-black p-4 ${
                          index === currentIndex ? 'bg-black text-yellow-50' : 'bg-white hover:bg-gray-100'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="text-xs font-black mb-1">
                              {option.prefix} {option.dropdown}
                            </div>
                            <div className="text-xl font-black">
                              {option.label}
                            </div>
                          </div>
                          <div className={`${option.color} p-2 ${index === currentIndex ? 'bg-yellow-50 text-black' : 'text-white'}`}>
                            <ArrowRight className="w-5 h-5" />
                          </div>
                        </div>
                      </motion.div>
                      {/* Item shadow */}
                      {index === currentIndex && (
                        <div className={`absolute inset-0 ${option.color} transform translate-x-2 translate-y-2 -z-10`} />
                      )}
                    </Link>
                  ))}
                </div>

                {/* Close button */}
                <button
                  onClick={() => setIsOpen(false)}
                  className="mt-6 bg-black text-yellow-50 font-black px-6 py-3 border-4 border-black hover:bg-red-500 transition-colors"
                >
                  CLOSE [ESC]
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default HomeNeoBrutalist;