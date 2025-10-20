import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";

interface MenuItem {
  path: string;
  label: string;
  shortLabel?: string;
  section?: string;
}

const NavigationUltraClean: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);

  const menuItems: MenuItem[] = [
    { path: "/", label: "Home", shortLabel: "ME" },
    { path: "/about", label: "About" },
    { path: "/capabilities", label: "Capabilities" },
    { path: "/case-studies/casa-bonita", label: "Casa Bonita", section: "work" },
    { path: "/case-studies/virgin-america", label: "Virgin America", section: "work" },
    { path: "/case-studies/before-launcher", label: "Before Launcher", section: "work" },
    { path: "/case-studies/peddle", label: "Peddle", section: "work" },
    { path: "/ai-showcase", label: "AI Showcase", section: "research" },
    { path: "/ai-research", label: "Research", section: "research" },
  ];

  const mainItems = menuItems.filter(item => !item.section);
  const workItems = menuItems.filter(item => item.section === "work");
  const researchItems = menuItems.filter(item => item.section === "research");

  const isActive = (path: string) => location.pathname === path;

  return (
    <>
      {/* Desktop Navigation */}
      <nav
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-700 ease-out",
          "border-b",
          isScrolled
            ? "bg-white/90 dark:bg-gray-950/90 backdrop-blur-md border-gray-200 dark:border-gray-800"
            : "bg-white/60 dark:bg-gray-950/60 backdrop-blur-sm border-gray-100 dark:border-gray-900"
        )}
        role="navigation"
        aria-label="Main navigation"
      >
        <div className="container mx-auto px-6">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link
              to="/"
              className="relative group"
              aria-label="Michael Evans - Home"
            >
              <span className="text-sm font-light tracking-[0.3em] uppercase text-gray-900 dark:text-gray-100">
                Michael Evans
              </span>
              <div
                className={cn(
                  "absolute -bottom-0.5 left-0 h-px bg-gray-900 dark:bg-gray-100 transition-all duration-500",
                  isActive("/") ? "w-full" : "w-0 group-hover:w-full"
                )}
              />
            </Link>

            {/* Desktop Menu */}
            <div className="hidden lg:flex items-center gap-12">
              {/* Main Navigation */}
              <div className="flex items-center gap-8">
                {mainItems.slice(1).map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={cn(
                      "relative text-sm font-light tracking-wide transition-all duration-300",
                      isActive(item.path)
                        ? "text-gray-900 dark:text-gray-100"
                        : "text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100"
                    )}
                  >
                    {item.label}
                    {isActive(item.path) && (
                      <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-1 h-1 bg-gray-900 dark:bg-gray-100 rounded-full" />
                    )}
                  </Link>
                ))}
              </div>

              {/* Work Dropdown */}
              <div className="relative group">
                <button
                  className={cn(
                    "text-sm font-light tracking-wide transition-all duration-300",
                    workItems.some(item => isActive(item.path))
                      ? "text-gray-900 dark:text-gray-100"
                      : "text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100"
                  )}
                  aria-haspopup="true"
                  aria-expanded="false"
                >
                  Work
                </button>
                <div className="absolute top-full pt-4 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300">
                  <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg shadow-xl p-2 min-w-[200px]">
                    {workItems.map((item) => (
                      <Link
                        key={item.path}
                        to={item.path}
                        className={cn(
                          "block px-4 py-2.5 text-sm rounded-md transition-all duration-200",
                          isActive(item.path)
                            ? "bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                            : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800/50 hover:text-gray-900 dark:hover:text-gray-100"
                        )}
                      >
                        {item.label}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>

              {/* Research Dropdown */}
              <div className="relative group">
                <button
                  className={cn(
                    "text-sm font-light tracking-wide transition-all duration-300",
                    researchItems.some(item => isActive(item.path))
                      ? "text-gray-900 dark:text-gray-100"
                      : "text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100"
                  )}
                  aria-haspopup="true"
                  aria-expanded="false"
                >
                  AI
                </button>
                <div className="absolute top-full pt-4 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300">
                  <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg shadow-xl p-2 min-w-[180px]">
                    {researchItems.map((item) => (
                      <Link
                        key={item.path}
                        to={item.path}
                        className={cn(
                          "block px-4 py-2.5 text-sm rounded-md transition-all duration-200",
                          isActive(item.path)
                            ? "bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                            : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800/50 hover:text-gray-900 dark:hover:text-gray-100"
                        )}
                      >
                        {item.label}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>

              {/* Contact */}
              <a
                href="mailto:hello@mevans212.com"
                className="text-sm font-light tracking-wide text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors duration-300"
              >
                Contact
              </a>
            </div>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2"
              aria-expanded={isMobileMenuOpen}
              aria-label="Toggle menu"
            >
              <div className="w-6 h-5 flex flex-col justify-between">
                <span
                  className={cn(
                    "w-full h-px bg-gray-900 dark:bg-gray-100 transition-all duration-300 origin-left",
                    isMobileMenuOpen && "rotate-45 translate-y-px"
                  )}
                />
                <span
                  className={cn(
                    "w-full h-px bg-gray-900 dark:bg-gray-100 transition-all duration-300",
                    isMobileMenuOpen && "opacity-0 translate-x-2"
                  )}
                />
                <span
                  className={cn(
                    "w-full h-px bg-gray-900 dark:bg-gray-100 transition-all duration-300 origin-left",
                    isMobileMenuOpen && "-rotate-45 -translate-y-px"
                  )}
                />
              </div>
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      <div
        className={cn(
          "fixed inset-x-0 top-16 z-40 lg:hidden transition-all duration-500 ease-out",
          isMobileMenuOpen
            ? "opacity-100 visible translate-y-0"
            : "opacity-0 invisible -translate-y-4"
        )}
      >
        <div className="bg-white dark:bg-gray-950 border-b border-gray-200 dark:border-gray-800">
          <div className="container mx-auto px-6 py-8">
            <div className="space-y-6">
              {/* Main Items */}
              <div className="space-y-3">
                {mainItems.slice(1).map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={cn(
                      "block text-lg font-light tracking-wide transition-colors duration-200",
                      isActive(item.path)
                        ? "text-gray-900 dark:text-gray-100"
                        : "text-gray-600 dark:text-gray-400"
                    )}
                  >
                    {item.label}
                  </Link>
                ))}
              </div>

              {/* Work Section */}
              <div className="pt-6 border-t border-gray-200 dark:border-gray-800">
                <h3 className="text-xs font-light uppercase tracking-[0.2em] text-gray-500 dark:text-gray-500 mb-3">
                  Work
                </h3>
                <div className="space-y-3">
                  {workItems.map((item) => (
                    <Link
                      key={item.path}
                      to={item.path}
                      className={cn(
                        "block text-base font-light transition-colors duration-200",
                        isActive(item.path)
                          ? "text-gray-900 dark:text-gray-100"
                          : "text-gray-600 dark:text-gray-400"
                      )}
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
              </div>

              {/* Research Section */}
              <div className="pt-6 border-t border-gray-200 dark:border-gray-800">
                <h3 className="text-xs font-light uppercase tracking-[0.2em] text-gray-500 dark:text-gray-500 mb-3">
                  AI Research
                </h3>
                <div className="space-y-3">
                  {researchItems.map((item) => (
                    <Link
                      key={item.path}
                      to={item.path}
                      className={cn(
                        "block text-base font-light transition-colors duration-200",
                        isActive(item.path)
                          ? "text-gray-900 dark:text-gray-100"
                          : "text-gray-600 dark:text-gray-400"
                      )}
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
              </div>

              {/* Contact */}
              <div className="pt-6 border-t border-gray-200 dark:border-gray-800">
                <a
                  href="mailto:hello@mevans212.com"
                  className="text-base font-light text-gray-600 dark:text-gray-400"
                >
                  Contact
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Minimal Fixed Side Indicators - Desktop Only */}
      <div className="hidden xl:flex fixed left-8 top-1/2 -translate-y-1/2 z-30 flex-col gap-3">
        {menuItems.map((item, index) => {
          const active = isActive(item.path);
          return (
            <Link
              key={item.path}
              to={item.path}
              className="group flex items-center gap-3"
              aria-label={item.label}
            >
              <div className="relative">
                <div
                  className={cn(
                    "w-1.5 h-1.5 rounded-full transition-all duration-300",
                    active
                      ? "bg-gray-900 dark:bg-gray-100 scale-150"
                      : "bg-gray-300 dark:bg-gray-700 group-hover:bg-gray-600 dark:group-hover:bg-gray-400 group-hover:scale-125"
                  )}
                />
                {active && (
                  <div className="absolute inset-0 w-1.5 h-1.5 bg-gray-900 dark:bg-gray-100 rounded-full animate-ping" />
                )}
              </div>
              <span
                className={cn(
                  "text-[10px] uppercase tracking-[0.2em] font-light opacity-0 group-hover:opacity-100 transition-opacity duration-300",
                  "text-gray-600 dark:text-gray-400"
                )}
              >
                {item.shortLabel || item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </>
  );
};

export default NavigationUltraClean;