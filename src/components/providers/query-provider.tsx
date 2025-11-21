"use client"

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useState } from 'react'

export function QueryProvider({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        // Mobile-optimized settings (Phase 3.3)
        staleTime: 1000 * 60 * 5, // 5 min - reduce refetches on slow connections
        gcTime: 1000 * 60 * 10,   // 10 min cache (formerly cacheTime)
        refetchOnWindowFocus: false, // Don't refetch on focus (saves mobile battery)
        refetchOnReconnect: true,    // But refetch when reconnected
        retry: 1,                     // Reduce retry attempts on mobile (faster failures)
      },
    },
  }))

  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  )
}
