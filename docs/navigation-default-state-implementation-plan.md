# Navigation Default State Implementation Plan

**Feature:** Route-based initial navigation state with user preference persistence
**Approach:** #2 - Initial Load + User Preference (localStorage)
**Date:** November 23, 2025
**Estimated Effort:** 2-3 hours

---

## Overview

Implement a feature where the desktop navigation starts in a collapsed (partial) state on all pages except the homepage, while respecting user preferences once they manually toggle the state.

**Key Behavior:**
- **First-time visitors:** Nav collapsed on non-homepage routes, expanded on homepage
- **Returning visitors:** Nav respects their last manual toggle state
- **Manual toggles:** Saved to localStorage, persist across sessions
- **Mobile:** No changes (mobile doesn't use panel states)

---

## Implementation Steps

### Step 1: Add localStorage Utility Functions

**File:** `/src/lib/navigation-storage.ts` (new file)

**Purpose:** Centralize localStorage logic for better testability and reusability

**Code:**
```typescript
/**
 * Navigation state persistence utilities
 * Manages localStorage for navigation panel state preferences
 */

const STORAGE_KEY = 'nav-panel-user-pref';

export type PanelState = 'collapsed' | 'partial' | 'expanded';

/**
 * Get user's saved navigation preference from localStorage
 * @returns Saved PanelState or null if no preference exists
 */
export function getNavPreference(): PanelState | null {
  if (typeof window === 'undefined') return null;

  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === 'partial' || stored === 'expanded' || stored === 'collapsed') {
      return stored;
    }
    return null;
  } catch (error) {
    console.error('Failed to read navigation preference:', error);
    return null;
  }
}

/**
 * Save user's navigation preference to localStorage
 * @param state - PanelState to save
 */
export function setNavPreference(state: PanelState): void {
  if (typeof window === 'undefined') return;

  try {
    localStorage.setItem(STORAGE_KEY, state);
  } catch (error) {
    console.error('Failed to save navigation preference:', error);
  }
}

/**
 * Clear user's navigation preference
 * Useful for testing or "reset to defaults" functionality
 */
export function clearNavPreference(): void {
  if (typeof window === 'undefined') return;

  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('Failed to clear navigation preference:', error);
  }
}

/**
 * Determine initial panel state based on route and user preference
 * @param pathname - Current route pathname
 * @param isDesktop - Whether viewport is desktop size
 * @returns Appropriate initial PanelState
 */
export function getInitialPanelState(pathname: string, isDesktop: boolean): PanelState {
  // 1. Check for user preference first (highest priority)
  const userPreference = getNavPreference();
  if (userPreference) {
    return userPreference;
  }

  // 2. If no preference, use route-based logic (desktop only)
  if (!isDesktop) {
    return 'expanded'; // Mobile doesn't use panel states
  }

  // 3. Homepage gets expanded, all other routes get partial
  return pathname === '/' ? 'expanded' : 'partial';
}
```

**Validation:**
- [ ] File created at `/src/lib/navigation-storage.ts`
- [ ] All functions properly typed
- [ ] Error handling for localStorage failures
- [ ] SSR-safe (checks for `window`)

---

### Step 2: Update NavigationContext

**File:** `/src/contexts/NavigationContext.tsx`

**Changes:**
1. Import new utility functions
2. Replace direct `useState` initialization with `useEffect`-based hydration
3. Wrap `setPanelState` to save preference on manual changes
4. Handle SSR hydration properly

**Implementation:**

#### 2a. Add imports
```typescript
import { usePathname } from 'next/navigation';
import { useIsDesktop } from '@/hooks/useMediaQuery';
import { useEffect, useState } from 'react';
import {
  getInitialPanelState,
  setNavPreference,
  type PanelState
} from '@/lib/navigation-storage';
```

#### 2b. Update state initialization
**Current code:**
```typescript
const [panelState, setPanelState] = useState<PanelState>('expanded');
```

**New code:**
```typescript
// Safe SSR default (will be updated on client mount)
const [panelState, setPanelState] = useState<PanelState>('expanded');
const [isHydrated, setIsHydrated] = useState(false);
```

#### 2c. Add hydration effect
**Insert after state declarations:**
```typescript
const pathname = usePathname();
const isDesktop = useIsDesktop();

// Hydrate initial state on client mount
useEffect(() => {
  const initialState = getInitialPanelState(pathname, isDesktop);
  setPanelState(initialState);
  setIsHydrated(true);
}, [pathname, isDesktop]);
```

#### 2d. Create wrapped setState function
**Insert before return statement:**
```typescript
/**
 * Update panel state and save to localStorage
 * This wrapper ensures user preferences are persisted
 */
const updatePanelState = (newState: PanelState | ((prev: PanelState) => PanelState)) => {
  const resolvedState = typeof newState === 'function' ? newState(panelState) : newState;

  // Save to localStorage (marks as user preference)
  setNavPreference(resolvedState);

  // Update React state
  setPanelState(resolvedState);
};
```

#### 2e. Update context value
**Current:**
```typescript
const value = {
  panelState,
  setPanelState,
  // ... other values
};
```

**New:**
```typescript
const value = {
  panelState,
  setPanelState: updatePanelState, // Use wrapped version
  isHydrated, // Export for components that need to wait
  // ... other values
};
```

#### 2f. Update NavigationContextType
**Add to type definition:**
```typescript
type NavigationContextType = {
  panelState: PanelState;
  setPanelState: (state: PanelState | ((prev: PanelState) => PanelState)) => void;
  isHydrated: boolean; // New field
  // ... rest of fields
};
```

**Validation:**
- [ ] Import statements updated
- [ ] State initialization uses safe SSR default
- [ ] `useEffect` hydrates state on client mount
- [ ] `updatePanelState` wrapper saves to localStorage
- [ ] Context exports `isHydrated` flag
- [ ] Type definitions updated

---

### Step 3: Update NavigationPanel Component

**File:** `/src/components/navigation/NavigationPanel.tsx`

**Changes:**
1. Use wrapped `setPanelState` from context (already should work)
2. Optionally add visual indicator during hydration
3. Ensure toggle button uses the wrapped function

**Implementation:**

#### 3a. Verify toggle handler
**Current code (should exist):**
```typescript
const { panelState, setPanelState } = useNavigation();

const handleToggle = () => {
  setPanelState(prev => prev === 'expanded' ? 'partial' : 'expanded');
};
```

**Verification:**
- This code should already work with the wrapped function
- No changes needed if toggle uses `setPanelState` from context
- If toggle calls `setPanelState` directly, ensure it's the context version

#### 3b. Optional: Add hydration handling
**If you want to prevent flash of wrong state:**
```typescript
const { panelState, setPanelState, isHydrated } = useNavigation();

// Prevent rendering until hydrated (optional)
if (!isHydrated) {
  return (
    <aside className="fixed left-0 top-0 h-full w-[81px] bg-navigation">
      {/* Minimal loading state */}
    </aside>
  );
}
```

**Note:** This is optional - hydration is fast enough that flash may not be noticeable

**Validation:**
- [ ] Toggle handler uses `setPanelState` from context
- [ ] Manual toggles trigger localStorage save
- [ ] Optional: Hydration loading state added

---

### Step 4: Add Data Test IDs for Testing

**Files:**
- `/src/components/navigation/NavigationPanel.tsx`
- `/src/components/navigation/NavigationMenu.tsx`

**Purpose:** Enable reliable E2E testing

**Changes:**

#### 4a. NavigationPanel
```typescript
<aside
  data-testid="navigation-panel"
  data-panel-state={panelState} // For assertions
  className={cn(
    // ... existing classes
  )}
>
```

#### 4b. Navigation toggle button
```typescript
<button
  data-testid="nav-toggle-button"
  onClick={handleToggle}
  aria-label={panelState === 'expanded' ? 'Collapse navigation' : 'Expand navigation'}
  // ... rest of props
>
```

**Validation:**
- [ ] `data-testid="navigation-panel"` added to aside element
- [ ] `data-panel-state={panelState}` added for state assertions
- [ ] `data-testid="nav-toggle-button"` added to toggle button
- [ ] ARIA labels updated for accessibility

---

### Step 5: Write Unit Tests

**File:** `/src/lib/__tests__/navigation-storage.test.ts` (new file)

**Purpose:** Test localStorage utilities in isolation

**Code:**
```typescript
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import {
  getNavPreference,
  setNavPreference,
  clearNavPreference,
  getInitialPanelState,
} from '../navigation-storage';

describe('Navigation Storage Utilities', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  afterEach(() => {
    localStorage.clear();
  });

  describe('getNavPreference', () => {
    it('returns null when no preference is stored', () => {
      expect(getNavPreference()).toBeNull();
    });

    it('returns stored preference', () => {
      localStorage.setItem('nav-panel-user-pref', 'partial');
      expect(getNavPreference()).toBe('partial');
    });

    it('returns null for invalid values', () => {
      localStorage.setItem('nav-panel-user-pref', 'invalid');
      expect(getNavPreference()).toBeNull();
    });

    it('handles localStorage errors gracefully', () => {
      // Mock localStorage.getItem to throw
      const originalGetItem = Storage.prototype.getItem;
      Storage.prototype.getItem = () => {
        throw new Error('Storage error');
      };

      expect(getNavPreference()).toBeNull();

      // Restore
      Storage.prototype.getItem = originalGetItem;
    });
  });

  describe('setNavPreference', () => {
    it('saves preference to localStorage', () => {
      setNavPreference('partial');
      expect(localStorage.getItem('nav-panel-user-pref')).toBe('partial');
    });

    it('overwrites existing preference', () => {
      setNavPreference('partial');
      setNavPreference('expanded');
      expect(localStorage.getItem('nav-panel-user-pref')).toBe('expanded');
    });

    it('handles localStorage errors gracefully', () => {
      const originalSetItem = Storage.prototype.setItem;
      Storage.prototype.setItem = () => {
        throw new Error('Storage error');
      };

      // Should not throw
      expect(() => setNavPreference('partial')).not.toThrow();

      Storage.prototype.setItem = originalSetItem;
    });
  });

  describe('clearNavPreference', () => {
    it('removes preference from localStorage', () => {
      localStorage.setItem('nav-panel-user-pref', 'partial');
      clearNavPreference();
      expect(localStorage.getItem('nav-panel-user-pref')).toBeNull();
    });

    it('handles non-existent preference gracefully', () => {
      expect(() => clearNavPreference()).not.toThrow();
    });
  });

  describe('getInitialPanelState', () => {
    it('returns user preference if exists', () => {
      setNavPreference('partial');
      expect(getInitialPanelState('/', true)).toBe('partial');
      expect(getInitialPanelState('/about', true)).toBe('partial');
    });

    it('returns expanded for homepage when no preference (desktop)', () => {
      expect(getInitialPanelState('/', true)).toBe('expanded');
    });

    it('returns partial for non-homepage when no preference (desktop)', () => {
      expect(getInitialPanelState('/about', true)).toBe('partial');
      expect(getInitialPanelState('/case-studies', true)).toBe('partial');
      expect(getInitialPanelState('/blog', true)).toBe('partial');
    });

    it('returns expanded for mobile regardless of route', () => {
      expect(getInitialPanelState('/', false)).toBe('expanded');
      expect(getInitialPanelState('/about', false)).toBe('expanded');
    });

    it('handles routes with trailing slashes', () => {
      expect(getInitialPanelState('/about/', true)).toBe('partial');
    });

    it('handles dynamic routes', () => {
      expect(getInitialPanelState('/case-studies/virgin-america', true)).toBe('partial');
      expect(getInitialPanelState('/blog/my-post', true)).toBe('partial');
    });

    it('user preference overrides route-based logic', () => {
      setNavPreference('expanded');
      // Even on non-homepage, should return expanded (user pref)
      expect(getInitialPanelState('/about', true)).toBe('expanded');
    });
  });
});
```

**Validation:**
- [ ] File created at `/src/lib/__tests__/navigation-storage.test.ts`
- [ ] All utility functions covered
- [ ] localStorage mocking works
- [ ] Error handling tested
- [ ] Edge cases covered (trailing slashes, dynamic routes)

---

### Step 6: Write Integration Tests

**File:** `/src/contexts/__tests__/NavigationContext.test.tsx` (new file)

**Purpose:** Test context behavior with localStorage integration

**Code:**
```typescript
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';
import { NavigationProvider, useNavigation } from '../NavigationContext';
import { setNavPreference, clearNavPreference } from '@/lib/navigation-storage';

// Mock Next.js hooks
const mockPathname = vi.fn(() => '/');
const mockIsDesktop = vi.fn(() => true);

vi.mock('next/navigation', () => ({
  usePathname: () => mockPathname(),
}));

vi.mock('@/hooks/useMediaQuery', () => ({
  useIsDesktop: () => mockIsDesktop(),
}));

describe('NavigationContext - Route-based Initial State', () => {
  beforeEach(() => {
    localStorage.clear();
    mockPathname.mockReturnValue('/');
    mockIsDesktop.mockReturnValue(true);
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('starts with expanded state on homepage (desktop, no preference)', async () => {
    mockPathname.mockReturnValue('/');

    const { result } = renderHook(() => useNavigation(), {
      wrapper: NavigationProvider,
    });

    await waitFor(() => {
      expect(result.current.isHydrated).toBe(true);
    });

    expect(result.current.panelState).toBe('expanded');
  });

  it('starts with partial state on non-homepage (desktop, no preference)', async () => {
    mockPathname.mockReturnValue('/about');

    const { result } = renderHook(() => useNavigation(), {
      wrapper: NavigationProvider,
    });

    await waitFor(() => {
      expect(result.current.isHydrated).toBe(true);
    });

    expect(result.current.panelState).toBe('partial');
  });

  it('respects user preference over route-based default', async () => {
    setNavPreference('expanded');
    mockPathname.mockReturnValue('/about'); // Non-homepage

    const { result } = renderHook(() => useNavigation(), {
      wrapper: NavigationProvider,
    });

    await waitFor(() => {
      expect(result.current.isHydrated).toBe(true);
    });

    // Should use preference (expanded) not route default (partial)
    expect(result.current.panelState).toBe('expanded');
  });

  it('saves user preference to localStorage on manual toggle', async () => {
    const { result } = renderHook(() => useNavigation(), {
      wrapper: NavigationProvider,
    });

    await waitFor(() => {
      expect(result.current.isHydrated).toBe(true);
    });

    act(() => {
      result.current.setPanelState('partial');
    });

    expect(localStorage.getItem('nav-panel-user-pref')).toBe('partial');
  });

  it('handles mobile viewport (always expanded)', async () => {
    mockIsDesktop.mockReturnValue(false);
    mockPathname.mockReturnValue('/about');

    const { result } = renderHook(() => useNavigation(), {
      wrapper: NavigationProvider,
    });

    await waitFor(() => {
      expect(result.current.isHydrated).toBe(true);
    });

    expect(result.current.panelState).toBe('expanded');
  });

  it('handles function-based setPanelState', async () => {
    const { result } = renderHook(() => useNavigation(), {
      wrapper: NavigationProvider,
    });

    await waitFor(() => {
      expect(result.current.isHydrated).toBe(true);
    });

    act(() => {
      result.current.setPanelState(prev => prev === 'expanded' ? 'partial' : 'expanded');
    });

    expect(result.current.panelState).toBe('partial');
    expect(localStorage.getItem('nav-panel-user-pref')).toBe('partial');
  });
});
```

**Validation:**
- [ ] File created at `/src/contexts/__tests__/NavigationContext.test.tsx`
- [ ] Context hydration tested
- [ ] localStorage integration tested
- [ ] Route-based defaults tested
- [ ] User preference persistence tested
- [ ] Mobile handling tested

---

### Step 7: Write E2E Tests

**File:** `/tests/e2e/navigation-initial-state.spec.ts` (new file)

**Purpose:** Test real browser behavior end-to-end

**Code:**
```typescript
import { test, expect } from '@playwright/test';

test.describe('Navigation Initial State (Desktop)', () => {
  test.use({ viewport: { width: 1440, height: 900 } }); // Desktop viewport

  test.beforeEach(async ({ context }) => {
    // Clear localStorage before each test
    await context.clearCookies();
  });

  test('starts expanded on homepage', async ({ page }) => {
    await page.goto('http://localhost:3000/');

    const nav = page.locator('[data-testid="navigation-panel"]');
    await expect(nav).toHaveAttribute('data-panel-state', 'expanded');

    // Check actual width (320px for expanded)
    await expect(nav).toHaveClass(/lg:w-\[320px\]/);
  });

  test('starts collapsed on /about page', async ({ page }) => {
    await page.goto('http://localhost:3000/about');

    const nav = page.locator('[data-testid="navigation-panel"]');
    await expect(nav).toHaveAttribute('data-panel-state', 'partial');

    // Check actual width (81px for partial)
    await expect(nav).toHaveClass(/lg:w-\[81px\]/);
  });

  test('starts collapsed on /case-studies page', async ({ page }) => {
    await page.goto('http://localhost:3000/case-studies');

    const nav = page.locator('[data-testid="navigation-panel"]');
    await expect(nav).toHaveAttribute('data-panel-state', 'partial');
  });

  test('starts collapsed on /blog page', async ({ page }) => {
    await page.goto('http://localhost:3000/blog');

    const nav = page.locator('[data-testid="navigation-panel"]');
    await expect(nav).toHaveAttribute('data-panel-state', 'partial');
  });

  test('user preference persists after manual toggle', async ({ page, context }) => {
    // Start on /about (should be partial)
    await page.goto('http://localhost:3000/about');

    let nav = page.locator('[data-testid="navigation-panel"]');
    await expect(nav).toHaveAttribute('data-panel-state', 'partial');

    // Manually expand
    await page.click('[data-testid="nav-toggle-button"]');
    await expect(nav).toHaveAttribute('data-panel-state', 'expanded');

    // Navigate to /blog (should remain expanded due to user pref)
    await page.goto('http://localhost:3000/blog');

    nav = page.locator('[data-testid="navigation-panel"]');
    await expect(nav).toHaveAttribute('data-panel-state', 'expanded');
  });

  test('user preference persists across page reloads', async ({ page }) => {
    // Start on /about, expand it
    await page.goto('http://localhost:3000/about');
    await page.click('[data-testid="nav-toggle-button"]');

    // Reload page
    await page.reload();

    // Should still be expanded (user pref)
    const nav = page.locator('[data-testid="navigation-panel"]');
    await expect(nav).toHaveAttribute('data-panel-state', 'expanded');
  });

  test('collapsing on homepage is remembered', async ({ page }) => {
    // Start on homepage (expanded by default)
    await page.goto('http://localhost:3000/');

    let nav = page.locator('[data-testid="navigation-panel"]');
    await expect(nav).toHaveAttribute('data-panel-state', 'expanded');

    // Collapse it
    await page.click('[data-testid="nav-toggle-button"]');
    await expect(nav).toHaveAttribute('data-panel-state', 'partial');

    // Go to /about and back to homepage
    await page.goto('http://localhost:3000/about');
    await page.goto('http://localhost:3000/');

    // Should still be partial (user pref)
    nav = page.locator('[data-testid="navigation-panel"]');
    await expect(nav).toHaveAttribute('data-panel-state', 'partial');
  });

  test('toggle button is keyboard accessible', async ({ page }) => {
    await page.goto('http://localhost:3000/about');

    // Focus toggle button via keyboard
    await page.keyboard.press('Tab');
    // May need multiple tabs depending on page structure
    await page.locator('[data-testid="nav-toggle-button"]').focus();

    // Press Enter to toggle
    await page.keyboard.press('Enter');

    const nav = page.locator('[data-testid="navigation-panel"]');
    await expect(nav).toHaveAttribute('data-panel-state', 'expanded');
  });
});

test.describe('Navigation Initial State (Mobile)', () => {
  test.use({ viewport: { width: 375, height: 667 } }); // Mobile viewport

  test('mobile navigation is unaffected', async ({ page }) => {
    await page.goto('http://localhost:3000/about');

    // Mobile uses hamburger menu, not panel states
    const hamburger = page.locator('[data-testid="mobile-hamburger-button"]');
    await expect(hamburger).toBeVisible();

    // Desktop nav panel should be hidden on mobile
    const nav = page.locator('[data-testid="navigation-panel"]');
    await expect(nav).toHaveClass(/hidden/);
  });
});
```

**Validation:**
- [ ] File created at `/tests/e2e/navigation-initial-state.spec.ts`
- [ ] Homepage expanded behavior tested
- [ ] Non-homepage collapsed behavior tested
- [ ] User preference persistence tested
- [ ] Keyboard accessibility tested
- [ ] Mobile unaffected verified

---

### Step 8: Update Documentation

**File:** `/docs/CLAUDE.md`

**Changes:** Add note about navigation default state behavior

**Insert under "Architecture Overview" → "Key Architectural Decisions":**

```markdown
### Key Architectural Decisions
1. **Component Library**: Uses shadcn/ui pattern...
2. **Sanity Integration**: Embedded Sanity Studio...
3. **Routing**: Next.js App Router with file-based routing...
4. **Styling**: Utility-first with Tailwind CSS...
5. **Navigation State**: Route-based initial state with user preference persistence
   - Desktop navigation starts collapsed on non-homepage routes
   - User's manual toggle preference saved to localStorage
   - Implemented in NavigationContext using `@/lib/navigation-storage` utilities
   - See `/docs/navigation-default-state-feature-research.md` for details
```

**Validation:**
- [ ] CLAUDE.md updated with navigation behavior note
- [ ] Links to research doc included

---

### Step 9: Manual QA Testing Checklist

**Desktop Testing:**
- [ ] Homepage loads with expanded navigation (320px)
- [ ] /about page loads with collapsed navigation (81px)
- [ ] /case-studies page loads with collapsed navigation
- [ ] /blog page loads with collapsed navigation
- [ ] Clicking toggle button on /about expands navigation
- [ ] After manual expand, navigation stays expanded on /blog
- [ ] After reload, manual preference persists
- [ ] Collapsing on homepage persists across navigation
- [ ] Clearing localStorage resets to route-based defaults
- [ ] No console errors in browser DevTools
- [ ] No hydration warnings in browser console

**Mobile Testing (viewport < 1024px):**
- [ ] Hamburger menu works on all pages
- [ ] No navigation panel visible (uses hamburger overlay)
- [ ] No localStorage being set on mobile
- [ ] Mobile chat footer works

**Cross-Browser Testing:**
- [ ] Chrome/Edge (Chromium)
- [ ] Firefox
- [ ] Safari (Mac/iOS)

**Accessibility Testing:**
- [ ] Toggle button has proper ARIA label
- [ ] Toggle button keyboard accessible (Tab + Enter)
- [ ] Focus visible on toggle button
- [ ] Screen reader announces state changes (optional)

**Edge Cases:**
- [ ] Direct navigation to /about via bookmark works
- [ ] Opening /about in new tab respects preference from other tab
- [ ] Private/incognito mode works (no localStorage available)
- [ ] Very fast navigation doesn't cause race conditions
- [ ] Viewport resize from desktop to mobile resets state

---

### Step 10: Rollout Plan

#### Phase 1: Development (Day 1)
- [ ] Implement Steps 1-4 (code changes)
- [ ] Run `npm run dev` and test locally
- [ ] Verify no TypeScript errors
- [ ] Verify no ESLint warnings

#### Phase 2: Testing (Day 1-2)
- [ ] Write and run unit tests (Step 5)
- [ ] Write and run integration tests (Step 6)
- [ ] Write and run E2E tests (Step 7)
- [ ] Run full test suite: `npm run test`
- [ ] Run E2E tests: `npm run test:e2e`
- [ ] Perform manual QA (Step 9)

#### Phase 3: Documentation (Day 2)
- [ ] Update CLAUDE.md (Step 8)
- [ ] Add JSDoc comments to new functions
- [ ] Update any relevant internal docs

#### Phase 4: Code Review (Day 2)
- [ ] Self-review all changes
- [ ] Check for code quality issues
- [ ] Verify test coverage
- [ ] Run `npm run build` to ensure production build works

#### Phase 5: Deployment (Day 3)
- [ ] Create feature branch: `git checkout -b feat/nav-route-based-state`
- [ ] Commit changes with descriptive message
- [ ] Push to remote
- [ ] Create pull request with testing notes
- [ ] Deploy to preview/staging environment
- [ ] Test on staging with real data
- [ ] Get stakeholder approval

#### Phase 6: Production (Day 3)
- [ ] Merge to main branch
- [ ] Deploy to production
- [ ] Monitor error logs for issues
- [ ] Watch for user feedback
- [ ] Be ready to rollback if needed

---

## Rollback Plan

If issues arise in production:

### Quick Rollback (< 5 minutes)
```typescript
// In NavigationContext.tsx, temporarily disable route-based logic:
const getInitialPanelState = () => 'expanded'; // Force old behavior
```

### Full Rollback (Git revert)
```bash
git revert <commit-hash>
git push origin main
# Redeploy
```

### Clearing User Preferences
If users report stuck states:
```typescript
// Add to NavigationPanel or create admin tool:
<button onClick={() => {
  localStorage.removeItem('nav-panel-user-pref');
  window.location.reload();
}}>
  Reset Navigation Preference
</button>
```

---

## Success Criteria

**Functional Requirements:**
- ✅ Navigation starts collapsed on non-homepage (desktop)
- ✅ Navigation starts expanded on homepage (desktop)
- ✅ Manual toggles persist via localStorage
- ✅ User preference overrides route-based defaults
- ✅ Mobile navigation unaffected
- ✅ No SSR hydration errors
- ✅ No runtime errors

**Quality Requirements:**
- ✅ 90%+ test coverage for new code
- ✅ All E2E tests passing
- ✅ No ESLint warnings
- ✅ No TypeScript errors
- ✅ Passes accessibility audit (keyboard, screen reader)

**Performance Requirements:**
- ✅ No noticeable delay on page load
- ✅ No layout shift during hydration
- ✅ localStorage read/write < 1ms

---

## Files Modified/Created Summary

### New Files (4)
1. `/src/lib/navigation-storage.ts` - localStorage utilities
2. `/src/lib/__tests__/navigation-storage.test.ts` - Unit tests
3. `/src/contexts/__tests__/NavigationContext.test.tsx` - Integration tests
4. `/tests/e2e/navigation-initial-state.spec.ts` - E2E tests

### Modified Files (3)
1. `/src/contexts/NavigationContext.tsx` - Add route-based logic
2. `/src/components/navigation/NavigationPanel.tsx` - Add test IDs
3. `/docs/CLAUDE.md` - Document feature

### Total Lines of Code
- **New code:** ~250 lines
- **Tests:** ~400 lines
- **Total:** ~650 lines

---

## Estimated Timeline

| Task | Time | Cumulative |
|------|------|------------|
| Step 1: Storage utilities | 30 min | 0.5h |
| Step 2: Update context | 45 min | 1.25h |
| Step 3: Update panel | 15 min | 1.5h |
| Step 4: Add test IDs | 15 min | 1.75h |
| Step 5: Unit tests | 30 min | 2.25h |
| Step 6: Integration tests | 30 min | 2.75h |
| Step 7: E2E tests | 30 min | 3.25h |
| Step 8: Documentation | 15 min | 3.5h |
| Step 9: Manual QA | 30 min | 4h |
| Step 10: Rollout | 1h | 5h |

**Total Estimated Time:** 4-5 hours (including testing and QA)

---

## Risk Assessment

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| SSR hydration mismatch | Medium | Low | Use safe defaults, hydrate in useEffect |
| localStorage not available | Low | Low | Error handling, graceful degradation |
| User confusion | Low | Medium | Clear toggle button, document behavior |
| Performance impact | Very Low | Low | localStorage is fast, minimal overhead |
| Breaking existing behavior | Low | High | Comprehensive tests, staged rollout |

---

## Post-Implementation Monitoring

**Metrics to Track:**
- [ ] Error rate in production logs
- [ ] Navigation toggle interactions (optional analytics)
- [ ] User feedback/support tickets about navigation
- [ ] Performance metrics (page load time)

**What to Watch For:**
- Console errors related to localStorage
- Hydration warnings in browser DevTools
- User complaints about "jumpy" navigation
- Accessibility issues reported

---

## Future Enhancements (Out of Scope)

1. **Settings UI** - Add user preference toggle in settings page
2. **Animation** - Smooth transition during initial state set
3. **Tour/Tooltip** - Explain collapsed nav on first visit
4. **Analytics** - Track usage patterns for data-driven decisions
5. **A/B Testing** - Test different defaults with user segments
6. **Remember per-route** - Different state for each route (complex)

---

## Questions & Answers

**Q: What if localStorage is disabled?**
A: Graceful degradation - falls back to route-based defaults every time

**Q: What about browser back/forward buttons?**
A: User preference persists, regardless of navigation method

**Q: Can users reset their preference?**
A: Yes, by clearing browser data. Could add UI button in future.

**Q: Does this affect SEO?**
A: No, navigation state is client-side only, doesn't affect rendered HTML

**Q: What about the chat section?**
A: Existing logic handles chat - partial nav closes chat automatically

---

**Plan created by:** Claude Code
**Ready for implementation:** Yes
**Approval needed:** Yes - please approve before proceeding with implementation
