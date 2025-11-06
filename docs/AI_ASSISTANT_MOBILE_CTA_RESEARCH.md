# AI Assistant Mobile CTA Research

## Executive Summary

This document analyzes the AI assistant architecture in the michael-evans-port-main project and provides recommendations for enabling mobile navigation from chat CTAs (content suggestions). Currently, when users click LinkPreview cards in the mobile chat, the chat remains expanded and covers the newly navigated page content.

**Recommended Solution:** Auto-minimize chat on mobile navigation (1-2 hour implementation)

---

## 1. AI Assistant Chat Architecture

### Core Implementation

**Primary Component:** `/src/components/navigation/ChatSection.tsx`
- Uses Vercel AI SDK's `useChat` hook (`@ai-sdk/react`)
- Backend API: `/src/app/api/chat/route.ts`
- Streaming responses with real-time message display
- ReactMarkdown for message formatting with custom components

**Key Features:**
- Welcome message: "Hi. Ask me anything about Michael's work and background"
- Follow-up question parsing and rendering
- Link preview support via `LinkPreview` component
- Loading states with elegant three-dot animation
- Error handling with user-friendly messages

**State Management:**
`NavigationContext` (`/src/contexts/NavigationContext.tsx`) manages:
- `chatExpanded`: Boolean for expanded/collapsed state
- `chatInputFocused`: Boolean for input focus state
- `mobileChatSource`: Tracks if chat opened from footer or hamburger
- `mobileMenuOpen`: Hamburger menu state
- `chatCloseAnimationComplete`: Animation orchestration flag

**Message Flow:**
1. User clicks suggested prompt or types input
2. `sendMessage()` from `useChat` hook sends to `/api/chat`
3. Response streams back in chunks
4. Follow-up questions parsed from markdown
5. Links detected and rendered as `LinkPreview` cards

---

## 2. Content CTAs (Suggestions) - Current Implementation

### SuggestedPrompts Component

**Location:** `/src/components/navigation/SuggestedPrompts.tsx`

**Current Behavior:**
- Shows 2 randomized prompts from a pool (configurable via CMS)
- Displayed below welcome message when chat is expanded
- Only shows when no conversation history exists
- Hidden during loading/waiting states

**CMS Integration:**
- Prompts stored in Sanity CMS via `chatPrompts` schema
- Fetched dynamically via `chatPromptsQuery`
- Fallback to hardcoded prompts if CMS unavailable
- Number of prompts configurable (default: 2)

**Example Prompts:**
```typescript
[
  "Tell me about the first responsive airline website",
  "What's the story behind launching a restaurant with cliff diving?",
  "Show me production AI applications you've built",
  "How did you help thousands of people focus?"
]
```

**Click Handler (Desktop):**
```typescript
const handlePromptClick = (prompt: string) => {
  if (isLoading || isWaitingForResponse) return;

  if (!isDesktop) {
    setChatExpanded(true);  // Expand chat on mobile
  }
  setChatInputFocused(true);
  setIsWaitingForResponse(true);
  sendMessage({ text: prompt });
};
```

### Follow-Up Questions (In-Chat CTAs)

**Parser:** Lines 186-204 in `ChatSection.tsx`
- Extracts questions from assistant responses
- Pattern: `**Follow-up questions:**\n- Question 1\n- Question 2`
- Supports both plain text and markdown links

**Rendering Logic:**
```typescript
// If question contains markdown link to case study/AI showcase
if (hasLink && (linkUrl.includes('/case-studies/') || linkUrl.includes('/ai-showcase/'))) {
  return <LinkPreview href={linkUrl}>{linkText}</LinkPreview>;
}

// Otherwise, render as clickable button
return (
  <button onClick={() => handlePromptClick(question)}>
    {question}
  </button>
);
```

---

## 3. Desktop Navigation from CTAs - How It Works

### LinkPreview Component

**Location:** `/src/components/chatbot/LinkPreview.tsx`

**Current Desktop Behavior:**
1. **Link Detection:** Parses internal URLs (`/case-studies/...` or `/ai-showcase/...`)
2. **Metadata Fetch:** Calls `/api/link-metadata` to get title, category, description, image
3. **Card Rendering:** Shows rich preview card with hover effects
4. **Click Handling:**
   ```typescript
   const handleClick = () => {
     if (isInternalLink) {
       window.dispatchEvent(new CustomEvent('navigation-start'));
     }
   };
   ```
5. **Navigation:** Next.js `<Link>` handles actual routing
6. **Loading State:** `NavigationProgress` component shows three-dot overlay

**NavigationProgress Component**

**Location:** `/src/components/navigation/NavigationProgress.tsx`

**Functionality:**
- Listens for `navigation-start` custom event
- Shows loading overlay with three animated dots
- Dynamically positions based on navigation panel width
- Auto-hides when `pathname` changes (via `usePathname()`)
- Safety timeout: 2.5 seconds maximum

**Desktop Flow:**
```
User clicks LinkPreview
  → handleClick() fires navigation-start event
  → NavigationProgress shows loading dots
  → Next.js Link navigates to new page
  → pathname changes
  → NavigationProgress auto-hides
```

**Desktop Result:** Chat remains open, content area updates, smooth transition

---

## 4. Mobile Navigation System Architecture

### Mobile Layout Structure

**From `/src/app/(public)/layout.tsx`:**
```tsx
<NavigationProvider>
  <NavigationProgress />
  <MobileNav />  {/* Top header + hamburger menu */}

  <div className="flex h-screen">
    <NavigationPanel>
      <NavigationMenu />  {/* Desktop only */}
      <ConditionalChatSection />  {/* Desktop only */}
    </NavigationPanel>

    <main className="pb-16 md:pb-0">
      {children}
    </main>
  </div>

  <MobileChatFooter />  {/* Always rendered, mobile only */}
</NavigationProvider>
```

### Mobile Components Breakdown

#### 1. MobileHeader.tsx
- Fixed top bar (`z-[60]`)
- Logo: "MEvans" with gradient
- Hamburger menu icon
- Hidden when chat is expanded

#### 2. HamburgerMenu.tsx
- Full-screen overlay (`z-65`)
- Backdrop with blur effect
- Navigation links (Home, About, Case Studies, AI Showcase)
- Close button (X icon)
- Closes when backdrop clicked or link selected

#### 3. MobileChatFooter.tsx
- Fixed bottom bar (`z-[100]`) when collapsed
- Shows: Sparkles icon + "AI Assistant" + chevron up
- When expanded: Renders full `ChatSection` component with `isMobileVersion={true}`

#### 4. ChatSection (Mobile Mode)
**When `isMobileVersion={true}`:**
- Full-screen overlay (`fixed inset-0 z-[70]`)
- Grid layout: `[auto_1fr_auto]` (header, messages, input)
- Simple header with "MEvans AI Assistant" + close button
- No chevron toggle (uses X button instead)

### Mobile Navigation Flow

**Chat Collapsed:**
```
MobileHeader (top)
  - Logo
  - Hamburger icon

Main Content Area
  - Full viewport height
  - 16px bottom padding

MobileChatFooter (bottom)
  - 64px height
  - "AI Assistant" + sparkles
```

**Chat Expanded:**
```
ChatSection (full screen overlay)
  - Header: "MEvans AI Assistant" + X button
  - Messages area
  - Input field
  - z-[70] - covers everything

(MobileHeader hidden)
(MobileChatFooter hidden - renders ChatSection instead)
```

---

## 5. NavigationContext - Chat State Management

**Location:** `/src/contexts/NavigationContext.tsx`

**State Variables:**
```typescript
interface NavigationContextType {
  // Navigation panel (desktop)
  panelState: 'collapsed' | 'partial' | 'expanded';
  setPanelState: (state: PanelState) => void;

  // Chat expansion (all devices)
  chatExpanded: boolean;
  setChatExpanded: (expanded: boolean) => void;

  // Chat input focus (widens panel on desktop)
  chatInputFocused: boolean;
  setChatInputFocused: (focused: boolean) => void;

  // Mobile menu
  mobileMenuOpen: boolean;
  setMobileMenuOpen: (open: boolean) => void;

  // Mobile chat source tracking
  mobileChatSource: 'footer' | 'hamburger' | null;
  setMobileChatSource: (source: 'footer' | 'hamburger' | null) => void;

  // Animation orchestration
  chatCloseAnimationComplete: boolean;
  signalChatCloseComplete: () => void;
  resetChatAnimationFlag: () => void;
}
```

**Z-Index Hierarchy:**
```
z-[100] - MobileChatFooter (collapsed)
z-[70]  - ChatSection (mobile expanded)
z-65    - HamburgerMenu
z-[60]  - MobileHeader
z-50    - NavigationPanel (desktop), NavigationProgress
z-40    - Backdrops
```

---

## 6. Mobile-Specific Behaviors

### Current Mobile Behaviors

1. **Chat Expansion:**
   - Footer click → `setChatExpanded(true)` + `setMobileChatSource('footer')`
   - Renders full-screen `ChatSection` with `isMobileVersion={true}`
   - Hides MobileHeader during expansion

2. **Suggested Prompts:**
   - Click → Expands chat THEN sends message
   - No navigation behavior (just starts conversation)

3. **Follow-Up Question Buttons:**
   - Click → Sends message to chat
   - No navigation behavior
   - Chat remains in same state

4. **LinkPreview in Chat:**
   - **CURRENTLY:** Triggers navigation but chat stays expanded
   - **PROBLEM:** User can't see new page content because chat covers screen

### Mobile vs Desktop Key Differences

| Feature | Desktop | Mobile |
|---------|---------|--------|
| Chat Location | Left panel (320-455px) | Full-screen overlay |
| Chat Component | `ConditionalChatSection` in panel | `MobileChatFooter` → `ChatSection` |
| Navigation Visibility | Content area always visible | Hidden when chat expanded |
| LinkPreview Click | Navigate, chat stays open | Navigate, but chat covers content |
| Suggested Prompts Click | Send message | Expand chat + send message |
| Chat Close Method | Chevron down button | X button in header |

---

## 7. The Problem: Mobile CTA Navigation

### Current Issue

When a user clicks a LinkPreview card (CTA) in the mobile chat:
1. Navigation occurs (new page loads)
2. Chat remains expanded (`chatExpanded=true`)
3. New page content is hidden behind full-screen chat
4. User has no idea navigation happened
5. Must manually close chat to see content

**Desktop (Working):**
- Chat is sidebar (320-455px)
- Content area (rest of screen) updates
- User sees new content immediately
- Chat stays open for continued conversation

**Mobile (Broken):**
- Chat is full-screen overlay
- Content area invisible under chat
- User doesn't see new page
- Poor UX - confusing and frustrating

---

## 8. Solution Options

### Option A: Auto-Minimize on Navigation (RECOMMENDED)

**Behavior:**
1. User clicks LinkPreview in mobile chat
2. Trigger navigation (keep existing behavior)
3. **NEW:** Minimize chat → `setChatExpanded(false)`
4. Show new page content
5. Chat footer remains accessible at bottom

**Implementation:**

**File 1:** `/src/components/chatbot/LinkPreview.tsx`
```typescript
// Add mobile detection and chat control
import { useNavigation } from '@/contexts/NavigationContext';
import { useIsDesktop } from '@/hooks/useMediaQuery';

const { chatExpanded, setChatExpanded } = useNavigation();
const isDesktop = useIsDesktop();

const handleClick = () => {
  if (isInternalLink) {
    window.dispatchEvent(new CustomEvent('navigation-start'));

    // NEW: Auto-minimize chat on mobile
    if (!isDesktop && chatExpanded) {
      setChatExpanded(false);
    }
  }
};
```

**File 2:** `/src/components/navigation/ChatSection.tsx`
```typescript
// Update handlePromptClick for follow-up question links
const handlePromptClick = (prompt: string) => {
  if (isLoading || isWaitingForResponse) return;

  // Check if prompt is a navigation link
  const isNavigationPrompt = prompt.startsWith('/');

  if (isNavigationPrompt) {
    // Navigate and minimize on mobile
    if (!isDesktop) {
      setChatExpanded(false);
    }
    // Trigger navigation via router.push()
  } else {
    // Regular message - expand chat on mobile if needed
    if (!isDesktop) {
      setChatExpanded(true);
    }
    setChatInputFocused(true);
    setIsWaitingForResponse(true);
    sendMessage({ text: prompt });
  }
};
```

**Pros:**
- Simple implementation (2 files, ~15 lines of code)
- Familiar mobile pattern (navigation closes overlays)
- Works for both LinkPreview and follow-up buttons
- No visual disruption
- Chat easily accessible via footer

**Cons:**
- Breaks conversation continuity
- User must re-expand chat to continue
- May feel abrupt without animation

**Time Estimate:** 1-2 hours

### Option B: Slide-In Transition (Premium UX)

**Behavior:**
1. User clicks LinkPreview
2. Chat slides down to minimized state
3. New page content slides in from right
4. Smooth 300ms transition
5. Toast notification: "Navigated to [Page Name]"

**Implementation Complexity:**
- Requires animation orchestration
- Custom route transition hook
- Toast notification system
- More code (~50 lines across 3 files)

**Pros:**
- Premium feel
- Visual feedback
- Smooth transition
- Professional UX

**Cons:**
- More complex
- Animation could have performance issues
- Harder to debug
- May feel over-engineered

**Time Estimate:** 2-3 hours

### Option C: Picture-in-Picture Chat (Advanced)

**Behavior:**
1. Click LinkPreview
2. Chat shrinks to small floating window
3. New page content shows in background
4. User can dismiss or re-expand chat

**Implementation Complexity:**
- High (requires complete refactor)
- New floating component
- Positioning logic
- State management changes

**Pros:**
- Chat always accessible
- Content always visible
- Modern UX pattern

**Cons:**
- Complex implementation
- May obscure important content
- Small chat window hard to use
- Accessibility concerns

**Time Estimate:** 6-8 hours

---

## 9. Recommended Implementation Plan

### Phase 1: Basic Auto-Minimize (1-2 hours)

**Files to Modify:**
1. `/src/components/chatbot/LinkPreview.tsx`
2. `/src/components/navigation/ChatSection.tsx`

**Changes:**
1. Add `useNavigation()` and `useIsDesktop()` hooks to LinkPreview
2. Update `handleClick()` to check device and minimize chat on mobile
3. Update `handlePromptClick()` in ChatSection to detect navigation prompts
4. Test on mobile devices (iPhone SE, Plus, iPad)

**Testing Checklist:**
- [ ] LinkPreview click on mobile minimizes chat
- [ ] New page content visible after navigation
- [ ] Chat footer still accessible
- [ ] Desktop behavior unchanged
- [ ] Follow-up question buttons work
- [ ] Navigation loading indicator shows
- [ ] Chat history preserved (can re-expand)

### Phase 2: Enhanced UX (Optional, 2-3 hours)

**Enhancements:**
1. Add slide-down animation to chat minimize
2. Add toast notification on mobile navigation
3. Add subtle haptic feedback (mobile web API)
4. Consider keeping chat partially visible (peek behavior)

**Files:**
1. Create `/src/components/ui/toast.tsx` (if not exists)
2. Add animation classes to `globals.css`
3. Update LinkPreview with animation trigger

---

## 10. Specific Files Requiring Modification

### Critical Files

1. **`/src/components/chatbot/LinkPreview.tsx`**
   - Current: 284 lines
   - Function: `handleClick()` (around line 218)
   - Add: Mobile detection + chat minimize logic
   - Impact: Low risk, isolated change

2. **`/src/components/navigation/ChatSection.tsx`**
   - Current: 522 lines
   - Function: `handlePromptClick()` (around line 139)
   - Add: Navigation detection + mobile minimize
   - Impact: Medium risk, core chat logic

### Supporting Files (Reference Only)

3. **`/src/contexts/NavigationContext.tsx`**
   - Current: 94 lines
   - No changes needed (already has `setChatExpanded`)

4. **`/src/components/navigation/MobileChatFooter.tsx`**
   - Current: 41 lines
   - No changes needed (listens to `chatExpanded` state)

5. **`/src/hooks/useMediaQuery.ts`**
   - Import: `useIsDesktop()` hook
   - No changes needed

---

## 11. Testing Strategy

### Manual Testing

**Mobile Devices:**
- iPhone SE (375px width)
- iPhone 12/13 Pro (390px)
- iPhone 14 Pro Max (430px)
- iPad (768px - breakpoint edge case)

**Test Scenarios:**
1. Click suggested prompt → Verify chat expands
2. Click case study LinkPreview → Verify chat minimizes + navigation
3. Click AI showcase LinkPreview → Verify chat minimizes + navigation
4. Click follow-up question (plain text) → Verify sends message
5. Click follow-up question (link) → Verify minimizes + navigation
6. Navigate via hamburger menu → Verify chat stays collapsed
7. Navigate via browser back button → Verify chat state correct
8. Switch portrait ↔ landscape → Verify responsive behavior

### Automated Testing

**E2E Tests (Playwright):**
```typescript
test('mobile chat minimizes on LinkPreview click', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 667 }); // iPhone SE

  // Expand chat
  await page.click('[data-testid="mobile-chat-footer"]');
  await expect(page.locator('[data-testid="chat-section"]')).toBeVisible();

  // Click LinkPreview
  await page.click('a[href="/case-studies/alaska-airlines"]');

  // Verify chat minimized
  await expect(page.locator('[data-testid="chat-section"]')).not.toBeVisible();

  // Verify navigation occurred
  await expect(page).toHaveURL('/case-studies/alaska-airlines');
});
```

---

## 12. Risk Assessment

### Low Risk Changes
- Adding `useIsDesktop()` hook to LinkPreview
- Adding conditional logic to `handleClick()`
- Testing on mobile devices

### Medium Risk Changes
- Modifying `handlePromptClick()` behavior
- Adding navigation detection logic
- Potential state management edge cases

### High Risk Changes
- Changing animation orchestration
- Modifying NavigationContext
- Adding new global state

### Mitigation Strategies
1. Feature flag for mobile minimize behavior
2. Extensive E2E testing before deployment
3. Staged rollout (beta users first)
4. Analytics tracking for click behavior
5. Rollback plan if issues arise

---

## 13. Alternative Approaches Considered

### 1. Keep Chat Open, Scroll Content
- **Idea:** Navigate but scroll main content area under chat
- **Rejected:** Chat is fixed overlay, no scroll possible

### 2. Two-Column Mobile View
- **Idea:** Split screen 50/50 (chat + content)
- **Rejected:** Too cramped on mobile, poor UX

### 3. Tab System
- **Idea:** Chat and content as switchable tabs
- **Rejected:** Adds complexity, breaks mental model

### 4. Swipe Gestures
- **Idea:** Swipe left to close chat, right to open
- **Rejected:** Not discoverable, accessibility issues

---

## Summary

The current AI assistant implementation is well-architected with clear separation between desktop and mobile behaviors. The core issue is that mobile CTAs (LinkPreview cards) trigger navigation without minimizing the full-screen chat overlay, leaving users unable to see the new page content.

**The recommended solution is Option A: Auto-Minimize on Navigation**, which requires minimal code changes (2 files, ~15 lines) and follows familiar mobile UX patterns. This can be implemented in 1-2 hours with thorough testing.

### Key Implementation Points:
1. Detect mobile device in LinkPreview `handleClick()`
2. Call `setChatExpanded(false)` before navigation
3. Existing state management handles the rest
4. No changes to NavigationContext needed
5. Desktop behavior remains unchanged

This approach provides immediate UX improvement with low risk and high maintainability.

---

**Document Created:** 2025-11-05
**Author:** AI Research Agent
**Project:** michael-evans-port-main
