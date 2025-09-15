import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const heroOptions = [
  {
    prefix: 'grew up in a',
    dropdown: 'purple house',
    link: '/about',
    label: 'About'
  },
  {
    prefix: 'shipped the first responsive',
    dropdown: 'airline website',
    link: '/case-studies/virgin-america',
    label: 'Virgin America'
  },
  {
    prefix: 'launched a restaurant with indoor cliff diving and a',
    dropdown: 'haunted house',
    link: '/case-studies/casa-bonita',
    label: 'Casa Bonita'
  },
  {
    prefix: 'has built four production applications with AI, and',
    dropdown: 'many prototypes',
    link: '/ai-showcase',
    label: 'AI App Showcase'
  },
  {
    prefix: 'did AI research when he built a useful app in',
    dropdown: 'an hour',
    link: '/ai-research',
    label: 'AI Research'
  },
  {
    prefix: 'helped hundreds of thousands of android',
    dropdown: 'users focus',
    link: '/case-studies/before-launcher',
    label: 'Before Launcher'
  },
  {
    prefix: 'is basically a',
    dropdown: 'farmer',
    link: '/about',
    label: 'About'
  }
];

const DynamicHero = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);

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

  const currentOption = heroOptions[currentIndex];

  return (
    <section className="min-h-screen flex items-center justify-center relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-background via-secondary/30 to-accent/10" />
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-6xl mx-auto text-left animate-fade-in">
          <h1 className="text-4xl md:text-6xl lg:text-7xl xl:text-8xl font-light mb-8 leading-tight text-left">
            <span className="inline" style={{color: 'hsl(var(--name-purple))'}}>Michael Evans</span>{' '}
            <span className={`text-foreground inline transition-opacity duration-150 ${isTransitioning ? 'opacity-0' : 'opacity-100'}`}>{currentOption.prefix}</span>{' '}
            <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
              <DropdownMenuTrigger asChild>
                <button className="group inline-flex items-baseline gap-1">
                  <span className={`text-primary transition-opacity duration-150 ${isTransitioning ? 'opacity-0' : 'opacity-100'}`}>
                    {currentOption.dropdown}
                  </span>
                  <ChevronDown className="w-4 h-4 md:w-6 md:h-6 text-primary group-hover:text-accent transition-colors" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-80 bg-background/95 backdrop-blur-md border border-border/50">
                {heroOptions.map((option, index) => (
                  <DropdownMenuItem key={index} asChild>
                    <Link 
                      to={option.link}
                      className="flex flex-col items-start p-4 hover:bg-accent/50 transition-colors cursor-pointer"
                    >
                      <span className="font-medium text-foreground">{option.label}</span>
                      <span className="text-sm text-muted-foreground mt-1">{option.prefix} {option.dropdown}</span>
                    </Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </h1>
        </div>
      </div>
    </section>
  );
};

export default DynamicHero;