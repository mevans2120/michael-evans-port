# Sanity Integration Plan for Contact Form

## Goal Description
Move hardcoded contact form strings (labels, placeholders, button text, success/error messages) into the Sanity CMS `contactPage` schema. This allows the user to manage all contact page content from the CMS.

## User Review Required
> [!NOTE]
> This change requires running a Sanity schema deployment (`sanity graphql deploy` or similar, depending on setup) or just pushing the code if using a hosted studio. I will assume standard code-based schema updates.

## Phased Implementation Steps

### Phase 1: Schema & Types (Backend Foundation)
1.  **Schema Update**: Modify `sanity/schemas/contactPage.ts` to add `form` and `confirmationEmail` objects.
2.  **Type Definition**: Update `src/types/sanity.ts` to match the new schema structure.
3.  **Query Update**: Update `src/lib/sanity/queries.ts` to fetch the new fields.
4.  **Verification**: Verify Sanity Studio loads with new fields (if applicable) or check types compile.

### Phase 2: Frontend Integration (UI)
1.  **Component Props**: Update `ContactForm.tsx` to accept `formStrings` prop.
2.  **Data Passing**: Update `ContactSection.tsx` to pass the `form` data from Sanity to `ContactForm`.
3.  **UI Update**: Replace hardcoded strings in `ContactForm` with values from props (with fallbacks).
4.  **Verification**: Verify the contact form still renders correctly on the frontend.

### Phase 3: API & Email Logic (Backend Logic)
1.  **API Update**: Modify `src/app/api/send/route.ts` to fetch `contactPage` data from Sanity.
2.  **Confirmation Logic**: Implement logic to send a confirmation email if enabled in Sanity settings.
3.  **Verification**: Test form submission and verify both notification (to owner) and confirmation (to user) emails are sent.

## Proposed Changes

### Sanity Schema
#### [MODIFY] [contactPage.ts](file:///Users/michaelevans/repos/michael-evans-port-main/sanity/schemas/contactPage.ts)
- Add a new object field `form` containing:
    - `nameLabel` (string)
    - `emailLabel` (string)
    - `messageLabel` (string)
    - `sendButtonText` (string)
    - `sendingButtonText` (string)
    - `successMessage` (string)
    - `errorMessage` (string)
- Add a new object field `confirmationEmail` containing:
    - `enabled` (boolean)
    - `subject` (string)
    - `body` (text) - Simple text or markdown for the email body.
    - `fromName` (string) - e.g., "Michael Evans"

### TypeScript Types
#### [MODIFY] [sanity.ts](file:///Users/michaelevans/repos/michael-evans-port-main/src/types/sanity.ts)
- Update `ContactPageData` interface to include the new `form` object and its fields.

### Sanity Queries
#### [MODIFY] [queries.ts](file:///Users/michaelevans/repos/michael-evans-port-main/src/lib/sanity/queries.ts)
- Update `contactPageQuery` to fetch the new `form` and `confirmationEmail` objects.

### API Route
#### [MODIFY] [route.ts](file:///Users/michaelevans/repos/michael-evans-port-main/src/app/api/send/route.ts)
- Fetch `contactPage` data from Sanity to get confirmation email settings.
- If `confirmationEmail.enabled` is true, send a second email to the user (`body.email`).
- Use `confirmationEmail.subject` and `confirmationEmail.body` (replacing placeholders like `{name}` if needed).

### UI Components
#### [MODIFY] [ContactSection.tsx](file:///Users/michaelevans/repos/michael-evans-port-main/src/components/ContactSection.tsx)
- Pass the `data.form` object to the `ContactForm` component.

#### [MODIFY] [ContactForm.tsx](file:///Users/michaelevans/repos/michael-evans-port-main/src/components/ContactForm.tsx)
- Accept `formStrings` (or similar) prop.
- Replace hardcoded labels, button text, and toast messages with values from props.
- Fallback to default values if Sanity data is missing (to prevent crashes during migration).

## Verification Plan

### Automated Tests
- None (Sanity schema changes are hard to unit test without a mock).

### Manual Verification
- **Phase 1**: Check types and queries.
- **Phase 2**: Visual check of form labels/buttons.
- **Phase 3**: Full end-to-end test of form submission and email receipt (notification + confirmation).
