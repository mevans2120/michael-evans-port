import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Terminal, ArrowRight, Code, Sparkles } from 'lucide-react';

/**
 * Concept 2: Terminal Dark
 *
 * Design Philosophy:
 * - Bold, distinctive terminal aesthetic
 * - High contrast with accent colors
 * - Sharp, modern animations
 * - Developer-focused design language
 *
 * Key Features:
 * - 400px panel width when expanded
 * - 56px tab width when collapsed (wider for visibility)
 * - Content reflows with 250ms sharp transitions
 * - Monospace typography for tech feel
 * - Neon green accents (#00ff88)
 * - Terminal-style navigation cards
 */

const TerminalNavigationCard = ({ title, description, targetSection, onNavigate }) => {
  return (
    <motion.button
      onClick={() => onNavigate(targetSection)}
      className="w-full text-left p-4 rounded-none bg-neutral-900/50 hover:bg-neutral-800/50 border border-[#00ff88]/20 hover:border-[#00ff88]/40 transition-all group"
      whileHover={{ x: 4 }}
      whileTap={{ scale: 0.98 }}
    >
      <div className="flex items-start gap-3">
        <ArrowRight className="w-4 h-4 text-[#00ff88] flex-shrink-0 mt-1 group-hover:translate-x-1 transition-transform" />
        <div className="flex-1">
          <h4 className="text-sm font-mono font-bold text-white mb-1.5 flex items-center gap-2">
            <span>&gt;</span>
            {title}
          </h4>
          <p className="text-xs font-mono text-neutral-400 leading-relaxed">{description}</p>
        </div>
      </div>
    </motion.button>
  );
};

const TerminalMessage = ({ content, isUser, navigationCards = [] }) => {
  return (
    <div className="mb-6">
      <div className="flex items-center gap-2 mb-2">
        <span className="text-xs font-mono text-[#00ff88]">
          {isUser ? '→ USER' : '← AI'}
        </span>
        <div className="flex-1 h-px bg-neutral-800"></div>
      </div>

      <div className={`px-4 py-3 ${
        isUser
          ? 'bg-neutral-900 border-l-2 border-[#00ff88]'
          : 'bg-neutral-950 border-l-2 border-blue-500'
      }`}>
        <p className="text-sm font-mono text-neutral-200 leading-relaxed">{content}</p>
      </div>

      {navigationCards.length > 0 && (
        <div className="mt-3 space-y-2">
          {navigationCards.map((card, idx) => (
            <TerminalNavigationCard key={idx} {...card} />
          ))}
        </div>
      )}
    </div>
  );
};

const TerminalDarkConcept = () => {
  const [panelState, setPanelState] = useState('partial');
  const [messages, setMessages] = useState([
    {
      isUser: false,
      content: "System initialized. AI assistant ready. Ask me anything about Michael's portfolio."
    },
    {
      isUser: true,
      content: "Show me AI/ML projects"
    },
    {
      isUser: false,
      content: "Loading AI/ML project index... Found 2 relevant entries:",
      navigationCards: [
        {
          title: "rag_chatbot.project",
          description: "Claude Haiku 4.5 | Supabase pgvector | AI SDK v5",
          targetSection: "/projects/rag-chatbot",
          onNavigate: (section) => handleNavigate(section)
        },
        {
          title: "computer_vision.project",
          description: "TensorFlow | Object Detection | Real-time Processing",
          targetSection: "/projects/computer-vision",
          onNavigate: (section) => handleNavigate(section)
        }
      ]
    }
  ]);

  const handleNavigate = (section) => {
    console.log(`[NAVIGATE] ${section}`);
    setTimeout(() => {
      setPanelState('partial');
    }, 500);
  };

  const togglePanel = () => {
    if (panelState === 'collapsed') {
      setPanelState('partial');
    } else if (panelState === 'partial') {
      setPanelState('expanded');
    } else {
      setPanelState('collapsed');
    }
  };

  const getPanelWidth = () => {
    switch (panelState) {
      case 'collapsed': return 0;
      case 'partial': return 56;
      case 'expanded': return 400;
      default: return 56;
    }
  };

  return (
    <div className="h-screen w-screen bg-neutral-950 overflow-hidden font-mono">
      {/* Main Content Area */}
      <motion.div
        className="h-full bg-neutral-900"
        animate={{
          marginRight: `${getPanelWidth()}px`
        }}
        transition={{
          duration: 0.25,
          ease: [0.22, 1, 0.36, 1]
        }}
      >
        <div className="h-full flex items-center justify-center p-12">
          <div className="max-w-2xl">
            <div className="flex items-center gap-3 mb-6">
              <Code className="w-8 h-8 text-[#00ff88]" />
              <h1 className="text-4xl font-bold text-white">
                Portfolio<span className="text-[#00ff88]">_</span>
              </h1>
            </div>
            <p className="text-lg text-neutral-400 leading-relaxed font-mono mb-8">
              Terminal-style interface with high contrast design. Content reflows
              with sharp, precise animations that feel responsive and immediate.
            </p>
            <div className="flex items-center gap-3 px-4 py-3 bg-neutral-950 border border-neutral-800">
              <Terminal className="w-4 h-4 text-[#00ff88]" />
              <span className="text-xs text-neutral-500 font-mono">STATE:</span>
              <span className="text-xs font-bold text-[#00ff88] font-mono uppercase">
                {panelState}
              </span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Chat Panel */}
      <motion.div
        className="fixed top-0 right-0 h-full bg-black border-l border-[#00ff88]/30 flex"
        animate={{ width: `${getPanelWidth()}px` }}
        transition={{
          duration: 0.25,
          ease: [0.22, 1, 0.36, 1]
        }}
      >
        {/* Collapse/Expand Tab */}
        <button
          onClick={togglePanel}
          className="w-14 h-full bg-black hover:bg-neutral-950 transition-colors flex flex-col items-center justify-center gap-4 text-[#00ff88] border-r border-[#00ff88]/30 relative group"
        >
          <motion.div
            animate={{ scale: panelState === 'expanded' ? 1.2 : 1 }}
            transition={{ duration: 0.2 }}
          >
            <Terminal className="w-5 h-5" />
          </motion.div>

          {panelState !== 'expanded' && (
            <div className="writing-vertical text-xs font-bold tracking-wider">
              ASSISTANT
            </div>
          )}

          {/* Animated line */}
          <motion.div
            className="absolute left-0 top-0 w-0.5 bg-[#00ff88]"
            animate={{
              height: panelState === 'expanded' ? '100%' : '0%'
            }}
            transition={{ duration: 0.3 }}
          />
        </button>

        {/* Panel Content */}
        <AnimatePresence>
          {(panelState === 'partial' || panelState === 'expanded') && (
            <motion.div
              className="flex-1 flex flex-col bg-neutral-950"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
            >
              {/* Header */}
              <div className="px-6 py-4 border-b border-neutral-800 bg-black">
                <div className="flex items-center gap-3">
                  <Sparkles className="w-5 h-5 text-[#00ff88]" />
                  <h2 className="text-xs font-mono font-bold text-white tracking-wider">
                    AI_ASSISTANT.sys
                  </h2>
                </div>
                <div className="mt-2 flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-[#00ff88] animate-pulse"></div>
                  <span className="text-xs text-neutral-500 font-mono">ONLINE</span>
                </div>
              </div>

              {/* Messages */}
              {panelState === 'expanded' && (
                <div className="flex-1 overflow-y-auto px-6 py-4">
                  {messages.map((message, idx) => (
                    <TerminalMessage key={idx} {...message} />
                  ))}
                </div>
              )}

              {/* Input Area */}
              {panelState === 'expanded' && (
                <div className="px-6 py-4 border-t border-neutral-800 bg-black">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs font-mono text-[#00ff88]">&gt;</span>
                    <input
                      type="text"
                      placeholder="Enter query..."
                      className="flex-1 px-3 py-2 text-sm font-mono bg-neutral-900 border border-neutral-800 text-white placeholder:text-neutral-600 focus:outline-none focus:border-[#00ff88] transition-colors"
                    />
                  </div>
                  <div className="text-xs text-neutral-600 font-mono">
                    Press ENTER to execute
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Terminal Instruction */}
      <div className="fixed bottom-6 left-6 px-4 py-2 bg-black border border-[#00ff88]/30 text-[#00ff88] text-xs font-mono">
        [CTRL] Click terminal tab to toggle &gt;&gt;
      </div>

      <style jsx>{`
        .writing-vertical {
          writing-mode: vertical-rl;
          text-orientation: mixed;
        }
      `}</style>
    </div>
  );
};

export default TerminalDarkConcept;

/**
 * DESIGN NOTES:
 *
 * Color Palette:
 * - Background: neutral-950 (#0a0a0a)
 * - Panel BG: black (#000000)
 * - Accent: #00ff88 (neon green)
 * - Secondary Accent: blue-500 (#3b82f6)
 * - Borders: #00ff88 with 30% opacity
 * - Text Primary: white (#ffffff)
 * - Text Secondary: neutral-400 (#a3a3a3)
 *
 * Typography:
 * - Font: Monospace stack (JetBrains Mono feel)
 * - All text uses font-mono class
 * - Headings: 700 weight, uppercase for emphasis
 * - Body: 400 weight
 * - Scale: text-xs (12px), text-sm (14px)
 *
 * Animation:
 * - Duration: 250ms (sharper than Concept 1)
 * - Easing: cubic-bezier(0.22, 1, 0.36, 1) [expo-out]
 * - Properties: width, marginRight, opacity, scale
 * - Pulse animation on status indicator
 *
 * Dimensions:
 * - Collapsed: 0px
 * - Partial (tab only): 56px (wider for terminal aesthetic)
 * - Expanded: 400px
 *
 * Distinctive Features:
 * - Terminal-style message prefixes (→ USER, ← AI)
 * - Vertical writing mode on tab
 * - Border animations with accent color
 * - Monospace throughout
 * - High contrast design
 * - Sharp, precise interactions
 */
