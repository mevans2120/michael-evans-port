# Technical Debt Audit - November 4, 2025

Comprehensive review of the Michael Evans Portfolio codebase identifying technical debt, code quality issues, and improvement opportunities.

## Executive Summary

**Overall Health**: Good - The codebase is generally well-structured with modern tooling. Main issues are:
- Several unused/deprecated files
- Inconsistent TypeScript typing (extensive `any` usage)
- Multiple console.log statements in production code
- Potential unused dependencies
- Limited test coverage outside core utilities
- Duplicate Sanity client configurations

**Priority Areas**:
1. HIGH: Remove deprecated files, improve TypeScript typing
2. MEDIUM: Consolidate Sanity configurations, remove console logs
3. LOW: Audit unused dependencies, improve test coverage

---

## 1. Unused Files & Components

### HIGH Priority

**Deprecated File - OLD Component**
- **File**: `/src/app/(public)/ai-showcase/[slug]/AIShowcasePageClient.OLD.tsx`
- **Impact**: High (50 lines, clutters codebase)
- **Finding**: Complete component file marked as .OLD, never imported
- **Action**: Delete immediately - no references found in codebase

**Potentially Unused Root Components**
- **File**: `/src/components/Contact.tsx` (20+ lines)
- **Impact**: Medium
- **Finding**: Only imported in `/src/app/(public)/ai-showcase/page.tsx`
- **Usage**: Appears to be used, but verify if still needed
- **Action**: Review usage, consider moving to page-specific location if only used once

**Legacy Case Study Components**
- **Files**: 
  - `/src/components/CaseStudySection.tsx` (110+ lines)
  - `/src/components/CaseStudyNarrative.tsx` (35+ lines)
  - `/src/components/CaseStudyScreenshots.tsx` (Referenced but verify usage)
- **Impact**: Medium
- **Finding**: Used in detail components but may overlap with newer editorial components
- **Action**: Verify if these duplicate functionality in `/src/components/case-study-editorial/`

### MEDIUM Priority

**FaviconGenerator Component**
- **File**: `/src/components/FaviconGenerator.tsx`
- **Impact**: Low
- **Finding**: Only imported in root layout
- **Action**: Verify if actively used or if it's a one-time generation tool

---

## 2. TODO/FIXME Comments

### Status: EXCELLENT ✅

**Finding**: Only 5 informational "Note:" comments found - no TODO, FIXME, HACK, or XXX markers
- All comments are documentation/clarification notes, not action items
- No technical debt marked with traditional comment flags

**Files with Notes**:
1. `/src/hooks/__tests__/useMediaQuery.test.ts:48` - Test behavior note
2. `/src/scripts/export-profile-content-ndjson.ts:538` - CLI usage note
3. `/src/scripts/migrate-virgin-america-narrative.ts:184` - Manual step reminder
4. `/src/app/api/webhooks/sanity/route.ts:86` - Webhook behavior note
5. `/src/app/api/chat/route.ts:40` - System prompt documentation

---

## 3. Code Quality Issues

### HIGH Priority - TypeScript Typing

**Extensive Use of `any` Type** (64 occurrences)
- **Impact**: High - Reduces type safety, increases runtime error risk
- **Primary Locations**:

1. **Logger Utility** (5 occurrences)
   - **File**: `/src/lib/logger.ts:11,17,23,29,38`
   - **Issue**: All logger methods use `...args: any[]`
   - **Action**: Create typed logger interface with proper generic constraints
   ```typescript
   // Current: (...args: any[]) => void
   // Proposed: <T extends unknown[]>(...args: T) => void
   ```

2. **Sanity Image URL Builder** (1 occurrence)
   - **File**: `/src/lib/sanity/client.ts:14`
   - **Issue**: `urlFor(source: any)`
   - **Action**: Import Sanity's `SanityImageSource` type
   ```typescript
   // Proposed: urlFor(source: SanityImageSource)
   ```

3. **Hybrid Search Results** (3 occurrences)
   - **File**: `/src/lib/chatbot/hybrid-search.ts:12,17,76`
   - **Issue**: `metadata: any` in search result interfaces
   - **Action**: Define proper metadata type based on actual structure

4. **Migration Scripts** (25+ occurrences)
   - **Files**: 
     - `/src/scripts/migrate-case-studies.ts` (7 occurrences)
     - `/src/scripts/export-profile-content-ndjson.ts` (3 occurrences)
     - `/src/scripts/export-case-studies-ndjson.ts` (3 occurrences)
     - `/src/scripts/comprehensive-chatbot-test.ts` (3 occurrences)
     - `/src/scripts/test-chatbot.ts` (7 occurrences)
   - **Issue**: Portable Text conversions, JSON parsing, test results use `any`
   - **Action**: Define interfaces for PortableText blocks, test results
   - **Note**: Low priority since scripts are excluded from tsconfig

5. **Component Props** (10+ occurrences)
   - **Files**:
     - `/src/components/CaseStudySection.tsx` (11 occurrences)
     - `/src/components/CaseStudyNarrative.tsx` (1 occurrence)
     - `/src/components/about/AboutPageClient.tsx` (2 occurrences)
     - `/src/app/(public)/case-studies/[slug]/page.tsx` (3 occurrences)
   - **Issue**: Portable Text content prop typed as `any`
   - **Action**: Use `PortableTextBlock[]` from `@portabletext/types`
   ```typescript
   // Current: content: any
   // Proposed: content: PortableTextBlock[]
   ```

6. **Content Utility Functions** (2 occurrences)
   - **File**: `/src/lib/chatbot/content-hash.ts:40,47`
   - **Issue**: `sortObjectKeys(obj: any): any`
   - **Action**: Add generic type parameter
   ```typescript
   // Proposed: sortObjectKeys<T extends object>(obj: T): T
   ```

**Recommendation Priority**:
1. Fix logger utility (HIGH - used everywhere)
2. Fix Portable Text types in components (HIGH - common pattern)
3. Fix Sanity image URL builder (MEDIUM - used frequently)
4. Fix hybrid search metadata (MEDIUM - affects chatbot)
5. Fix migration scripts (LOW - excluded from type checking)

### MEDIUM Priority - Console Statements

**27 files with console.log/warn/error** (excluding test files)

**Production Code with Direct Console Usage**:
1. `/src/components/navigation/ChatSection.tsx` - Chat debugging
2. `/src/app/(admin)/admin/chat-logs/page.tsx` - Admin dashboard
3. `/src/app/(admin)/admin/chatbot-content/page.tsx` - Admin dashboard
4. `/src/app/api/admin/chat-logs/route.ts` - API logging
5. `/src/lib/auth/admin-auth.ts` - Auth debugging
6. `/src/lib/chatbot/hybrid-search.ts` - Search debugging
7. `/src/lib/chatbot/ingest-content.ts` - Ingestion logging
8. `/src/lib/chatbot/smart-sync.ts` - Sync logging
9. `/src/lib/chatbot/sanity-fetcher.ts` - Fetcher logging
10. `/src/app/api/weather/route.ts` - Weather API

**Action Required**:
- Replace all `console.log/warn/error` with `logger` utility from `/src/lib/logger.ts`
- Logger already exists and filters by environment (development only)
- Keeps production console clean while maintaining dev debugging

**Exception**: Admin pages can keep console logs since they're protected routes

### LOW Priority - Code Patterns

**Large Component Files** (400+ lines)
1. `/src/components/navigation/ChatSection.tsx` (410 lines)
   - **Issue**: Complex chat component with multiple concerns
   - **Action**: Consider splitting into:
     - `ChatMessages.tsx` - Message rendering
     - `ChatInput.tsx` - Input handling
     - `ChatSection.tsx` - Container/orchestration

2. `/src/lib/chatbot/supabase.ts` (448 lines)
   - **Issue**: Multiple database operations in one file
   - **Action**: Consider splitting by concern:
     - `supabase-client.ts` - Client setup
     - `supabase-vector.ts` - Vector operations
     - `supabase-content.ts` - Content CRUD

3. `/src/lib/chatbot/sanity-fetcher.ts` (493 lines)
   - **Issue**: Large fetcher with many queries
   - **Action**: Split by content type or consider query builder pattern

**Script Files** (11 files in `/src/scripts/`)
- **Issue**: Scripts mixed with application code, but properly excluded from TypeScript compilation
- **Action**: Document which scripts are:
  - One-time migrations (can be archived)
  - Ongoing utilities (should stay)
  - Test/evaluation tools (should stay)

**Performance Opportunities**:
- Only 4 files use React.memo/useMemo/useCallback:
  - `/src/components/ui/carousel.tsx`
  - `/src/components/providers/TimeThemeProvider.tsx`
  - `/src/components/navigation/SuggestedPrompts.tsx`
  - `/src/components/ui/chart.tsx`
- **Finding**: Minimal use of optimization hooks
- **Impact**: Low - May not be needed yet depending on app size
- **Action**: Monitor performance, add memoization only if needed

---

## 4. Configuration & Dependencies

### HIGH Priority - Duplicate Sanity Configuration

**Two Sanity Client Configurations**:

1. **Primary Client**: `/src/lib/sanity/client.ts`
   - Uses `@sanity/client`
   - Has `urlFor()` image builder
   - Used throughout application
   - Configured with environment variables

2. **Secondary Client**: `/src/sanity/lib/client.ts`
   - Uses `next-sanity`
   - No image builder
   - May be used by Sanity Studio
   - Configured with separate env module

**Impact**: Medium - Potential confusion, maintenance overhead

**Action**: 
- Verify which client is used where
- Consolidate to single source if possible
- If both needed (app vs studio), document the distinction clearly

### MEDIUM Priority - Environment Variables

**Well Documented** ✅ - `.env.example` exists with 47 lines

**All Required Variables Documented**:
- Sanity configuration (5 vars)
- AI chatbot (1 var)
- Supabase (3 vars)
- Admin authentication (3 vars)
- Feature flags (1 var)
- Weather API (1 var)

**Finding**: Good documentation, but consider validating env vars at startup

**Action**: Add environment variable validation in `next.config.ts` or startup file

### LOW Priority - Potentially Unused Dependencies

**Dependencies to Audit** (43 packages):

**Potentially Unused UI Components** (not found via grep):
1. `react-day-picker` (9.11.1) - Date picker component
2. `cmdk` (1.1.1) - Command menu component
3. `vaul` (1.1.2) - Drawer component

**Action**: Search more thoroughly or remove if truly unused
```bash
# Verify usage
npm ls react-day-picker cmdk vaul
```

**Chart Library Usage**:
- `recharts` (2.15.4) - Only used in `/src/components/ui/chart.tsx`
- `/src/components/ui/chart.tsx` itself is never imported
- **Action**: Verify if charts are planned feature or remove both

**Unused shadcn/ui Components** (not found via grep):
- `menubar` - Menu bar component
- `input-otp` - OTP input component  
- `resizable` - Resizable panels component
- `radio-group` - Radio button group
- `collapsible` - Collapsible component
- `context-menu` - Context menu component

**Note**: These are copied into codebase (shadcn pattern), not package deps
**Action**: Safe to keep for future use, or remove to reduce bundle size

---

## 5. Performance Concerns

### Status: GOOD ✅

**Bundle Size Optimization**:
- Using dynamic imports where appropriate
- Next.js handles code splitting automatically
- No obvious heavy imports in client components

**React Performance**:
- Minimal use of React.memo (only 4 files)
- **Finding**: Likely not needed yet - premature optimization
- **Action**: Monitor with React DevTools, optimize only if issues found

**Recommendations**:
1. Add bundle analyzer to verify no unexpected large dependencies
   ```bash
   npm install --save-dev @next/bundle-analyzer
   ```

2. Consider lazy loading large components:
   - ChatSection (410 lines)
   - Admin dashboard pages (300+ lines each)

---

## 6. Documentation Gaps

### Status: GOOD ✅

**Well Documented**:
- Comprehensive `CLAUDE.md` project instructions
- Environment variables fully documented
- Recent phase completion docs in `/docs/`
- Architecture decisions recorded

**Missing Documentation**:

1. **API Routes** (Medium Priority)
   - `/src/app/api/chat/route.ts` - Well commented ✅
   - `/src/app/api/webhooks/sanity/route.ts` - Has inline comments ✅
   - Other API routes lack JSDoc headers

2. **Complex Utilities** (Low Priority)
   - `/src/lib/chatbot/hybrid-search.ts` - No JSDoc
   - `/src/lib/chatbot/query-preprocessor.ts` - No JSDoc
   - `/src/lib/chatbot/embeddings.ts` - No JSDoc

**Action**: Add JSDoc comments to:
- All API route handlers (what they do, params, responses)
- Complex chatbot utilities (algorithms used, params, returns)

---

## 7. Testing Coverage

### Current State

**Test Files Found** (4 files):
1. `/src/lib/__tests__/logger.test.ts` ✅
2. `/src/lib/__tests__/utils.test.ts` ✅
3. `/src/hooks/__tests__/useMediaQuery.test.ts` ✅
4. `/src/lib/auth/__tests__/admin-auth.test.ts` ✅

**Test Infrastructure**:
- ✅ Vitest configured (`vitest.config.ts`)
- ✅ Playwright configured (`playwright.config.ts`)
- ✅ Visual regression tests (`test:visual` script)
- ✅ E2E tests (`test:e2e` script)
- ✅ Style compliance tests (`test:styles` script)

**Coverage Gaps**:

### HIGH Priority - Critical Paths Without Tests

1. **Chatbot System** (No tests found):
   - `/src/lib/chatbot/hybrid-search.ts` - Core search functionality
   - `/src/lib/chatbot/embeddings.ts` - Embedding generation
   - `/src/lib/chatbot/query-preprocessor.ts` - Query processing
   - `/src/lib/chatbot/supabase.ts` - Database operations
   - **Impact**: High - Core feature, potential for regressions

2. **API Routes** (No tests found):
   - `/src/app/api/chat/route.ts` - Main chat endpoint
   - `/src/app/api/webhooks/sanity/route.ts` - Webhook handler
   - `/src/app/api/admin/chat-logs/route.ts` - Admin API
   - **Impact**: High - User-facing APIs

3. **Sanity Integration** (No tests found):
   - `/src/lib/sanity/queries.ts` - Data fetching
   - `/src/lib/chatbot/sanity-fetcher.ts` - Content sync
   - **Impact**: Medium - Data layer

### MEDIUM Priority - Component Testing

**No Component Tests Found**:
- Navigation components (ChatSection, NavigationPanel)
- Case study components
- AI showcase components
- **Impact**: Medium - UI regressions possible

**Recommendation**:
1. Add integration tests for chatbot flow
2. Add API route tests (mock Supabase, test error handling)
3. Add component tests for critical UI (navigation, chat)
4. Maintain visual regression tests (already in place ✅)

---

## 8. Security & Error Handling

### Status: GOOD ✅

**Security**:
- ✅ Admin routes protected with auth middleware
- ✅ Environment variables for secrets
- ✅ No hardcoded API keys found
- ✅ Webhook signature verification in place
- ⚠️  Client-side admin token (NEXT_PUBLIC_ADMIN_API_TOKEN) - documented as temp solution

**Error Handling**:
- ✅ Try-catch blocks in 20+ places (grep found 20 occurrences)
- ✅ Error logging throughout codebase
- ⚠️  Some catch blocks just log without user feedback
- ⚠️  No global error boundary component found

**Recommendations**:
1. Add React Error Boundary component for graceful failures
2. Implement proper auth (JWT) for admin endpoints (noted in .env.example)
3. Add user-facing error messages in API routes

---

## Action Plan - Prioritized

### Phase 1: Quick Wins (1-2 hours)
1. ✅ Delete `/src/app/(public)/ai-showcase/[slug]/AIShowcasePageClient.OLD.tsx`
2. ✅ Replace console.log with logger in production code (27 files)
3. ✅ Add JSDoc headers to API routes

### Phase 2: Type Safety (4-6 hours)
1. ✅ Fix logger utility typing (5 occurrences)
2. ✅ Fix Portable Text typing in components (10+ occurrences)
3. ✅ Fix Sanity image URL builder (1 occurrence)
4. ✅ Fix hybrid search metadata (3 occurrences)
5. ⚠️ Review and consolidate Sanity client configurations

### Phase 3: Code Organization (4-8 hours)
1. ✅ Split ChatSection component (410 lines → 3 files)
2. ✅ Split large chatbot utilities if needed
3. ✅ Document which scripts are one-time vs ongoing
4. ✅ Verify and remove unused components (Contact, CaseStudy legacy)

### Phase 4: Testing (8-16 hours)
1. ✅ Add chatbot integration tests
2. ✅ Add API route tests
3. ✅ Add critical component tests
4. ✅ Set up coverage reporting

### Phase 5: Dependencies & Performance (2-4 hours)
1. ✅ Audit unused dependencies (react-day-picker, cmdk, vaul, recharts)
2. ✅ Add bundle analyzer
3. ✅ Review unused UI components
4. ✅ Add environment variable validation

---

## Summary Statistics

- **Total TypeScript Files**: ~100 files in src/
- **Lines of Code**: ~19,500 lines
- **`any` Type Usage**: 64 occurrences (needs reduction)
- **Console Statements**: 27 files (should use logger)
- **Test Files**: 4 (needs expansion)
- **TODO/FIXME**: 0 (excellent!)
- **Deprecated Files**: 1 (.OLD file)
- **Duplicate Configs**: 2 (Sanity clients)

**Overall Grade**: B+ (Very Good)

**Strengths**:
- Modern tech stack (Next.js 15, TypeScript, React 19)
- Good documentation (CLAUDE.md, .env.example)
- Consistent styling system (Tailwind, design tokens)
- No TODO/FIXME debt
- Visual regression testing in place

**Improvement Areas**:
- TypeScript typing (reduce `any` usage)
- Test coverage (especially chatbot and APIs)
- Console log cleanup
- Legacy file removal

---

## Notes

This audit was conducted on November 4, 2025, on the `main` branch.

**Methodology**:
- Automated code scanning with grep/glob patterns
- Manual file inspection for context
- Cross-reference with project documentation
- Analysis of import/usage patterns

**Next Steps**:
1. Review and prioritize findings with team
2. Create GitHub issues for Phase 1-2 items
3. Schedule technical debt sprints for Phases 3-5
4. Set up automated linting rules to prevent regression
