# Plan: Restore Sunset Theme Updating

**Date:** 2025-12-02
**Tags:** theming, sunset, performance, time-based

## Objective

Restore real-time theme updating (orange → purple at sunset) while keeping SunCalc server-side only for performance.

## Background

Commit `7465530` (Dec 1, 2025) improved Lighthouse score from 62 to 93 by removing SunCalc from the client bundle (-121KB). However, this broke the real-time theme updating:

- **Before:** Theme updated every 5 minutes via interval
- **After:** Theme only calculated on page load, never updates while page is open

The performance gains are worth keeping, but we need a lightweight way to check if sunset has passed.

## Requirements

### Must Have
- Theme updates from orange to purple when sunset occurs (while page is open)
- Keep SunCalc server-side only (maintain -121KB bundle savings)
- No hydration mismatches

### Nice to Have
- Minimal additional client-side code
- Efficient interval (not too frequent)

## Approach

### Option A: Pass Sunset Time from Server (Recommended)

1. Server calculates sunset time in `layout.tsx`
2. Pass sunset time to client via data attribute on `<html>`
3. Client reads sunset time and sets interval to check against current time
4. No SunCalc needed on client - just a simple `Date` comparison

**Implementation:**

```tsx
// layout.tsx - add data attribute
<html
  data-sunset={times.sunset.toISOString()}
  data-sunrise={times.sunrise.toISOString()}
  ...
>

// TimeThemeProvider.tsx - read and check
useEffect(() => {
  const sunsetStr = document.documentElement.dataset.sunset;
  const sunset = sunsetStr ? new Date(sunsetStr) : null;

  if (!sunset) return;

  const checkTheme = () => {
    const now = new Date();
    const shouldBeDayTime = now < sunset;
    // Update if needed
  };

  const interval = setInterval(checkTheme, 60 * 1000); // Check every minute
  return () => clearInterval(interval);
}, []);
```

### Option B: Hardcoded Check Times

Calculate approximate sunset for Portland and check every few minutes. Less accurate but simpler.

## Risks & Mitigations

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| Hydration mismatch | Low | Med | Server and client read same data attribute |
| Stale sunset time after midnight | Low | Low | Sunrise/sunset only change by ~1 min/day |
| Extra client code | Low | Low | Just Date comparison, no library |

## Success Criteria

- [ ] Theme changes from orange to purple when sunset passes (while on page)
- [ ] Bundle size stays at -121KB (no SunCalc on client)
- [ ] No hydration errors
- [ ] Lighthouse score stays at 90+

## Open Questions

- How often should we check? Every 1 min? 5 min?
- Should we also update at sunrise (purple → orange)?

## Related Research

- `/docs/research/RESEARCH_2025-12-01_lighthouse-performance-optimization.md` - Original performance research
- Commit `7465530` - The breaking change
