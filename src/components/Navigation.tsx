"use client"

import { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";

const Navigation = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-background/80 backdrop-blur-md shadow-sm' : 'bg-transparent'
      }`}
      role="navigation"
      aria-label="Main navigation"
    >
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="text-lg font-medium text-foreground">
            M<span className="text-gradient">Evans</span>
          </Link>

          <button
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-expanded={isMenuOpen}
            aria-controls="navigation-menu"
            aria-label={isMenuOpen ? "Close navigation menu" : "Open navigation menu"}
          >
            {isMenuOpen ? <X size={18} aria-hidden="true" /> : <Menu size={18} aria-hidden="true" />}
            <span>Menu</span>
          </button>
        </div>

        {/* Navigation Menu */}
        {isMenuOpen && (
          <div
            id="navigation-menu"
            className="absolute top-full left-0 right-0 bg-background/95 backdrop-blur-md border-t border-border/50 shadow-lg z-40"
            role="menu"
            aria-labelledby="menu-button"
          >
            <div className="container mx-auto px-6 py-6">
              <div className="flex flex-col gap-4">
                <Link
                  href="/"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                  role="menuitem"
                >
                  Home
                </Link>
                <Link
                  href="/about"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                  role="menuitem"
                >
                  About
                </Link>
                <div className="border-t border-border/30 pt-4 mt-2">
                  <div className="text-xs text-muted-foreground/70 mb-3 px-0 uppercase tracking-wider">Case Studies</div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <Link
                      href="/case-studies/casa-bonita"
                      className="block text-sm text-muted-foreground hover:text-foreground transition-colors"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Casa Bonita Platform
                    </Link>
                    <Link
                      href="/case-studies/before-launcher"
                      className="block text-sm text-muted-foreground hover:text-foreground transition-colors"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Before Launcher
                    </Link>
                    <Link
                      href="/case-studies/virgin-america"
                      className="block text-sm text-muted-foreground hover:text-foreground transition-colors"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Virgin America Digital
                    </Link>
                    <Link
                      href="/case-studies/peddle"
                      className="block text-sm text-muted-foreground hover:text-foreground transition-colors"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Peddle Marketplace
                    </Link>
                  </div>
                </div>
                <div className="border-t border-border/30 pt-4 mt-2">
                  <div className="text-xs text-muted-foreground/70 mb-3 px-0 uppercase tracking-wider">AI Projects</div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <Link
                      href="/ai-projects/post-pal"
                      className="block text-sm text-muted-foreground hover:text-foreground transition-colors"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Post Pal
                    </Link>
                    <Link
                      href="/ai-projects/karuna-gatton"
                      className="block text-sm text-muted-foreground hover:text-foreground transition-colors"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      KarunaGatton.com
                    </Link>
                    <Link
                      href="/ai-projects/ai-research-agent"
                      className="block text-sm text-muted-foreground hover:text-foreground transition-colors"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      AI Research Agent
                    </Link>
                    <Link
                      href="/ai-projects/department-of-art"
                      className="block text-sm text-muted-foreground hover:text-foreground transition-colors"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      DepartmentOfArt.com
                    </Link>
                  </div>
                </div>
                <a
                  href="mailto:hello@mevans212.com"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors border-t border-border/30 pt-4 mt-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Contact
                </a>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;
