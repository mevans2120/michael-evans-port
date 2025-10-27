import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, MessageSquare, ExternalLink } from 'lucide-react';

/**
 * Concept 1: Minimal Professional
 *
 * Design Philosophy:
 * - Clean, refined aesthetic with subtle shadows
 * - Professional color palette (slate/zinc tones)
 * - Smooth, elegant animations
 * - Familiar patterns (VS Code inspired)
 *
 * Key Features:
 * - 400px panel width when expanded
 * - 48px tab width when collapsed
 * - Content reflows with 300ms ease-out
 * - AI navigation cards with hover states
 * - Auto-collapse after navigation (simulated)
 */

const NavigationCard = ({ title, description, targetSection, onNavigate }) => {
  return (
    <motion.button
      onClick={() => onNavigate(targetSection)}
      className="w-full text-left p-4 rounded-lg bg-slate-50 hover:bg-slate-100 border border-slate-200 transition-colors"
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1">
          <h4 className="text-sm font-semibold text-slate-900 mb-1">{title}</h4>
          <p className="text-xs text-slate-600 leading-relaxed">{description}</p>
        </div>
        <ExternalLink className="w-4 h-4 text-slate-400 flex-shrink-0 mt-0.5" />
      </div>
    </motion.button>
  );
};

const Message = ({ content, isUser, navigationCards = [] }) => {
  return (
    <div className={`flex gap-3 mb-4 ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div className={`max-w-[85%] ${isUser ? 'order-2' : 'order-1'}`}>
        <div className={`px-4 py-2.5 rounded-lg ${
          isUser
            ? 'bg-slate-900 text-white'
            : 'bg-slate-100 text-slate-900'
        }`}>
          <p className="text-sm leading-relaxed">{content}</p>
        </div>

        {navigationCards.length > 0 && (
          <div className="mt-3 space-y-2">
            {navigationCards.map((card, idx) => (
              <NavigationCard key={idx} {...card} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const MinimalProfessionalConcept = () => {
  const [panelState, setPanelState] = useState('partial'); // 'collapsed', 'partial', 'expanded'
  const [messages, setMessages] = useState([
    {
      isUser: false,
      content: "Hi! I'm your AI assistant. I can help you explore Michael's portfolio and answer questions about his work."
    },
    {
      isUser: true,
      content: "Tell me about Michael's AI/ML projects"
    },
    {
      isUser: false,
      content: "Michael has extensive experience in AI/ML. Here are some relevant projects you might want to explore:",
      navigationCards: [
        {
          title: "RAG Chatbot System",
          description: "AI-powered chatbot using Claude Haiku 4.5 with vector search",
          targetSection: "/projects/rag-chatbot",
          onNavigate: (section) => handleNavigate(section)
        },
        {
          title: "Computer Vision Platform",
          description: "ML-based image analysis and object detection system",
          targetSection: "/projects/computer-vision",
          onNavigate: (section) => handleNavigate(section)
        }
      ]
    }
  ]);

  const handleNavigate = (section) => {
    console.log(`Navigating to: ${section}`);
    // Simulate auto-collapse after navigation
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
      case 'partial': return 48;
      case 'expanded': return 400;
      default: return 48;
    }
  };

  return (
    <div className="h-screen w-screen bg-slate-50 overflow-hidden font-sans">
      {/* Main Content Area */}
      <motion.div
        className="h-full bg-white"
        animate={{
          marginRight: `${getPanelWidth()}px`
        }}
        transition={{
          duration: 0.3,
          ease: [0.4, 0, 0.2, 1]
        }}
      >
        <div className="h-full flex items-center justify-center p-12">
          <div className="max-w-2xl text-center">
            <h1 className="text-4xl font-bold text-slate-900 mb-4">
              Portfolio Content
            </h1>
            <p className="text-lg text-slate-600 leading-relaxed">
              This is the main portfolio content area. When the chat panel expands,
              this content smoothly reflows to the left, maintaining readability
              and creating a seamless experience.
            </p>
            <div className="mt-8 inline-flex gap-2 px-4 py-2 bg-slate-100 rounded-lg">
              <span className="text-sm text-slate-600">Panel State:</span>
              <span className="text-sm font-semibold text-slate-900">{panelState}</span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Chat Panel */}
      <motion.div
        className="fixed top-0 right-0 h-full bg-white border-l border-slate-200 shadow-xl flex"
        animate={{ width: `${getPanelWidth()}px` }}
        transition={{
          duration: 0.3,
          ease: [0.4, 0, 0.2, 1]
        }}
      >
        {/* Collapse/Expand Tab */}
        <button
          onClick={togglePanel}
          className="w-12 h-full bg-slate-900 hover:bg-slate-800 transition-colors flex items-center justify-center text-white border-r border-slate-700"
        >
          <motion.div
            animate={{ rotate: panelState === 'expanded' ? 0 : 180 }}
            transition={{ duration: 0.3 }}
          >
            {panelState === 'collapsed' ? (
              <ChevronLeft className="w-5 h-5" />
            ) : (
              <ChevronRight className="w-5 h-5" />
            )}
          </motion.div>
        </button>

        {/* Panel Content */}
        <AnimatePresence>
          {(panelState === 'partial' || panelState === 'expanded') && (
            <motion.div
              className="flex-1 flex flex-col"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              {/* Header */}
              <div className="px-6 py-4 border-b border-slate-200">
                <div className="flex items-center gap-2">
                  <MessageSquare className="w-5 h-5 text-slate-900" />
                  <h2 className="text-sm font-semibold text-slate-900">AI Assistant</h2>
                </div>
              </div>

              {/* Messages */}
              {panelState === 'expanded' && (
                <div className="flex-1 overflow-y-auto px-6 py-4">
                  {messages.map((message, idx) => (
                    <Message key={idx} {...message} />
                  ))}
                </div>
              )}

              {/* Input Area */}
              {panelState === 'expanded' && (
                <div className="px-6 py-4 border-t border-slate-200">
                  <input
                    type="text"
                    placeholder="Ask about Michael's work..."
                    className="w-full px-4 py-2.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent"
                  />
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Click Instruction */}
      <div className="fixed bottom-6 left-6 px-4 py-2 bg-slate-900 text-white text-xs rounded-lg shadow-lg">
        Click the tab on the right to toggle panel states
      </div>
    </div>
  );
};

export default MinimalProfessionalConcept;

/**
 * DESIGN NOTES:
 *
 * Color Palette:
 * - Background: slate-50 (#f8fafc)
 * - Panel BG: white (#ffffff)
 * - Tab BG: slate-900 (#0f172a)
 * - Borders: slate-200 (#e2e8f0)
 * - Text Primary: slate-900 (#0f172a)
 * - Text Secondary: slate-600 (#475569)
 *
 * Typography:
 * - Font: System sans-serif stack
 * - Headings: 600-700 weight
 * - Body: 400 weight
 * - Scale: text-xs (12px), text-sm (14px), text-base (16px)
 *
 * Animation:
 * - Duration: 300ms
 * - Easing: cubic-bezier(0.4, 0, 0.2, 1) [ease-out]
 * - Properties: width, marginRight, opacity
 *
 * Dimensions:
 * - Collapsed: 0px
 * - Partial (tab only): 48px
 * - Expanded: 400px
 *
 * Interactions:
 * - Tab click cycles through states
 * - Navigation cards trigger auto-collapse
 * - Hover states on interactive elements
 * - Smooth content reflow
 */
