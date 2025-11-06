'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useTimeBasedTheme } from '@/components/providers/TimeThemeProvider';

interface FooterService {
  title: string;
  url?: string;
  order: number;
}

interface FooterData {
  services: FooterService[];
  linkedinUrl: string;
  contactLinkType: 'internal' | 'external';
  contactInternalLink?: string;
  contactExternalLink?: string;
  weatherEnabled: boolean;
  weatherLocation?: string;
}

interface FooterProps {
  data: FooterData;
}

export function Footer({ data }: FooterProps) {
  const [currentTime, setCurrentTime] = useState('');
  const { theme, setManualOverride, sunrise, sunset } = useTimeBasedTheme();

  // Fetch weather from API route (client-side only, non-blocking)
  const { data: weatherData } = useQuery({
    queryKey: ['portland-weather'],
    queryFn: async () => {
      const res = await fetch('/api/weather');
      if (!res.ok) return { weather: '' };
      return res.json();
    },
    staleTime: 15 * 60 * 1000, // 15 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes (formerly cacheTime)
    refetchOnWindowFocus: false,
    refetchOnMount: false, // Don't refetch when component mounts if data exists
    refetchOnReconnect: false, // Don't refetch on reconnect
    retry: false, // Don't retry on failure
  });

  // Sync local clock with API time, then tick independently
  useEffect(() => {
    const updateTime = () => {
      const portlandTime = new Date().toLocaleTimeString('en-US', {
        timeZone: 'America/Los_Angeles',
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
      }).toLowerCase();
      setCurrentTime(portlandTime);
    };

    // Initial update
    updateTime();

    // Tick every minute - single interval, never recreated
    const interval = setInterval(updateTime, 60000);

    return () => clearInterval(interval);
  }, []); // Empty deps - one interval for the lifetime of the component

  // Calculate current time period based on sunrise/sunset
  const now = new Date();
  const isActuallyDay = sunrise && sunset ? now >= sunrise && now < sunset : false;
  const actualTimePeriod: 'day' | 'night' = isActuallyDay ? 'day' : 'night';

  // Determine contact link
  const contactHref =
    data.contactLinkType === 'external'
      ? data.contactExternalLink
      : data.contactInternalLink || '/contact';

  // Toggle theme handler - toggles color preference, not actual time
  const toggleTheme = () => {
    setManualOverride(theme === 'day' ? 'evening' : 'day');
  };

  // Build tagline parts
  const weatherWord = data.weatherEnabled && weatherData?.weather ? weatherData.weather : '';
  const location = data.weatherLocation || 'Portland, Oregon';

  return (
    <footer className="border-t border-border bg-background">
      <div className="max-w-5xl mx-auto px-8 py-8">
        {/* Main content area: 3 columns on mobile/tablet, 3 columns on desktop */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-8 items-start mb-2">
          {/* Services */}
          <nav className="flex flex-col gap-3 items-start">
            <h3 className="text-xs uppercase tracking-wider text-foreground/40 mb-1">
              Product Management
            </h3>
            {data.services.map((service) =>
              service.url ? (
                <Link
                  key={service.order}
                  href={service.url}
                  className="text-base text-foreground/70 hover:text-accent transition-colors"
                >
                  {service.title}
                </Link>
              ) : (
                <span
                  key={service.order}
                  className="text-base text-foreground/70"
                >
                  {service.title}
                </span>
              )
            )}
          </nav>

          {/* Pages - Hidden on mobile, sticky nav is always visible */}
          <nav className="hidden md:flex flex-col gap-3 items-start">
            <h3 className="text-xs uppercase tracking-wider text-foreground/40 mb-1">Pages</h3>
            <Link href="/" className="text-base text-foreground/70 hover:text-accent transition-colors">
              Home
            </Link>
            <Link
              href="/about"
              className="text-base text-foreground/70 hover:text-accent transition-colors"
            >
              About
            </Link>
            <Link
              href="/case-studies"
              className="text-base text-foreground/70 hover:text-accent transition-colors"
            >
              Case Studies
            </Link>
            <Link
              href="/ai-showcase"
              className="text-base text-foreground/70 hover:text-accent transition-colors"
            >
              AI Showcase
            </Link>
          </nav>

          {/* Reach Out */}
          <div className="flex flex-col gap-3 items-start justify-between h-full">
            <div className="flex flex-col gap-3 items-start">
              <h3 className="text-xs uppercase tracking-wider text-foreground/40 mb-1">
                Reach Out
              </h3>
              <a
                href={data.linkedinUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-base text-foreground/70 hover:text-accent transition-colors"
              >
                LinkedIn
              </a>
              <Link
                href={contactHref || '/contact'}
                className="text-base text-accent hover:text-accent-light transition-colors"
              >
                Contact
              </Link>
            </div>

            {/* Logo - Mobile only, bottom aligned */}
            <p className="text-lg font-medium font-serif text-foreground/60 mt-auto md:hidden">
              M<span className="text-gradient">Evans</span> LLC.
            </p>
          </div>
        </div>

        {/* Bottom: Logo and Tagline */}
        <div className="border-t border-border/30 pt-6 mt-4">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
            <p className="hidden md:block text-lg font-medium font-serif text-foreground/60 md:mr-auto">
              M<span className="text-gradient">Evans</span> LLC.
            </p>
            <p className="text-base text-foreground/80 w-full md:absolute md:left-1/2 md:-translate-x-1/2">
              Made in {weatherWord && `${weatherWord} `}Portland, OR. It is {currentTime} here and its{' '}
              <button
                onClick={toggleTheme}
                className="text-accent underline hover:opacity-80 transition-opacity cursor-pointer"
              >
                {actualTimePeriod}
              </button>
              .
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
