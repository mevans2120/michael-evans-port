import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { X, ArrowRight, Sparkles, Brain, Code, Palette, Rocket, Users } from "lucide-react";
import { cn } from "@/lib/utils";

interface ProjectPreview {
  path: string;
  title: string;
  category: string;
  description: string;
  image: string;
  color: string;
  icon: React.ReactNode;
  tags: string[];
}

const NavigationVisualRich: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [hoveredProject, setHoveredProject] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const location = useLocation();

  // Close menu on route change
  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  // Project data with visual previews
  const projects: ProjectPreview[] = [
    {
      path: "/",
      title: "Home",
      category: "navigation",
      description: "Welcome to my creative technology portfolio",
      image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop",
      color: "from-violet-600 to-indigo-600",
      icon: <Sparkles className="w-5 h-5" />,
      tags: ["Portfolio", "Overview"],
    },
    {
      path: "/about",
      title: "About Me",
      category: "navigation",
      description: "Creative technologist bridging AI and design",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&auto=format&fit=crop",
      color: "from-blue-600 to-cyan-600",
      icon: <Users className="w-5 h-5" />,
      tags: ["Background", "Experience"],
    },
    {
      path: "/capabilities",
      title: "Capabilities",
      category: "navigation",
      description: "Full-stack development, AI/ML, and creative solutions",
      image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&auto=format&fit=crop",
      color: "from-emerald-600 to-green-600",
      icon: <Code className="w-5 h-5" />,
      tags: ["Skills", "Tech Stack"],
    },
    {
      path: "/case-studies/casa-bonita",
      title: "Casa Bonita",
      category: "case-study",
      description: "AI-powered restaurant platform revolutionizing dining experiences",
      image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&auto=format&fit=crop",
      color: "from-orange-600 to-amber-600",
      icon: <Palette className="w-5 h-5" />,
      tags: ["Restaurant Tech", "AI", "Platform"],
    },
    {
      path: "/case-studies/virgin-america",
      title: "Virgin America",
      category: "case-study",
      description: "Redesigning the digital flight experience from ground to sky",
      image: "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=800&auto=format&fit=crop",
      color: "from-red-600 to-pink-600",
      icon: <Rocket className="w-5 h-5" />,
      tags: ["Aviation", "UX", "Digital"],
    },
    {
      path: "/case-studies/before-launcher",
      title: "Before Launcher",
      category: "case-study",
      description: "Pre-launch platform for validating and building startups",
      image: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=800&auto=format&fit=crop",
      color: "from-purple-600 to-violet-600",
      icon: <Rocket className="w-5 h-5" />,
      tags: ["Startup", "Platform", "SaaS"],
    },
    {
      path: "/case-studies/peddle",
      title: "Peddle",
      category: "case-study",
      description: "P2P marketplace connecting buyers and sellers seamlessly",
      image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&auto=format&fit=crop",
      color: "from-teal-600 to-cyan-600",
      icon: <Users className="w-5 h-5" />,
      tags: ["Marketplace", "E-commerce", "P2P"],
    },
    {
      path: "/ai-showcase",
      title: "AI Showcase",
      category: "ai",
      description: "Cutting-edge AI experiments and creative applications",
      image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&auto=format&fit=crop",
      color: "from-fuchsia-600 to-pink-600",
      icon: <Brain className="w-5 h-5" />,
      tags: ["AI", "Machine Learning", "Demos"],
    },
    {
      path: "/ai-research",
      title: "AI Research",
      category: "ai",
      description: "Deep dives into neural networks and AI architectures",
      image: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=800&auto=format&fit=crop",
      color: "from-slate-600 to-gray-600",
      icon: <Brain className="w-5 h-5" />,
      tags: ["Research", "Papers", "Theory"],
    },
  ];

  const categories = [
    { id: "all", label: "All Projects", count: projects.length },
    { id: "navigation", label: "Main", count: 3 },
    { id: "case-study", label: "Case Studies", count: 4 },
    { id: "ai", label: "AI & Research", count: 2 },
  ];

  const filteredProjects = activeCategory === "all"
    ? projects
    : projects.filter(p => p.category === activeCategory);

  return (
    <>
      {/* Fixed Header Bar */}
      <nav
        className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-b border-gray-200 dark:border-gray-800"
        role="navigation"
        aria-label="Visual navigation"
      >
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center text-white font-bold group-hover:scale-110 transition-transform">
                ME
              </div>
              <span className="text-lg font-medium text-gray-900 dark:text-white hidden sm:block">
                Michael Evans
              </span>
            </Link>

            {/* Menu Toggle */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className={cn(
                "relative p-3 rounded-xl transition-all duration-300",
                "bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700",
                isOpen && "bg-gradient-to-br from-violet-500 to-purple-600 text-white"
              )}
              aria-expanded={isOpen}
              aria-label="Toggle visual menu"
            >
              {isOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <div className="flex flex-col gap-1.5">
                  <div className="w-5 h-0.5 bg-current rounded-full" />
                  <div className="w-3.5 h-0.5 bg-current rounded-full" />
                  <div className="w-5 h-0.5 bg-current rounded-full" />
                </div>
              )}
              {!isOpen && (
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-gradient-to-br from-violet-500 to-purple-600 rounded-full animate-pulse" />
              )}
            </button>
          </div>
        </div>
      </nav>

      {/* Full Screen Visual Menu */}
      <div
        className={cn(
          "fixed inset-0 z-40 bg-white dark:bg-gray-900 transition-all duration-500",
          isOpen ? "opacity-100 visible" : "opacity-0 invisible pointer-events-none"
        )}
      >
        <div className="h-full overflow-y-auto pt-20 pb-8">
          <div className="container mx-auto px-6">
            {/* Category Filter */}
            <div className="flex flex-wrap gap-2 mb-8">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={cn(
                    "px-4 py-2 rounded-full text-sm font-medium transition-all duration-300",
                    activeCategory === cat.id
                      ? "bg-gradient-to-r from-violet-500 to-purple-600 text-white shadow-lg"
                      : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
                  )}
                >
                  {cat.label}
                  <span className="ml-2 text-xs opacity-70">({cat.count})</span>
                </button>
              ))}
            </div>

            {/* Project Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProjects.map((project) => {
                const isHovered = hoveredProject === project.path;
                const isActive = location.pathname === project.path;

                return (
                  <Link
                    key={project.path}
                    to={project.path}
                    className="group relative"
                    onMouseEnter={() => setHoveredProject(project.path)}
                    onMouseLeave={() => setHoveredProject(null)}
                  >
                    <div
                      className={cn(
                        "relative rounded-2xl overflow-hidden transition-all duration-500",
                        "bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700",
                        "hover:shadow-2xl hover:scale-[1.02] hover:border-transparent",
                        isActive && "ring-2 ring-violet-500 ring-offset-2"
                      )}
                    >
                      {/* Image Section */}
                      <div className="relative h-48 overflow-hidden">
                        <img
                          src={project.image}
                          alt={project.title}
                          className={cn(
                            "w-full h-full object-cover transition-all duration-700",
                            isHovered && "scale-110"
                          )}
                        />
                        <div
                          className={cn(
                            "absolute inset-0 bg-gradient-to-br opacity-60 mix-blend-multiply",
                            project.color
                          )}
                        />

                        {/* Overlay Content */}
                        <div className="absolute inset-0 flex items-end p-4">
                          <div className="flex items-center gap-2 text-white">
                            {project.icon}
                            <span className="text-xs uppercase tracking-wider opacity-90">
                              {project.category.replace("-", " ")}
                            </span>
                          </div>
                        </div>

                        {/* Active Indicator */}
                        {isActive && (
                          <div className="absolute top-4 right-4 w-3 h-3 bg-white rounded-full animate-pulse" />
                        )}
                      </div>

                      {/* Content Section */}
                      <div className="p-5">
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-violet-500 group-hover:to-purple-600 transition-all">
                          {project.title}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
                          {project.description}
                        </p>

                        {/* Tags */}
                        <div className="flex flex-wrap gap-2 mb-4">
                          {project.tags.map((tag) => (
                            <span
                              key={tag}
                              className="px-2 py-1 text-xs rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>

                        {/* Action */}
                        <div className="flex items-center gap-2 text-violet-600 dark:text-violet-400 group-hover:gap-3 transition-all">
                          <span className="text-sm font-medium">Explore</span>
                          <ArrowRight className="w-4 h-4" />
                        </div>
                      </div>
                    </div>

                    {/* Hover Glow Effect */}
                    {isHovered && (
                      <div
                        className={cn(
                          "absolute inset-0 -z-10 blur-2xl opacity-20 bg-gradient-to-br",
                          project.color
                        )}
                      />
                    )}
                  </Link>
                );
              })}
            </div>

            {/* Quick Contact */}
            <div className="mt-12 text-center">
              <a
                href="mailto:hello@mevans212.com"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-violet-500 to-purple-600 text-white font-medium hover:shadow-lg hover:scale-105 transition-all"
              >
                Get in Touch
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default NavigationVisualRich;