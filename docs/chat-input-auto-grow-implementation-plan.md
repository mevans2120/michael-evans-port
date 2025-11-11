# Chat Input Auto-Grow Implementation Plan

**Date**: November 10, 2025
**Feature**: Auto-growing textarea for chat input
**Approach**: Option 3 - Standard Chat UX (Enter = Submit, Shift+Enter = New Line)

---

## Executive Summary

Replace the single-line `<input>` element in the chat interface with a multi-line `<textarea>` that automatically grows as users type long text or use Shift+Enter for line breaks. This maintains the current "Enter to submit" behavior while adding support for multi-line input.

**Key Behaviors**:
- Text wraps and textarea grows automatically when content exceeds width
- **Enter key** = Submit message (current behavior maintained)
- **Shift+Enter** = Insert new line (standard chat pattern)
- Max height cap prevents textarea from dominating the screen
- Works identically in desktop sidebar and mobile overlay

---

## Current State

**File**: `/src/components/navigation/ChatSection.tsx`

**Current Input (lines 516-525)**:
```tsx
<input
  ref={inputRef}
  type="text"
  value={input}
  onChange={(e) => setInput(e.target.value)}
  onFocus={handleInputFocus}
  placeholder="Ask about Michael's work..."
  disabled={isLoading}
  className="flex-1 px-3 py-2 text-base font-serif bg-chat-input border border-accent text-chat-input-text placeholder:text-chat-foreground/40 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-light disabled:opacity-50 disabled:cursor-not-allowed transition-none w-full min-w-0"
/>
```

**Limitations**:
- Single line only
- Long text overflows horizontally (not visible)
- No support for multi-line messages
- No way to add explicit line breaks

---

## Proposed Solution

### 1. Replace Input with Textarea

**New Implementation**:
```tsx
<textarea
  ref={textareaRef}
  value={input}
  onChange={(e) => setInput(e.target.value)}
  onFocus={handleInputFocus}
  onKeyDown={handleKeyDown}
  placeholder="Ask about Michael's work..."
  disabled={isLoading}
  rows={1}
  className="flex-1 px-3 py-2 text-base font-serif bg-chat-input border border-accent text-chat-input-text placeholder:text-chat-foreground/40 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-light disabled:opacity-50 disabled:cursor-not-allowed transition-none w-full min-w-0 resize-none overflow-hidden"
  style={{ minHeight: '42px', maxHeight: '150px' }}
/>
```

**Key Changes**:
- `type="text"` → removed (textarea doesn't have type)
- Added `rows={1}` for initial single-line appearance
- Added `onKeyDown={handleKeyDown}` for Enter key handling
- Added `resize-none` class to prevent manual resize handle
- Added `overflow-hidden` to hide scrollbar during auto-resize
- Added inline `style` for height constraints (see Styling Exceptions below)

### 2. Update Ref Type

**Line 26** - Change ref type:
```tsx
// Current:
const inputRef = useRef<HTMLInputElement>(null);

// New:
const textareaRef = useRef<HTMLTextAreaElement>(null);
```

### 3. Add Auto-Resize Logic

**New `useEffect` (add after line 122)**:
```tsx
// Auto-resize textarea based on content
useEffect(() => {
  if (textareaRef.current) {
    // Reset height to recalculate from scrollHeight
    textareaRef.current.style.height = '42px';

    // Calculate new height based on content, capped at maxHeight
    const scrollHeight = textareaRef.current.scrollHeight;
    const newHeight = Math.min(scrollHeight, 150); // 150px = ~5-6 lines
    textareaRef.current.style.height = `${newHeight}px`;
  }
}, [input]);
```

**How it works**:
1. Resets height to minimum on every input change
2. Reads `scrollHeight` (natural height of content)
3. Caps at 150px to prevent screen takeover
4. Sets new height, causing smooth growth

### 4. Add Enter Key Handler

**New function (add before the existing `handleInputFocus` function, around line 138)**:
```tsx
const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
  // Enter without Shift = Submit message
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault(); // Prevent default newline insertion

    // Only submit if there's valid input and we're not already loading
    if (input.trim() && !isLoading && !isWaitingForResponse) {
      setIsWaitingForResponse(true);
      sendMessage({ text: input });
      setInput('');
    }
  }
  // Shift+Enter = Allow newline (default textarea behavior, no preventDefault)
};
```

**Behavior**:
- **Enter alone**: Submits the form (same as current behavior)
- **Shift+Enter**: Creates a new line (standard chat UX)
- Form validation still applies (no empty messages)

### 5. Optional: Update Placeholder Text

**Consider adding a hint** (line 522 in new implementation):
```tsx
placeholder="Ask about Michael's work... (Shift+Enter for new line)"
```

**Trade-off**:
- **Pro**: Educates users about multi-line capability
- **Con**: Slightly cluttered, may not be necessary (Shift+Enter is standard)
- **Recommendation**: Start without hint, add only if users report confusion

---

## Responsive Context

The chat input appears in **2 contexts**:

1. **Desktop/Tablet (≥ 1024px)**:
   - Rendered in NavigationPanel sidebar via `ConditionalChatSection`
   - Fixed width: 320px
   - Textarea grows vertically within sidebar

2. **Mobile (< 1024px)**:
   - Rendered by `MobileChatFooter` with `isMobileVersion={true}`
   - Full-screen overlay (`fixed inset-0`)
   - Textarea has more horizontal space, same vertical constraints

**Important**: Same `ChatSection` component renders in both contexts, so behavior is consistent.

---

## Layout Integration

The chat uses a CSS Grid layout that already handles variable-height children:

**ChatSection container (line 228)**:
```tsx
className={`chat-section grid grid-rows-[auto_1fr_auto] ...`}
```

**Grid rows**:
1. **Row 1 (auto)**: Header - fixed height
2. **Row 2 (1fr)**: Messages container - flexible, scrollable
3. **Row 3 (auto)**: Input form - grows as textarea expands

**Why this works**:
- Input form has `flex-shrink-0` (line 510), ensuring it always displays fully
- Messages container has `overflow-y-auto` (line 319), so it scrolls when compressed
- Grid automatically redistributes space when input grows

**Max height cap (150px)**:
- Approximately 5-6 lines of text
- Prevents textarea from dominating screen
- Ensures messages area always has reasonable space

---

## Potential Issues & Mitigations

### Issue 1: Layout Shift Jarring for Users

**Problem**: Growing input could cause sudden compression of message area.

**Mitigation**:
- ✅ Grid layout designed for this - messages area gracefully shrinks
- ✅ `maxHeight: 150px` cap limits maximum shift
- ✅ Smooth resize via CSS (no janky height transitions)
- ✅ Users typing long text expect this behavior

**Risk**: LOW - Standard behavior in all modern chat apps

### Issue 2: Mobile Keyboard + Growing Textarea

**Problem**: On-screen keyboard + tall textarea = very little message space.

**Mitigation**:
- ✅ Mobile uses full-screen overlay, maximizing available space
- ✅ Browser automatically adjusts viewport for keyboard
- ✅ 150px cap prevents textarea from becoming too tall
- ✅ Messages area always scrollable

**Risk**: LOW - Standard mobile textarea behavior

### Issue 3: Performance with Rapid Typing

**Problem**: Recalculating height on every keystroke could cause lag.

**Mitigation**:
- ✅ Simple calculation (read `scrollHeight`, set `height`)
- ✅ Modern browsers optimize style changes
- ✅ React batches state updates
- ✅ Pattern used by Slack, Discord, ChatGPT without issues

**Risk**: VERY LOW - Well-optimized browser API

### Issue 4: Accessibility

**Problem**: Screen readers might not announce height changes.

**Mitigation**:
- ✅ Using semantic `<textarea>` element (built-in screen reader support)
- ✅ Existing ARIA patterns maintained
- ✅ Standard Enter/Shift+Enter behavior (familiar to screen reader users)
- ✅ Could add `aria-multiline="true"` explicitly for clarity

**Risk**: LOW - Semantic HTML handles this well

---

## Implementation Steps

### Step 1: Update `ChatSection.tsx`

**Changes required**:

1. **Line 26**: Change ref type
   ```tsx
   const textareaRef = useRef<HTMLTextAreaElement>(null);
   ```

2. **After line 122**: Add auto-resize effect
   ```tsx
   useEffect(() => {
     if (textareaRef.current) {
       textareaRef.current.style.height = '42px';
       const newHeight = Math.min(textareaRef.current.scrollHeight, 150);
       textareaRef.current.style.height = `${newHeight}px`;
     }
   }, [input]);
   ```

3. **Before line 138**: Add keydown handler
   ```tsx
   const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
     if (e.key === 'Enter' && !e.shiftKey) {
       e.preventDefault();
       if (input.trim() && !isLoading && !isWaitingForResponse) {
         setIsWaitingForResponse(true);
         sendMessage({ text: input });
         setInput('');
       }
     }
   };
   ```

4. **Lines 516-525**: Replace `<input>` with `<textarea>`
   ```tsx
   <textarea
     ref={textareaRef}
     value={input}
     onChange={(e) => setInput(e.target.value)}
     onFocus={handleInputFocus}
     onKeyDown={handleKeyDown}
     placeholder="Ask about Michael's work..."
     disabled={isLoading}
     rows={1}
     className="flex-1 px-3 py-2 text-base font-serif bg-chat-input border border-accent text-chat-input-text placeholder:text-chat-foreground/40 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-light disabled:opacity-50 disabled:cursor-not-allowed transition-none w-full min-w-0 resize-none overflow-hidden"
     style={{ minHeight: '42px', maxHeight: '150px' }}
   />
   ```

### Step 2: Test Implementation

Run through this checklist:

**Desktop/Tablet (≥ 1024px)**:
- [ ] Input starts as single line
- [ ] Typing long text wraps and grows textarea
- [ ] Textarea stops growing at ~5-6 lines
- [ ] Enter key submits message
- [ ] Shift+Enter creates new line
- [ ] Messages area remains scrollable when input grows
- [ ] Clearing input resets height to minimum

**Mobile (< 1024px)**:
- [ ] Same behavior as desktop
- [ ] On-screen keyboard doesn't break layout
- [ ] Full-screen overlay provides adequate space
- [ ] Enter/Shift+Enter work correctly on touch keyboards

**Edge Cases**:
- [ ] Pasting multi-line text auto-grows textarea
- [ ] Empty message (only whitespace) doesn't submit
- [ ] Loading state disables textarea properly
- [ ] Focus behavior unchanged from current implementation

### Step 3: Build and Verify

```bash
npm run build
```

Ensure TypeScript compiles without errors.

---

## Styling Exception

**Inline styles used**: `style={{ minHeight: '42px', maxHeight: '150px' }}`

**Justification** (per `/docs/styling-exceptions.md`):
- **Dynamic calculation**: Height is calculated in JavaScript based on `scrollHeight`
- **Performance**: Inline styles avoid class recalculation on every input change
- **Specificity**: Overrides any conflicting Tailwind utilities
- **Standard pattern**: Used by all major chat implementations (Slack, Discord, ChatGPT)

**TSDoc comment to add**:
```tsx
/**
 * Inline styles required for auto-grow behavior:
 * - minHeight: Initial collapsed height (42px = single line with padding)
 * - maxHeight: Growth cap (150px = ~5-6 lines)
 * JavaScript calculates dynamic height between these bounds.
 */
style={{ minHeight: '42px', maxHeight: '150px' }}
```

---

## Rollback Plan

If issues arise in production:

1. **Quick rollback**: Revert `ChatSection.tsx` to previous `<input>` implementation
2. **Partial rollback**: Keep textarea but remove auto-grow (set fixed `rows={3}`)
3. **A/B test**: Show textarea to 50% of users, collect feedback

**Monitoring**:
- Watch for user feedback about "Enter key not working"
- Monitor error logs for textarea-related exceptions
- Check mobile analytics for unusual bounce rates on chat page

---

## Future Enhancements

After successful implementation, consider:

1. **Configurable max height**: Make 150px cap adjustable via CMS
2. **Markdown preview**: Show formatted preview for multi-line messages
3. **Command palette**: Add `/` commands (e.g., `/help`, `/clear`)
4. **Saved drafts**: Persist unsent messages in localStorage

---

## Summary

**Risk Level**: LOW
**Implementation Time**: ~30 minutes
**Testing Time**: ~15 minutes
**Recommendation**: PROCEED with implementation

**Why this works**:
- Maintains current "Enter to submit" behavior users expect
- Adds standard Shift+Enter for multi-line (familiar pattern)
- Auto-grows naturally when text wraps (no manual action needed)
- Grid layout already designed to handle variable input height
- Well-established pattern used by all major chat applications

**Next step**: Proceed with Step 1 (Update `ChatSection.tsx`).
