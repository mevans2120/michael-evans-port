import { NavigationProvider } from "@/contexts/NavigationContext";
import { NavigationPanel, NavigationMenu } from "@/components/navigation";
import { NavigationProgress } from "@/components/navigation/NavigationProgress";
import { MobileNav } from "@/components/navigation/MobileNav";
import { ConditionalChatSection } from "@/components/navigation/ConditionalChatSection";
import { MobileChatFooter } from "@/components/navigation/MobileChatFooter";
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

      <div className="flex h-screen w-screen bg-background overflow-hidden pt-16 lg:pt-0">
        {/* Navigation Panel - Now on the left for desktop */}
        <NavigationPanel>
          <NavigationMenu />
          <ConditionalChatSection />
        </NavigationPanel>

        {/* Main Content Area */}
        <main
          id="main-content"
          className="flex-1 h-full overflow-y-auto transition-all duration-300 pb-16 lg:pb-0 hide-scrollbar relative"
        >
          {children}

          {/* Footer */}
          {footerData && <Footer data={footerData} />}
        </main>
      </div>

      {/* Mobile Chat Footer - Always render, CSS handles visibility */}
      <MobileChatFooter />
    </NavigationProvider>
  );
}
