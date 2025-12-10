# Mobile Header Logo Alignment Research

**Date**: December 9, 2025
**Issue**: "MEvans" logo position shifts between MobileHeader and ChatSection expanded states
**Severity**: Low (visual polish issue)

---

## Problem Statement

The "MEvans" logo text starts at different X positions depending on whether viewing:
1. **Regular mobile header** (homepage, content pages)
2. **Chat expanded header** ("MEvans AI Assistant")

This creates a jarring visual shift when the chat opens/closes.

---

## Current Implementation

### MobileHeader.tsx (line 26)
```tsx
<div className="flex items-center justify-between h-full px-6">
  <Link href="/" ...>
    <span>M<span className="text-gradient">Evans</span></span>
  </Link>
```

**Padding**: `px-6` = **24px** left/right

### ChatSection.tsx - Mobile Header (line 268)
```tsx
<div className="px-8 py-6 border-b border-chat-border flex items-center justify-between flex-shrink-0">
  <h2 className="text-lg font-medium text-chat-foreground font-serif">
    M<span className="text-gradient">Evans</span> AI Assistant
  </h2>
```

**Padding**: `px-8` = **32px** left/right

---

## Root Cause

**8px horizontal padding difference** between the two headers:
- MobileHeader: 24px (`px-6`)
- ChatSection mobile header: 32px (`px-8`)

---

## Visual Impact

```
Homepage View:
┌─────────────────────────────────────────┐
│ ← 24px → MEvans                    ☰   │
└─────────────────────────────────────────┘

Chat Expanded View:
┌─────────────────────────────────────────┐
│ ← 32px → MEvans AI Assistant        ✕   │
└─────────────────────────────────────────┘

                 ↑
           8px shift right
```

---

## Solution Options

### Option A: Unify Padding Values (Recommended)

**Change ChatSection mobile header to use `px-6`**:

```tsx
// ChatSection.tsx line 268
// Before:
<div className="px-8 py-6 border-b ...">

// After:
<div className="px-6 py-6 border-b ...">
```

**Pros**:
- Simple one-line change
- Consistent with rest of mobile UI
- No other components affected

**Cons**:
- Slightly less breathing room in chat header

---

### Option B: Unify to Larger Padding

**Change MobileHeader to use `px-8`**:

```tsx
// MobileHeader.tsx line 26
// Before:
<div className="flex items-center justify-between h-full px-6">

// After:
<div className="flex items-center justify-between h-full px-8">
```

**Pros**:
- More generous padding
- Chat header stays unchanged

**Cons**:
- Affects all pages, not just chat
- Reduces horizontal space for content
- May need to audit other mobile components for consistency

---

### Option C: Create Shared Constant

**Define a design token for mobile header padding**:

```tsx
// In a shared constants file or tailwind config
// MOBILE_HEADER_PADDING = 'px-6' // or px-8

// MobileHeader.tsx
<div className={cn("flex items-center justify-between h-full", MOBILE_HEADER_PADDING)}>

// ChatSection.tsx
<div className={cn("py-6 border-b ...", MOBILE_HEADER_PADDING)}>
```

**Pros**:
- Single source of truth
- Easy to adjust globally
- Documents the design decision

**Cons**:
- More setup for a simple alignment fix
- Overkill for this specific issue

---

## Additional Alignment Considerations

### Vertical Alignment (Y Position)

Both headers use different height approaches:
- **MobileHeader**: `h-16` (64px fixed height)
- **ChatSection mobile header**: `py-6` (24px top + 24px bottom + content)

These should result in similar visual heights, but verify after fixing horizontal alignment.

### Typography

Both use identical text styling for the logo:
- `text-lg font-medium font-serif`
- Same "Evans" gradient span

No changes needed here.

---

## Recommendation

**Implement Option A**: Change ChatSection `px-8` to `px-6`

This is the simplest fix and maintains consistency with the existing MobileHeader pattern. The 24px padding (`px-6`) is already established as the mobile standard throughout the site.

---

## Files to Modify

| File | Change | Line |
|------|--------|------|
| `src/components/navigation/ChatSection.tsx` | `px-8` → `px-6` | 268 |

---

## Testing Checklist

After implementation:
- [ ] MEvans logo X position matches between regular header and chat header
- [ ] Chat header still looks balanced with close button
- [ ] No horizontal overflow on narrow devices
- [ ] Verify on iPhone SE (smallest common width: 375px)

---

## Related Components

For future reference, these components also have mobile padding that should stay consistent:
- `MobileHeader.tsx` - `px-6`
- `MobileChatFooter.tsx` - check padding
- `HamburgerMenu.tsx` - check padding

---

## Estimated Effort

**5 minutes** - Single CSS class change + visual verification
