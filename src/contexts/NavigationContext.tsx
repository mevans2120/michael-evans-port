'use client';

import { createContext, useContext, useState, ReactNode } from 'react';

type PanelState = 'collapsed' | 'partial' | 'expanded';

interface NavigationContextType {
  panelState: PanelState;
  setPanelState: (state: PanelState) => void;
  chatExpanded: boolean;
  setChatExpanded: (expanded: boolean) => void;
  chatInputFocused: boolean;
  setChatInputFocused: (focused: boolean) => void;
  // Animation orchestration
  chatCloseAnimationComplete: boolean;
  signalChatCloseComplete: () => void;
  resetChatAnimationFlag: () => void;
}

const NavigationContext = createContext<NavigationContextType | undefined>(undefined);

export function NavigationProvider({ children }: { children: ReactNode }) {
  const [panelState, setPanelState] = useState<PanelState>('expanded');
  const [chatExpanded, setChatExpanded] = useState(false);
  const [chatInputFocused, setChatInputFocused] = useState(false);
  const [chatCloseAnimationComplete, setChatCloseAnimationComplete] = useState(false);

  const handleSetChatExpanded = (expanded: boolean) => {
    setChatExpanded(expanded);
    // Reset animation flag when opening chat
    if (expanded) {
      setChatCloseAnimationComplete(false);
    }
  };

  const handleSetChatInputFocused = (focused: boolean) => {
    setChatInputFocused(focused);
    // Reset animation flag when chat becomes active
    if (focused) {
      setChatCloseAnimationComplete(false);
    }
  };

  const signalChatCloseComplete = () => {
    setChatCloseAnimationComplete(true);
  };

  const resetChatAnimationFlag = () => {
    setChatCloseAnimationComplete(false);
  };

  return (
    <NavigationContext.Provider
      value={{
        panelState,
        setPanelState,
        chatExpanded,
        setChatExpanded: handleSetChatExpanded,
        chatInputFocused,
        setChatInputFocused: handleSetChatInputFocused,
        chatCloseAnimationComplete,
        signalChatCloseComplete,
        resetChatAnimationFlag,
      }}
    >
      {children}
    </NavigationContext.Provider>
  );
}

export function useNavigation() {
  const context = useContext(NavigationContext);
  if (!context) {
    throw new Error('useNavigation must be used within NavigationProvider');
  }
  return context;
}
