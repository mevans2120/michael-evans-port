'use client'

import { createContext, useContext, useState, ReactNode } from 'react'

interface ChatContextType {
  chatExpanded: boolean
  setChatExpanded: (expanded: boolean) => void
}

const ChatContext = createContext<ChatContextType | undefined>(undefined)

export function ChatProvider({ children }: { children: ReactNode }) {
  const [chatExpanded, setChatExpanded] = useState(false)

  return (
    <ChatContext.Provider value={{ chatExpanded, setChatExpanded }}>
      {children}
    </ChatContext.Provider>
  )
}

export function useChatState() {
  const context = useContext(ChatContext)
  if (!context) {
    throw new Error('useChatState must be used within ChatProvider')
  }
  return context
}
