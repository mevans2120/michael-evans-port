# Contact Form Implementation Plan

## Goal Description
Update the contact page to include a simple contact form using Resend for email delivery. This will replace or augment the existing "click to email" links with a direct form submission capability.

## User Review Required
> [!IMPORTANT]
> You will need to provide a Resend API key in your `.env.local` file as `RESEND_API_KEY`.
> You also need to verify a domain in Resend or use the testing domain (only sends to your email).

## Design System Alignment
> [!NOTE]
> This plan aligns with the existing Tailwind CSS design system.
> - Will use existing UI components from `src/components/ui` (`Button`, `Input`, `Form`, `Label`).
> - Will use `sonner` or `toast` for notifications.
> - Will create a `Textarea` component matching the `Input` styles to ensure consistency.

## Phased Implementation Plan

### Phase 1: Infrastructure & API
1.  **Install Dependencies**: Add `resend`.
2.  **API Route**: Create `src/app/api/send/route.ts` with Zod validation and Resend integration.
3.  **Verification**: Test the API route with a mock request (using a script or curl).

### Phase 2: UI Components
1.  **Textarea Component**: Create `src/components/ui/textarea.tsx` (if missing) or `src/components/Textarea.tsx` to match the design system.
2.  **Contact Form**: Build `src/components/ContactForm.tsx` using `react-hook-form` and `zod`.
    - Use `Form`, `FormField`, `FormItem`, `FormLabel`, `FormControl`, `FormMessage` from `src/components/ui/form.tsx`.
    - Use `Input` and `Button` from `src/components/ui`.
3.  **Integration**: Add `ContactForm` to `src/components/ContactSection.tsx`.

### Phase 3: Polish & Verification
1.  **Feedback**: Implement success/error toasts using `sonner` or `use-toast`.
2.  **Responsive Check**: Ensure the layout looks good on mobile and desktop.
3.  **Final Verification**: Full end-to-end test.

## Proposed Changes

### Dependencies
- Install `resend`

### API Layer
#### [NEW] [route.ts](file:///Users/michaelevans/repos/michael-evans-port-main/src/app/api/send/route.ts)
- POST endpoint for form submission.

### UI Components
#### [NEW] [textarea.tsx](file:///Users/michaelevans/repos/michael-evans-port-main/src/components/ui/textarea.tsx)
- New component matching `Input` styling.

#### [NEW] [ContactForm.tsx](file:///Users/michaelevans/repos/michael-evans-port-main/src/components/ContactForm.tsx)
- Client component with form logic.

#### [MODIFY] [ContactSection.tsx](file:///Users/michaelevans/repos/michael-evans-port-main/src/components/ContactSection.tsx)
- Import and render `ContactForm`.

### Environment
- Add `RESEND_API_KEY` to `.env.local`.

## Verification Plan

### Automated Tests
- Run `npm run dev`.
- Navigate to `/contact`.
- Submit form and verify success toast.

### Manual Verification
- Check email inbox.
- Verify validation errors (empty fields, invalid email).
