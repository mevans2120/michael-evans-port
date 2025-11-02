# Time-Based Color Theme Plan

**Goal**: Automatically switch accent color from yellow-orange (day) to purple (evening) based on Pacific time, using Tailwind design tokens.

**Status**: Planning
**Date**: November 2, 2025

---

## Overview

Since we just completed the design token migration (126 instances → `accent` tokens), we can now change the entire site's color by updating CSS variables. This plan adds time-based dynamic switching.

---

## Time Definitions

**Day Mode** (Yellow-Orange):
- **Time**: 6:00 AM - 6:00 PM Pacific
- **Color**: Orange/amber tones

**Evening Mode** (Purple):
- **Time**: 6:00 PM - 6:00 AM Pacific
- **Color**: Current purple (270° 80% 60%)

---

## Technical Approach

### 1. Color Palette Selection

**Day Colors (Yellow-Orange):**
```css
/* Option A: Warm Orange */
--accent: 25 95% 53%;        /* #FF6B00-ish - vibrant orange */
--accent-light: 30 100% 60%; /* Lighter warm orange */
--accent-foreground: 0 0% 100%; /* White text on orange */

/* Option B: Amber/Gold */
--accent: 38 92% 50%;        /* #F59E0B-ish - amber-500 */
--accent-light: 43 96% 56%;  /* amber-400 */
--accent-foreground: 0 0% 100%;

/* Option C: Sunset Orange */
--accent: 20 90% 55%;        /* Coral-orange */
--accent-light: 25 95% 60%;
--accent-foreground: 0 0% 100%;
```

**Evening Colors (Purple):**
```css
/* Current purple - keep as-is */
--accent: 270 80% 60%;
--accent-light: 270 70% 70%;
--accent-foreground: 0 0% 100%;
```

### 2. Time Detection Hook

Create `/src/hooks/useTimeBasedTheme.ts`:

```typescript
import { useState, useEffect } from 'react';

type TimeTheme = 'day' | 'evening';

interface TimeBasedTheme {
  theme: TimeTheme;
  isDayTime: boolean;
  isEveningTime: boolean;
  pacificTime: Date;
}

export function useTimeBasedTheme(): TimeBasedTheme {
  const [theme, setTheme] = useState<TimeTheme>('evening');
  const [pacificTime, setPacificTime] = useState(new Date());

  useEffect(() => {
    const updateTheme = () => {
      // Get current time in Pacific timezone
      const now = new Date();
      const pacific = new Date(
        now.toLocaleString('en-US', { timeZone: 'America/Los_Angeles' })
      );

      const hours = pacific.getHours();

      // Day: 6am - 6pm Pacific
      const isDayTime = hours >= 6 && hours < 18;

      setTheme(isDayTime ? 'day' : 'evening');
      setPacificTime(pacific);
    };

    // Initial update
    updateTheme();

    // Update every minute
    const interval = setInterval(updateTheme, 60000);

    return () => clearInterval(interval);
  }, []);

  return {
    theme,
    isDayTime: theme === 'day',
    isEveningTime: theme === 'evening',
    pacificTime,
  };
}
```

### 3. Theme Provider Component

Create `/src/components/providers/TimeThemeProvider.tsx`:

```typescript
'use client';

import { useEffect } from 'react';
import { useTimeBasedTheme } from '@/hooks/useTimeBasedTheme';

const DAY_COLORS = {
  accent: '25 95% 53%',        // Warm orange
  accentLight: '30 100% 60%',
  accentForeground: '0 0% 100%',
};

const EVENING_COLORS = {
  accent: '270 80% 60%',       // Purple
  accentLight: '270 70% 70%',
  accentForeground: '0 0% 100%',
};

export function TimeThemeProvider({ children }: { children: React.ReactNode }) {
  const { theme } = useTimeBasedTheme();

  useEffect(() => {
    const colors = theme === 'day' ? DAY_COLORS : EVENING_COLORS;

    // Update CSS variables
    document.documentElement.style.setProperty('--accent', colors.accent);
    document.documentElement.style.setProperty('--accent-light', colors.accentLight);
    document.documentElement.style.setProperty('--accent-foreground', colors.accentForeground);
  }, [theme]);

  return <>{children}</>;
}
```

### 4. Integration with Root Layout

Update `/src/app/layout.tsx`:

```typescript
import { TimeThemeProvider } from '@/components/providers/TimeThemeProvider';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <NavigationProvider>
          <TimeThemeProvider>
            {children}
          </TimeThemeProvider>
        </NavigationProvider>
      </body>
    </html>
  );
}
```

### 5. Optional: Manual Override Toggle

Add a user control to override automatic switching:

```typescript
// In useTimeBasedTheme.ts - add manual override
const [manualOverride, setManualOverride] = useState<TimeTheme | null>(null);

// Store in localStorage
useEffect(() => {
  const stored = localStorage.getItem('theme-override');
  if (stored === 'day' || stored === 'evening') {
    setManualOverride(stored);
  }
}, []);

const finalTheme = manualOverride ?? autoTheme;
```

---

## Implementation Steps

### Phase 1: Color Selection & Setup
1. ✅ Review color options (3 orange variants above)
2. Create `useTimeBasedTheme` hook
3. Create `TimeThemeProvider` component
4. Test time detection logic (mock different times)

### Phase 2: Integration
1. Add provider to root layout
2. Verify CSS variables update correctly
3. Test color transitions across all components
4. Verify design tokens are working (should affect all 126 migrated instances)

### Phase 3: Visual Testing
1. Run visual regression tests with both themes
2. Check color contrast ratios (WCAG AA compliance)
3. Test in light and dark modes
4. Verify smooth transitions

### Phase 4: Optional Enhancements
1. Add manual theme toggle in navigation
2. Add localStorage persistence
3. Add theme transition animations (optional fade)
4. Add debug indicator showing current Pacific time

---

## Testing Strategy

**Manual Testing:**
```bash
# 1. Mock different times in browser DevTools
# Set system time to 10am Pacific → Should show orange
# Set system time to 8pm Pacific → Should show purple

# 2. Visual verification
npm run dev
# Visit all major pages and verify colors
```

**Automated Testing:**
```bash
# 1. Update visual regression baselines for both themes
npm run test:visual:update

# 2. Test time detection logic
# Create tests/hooks/useTimeBasedTheme.test.ts
```

**Color Contrast Testing:**
```bash
# Verify WCAG AA compliance for both color schemes
# Test orange text on dark backgrounds
# Test orange backgrounds with white text
```

---

## Questions for Decision

**1. Day Color Preference:**
- Option A: Vibrant Orange (#FF6B00) - Bold, energetic
- Option B: Amber/Gold (#F59E0B) - Warm, professional
- Option C: Sunset Orange (coral) - Softer, artistic

**2. Transition Times:**
- Current: 6am-6pm day, 6pm-6am evening
- Alternative: 7am-7pm day, 7pm-7am evening
- Alternative: Sunrise/sunset based (requires API)

**3. User Control:**
- Auto-only (no manual override)
- Auto with manual toggle (can switch anytime)
- Auto with "lock" option (prevents auto-switching)

**4. Transition Behavior:**
- Instant color change at 6am/6pm
- Smooth CSS transition (300ms fade)
- Gradient transition over 30 minutes

**5. Storage:**
- No storage (recalculates on every load)
- localStorage for manual overrides only
- localStorage for last theme (reduces flash)

---

## Benefits

1. **Zero Refactoring**: Design token migration already done - just update CSS variables
2. **Brand Personality**: Day = energetic/creative, Evening = professional/focused
3. **User Engagement**: Subtle time-awareness creates personal connection
4. **Accessibility**: Both colors can maintain WCAG AA contrast
5. **Performance**: Minimal overhead (1 interval timer, CSS variable updates)

---

## Risks & Mitigations

**Risk**: User timezone confusion (not in Pacific)
- **Mitigation**: Add optional tooltip showing "Day mode (Pacific time)"

**Risk**: Color contrast issues with orange
- **Mitigation**: Test all backgrounds, adjust orange saturation if needed

**Risk**: Flash of wrong color on page load
- **Mitigation**: Add theme to localStorage, read before first paint

**Risk**: Users prefer consistent color
- **Mitigation**: Add manual override toggle

---

## Files to Create/Modify

**New Files:**
- `/src/hooks/useTimeBasedTheme.ts` - Time detection hook
- `/src/components/providers/TimeThemeProvider.tsx` - Theme provider
- `/tests/hooks/useTimeBasedTheme.test.ts` - Unit tests

**Modified Files:**
- `/src/app/layout.tsx` - Add TimeThemeProvider
- `/src/app/globals.css` - Update default accent colors (optional)

**Documentation:**
- `/docs/time-based-theming.md` - User-facing explanation
- Update `/docs/css-quick-reference.md` - Note dynamic colors

---

## Next Steps

**Before Implementation:**
1. Choose day color (Option A, B, or C)
2. Confirm transition times (6am/6pm or different?)
3. Decide on user control level (auto-only, toggle, or lock)
4. Approve transition behavior (instant or smooth fade)

**After Approval:**
Proceed with Phase 1 implementation.
