import { NavigationProvider } from "@/contexts/NavigationContext";
import { NavigationPanel, NavigationMenu, ChatSection } from "@/components/navigation";
import { NavigationProgress } from "@/components/navigation/NavigationProgress";
import { MobileNav } from "@/components/navigation/MobileNav";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { Footer } from "@/components/Footer";
import { sanityFetch } from "@/sanity/lib/live";
import { footerQuery } from "@/lib/sanity/queries";

export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Fetch footer data from Sanity
  const { data: footerData } = await sanityFetch({ query: footerQuery });

  return (
    <NavigationProvider>
      {/* Navigation loading indicator */}
      <NavigationProgress />

      {/* Mobile Navigation Header & Hamburger Menu */}
      <MobileNav />

      <div className="flex h-screen w-screen bg-background overflow-hidden pt-16 md:pt-0">
        {/* Navigation Panel - Now on the left for desktop */}
        <NavigationPanel>
          <div className="flex-1 flex flex-col">
            <NavigationMenu />
            <ChatSection />
          </div>
        </NavigationPanel>

        {/* Main Content Area */}
        <main
          id="main-content"
          className="flex-1 h-full overflow-y-auto transition-all duration-300 pb-[200px] md:pb-0 hide-scrollbar relative"
        >
          {/* Theme Toggle - Desktop Only (Top Right) */}
          <div className="hidden md:block absolute top-6 right-6 z-50">
            <ThemeToggle />
          </div>

          {children}

          {/* Footer */}
          {footerData && <Footer data={footerData} />}
        </main>
      </div>
    </NavigationProvider>
  );
}
