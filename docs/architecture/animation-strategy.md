# Animation Architecture Strategy

**Created:** 2025-10-29
**Status:** Active
**Author:** System Architecture Analysis

---

## Executive Summary

This document provides a comprehensive analysis of the animation architecture problems in the portfolio's navigation/chat system and establishes patterns for scalable, maintainable animations throughout the application.

### Key Problems Identified
1. **Mixed animation approaches** causing conflicts (Framer Motion + CSS transitions + inline styles)
2. **Animation inheritance** - child elements unintentionally participating in parent animations
3. **Brittle sequencing** with setTimeout and delayed transitions
4. **Layering violations** - transforms and transitions applied at wrong component levels
5. **Initial render glitches** from competing animation systems

### Recommended Solution
**Standardize on Framer Motion** with clear component boundaries and explicit animation control through layout IDs and animation presence.

---

## Table of Contents

1. [Current State Analysis](#current-state-analysis)
2. [Root Cause Analysis](#root-cause-analysis)
3. [Animation Architecture Principles](#animation-architecture-principles)
4. [Recommended Pattern](#recommended-pattern)
5. [Migration Strategy](#migration-strategy)
6. [Best Practices & Anti-Patterns](#best-practices--anti-patterns)
7. [Implementation Examples](#implementation-examples)
8. [Future Guidelines](#future-guidelines)

---

## Current State Analysis

### Component Animation Map

#### NavigationPanel.tsx
**Current Implementation:**
```tsx
<motion.div
  initial={{ width: isDesktop ? getPanelWidth() : '100%' }}
  animate={{ width: isDesktop ? getPanelWidth() : '100%' }}
  transition={{
    type: "spring",
    stiffness: 300,
    damping: 30,
    delay: !chatExpanded && !chatInputFocused ? 0.2 : 0,
  }}
>
```

**Issues:**
- Spring animation with 0.2s delay for sequencing
- Width change: 420px → 455px (35px) when chat active
- Uses Framer Motion's spring physics
- Delay-based sequencing is fragile

#### ChatSection.tsx
**Current Implementation:**
```tsx
<div
  className="transition-all duration-300 ease-in-out"
  style={{
    height: isDesktop
      ? (chatExpanded ? '100%' : '34%')
      : (chatExpanded ? '50vh' : 'auto'),
    transition: 'height 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
  }}
>
```

**Issues:**
- **Mixed approaches**: CSS transition (className) + inline style transition
- Height animates from 34% → 100%
- CSS transition applies to ALL properties via `transition-all`
- **Input inherits transitions**: The `transition-all` cascades to children
- No explicit control over animation presence

#### Message Components
**Current Implementation:**
```tsx
<motion.div
  initial={{ opacity: 0, y: 10 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.2 }}
>
```

**Status:** Working correctly - isolated entrance animations

#### SuggestedPrompts.tsx
**Current Implementation:**
```tsx
<motion.div
  initial={{ opacity: 0, y: 10 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.3 }}
>
  <motion.button
    initial={{ opacity: 0, x: -20 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{
      duration: 0.3,
      delay: index * 0.1,
      type: "spring",
      stiffness: 100
    }}
    whileHover={{ scale: 1.02, x: 4 }}
    whileTap={{ scale: 0.98 }}
  >
```

**Status:** Working correctly - staggered entrance with hover states

---

## Root Cause Analysis

### Problem 1: Animation Inheritance from CSS Transitions

**The Core Issue:**
```tsx
// ChatSection.tsx line 107
<div className="transition-all duration-300 ease-in-out">
  {/* ... */}
  <input className="flex-1 px-3 py-2 ..." />  {/* Inherits transition-all! */}
</div>
```

**Why It Happens:**
- `transition-all` applies transitions to ALL CSS properties
- CSS transitions cascade to child elements unless explicitly overridden
- When the parent's height animates, children's layout recalculates
- The input's position/width changes trigger the inherited transitions

**Visual Result:**
- Input box appears to "slide" or "jump" during parent height change
- Text inside input may appear to animate/shift
- Focus ring animates instead of appearing instantly

**Solution:**
- Use specific transition properties: `transition: height 0.3s ease-in-out`
- OR use Framer Motion which provides better isolation
- OR add `transition: none` to static children

### Problem 2: Mixed Animation Systems Conflict

**The Conflict:**
```tsx
// NavigationPanel: Framer Motion with spring
<motion.div transition={{ type: "spring", stiffness: 300, damping: 30 }}>
  {/* ChatSection: CSS transition with cubic-bezier */}
  <div style={{ transition: 'height 0.3s cubic-bezier(0.4, 0, 0.2, 1)' }}>
```

**Why It's Problematic:**
1. **Different timing functions**: Spring physics vs cubic-bezier create visual disconnect
2. **Competing transforms**: Both systems may try to control layout
3. **Stacking contexts**: Transforms create new stacking contexts unpredictably
4. **Debug difficulty**: Can't tell which system is causing issues
5. **Performance**: Browser handles CSS transitions and JS-driven animations differently

**Visual Result:**
- Jerky, non-smooth animations
- Components "fighting" each other
- Unpredictable behavior after multiple cycles
- Initial render glitches as systems initialize

### Problem 3: Delay-Based Sequencing is Fragile

**The Current Approach:**
```tsx
// NavigationPanel.tsx line 63
transition={{
  delay: !chatExpanded && !chatInputFocused ? 0.2 : 0,
}}
```

**Why It Breaks:**
1. **Timing assumptions**: Assumes ChatSection always takes exactly 0.2s
2. **State race conditions**: If state updates faster than delay, sequence breaks
3. **No guarantees**: Delay doesn't wait for previous animation completion
4. **Hard to maintain**: Changing one animation duration requires updating all delays
5. **Brittle on slower devices**: Performance variance breaks timing

**Visual Result:**
- Panel starts contracting while chat is still closing
- Animations overlap when they shouldn't
- Different behavior on different devices/browsers
- Breaks after rapid open/close cycles

### Problem 4: Inline Styles Override CSS Classes

**The Pattern:**
```tsx
<div
  className="transition-all duration-300 ease-in-out"  // Ignored!
  style={{
    transition: 'height 0.3s cubic-bezier(0.4, 0, 0.2, 1)'  // Takes precedence
  }}
>
```

**Why It's Confusing:**
- Inline styles always override CSS classes
- Developers see `className="transition-all"` and expect it to work
- Actual behavior controlled by inline style
- Creates maintenance confusion

### Problem 5: Absolute Positioning During Animation

**The Pattern:**
```tsx
className={`chat-section flex flex-col ${
  isDesktop && chatExpanded
    ? 'absolute inset-0 z-10 bg-neutral-900'  // Position changes!
    : ''
}`}
```

**Why It's Problematic:**
1. **Layout shifts**: Changing from static → absolute removes from flow
2. **Triggers reflow**: Browser must recalculate entire layout
3. **Paint thrashing**: Multiple layout recalculations during animation
4. **Inconsistent origin**: Transform origin changes between static/absolute

**Visual Result:**
- "Jump" on initial expand/collapse
- Content shift as positioning changes
- Jerky animation start/end

---

## Animation Architecture Principles

### Principle 1: Single Source of Truth

**Rule:** One animation system per component tree

**Why:**
- Prevents conflicts between animation systems
- Makes debugging straightforward
- Ensures consistent timing and easing
- Reduces bundle size (one library instead of multiple approaches)

**For This Project:**
- **Primary:** Framer Motion for all layout animations
- **Secondary:** Tailwind transitions for simple hover/focus states only
- **Never:** Mix systems on the same animating property

### Principle 2: Explicit Animation Boundaries

**Rule:** Only animate at component boundaries, not within

**Pattern:**
```tsx
// GOOD: Animate the container
<motion.div animate={{ height: expanded ? '100%' : '34%' }}>
  <StaticContent />  {/* No animation */}
</motion.div>

// BAD: Animate parent and children separately
<motion.div animate={{ height: '100%' }}>
  <motion.div animate={{ opacity: 1 }}>  {/* Conflict! */}
</motion.div>
```

**Why:**
- Prevents animation inheritance issues
- Clear mental model of what animates
- Easier to debug (one animated layer)
- Better performance (fewer animated nodes)

### Principle 3: Layout Animations Should Not Affect Static Children

**Rule:** Children of animated containers should remain static

**Implementation:**
```tsx
// Parent animates layout
<motion.div layout>
  {/* Child explicitly opts out */}
  <input className="transition-none" />
</motion.div>
```

**Why:**
- Input fields should never animate (poor UX)
- Text content should remain stable
- Interactive elements need instant feedback
- Prevents jarring visual shifts

### Principle 4: Animate Position, Not Layout Properties When Possible

**Rule:** Prefer transform-based animations over layout property changes

**Good:**
```tsx
// Animates transform (GPU-accelerated)
<motion.div
  initial={{ y: -100 }}
  animate={{ y: 0 }}
/>
```

**Bad:**
```tsx
// Animates height (triggers reflow)
<motion.div
  initial={{ height: 0 }}
  animate={{ height: 'auto' }}
/>
```

**Why:**
- Transforms are GPU-accelerated
- No layout recalculation needed
- 60fps performance even on slow devices
- No paint/layout thrashing

**Exception:** When layout changes ARE needed (like this chat panel), use Framer Motion's `layout` prop for automatic FLIP animations.

### Principle 5: Orchestrate, Don't Delay

**Rule:** Use animation completion callbacks, not delays

**Good:**
```tsx
<motion.div
  animate={{ height: 0 }}
  onAnimationComplete={() => {
    // Now contract the panel
    setPanelWidth(420);
  }}
/>
```

**Bad:**
```tsx
<motion.div
  animate={{ height: 0 }}
/>
// Meanwhile, in another component...
<motion.div
  animate={{ width: 420 }}
  transition={{ delay: 0.2 }}  // Hope the first one finishes!
/>
```

**Why:**
- Guaranteed sequencing regardless of performance
- Animations can't get out of sync
- Easy to change timing without breaking sequences
- Self-documenting code (clear dependencies)

---

## Recommended Pattern

### Pattern: Layout Animation with Static Children

This is the **canonical pattern** for this application's navigation/chat animations.

```tsx
import { motion, AnimatePresence } from 'framer-motion';

interface AnimatedContainerProps {
  isExpanded: boolean;
  onAnimationComplete?: () => void;
  children: React.ReactNode;
}

function AnimatedContainer({ isExpanded, onAnimationComplete, children }: AnimatedContainerProps) {
  return (
    <motion.div
      // Use layout prop for automatic FLIP animations
      layout
      // Define specific animated properties
      animate={{
        height: isExpanded ? '100%' : '34%',
      }}
      transition={{
        duration: 0.3,
        ease: [0.4, 0, 0.2, 1], // CSS cubic-bezier equivalent
      }}
      onAnimationComplete={onAnimationComplete}
      // Static styles (non-animated)
      className="flex flex-col bg-neutral-900"
    >
      {/* Static children - wrap in non-animated div */}
      <div className="transition-none">
        {children}
      </div>
    </motion.div>
  );
}
```

### Pattern: Orchestrated Sequence

For animations that must happen in sequence:

```tsx
function OrchestatedAnimation() {
  const [stage, setStage] = useState<'initial' | 'chatClosing' | 'panelContracting' | 'complete'>('initial');

  const handleChatClose = () => {
    setStage('chatClosing');
  };

  return (
    <>
      {/* Step 1: Chat collapses */}
      <motion.div
        animate={{
          height: stage === 'chatClosing' || stage === 'initial' ? '34%' : '100%'
        }}
        onAnimationComplete={() => {
          if (stage === 'chatClosing') {
            setStage('panelContracting');
          }
        }}
      >
        <ChatContent />
      </motion.div>

      {/* Step 2: Panel contracts (only after chat closes) */}
      <motion.div
        animate={{
          width: stage === 'panelContracting' ? 420 : 455
        }}
        onAnimationComplete={() => {
          if (stage === 'panelContracting') {
            setStage('complete');
          }
        }}
      >
        <PanelContent />
      </motion.div>
    </>
  );
}
```

### Pattern: Presence Animations

For enter/exit animations:

```tsx
function PresenceAnimation() {
  const [isVisible, setIsVisible] = useState(true);

  return (
    <AnimatePresence
      mode="wait" // Wait for exit before entering new component
      onExitComplete={() => console.log('Exit complete')}
    >
      {isVisible && (
        <motion.div
          key="chat-expanded"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.2 }}
        >
          <Content />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
```

---

## Migration Strategy

### Phase 1: Standardize Chat Section (High Priority)

**Goal:** Fix the input animation issue and standardize on Framer Motion

**Changes to ChatSection.tsx:**

1. **Remove CSS transitions**
   ```tsx
   // BEFORE
   <div className="transition-all duration-300 ease-in-out" style={{ transition: '...' }}>

   // AFTER
   <motion.div>
   ```

2. **Add explicit layout control**
   ```tsx
   <motion.div
     layout
     animate={{
       height: isDesktop
         ? (chatExpanded ? '100%' : '34%')
         : (chatExpanded ? '50vh' : 'auto')
     }}
     transition={{
       duration: 0.3,
       ease: [0.4, 0, 0.2, 1],
     }}
   >
   ```

3. **Protect static children**
   ```tsx
   {/* Chat Input - Explicitly prevent animation */}
   <form className="transition-none">
     <input className="transition-none" />
   </form>
   ```

4. **Add animation completion callback**
   ```tsx
   <motion.div
     onAnimationComplete={(definition) => {
       if (!chatExpanded) {
         // Signal to NavigationPanel to contract
         onChatFullyClosed?.();
       }
     }}
   >
   ```

### Phase 2: Coordinate Panel Width Change (Medium Priority)

**Goal:** Panel contracts AFTER chat closes, not during

**Changes to NavigationPanel.tsx:**

1. **Remove delay-based sequencing**
   ```tsx
   // BEFORE
   transition={{
     delay: !chatExpanded && !chatInputFocused ? 0.2 : 0,
   }}

   // AFTER
   transition={{
     duration: 0.3,
     ease: [0.4, 0, 0.2, 1],
   }}
   ```

2. **React to chat close callback**
   ```tsx
   const [shouldContract, setShouldContract] = useState(false);

   <motion.div
     animate={{
       width: (chatInputFocused || chatExpanded) && !shouldContract
         ? '455px'
         : '420px'
     }}
   >
   ```

3. **Coordinate with ChatSection**
   ```tsx
   // In NavigationContext, add:
   const [chatAnimationComplete, setChatAnimationComplete] = useState(false);

   // ChatSection calls this when close animation completes
   // Then NavigationPanel can safely contract
   ```

### Phase 3: Eliminate Initial Render Glitches (Medium Priority)

**Goal:** Smooth initial page load

**Strategy:**

1. **Set initial states to match first render**
   ```tsx
   // BEFORE
   <motion.div initial={{ width: getPanelWidth() }}>

   // AFTER
   <motion.div initial={false}> // Disable initial animation
   ```

2. **Use AnimatePresence for conditional rendering**
   ```tsx
   <AnimatePresence initial={false}>
     {chatExpanded && (
       <motion.div
         initial={{ height: '34%' }}
         animate={{ height: '100%' }}
         exit={{ height: '34%' }}
       >
   ```

3. **Prevent layout shift on mount**
   ```tsx
   // Set explicit dimensions before animation runs
   <motion.div
     style={{ height: '34%' }} // Static initial value
     animate={{ height: chatExpanded ? '100%' : '34%' }}
   >
   ```

### Phase 4: Standardize Animation Constants (Low Priority)

**Goal:** Consistent timing and easing across app

**Create animation constants:**

```tsx
// src/lib/animation-constants.ts
export const ANIMATION_DURATION = {
  fast: 0.15,
  normal: 0.3,
  slow: 0.5,
} as const;

export const ANIMATION_EASING = {
  // CSS cubic-bezier equivalents
  easeInOut: [0.4, 0, 0.2, 1],
  easeOut: [0, 0, 0.2, 1],
  easeIn: [0.4, 0, 1, 1],
  // Spring presets
  springSnappy: { type: 'spring', stiffness: 400, damping: 30 },
  springSmooth: { type: 'spring', stiffness: 300, damping: 30 },
  springGentle: { type: 'spring', stiffness: 200, damping: 25 },
} as const;

export const LAYOUT_ANIMATION_DEFAULTS = {
  duration: ANIMATION_DURATION.normal,
  ease: ANIMATION_EASING.easeInOut,
} as const;
```

**Usage:**
```tsx
import { ANIMATION_DURATION, ANIMATION_EASING } from '@/lib/animation-constants';

<motion.div
  transition={{
    duration: ANIMATION_DURATION.normal,
    ease: ANIMATION_EASING.easeInOut,
  }}
>
```

---

## Best Practices & Anti-Patterns

### Best Practices

#### 1. Use Layout Prop for Container Animations
```tsx
// GOOD: Layout prop automatically handles size/position changes
<motion.div layout>
  <DynamicContent />
</motion.div>

// Framer Motion uses FLIP technique under the hood for 60fps
```

#### 2. Isolate Animated Layers
```tsx
// GOOD: Clear separation
<motion.div animate={{ height: '100%' }}>
  <div className="transition-none">
    <input /> {/* Explicitly static */}
  </div>
</motion.div>
```

#### 3. Use Semantic Animation Keys
```tsx
// GOOD: Clear intent
const variants = {
  collapsed: { height: '34%' },
  expanded: { height: '100%' },
};

<motion.div
  variants={variants}
  animate={isExpanded ? 'expanded' : 'collapsed'}
>
```

#### 4. Provide Reduced Motion Support
```tsx
import { useReducedMotion } from 'framer-motion';

function AnimatedComponent() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.div
      animate={{ height: '100%' }}
      transition={{
        duration: shouldReduceMotion ? 0 : 0.3,
      }}
    >
  );
}
```

#### 5. Use onAnimationComplete for Sequences
```tsx
// GOOD: Guaranteed sequencing
<motion.div
  animate={{ opacity: 0 }}
  onAnimationComplete={() => {
    setShowNext(true);
  }}
/>
```

### Anti-Patterns

#### 1. Mixing Animation Systems
```tsx
// BAD: CSS and Framer Motion on same element
<motion.div
  className="transition-all"
  animate={{ height: '100%' }}
>
```

#### 2. Animating Layout Properties Without Layout Prop
```tsx
// BAD: Animating height directly causes reflow
<motion.div animate={{ height: '100%' }}>

// GOOD: Use layout prop
<motion.div layout animate={{ height: '100%' }}>
```

#### 3. Using setTimeout for Sequencing
```tsx
// BAD: Fragile timing
setTimeout(() => {
  setPanelWidth(420);
}, 200);

// GOOD: Use animation callbacks
onAnimationComplete={() => setPanelWidth(420)}
```

#### 4. transition-all on Parent Containers
```tsx
// BAD: Children inherit unwanted transitions
<div className="transition-all">
  <input /> {/* Will animate! */}
</div>

// GOOD: Specific properties
<div className="transition-[height]">
  <input />
</div>
```

#### 5. Inline Style Transitions
```tsx
// BAD: Overrides className, confusing
<div
  className="transition-all"
  style={{ transition: 'height 0.3s' }}
>

// GOOD: One source of truth
<motion.div
  transition={{ duration: 0.3 }}
>
```

#### 6. Changing Position During Animation
```tsx
// BAD: Position change causes layout shift
<div className={isExpanded ? 'absolute' : 'relative'}>

// GOOD: Keep position consistent
<div className="absolute">
```

---

## Implementation Examples

### Example 1: Fixed ChatSection (Complete)

```tsx
'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useNavigation } from '@/contexts/NavigationContext';
import { useIsDesktop } from '@/hooks/useMediaQuery';
import { ANIMATION_DURATION, ANIMATION_EASING } from '@/lib/animation-constants';

export function ChatSection() {
  const {
    panelState,
    chatExpanded,
    setChatExpanded,
    setChatInputFocused,
    onChatAnimationComplete, // New callback
  } = useNavigation();
  const isDesktop = useIsDesktop();

  const handleClose = () => {
    setChatExpanded(false);
    setChatInputFocused(false);
  };

  const handleAnimationComplete = () => {
    if (!chatExpanded) {
      // Notify parent that chat is fully closed
      onChatAnimationComplete?.();
    }
  };

  return (
    <motion.div
      // Remove all CSS transitions
      className="chat-section flex flex-col border-t md:border-t-0 border-neutral-800 bg-neutral-900"
      // Use layout for automatic FLIP animations
      layout
      // Explicit height animation
      animate={{
        height: isDesktop
          ? (chatExpanded ? '100%' : '34%')
          : (chatExpanded ? '50vh' : 'auto'),
      }}
      transition={{
        duration: ANIMATION_DURATION.normal,
        ease: ANIMATION_EASING.easeInOut,
      }}
      onAnimationComplete={handleAnimationComplete}
      // Keep position consistent (always takes up layout space)
      style={{
        position: isDesktop && chatExpanded ? 'absolute' : 'relative',
        inset: isDesktop && chatExpanded ? 0 : undefined,
        zIndex: isDesktop && chatExpanded ? 10 : undefined,
      }}
    >
      {/* Chat Header - static */}
      <div className="transition-none px-8 py-6 border-b border-neutral-800 flex items-center justify-between flex-shrink-0">
        {/* Header content */}
      </div>

      {/* Messages - conditionally rendered with AnimatePresence */}
      <AnimatePresence>
        {(showChatContent || chatExpanded) && (
          <motion.div
            key="messages"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: ANIMATION_DURATION.fast }}
            className="flex-1 overflow-y-auto px-4 py-4 hide-scrollbar"
          >
            {messages.map((message) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: ANIMATION_DURATION.fast }}
              >
                {/* Message content */}
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Chat Input - explicitly static */}
      <form className="transition-none px-4 py-3 border-t border-neutral-800 flex gap-2 flex-shrink-0">
        <input
          className="flex-1 px-3 py-2 text-sm bg-neutral-800 border border-neutral-700 text-white placeholder-neutral-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition-none"
          type="text"
          placeholder="Ask about Michael's work..."
        />
        <button
          type="submit"
          className="p-2 bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors"
        >
          <Send className="w-4 h-4 text-white" />
        </button>
      </form>
    </motion.div>
  );
}
```

### Example 2: Coordinated NavigationPanel

```tsx
'use client';

import { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { useNavigation } from '@/contexts/NavigationContext';
import { useIsDesktop } from '@/hooks/useMediaQuery';
import { ANIMATION_DURATION, ANIMATION_EASING } from '@/lib/animation-constants';

interface NavigationPanelProps {
  children: ReactNode;
}

export function NavigationPanel({ children }: NavigationPanelProps) {
  const {
    panelState,
    chatInputFocused,
    chatExpanded,
    chatAnimationComplete, // New state from context
  } = useNavigation();
  const isDesktop = useIsDesktop();

  const getPanelWidth = () => {
    if (!isDesktop) return '100%';

    switch (panelState) {
      case 'partial':
        return '80px';
      case 'expanded':
        // Expand width when chat is active
        // Contract when chat close animation completes
        return (chatInputFocused || chatExpanded) && !chatAnimationComplete
          ? '455px'
          : '420px';
      default:
        return '80px';
    }
  };

  return (
    <motion.div
      className="fixed md:relative bottom-0 md:bottom-auto left-0 md:left-auto w-full md:w-auto h-auto md:h-full bg-neutral-900 flex md:flex-shrink-0 z-50 border-t md:border-t-0 md:border-r border-purple-500"
      layout
      animate={{
        width: isDesktop ? getPanelWidth() : '100%',
      }}
      transition={{
        duration: ANIMATION_DURATION.normal,
        ease: ANIMATION_EASING.easeInOut,
        // No delay - reactivity is controlled by state
      }}
      initial={false} // Disable initial animation
    >
      {children}
    </motion.div>
  );
}
```

### Example 3: Updated NavigationContext

```tsx
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
  // New: Animation coordination
  chatAnimationComplete: boolean;
  onChatAnimationComplete: () => void;
}

const NavigationContext = createContext<NavigationContextType | undefined>(undefined);

export function NavigationProvider({ children }: { children: ReactNode }) {
  const [panelState, setPanelState] = useState<PanelState>('expanded');
  const [chatExpanded, setChatExpanded] = useState(false);
  const [chatInputFocused, setChatInputFocused] = useState(false);
  const [chatAnimationComplete, setChatAnimationComplete] = useState(false);

  const handleSetChatExpanded = (expanded: boolean) => {
    setChatExpanded(expanded);
    // Reset animation complete flag when opening
    if (expanded) {
      setChatAnimationComplete(false);
    }
  };

  const handleChatAnimationComplete = () => {
    // Only set to true when closing
    if (!chatExpanded) {
      setChatAnimationComplete(true);
    }
  };

  return (
    <NavigationContext.Provider
      value={{
        panelState,
        setPanelState,
        chatExpanded,
        setChatExpanded: handleSetChatExpanded,
        chatInputFocused,
        setChatInputFocused,
        chatAnimationComplete,
        onChatAnimationComplete: handleChatAnimationComplete,
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
```

### Example 4: Animation Constants File

```tsx
// src/lib/animation-constants.ts

/**
 * Centralized animation timing constants
 * Used throughout the application for consistent motion
 */

export const ANIMATION_DURATION = {
  /** 150ms - Quick interactions (hover, focus) */
  fast: 0.15,
  /** 300ms - Standard UI animations (default) */
  normal: 0.3,
  /** 500ms - Dramatic transitions */
  slow: 0.5,
} as const;

/**
 * Easing functions
 * Use cubic-bezier for consistency with Tailwind CSS
 */
export const ANIMATION_EASING = {
  /** Standard ease-in-out - most versatile */
  easeInOut: [0.4, 0, 0.2, 1] as const,
  /** Ease-out - elements entering view */
  easeOut: [0, 0, 0.2, 1] as const,
  /** Ease-in - elements exiting view */
  easeIn: [0.4, 0, 1, 1] as const,
} as const;

/**
 * Spring animation presets for Framer Motion
 * Use for more natural, physics-based motion
 */
export const SPRING_PRESETS = {
  /** Snappy, responsive feel */
  snappy: { type: 'spring' as const, stiffness: 400, damping: 30 },
  /** Smooth, balanced motion (default) */
  smooth: { type: 'spring' as const, stiffness: 300, damping: 30 },
  /** Gentle, soft motion */
  gentle: { type: 'spring' as const, stiffness: 200, damping: 25 },
} as const;

/**
 * Default transition for layout animations
 * Use this for most container/panel animations
 */
export const LAYOUT_TRANSITION = {
  duration: ANIMATION_DURATION.normal,
  ease: ANIMATION_EASING.easeInOut,
} as const;

/**
 * Default transition for presence animations (enter/exit)
 * Use this with AnimatePresence components
 */
export const PRESENCE_TRANSITION = {
  duration: ANIMATION_DURATION.fast,
  ease: ANIMATION_EASING.easeOut,
} as const;
```

---

## Future Guidelines

### When Adding New Animations

#### Step 1: Determine Animation Type

Ask yourself:
- **Layout change?** (size, position) → Use `motion.div` with `layout` prop
- **Presence change?** (mount/unmount) → Use `AnimatePresence`
- **Simple hover?** → Use Tailwind `transition-colors` or `transition-transform`
- **Complex interaction?** → Use Framer Motion variants

#### Step 2: Choose Animation Parameters

```tsx
// For layout animations (panels, containers):
import { LAYOUT_TRANSITION } from '@/lib/animation-constants';
<motion.div transition={LAYOUT_TRANSITION}>

// For presence animations (modals, tooltips):
import { PRESENCE_TRANSITION } from '@/lib/animation-constants';
<motion.div transition={PRESENCE_TRANSITION}>

// For spring animations (bouncy, natural feel):
import { SPRING_PRESETS } from '@/lib/animation-constants';
<motion.div transition={SPRING_PRESETS.smooth}>
```

#### Step 3: Protect Static Children

```tsx
<motion.div layout>
  {/* Wrap static content */}
  <div className="transition-none">
    <input /> {/* Will not animate */}
    <button /> {/* Will not animate */}
  </div>
</motion.div>
```

#### Step 4: Add Reduced Motion Support

```tsx
import { useReducedMotion } from 'framer-motion';

const shouldReduceMotion = useReducedMotion();

<motion.div
  animate={{ opacity: 1 }}
  transition={{
    duration: shouldReduceMotion ? 0 : 0.3,
  }}
>
```

#### Step 5: Test Animation Reliability

**Test Checklist:**
- [ ] Works on first load (no glitches)
- [ ] Works after 10 rapid open/close cycles
- [ ] Works on slow devices (throttle CPU in DevTools)
- [ ] Works with reduced motion enabled
- [ ] No visual "jumps" or "jitters"
- [ ] Input fields remain static
- [ ] Text content doesn't shift

### Component Animation Decision Tree

```
Is this a simple hover/focus effect?
├─ YES → Use Tailwind: transition-colors, transition-transform
└─ NO → Continue...

Does the component mount/unmount?
├─ YES → Use AnimatePresence + motion.div
└─ NO → Continue...

Does the component change size/position?
├─ YES → Use motion.div with layout prop
└─ NO → Continue...

Is this a complex multi-step animation?
├─ YES → Use Framer Motion variants + orchestration
└─ NO → Reconsider if animation is needed
```

### Common Animation Patterns

#### Pattern: Modal/Overlay
```tsx
<AnimatePresence>
  {isOpen && (
    <motion.div
      key="modal"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={PRESENCE_TRANSITION}
    >
      <ModalContent />
    </motion.div>
  )}
</AnimatePresence>
```

#### Pattern: Expanding Panel
```tsx
<motion.div
  layout
  animate={{
    height: isExpanded ? 'auto' : '60px',
  }}
  transition={LAYOUT_TRANSITION}
>
  <div className="transition-none">
    <Content />
  </div>
</motion.div>
```

#### Pattern: Staggered List
```tsx
const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
};

<motion.ul variants={container} initial="hidden" animate="show">
  {items.map((item) => (
    <motion.li key={item.id} variants={item}>
      {item.content}
    </motion.li>
  ))}
</motion.ul>
```

#### Pattern: Slide-In Notification
```tsx
<AnimatePresence mode="sync">
  {notifications.map((notification) => (
    <motion.div
      key={notification.id}
      initial={{ x: 300, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: 300, opacity: 0 }}
      transition={PRESENCE_TRANSITION}
    >
      {notification.message}
    </motion.div>
  ))}
</AnimatePresence>
```

### Code Review Checklist

When reviewing animation code, check for:

**Architecture:**
- [ ] Only one animation system used (Framer Motion OR CSS, not both)
- [ ] Animation boundaries clearly defined
- [ ] Static children explicitly protected with `transition-none`

**Performance:**
- [ ] Animating transform/opacity (not width/height when possible)
- [ ] Using `layout` prop for FLIP animations when changing size
- [ ] No `transition-all` on parent containers

**Reliability:**
- [ ] No setTimeout for animation sequencing
- [ ] Using onAnimationComplete for orchestration
- [ ] Initial states prevent page load glitches
- [ ] Animations tested through multiple cycles

**Accessibility:**
- [ ] Reduced motion support added
- [ ] Animations don't hide critical content
- [ ] Focus management during animations

**Maintainability:**
- [ ] Using animation constants, not magic numbers
- [ ] Clear variable names (expanded/collapsed, not open/close)
- [ ] Comments explain complex timing decisions

---

## Appendix: Technical Deep Dive

### Why Framer Motion Over CSS Transitions?

#### Advantages of Framer Motion

1. **FLIP Animations**
   - First, Last, Invert, Play technique
   - Animates transform instead of layout properties
   - 60fps even when changing height/width
   - Built-in with `layout` prop

2. **JavaScript Control**
   - Programmatic orchestration
   - Conditional animations based on state
   - Callbacks for sequencing
   - Dynamic values

3. **AnimatePresence**
   - Animate components on unmount
   - Wait for exit animations before entering
   - Critical for modals, tooltips, etc.

4. **Better Developer Experience**
   - TypeScript support
   - Clear API (no className string manipulation)
   - Easier debugging (React DevTools)
   - Variants for complex states

5. **Gesture Support**
   - Built-in hover, tap, drag
   - No need for separate event handlers
   - Automatic touch device handling

#### When CSS Transitions Are Better

1. **Simple hover effects**
   - `transition-colors` on buttons
   - Single property changes
   - No sequencing needed

2. **Performance-critical scenarios**
   - Thousands of elements
   - Simple color/opacity changes
   - CSS is slightly more performant

3. **Progressive enhancement**
   - Works without JavaScript
   - Graceful degradation

**Decision:** For this project, use Framer Motion for all layout/structural animations, CSS transitions only for simple hover states.

### Animation Performance Analysis

#### What Gets Animated Efficiently?

**GPU-Accelerated (Fast):**
- `transform: translate()`
- `transform: scale()`
- `transform: rotate()`
- `opacity`

**Triggers Paint (Medium):**
- `color`
- `background-color`
- `box-shadow`

**Triggers Layout (Slow):**
- `width`, `height`
- `padding`, `margin`
- `border-width`
- `top`, `left`, `right`, `bottom` (on non-absolute)

**Framer Motion's FLIP Solution:**
- Even "slow" properties become fast with `layout` prop
- Automatically converts to transform-based animation
- Best of both worlds: animate size, get transform performance

### Debugging Animation Issues

#### Common Issues and Solutions

**Issue: Animation feels "janky"**
- Check if animating layout properties without `layout` prop
- Verify no competing animation systems
- Use Chrome DevTools Performance tab
- Look for long frames (>16ms)

**Issue: Animation doesn't work on first render**
- Set `initial={false}` to disable initial animation
- Or set initial state explicitly
- Check if component mounts before state is set

**Issue: Child elements animate when they shouldn't**
- Add `transition-none` to child className
- Verify parent isn't using `transition-all`
- Check for inherited inline styles

**Issue: Animations get out of sync**
- Replace setTimeout with onAnimationComplete
- Use AnimatePresence mode="wait"
- Add animation state machine

**Issue: Accessibility - animations too fast/slow**
- Implement useReducedMotion hook
- Provide user preference controls
- Test with reduced motion enabled in OS

### Browser Compatibility

**Framer Motion Support:**
- Chrome/Edge: Full support
- Firefox: Full support
- Safari: Full support
- Mobile browsers: Full support

**Fallback Strategy:**
```tsx
// Detect if browser supports motion
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

<motion.div
  animate={{ opacity: 1 }}
  transition={{
    duration: prefersReducedMotion ? 0 : 0.3,
  }}
>
```

---

## Summary & Next Steps

### Key Takeaways

1. **Standardize on Framer Motion** for all layout/structural animations
2. **Protect static children** with explicit `transition-none`
3. **Use orchestration** via onAnimationComplete, not delays
4. **Create animation constants** for consistency
5. **Test thoroughly** through multiple animation cycles

### Immediate Action Items

**High Priority:**
1. Convert ChatSection to use Framer Motion (remove CSS transitions)
2. Add `transition-none` to chat input
3. Implement animation coordination in NavigationContext
4. Remove delay-based sequencing from NavigationPanel

**Medium Priority:**
5. Create animation constants file
6. Add reduced motion support
7. Test on slower devices
8. Document any discovered edge cases

**Low Priority:**
9. Audit other components for animation issues
10. Create animation component library
11. Add animation performance monitoring
12. Create interactive animation documentation

### Success Metrics

After implementing these changes, the system should achieve:

- **Zero input animations** - Input remains completely static
- **Smooth open/close** - No glitches on first render
- **100% reliability** - Works after 50+ open/close cycles
- **Consistent timing** - Same animation feel throughout app
- **Easy to extend** - New animations follow same patterns

---

**Document Version:** 1.0
**Last Updated:** 2025-10-29
**Next Review:** After implementation of Phase 1-2
