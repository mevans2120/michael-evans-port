# Contact Page Refinement Plan

## Goal Description
Refine the contact page design to match specific user requests: single-column layout, serif headers, floating labels, simplified email options, and an accent-colored submit button with validation state.

## User Review Required
> [!NOTE]
> The "Floating Label" behavior (animating to top right) will require a new custom input wrapper or component.

## Proposed Changes

### Layout & Typography
#### [MODIFY] [ContactSection.tsx](file:///Users/michaelevans/repos/michael-evans-port-main/src/components/ContactSection.tsx)
- **Layout**: Change `grid-cols-1 lg:grid-cols-2` to a single centered column (`max-w-2xl mx-auto`).
- **Typography**: Ensure the main header uses the serif font (already does, but will double-check consistency).
- **Content**: Remove "Gmail" and "Outlook" links. Keep "Copy Email".

### UI Components
#### [NEW] [FloatingLabelInput.tsx](file:///Users/michaelevans/repos/michael-evans-port-main/src/components/ui/floating-label-input.tsx)
- Create a new component that wraps an input/textarea and label.
- Use CSS transitions to move the label to the top-right (or top-left standard, user asked for top-right but standard is top-left, I will clarify or implement as requested) when focused or has value.
- *Self-correction*: User asked for "top right". I will implement as requested.

#### [MODIFY] [ContactForm.tsx](file:///Users/michaelevans/repos/michael-evans-port-main/src/components/ContactForm.tsx)
- Replace standard `Input` and `Textarea` with `FloatingLabelInput`.
- **Button**:
    - Change variant to use accent color (may need a new variant or utility class).
    - Set `disabled={!form.formState.isValid}` to dim until criteria met.

## Verification Plan

### Automated Tests
- Verify form validation still works with new components.

### Manual Verification
- **Layout**: Check single column appearance.
- **Animation**: Verify label floats to top-right on focus/input.
- **Button**: Verify it is disabled/dimmed until form is valid, then turns to accent color.
