'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Home, User, Briefcase, Code, Mail, Send, Sparkles, ArrowLeft } from 'lucide-react';

interface NavigationItem {
  label: string;
  href: string;
  icon: React.ReactNode;
}

interface NavigationSection {
  title: string;
  items: NavigationItem[];
}

interface Message {
  content: string;
  isUser: boolean;
  actions?: Array<{
    label: string;
    href: string;
  }>;
}

const navigationSections: NavigationSection[] = [
  {
    title: 'Main',
    items: [
      { label: 'Home', href: '/', icon: <Home className="w-4 h-4" /> },
      { label: 'About', href: '/about', icon: <User className="w-4 h-4" /> },
    ]
  },
  {
    title: 'Work',
    items: [
      { label: 'Casa Bonita', href: '/case-studies/casa-bonita', icon: <Briefcase className="w-4 h-4" /> },
      { label: 'Virgin America', href: '/case-studies/virgin-america', icon: <Briefcase className="w-4 h-4" /> },
      { label: 'Before Launcher', href: '/case-studies/before-launcher', icon: <Briefcase className="w-4 h-4" /> },
    ]
  },
  {
    title: 'AI Projects',
    items: [
      { label: 'Post Pal', href: '/ai-projects/post-pal', icon: <Code className="w-4 h-4" /> },
      { label: 'AI Research', href: '/ai-projects/ai-research-agent', icon: <Code className="w-4 h-4" /> },
      { label: 'Department of Art', href: '/ai-projects/department-of-art', icon: <Code className="w-4 h-4" /> },
    ]
  }
];

const NavItem: React.FC<{ item: NavigationItem; isExpanded: boolean }> = ({ item, isExpanded }) => {
  return (
    <a
      href={item.href}
      className="group flex items-center gap-3 px-3 py-2 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 transition-all"
    >
      <span className="group-hover:text-white transition-colors">
        {item.icon}
      </span>
      {isExpanded && (
        <span className="text-sm">
          {item.label}
        </span>
      )}
    </a>
  );
};

const ChatMessage: React.FC<{ message: Message }> = ({ message }) => {
  return (
    <div className={`mb-4 ${message.isUser ? 'flex justify-end' : 'flex justify-start'}`}>
      <div className={`max-w-[85%] ${message.isUser ? 'order-2' : 'order-1'}`}>
        <div className={`px-4 py-2.5 rounded-lg ${
          message.isUser
            ? 'bg-purple-600 text-white'
            : 'bg-neutral-800 text-neutral-200'
        }`}>
          <p className="text-sm leading-relaxed">{message.content}</p>
        </div>

        {message.actions && message.actions.length > 0 && (
          <div className="mt-2 space-y-2">
            {message.actions.map((action, idx) => (
              <a
                key={idx}
                href={action.href}
                className="block px-3 py-2 text-sm bg-neutral-800 hover:bg-neutral-700 text-neutral-300 hover:text-white rounded-lg border border-neutral-700 transition-all"
              >
                <div className="flex items-center justify-between">
                  <span>{action.label}</span>
                  <ChevronRight className="w-3 h-3" />
                </div>
              </a>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const MinimalProfessional: React.FC = () => {
  const [panelState, setPanelState] = useState<'collapsed' | 'partial' | 'expanded'>('partial');
  const [showChat, setShowChat] = useState(false);
  const [messages] = useState<Message[]>([
    {
      content: "Hi! I can help you explore Michael's portfolio. What would you like to know?",
      isUser: false
    },
    {
      content: "Show me his AI/ML work",
      isUser: true
    },
    {
      content: "Here are some of Michael's AI projects:",
      isUser: false,
      actions: [
        { label: "RAG Chatbot System", href: "/ai-projects/chatbot" },
        { label: "Post Pal - Social Media Tool", href: "/ai-projects/post-pal" },
      ]
    }
  ]);

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
      case 'partial': return 64;
      case 'expanded': return 360;
      default: return 64;
    }
  };

  const isExpanded = panelState === 'expanded';

  return (
    <div className="h-screen w-screen bg-neutral-950 overflow-hidden font-sans text-neutral-100">
      {/* Main Content Area */}
      <motion.div
        className="h-full bg-neutral-950"
        animate={{
          marginRight: `${getPanelWidth()}px`
        }}
        transition={{
          duration: 0.3,
          ease: [0.4, 0, 0.2, 1]
        }}
      >
        {/* Top Navigation Bar */}
        <div className="fixed top-0 left-0 right-0 z-10 bg-neutral-950/80 backdrop-blur-sm border-b border-neutral-800">
          <motion.div
            className="px-8 py-4"
            animate={{
              marginRight: `${getPanelWidth()}px`
            }}
            transition={{
              duration: 0.3,
              ease: [0.4, 0, 0.2, 1]
            }}
          >
            <div className="text-base font-medium">
              M<span className="text-purple-400">Evans</span>
            </div>
          </motion.div>
        </div>

        {/* Hero Content */}
        <div className="h-full flex items-center px-8 md:px-16 pt-16">
          <div className="max-w-4xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="text-5xl md:text-7xl font-light leading-tight mb-8 text-neutral-100">
                Michael Evans
              </h1>
              <p className="text-xl md:text-2xl font-light text-neutral-400 leading-relaxed">
                shipped the first responsive{' '}
                <span className="text-purple-400 underline decoration-2 underline-offset-4">
                  airline website
                </span>
              </p>
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* Right Panel */}
      <motion.div
        className="fixed top-0 right-0 h-full bg-neutral-900 border-l border-neutral-800 flex"
        animate={{ width: `${getPanelWidth()}px` }}
        transition={{
          duration: 0.3,
          ease: [0.4, 0, 0.2, 1]
        }}
      >
        {/* Toggle Tab */}
        <button
          onClick={togglePanel}
          className="w-16 h-full bg-neutral-950 hover:bg-neutral-900 transition-colors flex flex-col items-center justify-center gap-4 text-neutral-400 hover:text-neutral-200 border-r border-neutral-800 relative group"
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

          {panelState !== 'expanded' && (
            <div className="[writing-mode:vertical-rl] text-[10px] uppercase tracking-widest font-medium text-neutral-500 group-hover:text-neutral-400">
              Menu
            </div>
          )}

          <motion.div
            className="absolute left-0 top-0 w-0.5 bg-purple-500"
            animate={{
              height: panelState === 'expanded' ? '100%' : '0%'
            }}
            transition={{ duration: 0.3 }}
          />
        </button>

        {/* Panel Content */}
        <AnimatePresence mode="wait">
          {(panelState === 'partial' || panelState === 'expanded') && (
            <motion.div
              key={showChat ? 'chat' : 'nav'}
              className="flex-1 flex flex-col bg-neutral-900"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
            >
              {/* Navigation View */}
              {!showChat && (
                <>
                  <div className="flex-1 overflow-y-auto py-6">
                    {navigationSections.map((section, sectionIdx) => (
                      <div key={sectionIdx} className="mb-6">
                        {isExpanded && (
                          <div className="px-6 mb-2">
                            <h3 className="text-xs uppercase tracking-wider text-neutral-600 font-medium">
                              {section.title}
                            </h3>
                          </div>
                        )}
                        <div className="px-3 space-y-1">
                          {section.items.map((item, itemIdx) => (
                            <NavItem key={itemIdx} item={item} isExpanded={isExpanded} />
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="border-t border-neutral-800">
                    {isExpanded && (
                      <>
                        <div className="px-6 py-4">
                          <a
                            href="mailto:hello@mevans212.com"
                            className="flex items-center gap-3 px-3 py-2 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 transition-all group"
                          >
                            <Mail className="w-4 h-4 group-hover:text-white transition-colors" />
                            <span className="text-sm">Contact</span>
                          </a>
                        </div>
                        <div className="px-6 pb-6">
                          <button
                            onClick={() => setShowChat(true)}
                            className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-purple-600 hover:bg-purple-700 text-white transition-all"
                          >
                            <Sparkles className="w-4 h-4" />
                            <span className="text-sm font-medium">Ask AI Assistant</span>
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                </>
              )}

              {/* Chat View */}
              {showChat && isExpanded && (
                <>
                  <div className="px-6 py-4 border-b border-neutral-800">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-purple-400" />
                        <h2 className="text-sm font-medium text-white">
                          AI Assistant
                        </h2>
                      </div>
                      <button
                        onClick={() => setShowChat(false)}
                        className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 transition-all"
                      >
                        <ArrowLeft className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div className="flex-1 overflow-y-auto px-4 py-4">
                    {messages.map((message, idx) => (
                      <ChatMessage key={idx} message={message} />
                    ))}
                  </div>

                  <div className="px-4 py-4 border-t border-neutral-800">
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="Ask about Michael's work..."
                        className="flex-1 px-3 py-2 text-sm bg-neutral-800 border border-neutral-700 text-white placeholder:text-neutral-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      />
                      <button className="p-2 bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors">
                        <Send className="w-4 h-4 text-white" />
                      </button>
                    </div>
                  </div>
                </>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default MinimalProfessional;
