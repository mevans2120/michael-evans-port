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
        {/* Main content area: 2 columns on mobile, 4 columns on desktop */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 items-start mb-2">
          {/* Crow Logo - Desktop Only */}
          <div className="hidden lg:flex flex-col self-end justify-self-start -ml-16">
            <svg
              width="248"
              height="300"
              viewBox="20 12 70 110"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="text-navigation opacity-80 -scale-x-100"
              aria-label="Crow logo"
            >
              <path
                d="M37.871 48.258C39.7069 52.6291 44.0155 56.633 48.344 59.781C48.6253 61.6091 48.5588 63.531 47.5081 64.8162L42.012 69.5271C42.012 69.5271 37.6565 69.3123 36.4456 71.1677H46.2229C46.2229 71.1677 46.2463 70.3396 44.4377 69.6677L49.8596 65.531C51.426 65.07 52.9494 64.4646 54.4026 63.7263C55.3987 64.3083 56.3167 64.8201 57.1018 65.238L52.1018 69.5232C52.1018 69.5232 47.7463 69.3083 46.5354 71.1638H56.3127C56.3127 71.1638 56.3361 70.3357 54.5275 69.6638L59.0275 66.2302C59.5939 66.5114 59.9259 66.6677 59.9259 66.6677V85.2297C64.1368 97.3627 75.7699 105 75.7699 105L74.9144 78.8747L85.8364 87.7966C85.8364 87.7966 70.5634 51.4686 67.9224 44.2576C65.2818 37.0506 62.356 34.4803 62.356 34.4803C62.3521 34.4803 57.0708 17.4213 47.794 15.4253C38.5128 13.4253 36.517 19.1245 36.517 19.1245C34.2475 18.855 31.9506 19.0034 29.7358 19.5659C27.2436 20.2651 25.2006 22.0464 24.1694 24.4175L35.6614 26.0581C40.6536 29.4136 33.5872 38.0501 37.8723 48.2571L37.871 48.258ZM42.2226 20.387C42.7499 20.387 43.2226 20.7034 43.4218 21.1878C43.621 21.6721 43.5116 22.2308 43.1406 22.598C42.7695 22.9691 42.2109 23.0823 41.7265 22.8792C41.2421 22.68 40.9257 22.2073 40.9257 21.6839C40.9257 21.3402 41.0624 21.0081 41.3085 20.7659C41.5507 20.5238 41.8789 20.387 42.2226 20.387Z"
                fill="currentColor"
              />
            </svg>
          </div>

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
          <nav className="hidden lg:flex flex-col gap-3 items-start">
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
              href="/blog"
              className="text-base text-foreground/70 hover:text-accent transition-colors"
            >
              Posts
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
            <p className="text-lg font-medium font-serif text-foreground/60 mt-auto lg:hidden">
              M<span className="text-gradient">Evans</span> LLC.
            </p>
          </div>
        </div>

        {/* Bottom: Logo and Tagline */}
        <div className="border-t border-border/30 pt-6 mt-4">
          <div className="flex flex-col lg:flex-row items-start lg:items-center gap-4">
            <p className="hidden lg:block text-lg font-medium font-serif text-foreground/60 lg:mr-auto">
              M<span className="text-gradient">Evans</span> LLC.
            </p>
            <p className="text-base text-foreground/80 lg:absolute lg:left-1/2 lg:-translate-x-1/2 lg:w-auto">
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
