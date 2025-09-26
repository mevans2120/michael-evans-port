import React, { useState } from 'react';
import NavigationMystery from '@/components/NavigationMystery';
import NavigationVisualRich from '@/components/NavigationVisualRich';
import NavigationUltraClean from '@/components/NavigationUltraClean';

type NavType = 'mystery' | 'visual-rich' | 'ultra-clean';

const NavigationTest: React.FC = () => {
  const [activeNav, setActiveNav] = useState<NavType>('mystery');
  const [showContent, setShowContent] = useState(true);

  const renderNavigation = () => {
    switch (activeNav) {
      case 'mystery':
        return <NavigationMystery />;
      case 'visual-rich':
        return <NavigationVisualRich />;
      case 'ultra-clean':
        return <NavigationUltraClean />;
      default:
        return null;
    }
  };

  return (
    <>
      {renderNavigation()}

      {/* Control Panel */}
      <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[9999] bg-black/90 backdrop-blur-xl rounded-2xl p-6 shadow-2xl border border-white/10">
        <div className="flex flex-col gap-4">
          <h3 className="text-white text-sm font-medium text-center mb-2">Navigation Style Selector</h3>

          <div className="flex gap-2">
            <button
              onClick={() => setActiveNav('mystery')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                activeNav === 'mystery'
                  ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                  : 'bg-white/10 text-white/70 hover:bg-white/20'
              }`}
            >
              🎭 Mystery
            </button>

            <button
              onClick={() => setActiveNav('visual-rich')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                activeNav === 'visual-rich'
                  ? 'bg-gradient-to-r from-blue-500 to-teal-500 text-white'
                  : 'bg-white/10 text-white/70 hover:bg-white/20'
              }`}
            >
              🖼️ Visual Rich
            </button>

            <button
              onClick={() => setActiveNav('ultra-clean')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                activeNav === 'ultra-clean'
                  ? 'bg-white text-black'
                  : 'bg-white/10 text-white/70 hover:bg-white/20'
              }`}
            >
              ✨ Ultra Clean
            </button>
          </div>

          <button
            onClick={() => setShowContent(!showContent)}
            className="px-4 py-2 rounded-lg text-sm font-medium bg-white/10 text-white/70 hover:bg-white/20 transition-all"
          >
            {showContent ? 'Hide' : 'Show'} Demo Content
          </button>
        </div>
      </div>

      {/* Demo Content */}
      {showContent && (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900/20 to-gray-900 pt-32 px-8">
          <div className="max-w-6xl mx-auto">
            <h1 className="text-6xl font-bold text-white mb-8">
              Navigation Menu Test Page
            </h1>

            <div className="prose prose-invert max-w-none">
              <p className="text-xl text-white/80 mb-8">
                Use the control panel at the bottom to switch between navigation styles.
                Each navigation is fully functional - try clicking on menu items to navigate around the site.
              </p>

              <div className="grid md:grid-cols-3 gap-6 mb-12">
                <div className={`p-6 rounded-xl border ${
                  activeNav === 'mystery' ? 'border-purple-500 bg-purple-500/10' : 'border-white/10 bg-white/5'
                }`}>
                  <h3 className="text-white text-lg font-semibold mb-2">🎭 Mystery Navigation</h3>
                  <p className="text-white/60 text-sm">
                    Abstract symbols create intrigue. Press "?" to reveal hints.
                    Perfect for creative portfolios that want to stand out.
                  </p>
                </div>

                <div className={`p-6 rounded-xl border ${
                  activeNav === 'visual-rich' ? 'border-blue-500 bg-blue-500/10' : 'border-white/10 bg-white/5'
                }`}>
                  <h3 className="text-white text-lg font-semibold mb-2">🖼️ Visual Rich</h3>
                  <p className="text-white/60 text-sm">
                    Magazine-style with image previews. Full-screen overlay with category filters.
                    Great for visual-heavy portfolios.
                  </p>
                </div>

                <div className={`p-6 rounded-xl border ${
                  activeNav === 'ultra-clean' ? 'border-white bg-white/10' : 'border-white/10 bg-white/5'
                }`}>
                  <h3 className="text-white text-lg font-semibold mb-2">✨ Ultra Clean</h3>
                  <p className="text-white/60 text-sm">
                    Minimalist Swiss design. Focus on typography and spacing.
                    Ideal for professional, content-focused sites.
                  </p>
                </div>
              </div>

              <div className="space-y-8">
                <section>
                  <h2 className="text-3xl font-bold text-white mb-4">Testing Notes</h2>
                  <ul className="space-y-2 text-white/70">
                    <li>• All navigation menus are fully functional with React Router</li>
                    <li>• Try resizing your browser to see mobile responsive versions</li>
                    <li>• Each menu has unique hover states and animations</li>
                    <li>• Navigation stays fixed to viewport when scrolling</li>
                    <li>• Active route highlighting is implemented</li>
                  </ul>
                </section>

                <section>
                  <h2 className="text-3xl font-bold text-white mb-4">Keyboard Shortcuts</h2>
                  <ul className="space-y-2 text-white/70">
                    <li>• <kbd className="px-2 py-1 bg-white/10 rounded">Tab</kbd> - Navigate through menu items</li>
                    <li>• <kbd className="px-2 py-1 bg-white/10 rounded">Enter</kbd> - Select menu item</li>
                    <li>• <kbd className="px-2 py-1 bg-white/10 rounded">Esc</kbd> - Close menu (where applicable)</li>
                    <li>• <kbd className="px-2 py-1 bg-white/10 rounded">?</kbd> - Reveal hints (Mystery Navigation)</li>
                  </ul>
                </section>

                {/* Add some scrollable content */}
                <section className="mt-16 pb-32">
                  <h2 className="text-3xl font-bold text-white mb-4">Scroll Test Content</h2>
                  {[...Array(10)].map((_, i) => (
                    <div key={i} className="mb-8 p-6 bg-white/5 rounded-lg">
                      <h3 className="text-white text-xl mb-2">Section {i + 1}</h3>
                      <p className="text-white/60">
                        This is demo content to test how the navigation behaves when scrolling.
                        Notice how the navigation stays fixed to the viewport and may change
                        appearance based on scroll position.
                      </p>
                    </div>
                  ))}
                </section>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default NavigationTest;