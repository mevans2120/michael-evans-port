# Navigation Default State Feature Research

**Date:** November 23, 2025
**Feature Request:** On desktop, when a user lands on the site, the navigation should open in a closed (partial) state if on any page **other than** the homepage.

---

## Current Behavior

**Desktop Navigation State:**
- Default: `panelState = 'expanded'` (320px sidebar width)
- User can manually toggle to `'partial'` (81px icon-only mode) via chevron button
- State persists across navigation (remains expanded/partial as user set it)
- No route-based automatic state changes

**State Management:**
- Managed by `NavigationContext` at `/src/contexts/NavigationContext.tsx`
- Provider wraps entire public layout at `/src/app/(public)/layout.tsx`
- Uses React Context API with `useState`

---

## Feature Requirements Analysis

### What needs to happen:
1. **On initial page load** (not on subsequent client-side navigation)
2. **Desktop only** (min-width: 1024px)
3. **If pathname !== '/'** → Set `panelState = 'partial'`
4. **If pathname === '/'** → Set `panelState = 'expanded'` (current behavior)
5. User can still manually expand/collapse after initial load

### Key Technical Considerations:
- Must detect **initial page load** vs **client-side navigation**
- Must detect **current route** on mount
- Must detect **desktop vs mobile** viewport
- Should not override **user preference** (if they manually toggled)
- Should work with **SSR** (Next.js App Router)

---

## Implementation Approaches

## Approach 1: Route-Based Initial State (Simple)

### Description
Modify `NavigationContext` to set initial `panelState` based on current pathname on component mount.

### Implementation
**File:** `/src/contexts/NavigationContext.tsx`

```typescript
'use client';

import { usePathname } from 'next/navigation';
import { useIsDesktop } from '@/hooks/useMediaQuery';
import { useEffect, useState } from 'react';

export function NavigationProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isDesktop = useIsDesktop();

  // Determine initial state based on route
  const getInitialPanelState = () => {
    if (!isDesktop) return 'expanded'; // Mobile doesn't use panel states
    return pathname === '/' ? 'expanded' : 'partial';
  };

  const [panelState, setPanelState] = useState<PanelState>(getInitialPanelState());
  const [chatExpanded, setChatExpanded] = useState(false);
  // ... rest of state

  // Re-evaluate on pathname or viewport change (optional)
  useEffect(() => {
    if (isDesktop && pathname !== '/') {
      setPanelState('partial');
    } else if (isDesktop && pathname === '/') {
      setPanelState('expanded');
    }
  }, [pathname, isDesktop]);

  // ... rest of provider
}
```

### Pros ✅
- **Simple implementation** - Minimal code changes
- **Works immediately** - No localStorage or complex state
- **Respects current architecture** - Uses existing hooks and patterns
- **SSR-compatible** - Next.js `usePathname()` works server-side
- **Predictable behavior** - Always resets based on route

### Cons ❌
- **No user preference persistence** - Resets on every navigation
- **Can be jarring** - Nav collapses/expands when navigating between pages
- **User annoyance** - If user expands on /about, it collapses again on next page
- **Opinionated UX** - Assumes users want different states per page

### Use Case
Best for: Initial MVP, quick implementation, if you're okay with non-persistent behavior

---

## Approach 2: Initial Load Only + User Preference (Recommended)

### Description
Set default state based on route **only on initial page load**, then respect user's manual toggling. Uses session/local storage to track if user has ever manually changed the state.

### Implementation
**File:** `/src/contexts/NavigationContext.tsx`

```typescript
'use client';

import { usePathname } from 'next/navigation';
import { useIsDesktop } from '@/hooks/useMediaQuery';
import { useEffect, useState, useRef } from 'react';

const USER_PREF_KEY = 'nav-panel-user-pref';

export function NavigationProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isDesktop = useIsDesktop();
  const hasManuallyToggled = useRef(false);

  // Check if user has ever set a preference
  const getUserPreference = (): PanelState | null => {
    if (typeof window === 'undefined') return null;
    const stored = localStorage.getItem(USER_PREF_KEY);
    return stored as PanelState | null;
  };

  // Determine initial state
  const getInitialPanelState = (): PanelState => {
    // 1. Check for user preference first
    const userPref = getUserPreference();
    if (userPref) return userPref;

    // 2. If no preference, use route-based logic (desktop only)
    if (!isDesktop) return 'expanded';
    return pathname === '/' ? 'expanded' : 'partial';
  };

  const [panelState, setPanelState] = useState<PanelState>(getInitialPanelState());

  // Wrapper to track manual toggles
  const handleSetPanelState = (newState: PanelState | ((prev: PanelState) => PanelState)) => {
    hasManuallyToggled.current = true;
    const resolvedState = typeof newState === 'function' ? newState(panelState) : newState;
    localStorage.setItem(USER_PREF_KEY, resolvedState);
    setPanelState(resolvedState);
  };

  // ... rest of provider with handleSetPanelState instead of setPanelState
}
```

**File:** `/src/components/navigation/NavigationPanel.tsx` (update toggle handler)

```typescript
// Replace setPanelState calls with context method
const { panelState, setPanelState } = useNavigation();

const handleToggle = () => {
  setPanelState(prev => prev === 'expanded' ? 'partial' : 'expanded');
};
```

### Pros ✅
- **Respects user preference** - Once user toggles, their choice persists
- **Smart defaults** - New users get collapsed nav on non-homepage
- **Non-intrusive** - Only affects initial page load experience
- **Better UX** - Doesn't fight with user's manual interactions
- **Persistent across sessions** - Uses localStorage

### Cons ❌
- **More complex** - Requires localStorage management
- **Storage overhead** - Adds localStorage key (minimal)
- **SSR hydration** - Need to handle server/client mismatch (Next.js warning)
- **Testing complexity** - Need to mock localStorage in tests
- **Clearing preferences** - No built-in way to reset (could add button)

### Use Case
Best for: Production-ready feature with good UX, balances defaults with user control

---

## Approach 3: Session-Based (Initial Load Only)

### Description
Similar to Approach 2, but uses **sessionStorage** instead of localStorage. State resets per browser session (when tab closes).

### Implementation
Same as Approach 2, but replace `localStorage` with `sessionStorage`:

```typescript
const stored = sessionStorage.getItem(USER_PREF_KEY);
sessionStorage.setItem(USER_PREF_KEY, resolvedState);
```

### Pros ✅
- **Fresh start per session** - User gets default behavior each visit
- **Respects in-session preference** - Persists during browsing session
- **Less storage pollution** - Clears when tab closes
- **Privacy-friendly** - Doesn't persist indefinitely

### Cons ❌
- **Resets on new tab** - Opening site in new tab resets preference
- **Lost on accidental close** - User has to re-expand if they close tab
- **Inconsistent across tabs** - Different states in different tabs

### Use Case
Best for: If you want fresh defaults each visit but still respect user during session

---

## Approach 4: URL-Based State Control

### Description
Add URL query parameter support for controlling nav state (e.g., `?nav=partial`). Allows deep linking to specific nav states.

### Implementation
**File:** `/src/contexts/NavigationContext.tsx`

```typescript
'use client';

import { useSearchParams, usePathname } from 'next/navigation';

export function NavigationProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const navParam = searchParams.get('nav'); // 'expanded' | 'partial' | null

  const getInitialPanelState = (): PanelState => {
    // 1. URL param takes highest priority
    if (navParam === 'expanded' || navParam === 'partial') {
      return navParam;
    }

    // 2. Check localStorage
    const stored = localStorage.getItem('nav-panel-user-pref');
    if (stored) return stored as PanelState;

    // 3. Default: homepage expanded, others partial
    return pathname === '/' ? 'expanded' : 'partial';
  };

  // ... rest
}
```

### Pros ✅
- **Deep linking support** - Share URLs with specific nav state
- **Developer-friendly** - Easy to test different states
- **Explicit control** - Users/marketers can control experience via URL
- **Debugging** - Can force state for troubleshooting

### Cons ❌
- **URL clutter** - Adds query parameter to all URLs
- **SEO considerations** - Need canonical URLs to avoid duplicate content
- **User confusion** - Most users won't understand `?nav=partial`
- **Over-engineering** - Adds complexity for minimal benefit

### Use Case
Best for: Advanced use cases, A/B testing, marketing campaigns, developer tools

---

## Approach 5: First-Visit Detection (Cookie-Based)

### Description
Use cookies to detect true "first visit" to site and apply special behavior only then.

### Implementation
**File:** `/src/contexts/NavigationContext.tsx`

```typescript
'use client';

import Cookies from 'js-cookie';

const FIRST_VISIT_COOKIE = 'has-visited';

export function NavigationProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isDesktop = useIsDesktop();

  const isFirstVisit = !Cookies.get(FIRST_VISIT_COOKIE);

  const getInitialPanelState = (): PanelState => {
    // Mark as visited
    if (isFirstVisit) {
      Cookies.set(FIRST_VISIT_COOKIE, 'true', { expires: 365 });
    }

    // Only apply auto-collapse on first visit
    if (isFirstVisit && isDesktop && pathname !== '/') {
      return 'partial';
    }

    // Otherwise, check for stored preference
    const stored = localStorage.getItem('nav-panel-user-pref');
    return stored as PanelState || 'expanded';
  };

  // ... rest
}
```

### Pros ✅
- **First-impression focus** - Only affects new users
- **Non-intrusive** - Returning users get their preference
- **Privacy-friendly** - Simple boolean cookie
- **Onboarding opportunity** - Could add tooltip explaining collapse

### Cons ❌
- **Cookie dependency** - Requires cookie consent management
- **Privacy concerns** - Tracking user visits (even anonymously)
- **Clearing cookies breaks it** - Users who clear cookies repeatedly get "first visit"
- **Complex logic** - Combines cookies + localStorage

### Use Case
Best for: Onboarding-focused UX, new user experience optimization

---

## Recommended Approach: Approach 2 (Initial Load + User Preference)

### Rationale
1. **Best UX balance** - Gives new users collapsed nav on deep pages, respects returning users
2. **Production-ready** - Handles edge cases well
3. **User-centric** - Respects manual interactions
4. **Maintainable** - Clear logic, well-understood patterns
5. **No cookie concerns** - Uses localStorage (no consent needed for functional data)

### Implementation Checklist
- [ ] Update `NavigationContext.tsx` with localStorage logic
- [ ] Add `hasManuallyToggled` ref to track user interactions
- [ ] Wrap `setPanelState` to save preference on manual toggle
- [ ] Handle SSR hydration (use `useEffect` to read localStorage)
- [ ] Add tests for localStorage persistence
- [ ] Consider adding "Reset Navigation Preference" button in settings (optional)
- [ ] Update documentation in CLAUDE.md

---

## Edge Cases to Handle

### 1. SSR Hydration Mismatch
**Problem:** Server renders with one state, client has different localStorage value
**Solution:** Use `useEffect` to sync state after mount:

```typescript
const [panelState, setPanelState] = useState<PanelState>('expanded'); // Safe SSR default

useEffect(() => {
  const userPref = getUserPreference();
  if (userPref) {
    setPanelState(userPref);
  } else if (isDesktop && pathname !== '/') {
    setPanelState('partial');
  }
}, []); // Only on mount
```

### 2. Viewport Resize During Session
**Problem:** User resizes from desktop to mobile
**Solution:** Reset to 'expanded' when viewport goes below 1024px:

```typescript
useEffect(() => {
  if (!isDesktop) {
    setPanelState('expanded');
  }
}, [isDesktop]);
```

### 3. Direct Navigation to Non-Homepage
**Problem:** User lands directly on `/about` via bookmark/search
**Solution:** Already handled - checks pathname on mount

### 4. Chat Expanded State
**Problem:** Partial nav might conflict with chat expansion
**Solution:** Existing logic already handles this in `NavigationPanel.tsx`:

```typescript
useEffect(() => {
  if (panelState === 'partial') {
    setChatExpanded(false);
  }
}, [panelState]);
```

---

## Testing Strategy

### Unit Tests
```typescript
describe('NavigationContext - Route-based Initial State', () => {
  it('should default to partial state on non-homepage (desktop)', () => {
    // Mock usePathname to return '/about'
    // Mock useIsDesktop to return true
    // Assert initial panelState is 'partial'
  });

  it('should default to expanded state on homepage (desktop)', () => {
    // Mock usePathname to return '/'
    // Assert initial panelState is 'expanded'
  });

  it('should respect localStorage preference over route-based default', () => {
    // Set localStorage to 'expanded'
    // Mock pathname to '/about'
    // Assert panelState is 'expanded' (user pref wins)
  });

  it('should save user preference to localStorage on manual toggle', () => {
    // Call setPanelState
    // Assert localStorage was updated
  });
});
```

### E2E Tests (Playwright)
```typescript
test('Navigation starts collapsed on /about page (desktop)', async ({ page }) => {
  await page.goto('http://localhost:3000/about');
  await page.setViewportSize({ width: 1440, height: 900 }); // Desktop

  const nav = page.locator('[data-testid="navigation-panel"]');
  await expect(nav).toHaveClass(/w-\[81px\]/); // Partial state
});

test('Navigation starts expanded on homepage (desktop)', async ({ page }) => {
  await page.goto('http://localhost:3000/');
  await page.setViewportSize({ width: 1440, height: 900 });

  const nav = page.locator('[data-testid="navigation-panel"]');
  await expect(nav).toHaveClass(/w-\[320px\]/); // Expanded state
});

test('User preference persists across page navigation', async ({ page, context }) => {
  // Start on /about (partial)
  await page.goto('http://localhost:3000/about');

  // Manually expand
  await page.click('[data-testid="nav-toggle-button"]');

  // Navigate to /blog
  await page.goto('http://localhost:3000/blog');

  // Should remain expanded (user pref)
  const nav = page.locator('[data-testid="navigation-panel"]');
  await expect(nav).toHaveClass(/w-\[320px\]/);
});
```

---

## Performance Considerations

### Bundle Size Impact
- **Minimal** - Only adds ~15-20 lines of logic
- **No new dependencies** - Uses built-in localStorage/sessionStorage
- **No runtime overhead** - Simple boolean checks

### Rendering Impact
- **One-time cost** - Only runs on component mount
- **No re-renders** - State change happens before first paint (in useEffect)
- **SSR-safe** - Properly handles server/client differences

### Storage Impact
- **1 localStorage key** - `"nav-panel-user-pref"` (max 10 bytes)
- **Negligible** - Won't affect browser storage limits

---

## Accessibility Considerations

### Screen Readers
- ✅ No impact - Nav state doesn't affect ARIA labels
- ✅ Toggle button remains keyboard accessible
- ⚠️ Consider announcing state change with `aria-live` region

### Keyboard Navigation
- ✅ Tab order unaffected
- ✅ Focus styles remain intact
- ✅ Toggle button accessible via keyboard

### Motion Preferences
- ✅ Existing `prefers-reduced-motion` handling works
- ✅ Transition animations can be disabled via CSS

---

## Rollout Strategy

### Phase 1: Development & Testing
1. Implement Approach 2 in dev environment
2. Add unit tests for localStorage logic
3. Add E2E tests for route-based behavior
4. Test SSR hydration edge cases

### Phase 2: Staged Rollout
1. Deploy to preview/staging environment
2. Get user feedback from beta testers
3. Monitor for hydration warnings in console
4. A/B test with analytics (optional)

### Phase 3: Production
1. Deploy to production with feature flag (optional)
2. Monitor for bugs via error tracking
3. Collect user feedback via support channels
4. Iterate based on real-world usage

### Rollback Plan
If issues arise:
```typescript
// Quick rollback: Comment out route-based logic
const getInitialPanelState = (): PanelState => {
  return 'expanded'; // Always expanded (original behavior)
};
```

---

## Alternative Considerations

### Could this be a user setting?
**Yes!** Consider adding to a Settings/Preferences page:
```
[ ] Collapse navigation on non-homepage (desktop only)
```

**Pros:**
- Maximum user control
- Clear opt-in/opt-out
- Discoverable in settings

**Cons:**
- Most users won't find it
- Adds settings complexity
- Requires settings UI

---

## Conclusion

**Feasibility: ✅ Highly Feasible**

The feature is straightforward to implement with existing architecture. The navigation context already supports the necessary states, and Next.js provides the routing primitives needed.

**Recommended Implementation:**
- **Approach 2** (Initial Load + User Preference via localStorage)
- Estimated effort: 2-3 hours (implementation + tests)
- Low risk, high value for UX improvement

**Key Benefits:**
1. Better first impression for users landing on deep pages
2. Respects user preference after manual interaction
3. Minimal code changes to existing architecture
4. No breaking changes to current functionality

**Next Steps:**
1. Get approval on Approach 2
2. Add data-testid attributes to navigation components
3. Implement localStorage logic in NavigationContext
4. Write unit + E2E tests
5. Deploy to staging for user testing

---

## Questions for Product Decision

1. **Should the preference persist across browser sessions?**
   - Yes → localStorage (Approach 2)
   - No → sessionStorage (Approach 3)

2. **Should there be a way to reset the preference?**
   - If yes, add "Reset Navigation" button in settings

3. **Should mobile be affected?**
   - Currently: No (mobile uses hamburger menu)
   - Mobile nav doesn't have expanded/partial states

4. **What about the chat section?**
   - Current behavior: Partial nav auto-closes chat
   - Should remain unchanged

5. **Analytics tracking?**
   - Track manual toggle events?
   - Track default state on page load?
   - A/B test expanded vs partial default?

---

**Research completed by:** Claude Code
**Files examined:** 10+ navigation components, contexts, and hooks
**Lines of code analyzed:** ~1,200 lines
