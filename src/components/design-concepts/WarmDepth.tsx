'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkle, ArrowUpRight, Layers, Zap } from 'lucide-react';

interface NavigationCardProps {
  title: string;
  description: string;
  targetSection: string;
  onNavigate: (section: string) => void;
}

const GradientNavigationCard: React.FC<NavigationCardProps> = ({ title, description, targetSection, onNavigate }) => {
  return (
    <motion.button
      onClick={() => onNavigate(targetSection)}
      className="w-full text-left p-4 rounded-xl relative overflow-hidden group"
      style={{
        background: 'linear-gradient(135deg, rgba(251, 146, 60, 0.1) 0%, rgba(234, 88, 12, 0.05) 100%)',
        border: '1px solid rgba(251, 146, 60, 0.2)'
      }}
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.98 }}
    >
      <motion.div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity"
        style={{
          background: 'linear-gradient(135deg, rgba(251, 146, 60, 0.15) 0%, rgba(234, 88, 12, 0.1) 100%)'
        }}
      />

      <div className="relative flex items-start gap-3">
        <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{
          background: 'linear-gradient(135deg, #fb923c 0%, #ea580c 100%)'
        }}>
          <ArrowUpRight className="w-4 h-4 text-white" />
        </div>
        <div className="flex-1">
          <h4 className="text-sm font-semibold text-neutral-900 mb-1.5">{title}</h4>
          <p className="text-xs text-neutral-600 leading-relaxed">{description}</p>
        </div>
      </div>
    </motion.button>
  );
};

interface MessageProps {
  content: string;
  isUser: boolean;
  navigationCards?: NavigationCardProps[];
}

const WarmMessage: React.FC<MessageProps> = ({ content, isUser, navigationCards = [] }) => {
  return (
    <div className={`flex gap-3 mb-4 ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div className={`max-w-[85%] ${isUser ? 'order-2' : 'order-1'}`}>
        <motion.div
          className={`px-4 py-3 rounded-2xl backdrop-blur-sm ${
            isUser
              ? 'text-white shadow-lg'
              : 'bg-white/60 text-neutral-900 shadow-md border border-neutral-200/50'
          }`}
          style={isUser ? {
            background: 'linear-gradient(135deg, #fb923c 0%, #ea580c 100%)'
          } : undefined}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <p className="text-sm leading-relaxed">{content}</p>
        </motion.div>

        {navigationCards.length > 0 && (
          <motion.div
            className="mt-3 space-y-2"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.3 }}
          >
            {navigationCards.map((card, idx) => (
              <GradientNavigationCard key={idx} {...card} />
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
};

const WarmDepth: React.FC = () => {
  const [panelState, setPanelState] = useState<'collapsed' | 'partial' | 'expanded'>('partial');
  const [messages] = useState<MessageProps[]>([
    {
      isUser: false,
      content: "Hello! I'm here to help you explore Michael's portfolio. What would you like to know?"
    },
    {
      isUser: true,
      content: "Show me his AI/ML work"
    },
    {
      isUser: false,
      content: "Great question! Michael has several impressive AI/ML projects. Here are some highlights:",
      navigationCards: [
        {
          title: "RAG Chatbot System",
          description: "Intelligent conversational AI with vector search and Claude Haiku 4.5",
          targetSection: "/projects/rag-chatbot",
          onNavigate: (section) => handleNavigate(section)
        },
        {
          title: "Computer Vision Platform",
          description: "Advanced ML system for real-time image analysis and detection",
          targetSection: "/projects/computer-vision",
          onNavigate: (section) => handleNavigate(section)
        }
      ]
    }
  ]);

  const handleNavigate = (section: string) => {
    console.log(`Navigating to: ${section}`);
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
      case 'partial': return 52;
      case 'expanded': return 400;
      default: return 52;
    }
  };

  return (
    <div className="h-screen w-screen overflow-hidden font-sans" style={{
      background: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 50%, #fbbf24 100%)'
    }}>
      {/* Main Content Area */}
      <motion.div
        className="h-full relative"
        animate={{
          marginRight: `${getPanelWidth()}px`
        }}
        transition={{
          duration: 0.35,
          ease: [0.25, 0.46, 0.45, 0.94]
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-transparent backdrop-blur-sm"></div>
        <div className="relative h-full flex items-center justify-center p-12">
          <div className="max-w-2xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg" style={{
                  background: 'linear-gradient(135deg, #fb923c 0%, #ea580c 100%)'
                }}>
                  <Layers className="w-6 h-6 text-white" />
                </div>
                <h1 className="text-5xl font-bold text-neutral-900">
                  Portfolio
                </h1>
              </div>
              <p className="text-lg text-neutral-700 leading-relaxed mb-8">
                A warm, inviting design with rich gradients and depth. The interface
                feels premium and modern, with smooth animations that create a
                sense of quality and attention to detail.
              </p>
              <div className="inline-flex items-center gap-3 px-5 py-3 rounded-xl shadow-md backdrop-blur-sm" style={{
                background: 'rgba(255, 255, 255, 0.7)',
                border: '1px solid rgba(251, 146, 60, 0.2)'
              }}>
                <Zap className="w-4 h-4" style={{ color: '#ea580c' }} />
                <span className="text-sm text-neutral-600">Panel State:</span>
                <span className="text-sm font-bold capitalize" style={{ color: '#ea580c' }}>
                  {panelState}
                </span>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* Chat Panel */}
      <motion.div
        className="fixed top-0 right-0 h-full flex shadow-2xl"
        animate={{ width: `${getPanelWidth()}px` }}
        transition={{
          duration: 0.35,
          ease: [0.25, 0.46, 0.45, 0.94]
        }}
        style={{
          background: 'linear-gradient(180deg, rgba(255, 255, 255, 0.95) 0%, rgba(254, 243, 199, 0.95) 100%)',
          backdropFilter: 'blur(20px)'
        }}
      >
        {/* Collapse/Expand Tab */}
        <button
          onClick={togglePanel}
          className="w-13 h-full relative overflow-hidden flex items-center justify-center text-white transition-all group border-r"
          style={{
            background: 'linear-gradient(180deg, #fb923c 0%, #ea580c 100%)',
            borderColor: 'rgba(234, 88, 12, 0.3)'
          }}
        >
          <motion.div
            className="absolute inset-0"
            style={{
              background: 'linear-gradient(180deg, rgba(255, 255, 255, 0.1) 0%, transparent 100%)',
              opacity: 0
            }}
            whileHover={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          />

          <motion.div
            className="relative"
            animate={{
              rotate: panelState === 'expanded' ? 180 : 0,
              scale: panelState === 'expanded' ? 1.1 : 1
            }}
            transition={{ duration: 0.3 }}
          >
            <Sparkle className="w-5 h-5" />
          </motion.div>

          <motion.div
            className="absolute left-0 top-0 w-1"
            style={{
              background: 'linear-gradient(180deg, #fbbf24 0%, #fb923c 100%)'
            }}
            animate={{
              height: panelState === 'expanded' ? '100%' : '0%'
            }}
            transition={{ duration: 0.4 }}
          />
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
              <div className="px-6 py-5 border-b border-orange-200/50">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{
                    background: 'linear-gradient(135deg, #fb923c 0%, #ea580c 100%)'
                  }}>
                    <Sparkle className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <h2 className="text-sm font-semibold text-neutral-900">AI Assistant</h2>
                    <p className="text-xs text-neutral-600">Always here to help</p>
                  </div>
                </div>
              </div>

              {/* Messages */}
              {panelState === 'expanded' && (
                <div className="flex-1 overflow-y-auto px-6 py-6">
                  {messages.map((message, idx) => (
                    <WarmMessage key={idx} {...message} />
                  ))}
                </div>
              )}

              {/* Input Area */}
              {panelState === 'expanded' && (
                <div className="px-6 py-5 border-t border-orange-200/50">
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Ask me anything..."
                      className="w-full px-4 py-3 pr-12 text-sm rounded-xl backdrop-blur-sm focus:outline-none transition-all"
                      style={{
                        background: 'rgba(255, 255, 255, 0.7)',
                        border: '1px solid rgba(251, 146, 60, 0.2)'
                      }}
                    />
                    <button
                      className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-lg flex items-center justify-center shadow-md transition-transform hover:scale-110"
                      style={{
                        background: 'linear-gradient(135deg, #fb923c 0%, #ea580c 100%)'
                      }}
                    >
                      <ArrowUpRight className="w-4 h-4 text-white" />
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Floating Instruction */}
      <motion.div
        className="fixed bottom-6 left-6 px-5 py-3 rounded-xl shadow-xl backdrop-blur-md"
        style={{
          background: 'rgba(255, 255, 255, 0.9)',
          border: '1px solid rgba(251, 146, 60, 0.2)'
        }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <p className="text-xs font-medium text-neutral-700">
          Click the <span style={{ color: '#ea580c' }}>✨</span> tab to explore
        </p>
      </motion.div>
    </div>
  );
};

export default WarmDepth;
