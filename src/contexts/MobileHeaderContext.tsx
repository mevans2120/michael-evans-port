'use client';

import React, { createContext, useContext, useState, type ReactNode } from 'react';

interface MobileHeaderContextType {
  headerVisible: boolean;
  setHeaderVisible: (visible: boolean) => void;
}

const MobileHeaderContext = createContext<MobileHeaderContextType | undefined>(undefined);

export function MobileHeaderProvider({ children }: { children: ReactNode }) {
  const [headerVisible, setHeaderVisible] = useState(true);

  return (
    <MobileHeaderContext.Provider value={{ headerVisible, setHeaderVisible }}>
      {children}
    </MobileHeaderContext.Provider>
  );
}

export function useMobileHeader() {
  const context = useContext(MobileHeaderContext);
  if (context === undefined) {
    throw new Error('useMobileHeader must be used within a MobileHeaderProvider');
  }
  return context;
}
