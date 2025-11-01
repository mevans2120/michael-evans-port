# CSS Refactor Safety Plan: Preserving Look & Feel

**Created:** 2025-11-01
**Purpose:** Ensure zero visual regressions during CSS architecture refactoring
**Related:** [CSS Architecture Analysis](./css-architecture-analysis-2025-11-01.md)

---

## Executive Summary

This plan outlines a systematic approach to refactor the brittle CSS architecture while **guaranteeing** the existing look and feel is preserved. We'll use multiple layers of protection: visual regression testing, computed style snapshots, component testing, and incremental validation.

**Key Principle:** Trust but verify - every change must be validated before moving to the next.

---

## Table of Contents

1. [Pre-Refactor Safety Measures](#1-pre-refactor-safety-measures)
2. [Testing Infrastructure Setup](#2-testing-infrastructure-setup)
3. [Baseline Capture Strategy](#3-baseline-capture-strategy)
4. [Incremental Refactor Workflow](#4-incremental-refactor-workflow)
5. [Validation Checkpoints](#5-validation-checkpoints)
6. [Rollback Strategy](#6-rollback-strategy)
7. [Component-by-Component Plan](#7-component-by-component-plan)

---

## 1. Pre-Refactor Safety Measures

### 1.1 Create Feature Branch

```bash
# Create dedicated refactor branch
git checkout -b refactor/css-architecture-cleanup

# Never commit directly to main during refactor
# Each component refactor gets its own commit for easy rollback
```

### 1.2 Visual Regression Testing Setup

**Current State:** Playwright is installed and configured for E2E testing.

**Action: Add Playwright Visual Comparison**

Playwright has built-in screenshot comparison - we'll use it for pixel-perfect validation.

```typescript
// e2e/visual-regression.spec.ts
import { test, expect } from '@playwright/test';

const VIEWPORTS = [
  { name: 'desktop', width: 1920, height: 1080 },
  { name: 'tablet', width: 768, height: 1024 },
  { name: 'mobile', width: 375, height: 667 },
];

const PAGES_TO_TEST = [
  { path: '/', name: 'homepage' },
  { path: '/about', name: 'about' },
  { path: '/projects', name: 'projects' },
  // Add all key pages
];

const COMPONENTS_TO_TEST = [
  { selector: '[data-testid="navigation-panel"]', name: 'navigation' },
  { selector: '[data-testid="chat-section"]', name: 'chat' },
  { selector: '[data-testid="hero"]', name: 'hero' },
  // Add all critical components
];

for (const viewport of VIEWPORTS) {
  test.describe(`Visual Regression - ${viewport.name}`, () => {
    test.use({ viewport: { width: viewport.width, height: viewport.height } });

    for (const page of PAGES_TO_TEST) {
      test(`${page.name} - full page`, async ({ page: p }) => {
        await p.goto(page.path);
        await p.waitForLoadState('networkidle');

        // Wait for animations to settle
        await p.waitForTimeout(1000);

        // Take full page screenshot
        await expect(p).toHaveScreenshot(`${page.name}-${viewport.name}.png`, {
          fullPage: true,
          maxDiffPixels: 100, // Allow tiny font rendering differences
        });
      });
    }

    for (const component of COMPONENTS_TO_TEST) {
      test(`component: ${component.name}`, async ({ page: p }) => {
        await p.goto('/'); // Or appropriate page
        await p.waitForLoadState('networkidle');

        const element = p.locator(component.selector);
        await expect(element).toBeVisible();

        // Screenshot just the component
        await expect(element).toHaveScreenshot(
          `component-${component.name}-${viewport.name}.png`,
          { maxDiffPixels: 50 }
        );
      });
    }
  });
}
```

**Installation:**
```bash
# No new dependencies needed - Playwright already installed!
# Just need to generate baseline screenshots

# Generate baseline screenshots BEFORE refactoring
npm run test:e2e -- --update-snapshots

# During refactor, run tests to compare
npm run test:e2e
```

### 1.3 Computed Style Snapshot System

Create a system to capture and compare computed CSS values.

```typescript
// e2e/computed-styles.spec.ts
import { test, expect } from '@playwright/test';
import fs from 'fs';
import path from 'path';

interface ComputedStyleSnapshot {
  selector: string;
  styles: Record<string, string>;
  timestamp: string;
}

const CRITICAL_COMPONENTS = [
  {
    selector: '[data-testid="navigation-panel"]',
    name: 'navigation-panel',
    properties: [
      'width', 'height', 'backgroundColor', 'borderColor', 'borderWidth',
      'padding', 'margin', 'position', 'zIndex', 'transition', 'transform'
    ]
  },
  {
    selector: '[data-testid="chat-section"]',
    name: 'chat-section',
    properties: [
      'backgroundColor', 'color', 'fontSize', 'fontFamily', 'lineHeight',
      'padding', 'borderRadius', 'boxShadow'
    ]
  },
  {
    selector: 'button.primary',
    name: 'primary-button',
    properties: [
      'backgroundColor', 'color', 'border', 'borderRadius', 'padding',
      'fontSize', 'fontWeight', 'cursor', 'transition'
    ]
  },
  // Add all critical UI elements
];

test.describe('Computed Style Snapshots', () => {
  test('capture computed styles baseline', async ({ page }) => {
    const snapshots: ComputedStyleSnapshot[] = [];

    await page.goto('/');
    await page.waitForLoadState('networkidle');

    for (const component of CRITICAL_COMPONENTS) {
      const element = page.locator(component.selector).first();

      if (await element.isVisible()) {
        const styles = await element.evaluate((el, props) => {
          const computed = window.getComputedStyle(el);
          const result: Record<string, string> = {};
          props.forEach(prop => {
            result[prop] = computed.getPropertyValue(prop);
          });
          return result;
        }, component.properties);

        snapshots.push({
          selector: component.selector,
          styles,
          timestamp: new Date().toISOString(),
        });
      }
    }

    // Save baseline
    const baselinePath = path.join(__dirname, '../test-results/style-baseline.json');
    fs.mkdirSync(path.dirname(baselinePath), { recursive: true });
    fs.writeFileSync(baselinePath, JSON.stringify(snapshots, null, 2));

    console.log(`✅ Saved baseline with ${snapshots.length} components`);
  });

  test('compare computed styles against baseline', async ({ page }) => {
    const baselinePath = path.join(__dirname, '../test-results/style-baseline.json');

    if (!fs.existsSync(baselinePath)) {
      throw new Error('No baseline found! Run with --update-snapshots first');
    }

    const baseline: ComputedStyleSnapshot[] = JSON.parse(
      fs.readFileSync(baselinePath, 'utf-8')
    );

    await page.goto('/');
    await page.waitForLoadState('networkidle');

    const differences: Array<{
      selector: string;
      property: string;
      baseline: string;
      current: string;
    }> = [];

    for (const baselineComponent of baseline) {
      const element = page.locator(baselineComponent.selector).first();

      if (await element.isVisible()) {
        const currentStyles = await element.evaluate((el, props) => {
          const computed = window.getComputedStyle(el);
          const result: Record<string, string> = {};
          props.forEach(prop => {
            result[prop] = computed.getPropertyValue(prop);
          });
          return result;
        }, Object.keys(baselineComponent.styles));

        // Compare each property
        for (const [property, baselineValue] of Object.entries(baselineComponent.styles)) {
          const currentValue = currentStyles[property];

          // Normalize values for comparison (handle slight differences)
          const normalized = (val: string) => val.trim().replace(/\s+/g, ' ');

          if (normalized(currentValue) !== normalized(baselineValue)) {
            differences.push({
              selector: baselineComponent.selector,
              property,
              baseline: baselineValue,
              current: currentValue,
            });
          }
        }
      }
    }

    if (differences.length > 0) {
      console.error('❌ Style differences detected:');
      differences.forEach(diff => {
        console.error(`  ${diff.selector} > ${diff.property}:`);
        console.error(`    Expected: ${diff.baseline}`);
        console.error(`    Got:      ${diff.current}`);
      });

      throw new Error(`${differences.length} style differences found!`);
    }

    console.log('✅ All styles match baseline!');
  });
});
```

**Usage:**
```bash
# Before refactoring - capture baseline
npm run test:e2e -- computed-styles.spec.ts --update-snapshots

# After each change - verify no differences
npm run test:e2e -- computed-styles.spec.ts
```

### 1.4 Add Data-Testid Attributes

**Action:** Add `data-testid` to all components being refactored

```tsx
// Before
<div className="navigation-panel">...</div>

// After
<div className="navigation-panel" data-testid="navigation-panel">...</div>
```

**Critical Components to Tag:**
- NavigationPanel
- ChatSection
- Hero sections
- Card components
- Buttons (primary, secondary, etc.)
- Form inputs
- All components with hardcoded colors or inline styles

---

## 2. Testing Infrastructure Setup

### 2.1 Install Dependencies (if needed)

```bash
# Already have Playwright - just verify
npm list @playwright/test
# ✅ @playwright/test@1.56.1

# No additional dependencies needed!
```

### 2.2 Test Scripts

Add to `package.json`:

```json
{
  "scripts": {
    "test:visual": "playwright test visual-regression.spec.ts",
    "test:visual:update": "playwright test visual-regression.spec.ts --update-snapshots",
    "test:styles": "playwright test computed-styles.spec.ts",
    "test:styles:baseline": "playwright test computed-styles.spec.ts --update-snapshots",
    "test:refactor": "npm run test:visual && npm run test:styles && npm run test:e2e"
  }
}
```

### 2.3 Create Test Configuration

Update `playwright.config.ts`:

```typescript
export default defineConfig({
  testDir: './e2e',
  // ... existing config ...

  // Add for visual regression
  expect: {
    toHaveScreenshot: {
      maxDiffPixels: 100,  // Allow minor rendering differences
      threshold: 0.2,       // 20% threshold
    },
  },

  // Store screenshots in organized folders
  snapshotDir: './e2e/snapshots',
});
```

---

## 3. Baseline Capture Strategy

### 3.1 Pre-Refactor Baseline Checklist

**Run BEFORE making any changes:**

```bash
# 1. Ensure dev server is running
npm run dev

# 2. Build the project to catch any issues
npm run build

# 3. Capture visual baselines (3 viewports × all pages/components)
npm run test:visual:update

# 4. Capture computed style baselines
npm run test:styles:baseline

# 5. Run existing E2E tests to ensure all pass
npm run test:e2e

# 6. Commit baselines to git
git add e2e/snapshots test-results/style-baseline.json
git commit -m "chore: capture CSS baselines before refactor"
```

### 3.2 Manual Visual Inspection Checklist

Create a visual inspection checklist and take screenshots:

**Pages to inspect:**
- [ ] Homepage (all sections)
- [ ] About page
- [ ] Projects/case studies
- [ ] Individual project pages
- [ ] 404 page
- [ ] Any other custom pages

**Interactive states:**
- [ ] Navigation collapsed (56px)
- [ ] Navigation semi-expanded (320px)
- [ ] Navigation fully expanded (455px)
- [ ] Chat collapsed
- [ ] Chat expanded
- [ ] Chat with messages
- [ ] Hover states on buttons
- [ ] Focus states on inputs
- [ ] Active/clicked states
- [ ] Loading states

**Responsive breakpoints:**
- [ ] Desktop (1920px)
- [ ] Laptop (1440px)
- [ ] Tablet (768px)
- [ ] Mobile (375px)

**Dark mode:**
- [ ] All pages in dark mode
- [ ] All components in dark mode
- [ ] Transitions between modes

### 3.3 Document Current Behavior

Create `docs/css-refactor-expected-behavior.md`:

```markdown
# Expected Visual Behavior - CSS Refactor Reference

## Navigation Panel

### Width States
- Collapsed: 56px
- Semi-expanded: 320px
- Fully expanded: 455px

### Border
- Color: Purple (`rgb(168, 85, 247)`)
- Glow effect: Active
- Clickable width: 12px
- Hover state: Brightens

### Transitions
- Duration: 300ms
- Easing: cubic-bezier(0.4, 0, 0.2, 1)
- Properties: width, transform, opacity

## Chat Section

### Colors
- Background: Dark gradient
- Text: White (#ffffff)
- Assistant messages: Slightly dimmed white
- User messages: Full white

### Typography
- Font family: System font stack (forced via !important - TO FIX)
- Font size: 14px (messages)
- Line height: 1.5

... (document all critical visual elements)
```

---

## 4. Incremental Refactor Workflow

### 4.1 The Golden Rule

**NEVER refactor more than one component at a time.**

Each refactor cycle:
1. Pick ONE component
2. Refactor it
3. Run ALL tests
4. Visual inspection
5. Commit
6. Move to next component

### 4.2 Refactor Cycle Template

```bash
# 1. Create feature branch for this component
git checkout -b refactor/component-name

# 2. Make changes to ONE component only
# ... edit files ...

# 3. Build to catch TypeScript errors
npm run build

# 4. Run visual regression tests
npm run test:visual
# ❌ If fails: Review diff images in test-results/
# ✅ If passes: Continue

# 5. Run computed style tests
npm run test:styles
# ❌ If fails: Check console for which properties changed
# ✅ If passes: Continue

# 6. Run E2E tests
npm run test:e2e
# ❌ If fails: Fix issues
# ✅ If passes: Continue

# 7. Manual testing
npm run dev
# - Open localhost:3000
# - Test all interactive states
# - Test all breakpoints
# - Compare against baseline screenshots

# 8. If everything passes, commit
git add .
git commit -m "refactor(css): remove !important from chatbot.css

- Replaced !important font-family with CSS cascade
- Verified no visual changes via Playwright screenshots
- Verified computed styles match baseline
- All E2E tests passing"

# 9. Merge to refactor/css-architecture-cleanup
git checkout refactor/css-architecture-cleanup
git merge refactor/component-name

# 10. Repeat for next component
```

### 4.3 Priority Order (from analysis)

Refactor in this order to minimize risk:

1. **Remove !important from chatbot.css** (HIGH impact, LOW risk)
   - Isolated to one file
   - Easy to verify
   - Quick win

2. **Extract hardcoded colors to CSS variables** (HIGH impact, MEDIUM risk)
   - Create tokens first
   - Replace one component at a time
   - Verify each replacement

3. **Replace inline styles with CSS variables** (HIGH impact, MEDIUM risk)
   - Extract dynamic values to CSS vars
   - Replace `style={{}}` with classes
   - Test interactive states carefully

4. **Add dark mode variants** (MEDIUM impact, MEDIUM risk)
   - Add `dark:` classes alongside existing
   - Verify both modes look identical
   - Test transitions

5. **Standardize animations** (MEDIUM impact, LOW risk)
   - Extract to utilities
   - Replace duplicates
   - Verify timing is identical

---

## 5. Validation Checkpoints

### 5.1 Automated Validation

Run after EVERY change:

```bash
# Full test suite
npm run test:refactor

# This runs:
# 1. Visual regression (screenshots)
# 2. Computed style comparison
# 3. E2E functional tests
# 4. Build validation
```

### 5.2 Manual Validation Checklist

**Per Component:**

- [ ] Component renders in all viewport sizes
- [ ] All interactive states work (hover, focus, active)
- [ ] Animations timing matches original
- [ ] Colors match original (use browser DevTools color picker)
- [ ] Spacing/padding matches (use DevTools measurement tools)
- [ ] Typography matches (font, size, weight, line-height)
- [ ] Dark mode works (if applicable)
- [ ] No console errors
- [ ] No layout shifts

**Browser DevTools Helpers:**

```javascript
// Compare colors
// Before: Select element, run in console
$0.style.backgroundColor  // "rgb(168, 85, 247)"

// After refactor: Should match exactly
$0.style.backgroundColor  // "rgb(168, 85, 247)"

// Compare computed dimensions
getComputedStyle($0).width    // "455px"
getComputedStyle($0).padding  // "24px"

// Compare transitions
getComputedStyle($0).transition
// "width 300ms cubic-bezier(0.4, 0, 0.2, 1) 0s, transform..."
```

### 5.3 Diff Review Strategy

When visual tests fail:

```bash
# Playwright generates diff images in:
# test-results/
#   visual-regression-spec-ts/
#     homepage-desktop-actual.png
#     homepage-desktop-expected.png
#     homepage-desktop-diff.png  ← Review this!

# Open all diffs
open test-results/**/*-diff.png
```

**Acceptable differences:**
- Font rendering (< 5 pixels difference)
- Anti-aliasing variations
- Browser-specific rendering quirks

**Unacceptable differences:**
- Color changes
- Size changes
- Spacing changes
- Missing elements
- Layout shifts

---

## 6. Rollback Strategy

### 6.1 Git Rollback Commands

```bash
# Rollback last commit (keep changes)
git reset --soft HEAD~1

# Rollback last commit (discard changes)
git reset --hard HEAD~1

# Rollback to specific component refactor
git log --oneline  # Find commit hash
git reset --hard <commit-hash>

# Create rollback branch for testing
git checkout -b rollback/test-previous-state
git reset --hard <commit-hash>
```

### 6.2 Component-Level Rollback

If one component breaks:

```bash
# Revert just the component files
git checkout HEAD~1 -- src/components/ComponentName.tsx
git checkout HEAD~1 -- src/components/ComponentName.css

# Commit the reversion
git commit -m "revert: rollback ComponentName refactor due to visual regression"
```

### 6.3 Emergency Rollback

If production breaks:

```bash
# Revert entire refactor branch
git checkout main
git revert <refactor-branch-merge-commit>
git push

# Or force rollback (if not merged to production)
git checkout main
git reset --hard <last-good-commit>
git push --force  # ONLY if not in production!
```

---

## 7. Component-by-Component Plan

### Phase 1: Remove !important (2-4 hours)

**File:** `/src/components/chatbot/chatbot.css`

**Goal:** Remove all 24 `!important` declarations

**Strategy:**
```css
/* Before */
.chatbot-message {
  font-family: 'Inter', sans-serif !important;
}

/* After - Use CSS cascade properly */
.chatbot-message {
  font-family: var(--font-family-base);  /* Defined in globals.css */
}

/* Ensure parent doesn't override */
.chatbot-container * {
  /* Remove any conflicting rules */
}
```

**Tests:**
1. Screenshot comparison of chat messages
2. Verify font-family computed value matches
3. Test all message types (user, assistant, error)

**Rollback:**
```bash
git checkout HEAD~1 -- src/components/chatbot/chatbot.css
```

---

### Phase 2: Extract Hardcoded Colors (2-3 days)

**Components:** NavigationPanel, ChatSection, WarmDepth, etc.

**Step 1:** Create color token system

```css
/* src/app/globals.css - ADD */
:root {
  /* Existing tokens... */

  /* New semantic tokens from hardcoded values */
  --color-accent-purple: 168 85 247;  /* rgb(168, 85, 247) */
  --color-accent-orange: 234 88 12;   /* #ea580c */
  --color-warning-bg: 254 243 199;    /* #fef3c7 */

  /* Navigation-specific */
  --nav-border-color: hsl(var(--color-accent-purple));
  --nav-bg: hsl(var(--color-background));

  /* Chat-specific */
  --chat-bg: hsl(var(--color-background));
  --chat-text: hsl(var(--color-foreground));
}
```

**Step 2:** Replace one component at a time

```tsx
// NavigationPanel.tsx - BEFORE
<div style={{ borderColor: 'rgb(168, 85, 247)' }}>

// NavigationPanel.tsx - AFTER
<div className="border-[var(--nav-border-color)]">

// Or use Tailwind config
<div className="border-accent-purple">
```

**Update tailwind.config.ts:**

```typescript
export default {
  theme: {
    extend: {
      colors: {
        'accent-purple': 'rgb(var(--color-accent-purple))',
        'accent-orange': 'rgb(var(--color-accent-orange))',
        // ... more semantic colors
      }
    }
  }
}
```

**Per-Component Test:**
```bash
# After refactoring NavigationPanel
npm run test:visual -- --grep "navigation"
npm run test:styles

# Manual check
# 1. Open DevTools
# 2. Select navigation border
# 3. Verify color: rgb(168, 85, 247)
# 4. Test hover state
# 5. Test focus state
```

**Rollback if needed:**
```bash
git checkout HEAD~1 -- src/components/NavigationPanel.tsx
```

---

### Phase 3: Replace Inline Styles (1-2 days)

**Goal:** Move `style={{}}` to CSS classes or CSS variables

**Example: Dynamic Widths**

```tsx
// BEFORE
<div style={{ width: `${width}px`, transition: '300ms cubic-bezier(0.4, 0, 0.2, 1)' }}>

// AFTER - Use CSS variables
<div
  className="nav-panel"
  style={{ '--nav-width': `${width}px` } as React.CSSProperties}
>

/* CSS */
.nav-panel {
  width: var(--nav-width);
  transition: width 300ms cubic-bezier(0.4, 0, 0.2, 1);
}
```

**Example: Repeated Transitions**

```css
/* globals.css - ADD */
:root {
  --transition-standard: 300ms cubic-bezier(0.4, 0, 0.2, 1);
  --transition-slow: 400ms cubic-bezier(0.4, 0, 0.2, 1);
}

/* Utility class */
.transition-standard {
  transition: all var(--transition-standard);
}
```

```tsx
// BEFORE (repeated in 3+ components)
<div style={{ transition: '300ms cubic-bezier(0.4, 0, 0.2, 1)' }}>

// AFTER
<div className="transition-standard">
```

**Tests:**
1. Verify transition timing with DevTools Performance panel
2. Test resize animations
3. Verify transforms still work

---

### Phase 4: Add Dark Mode Variants (2-3 days)

**Goal:** Add `dark:` variants to all hardcoded colors

**Strategy:**

```tsx
// BEFORE (dark mode only)
<div className="bg-gray-900 text-white">

// AFTER (both modes)
<div className="bg-white dark:bg-gray-900 text-gray-900 dark:text-white">
```

**Test in Both Modes:**

```bash
# Run visual tests in both themes
# Update playwright config:

test.describe('Light mode', () => {
  test.use({ colorScheme: 'light' });
  // ... run all tests
});

test.describe('Dark mode', () => {
  test.use({ colorScheme: 'dark' });
  // ... run all tests
});
```

**Manual Testing:**
1. Toggle theme in UI
2. Verify no flash of wrong colors
3. Verify smooth transitions
4. Check all components in both modes

---

## 8. Success Criteria

### Refactor is complete when:

- [ ] All `!important` declarations removed
- [ ] All hardcoded colors replaced with tokens
- [ ] All inline styles replaced (or justified)
- [ ] All dark mode variants added
- [ ] All visual regression tests pass
- [ ] All computed style tests pass
- [ ] All E2E tests pass
- [ ] Manual testing in 4 viewports passes
- [ ] No console errors
- [ ] Build succeeds with no warnings
- [ ] Documentation updated

### Verification Command

```bash
# Run before declaring victory
npm run build && npm run test:refactor && echo "✅ REFACTOR COMPLETE!"
```

---

## 9. Post-Refactor Cleanup

### 9.1 Remove Unused CSS

```bash
# Find unused CSS (optional - use PurgeCSS or similar)
npm install -D purgecss
npx purgecss --css 'src/**/*.css' --content 'src/**/*.tsx'
```

### 9.2 Update Documentation

- [ ] Update CLAUDE.md with new CSS guidelines
- [ ] Document new token system
- [ ] Create style guide for future development
- [ ] Archive old analysis docs

### 9.3 Merge to Main

```bash
# Final checks
git checkout refactor/css-architecture-cleanup
npm run build
npm run test:refactor

# Merge to main
git checkout main
git merge refactor/css-architecture-cleanup
git push

# Tag the release
git tag -a css-refactor-v1 -m "CSS architecture refactor complete"
git push --tags
```

---

## 10. Quick Reference Commands

```bash
# Before starting any refactor
npm run test:visual:update
npm run test:styles:baseline
git commit -m "chore: CSS baselines"

# After each component refactor
npm run build
npm run test:refactor

# If tests fail
open test-results/**/*-diff.png  # Review visual diffs

# Manual testing
npm run dev
# → Test in browser, compare to baseline

# Rollback if needed
git reset --hard HEAD~1

# Final merge
npm run build && npm run test:refactor && git push
```

---

## Conclusion

This plan ensures zero visual regressions by:

1. **Capturing baselines** before any changes
2. **Automated screenshot comparison** catches pixel-level differences
3. **Computed style validation** catches CSS property changes
4. **Incremental refactoring** isolates problems to single components
5. **Easy rollback** via git commits per component
6. **Manual verification** as final safety check

**Estimated Total Time:** 1-2 weeks (working incrementally)

**Risk Level:** LOW (with this plan)
**Impact:** HIGH (maintainable CSS forever)

---

**Next Steps:**
1. Review this plan with stakeholders
2. Set up visual regression tests
3. Capture baselines
4. Start with Phase 1 (!important removal)
5. Proceed incrementally, validating each step

**Questions?** Review the [CSS Architecture Analysis](./css-architecture-analysis-2025-11-01.md) for context on why these changes are needed.
