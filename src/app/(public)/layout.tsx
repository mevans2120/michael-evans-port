import { NavigationProvider } from "@/contexts/NavigationContext";
import { NavigationPanel, NavigationMenu, ChatSection } from "@/components/navigation";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { TimeThemeToggle } from "@/components/ui/time-theme-toggle";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <NavigationProvider>
      <div className="flex h-screen w-screen bg-background overflow-hidden">
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
          {/* Theme Toggles - Top Right */}
          <div className="absolute top-6 right-6 z-50 flex gap-2">
            <TimeThemeToggle />
            <ThemeToggle />
          </div>

          {children}
        </main>
      </div>
    </NavigationProvider>
  );
}
