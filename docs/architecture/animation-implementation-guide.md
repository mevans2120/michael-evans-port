# Animation Implementation Guide

**Created:** 2025-10-29
**Related:** [Animation Strategy](/docs/architecture/animation-strategy.md)

This guide provides specific, actionable implementation steps to fix the current animation issues in the navigation/chat system.

---

## Quick Reference

### Problems Being Solved
1. Chat input text box animating (should be static)
2. Page load animation glitches
3. Brittle behavior after multiple cycles
4. Mixed animation approaches causing conflicts

### Solution Summary
- Standardize on Framer Motion for layout animations
- Remove CSS transitions from animated containers
- Implement animation orchestration via callbacks
- Protect static children with explicit directives

---

## Implementation Roadmap

### Phase 1: Fix Chat Input Animation (Critical - 30 min)

**Goal:** Prevent input from animating while parent changes height

**Files to modify:**
- `/src/components/navigation/ChatSection.tsx`

**Changes:**

#### 1.1: Replace CSS transition with Framer Motion

**Current code (lines 106-120):**
```tsx
<div
  className={`chat-section flex flex-col border-t md:border-t-0 border-neutral-800 transition-all duration-300 ease-in-out ${
    isDesktop && chatExpanded
      ? 'absolute inset-0 z-10 bg-neutral-900'
      : !isDesktop && chatExpanded
      ? 'absolute bottom-0 left-0 right-0 z-10 bg-neutral-900'
      : ''
  }`}
  style={{
    height: isDesktop
      ? (chatExpanded ? '100%' : '34%')
      : (chatExpanded ? '50vh' : 'auto'),
    transition: 'height 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
  }}
>
```

**New code:**
```tsx
<motion.div
  className={`chat-section flex flex-col border-t md:border-t-0 border-neutral-800 bg-neutral-900 ${
    isDesktop && chatExpanded
      ? 'absolute inset-0 z-10'
      : !isDesktop && chatExpanded
      ? 'absolute bottom-0 left-0 right-0 z-10'
      : ''
  }`}
  layout
  animate={{
    height: isDesktop
      ? (chatExpanded ? '100%' : '34%')
      : (chatExpanded ? '50vh' : 'auto'),
  }}
  transition={{
    duration: 0.3,
    ease: [0.4, 0, 0.2, 1],
  }}
  onAnimationComplete={() => {
    if (!chatExpanded) {
      setChatInputFocused(false);
    }
  }}
>
```

**Explanation:**
- Removed `transition-all` from className
- Removed inline style transition
- Added `motion.div` wrapper
- Added `layout` prop for FLIP animations
- Moved height to `animate` prop
- Added `onAnimationComplete` for cleanup

#### 1.2: Protect static input from animation

**Current code (lines 266-298):**
```tsx
<form
  onSubmit={(e) => {
    // ...
  }}
  className={`px-4 py-3 border-t border-neutral-800 flex gap-2 flex-shrink-0 ${
    !showChatContent ? 'hidden' : ''
  }`}
>
  <input
    ref={inputRef}
    type="text"
    value={input}
    onChange={(e) => setInput(e.target.value)}
    onFocus={handleInputFocus}
    placeholder="Ask about Michael's work..."
    disabled={isLoading}
    className="flex-1 px-3 py-2 text-sm bg-neutral-800 border border-neutral-700 text-white placeholder-neutral-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed"
  />
```

**New code:**
```tsx
<form
  onSubmit={(e) => {
    // ...
  }}
  className={`px-4 py-3 border-t border-neutral-800 flex gap-2 flex-shrink-0 transition-none ${
    !showChatContent ? 'hidden' : ''
  }`}
>
  <input
    ref={inputRef}
    type="text"
    value={input}
    onChange={(e) => setInput(e.target.value)}
    onFocus={handleInputFocus}
    placeholder="Ask about Michael's work..."
    disabled={isLoading}
    className="flex-1 px-3 py-2 text-sm bg-neutral-800 border border-neutral-700 text-white placeholder-neutral-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed transition-none"
  />
```

**Changes:**
- Added `transition-none` to form className
- Added `transition-none` to input className

#### 1.3: Update imports

**Add to top of file:**
```tsx
import { motion } from 'framer-motion'; // Already imported, confirm it's there
```

**Complete diff for Phase 1:**
```diff
  'use client';

  import { useState, useRef, useEffect } from 'react';
  import { useChat } from '@ai-sdk/react';
  import { useNavigation } from '@/contexts/NavigationContext';
  import { useIsDesktop } from '@/hooks/useMediaQuery';
  import { Sparkles, ChevronDown, Send, User, Loader2 } from 'lucide-react';
  import { motion } from 'framer-motion';
  import ReactMarkdown from 'react-markdown';
  import remarkGfm from 'remark-gfm';
  import { SuggestedPrompts } from './SuggestedPrompts';
  import '../chatbot/chatbot.css';

  export function ChatSection() {
    // ... component code ...

    return (
-     <div
-       className={`chat-section flex flex-col border-t md:border-t-0 border-neutral-800 transition-all duration-300 ease-in-out ${
+     <motion.div
+       className={`chat-section flex flex-col border-t md:border-t-0 border-neutral-800 bg-neutral-900 ${
          isDesktop && chatExpanded
-           ? 'absolute inset-0 z-10 bg-neutral-900'
+           ? 'absolute inset-0 z-10'
            : !isDesktop && chatExpanded
-           ? 'absolute bottom-0 left-0 right-0 z-10 bg-neutral-900'
+           ? 'absolute bottom-0 left-0 right-0 z-10'
            : ''
        }`}
-       style={{
+       layout
+       animate={{
          height: isDesktop
            ? (chatExpanded ? '100%' : '34%')
            : (chatExpanded ? '50vh' : 'auto'),
-         transition: 'height 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
        }}
+       transition={{
+         duration: 0.3,
+         ease: [0.4, 0, 0.2, 1],
+       }}
+       onAnimationComplete={() => {
+         if (!chatExpanded) {
+           setChatInputFocused(false);
+         }
+       }}
      >
        {/* Chat Header */}
        {/* ... */}

        {/* Chat Input */}
        <form
          onSubmit={(e) => {
            // ...
          }}
-         className={`px-4 py-3 border-t border-neutral-800 flex gap-2 flex-shrink-0 ${
+         className={`px-4 py-3 border-t border-neutral-800 flex gap-2 flex-shrink-0 transition-none ${
            !showChatContent ? 'hidden' : ''
          }`}
        >
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onFocus={handleInputFocus}
            placeholder="Ask about Michael's work..."
            disabled={isLoading}
-           className="flex-1 px-3 py-2 text-sm bg-neutral-800 border border-neutral-700 text-white placeholder-neutral-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed"
+           className="flex-1 px-3 py-2 text-sm bg-neutral-800 border border-neutral-700 text-white placeholder-neutral-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed transition-none"
          />
          {/* ... */}
        </form>
-     </div>
+     </motion.div>
    );
  }
```

---

### Phase 2: Fix Animation Sequencing (High Priority - 45 min)

**Goal:** Panel contracts AFTER chat closes, not simultaneously

**Files to modify:**
- `/src/contexts/NavigationContext.tsx`
- `/src/components/navigation/NavigationPanel.tsx`
- `/src/components/navigation/ChatSection.tsx` (already modified in Phase 1)

#### 2.1: Add orchestration state to NavigationContext

**Current code:**
```tsx
interface NavigationContextType {
  panelState: PanelState;
  setPanelState: (state: PanelState) => void;
  chatExpanded: boolean;
  setChatExpanded: (expanded: boolean) => void;
  chatInputFocused: boolean;
  setChatInputFocused: (focused: boolean) => void;
}
```

**New code:**
```tsx
interface NavigationContextType {
  panelState: PanelState;
  setPanelState: (state: PanelState) => void;
  chatExpanded: boolean;
  setChatExpanded: (expanded: boolean) => void;
  chatInputFocused: boolean;
  setChatInputFocused: (focused: boolean) => void;
  // New: Animation orchestration
  chatCloseAnimationComplete: boolean;
  resetChatAnimationFlag: () => void;
}
```

**Update provider:**
```tsx
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
        resetChatAnimationFlag,
      }}
    >
      {children}
    </NavigationContext.Provider>
  );
}
```

#### 2.2: Update ChatSection to signal completion

**Modify the onAnimationComplete callback from Phase 1:**

```tsx
<motion.div
  // ... other props ...
  onAnimationComplete={() => {
    if (!chatExpanded) {
      // Signal that chat close animation is complete
      setChatInputFocused(false);
      // This will trigger in NavigationContext's handleSetChatInputFocused
      // which resets chatCloseAnimationComplete
    }
  }}
>
```

**Wait, we need to add a proper completion signal. Update:**

Add to NavigationContext:
```tsx
const [chatCloseAnimationComplete, setChatCloseAnimationComplete] = useState(false);

// Add new function
const signalChatCloseComplete = () => {
  setChatCloseAnimationComplete(true);
};
```

Update NavigationContextType:
```tsx
interface NavigationContextType {
  // ... existing ...
  signalChatCloseComplete: () => void;
}
```

Then in ChatSection.tsx:
```tsx
const {
  panelState,
  chatExpanded,
  setChatExpanded,
  setChatInputFocused,
  signalChatCloseComplete, // NEW
} = useNavigation();

// In the motion.div:
<motion.div
  onAnimationComplete={() => {
    if (!chatExpanded) {
      setChatInputFocused(false);
      signalChatCloseComplete(); // Signal completion
    }
  }}
>
```

#### 2.3: Update NavigationPanel to wait for signal

**Current code (lines 58-64):**
```tsx
transition={{
  type: "spring",
  stiffness: 300,
  damping: 30,
  // Add delay when contracting (chat closing)
  delay: !chatExpanded && !chatInputFocused ? 0.2 : 0,
}}
```

**New code:**
```tsx
transition={{
  duration: 0.3,
  ease: [0.4, 0, 0.2, 1],
  // No delay - sequencing handled by state
}}
```

**Update width calculation:**

```tsx
const {
  panelState,
  chatInputFocused,
  chatExpanded,
  chatCloseAnimationComplete, // NEW
} = useNavigation();

const getPanelWidth = () => {
  if (!isDesktop) return '100%';

  switch (panelState) {
    case 'partial':
      return '80px';
    case 'expanded':
      // Expand when chat is active
      // Contract only after chat close animation completes
      const shouldBeWide = (chatInputFocused || chatExpanded) && !chatCloseAnimationComplete;
      return shouldBeWide ? '455px' : '420px';
    default:
      return '80px';
  }
};
```

**Complete diff for NavigationPanel.tsx:**
```diff
  'use client';

  import { ReactNode } from 'react';
  import { motion } from 'framer-motion';
  import { useNavigation } from '@/contexts/NavigationContext';
  import { useIsDesktop } from '@/hooks/useMediaQuery';

  interface NavigationPanelProps {
    children: ReactNode;
  }

  export function NavigationPanel({ children }: NavigationPanelProps) {
-   const { panelState, setPanelState, chatInputFocused, chatExpanded } = useNavigation();
+   const { panelState, setPanelState, chatInputFocused, chatExpanded, chatCloseAnimationComplete } = useNavigation();
    const isDesktop = useIsDesktop();

    // Calculate panel width based on state and device
    const getPanelWidth = () => {
      if (!isDesktop) return '100%';

      switch (panelState) {
        case 'partial':
          return '80px';
        case 'expanded':
-         // Add 35px when chat is active (expanded or input focused)
-         return (chatInputFocused || chatExpanded) ? '455px' : '420px';
+         // Expand when chat is active, contract only after close animation completes
+         const shouldBeWide = (chatInputFocused || chatExpanded) && !chatCloseAnimationComplete;
+         return shouldBeWide ? '455px' : '420px';
        default:
          return '80px';
      }
    };

    return (
      <motion.div
        className={`...`}
        initial={{ width: isDesktop ? getPanelWidth() : '100%' }}
        animate={{
          width: isDesktop ? getPanelWidth() : '100%',
        }}
        transition={{
-         type: "spring",
-         stiffness: 300,
-         damping: 30,
-         delay: !chatExpanded && !chatInputFocused ? 0.2 : 0,
+         duration: 0.3,
+         ease: [0.4, 0, 0.2, 1],
        }}
        style={{
          height: isDesktop ? '100%' : 'auto',
          cursor: panelState === 'partial' ? 'pointer' : 'default',
        }}
        onClick={panelState === 'partial' ? handleClick : undefined}
      >
        {children}
      </motion.div>
    );
  }
```

---

### Phase 3: Prevent Initial Render Glitches (Medium Priority - 20 min)

**Goal:** Smooth initial page load without animation jumps

**Files to modify:**
- `/src/components/navigation/NavigationPanel.tsx`
- `/src/components/navigation/ChatSection.tsx`

#### 3.1: Disable initial animation in NavigationPanel

**Current code:**
```tsx
<motion.div
  initial={{ width: isDesktop ? getPanelWidth() : '100%' }}
  animate={{
    width: isDesktop ? getPanelWidth() : '100%',
  }}
```

**New code:**
```tsx
<motion.div
  initial={false} // Disable initial animation
  animate={{
    width: isDesktop ? getPanelWidth() : '100%',
  }}
```

**Explanation:**
- `initial={false}` tells Framer Motion to skip initial animation
- Component renders directly in final state
- Prevents "jump" on page load

#### 3.2: Set explicit initial height in ChatSection

**Add to motion.div:**
```tsx
<motion.div
  initial={false} // Disable initial animation
  layout
  animate={{
    height: isDesktop
      ? (chatExpanded ? '100%' : '34%')
      : (chatExpanded ? '50vh' : 'auto'),
  }}
```

---

### Phase 4: Create Animation Constants (Low Priority - 15 min)

**Goal:** Centralize animation timing for consistency

**Create new file:** `/src/lib/animation-constants.ts`

```tsx
/**
 * Centralized animation constants for consistent motion
 */

export const ANIMATION_DURATION = {
  /** 150ms - Quick interactions */
  fast: 0.15,
  /** 300ms - Standard UI animations */
  normal: 0.3,
  /** 500ms - Dramatic transitions */
  slow: 0.5,
} as const;

export const ANIMATION_EASING = {
  /** Standard ease-in-out */
  easeInOut: [0.4, 0, 0.2, 1] as const,
  /** Ease-out - elements entering */
  easeOut: [0, 0, 0.2, 1] as const,
  /** Ease-in - elements exiting */
  easeIn: [0.4, 0, 1, 1] as const,
} as const;

export const LAYOUT_TRANSITION = {
  duration: ANIMATION_DURATION.normal,
  ease: ANIMATION_EASING.easeInOut,
} as const;
```

#### 4.1: Update components to use constants

**ChatSection.tsx:**
```tsx
import { LAYOUT_TRANSITION } from '@/lib/animation-constants';

<motion.div
  transition={LAYOUT_TRANSITION}
>
```

**NavigationPanel.tsx:**
```tsx
import { LAYOUT_TRANSITION } from '@/lib/animation-constants';

<motion.div
  transition={LAYOUT_TRANSITION}
>
```

---

## Testing Checklist

After implementing all phases, test the following:

### Functional Tests

- [ ] **Chat opens smoothly** - Click chat header, expands without glitches
- [ ] **Chat closes smoothly** - Click chevron, collapses in sequence
- [ ] **Input stays static** - Type while chat is animating, no visual shift
- [ ] **Panel width changes after chat** - Panel contracts only after chat closes
- [ ] **Initial page load** - No animation "jump" on first render
- [ ] **Rapid cycles** - Open/close chat 10 times rapidly, still works

### Visual Tests

- [ ] **No text shifting** - Input text doesn't move during animation
- [ ] **No layout jumps** - No sudden position changes
- [ ] **Smooth timing** - Animations feel natural, not too fast/slow
- [ ] **Consistent easing** - All animations use same easing curve

### Edge Cases

- [ ] **Mobile behavior** - Test on mobile viewport
- [ ] **Desktop behavior** - Test on desktop viewport
- [ ] **Slow device** - Throttle CPU in DevTools, still smooth
- [ ] **Multiple quick clicks** - Spam click chat open/close
- [ ] **Browser back/forward** - Navigate away and back

### Performance

- [ ] **No layout thrashing** - Check Performance tab in DevTools
- [ ] **60fps maintained** - No dropped frames during animation
- [ ] **Low CPU usage** - Animation doesn't spike CPU

---

## Rollback Plan

If issues arise, revert in this order:

### Immediate Rollback (Emergency)

**Revert all files:**
```bash
git checkout HEAD -- src/components/navigation/ChatSection.tsx
git checkout HEAD -- src/components/navigation/NavigationPanel.tsx
git checkout HEAD -- src/contexts/NavigationContext.tsx
```

### Partial Rollback

**Keep Phase 1 (fixes input), revert Phase 2 (sequencing):**
```bash
# Keep ChatSection changes
# Revert only NavigationPanel and Context
git checkout HEAD -- src/components/navigation/NavigationPanel.tsx
git checkout HEAD -- src/contexts/NavigationContext.tsx
```

This allows input to remain static while reverting sequencing changes.

---

## Troubleshooting Guide

### Problem: Input still animates

**Diagnosis:**
- Check if `transition-none` was added to both form and input
- Inspect element in DevTools, verify no inherited transitions
- Check for other CSS files overriding with `!important`

**Fix:**
```tsx
// Add more specific CSS to override
<input
  className="... transition-none !transition-none"
  style={{ transition: 'none !important' }}
/>
```

### Problem: Animations feel "laggy"

**Diagnosis:**
- Too many animated elements simultaneously
- Animating layout properties without `layout` prop
- Performance bottleneck elsewhere

**Fix:**
```tsx
// Ensure layout prop is present
<motion.div layout animate={{ height: '100%' }}>

// Check for heavy re-renders
// Add React.memo if component re-renders unnecessarily
export const ChatSection = React.memo(function ChatSection() {
  // ...
});
```

### Problem: Panel contracts before chat closes

**Diagnosis:**
- `chatCloseAnimationComplete` flag not resetting properly
- State update timing issue

**Debug:**
```tsx
// Add logging
console.log('chatExpanded:', chatExpanded);
console.log('chatCloseAnimationComplete:', chatCloseAnimationComplete);
console.log('shouldBeWide:', shouldBeWide);

// Check state in React DevTools
```

**Fix:**
- Verify `resetChatAnimationFlag` is called when opening chat
- Check that `signalChatCloseComplete` is only called on close

### Problem: Animations don't run at all

**Diagnosis:**
- Framer Motion not installed
- Import error
- Initial state equals animate state

**Fix:**
```bash
# Verify Framer Motion installed
npm list framer-motion

# If not installed
npm install framer-motion
```

---

## Code Review Guide

When reviewing these changes, check:

### Architecture
- [ ] Only Framer Motion used for layout animations
- [ ] No CSS transitions on animated containers
- [ ] Static children have `transition-none`

### State Management
- [ ] Animation state flows through NavigationContext
- [ ] State updates are atomic (no race conditions)
- [ ] Callbacks are properly memoized (if needed)

### Performance
- [ ] Using `layout` prop for size changes
- [ ] No unnecessary re-renders
- [ ] Initial animation disabled where appropriate

### Testing
- [ ] All test cases pass
- [ ] No console errors
- [ ] Accessibility maintained

---

## Additional Resources

- [Framer Motion Layout Animations](https://www.framer.com/motion/layout-animations/)
- [Framer Motion AnimatePresence](https://www.framer.com/motion/animate-presence/)
- [CSS Triggers - What forces layout/paint](https://csstriggers.com/)
- [Animation Strategy Document](/docs/architecture/animation-strategy.md)

---

**Implementation Version:** 1.0
**Last Updated:** 2025-10-29
**Estimated Total Time:** 2 hours
