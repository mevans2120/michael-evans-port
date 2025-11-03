# Time-Based Theme Refactoring Plan

**Date:** November 2, 2025
**Issue:** Deep recursion error during navigation caused by multiple intervals and state updates
**Status:** Ready for implementation

---

## Problem Statement

### Current Architecture Issues

The `useTimeBasedTheme` hook is currently called by 4 different components:
1. `Footer.tsx`
2. `time-theme-toggle.tsx`
3. `FaviconGenerator.tsx`
4. `TimeThemeProvider.tsx`

**Each hook call creates:**
- 1 interval running every 60 seconds (checking sunrise/sunset)
- 1 SunCalc calculation per interval tick
- 1 listener registration in global Set
- State updates that trigger component re-renders

**This results in:**
- **4 intervals** running simultaneously (every minute)
- **4 SunCalc calculations** every minute (unnecessary)
- **4 state updates** cascading through components
- **Global listener Set** growing with component mounts
- **Deep recursion error** when React tries to unmount all these on navigation

### Error Details

```
Uncaught TypeError: Cannot read properties of null (reading 'removeChild')
  at commitDeletionEffectsOnFiber (react-dom-client.development.js:13324)
  at recursivelyTraverseDeletionEffects (react-dom-client.development.js:13204)
  ...
```

React is trying to clean up a deeply nested tree of effects, intervals, and listeners during navigation transitions.

---

## Solution Architecture

### Single Source of Truth Pattern

**Core Principle:** ONE provider manages all time-based theme state and intervals. All components consume from this single source via context.

```
┌─────────────────────────────────┐
│   TimeThemeProvider             │
│   - ONE interval (every 5 min)  │
│   - ONE SunCalc calculation      │
│   - Manages all state            │
│   - Exposes via Context          │
└─────────────────────────────────┘
              │
              │ Context
              ▼
    ┌─────────────────────┐
    │  useTimeBasedTheme  │
    │  (context consumer) │
    │  - No effects       │
    │  - No intervals     │
    │  - No state         │
    └─────────────────────┘
              │
      ┌───────┼───────┬───────┐
      ▼       ▼       ▼       ▼
   Footer  Toggle  Favicon  (etc)
```

---

## Implementation Plan

### Phase 1: Refactor TimeThemeProvider ✅

**File:** `/src/components/providers/TimeThemeProvider.tsx`

**Changes:**
1. Add state management for:
   - `sunrise: Date | null`
   - `sunset: Date | null`
   - `autoTheme: 'day' | 'evening'`
   - `manualOverride: TimeTheme | null`

2. Add single interval:
   - Run every 5 minutes (not every minute)
   - Calculate sunrise/sunset using SunCalc
   - Only update state if values actually changed
   - Clean up on unmount

3. Provide all values via context

**Code structure:**
```tsx
export function TimeThemeProvider({ children }) {
  const [sunrise, setSunrise] = useState<Date | null>(null);
  const [sunset, setSunset] = useState<Date | null>(null);
  const [autoTheme, setAutoTheme] = useState<TimeTheme>('evening');
  const [manualOverride, setManualOverride] = useState<TimeTheme | null>(null);

  useEffect(() => {
    const updateTheme = () => {
      const now = new Date();
      const times = SunCalc.getTimes(now, PORTLAND_LAT, PORTLAND_LON);

      // Only update if changed (avoid unnecessary re-renders)
      if (times.sunrise.getTime() !== sunrise?.getTime()) {
        setSunrise(times.sunrise);
      }
      if (times.sunset.getTime() !== sunset?.getTime()) {
        setSunset(times.sunset);
      }

      const isDayTime = now >= times.sunrise && now < times.sunset;
      setAutoTheme(isDayTime ? 'day' : 'evening');
    };

    updateTheme();
    const interval = setInterval(updateTheme, 5 * 60 * 1000); // 5 minutes
    return () => clearInterval(interval);
  }, []);

  // Context value
  const value = {
    theme: manualOverride ?? autoTheme,
    sunrise,
    sunset,
    isDayTime: (manualOverride ?? autoTheme) === 'day',
    isEveningTime: (manualOverride ?? autoTheme) === 'evening',
    isManualOverride: manualOverride !== null,
    setManualOverride,
  };

  return (
    <TimeThemeContext.Provider value={value}>
      {children}
    </TimeThemeContext.Provider>
  );
}
```

---

### Phase 2: Simplify useTimeBasedTheme Hook ✅

**File:** `/src/hooks/useTimeBasedTheme.ts`

**Changes:**
1. Remove all `useState` hooks
2. Remove all `useEffect` hooks
3. Remove global listener pattern (`listeners` Set)
4. Convert to simple context consumer

**Before (complex):**
```tsx
export function useTimeBasedTheme(): TimeBasedTheme {
  const [autoTheme, setAutoTheme] = useState<TimeTheme>('evening');
  const [sunrise, setSunrise] = useState<Date | null>(null);
  const [sunset, setSunset] = useState<Date | null>(null);

  useEffect(() => {
    // Interval logic...
  }, []);

  useEffect(() => {
    // Listener logic...
  }, []);

  // ...
}
```

**After (simple):**
```tsx
export function useTimeBasedTheme(): TimeBasedTheme {
  const context = useContext(TimeThemeContext);

  if (!context) {
    throw new Error('useTimeBasedTheme must be used within TimeThemeProvider');
  }

  return context;
}
```

**Benefits:**
- No side effects
- No memory leaks
- No cleanup needed
- Fast and predictable

---

### Phase 3: Update Footer Component ✅

**File:** `/src/components/Footer.tsx`

**Changes:**
1. Keep the simple interval for clock ticking (this is fine - it's local to Footer)
2. Use `useTimeBasedTheme()` to get sunrise/sunset (now from context)
3. No changes needed to theme toggle logic

**Current code is correct:**
```tsx
const { theme, setManualOverride, sunrise, sunset } = useTimeBasedTheme();

useEffect(() => {
  const updateTime = () => {
    const portlandTime = new Date().toLocaleTimeString('en-US', {
      timeZone: 'America/Los_Angeles',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
    setCurrentTime(portlandTime);
  };

  updateTime();
  const interval = setInterval(updateTime, 60000);
  return () => clearInterval(interval);
}, []); // Empty deps - this is fine
```

**Note:** Footer's clock interval is **local and isolated** - it only updates the time display, doesn't affect global state. This is acceptable.

---

### Phase 4: Verify Other Components ✅

**Files to check:**
1. `/src/components/ui/time-theme-toggle.tsx` - Should work as-is
2. `/src/components/FaviconGenerator.tsx` - Should work as-is

Both components just read from `useTimeBasedTheme()`, so once the hook becomes a context consumer, they automatically benefit from the optimization.

**No changes needed** unless there are component-specific issues.

---

### Phase 5: Optimize Interval Frequency ✅

**Current:** Checking every 60 seconds
**Proposed:** Checking every 5 minutes (300 seconds)

**Rationale:**
- Sunrise/sunset times change **once per day**
- Checking every minute is excessive
- Checking every 5 minutes is still responsive enough
- Could even check every 15 minutes or hourly

**Implementation:**
```tsx
const interval = setInterval(updateTheme, 5 * 60 * 1000); // 5 minutes
```

**Alternative approaches:**
- Calculate next sunrise/sunset and schedule check only when needed
- Check only on the hour (reduces checks to 24/day)
- Use a Web Worker for background calculations (advanced)

**Recommendation:** Start with 5 minutes, can optimize further later.

---

## Testing Plan

### Test Cases

1. **Navigation Test**
   - Navigate between Home → About → Case Studies → AI Showcase
   - Verify no console errors
   - Verify no "Cannot read properties of null" error
   - Performance: Should be smooth with no lag

2. **Theme Toggle Test**
   - Click the "day/night" button in footer
   - Verify theme changes correctly
   - Verify all components reflect the change
   - Verify toggle state persists

3. **Clock Test**
   - Verify footer shows current Portland time
   - Wait 1 minute, verify time updates
   - Verify format is correct (e.g., "9:45 PM")

4. **Day/Night Calculation Test**
   - Check footer at different times of day
   - Verify "day" shows during daylight hours
   - Verify "night" shows after sunset
   - Test edge cases (sunrise, sunset transitions)

5. **Multi-Component Test**
   - Verify Footer, TimeThemeToggle, and FaviconGenerator all show consistent state
   - Change theme via toggle, verify all update
   - No duplicate intervals or calculations

### Performance Metrics

**Before refactor:**
- 4 intervals × 60 checks/hour = 240 operations/hour
- 4 SunCalc calculations per check = 960 calculations/hour

**After refactor:**
- 1 interval × 12 checks/hour (every 5 min) = 12 operations/hour
- 1 SunCalc calculation per check = 12 calculations/hour

**Improvement:** 98% reduction in calculations

---

## Implementation Order

1. ✅ **Read and understand current code**
   - Review TimeThemeProvider
   - Review useTimeBasedTheme hook
   - Review consuming components

2. **Create context in TimeThemeProvider**
   - Define TimeThemeContext
   - Add state management
   - Add single interval
   - Provide context

3. **Simplify useTimeBasedTheme hook**
   - Remove all effects
   - Remove all state
   - Convert to context consumer
   - Keep TypeScript interface

4. **Test incrementally**
   - Test after each file change
   - Verify no TypeScript errors
   - Verify app still runs
   - Check console for errors

5. **Final verification**
   - Navigate between all pages
   - Toggle theme
   - Verify time display
   - Check browser DevTools Performance tab

---

## Success Criteria

✅ Navigation works without errors
✅ No "Cannot read properties of null" errors
✅ Theme toggle works correctly
✅ Time display updates every minute
✅ Day/night calculation is accurate
✅ Only ONE interval running globally (plus Footer's local clock)
✅ Performance improvement visible in DevTools
✅ Code is simpler and more maintainable

---

## Rollback Plan

If refactor causes issues:

1. **Git revert** to previous commit
2. Alternative: Keep multiple intervals but add proper cleanup
3. Alternative: Disable time-based theme temporarily
4. **Document** what went wrong for future attempts

**Files to backup before refactor:**
- `/src/components/providers/TimeThemeProvider.tsx`
- `/src/hooks/useTimeBasedTheme.ts`
- `/src/components/Footer.tsx`

---

## Additional Notes

### Why this error happened

The error was introduced when we added:
1. Footer integration with time-based theme
2. Time display with interval
3. Multiple components using the same hook

Each component created its own interval, and when React tried to unmount them all during navigation (especially with React 19's concurrent rendering), the cleanup effects created a deeply nested recursion.

### Why the fix works

By centralizing state and intervals in a provider:
- Only ONE cleanup happens (predictable)
- No cascading effects
- React can efficiently unmount the provider
- Components become pure consumers (no cleanup needed)

### Future optimizations

- Memoize context value to prevent unnecessary re-renders
- Use `useMemo` for derived values (isDayTime, isEveningTime)
- Consider using `useReducer` for complex state management
- Add error boundaries around time-based features

---

## References

- [React Context Best Practices](https://react.dev/learn/passing-data-deeply-with-context)
- [useEffect Cleanup Functions](https://react.dev/reference/react/useEffect#cleanup-function)
- [SunCalc Documentation](https://github.com/mourner/suncalc)
- [React 19 Concurrent Rendering](https://react.dev/blog/2024/04/25/react-19)

---

**Status:** Ready for implementation
**Estimated Time:** 30-45 minutes
**Risk Level:** Low (can easily revert if needed)
**Priority:** High (blocking navigation)
