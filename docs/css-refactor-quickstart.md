# CSS Refactor Quick Start Guide

**Created:** 2025-11-01
**Purpose:** Quick reference for running visual regression tests during CSS refactoring

---

## Prerequisites

✅ Visual regression tests are now set up!
✅ Playwright is installed
✅ Test scripts added to package.json
✅ data-testid attributes added to critical components

---

## Step 1: Capture Baselines (BEFORE Refactoring)

**Run this BEFORE making any CSS changes:**

```bash
# Start dev server
npm run dev

# In another terminal, capture visual baselines
npm run test:visual:update

# Capture computed style baselines
npm run test:styles:baseline
```

This will:
- Take screenshots of all pages and components (3 viewports each)
- Capture CSS property values for critical components
- Store baselines in `e2e/snapshots/` and `test-results/style-baseline.json`

**Commit the baselines:**
```bash
git add e2e/snapshots test-results/style-baseline.json
git commit -m "chore: capture CSS baselines before refactor"
```

---

## Step 2: Make CSS Changes

Edit ONE component at a time. For example:

```bash
# Start with the easiest fix
# Edit: src/components/chatbot/chatbot.css
# Remove !important declarations
```

---

## Step 3: Validate Changes

After each component refactor:

```bash
# 1. Build to catch TypeScript errors
npm run build

# 2. Run visual regression tests
npm run test:visual

# 3. Run computed style tests
npm run test:styles

# 4. Run existing E2E tests
npm run test:e2e

# OR run all at once:
npm run test:refactor
```

### If tests PASS ✅

```bash
# Commit the changes
git add .
git commit -m "refactor(css): remove !important from chatbot.css

- Replaced !important declarations with proper cascade
- Verified no visual changes via screenshots
- All computed styles match baseline"
```

### If tests FAIL ❌

**Visual regression failed:**
```bash
# Review the diff images
open test-results/**/*-diff.png

# Red pixels show differences
# Decide: Is this acceptable or a bug?

# If acceptable (font rendering difference):
npm run test:visual:update  # Update baseline

# If bug:
# Fix the CSS and re-run tests
```

**Computed styles failed:**
```bash
# Check console output - it shows which properties changed
npm run test:styles

# Example output:
# ❌ navigation-panel > border-color:
#    Expected: rgb(168, 85, 247)
#    Got:      rgb(200, 100, 255)

# Fix the issue and re-run
```

---

## Step 4: Repeat for Next Component

Continue with the next component in priority order:

1. ✅ chatbot.css - Remove !important
2. ⏳ NavigationPanel - Extract hardcoded colors
3. ⏳ ChatSection - Extract hardcoded colors
4. ⏳ Replace inline styles
5. ⏳ Add dark mode variants

---

## Quick Command Reference

```bash
# Capture new baselines
npm run test:visual:update
npm run test:styles:baseline

# Run validation tests
npm run test:visual         # Screenshots
npm run test:styles          # CSS properties
npm run test:e2e            # Functional tests
npm run test:refactor       # All of the above + build

# Review visual diffs
open test-results/**/*-diff.png

# Rollback last commit if needed
git reset --hard HEAD~1
```

---

## Test Files Created

- ✅ `e2e/visual-regression.spec.ts` - Screenshot comparisons
- ✅ `e2e/computed-styles.spec.ts` - CSS property validations

## Components Tagged

- ✅ `NavigationPanel` → `data-testid="navigation-panel"`
- ✅ `ChatSection` → `data-testid="chat-section"`
- ✅ `Hero section` → `data-testid="hero"`

## What Gets Tested

**Visual regression:**
- Full pages (desktop, tablet, mobile)
- Individual components
- Interactive states (hover, focus, expanded/collapsed)
- Dark mode

**Computed styles:**
- Navigation panel (width, colors, borders, transitions)
- Chat section (fonts, colors, spacing)
- Buttons (all states)
- Inputs (focus states)

**Interactive states:**
- Navigation collapsed (56px)
- Navigation expanded (320px / 455px)
- Chat expanded vs collapsed
- Button hover states
- Input focus states

---

## Troubleshooting

### "No baseline found" error

**Solution:** Run baseline commands first:
```bash
npm run test:visual:update
npm run test:styles:baseline
```

### Tests failing due to font rendering

**This is normal!** Different systems render fonts slightly differently.

**Solution:** If differences are < 10 pixels and only in text:
```bash
npm run test:visual:update  # Accept the new baseline
```

### Component not found in tests

**Example:** `Component navigation-panel not found - needs data-testid attribute`

**Solution:** Add `data-testid` to the component:
```tsx
<div data-testid="navigation-panel" className="...">
```

### Dev server not running

**All tests need the dev server running:**
```bash
# Terminal 1: Keep this running
npm run dev

# Terminal 2: Run tests
npm run test:visual
```

---

## Success Criteria

Before merging refactor to main:

- [ ] All `test:visual` tests pass
- [ ] All `test:styles` tests pass
- [ ] All `test:e2e` tests pass
- [ ] `npm run build` succeeds
- [ ] Manual testing in browser looks identical

---

## Next Steps

1. **Read the full plan:** `docs/css-refactor-safety-plan.md`
2. **Capture baselines** (Step 1 above)
3. **Start with Phase 1:** Remove !important from chatbot.css
4. **Validate** after each change
5. **Commit** incrementally

---

## Help

- Full safety plan: `docs/css-refactor-safety-plan.md`
- CSS analysis: `docs/css-architecture-analysis-2025-11-01.md`
- Questions? Review the safety plan or ask!
