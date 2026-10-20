import { NavigationProvider } from "@/contexts/NavigationContext";
import { NavigationPanel, NavigationMenu } from "@/components/navigation";
import { NavigationProgress } from "@/components/navigation/NavigationProgress";
import { MobileNav } from "@/components/navigation/MobileNav";
import { ConditionalChatSection } from "@/components/navigation/ConditionalChatSection";
import { MobileChatFooter } from "@/components/navigation/MobileChatFooter";
import { Footer } from "@/components/Footer";
import { cachedSanityFetch } from "@/sanity/lib/fetch";
import { chatPromptsQuery, footerQuery, type ChatPromptsData } from "@/lib/sanity/queries";
import { LayoutContent } from "./LayoutContent";

// Type for footer data from Sanity
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

export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Fetch footer data from Sanity (cached for visitors, live for editors)
  const { data: footerData } = await cachedSanityFetch<FooterData | null>({ query: footerQuery, tags: ['footer'] });

  // Suggested chat prompts, server-rendered so they appear on first paint
  const { data: chatPrompts } = await cachedSanityFetch<ChatPromptsData | null>({
    query: chatPromptsQuery,
    tags: ['chat-prompts'],
  });

  return (
    <NavigationProvider>
      {/* Navigation loading indicator */}
      <NavigationProgress />

      {/* Mobile Navigation Header & Hamburger Menu */}
      <MobileNav />

      <LayoutContent>
        {/* Navigation Panel - Now on the left for desktop */}
        <NavigationPanel>
          <NavigationMenu />
          <ConditionalChatSection chatPrompts={chatPrompts} />
        </NavigationPanel>

        {/* Main Content Area */}
        <main
          id="main-content"
          className="flex-1 h-full overflow-y-auto transition-all duration-300 pb-16 lg:pb-0 relative"
        >
          {children}

          {/* Footer */}
          {footerData && <Footer data={footerData} />}
        </main>
      </LayoutContent>

      {/* Mobile Chat Footer - Always render, CSS handles visibility */}
      <MobileChatFooter chatPrompts={chatPrompts} />
    </NavigationProvider>
  );
}
