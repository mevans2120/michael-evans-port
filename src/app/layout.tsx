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

// DM Sans is a sans-serif font for headers and UI
const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-sans",
  display: "swap",
});

// Newsreader is a serif font for body text (editorial style)
const newsreader = Newsreader({
  subsets: ["latin"],
  weight: ["300", "400", "600"],
  style: ["normal", "italic"],
  variable: "--font-serif",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Michael Evans | AI/ML Portfolio",
  description: "Portfolio showcasing AI/ML expertise, creative technology solutions, and professional case studies",
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
  const gaId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

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
      className={`${dmSans.variable} ${newsreader.variable}`}
      suppressHydrationWarning
      // Inline styles required: Dynamic time-based color calculation to prevent FOUC on .text-gradient elements (see docs/styling-exceptions.md #2)
      style={{
        '--accent': accentColors.accent,
        '--accent-light': accentColors.accentLight,
        '--accent-foreground': accentColors.accentForeground,
        '--color-button-primary': accentColors.buttonPrimary,
      } as React.CSSProperties}
    >
      <body className="font-sans overflow-hidden">
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
              <SanityLive />
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
