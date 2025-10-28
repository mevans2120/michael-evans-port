import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { QueryProvider } from "@/components/providers/query-provider";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { NavigationProvider } from "@/contexts/NavigationContext";
import { NavigationPanel, NavigationMenu, ChatSection } from "@/components/navigation";
import { Analytics } from "@vercel/analytics/next";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
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
    <html lang="en" className={inter.variable} suppressHydrationWarning>
      <body className="font-sans overflow-hidden">
        {/* Skip navigation link for accessibility */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-primary focus:text-primary-foreground focus:rounded-md focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
        >
          Skip to main content
        </a>

        <QueryProvider>
          <NavigationProvider>
            <div className="flex h-screen w-screen bg-neutral-950 overflow-hidden">
              {/* Main Content Area */}
              <main
                id="main-content"
                className="flex-1 h-full overflow-y-auto transition-all duration-300 pb-[200px] md:pb-0 hide-scrollbar"
              >
                {children}
              </main>

              {/* Navigation Panel */}
              <NavigationPanel>
                <div className="flex-1 flex flex-col bg-neutral-900 relative">
                  <NavigationMenu />
                  <ChatSection />
                </div>
              </NavigationPanel>
            </div>

            <Toaster />
            <Sonner />
          </NavigationProvider>
        </QueryProvider>
        <Analytics />
      </body>
    </html>
  );
}
