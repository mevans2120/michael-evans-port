'use client';

import { createContext, useContext, useState, ReactNode } from 'react';

type PanelState = 'collapsed' | 'partial' | 'expanded';

interface NavigationContextType {
  panelState: PanelState;
  setPanelState: (state: PanelState) => void;
  chatExpanded: boolean;
  setChatExpanded: (expanded: boolean) => void;
}

const NavigationContext = createContext<NavigationContextType | undefined>(undefined);

export function NavigationProvider({ children }: { children: ReactNode }) {
  const [panelState, setPanelState] = useState<PanelState>('expanded');
  const [chatExpanded, setChatExpanded] = useState(false);

  return (
    <NavigationContext.Provider
      value={{
        panelState,
        setPanelState,
        chatExpanded,
        setChatExpanded
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
