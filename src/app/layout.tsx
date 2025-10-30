import type { Metadata, Viewport } from "next";
import { Crimson_Pro, DM_Sans } from "next/font/google";
import "./globals.css";
import { QueryProvider } from "@/components/providers/query-provider";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Analytics } from "@vercel/analytics/next";

// DM Sans is a sans-serif font
const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-sans",
  display: "swap",
});

// Crimson Pro is a serif font
const crimsonPro = Crimson_Pro({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${dmSans.variable} ${crimsonPro.variable}`} suppressHydrationWarning>
      <body className="font-sans overflow-hidden">
        {/* Skip navigation link for accessibility */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-primary focus:text-primary-foreground focus:rounded-md focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
        >
          Skip to main content
        </a>

        <QueryProvider>
          {children}
          <Toaster />
          <Sonner />
        </QueryProvider>
        <Analytics />
      </body>
    </html>
  );
}
