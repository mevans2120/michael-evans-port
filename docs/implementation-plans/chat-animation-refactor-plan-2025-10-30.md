# Chat Animation System Refactor - Implementation Plan

**Date**: October 30, 2025
**Issue**: Input box jumping during chat expand/collapse animation
**Root Cause**: Multiple conflicting animation systems (see audit: `docs/audits/chat-animation-system-audit-2025-10-30.md`)

---

## Overview

This plan outlines a phased approach to refactor the chat animation system, with testing at each step to ensure we don't introduce regressions.

### Goals
1. Eliminate input box jumping during animations
2. Remove conflicting animation systems
3. Standardize timing and easing across all animations
4. Improve performance with GPU-accelerated transforms
5. Maintain all existing functionality

### Files to Modify
- `/src/components/navigation/ChatSection.tsx` (Primary changes)
- `/src/components/navigation/NavigationPanel.tsx` (Minor coordination fixes)
- `/src/contexts/NavigationContext.tsx` (Potential state cleanup)

---

## Phase 1: Remove Conflicting Animation Systems

### Step 1.1: Remove Framer Motion `layout` Prop
**File**: `ChatSection.tsx`
**Line**: 114

**Change**:
```tsx
// BEFORE
<motion.div
  className="chat-section flex flex-col border-t..."
  layout  // ← REMOVE THIS LINE
  animate={{
    height: isDesktop ? (chatExpanded ? '100%' : '34%') : (chatExpanded ? '50vh' : 'auto'),
  }}
>
```

```tsx
// AFTER
<motion.div
  className="chat-section flex flex-col border-t..."
  animate={{
    height: isDesktop ? (chatExpanded ? '100%' : '34%') : (chatExpanded ? '50vh' : 'auto'),
  }}
>
```

**Reason**: The `layout` prop creates automatic animations for ALL layout changes, which conflicts with our explicit `animate` height property. This is the primary cause of the jumping.

**Testing Checklist**:
- [ ] Page loads without errors
- [ ] Chat expands when clicked
- [ ] Chat collapses when close button clicked
- [ ] Input box behavior (may still have issues - that's expected)
- [ ] No console errors
- [ ] Animation completes fully (doesn't hang mid-animation)

**Expected Result**: Animation should be slightly better but input may still move. This is just removing one conflict.

---

### Step 1.2: Remove CSS Transitions from Messages Container
**File**: `ChatSection.tsx`
**Lines**: 147-152

**Change**:
```tsx
// BEFORE
<div
  className={`flex-1 overflow-y-auto px-4 py-4 bg-neutral-900 transition-all duration-300 ease-in-out hide-scrollbar ${
    !showChatContent && !chatExpanded ? 'hidden' : ''
  } ${
    chatExpanded ? 'opacity-100 translate-y-0' : 'opacity-100 translate-y-0'
  }`}
>
```

```tsx
// AFTER
<div
  className={`flex-1 overflow-y-auto px-4 py-4 bg-neutral-900 hide-scrollbar ${
    !showChatContent && !chatExpanded ? 'hidden' : ''
  }`}
>
```

**Reason**: CSS `transition-all` conflicts with Framer Motion's JavaScript-based animations. The translate-y classes are redundant (both states are the same).

**Testing Checklist**:
- [ ] Messages scroll properly
- [ ] Messages appear when chat expands
- [ ] Messages fade appropriately
- [ ] No visual glitches in message area
- [ ] Smooth scrolling still works

**Expected Result**: No change in behavior, but removes potential conflicts.

---

### Step 1.3: Remove CSS Transition from Input Form
**File**: `ChatSection.tsx`
**Line**: 319

**Change**:
```tsx
// BEFORE
className={`px-4 py-3 border-t border-neutral-800 flex gap-2 flex-shrink-0 transition-none ${
```

**Reason**: The `transition-none` is already trying to disable transitions, but we should ensure there are no inherited transitions either.

**Testing Checklist**:
- [ ] Input box renders correctly
- [ ] Can type in input
- [ ] Submit button works
- [ ] Input stays at bottom of chat
- [ ] Focus states work

**Expected Result**: No change in behavior.

---

## Phase 2: Standardize Animation Configuration

### Step 2.1: Create Shared Animation Constants
**File**: Create new file `/src/lib/animation-constants.ts`

```typescript
/**
 * Shared animation configuration for consistent timing and easing
 * across the navigation and chat system.
 */

export const ANIMATION_DURATION = {
  fast: 0.2,      // 200ms - Quick transitions (message fade-in, button hover)
  normal: 0.3,    // 300ms - Standard transitions (chat expand/collapse, panel width)
  slow: 0.4,      // 400ms - Slow transitions (major layout changes)
} as const;

export const ANIMATION_EASING = {
  standard: [0.4, 0, 0.2, 1],     // Material Design standard easing
  emphasized: [0.4, 0, 0.1, 1],   // More pronounced deceleration
  decelerate: [0, 0, 0.2, 1],     // Starts fast, slows down
} as const;

export const CHAT_ANIMATION = {
  duration: ANIMATION_DURATION.normal,
  ease: ANIMATION_EASING.standard,
} as const;

export const PANEL_ANIMATION = {
  duration: ANIMATION_DURATION.normal,
  ease: ANIMATION_EASING.standard,
} as const;

export const MESSAGE_ANIMATION = {
  duration: ANIMATION_DURATION.fast,
  ease: ANIMATION_EASING.standard,
} as const;
```

**Testing Checklist**:
- [ ] File compiles without errors
- [ ] Can import constants in other files
- [ ] TypeScript types are correct

**Expected Result**: New file created, no behavioral changes yet.

---

### Step 2.2: Apply Shared Constants to ChatSection
**File**: `ChatSection.tsx`

**Changes**:
1. Import at top of file:
```tsx
import { CHAT_ANIMATION, MESSAGE_ANIMATION } from '@/lib/animation-constants';
```

2. Update main chat container transition (lines 120-122):
```tsx
// BEFORE
transition={{
  duration: 0.3,
  ease: [0.4, 0, 0.2, 1],
}}

// AFTER
transition={{
  duration: CHAT_ANIMATION.duration,
  ease: CHAT_ANIMATION.ease,
}}
```

3. Update message fade-in transitions (around line 183):
```tsx
// BEFORE
transition={{ duration: 0.2 }}

// AFTER
transition={{
  duration: MESSAGE_ANIMATION.duration,
  ease: MESSAGE_ANIMATION.ease,
}}
```

4. Update all other motion.div transitions similarly

**Testing Checklist**:
- [ ] All animations still work
- [ ] Timing feels consistent across all animations
- [ ] No console errors
- [ ] Messages fade in smoothly
- [ ] Chat expand/collapse is smooth

**Expected Result**: Same animation behavior but with consistent timing values.

---

### Step 2.3: Apply Shared Constants to NavigationPanel
**File**: `NavigationPanel.tsx`

**Changes**:
1. Import at top:
```tsx
import { PANEL_ANIMATION } from '@/lib/animation-constants';
```

2. Update panel width transition (lines 74-76):
```tsx
// BEFORE
transition={{
  duration: 0.3,
  ease: [0.4, 0, 0.2, 1],
}}

// AFTER
transition={{
  duration: PANEL_ANIMATION.duration,
  ease: PANEL_ANIMATION.ease,
}}
```

**Testing Checklist**:
- [ ] Panel expands/collapses smoothly
- [ ] Purple border animations work
- [ ] Chevron appears on hover
- [ ] Click to expand/collapse works
- [ ] No visual glitches

**Expected Result**: Same behavior with standardized timing.

---

## Phase 3: Fix Layout Shift Issues

### Step 3.1: Prevent Flexbox Recalculation During Animation
**File**: `ChatSection.tsx`

**Approach**: Keep the flex layout but use fixed heights to prevent recalculation.

**Changes**:

1. Add state to track chat heights:
```tsx
const CHAT_HEADER_HEIGHT = 68; // px
const CHAT_INPUT_HEIGHT = 60;  // px
```

2. Update root container to use calculated heights:
```tsx
// BEFORE
animate={{
  height: isDesktop
    ? (chatExpanded ? '100%' : '34%')
    : (chatExpanded ? '50vh' : 'auto'),
}}

// AFTER
animate={{
  height: isDesktop
    ? (chatExpanded ? '100%' : '34%')
    : (chatExpanded ? '50vh' : 'auto'),
}}
```

3. Ensure header has fixed height:
```tsx
<div
  className="px-8 py-6 border-b border-neutral-800 flex items-center justify-between flex-shrink-0"
  style={{ height: `${CHAT_HEADER_HEIGHT}px`, minHeight: `${CHAT_HEADER_HEIGHT}px` }}
>
```

4. Ensure input has fixed height:
```tsx
<form
  className="px-4 py-3 border-t border-neutral-800 flex gap-2 flex-shrink-0"
  style={{ height: `${CHAT_INPUT_HEIGHT}px`, minHeight: `${CHAT_INPUT_HEIGHT}px` }}
>
```

**Testing Checklist**:
- [ ] Header stays fixed at 68px
- [ ] Input stays fixed at 60px
- [ ] Input doesn't move during animation ← **KEY TEST**
- [ ] Chat expands smoothly
- [ ] Chat collapses smoothly
- [ ] No content overflow or clipping
- [ ] Scrolling works in messages area

**Expected Result**: Input box should now stay perfectly still during animation.

---

## Phase 4: Coordinate Parent/Child Animations

### Step 4.1: Sequence Panel Width and Chat Height
**File**: `NavigationPanel.tsx` and `ChatSection.tsx`

**Issue**: When chat expands, both the panel width (320px→455px) and chat height animate simultaneously, causing visual conflicts.

**Solution**: Use Framer Motion's orchestration to sequence animations.

**Changes to NavigationPanel.tsx**:
```tsx
<motion.div
  animate={{
    width: isDesktop ? getPanelWidth() : '100%',
  }}
  transition={{
    duration: PANEL_ANIMATION.duration,
    ease: PANEL_ANIMATION.ease,
    when: "beforeChildren", // ← Width completes before children animate
  }}
>
```

**Changes to ChatSection.tsx**:
```tsx
<motion.div
  animate={{
    height: isDesktop
      ? (chatExpanded ? '100%' : '34%')
      : (chatExpanded ? '50vh' : 'auto'),
  }}
  transition={{
    duration: CHAT_ANIMATION.duration,
    ease: CHAT_ANIMATION.ease,
    delay: 0.05, // ← Slight delay to let parent start first
  }}
>
```

**Testing Checklist**:
- [ ] Panel width changes first
- [ ] Chat height follows smoothly
- [ ] No visual "popping" or jumping
- [ ] Reverse animation (collapse) is equally smooth
- [ ] Input stays stable throughout
- [ ] No lag or stuttering

**Expected Result**: Smooth, coordinated animation sequence.

---

## Phase 5: Performance Optimization (Optional)

### Step 5.1: Use Transform-Based Animation (Advanced)
**Note**: Only implement if Phases 1-4 don't fully resolve the issue.

**File**: `ChatSection.tsx`

**Approach**: Instead of animating `height` (which triggers layout), use `scaleY` transform (GPU-accelerated).

**Changes**:
```tsx
<motion.div
  className="chat-section flex flex-col origin-bottom"
  animate={{
    scaleY: chatExpanded ? 1 : 0.34,
    height: isDesktop ? '100%' : (chatExpanded ? '50vh' : 'auto'),
  }}
  transition={{
    duration: CHAT_ANIMATION.duration,
    ease: CHAT_ANIMATION.ease,
  }}
  style={{ willChange: 'transform' }}
>
```

**Testing Checklist**:
- [ ] Animation is buttery smooth
- [ ] No layout shifts
- [ ] Content scales appropriately
- [ ] Text remains readable during animation
- [ ] No visual artifacts
- [ ] Works on mobile and desktop

**Expected Result**: Highest performance animation, but may require additional adjustments for content scaling.

---

## Phase 6: Cleanup and Testing

### Step 6.1: Remove Unused Animation Code
**Files**: All navigation components

**Tasks**:
1. Search for unused animation states
2. Remove redundant transition classes
3. Clean up animation callbacks that are no longer needed
4. Remove commented-out animation code

**Testing Checklist**:
- [ ] No console warnings or errors
- [ ] TypeScript compiles cleanly
- [ ] ESLint passes
- [ ] No unused imports

---

### Step 6.2: Comprehensive Integration Testing

**Desktop Testing**:
- [ ] Click to expand chat from collapsed state
- [ ] Click to collapse chat from expanded state
- [ ] Type in input and send message
- [ ] Scroll through messages
- [ ] Click suggested prompts
- [ ] Expand/collapse panel from sidebar
- [ ] Test with chat open while panel collapses
- [ ] Test with chat closed while panel collapses
- [ ] Refresh page with chat open
- [ ] Navigate between pages

**Mobile Testing**:
- [ ] Chat appears at bottom of screen
- [ ] Tap to expand chat
- [ ] Tap to collapse chat
- [ ] Type in input on mobile keyboard
- [ ] Scroll messages with touch
- [ ] Tap suggested prompts
- [ ] Chat overlays content properly
- [ ] Chat closes when tapping outside (if implemented)

**Edge Cases**:
- [ ] Rapid expand/collapse clicks
- [ ] Expand chat while panel is animating
- [ ] Submit message during animation
- [ ] Browser window resize during animation
- [ ] Very long messages
- [ ] Many messages (20+)
- [ ] Empty chat state

**Performance Testing**:
- [ ] No jank or stuttering
- [ ] 60fps animation (check DevTools Performance tab)
- [ ] No layout thrashing (check DevTools Performance tab)
- [ ] Memory usage is stable (no leaks)

---

## Step 6.3: Cross-Browser Testing

**Browsers to Test**:
- [ ] Chrome/Edge (Chromium)
- [ ] Firefox
- [ ] Safari (macOS)
- [ ] Safari (iOS)
- [ ] Chrome (Android)

**Common Issues to Watch For**:
- Safari: Transform origin issues
- Firefox: Different easing interpolation
- Mobile browsers: Touch event conflicts

---

## Rollback Plan

If any phase introduces issues:

1. **Immediate Rollback**:
   ```bash
   git restore src/components/navigation/ChatSection.tsx
   git restore src/components/navigation/NavigationPanel.tsx
   ```

2. **Partial Rollback**:
   - Revert only the problematic phase
   - Keep earlier successful changes
   - Document which phase failed and why

3. **Alternative Approach**:
   - If transform-based approach fails, stick with height animation
   - If sequencing doesn't work, try simultaneous with careful timing
   - If GPU acceleration causes issues, fall back to standard animation

---

## Success Criteria

**Must Have**:
- ✅ Input box stays perfectly still during animation
- ✅ Chat expands/collapses smoothly
- ✅ No console errors
- ✅ Works on desktop and mobile
- ✅ All existing functionality preserved

**Nice to Have**:
- ✅ 60fps animation performance
- ✅ Coordinated parent/child animations
- ✅ Consistent timing across all animations
- ✅ Clean, maintainable code

---

## Timeline Estimate

- **Phase 1**: 15 minutes (Remove conflicts)
- **Phase 2**: 20 minutes (Standardize config)
- **Phase 3**: 30 minutes (Fix layout shifts)
- **Phase 4**: 20 minutes (Coordinate animations)
- **Phase 5**: 30 minutes (Performance optimization) - Optional
- **Phase 6**: 45 minutes (Testing and cleanup)

**Total**: 2-2.5 hours with testing

---

## Notes

- Test after EACH step, not just at the end
- If a step breaks functionality, stop and rollback before proceeding
- Document any unexpected issues or discoveries
- Take screenshots/videos of successful animations for comparison

---

## Related Documentation

- Audit Report: `docs/audits/chat-animation-system-audit-2025-10-30.md`
- Framer Motion Docs: https://www.framer.com/motion/
- Animation Performance: https://web.dev/animations/
