# Codebase Technical Debt & Code Quality Audit
**Date:** November 1, 2025  
**Codebase:** Michael Evans Portfolio (Next.js 15.5, TypeScript 5.8)  
**Total Source Files:** 155 TypeScript/TSX files

---

## Executive Summary

This audit identifies technical debt and code quality issues across the portfolio codebase. The application is generally well-structured with modern technologies, but contains opportunities for cleanup, consistency improvements, and optimization.

### Key Findings by Severity

**High Priority (5 issues):**
- Console.log statements in production code (144+ instances)
- Debug code left in admin authentication
- Missing authentication in admin routes
- Duplicate mobile detection hooks
- Hardcoded hex colors in design concepts

**Medium Priority (8 issues):**
- Unused UI components (7 shadcn/ui components)
- Unused npm dependencies (6 packages)
- Missing TypeScript types (24 `any` usages)
- Duplicate toast hook implementations
- Inconsistent error handling patterns
- Missing test coverage (0 test files)

**Low Priority (6 issues):**
- TODO comments in code
- Inline styles (60 instances)
- Legacy styled-components dependency
- Large file sizes (763 lines max)
- Missing dependency declarations

### Overall Health Score: 7/10
- **Strengths:** Modern architecture, TypeScript usage, good component organization
- **Weaknesses:** Production debugging code, unused dependencies, missing tests

---

## 1. Unused Code

### 1.1 Unused UI Components (Medium Priority)

**Issue:** 7 shadcn/ui components installed but never imported/used.

**Files:**
```
src/components/ui/breadcrumb.tsx      - Not referenced anywhere
src/components/ui/calendar.tsx        - Not referenced anywhere  
src/components/ui/command.tsx         - Not referenced anywhere
src/components/ui/drawer.tsx          - Not referenced anywhere
src/components/ui/pagination.tsx      - Not referenced anywhere
src/components/ui/sidebar.tsx         - 763 lines, not referenced
src/components/ui/textarea.tsx        - Not referenced anywhere
```

**Impact:**
- Bundle size bloat (~15-20KB estimated)
- Maintenance overhead
- Confusing for developers

**Recommendation:**
```bash
# Remove unused components
rm src/components/ui/breadcrumb.tsx
rm src/components/ui/calendar.tsx
rm src/components/ui/command.tsx
rm src/components/ui/drawer.tsx
rm src/components/ui/pagination.tsx
rm src/components/ui/sidebar.tsx  # Largest unused file (763 lines!)
rm src/components/ui/textarea.tsx
```

**Effort:** 15 minutes  
**Priority:** Medium

---

### 1.2 Unused npm Dependencies (Medium Priority)

**Issue:** 6 dependencies installed but not imported in code.

**Unused Dependencies:**
```json
{
  "dependencies": {
    "@hookform/resolvers": "^3.10.0",      // Not used
    "@sanity/react-loader": "^1.11.22",    // Not used
    "date-fns": "^3.6.0",                  // Not used
    "styled-components": "^6.1.19"         // Legacy, not used
  },
  "devDependencies": {
    "@eslint/eslintrc": "^3",              // Not used
    "autoprefixer": "^10.4.21",            // Not used (Tailwind handles it)
    "eslint-config-next": "15.5.6",        // Not used
    "postcss": "^8.5.6"                    // Not used (Next.js handles it)
  }
}
```

**Missing Dependencies:**
```json
{
  "@portabletext/types": "needed in src/types/aiShowcase.ts",
  "uuid": "needed in src/scripts/export-case-studies-ndjson.ts"
}
```

**Impact:**
- ~2.5MB of node_modules bloat
- Security vulnerabilities in unused packages
- Slower npm install times
- Missing dependencies could cause runtime errors

**Recommendation:**
```bash
# Remove unused dependencies
npm uninstall @hookform/resolvers @sanity/react-loader date-fns styled-components
npm uninstall -D @eslint/eslintrc autoprefixer eslint-config-next postcss

# Add missing dependencies
npm install @portabletext/types uuid
```

**Effort:** 10 minutes  
**Priority:** Medium

---

### 1.3 Duplicate Mobile Detection Hooks (High Priority)

**Issue:** Two different hooks for detecting mobile viewports with slightly different logic.

**Files:**
```typescript
// src/hooks/useMediaQuery.ts (39 lines)
export function useMediaQuery(query: string): boolean { ... }
export function useIsDesktop(): boolean {
  return useMediaQuery('(min-width: 768px)');
}

// src/hooks/use-mobile.tsx (20 lines)
export function useIsMobile() {
  // Uses 767px breakpoint (max-width: 767px)
  const MOBILE_BREAKPOINT = 768
  return window.innerWidth < MOBILE_BREAKPOINT
}
```

**Usage:**
- `useMediaQuery`: Used in `src/components/FeaturedCaseStudies.tsx`
- `useIsMobile`: Not used anywhere (shadcn/ui default)

**Impact:**
- Inconsistent breakpoint logic (one uses min-width, other uses max-width)
- Code duplication
- Potential bugs from different breakpoint calculations

**Recommendation:**
```typescript
// Keep useMediaQuery.ts (more flexible)
// Delete use-mobile.tsx
// Update any imports to use useMediaQuery

// In FeaturedCaseStudies.tsx:
const isMobile = useMediaQuery('(max-width: 768px)');  // Keep consistent
```

**Effort:** 20 minutes  
**Priority:** High

---

### 1.4 Duplicate Toast Hook (Medium Priority)

**Issue:** Toast hook logic duplicated in two locations.

**Files:**
```typescript
// src/hooks/use-toast.ts (192 lines) - Full implementation
export { useToast, toast }

// src/components/ui/use-toast.ts (4 lines) - Just re-exports
import { useToast, toast } from "@/hooks/use-toast";
export { useToast, toast };
```

**Impact:**
- Confusing import paths
- Unnecessary file indirection

**Recommendation:**
```bash
# Remove the re-export wrapper
rm src/components/ui/use-toast.ts

# Update imports throughout codebase to use:
import { useToast } from "@/hooks/use-toast"
```

**Effort:** 15 minutes  
**Priority:** Medium

---

## 2. Hardcoded Values

### 2.1 Hardcoded Hex Colors in Design Concepts (High Priority)

**Issue:** Design concept files use hardcoded hex colors instead of CSS variables.

**File:** `src/components/design-concepts/TerminalDark.tsx`

**Examples:**
```tsx
// Line 18: border-[#00ff88]/20
// Line 23: text-[#00ff88]
// Line 31: bg-[#050510]
// Line 46: text-[#00ff88]
// 20+ instances total
```

**Impact:**
- Cannot adapt to light/dark mode
- Breaks design system consistency
- Hard to maintain and update color scheme

**Recommendation:**
```tsx
// Before:
className="text-[#00ff88]"
className="bg-[#050510]"

// After - add to globals.css:
:root {
  --terminal-accent: 142 100% 50%;  /* #00ff88 */
  --terminal-bg-dark: 240 22% 3%;   /* #050510 */
}

// In component:
className="text-[hsl(var(--terminal-accent))]"
className="bg-[hsl(var(--terminal-bg-dark))]"
```

**Effort:** 1 hour  
**Priority:** High (if design concepts will be used)  
**Priority:** Low (if design concepts are prototypes only)

---

### 2.2 Magic Numbers and Strings (Low Priority)

**Issue:** Various magic numbers that should be constants.

**Examples:**
```typescript
// src/lib/chatbot/hybrid-search.ts
await hybridSearch(embedding, query, keywords, 30, 0.25)  // Magic numbers

// src/app/api/chat/route.ts  
temperature: 0.8,  // No comment explaining why 0.8

// src/hooks/use-toast.ts
const TOAST_LIMIT = 1
const TOAST_REMOVE_DELAY = 1000000  // Why 1 million ms? (16.6 minutes)
```

**Recommendation:**
```typescript
// Create constants with documentation
const SEARCH_RESULT_LIMIT = 30;  // Maximum results to return
const SIMILARITY_THRESHOLD = 0.25;  // Minimum similarity score (0-1)
const CHAT_TEMPERATURE = 0.8;  // Higher for creative responses
```

**Effort:** 30 minutes  
**Priority:** Low

---

## 3. Console Statements & Debug Code

### 3.1 Console.log in Production Code (High Priority)

**Issue:** 144+ console.log/error/warn statements throughout codebase.

**Distribution:**
```
src/lib/chatbot/ingest-content.ts:     28 console statements
src/lib/chatbot/setup-database.ts:     18 console statements  
src/lib/chatbot/logging.ts:            16 console statements
src/lib/chatbot/hybrid-search.ts:      3 console statements
src/app/api/webhooks/sanity/route.ts:  7 console statements
src/app/api/chat/route.ts:             5 console statements
src/components/design-concepts/*:      1 console statement
src/app/(admin)/admin/*:               4 console statements
```

**Examples:**
```typescript
// src/app/api/chat/route.ts:144-148
console.log('=== FULL REQUEST BODY ===');
console.log(JSON.stringify(body, null, 2));
console.log('=== BODY KEYS ===');
console.log(Object.keys(body));
console.log('=== END DEBUG ===');

// src/lib/chatbot/hybrid-search.ts:71
console.error('Semantic search error:', error);

// src/lib/chatbot/ingest-content.ts - Many intentional CLI logs
console.log('🚀 Starting content ingestion...\n');
```

**Impact:**
- Performance overhead in production
- Security risk (exposing internal state)
- Cluttered browser console
- Unprofessional user experience

**Note:** Some console statements are intentional (CLI scripts like `ingest-content.ts`). Only production code needs cleanup.

**Recommendation:**
```typescript
// Option 1: Use the existing logger utility
import { logger } from '@/lib/logger';

// Replace console.log with:
logger.log('Debug info');  // Only logs in development
logger.error('Error info'); // Always logs
logger.critical('Critical error'); // Always logs with [CRITICAL] prefix

// Option 2: Remove debug console statements entirely
// Delete lines 144-148 in src/app/api/chat/route.ts
// Delete lines 17-20 in src/app/(admin)/admin/chat-logs/layout.tsx
```

**Effort:** 2 hours  
**Priority:** High

---

### 3.2 Debug Code in Admin Authentication (High Priority)

**Issue:** Password debugging code left in production.

**File:** `src/app/(admin)/admin/chat-logs/layout.tsx`

```typescript
// Lines 17-20
console.log('Environment variable loaded:', process.env.NEXT_PUBLIC_ADMIN_PASSWORD ? 'YES' : 'NO');
console.log('Password length:', ADMIN_PASSWORD.length);
console.log('First 3 chars:', ADMIN_PASSWORD.substring(0, 3));
console.log('Last 3 chars:', ADMIN_PASSWORD.substring(ADMIN_PASSWORD.length - 3));
```

**Impact:**
- **SECURITY RISK:** Leaks partial password in browser console
- Exposes admin authentication mechanism
- Should never be in production

**Recommendation:**
```typescript
// DELETE these lines entirely
// No conditional - this is a security issue
```

**Effort:** 2 minutes  
**Priority:** HIGH - SECURITY ISSUE

---

## 4. Technical Debt

### 4.1 TODO Comments (Low Priority)

**Issue:** 1 TODO comment found in codebase.

**File:** `src/app/api/admin/chat-logs/route.ts`

```typescript
// Line 13
// TODO: Add authentication check here
```

**Context:**
```typescript
export async function GET() {
  try {
    // TODO: Add authentication check here
    const logs = await getAllChatLogs();
    return Response.json(logs);
  }
```

**Impact:**
- Missing authentication on admin endpoint
- Security vulnerability

**Recommendation:**
```typescript
// Add authentication middleware or check
export async function GET(req: Request) {
  // Check admin auth
  const authHeader = req.headers.get('authorization');
  if (!authHeader || !isValidAdminToken(authHeader)) {
    return new Response('Unauthorized', { status: 401 });
  }
  
  const logs = await getAllChatLogs();
  return Response.json(logs);
}
```

**Effort:** 30 minutes  
**Priority:** High (security issue)

---

### 4.2 Missing Error Handling (Medium Priority)

**Issue:** Some API routes lack try-catch blocks.

**Analysis:**
- Total API route files: 4
- Routes with try-catch: 5 (some have multiple try blocks)
- Routes without try-catch: 0

**Status:** Good coverage, but error handling could be more consistent.

**Examples of Good Error Handling:**
```typescript
// src/app/api/chat/route.ts - Has try-catch ✓
// src/app/api/webhooks/sanity/route.ts - Has try-catch ✓
// src/app/api/admin/chatbot-sync/route.ts - Has try-catch ✓
```

**Recommendation:**
- Create shared error handling middleware
- Standardize error response format
- Add request ID tracking for debugging

**Effort:** 2 hours  
**Priority:** Medium

---

### 4.3 TypeScript `any` Usage (Medium Priority)

**Issue:** 24 instances of `any` type, reducing type safety.

**Distribution:**
```typescript
// src/lib/logger.ts - 5 instances (function args)
log: (...args: any[]) => { ... }

// src/lib/chatbot/hybrid-search.ts - 3 instances
metadata: any;

// src/lib/chatbot/logging.ts - 6 instances
messages: chatLog.messages as any,

// src/scripts/*.ts - 10 instances (migration scripts)
const extractJSON = (section: string): any => {
```

**Impact:**
- Lost type safety
- Harder to refactor
- Potential runtime errors

**Recommendation:**
```typescript
// Before:
metadata: any;

// After:
interface DocumentMetadata {
  source: string;
  title?: string;
  category?: string;
  [key: string]: unknown;  // For additional properties
}
metadata: DocumentMetadata;
```

**Effort:** 3 hours  
**Priority:** Medium

---

### 4.4 Inline Styles (Low Priority)

**Issue:** 60 instances of inline styles using `style={{}}` prop.

**Impact:**
- Less maintainable than Tailwind classes
- Cannot benefit from Tailwind's purging
- Harder to make responsive

**Examples:**
Most inline styles are in:
- Framer Motion animation properties (acceptable)
- Dynamic values that can't be Tailwind classes (acceptable)

**Recommendation:**
- Audit inline styles to see if any can be converted to Tailwind
- Keep inline styles only for truly dynamic values

**Effort:** 1 hour  
**Priority:** Low

---

### 4.5 Missing Test Coverage (Medium Priority)

**Issue:** Zero test files in the codebase.

**Findings:**
```bash
# Search results:
*.test.ts: 0 files
*.test.tsx: 0 files
*.spec.ts: 0 files  
*.spec.tsx: 0 files
```

**Note:** Project has Playwright configured for E2E tests in `tests/` directory (outside `src/`).

**Impact:**
- No unit test coverage
- Risk of regressions
- Harder to refactor with confidence

**Recommendation:**
```bash
# Add Vitest or Jest for unit tests
npm install -D vitest @testing-library/react @testing-library/jest-dom

# Priority test targets:
# 1. Utility functions (src/lib/utils.ts)
# 2. Custom hooks (src/hooks/*)
# 3. API routes (src/app/api/*)
# 4. Critical components (FeaturedCaseStudies, ChatSection)
```

**Effort:** 8 hours (initial setup + priority tests)  
**Priority:** Medium

---

## 5. Code Organization Issues

### 5.1 Large File Sizes (Low Priority)

**Issue:** Some files exceed recommended line counts.

**Largest Files:**
```
src/components/ui/sidebar.tsx:                  763 lines (UNUSED!)
src/scripts/comprehensive-chatbot-test.ts:      616 lines
src/scripts/export-profile-content-ndjson.ts:   542 lines
src/lib/chatbot/sanity-fetcher.ts:              493 lines
src/scripts/migrate-case-studies.ts:            469 lines
src/lib/chatbot/supabase.ts:                    443 lines
src/app/(public)/case-studies/[slug]/page.tsx:  427 lines
```

**Recommendation:**
- Delete sidebar.tsx (unused)
- Consider splitting scripts into smaller modules
- Case study page could be split into smaller components

**Effort:** 2-4 hours  
**Priority:** Low

---

### 5.2 Inconsistent File Naming (Low Priority)

**Issue:** Mix of kebab-case and PascalCase for component files.

**Examples:**
```
Good (PascalCase for components):
src/components/FeaturedCaseStudies.tsx
src/components/CaseStudySection.tsx

Good (kebab-case for utilities):
src/hooks/use-mobile.tsx
src/hooks/use-toast.ts

Inconsistent:
src/components/chatbot/  - kebab-case folder
src/components/ai-showcase/  - kebab-case folder
src/components/case-studies/  - kebab-case folder
```

**Recommendation:**
- This is actually consistent! Folders use kebab-case, components use PascalCase
- No action needed

**Priority:** None (already consistent)

---

## 6. Architecture & Patterns

### 6.1 Component Export Patterns (Good)

**Status:** ✅ All components use named exports consistently.

```typescript
// Consistent pattern throughout codebase:
export function FeaturedCaseStudies({ studies }: Props) { ... }
export function ChatSection() { ... }
export function NavigationPanel({ children }: Props) { ... }
```

**Recommendation:** Continue this pattern.

---

### 6.2 State Management (Good)

**Status:** ✅ Clean architecture with React hooks + TanStack Query.

- No prop drilling issues observed
- NavigationContext properly scoped
- TanStack Query for server state

**Recommendation:** Continue current approach.

---

## Actionable Recommendations

### Phase 1: Critical Fixes (4 hours)

**Priority: Security & Production Issues**

1. **Remove debug console logs** (2h)
   ```bash
   # Delete debug code in:
   # - src/app/api/chat/route.ts (lines 144-148)
   # - src/app/(admin)/admin/chat-logs/layout.tsx (lines 17-20)
   ```

2. **Add authentication to admin routes** (1h)
   ```typescript
   // src/app/api/admin/chat-logs/route.ts
   // Implement TODO on line 13
   ```

3. **Remove unused dependencies** (30m)
   ```bash
   npm uninstall @hookform/resolvers @sanity/react-loader date-fns styled-components
   npm uninstall -D @eslint/eslintrc autoprefixer eslint-config-next postcss
   npm install @portabletext/types uuid
   ```

4. **Delete unused UI components** (30m)
   ```bash
   rm src/components/ui/{breadcrumb,calendar,command,drawer,pagination,sidebar,textarea}.tsx
   ```

**Estimated Effort:** 4 hours  
**Impact:** High - Improved security, smaller bundle, cleaner code

---

### Phase 2: Code Quality (6 hours)

**Priority: Consistency & Maintainability**

1. **Consolidate mobile detection hooks** (1h)
   - Delete `use-mobile.tsx`
   - Standardize on `useMediaQuery`

2. **Replace console statements with logger** (2h)
   - Use existing `logger` utility
   - Keep CLI scripts as-is

3. **Add TypeScript types** (2h)
   - Replace `any` with proper interfaces
   - Focus on `hybrid-search.ts` and `logging.ts`

4. **Remove toast hook duplication** (30m)
   - Delete `src/components/ui/use-toast.ts`
   - Update import paths

5. **Add error handling middleware** (1.5h)
   - Create shared error handler
   - Standardize API error responses

**Estimated Effort:** 6 hours  
**Impact:** Medium - Better type safety, consistency

---

### Phase 3: Technical Debt (8 hours)

**Priority: Long-term Maintainability**

1. **Add unit test coverage** (4h)
   - Set up Vitest
   - Test critical utilities and hooks

2. **Fix hardcoded colors** (2h)
   - Move to CSS variables in design concepts
   - Only if design concepts will be used

3. **Refactor large files** (2h)
   - Split case study page into components
   - Modularize large scripts

**Estimated Effort:** 8 hours  
**Impact:** Medium - Improved maintainability, test coverage

---

## Summary by Priority

### High Priority (Must Fix)
- [ ] Remove password debug logging (SECURITY - 5 min)
- [ ] Add admin route authentication (SECURITY - 1 hour)
- [ ] Remove debug console.log statements (2 hours)
- [ ] Consolidate mobile detection hooks (1 hour)

**Total High Priority Effort:** ~4 hours

### Medium Priority (Should Fix)
- [ ] Remove unused UI components (15 min)
- [ ] Remove unused npm dependencies (10 min)
- [ ] Add TypeScript types for `any` usage (3 hours)
- [ ] Standardize error handling (2 hours)
- [ ] Add unit test coverage (4 hours)

**Total Medium Priority Effort:** ~9 hours

### Low Priority (Nice to Have)
- [ ] Extract magic numbers to constants (30 min)
- [ ] Fix hardcoded colors in design concepts (1 hour)
- [ ] Refactor large files (2 hours)

**Total Low Priority Effort:** ~3.5 hours

---

## Total Estimated Cleanup Effort

**Full Cleanup:** ~16.5 hours  
**Critical Issues Only:** ~4 hours  
**Quick Wins (unused code):** ~1 hour

---

## Conclusion

The codebase is well-structured with modern best practices, but contains some technical debt typical of rapid development. The most critical issues are security-related (debug logging, missing auth) and should be addressed immediately.

**Strengths:**
- Modern Next.js 15 + TypeScript architecture
- Clean component organization
- Good use of shadcn/ui component library
- Proper separation of concerns

**Areas for Improvement:**
- Remove production debug code
- Add authentication to admin routes  
- Clean up unused dependencies and components
- Improve TypeScript type coverage
- Add unit test coverage

**Recommended Priority:**
1. Fix security issues (Phase 1: 4 hours)
2. Remove unused code for smaller bundle (1 hour)
3. Improve type safety and error handling (Phase 2: 6 hours)
4. Add test coverage when time permits (Phase 3: 4 hours)

---

**Report Generated:** November 1, 2025  
**Next Review:** Recommend quarterly audits for ongoing maintenance
