'use client'

import { NavigationProvider } from "@/contexts/NavigationContext";
import { ChatProvider, useChatState } from "@/contexts/ChatContext";
import { NavigationPanel, NavigationMenu, ChatSection } from "@/components/navigation";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { cn } from "@/lib/utils";

function MainContent({ children }: { children: React.ReactNode }) {
  const { chatExpanded } = useChatState();

  return (
    <main
      id="main-content"
      className={cn(
        "flex-1 h-full overflow-y-auto transition-all duration-300 md:pb-0 hide-scrollbar relative",
        chatExpanded ? "pb-[50vh]" : "pb-32"
      )}
    >
      {/* Theme Toggle - Top Right */}
      <div className="absolute top-6 right-6 z-50">
        <ThemeToggle />
      </div>

      {children}
    </main>
  );
}

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <NavigationProvider>
      <ChatProvider>
        <div className="flex h-screen w-screen bg-background overflow-hidden">
          {/* Navigation Panel - Now on the left for desktop */}
          <NavigationPanel>
            <div className="flex-1 flex flex-col">
              <NavigationMenu />
              <ChatSection />
            </div>
          </NavigationPanel>

          {/* Main Content Area with Dynamic Padding */}
          <MainContent>{children}</MainContent>
        </div>
      </ChatProvider>
    </NavigationProvider>
  );
}
