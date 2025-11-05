# Case Study Rollover Analysis

**Date**: November 5, 2025
**Current State**: Multiple competing animations making rollovers too prominent

## Current Hover Effects

1. **Padding shift**: 32px left (pl-8)
2. **Accent bar grows**: 0 → 120px height
3. **Title color**: foreground → accent purple
4. **Metric opacity**: 60% → 100%
5. **Description expands**: hidden → visible with max-height

**Problem**: Too many visual changes happening simultaneously creates a "loud" interaction that feels aggressive rather than elegant.

---

## Options for More Subtle Rollovers

### Option 1: Remove Layout Shift (RECOMMENDED)
**Keep**: Accent bar, description expansion
**Remove**: Padding shift, title color change
**Adjust**: Reduce metric opacity change (85% → 100%)

**Why it works**:
- No layout reflow (better performance)
- Progressive disclosure still works (description expands)
- Accent bar provides subtle visual feedback
- Follows best practice: avoid animations that cause layout shifts

**Best Practice Alignment**: ✅ Excellent
- No layout thrashing
- Respects reduced motion preferences
- Clear affordance without being aggressive

---

### Option 2: Opacity/Scale Only (Very Subtle)
**Replace everything with**: Subtle opacity change on entire card (100% → 95%)

**Why it works**:
- Minimalist approach
- Extremely subtle feedback
- Zero layout shift
- Very performant

**Best Practice Alignment**: ✅ Good
- Common pattern on modern portfolio sites
- Gentle, sophisticated
- May be TOO subtle (less clear that it's interactive)

---

### Option 3: Description Only (Progressive Disclosure Focus)
**Keep**: Description expansion
**Remove**: All other visual changes

**Why it works**:
- Single, clear purpose: reveal more information
- No visual "noise"
- Clean, editorial feel

**Best Practice Alignment**: ✅ Good
- Follows progressive disclosure pattern
- Common on editorial/magazine sites
- May need underline or subtle indicator that card is clickable

---

### Option 4: Accent Bar Only (Minimal Indicator)
**Keep**: Small accent bar (0 → 40px, not 120px)
**Remove**: Everything else
**Add**: Subtle description fade-in (no expansion, just opacity)

**Why it works**:
- Tiny visual acknowledgment
- Description appears without layout shift
- Very refined, high-end aesthetic

**Best Practice Alignment**: ✅ Excellent
- Minimal motion
- Clear feedback
- Sophisticated

---

## Best Practice Review

### Current Approach Issues:
1. ❌ **Layout shifts** (padding animation) cause reflow
2. ❌ **Too many simultaneous changes** (cognitive overload)
3. ❌ **Aggressive color change** (title → accent) feels heavy-handed
4. ⚠️ **Max-height animation** works but is performance-intensive

### Industry Best Practices:
1. ✅ **Subtle over dramatic**: Premium sites use minimal feedback
2. ✅ **Avoid layout shifts**: Transform/opacity animations only
3. ✅ **Single clear signal**: One primary indicator (not 5)
4. ✅ **Respect motion preferences**: Gentle animations that can be disabled

### Examples in the Wild:
- **Apple**: Subtle opacity changes, no layout shifts
- **Stripe**: Small underline grows, minimal color shift
- **Linear**: Tiny glow effect, no movement
- **Arc Browser**: Slight background color change only

---

## Recommendation: Hybrid Approach

**Remove**:
- Padding shift (biggest offender)
- Title color change to purple (too aggressive)

**Keep**:
- Small accent bar (reduce to 60px from 120px)
- Description expansion (it's useful)
- Metric opacity (reduce to 90% → 100%)

**Add**:
- Very subtle background tint on hover (`bg-accent/[0.02]`)
- Small underline under title that grows on hover

**Result**: Elegant, sophisticated, clear affordance without being "loud"

---

## Should We Revise Animation Approach App-Wide?

### Current State:
- We have standardized durations (400ms) ✅
- We use specific property transitions (not transition-all) ✅
- We use semantic timing variables ✅

### Issues to Address:
1. **Progressive disclosure overused**: Not every component needs expanding content
2. **Layout shift animations**: Should be avoided unless essential
3. **Color changes for feedback**: Often too prominent

### Recommended System-Wide Changes:

**Tier 1 - High Priority (Do These)**:
1. Replace layout-shifting animations with transform-based ones
2. Reduce color contrast on hover states (use lighter accent variants)
3. Add `@media (prefers-reduced-motion)` handling for all animations

**Tier 2 - Medium Priority (Consider)**:
1. Create utility classes for subtle hover states (`.hover-subtle`, `.hover-lift`)
2. Document animation guidelines in CLAUDE.md
3. Audit other components for similar issues

**Tier 3 - Low Priority (Nice to Have)**:
1. Add Framer Motion for complex animations that need orchestration
2. Create a motion design token system
3. Add animation performance monitoring

---

## Next Steps

1. **Decide on approach** (I recommend Option 1 or Hybrid)
2. **Implement changes** to FeaturedCaseStudies
3. **Test and iterate** on subtlety
4. **Document pattern** for future components
5. **(Optional)** Apply learnings to other interactive components

---

## Performance Note

The current approach is actually performant (we fixed the transition-all issues). The problem is **aesthetic**, not technical. The animations are smooth, they're just too prominent for the sophisticated feel you're going for.
