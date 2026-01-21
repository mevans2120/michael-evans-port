import type { Metadata, Viewport } from "next";
import { DM_Sans, Newsreader } from "next/font/google";
import "./globals.css";
import { QueryProvider } from "@/components/providers/query-provider";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { TimeThemeProvider } from "@/components/providers/TimeThemeProvider";
import { FaviconGenerator } from "@/components/FaviconGenerator";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { GoogleAnalytics } from "@/components/GoogleAnalytics";
import { SanityLive } from "@/sanity/lib/live";
import { SanityVisualEditingLoader } from "@/components/SanityVisualEditingLoader";
import { draftMode } from "next/headers";
import * as SunCalc from 'suncalc';
import { Suspense } from "react";
import { client } from "@/sanity/lib/client";
import { structuredDataQuery } from "@/lib/sanity/queries";
import { generatePersonSchema, generateWebSiteSchema, type StructuredDataProfile, type StructuredDataSeoSettings } from "@/lib/structured-data";
import { JsonLd } from "@/components/JsonLd";

// DM Sans is a sans-serif font for headers and UI
// Only preload critical weights (400, 600) to reduce LCP - other weights load on demand
const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["400", "600"],
  variable: "--font-sans",
  display: "swap",
  preload: true, // Preload critical font for faster rendering
  fallback: ['system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'sans-serif'], // Better fallback chain
  adjustFontFallback: true, // Reduce layout shift with size-adjusted fallback
});

// Newsreader is a serif font for body text (editorial style)
const newsreader = Newsreader({
  subsets: ["latin"],
  weight: ["300", "400", "600"],
  style: ["normal", "italic"],
  variable: "--font-serif",
  display: "swap",
  preload: true,
  fallback: ['Georgia', 'Cambria', 'Times New Roman', 'serif'], // Better serif fallback
  adjustFontFallback: true, // Reduce layout shift with size-adjusted fallback
});

export const metadata: Metadata = {
  title: "Michael Evans | AI/ML Portfolio",
  description: "Portfolio showcasing AI/ML expertise, creative technology solutions, and professional case studies",
  alternates: {
    types: {
      "application/rss+xml": [
        { title: "Michael Evans RSS Feed", url: "/feed.xml" },
      ],
    },
  },
};

export const viewport: Viewport = {
  themeColor: "#050510",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Calculate Portland time-based accent colors server-side to prevent FOUC
  // Portland, Oregon coordinates
  const PORTLAND_LAT = 45.52;
  const PORTLAND_LON = -122.68;

  const now = new Date();
  const times = SunCalc.getTimes(now, PORTLAND_LAT, PORTLAND_LON);
  const isDayTime = now >= times.sunrise && now < times.sunset;

  // Get GA measurement ID from environment (server-side access is reliable)
  // Only enable in production to prevent localhost/preview tracking
  const gaId = process.env.NODE_ENV === 'production'
    ? process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID
    : undefined;

  // Fetch profile and SEO settings for structured data
  const { profile, seoSettings } = await client.fetch<{
    profile: StructuredDataProfile | null;
    seoSettings: StructuredDataSeoSettings | null;
  }>(structuredDataQuery);

  // Generate structured data schemas
  const siteUrl = seoSettings?.siteUrl || process.env.NEXT_PUBLIC_SITE_URL || 'https://michael-evans.com';
  const structuredData = [];

  if (profile) {
    structuredData.push(generatePersonSchema(profile, siteUrl));
  }

  if (seoSettings && profile) {
    structuredData.push(generateWebSiteSchema(seoSettings, profile.name));
  }

  // Day colors (Coral) vs Evening colors (Purple)
  const accentColors = isDayTime
    ? {
      accent: '20 90% 55%',        // Coral
      accentLight: '25 95% 60%',   // Lighter coral
      accentForeground: '0 0% 100%', // White text
      buttonPrimary: '20 90% 50%', // Button coral
    }
    : {
      accent: '270 80% 60%',       // Purple
      accentLight: '270 70% 70%',  // Lighter purple
      accentForeground: '0 0% 100%', // White text
      buttonPrimary: '276 70% 47%', // Button purple
    };

  return (
    <html
      lang="en"
      className={`${dmSans.variable} ${newsreader.variable} bg-background`}
      suppressHydrationWarning
      // Inline styles required: Dynamic time-based color calculation to prevent FOUC on .text-gradient elements (see docs/styling-exceptions.md #2)
      style={{
        '--accent': accentColors.accent,
        '--accent-light': accentColors.accentLight,
        '--accent-foreground': accentColors.accentForeground,
        '--color-button-primary': accentColors.buttonPrimary,
      } as React.CSSProperties}
    >
      <head>
        {/* Resource hints for performance optimization (Phase 3.1) */}
        {/* DNS Prefetch - resolve DNS early for external domains */}
        <link rel="dns-prefetch" href="https://cdn.sanity.io" />
        <link rel="dns-prefetch" href="https://vitals.vercel-insights.com" />
        <link rel="dns-prefetch" href="https://fonts.gstatic.com" />

        {/* Preconnect - establish full connection for critical resources */}
        <link rel="preconnect" href="https://cdn.sanity.io" crossOrigin="anonymous" />

        {/* Structured Data (JSON-LD) for SEO - Person and WebSite schemas */}
        {structuredData.length > 0 && <JsonLd data={structuredData} />}
      </head>
      <body className="font-sans font-light bg-background text-foreground overflow-hidden">
        {/* Skip navigation link for accessibility */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-primary focus:text-primary-foreground focus:rounded-md focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
        >
          Skip to main content
        </a>

        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={true}
          disableTransitionOnChange={false}
          storageKey="michael-evans-portfolio-theme"
        >
          <QueryProvider>
            <TimeThemeProvider>
              <FaviconGenerator />
              {children}
              <SanityLive
                refreshOnMount={false}
                refreshOnFocus={false}
                refreshOnReconnect={false}
              />
              {(await draftMode()).isEnabled && <SanityVisualEditingLoader />}
              <Toaster />
              <Sonner />
            </TimeThemeProvider>
          </QueryProvider>
        </ThemeProvider>
        <Suspense fallback={null}>
          <GoogleAnalytics measurementId={gaId} />
        </Suspense>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
