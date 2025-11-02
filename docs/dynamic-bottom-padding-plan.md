# Dynamic Bottom Padding Implementation Plan

**Goal:** Adjust bottom padding based on chat state to optimize space usage on mobile

**Current State:** Static 200px bottom padding on all mobile pages, regardless of chat state

**Problem:** Wastes ~70px of vertical space when chat is collapsed

---

## Implementation Steps

### 1. Share Chat State Globally (Context)
**File:** `/src/contexts/ChatContext.tsx` (create new)
**Time:** 15 min

```tsx
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
```

---

### 2. Wrap App with ChatProvider
**File:** `/src/app/(public)/layout.tsx`
**Time:** 5 min

```tsx
import { ChatProvider } from '@/contexts/ChatContext'

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <ChatProvider>
      <div className="relative min-h-screen">
        <NavigationPanel />
        <main className="relative">
          {children}
        </main>
      </div>
    </ChatProvider>
  )
}
```

---

### 3. Update ChatSection to Use Context
**File:** `/src/components/navigation/ChatSection.tsx`
**Time:** 10 min

**Current approach:** Local state
```tsx
const [chatExpanded, setChatExpanded] = useState(false)
```

**New approach:** Shared context
```tsx
import { useChatState } from '@/contexts/ChatContext'

export function ChatSection() {
  const { chatExpanded, setChatExpanded } = useChatState()
  // ... rest of component unchanged
}
```

---

### 4. Apply Dynamic Padding to Main Content
**File:** `/src/app/(public)/layout.tsx`
**Time:** 10 min

**Current:**
```tsx
<main className="relative pb-[200px] md:pb-0">
  {children}
</main>
```

**New:**
```tsx
'use client'

import { useChatState } from '@/contexts/ChatContext'
import { cn } from '@/lib/utils'

function MainContent({ children }: { children: React.ReactNode }) {
  const { chatExpanded } = useChatState()
  
  return (
    <main className={cn(
      "relative md:pb-0",
      chatExpanded ? "pb-[50vh]" : "pb-32"  // 50vh when open, 128px when closed
    )}>
      {children}
    </main>
  )
}

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <ChatProvider>
      <div className="relative min-h-screen">
        <NavigationPanel />
        <MainContent>{children}</MainContent>
      </div>
    </ChatProvider>
  )
}
```

---

### 5. Test on Mobile
**Time:** 10 min

**Test Cases:**
- [ ] Chat closed: Bottom padding is ~128px (enough to see content above nav)
- [ ] Chat open: Bottom padding is 50vh (content scrollable while chat visible)
- [ ] Toggle chat: Padding animates smoothly
- [ ] Scroll behavior: Content doesn't jump when toggling chat
- [ ] Desktop: No bottom padding (md:pb-0 still applies)

**Devices to test:**
- iPhone SE (375px)
- iPhone 14 Pro (393px)
- Chrome DevTools mobile emulation

---

## Before/After Comparison

### Before (Static Padding)
```
Chat Closed:  200px bottom padding (70px wasted)
Chat Open:    200px bottom padding (not enough!)
```

### After (Dynamic Padding)
```
Chat Closed:  128px bottom padding (optimal)
Chat Open:    50vh bottom padding (~300-400px, optimal)
```

**Savings:** ~70px of vertical space when chat is closed

---

## Potential Issues & Solutions

### Issue 1: Layout Shift When Toggling Chat
**Solution:** Add transition to padding
```tsx
className={cn(
  "relative md:pb-0 transition-[padding] duration-normal",
  chatExpanded ? "pb-[50vh]" : "pb-32"
)}
```

### Issue 2: Server/Client Mismatch (Hydration Error)
**Solution:** Already using 'use client' in layout, context will be client-only

### Issue 3: Multiple Chat Instances
**Solution:** Context ensures single source of truth, all components sync

---

## Alternative Approaches Considered

### Option A: CSS-only with :has() selector
**Pros:** No JavaScript state management
**Cons:** Limited browser support, harder to debug

### Option B: Local state with prop drilling
**Pros:** Simple, no context overhead
**Cons:** Messy, hard to maintain, lots of prop passing

### Option C: Global state library (Zustand/Redux)
**Pros:** Robust, scalable
**Cons:** Overkill for single boolean state

**Decision:** Use React Context (Option selected above) - balanced approach

---

## Rollback Plan

If issues occur:
1. Remove ChatProvider from layout
2. Revert ChatSection to local state
3. Restore static `pb-[200px]` padding
4. Time to rollback: ~2 minutes

---

## Success Criteria

- [ ] Bottom padding changes when chat toggles
- [ ] No hydration errors
- [ ] Smooth transition between states
- [ ] Works on mobile and desktop
- [ ] Build passes with zero errors
- [ ] No layout shift or jank

---

## Timeline

**Total Estimated Time:** 50 minutes

1. Create ChatContext: 15 min
2. Add ChatProvider to layout: 5 min
3. Update ChatSection: 10 min
4. Apply dynamic padding: 10 min
5. Test on mobile: 10 min

**Buffer for issues:** +10 min
**Grand Total:** ~1 hour

---

## Files Modified

1. `/src/contexts/ChatContext.tsx` (new)
2. `/src/app/(public)/layout.tsx`
3. `/src/components/navigation/ChatSection.tsx`

**Lines changed:** ~40 lines total

---

## Next Steps After Implementation

1. Commit changes with descriptive message
2. Update memory bank
3. Consider adding to visual regression tests
4. Monitor for any user-reported issues
5. Potentially apply same pattern to other dynamic UI states

---

**Status:** Ready to implement
**Priority:** P1 (High impact on mobile UX)
**Risk Level:** Low (easy to rollback)
