import React, { useState } from 'react';
import HeroDropdownMystery from '@/components/HeroDropdownMystery';
import HeroDropdownVisual from '@/components/HeroDropdownVisual';
import HeroDropdownClean from '@/components/HeroDropdownClean';

type DropdownType = 'mystery' | 'visual' | 'clean';

const DropdownTest: React.FC = () => {
  const [activeDropdown, setActiveDropdown] = useState<DropdownType>('mystery');

  const renderDropdown = () => {
    switch (activeDropdown) {
      case 'mystery':
        return <HeroDropdownMystery />;
      case 'visual':
        return <HeroDropdownVisual />;
      case 'clean':
        return <HeroDropdownClean />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900/20 to-gray-900">
      {/* Dropdown Demo */}
      <div className="relative">
        {renderDropdown()}
      </div>

      {/* Control Panel */}
      <div className="fixed bottom-8 right-8 z-[100] bg-black/90 backdrop-blur-xl rounded-2xl p-6 shadow-2xl border border-white/10">
        <div className="flex flex-col gap-4">
          <h3 className="text-white text-sm font-medium text-center mb-2">Dropdown Style Selector</h3>

          <div className="flex flex-col gap-2">
            <button
              onClick={() => setActiveDropdown('mystery')}
              className={`px-4 py-3 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${
                activeDropdown === 'mystery'
                  ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                  : 'bg-white/10 text-white/70 hover:bg-white/20'
              }`}
            >
              <span className="text-lg">🎭</span>
              <div className="text-left">
                <div className="font-semibold">Mystery</div>
                <div className="text-xs opacity-80">Symbols & patterns, no labels</div>
              </div>
            </button>

            <button
              onClick={() => setActiveDropdown('visual')}
              className={`px-4 py-3 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${
                activeDropdown === 'visual'
                  ? 'bg-gradient-to-r from-blue-500 to-teal-500 text-white'
                  : 'bg-white/10 text-white/70 hover:bg-white/20'
              }`}
            >
              <span className="text-lg">🖼️</span>
              <div className="text-left">
                <div className="font-semibold">Visual Rich</div>
                <div className="text-xs opacity-80">Large with project images</div>
              </div>
            </button>

            <button
              onClick={() => setActiveDropdown('clean')}
              className={`px-4 py-3 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${
                activeDropdown === 'clean'
                  ? 'bg-white text-black'
                  : 'bg-white/10 text-white/70 hover:bg-white/20'
              }`}
            >
              <span className="text-lg">✨</span>
              <div className="text-left">
                <div className="font-semibold">Ultra Clean</div>
                <div className="text-xs opacity-80">Minimalist typography focus</div>
              </div>
            </button>
          </div>

          <div className="pt-4 border-t border-white/10">
            <p className="text-xs text-white/50 text-center">
              Click the highlighted text to open dropdown
            </p>
          </div>
        </div>
      </div>

      {/* Info Panel */}
      <div className="fixed top-8 right-8 z-50 bg-black/80 backdrop-blur-lg rounded-xl p-4 max-w-sm border border-white/10">
        <h4 className="text-white text-sm font-semibold mb-2">How to Test:</h4>
        <ul className="text-white/70 text-xs space-y-1">
          <li>• Click the <span className="text-purple-400">highlighted text</span> in the sentence</li>
          <li>• Dropdown auto-cycles every 4 seconds when closed</li>
          <li>• Click outside to close the dropdown</li>
          <li>• Each option navigates to its page</li>
          <li>• Try keyboard navigation (where supported)</li>
        </ul>
      </div>

      {/* Description Cards */}
      <div className="absolute bottom-32 left-8 right-8 max-w-4xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className={`p-4 rounded-xl border transition-all ${
            activeDropdown === 'mystery'
              ? 'border-purple-500/50 bg-purple-500/10'
              : 'border-white/10 bg-white/5'
          }`}>
            <h3 className="text-white font-semibold mb-2">🎭 Mystery Version</h3>
            <p className="text-white/60 text-sm">
              Uses symbols and patterns instead of text. Each project has a unique visual signature.
              Encourages exploration through discovery.
            </p>
          </div>

          <div className={`p-4 rounded-xl border transition-all ${
            activeDropdown === 'visual'
              ? 'border-blue-500/50 bg-blue-500/10'
              : 'border-white/10 bg-white/5'
          }`}>
            <h3 className="text-white font-semibold mb-2">🖼️ Visual Version</h3>
            <p className="text-white/60 text-sm">
              Magazine-style with large project images. Rich visual presentation that immediately
              showcases the portfolio's breadth.
            </p>
          </div>

          <div className={`p-4 rounded-xl border transition-all ${
            activeDropdown === 'clean'
              ? 'border-white/50 bg-white/10'
              : 'border-white/10 bg-white/5'
          }`}>
            <h3 className="text-white font-semibold mb-2">✨ Clean Version</h3>
            <p className="text-white/60 text-sm">
              Minimal design with focus on typography. Subtle animations and refined spacing
              for a professional feel.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DropdownTest;