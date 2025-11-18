# Chatbot Fixes Plan
**Date:** November 17, 2025
**Issues:** ASCII art rendering (grey boxes) + Case study card inconsistency

---

## Issue 1: ASCII Art Rendering Grey Boxes

### Problem
When users praise the chatbot, ASCII art appears as grey boxes instead of proper text art.

### Root Cause
**Location:** `/src/app/api/chat/route.ts` lines 143-156

The system prompt contains **descriptions** of ASCII art:
```
- Use one of these ASCII art designs randomly:
  * Heart pattern with <3 symbols
  * Star pattern with asterisks
  * Robot saying THX
  * Dog saying "Woof! Thanks!"
  ...
```

Claude tries to recreate these from descriptions and uses wrong characters that render as boxes (□).

### Solution
Replace descriptions with **actual ASCII art examples** from `/src/lib/chatbot/ascii-art.ts`.

**Change lines 147-155 from:**
```
- Use one of these ASCII art designs randomly:
  * Heart pattern with <3 symbols
  * Star pattern with asterisks
  * Robot saying THX
  * Dog saying "Woof! Thanks!"
  * Cat saying "Purrfect feedback!"
  * Trophy with "You're the best!"
  * Smiley face
  * Flower made with @ symbols
```

**To:**
```
- Choose ONE of these ASCII art designs randomly and include it exactly as shown:

Option 1 - Heart:
    <3 <3 <3 <3 <3 <3 <3
    <3               <3
    <3  Thank you!   <3
    <3               <3
    <3 <3 <3 <3 <3 <3 <3

Option 2 - Robot:
      [=========]
      | o     o |
      |    >    |
      |  \___/  |
      [=========]
       |[-----]|
       || THX ||
       |[-----]|
       d       b

Option 3 - Sparkles:
    *~*~*~*~*~*~*~*
    ~*~*~*~*~*~*~*~
    * Thanks for  *
    * the kind    *
    * words!      *
    ~*~*~*~*~*~*~*~
    *~*~*~*~*~*~*~*

Option 4 - Cat:
     /\_/\
    ( o.o )
     > ^ <
    Purrfect feedback!
    Thank mew!
```

**Key instructions to add:**
- Copy the ASCII art EXACTLY as shown (no modifications)
- Choose randomly between the 4 options
- Place in a code block with triple backticks

---

## Issue 2: Case Study Cards Don't Always Appear

### Problem
When chatbot discusses projects, case study preview cards appear inconsistently.

### Root Cause
**Location:** `/src/app/api/chat/route.ts` line 117

Current prompt uses **optional language**:
```
- If your answer discussed a specific project, include a link at the very end:
```

The word "**If**" makes it conditional - Claude decides whether it's necessary.

### Solution
Make link inclusion **mandatory** and clarify it should only appear **once**.

**Change line 117 from:**
```
- If your answer discussed a specific project, include a link at the very end:
```

**To:**
```
- WHEN your answer discusses a specific project, ALWAYS include the corresponding case study link ONCE at the very end (after follow-up questions):
```

**Also update the example format (lines 119-123) to emphasize "once":**
```
  **Follow-up questions:**
  - Question related to current topic
  - Learn more question about different topic

  **Learn more:** [Project Name](/case-studies/project-slug)

  (Note: Include the link ONLY ONCE at the end, not repeated elsewhere)
```

### Key Changes
1. "**If**" → "**WHEN**" (assumes project discussion happens)
2. Add "**ALWAYS**" to make it imperative
3. Add "**ONCE**" to clarify single inclusion
4. Add note in example to reinforce one-time inclusion

---

## Implementation Steps

### 1. Update ASCII Art Section
- [ ] Edit `/src/app/api/chat/route.ts` lines 147-155
- [ ] Replace descriptions with 4 actual ASCII examples
- [ ] Add instruction to copy exactly as shown
- [ ] Test: Send "thank you" and verify ASCII renders correctly

### 2. Update Case Study Link Section
- [ ] Edit `/src/app/api/chat/route.ts` line 117
- [ ] Change "If" to "WHEN" and add "ALWAYS"
- [ ] Add "ONCE" to clarify single inclusion
- [ ] Update example with note about single inclusion
- [ ] Test: Ask about projects and verify cards appear consistently

### 3. Restart Dev Server
- [ ] Restart to pick up prompt changes
- [ ] Monitor chatbot responses for both fixes

### 4. Verification Testing
- [ ] **ASCII art tests:**
  - Send "thank you" → verify ASCII renders (no boxes)
  - Send "awesome" → verify different ASCII appears
  - Send "great job" → verify ASCII variety
- [ ] **Case study tests:**
  - "Tell me about Virgin America" → verify card appears
  - "What's your best project?" → verify card appears
  - Check that link only appears once (not repeated)

---

## Files Modified

### `/src/app/api/chat/route.ts`
- **Lines 147-155:** ASCII art section (replace descriptions with examples)
- **Line 117:** Case study link instruction (make mandatory and specify "once")
- **Lines 119-123:** Example format (add note about single inclusion)

---

## Testing Checklist

**ASCII Art:**
- [ ] Praise responses show ASCII art correctly
- [ ] No grey boxes or placeholder characters
- [ ] Multiple praise messages show variety of ASCII designs
- [ ] ASCII renders correctly in code blocks

**Case Study Cards:**
- [ ] Project discussions include case study links
- [ ] Links appear consistently (not sometimes missing)
- [ ] Links only appear ONCE per response
- [ ] Preview cards render with image, title, description
- [ ] Cards are clickable and navigate to case study

---

## Why These Fixes Work

### ASCII Art Fix
**Before:** Claude tries to recreate art from text descriptions → uses wrong characters → renders as boxes
**After:** Claude copies exact ASCII from examples → uses correct characters → renders properly

### Case Study Links Fix
**Before:** "If" makes links optional → Claude skips them sometimes
**After:** "WHEN...ALWAYS...ONCE" makes links mandatory and clear → Claude includes them consistently

---

## Notes

- No programmatic injection needed - system prompt fixes are sufficient
- Both fixes leverage Claude's instruction-following capability
- ASCII art library (`/src/lib/chatbot/ascii-art.ts`) remains available for future programmatic use if needed
- The "ONCE" clarification prevents potential duplicate links in responses
