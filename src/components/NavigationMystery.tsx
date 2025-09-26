import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";

interface NavItem {
  path: string;
  symbol: string;
  color: string;
  hoverColor: string;
  description: string;
}

const NavigationMystery: React.FC = () => {
  const [isRevealed, setIsRevealed] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const location = useLocation();

  // Mystery symbols and colors for each route
  const navItems: NavItem[] = [
    { path: "/", symbol: "◈", color: "from-purple-500 to-indigo-500", hoverColor: "from-purple-600 to-indigo-600", description: "Origin point" },
    { path: "/about", symbol: "◎", color: "from-blue-500 to-cyan-500", hoverColor: "from-blue-600 to-cyan-600", description: "Inner circle" },
    { path: "/capabilities", symbol: "◉", color: "from-green-500 to-emerald-500", hoverColor: "from-green-600 to-emerald-600", description: "Core strengths" },
    { path: "/case-studies/casa-bonita", symbol: "◐", color: "from-orange-500 to-amber-500", hoverColor: "from-orange-600 to-amber-600", description: "Desert oasis" },
    { path: "/case-studies/virgin-america", symbol: "◑", color: "from-red-500 to-pink-500", hoverColor: "from-red-600 to-pink-600", description: "Sky journey" },
    { path: "/case-studies/before-launcher", symbol: "◒", color: "from-indigo-500 to-purple-500", hoverColor: "from-indigo-600 to-purple-600", description: "Launch sequence" },
    { path: "/case-studies/peddle", symbol: "◓", color: "from-teal-500 to-cyan-500", hoverColor: "from-teal-600 to-cyan-600", description: "Market flow" },
    { path: "/ai-showcase", symbol: "◔", color: "from-violet-500 to-fuchsia-500", hoverColor: "from-violet-600 to-fuchsia-600", description: "Neural patterns" },
    { path: "/ai-research", symbol: "◕", color: "from-slate-500 to-gray-500", hoverColor: "from-slate-600 to-gray-600", description: "Deep knowledge" },
  ];

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === "?") {
        setIsRevealed(!isRevealed);
      }
    };

    window.addEventListener("keypress", handleKeyPress);
    return () => window.removeEventListener("keypress", handleKeyPress);
  }, [isRevealed]);

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 bg-black/90 backdrop-blur-xl border-b border-white/10"
      role="navigation"
      aria-label="Mystery navigation"
    >
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link
            to="/"
            className="relative group"
            aria-label="Home"
          >
            <span className="text-lg font-light tracking-wider text-white/90 group-hover:text-white transition-colors">
              M<span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-purple-400">E</span>
            </span>
            <div className="absolute -bottom-1 left-0 w-0 h-px bg-gradient-to-r from-violet-400 to-purple-400 group-hover:w-full transition-all duration-300" />
          </Link>

          {/* Mystery Navigation */}
          <div className="flex items-center gap-1">
            {navItems.map((item, index) => {
              const isActive = location.pathname === item.path;
              const isHovered = hoveredIndex === index;

              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className="relative group p-3"
                  onMouseEnter={() => setHoveredIndex(index)}
                  onMouseLeave={() => setHoveredIndex(null)}
                  aria-label={isRevealed ? item.description : `Navigate to mystery page ${index + 1}`}
                >
                  {/* Symbol */}
                  <div className={cn(
                    "relative text-2xl transition-all duration-500",
                    "transform",
                    isHovered && "scale-125 rotate-180",
                    isActive && "animate-pulse"
                  )}>
                    <span
                      className={cn(
                        "bg-gradient-to-br bg-clip-text text-transparent transition-all duration-300",
                        isHovered ? item.hoverColor : item.color,
                        isActive && "brightness-125"
                      )}
                    >
                      {item.symbol}
                    </span>

                    {/* Glow effect */}
                    {(isHovered || isActive) && (
                      <div
                        className={cn(
                          "absolute inset-0 bg-gradient-to-br blur-xl opacity-50",
                          item.color
                        )}
                      />
                    )}
                  </div>

                  {/* Hover reveal tooltip */}
                  {isHovered && (
                    <div className="absolute top-full mt-2 left-1/2 -translate-x-1/2 whitespace-nowrap">
                      <div className="bg-white/10 backdrop-blur-md rounded-lg px-3 py-1.5 border border-white/20">
                        <p className="text-xs text-white/80">
                          {isRevealed ? item.description : "???"}
                        </p>
                      </div>
                      <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-white/10 rotate-45 border-l border-t border-white/20" />
                    </div>
                  )}

                  {/* Active indicator */}
                  {isActive && (
                    <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-white rounded-full animate-ping" />
                  )}
                </Link>
              );
            })}

            {/* Mystery reveal hint */}
            <button
              onClick={() => setIsRevealed(!isRevealed)}
              className="ml-4 p-2 text-white/40 hover:text-white/80 transition-colors"
              aria-label="Toggle navigation hints"
              title="Press '?' to reveal hints"
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.5"/>
                <path d="M6 6C6 5.44772 6.44772 5 7 5H8C8.55228 5 9 5.44772 9 6C9 6.55228 8.55228 7 8 7H7.5V9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                <circle cx="7.5" cy="11" r="0.5" fill="currentColor"/>
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile version - floating orbs */}
      <div className="fixed bottom-8 left-1/2 -translate-x-1/2 flex gap-3 md:hidden bg-black/80 backdrop-blur-xl rounded-full px-4 py-3 border border-white/20">
        {navItems.slice(0, 5).map((item, index) => {
          const isActive = location.pathname === item.path;

          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "w-10 h-10 rounded-full flex items-center justify-center",
                "bg-gradient-to-br transition-all duration-300",
                item.color,
                isActive && "ring-2 ring-white/50 ring-offset-2 ring-offset-black"
              )}
              aria-label={item.description}
            >
              <span className="text-white/90 text-sm">{item.symbol}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};

export default NavigationMystery;