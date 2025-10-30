import { NavigationProvider } from "@/contexts/NavigationContext";
import { NavigationPanel, NavigationMenu, ChatSection } from "@/components/navigation";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <NavigationProvider>
      <div className="flex h-screen w-screen bg-neutral-950 overflow-hidden">
        {/* Navigation Panel - Now on the left for desktop */}
        <NavigationPanel>
          <div className="flex-1 flex flex-col bg-neutral-900">
            <NavigationMenu />
            <ChatSection />
          </div>
        </NavigationPanel>

        {/* Main Content Area */}
        <main
          id="main-content"
          className="flex-1 h-full overflow-y-auto transition-all duration-300 pb-[200px] md:pb-0 hide-scrollbar"
        >
          {children}
        </main>
      </div>
    </NavigationProvider>
  );
}
