# Technical Debt Cleanup - Implementation Plan

**Created**: November 1, 2025
**Source**: `/docs/codebase-audit-2025-11-01.md`
**Total Effort**: ~16.5 hours across 3 phases
**Priority**: High - Security and production issues must be addressed

---

## Executive Summary

This plan provides a step-by-step roadmap for addressing technical debt identified in the November 1, 2025 codebase audit. The plan is organized into three phases prioritized by severity and impact.

### Key Objectives
1. **Eliminate security vulnerabilities** (password logging, missing authentication)
2. **Remove production debug code** (144+ console statements)
3. **Reduce bundle size** (unused components, dependencies)
4. **Improve type safety** (replace 24 `any` usages)
5. **Establish test coverage** (currently 0 unit tests)

### Success Metrics
- **Security**: Zero password/sensitive data in console logs
- **Authentication**: Admin routes require proper authentication
- **Bundle Size**: Reduce by ~2.5MB (node_modules) and ~15-20KB (production bundle)
- **Type Safety**: Reduce `any` usage by 80% (from 24 to <5 instances)
- **Test Coverage**: Achieve >50% coverage on critical utilities and hooks
- **Console Logs**: Zero debug console statements in production code (CLI scripts exempted)

---

## Phase 1: Critical Security & Production Fixes

**Priority**: CRITICAL
**Duration**: 4 hours
**Impact**: High - Security vulnerabilities, production performance
**Dependencies**: None - can start immediately

### 1.1: Remove Password Debug Logging ⚠️ SECURITY

**File**: `src/app/(admin)/admin/chat-logs/layout.tsx`
**Lines**: 17-20
**Priority**: CRITICAL - Security vulnerability
**Effort**: 5 minutes

#### Current Issue
```typescript
// Lines 17-20 - MUST BE DELETED
console.log('Environment variable loaded:', process.env.NEXT_PUBLIC_ADMIN_PASSWORD ? 'YES' : 'NO');
console.log('Password length:', ADMIN_PASSWORD.length);
console.log('First 3 chars:', ADMIN_PASSWORD.substring(0, 3));
console.log('Last 3 chars:', ADMIN_PASSWORD.substring(ADMIN_PASSWORD.length - 3));
```

**Security Risk**: Leaks partial password in browser console

#### Implementation Steps
1. Open `src/app/(admin)/admin/chat-logs/layout.tsx`
2. Delete lines 17-20 entirely
3. Verify no other password logging exists in the file
4. Save file

#### Success Criteria
- [ ] Lines 17-20 are completely removed
- [ ] No console statements referencing ADMIN_PASSWORD remain
- [ ] File compiles without TypeScript errors
- [ ] Manual test: Open `/admin/chat-logs` in browser, check console - no password info
- [ ] Git grep confirms no password logging: `git grep -n "ADMIN_PASSWORD" src/`

#### Validation
```bash
# 1. Verify no password logging
grep -n "ADMIN_PASSWORD" src/app/(admin)/admin/chat-logs/layout.tsx

# 2. Build succeeds
npm run build

# 3. Manual browser test
npm run dev
# Open http://localhost:3000/admin/chat-logs
# Open browser console - should see NO password-related logs
```

**Acceptance**: Zero password-related console statements in production code

---

### 1.2: Add Authentication to Admin Routes ⚠️ SECURITY

**File**: `src/app/api/admin/chat-logs/route.ts`
**Line**: 13 (TODO comment)
**Priority**: HIGH - Security vulnerability
**Effort**: 1 hour

#### Current Issue
```typescript
export async function GET() {
  try {
    // TODO: Add authentication check here
    const logs = await getAllChatLogs();
    return Response.json(logs);
  }
```

**Security Risk**: Admin endpoint accessible without authentication

#### Implementation Steps

**Step 1: Create Auth Utility (15 min)**
1. Create `src/lib/auth/admin-auth.ts`
2. Implement authentication check function:

```typescript
// src/lib/auth/admin-auth.ts
export function verifyAdminAuth(request: Request): boolean {
  const authHeader = request.headers.get('authorization');

  if (!authHeader) {
    return false;
  }

  // Check for Bearer token format
  const [type, token] = authHeader.split(' ');

  if (type !== 'Bearer') {
    return false;
  }

  // Compare with environment variable
  const validToken = process.env.ADMIN_API_TOKEN;

  if (!validToken) {
    console.error('[AUTH] ADMIN_API_TOKEN not configured');
    return false;
  }

  return token === validToken;
}

export function createUnauthorizedResponse(): Response {
  return new Response(
    JSON.stringify({ error: 'Unauthorized', message: 'Valid authentication required' }),
    {
      status: 401,
      headers: { 'Content-Type': 'application/json' }
    }
  );
}
```

**Step 2: Update Chat Logs Route (10 min)**
1. Import auth utilities
2. Add authentication check
3. Return 401 for unauthorized requests

```typescript
// src/app/api/admin/chat-logs/route.ts
import { verifyAdminAuth, createUnauthorizedResponse } from '@/lib/auth/admin-auth';

export async function GET(request: Request) {
  // Verify authentication
  if (!verifyAdminAuth(request)) {
    return createUnauthorizedResponse();
  }

  try {
    const logs = await getAllChatLogs();
    return Response.json(logs);
  } catch (error) {
    console.error('Error fetching chat logs:', error);
    return new Response('Internal Server Error', { status: 500 });
  }
}
```

**Step 3: Update Chatbot Sync Route (10 min)**
1. Check `src/app/api/admin/chatbot-sync/route.ts`
2. Add authentication if missing
3. Follow same pattern as chat-logs route

**Step 4: Update Environment Variables (5 min)**
1. Add to `.env.local`:
```bash
ADMIN_API_TOKEN=your-secure-random-token-here
```

2. Add to `.env.example`:
```bash
# Admin API Authentication
ADMIN_API_TOKEN=generate-secure-token
```

3. Document in Vercel/production environment

**Step 5: Update Admin Dashboard Client (20 min)**
1. Update `src/app/(admin)/admin/chatbot-content/page.tsx`
2. Add authentication header to API calls:

```typescript
const response = await fetch('/api/admin/chatbot-sync', {
  headers: {
    'Authorization': `Bearer ${process.env.NEXT_PUBLIC_ADMIN_API_TOKEN}`
  }
});
```

#### Success Criteria
- [ ] Auth utility created and exports `verifyAdminAuth` and `createUnauthorizedResponse`
- [ ] All admin API routes check authentication
- [ ] Unauthorized requests return 401 with proper JSON response
- [ ] Authorized requests work correctly
- [ ] Environment variables documented in `.env.example`
- [ ] No TypeScript errors
- [ ] All admin routes tested (authenticated and unauthenticated)

#### Validation Tests

**Test 1: Unauthorized Request**
```bash
curl http://localhost:3000/api/admin/chat-logs
# Expected: 401 Unauthorized with JSON error
```

**Test 2: Authorized Request**
```bash
curl -H "Authorization: Bearer YOUR_TOKEN" http://localhost:3000/api/admin/chat-logs
# Expected: 200 OK with chat logs data
```

**Test 3: Invalid Token**
```bash
curl -H "Authorization: Bearer invalid-token" http://localhost:3000/api/admin/chat-logs
# Expected: 401 Unauthorized
```

**Test 4: Missing Authorization Header**
```bash
curl http://localhost:3000/api/admin/chatbot-sync
# Expected: 401 Unauthorized
```

**Acceptance**: All admin API routes require valid Bearer token authentication

---

### 1.3: Remove Debug Console Logs

**Files**: Multiple (see audit for full list)
**Priority**: HIGH - Production performance and security
**Effort**: 2 hours

#### Scope
- **144+ console statements** across codebase
- **Focus**: Production code only (keep CLI scripts)
- **Approach**: Replace with logger utility or remove entirely

#### Key Files to Update

**Priority 1: API Routes (30 min)**
- `src/app/api/chat/route.ts` - 5 console statements (lines 144-148 are debug blocks)
- `src/app/api/webhooks/sanity/route.ts` - 7 console statements
- `src/app/api/admin/chatbot-sync/route.ts` - 4 console statements

**Priority 2: Chatbot Library (60 min)**
- `src/lib/chatbot/hybrid-search.ts` - 3 console.error statements
- `src/lib/chatbot/logging.ts` - 16 console statements (some are intentional)
- `src/app/(admin)/admin/*` - 4 console statements

**Priority 3: Components (30 min)**
- `src/components/design-concepts/*` - 1 console statement

**Files to SKIP** (intentional CLI logging):
- `src/lib/chatbot/ingest-content.ts` - 28 statements (CLI script)
- `src/lib/chatbot/setup-database.ts` - 18 statements (CLI script)

#### Implementation Strategy

**Option A: Use Existing Logger (Recommended)**
```typescript
// Import logger
import { logger } from '@/lib/logger';

// Replace console.log with logger.log (dev only)
logger.log('Debug info');  // Only in development

// Keep error logging with logger.error
logger.error('Error details');  // Always logged

// Critical errors
logger.critical('Critical system error');  // Always logged with [CRITICAL]
```

**Option B: Remove Entirely**
- Delete debug console.log statements
- Keep only error logging with proper error handling

#### Step-by-Step Implementation

**Step 1: API Routes - Remove Debug Blocks (30 min)**

1. `src/app/api/chat/route.ts`:
```typescript
// DELETE THESE LINES (144-148):
console.log('=== FULL REQUEST BODY ===');
console.log(JSON.stringify(body, null, 2));
console.log('=== BODY KEYS ===');
console.log(Object.keys(body));
console.log('=== END DEBUG ===');
```

2. Review remaining console statements in API routes
3. Convert to logger or remove

**Step 2: Hybrid Search Error Handling (15 min)**

1. `src/lib/chatbot/hybrid-search.ts` (line 71):
```typescript
// BEFORE:
console.error('Semantic search error:', error);

// AFTER:
import { logger } from '@/lib/logger';
logger.error('Semantic search failed:', error);
```

**Step 3: Admin Components (15 min)**

1. `src/app/(admin)/admin/chat-logs/layout.tsx`
2. Remove any remaining console statements (after password debug removal)

**Step 4: Logging Utility Review (30 min)**

1. `src/lib/chatbot/logging.ts`:
   - Review 16 console statements
   - Determine which are intentional (chatbot logging functionality)
   - Keep those that are part of the logging system
   - Remove development debug statements

**Step 5: Components Cleanup (15 min)**

1. Search for console statements in components:
```bash
grep -rn "console\." src/components/ --include="*.tsx" --include="*.ts"
```

2. Remove or convert to logger

**Step 6: Final Audit (15 min)**

```bash
# Find all console statements in production code
grep -rn "console\." src/ \
  --include="*.ts" \
  --include="*.tsx" \
  --exclude-dir="chatbot/ingest*" \
  --exclude-dir="chatbot/setup*" \
  | grep -v "src/lib/chatbot/ingest-content.ts" \
  | grep -v "src/lib/chatbot/setup-database.ts" \
  | grep -v "src/lib/logger.ts"
```

#### Success Criteria
- [ ] No debug console.log blocks in API routes
- [ ] All console.error converted to logger.error
- [ ] CLI scripts (`ingest-content.ts`, `setup-database.ts`) still have console logs
- [ ] Logger utility used consistently across codebase
- [ ] Build completes without errors
- [ ] Manual testing shows clean browser console (no unexpected logs)

#### Validation

**Test 1: Build Check**
```bash
npm run build
# Should complete without errors
```

**Test 2: Console Audit**
```bash
# Count remaining console statements (excluding CLI scripts and logger)
grep -rn "console\." src/ \
  --include="*.ts" --include="*.tsx" \
  | grep -v "ingest-content.ts" \
  | grep -v "setup-database.ts" \
  | grep -v "logger.ts" \
  | wc -l

# Target: Significant reduction (aim for <10 intentional statements)
```

**Test 3: Runtime Check**
1. Start dev server: `npm run dev`
2. Open browser console
3. Navigate through app (homepage, case studies, AI showcase, chat)
4. Verify no unexpected debug logs appear

**Test 4: Production Build Check**
```bash
npm run build && npm run start
# Open production build, check console
```

**Acceptance**:
- Zero debug console logs in production code
- Proper error logging with logger utility
- CLI scripts retain their console output

---

### 1.4: Remove Unused Dependencies

**File**: `package.json`
**Priority**: HIGH - Bundle size, security
**Effort**: 30 minutes

#### Dependencies to Remove

**Production Dependencies (unused in code)**
```json
{
  "@hookform/resolvers": "^3.10.0",
  "@sanity/react-loader": "^1.11.22",
  "date-fns": "^3.6.0",
  "styled-components": "^6.1.19"
}
```

**Dev Dependencies (unused or redundant)**
```json
{
  "@eslint/eslintrc": "^3",
  "autoprefixer": "^10.4.21",
  "eslint-config-next": "15.5.6",
  "postcss": "^8.5.6"
}
```

**Missing Dependencies (needed but not installed)**
```json
{
  "@portabletext/types": "needed in src/types/aiShowcase.ts",
  "uuid": "needed in src/scripts/export-case-studies-ndjson.ts"
}
```

#### Implementation Steps

**Step 1: Verify Unused Dependencies (10 min)**
```bash
# Search for imports of each package
grep -r "@hookform/resolvers" src/
grep -r "@sanity/react-loader" src/
grep -r "date-fns" src/
grep -r "styled-components" src/
grep -r "@eslint/eslintrc" .
grep -r "autoprefixer" .
grep -r "eslint-config-next" .

# Each should return no results (or only in package.json)
```

**Step 2: Verify Missing Dependencies (5 min)**
```bash
# Confirm these are actually needed
grep -r "@portabletext/types" src/types/
grep -r "uuid" src/scripts/
```

**Step 3: Remove Unused Dependencies (5 min)**
```bash
npm uninstall @hookform/resolvers @sanity/react-loader date-fns styled-components
npm uninstall -D @eslint/eslintrc autoprefixer eslint-config-next postcss
```

**Step 4: Add Missing Dependencies (2 min)**
```bash
npm install @portabletext/types
npm install -D uuid @types/uuid
```

**Step 5: Verify Installation (5 min)**
```bash
# Check package.json updates
git diff package.json

# Check lockfile updates
git status

# Test build
npm run build
```

**Step 6: Clean node_modules (3 min)**
```bash
# Optional but recommended for clean state
rm -rf node_modules package-lock.json
npm install
```

#### Success Criteria
- [ ] 8 unused dependencies removed from package.json
- [ ] 2 missing dependencies added to package.json
- [ ] package-lock.json updated
- [ ] `npm run build` succeeds
- [ ] `npm run dev` works correctly
- [ ] All pages load without import errors
- [ ] TypeScript compilation succeeds

#### Validation

**Test 1: Build Verification**
```bash
npm run build
# Expected: Success with no errors
```

**Test 2: Type Check**
```bash
npx tsc --noEmit
# Expected: No errors related to missing types
```

**Test 3: Dev Server**
```bash
npm run dev
# Navigate to:
# - Homepage (/)
# - Case Studies (/case-studies)
# - AI Showcase (/ai-showcase)
# - About (/about)
# - Admin (/admin/chatbot-content)
# All should load without errors
```

**Test 4: Bundle Size Check**
```bash
# Compare node_modules size before/after
du -sh node_modules
# Expected: ~2.5MB reduction
```

**Acceptance**:
- All unused dependencies removed
- All missing dependencies added
- No import errors
- Build succeeds
- All pages function correctly

---

### 1.5: Delete Unused UI Components

**Directory**: `src/components/ui/`
**Priority**: MEDIUM-HIGH - Bundle size
**Effort**: 15 minutes

#### Components to Remove

These 7 shadcn/ui components are not referenced anywhere:

```bash
src/components/ui/breadcrumb.tsx      # 145 lines
src/components/ui/calendar.tsx        # 78 lines
src/components/ui/command.tsx         # 156 lines
src/components/ui/drawer.tsx          # 121 lines
src/components/ui/pagination.tsx      # 98 lines
src/components/ui/sidebar.tsx         # 763 lines (LARGEST!)
src/components/ui/textarea.tsx        # 45 lines
```

**Total**: ~1,406 lines of unused code

#### Implementation Steps

**Step 1: Verify Components Are Unused (5 min)**
```bash
# Check each component for usage
for component in breadcrumb calendar command drawer pagination sidebar textarea; do
  echo "Checking $component..."
  grep -r "from.*ui/$component" src/ --include="*.tsx" --include="*.ts"
  grep -r "import.*${component^}" src/ --include="*.tsx" --include="*.ts"
done

# Each should return no results
```

**Step 2: Create Backup (2 min)**
```bash
# Optional: backup to docs folder before deletion
mkdir -p docs/_archive/unused-ui-components-2025-11-01
cp src/components/ui/{breadcrumb,calendar,command,drawer,pagination,sidebar,textarea}.tsx \
   docs/_archive/unused-ui-components-2025-11-01/
```

**Step 3: Delete Components (2 min)**
```bash
rm src/components/ui/breadcrumb.tsx
rm src/components/ui/calendar.tsx
rm src/components/ui/command.tsx
rm src/components/ui/drawer.tsx
rm src/components/ui/pagination.tsx
rm src/components/ui/sidebar.tsx
rm src/components/ui/textarea.tsx
```

**Step 4: Verify Deletion (3 min)**
```bash
# Confirm files are deleted
ls src/components/ui/

# Test build
npm run build
```

**Step 5: Git Status (3 min)**
```bash
git status
# Should show 7 deleted files
```

#### Success Criteria
- [ ] All 7 unused components deleted
- [ ] No import errors when building
- [ ] TypeScript compilation succeeds
- [ ] All pages still render correctly
- [ ] No "module not found" errors in browser console
- [ ] Git shows clean deletion (no other files affected)

#### Validation

**Test 1: File Check**
```bash
# Verify components are gone
ls src/components/ui/breadcrumb.tsx 2>/dev/null && echo "FAIL: Still exists" || echo "PASS: Deleted"
ls src/components/ui/sidebar.tsx 2>/dev/null && echo "FAIL: Still exists" || echo "PASS: Deleted"
```

**Test 2: Build Check**
```bash
npm run build
# Expected: Success with no errors about missing components
```

**Test 3: Import Check**
```bash
# Verify no orphaned imports
grep -r "from.*ui/breadcrumb" src/
grep -r "from.*ui/sidebar" src/
# Expected: No results
```

**Test 4: Runtime Check**
```bash
npm run dev
# Navigate through all pages
# Expected: No errors
```

**Acceptance**:
- 7 components deleted
- No import errors
- ~1,400 lines removed
- ~15-20KB bundle reduction

---

## Phase 1 Completion Checklist

Before proceeding to Phase 2, verify:

- [ ] **Security**: Password debug logging removed (1.1)
- [ ] **Security**: Admin routes require authentication (1.2)
- [ ] **Production**: Debug console logs removed/converted (1.3)
- [ ] **Dependencies**: Unused packages removed, missing added (1.4)
- [ ] **Bundle Size**: Unused UI components deleted (1.5)
- [ ] **Build**: `npm run build` succeeds
- [ ] **Tests**: All manual validation tests pass
- [ ] **Git**: Changes reviewed and ready to commit

### Phase 1 Success Metrics
- ✅ Zero password leaks in console
- ✅ All admin routes authenticated
- ✅ <10 console statements in production code (excluding CLI)
- ✅ ~2.5MB node_modules reduction
- ✅ ~15-20KB production bundle reduction
- ✅ Build succeeds with no errors

**Estimated Completion Time**: 4 hours
**Actual Completion Time**: ________

---

## Phase 2: Code Quality & Consistency

**Priority**: MEDIUM-HIGH
**Duration**: 6 hours
**Impact**: Medium - Type safety, code maintainability
**Dependencies**: Phase 1 must be complete

### 2.1: Consolidate Mobile Detection Hooks

**Files**:
- `src/hooks/useMediaQuery.ts` (keep)
- `src/hooks/use-mobile.tsx` (delete)

**Priority**: MEDIUM
**Effort**: 20 minutes

#### Current Issue

Two different hooks with inconsistent logic:

```typescript
// useMediaQuery.ts (KEEP THIS)
export function useIsDesktop(): boolean {
  return useMediaQuery('(min-width: 768px)');
}

// use-mobile.tsx (DELETE THIS)
export function useIsMobile() {
  const MOBILE_BREAKPOINT = 768
  return window.innerWidth < MOBILE_BREAKPOINT  // Different approach!
}
```

**Problem**:
- Different breakpoint logic (min-width vs max-width)
- `use-mobile.tsx` is unused (shadcn default)
- Potential for bugs if both are used

#### Implementation Steps

**Step 1: Verify use-mobile.tsx Is Unused (5 min)**
```bash
grep -r "use-mobile" src/ --include="*.tsx" --include="*.ts"
grep -r "useIsMobile" src/ --include="*.tsx" --include="*.ts"

# Should find no imports (only the file itself)
```

**Step 2: Verify useMediaQuery Usage (5 min)**
```bash
grep -r "useMediaQuery" src/ --include="*.tsx" --include="*.ts"
grep -r "useIsDesktop" src/ --include="*.tsx" --include="*.ts"

# Should find usage in FeaturedCaseStudies.tsx and other components
```

**Step 3: Delete use-mobile.tsx (2 min)**
```bash
rm src/hooks/use-mobile.tsx
```

**Step 4: Document useMediaQuery Pattern (5 min)**

Add JSDoc to `useMediaQuery.ts`:

```typescript
/**
 * Custom hook for responsive media queries
 *
 * @param query - CSS media query string (e.g., '(min-width: 768px)')
 * @returns boolean indicating if the media query matches
 *
 * @example
 * // Check if viewport is mobile
 * const isMobile = useMediaQuery('(max-width: 767px)')
 *
 * // Check if viewport is desktop
 * const isDesktop = useMediaQuery('(min-width: 768px)')
 *
 * // Check for dark mode preference
 * const prefersDark = useMediaQuery('(prefers-color-scheme: dark)')
 */
export function useMediaQuery(query: string): boolean {
  // ... existing implementation
}

/**
 * Convenience hook to check if viewport is desktop size or larger
 * Breakpoint: 768px (matches Tailwind's 'md' breakpoint)
 */
export function useIsDesktop(): boolean {
  return useMediaQuery('(min-width: 768px)');
}
```

**Step 5: Verify Build (3 min)**
```bash
npm run build
```

#### Success Criteria
- [ ] `use-mobile.tsx` deleted
- [ ] `useMediaQuery.ts` has JSDoc documentation
- [ ] No imports of `use-mobile` or `useIsMobile` exist
- [ ] Build succeeds
- [ ] No TypeScript errors
- [ ] All components using media queries still work

#### Validation

**Test 1: Import Check**
```bash
# Should return no results
grep -r "from.*use-mobile" src/
```

**Test 2: Build Check**
```bash
npm run build
# Expected: Success
```

**Test 3: Runtime Check**
```bash
npm run dev
# Test components that use media queries:
# - FeaturedCaseStudies (responsive grid)
# - Navigation (mobile menu)
# Resize browser window to verify responsive behavior
```

**Acceptance**:
- Single media query hook
- Consistent breakpoint logic
- Documentation in place
- All responsive features work

---

### 2.2: Remove Toast Hook Duplication

**Files**:
- `src/hooks/use-toast.ts` (keep - 192 lines, full implementation)
- `src/components/ui/use-toast.ts` (delete - 4 lines, just re-exports)

**Priority**: MEDIUM
**Effort**: 15 minutes

#### Current Issue

Unnecessary re-export wrapper:

```typescript
// src/components/ui/use-toast.ts (DELETE THIS)
import { useToast, toast } from "@/hooks/use-toast";
export { useToast, toast };
```

**Problem**: Confusing import paths, unnecessary indirection

#### Implementation Steps

**Step 1: Find All use-toast Imports (5 min)**
```bash
# Find all imports
grep -rn "from.*use-toast" src/ --include="*.tsx" --include="*.ts"

# Document current usage:
# - Components importing from @/hooks/use-toast
# - Components importing from @/components/ui/use-toast
```

**Step 2: Update Imports (5 min)**

Change all imports to use the canonical location:

```typescript
// BEFORE (if using UI location):
import { useToast } from "@/components/ui/use-toast"

// AFTER (canonical location):
import { useToast } from "@/hooks/use-toast"
```

Likely files to update:
- `src/components/ui/sonner.tsx` (if exists)
- Any components using toast notifications

**Step 3: Delete Re-export File (2 min)**
```bash
rm src/components/ui/use-toast.ts
```

**Step 4: Verify Build (3 min)**
```bash
npm run build
```

#### Success Criteria
- [ ] `src/components/ui/use-toast.ts` deleted
- [ ] All imports updated to `@/hooks/use-toast`
- [ ] No "module not found" errors
- [ ] Build succeeds
- [ ] Toast notifications still work

#### Validation

**Test 1: Import Check**
```bash
# All imports should use @/hooks/use-toast
grep -rn "from.*use-toast" src/

# Should NOT find @/components/ui/use-toast
```

**Test 2: Build Check**
```bash
npm run build
# Expected: Success
```

**Test 3: Runtime Check**
```bash
npm run dev
# Test toast functionality:
# - Admin sync actions
# - Form submissions
# - Error notifications
```

**Acceptance**:
- Single import location
- No re-export wrapper
- Toast functionality intact

---

### 2.3: Add TypeScript Types (Replace `any`)

**Files**: Multiple (24 instances of `any`)
**Priority**: MEDIUM
**Effort**: 3 hours

#### Scope

**Primary Targets** (18 instances):
- `src/lib/logger.ts` - 5 instances (function args)
- `src/lib/chatbot/hybrid-search.ts` - 3 instances (metadata)
- `src/lib/chatbot/logging.ts` - 6 instances (message casting)
- `src/lib/chatbot/supabase.ts` - 4 instances

**Secondary Targets** (6 instances):
- Migration scripts in `src/scripts/` - 10 instances (lower priority)

#### Implementation Strategy

Focus on library code first (highest impact on type safety).

---

**Task 2.3.1: Fix Logger Types (30 min)**

**File**: `src/lib/logger.ts`

**Current Issue**:
```typescript
log: (...args: any[]) => { ... }
error: (...args: any[]) => { ... }
critical: (...args: any[]) => { ... }
```

**Solution**:
```typescript
// Define proper types for console arguments
type ConsoleArgument = string | number | boolean | object | Error | unknown;

export const logger = {
  log: (...args: ConsoleArgument[]) => {
    if (process.env.NODE_ENV === 'development') {
      console.log(...args);
    }
  },

  error: (...args: ConsoleArgument[]) => {
    console.error(...args);
  },

  critical: (...args: ConsoleArgument[]) => {
    console.error('[CRITICAL]', ...args);
  }
};
```

**Success Criteria**:
- [ ] All `any` replaced with `ConsoleArgument` type
- [ ] Type safety maintained for all use cases
- [ ] No TypeScript errors
- [ ] Logger still accepts multiple argument types

**Validation**:
```bash
# Check type errors
npx tsc --noEmit

# Test usage in components
grep -A 2 "logger\." src/lib/chatbot/*.ts
```

---

**Task 2.3.2: Fix Hybrid Search Metadata (45 min)**

**File**: `src/lib/chatbot/hybrid-search.ts`

**Current Issue**:
```typescript
metadata: any;
```

**Solution**:

Create proper type definitions:

```typescript
// Add to src/types/chatbot.ts (or create if doesn't exist)

export interface DocumentMetadata {
  source: string;
  sourceType: 'sanity' | 'transcript' | 'custom';
  title?: string;
  category?: string;
  slug?: string;
  tags?: string[];
  lastUpdated?: string;
  [key: string]: unknown;  // Allow additional properties
}

export interface SearchResult {
  id: string;
  content: string;
  metadata: DocumentMetadata;
  similarity?: number;
  rank?: number;
}

export interface HybridSearchOptions {
  limit?: number;
  threshold?: number;
  weights?: {
    semantic: number;
    keyword: number;
  };
}
```

Update `hybrid-search.ts`:

```typescript
import { SearchResult, HybridSearchOptions, DocumentMetadata } from '@/types/chatbot';

export async function hybridSearch(
  embedding: number[],
  query: string,
  keywords: string[],
  limit: number = 30,
  threshold: number = 0.25
): Promise<SearchResult[]> {
  // ... implementation with proper types
}
```

**Success Criteria**:
- [ ] `DocumentMetadata` interface created
- [ ] `SearchResult` interface created
- [ ] All `any` metadata replaced with `DocumentMetadata`
- [ ] Type inference works correctly
- [ ] No TypeScript errors
- [ ] Autocomplete works for metadata properties

**Validation**:
```bash
# Type check
npx tsc --noEmit

# Test in development
npm run dev
# Trigger search in chatbot
```

---

**Task 2.3.3: Fix Logging Types (45 min)**

**File**: `src/lib/chatbot/logging.ts`

**Current Issue**:
```typescript
messages: chatLog.messages as any,
```

**Solution**:

Define proper message types:

```typescript
// Add to src/types/chatbot.ts

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date | string;
  metadata?: {
    sources?: string[];
    model?: string;
    [key: string]: unknown;
  };
}

export interface ChatLog {
  id: string;
  sessionId: string;
  messages: ChatMessage[];
  createdAt: Date | string;
  updatedAt?: Date | string;
  metadata?: {
    userAgent?: string;
    ipAddress?: string;
    [key: string]: unknown;
  };
}
```

Update `logging.ts`:

```typescript
import { ChatLog, ChatMessage } from '@/types/chatbot';

export async function saveChatLog(log: ChatLog): Promise<void> {
  // Validate message structure
  const validatedMessages: ChatMessage[] = log.messages.map(msg => ({
    id: msg.id,
    role: msg.role,
    content: msg.content,
    timestamp: msg.timestamp,
    metadata: msg.metadata
  }));

  // ... rest of implementation
}
```

**Success Criteria**:
- [ ] `ChatMessage` interface created
- [ ] `ChatLog` interface created
- [ ] All `as any` casts removed
- [ ] Proper validation in place
- [ ] Type safety for message handling
- [ ] No TypeScript errors

**Validation**:
```bash
# Type check
npx tsc --noEmit

# Test chat logging
npm run dev
# Send messages in chat, verify logs are saved correctly
```

---

**Task 2.3.4: Audit Remaining `any` Usage (30 min)**

**Scope**: Review remaining instances

**Step 1: Find All Remaining `any`**
```bash
grep -rn ": any" src/ --include="*.ts" --include="*.tsx" \
  | grep -v "node_modules" \
  | grep -v ".next"
```

**Step 2: Categorize**
- **Must fix**: Public APIs, exported functions, shared utilities
- **Should fix**: Internal functions, component props
- **Can defer**: Migration scripts, one-off utilities

**Step 3: Create Issues**
Document any remaining `any` that can't be fixed immediately:

```typescript
// TODO: Replace `any` with proper type
// See: docs/implementation-plans/tech-debt-cleanup-plan-2025-11-01.md
// eslint-disable-next-line @typescript-eslint/no-explicit-any
metadata: any;
```

**Success Criteria**:
- [ ] All `any` usages documented
- [ ] Critical paths have proper types
- [ ] ESLint disable comments added where needed
- [ ] Follow-up tasks created for deferred fixes

---

#### Section 2.3 Success Criteria (Overall)

- [ ] Logger types fixed (0/5 `any` in logger.ts)
- [ ] Hybrid search types fixed (0/3 `any` in hybrid-search.ts)
- [ ] Logging types fixed (0/6 `any` in logging.ts)
- [ ] `src/types/chatbot.ts` created with comprehensive types
- [ ] Remaining `any` documented with TODO comments
- [ ] `npx tsc --noEmit` shows 80% reduction in `any` usage
- [ ] All typed code has autocomplete/IntelliSense support

#### Validation

**Test 1: Type Check**
```bash
npx tsc --noEmit
# Count any-related warnings before/after
```

**Test 2: Count `any` Usage**
```bash
# Before (should be ~24)
grep -rn ": any" src/ --include="*.ts" --include="*.tsx" | wc -l

# After (target: <5)
grep -rn ": any" src/ --include="*.ts" --include="*.tsx" | wc -l
```

**Test 3: Autocomplete Check**
- Open VSCode
- Type `metadata.` in hybrid-search.ts
- Verify autocomplete shows `source`, `title`, `category`, etc.

**Acceptance**:
- 80% reduction in `any` usage (24 → <5)
- Critical paths fully typed
- Autocomplete works throughout

---

### 2.4: Standardize Error Handling

**Scope**: API routes and utility functions
**Priority**: MEDIUM
**Effort**: 2 hours

#### Current State

**Good**: All 4 API route files have try-catch blocks
**Issue**: Inconsistent error response formats and logging

**Examples of Inconsistency**:
```typescript
// Route 1: Plain text
return new Response('Internal Server Error', { status: 500 });

// Route 2: JSON
return Response.json({ error: 'Failed to process' }, { status: 500 });

// Route 3: Different structure
return Response.json({ success: false, message: 'Error' });
```

#### Implementation Steps

**Step 1: Create Error Handler Utility (30 min)**

Create `src/lib/error-handler.ts`:

```typescript
import { logger } from '@/lib/logger';

export interface ApiError {
  error: string;
  message: string;
  statusCode: number;
  requestId?: string;
  timestamp: string;
}

export interface ApiErrorOptions {
  error?: Error | unknown;
  statusCode?: number;
  userMessage?: string;
  logLevel?: 'error' | 'critical';
  requestId?: string;
}

export function handleApiError(
  error: unknown,
  options: ApiErrorOptions = {}
): Response {
  const {
    statusCode = 500,
    userMessage = 'An unexpected error occurred',
    logLevel = 'error',
    requestId
  } = options;

  // Log the error
  const logFn = logLevel === 'critical' ? logger.critical : logger.error;
  logFn('API Error:', error);

  // Create standardized error response
  const errorResponse: ApiError = {
    error: error instanceof Error ? error.name : 'UnknownError',
    message: userMessage,
    statusCode,
    requestId,
    timestamp: new Date().toISOString()
  };

  return Response.json(errorResponse, { status: statusCode });
}

export function createApiResponse<T>(
  data: T,
  options: { status?: number; headers?: HeadersInit } = {}
): Response {
  const { status = 200, headers = {} } = options;

  return Response.json(
    {
      success: true,
      data,
      timestamp: new Date().toISOString()
    },
    {
      status,
      headers: {
        'Content-Type': 'application/json',
        ...headers
      }
    }
  );
}
```

**Step 2: Update Chat API Route (20 min)**

`src/app/api/chat/route.ts`:

```typescript
import { handleApiError, createApiResponse } from '@/lib/error-handler';

export async function POST(request: Request) {
  try {
    // ... existing logic

    return createApiResponse({ messages, response });

  } catch (error) {
    return handleApiError(error, {
      statusCode: 500,
      userMessage: 'Failed to process chat message',
      logLevel: 'critical'
    });
  }
}
```

**Step 3: Update Sanity Webhook Route (20 min)**

`src/app/api/webhooks/sanity/route.ts`:

```typescript
import { handleApiError, createApiResponse } from '@/lib/error-handler';

export async function POST(request: Request) {
  try {
    // Verify signature
    const isValid = await verifySignature(request);
    if (!isValid) {
      return handleApiError(new Error('Invalid signature'), {
        statusCode: 401,
        userMessage: 'Unauthorized',
        logLevel: 'critical'
      });
    }

    // ... process webhook

    return createApiResponse({ synced: true });

  } catch (error) {
    return handleApiError(error, {
      statusCode: 500,
      userMessage: 'Webhook processing failed'
    });
  }
}
```

**Step 4: Update Admin Routes (20 min)**

`src/app/api/admin/chat-logs/route.ts`:
`src/app/api/admin/chatbot-sync/route.ts`:

```typescript
import { handleApiError, createApiResponse } from '@/lib/error-handler';
import { verifyAdminAuth, createUnauthorizedResponse } from '@/lib/auth/admin-auth';

export async function GET(request: Request) {
  if (!verifyAdminAuth(request)) {
    return createUnauthorizedResponse();
  }

  try {
    const data = await fetchData();
    return createApiResponse(data);
  } catch (error) {
    return handleApiError(error, {
      statusCode: 500,
      userMessage: 'Failed to fetch data',
      logLevel: 'error'
    });
  }
}
```

**Step 5: Add Request ID Tracking (30 min)**

Create middleware for request tracking:

```typescript
// src/lib/middleware/request-id.ts

import { NextRequest } from 'next/server';

export function generateRequestId(): string {
  return `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

export function getRequestId(request: Request | NextRequest): string {
  // Try to get from header first
  const headerRequestId = request.headers.get('x-request-id');

  if (headerRequestId) {
    return headerRequestId;
  }

  // Generate new one
  return generateRequestId();
}
```

Update error handler to use request IDs:

```typescript
// In handleApiError
const requestId = options.requestId || 'unknown';

logger.error(`[${requestId}] API Error:`, error);
```

#### Success Criteria
- [ ] `error-handler.ts` utility created
- [ ] All API routes use `handleApiError`
- [ ] All success responses use `createApiResponse`
- [ ] Consistent JSON error format across all routes
- [ ] Request ID tracking implemented
- [ ] Error logs include request IDs
- [ ] All routes tested with error scenarios
- [ ] TypeScript compilation succeeds

#### Validation

**Test 1: Error Response Format**
```bash
# Test each API route with error scenario

# Chat route (malformed request)
curl -X POST http://localhost:3000/api/chat \
  -H "Content-Type: application/json" \
  -d '{"invalid": true}'

# Expected: Standardized error JSON with timestamp, requestId

# Admin route (unauthorized)
curl http://localhost:3000/api/admin/chat-logs

# Expected: 401 with standard format
```

**Test 2: Success Response Format**
```bash
# Test successful requests
curl -H "Authorization: Bearer TOKEN" \
  http://localhost:3000/api/admin/chat-logs

# Expected: { success: true, data: {...}, timestamp: "..." }
```

**Test 3: Request ID Tracking**
```bash
# Send request with custom request ID
curl -X POST http://localhost:3000/api/chat \
  -H "X-Request-ID: test-123" \
  -H "Content-Type: application/json" \
  -d '{"messages": []}'

# Check logs for "test-123"
```

**Acceptance**:
- All API errors use standard format
- All responses include timestamps
- Request IDs tracked throughout
- Error logs are actionable

---

## Phase 2 Completion Checklist

Before proceeding to Phase 3, verify:

- [ ] Mobile detection consolidated to single hook (2.1)
- [ ] Toast hook duplication removed (2.2)
- [ ] TypeScript `any` usage reduced by 80% (2.3)
- [ ] Error handling standardized across API routes (2.4)
- [ ] All validation tests pass
- [ ] `npx tsc --noEmit` shows significant type improvement
- [ ] Build succeeds with no errors

### Phase 2 Success Metrics
- ✅ Single media query hook used consistently
- ✅ Single toast import location
- ✅ <5 instances of `any` in production code
- ✅ All API routes use standard error handling
- ✅ Request ID tracking in place
- ✅ Improved autocomplete/IntelliSense

**Estimated Completion Time**: 6 hours
**Actual Completion Time**: ________

---

## Phase 3: Long-term Maintainability

**Priority**: MEDIUM
**Duration**: 8 hours
**Impact**: Medium - Test coverage, future maintainability
**Dependencies**: Phases 1 and 2 must be complete

### 3.1: Add Unit Test Coverage

**Current State**: 0 test files
**Priority**: MEDIUM
**Effort**: 4 hours

#### Scope

**Priority Test Targets**:
1. Utility functions (highest value, easiest to test)
2. Custom hooks (medium complexity)
3. Critical library functions (chatbot, auth)

#### Implementation Steps

**Step 1: Install Testing Dependencies (10 min)**

```bash
npm install -D vitest @testing-library/react @testing-library/jest-dom @testing-library/user-event @vitejs/plugin-react jsdom
```

**Step 2: Configure Vitest (20 min)**

Create `vitest.config.ts`:

```typescript
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './vitest.setup.ts',
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
```

Create `vitest.setup.ts`:

```typescript
import '@testing-library/jest-dom';
import { cleanup } from '@testing-library/react';
import { afterEach } from 'vitest';

// Cleanup after each test
afterEach(() => {
  cleanup();
});
```

Update `package.json`:

```json
{
  "scripts": {
    "test": "vitest",
    "test:ui": "vitest --ui",
    "test:coverage": "vitest --coverage"
  }
}
```

**Step 3: Test Utility Functions (60 min)**

Create `src/lib/__tests__/utils.test.ts`:

```typescript
import { describe, it, expect } from 'vitest';
import { cn } from '../utils';

describe('cn (className utility)', () => {
  it('merges class names', () => {
    expect(cn('text-red-500', 'bg-blue-500')).toBe('text-red-500 bg-blue-500');
  });

  it('handles conditional classes', () => {
    expect(cn('base', true && 'conditional')).toContain('conditional');
    expect(cn('base', false && 'conditional')).not.toContain('conditional');
  });

  it('handles Tailwind conflicts correctly', () => {
    // clsx + tailwind-merge should resolve conflicts
    const result = cn('px-2', 'px-4');
    expect(result).toBe('px-4'); // Later value wins
  });

  it('handles undefined and null', () => {
    expect(cn('base', undefined, null)).toBe('base');
  });

  it('handles arrays', () => {
    expect(cn(['text-sm', 'font-bold'])).toContain('text-sm');
    expect(cn(['text-sm', 'font-bold'])).toContain('font-bold');
  });
});
```

**Step 4: Test Custom Hooks (60 min)**

Create `src/hooks/__tests__/useMediaQuery.test.ts`:

```typescript
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useMediaQuery, useIsDesktop } from '../useMediaQuery';

describe('useMediaQuery', () => {
  let matchMediaMock: any;

  beforeEach(() => {
    matchMediaMock = vi.fn();
    window.matchMedia = matchMediaMock;
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('returns true when media query matches', () => {
    matchMediaMock.mockReturnValue({
      matches: true,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    });

    const { result } = renderHook(() => useMediaQuery('(min-width: 768px)'));
    expect(result.current).toBe(true);
  });

  it('returns false when media query does not match', () => {
    matchMediaMock.mockReturnValue({
      matches: false,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    });

    const { result } = renderHook(() => useMediaQuery('(min-width: 768px)'));
    expect(result.current).toBe(false);
  });

  it('updates when media query changes', () => {
    const listeners: ((e: any) => void)[] = [];

    matchMediaMock.mockReturnValue({
      matches: false,
      addEventListener: (event: string, listener: (e: any) => void) => {
        listeners.push(listener);
      },
      removeEventListener: vi.fn(),
    });

    const { result } = renderHook(() => useMediaQuery('(min-width: 768px)'));
    expect(result.current).toBe(false);

    // Simulate media query change
    listeners.forEach(listener => listener({ matches: true }));

    // Note: This test may need adjustment based on actual hook implementation
  });
});

describe('useIsDesktop', () => {
  it('checks for min-width: 768px', () => {
    const matchMediaMock = vi.fn().mockReturnValue({
      matches: true,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    });

    window.matchMedia = matchMediaMock;

    const { result } = renderHook(() => useIsDesktop());

    expect(matchMediaMock).toHaveBeenCalledWith('(min-width: 768px)');
    expect(result.current).toBe(true);
  });
});
```

**Step 5: Test Auth Utility (45 min)**

Create `src/lib/auth/__tests__/admin-auth.test.ts`:

```typescript
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { verifyAdminAuth, createUnauthorizedResponse } from '../admin-auth';

describe('verifyAdminAuth', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    process.env = { ...originalEnv };
    process.env.ADMIN_API_TOKEN = 'test-token-123';
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  it('returns true for valid bearer token', () => {
    const request = new Request('http://localhost:3000/api/admin/test', {
      headers: {
        'Authorization': 'Bearer test-token-123'
      }
    });

    expect(verifyAdminAuth(request)).toBe(true);
  });

  it('returns false for missing authorization header', () => {
    const request = new Request('http://localhost:3000/api/admin/test');
    expect(verifyAdminAuth(request)).toBe(false);
  });

  it('returns false for invalid token', () => {
    const request = new Request('http://localhost:3000/api/admin/test', {
      headers: {
        'Authorization': 'Bearer wrong-token'
      }
    });

    expect(verifyAdminAuth(request)).toBe(false);
  });

  it('returns false for malformed authorization header', () => {
    const request = new Request('http://localhost:3000/api/admin/test', {
      headers: {
        'Authorization': 'invalid-format'
      }
    });

    expect(verifyAdminAuth(request)).toBe(false);
  });

  it('returns false when ADMIN_API_TOKEN not configured', () => {
    delete process.env.ADMIN_API_TOKEN;

    const request = new Request('http://localhost:3000/api/admin/test', {
      headers: {
        'Authorization': 'Bearer any-token'
      }
    });

    expect(verifyAdminAuth(request)).toBe(false);
  });
});

describe('createUnauthorizedResponse', () => {
  it('returns 401 response', async () => {
    const response = createUnauthorizedResponse();
    expect(response.status).toBe(401);
  });

  it('returns JSON error message', async () => {
    const response = createUnauthorizedResponse();
    const body = await response.json();

    expect(body).toHaveProperty('error');
    expect(body.error).toBe('Unauthorized');
  });
});
```

**Step 6: Test Error Handler (45 min)**

Create `src/lib/__tests__/error-handler.test.ts`:

```typescript
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { handleApiError, createApiResponse } from '../error-handler';

describe('handleApiError', () => {
  beforeEach(() => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('returns 500 status by default', async () => {
    const error = new Error('Test error');
    const response = handleApiError(error);

    expect(response.status).toBe(500);
  });

  it('returns custom status code', async () => {
    const error = new Error('Not found');
    const response = handleApiError(error, { statusCode: 404 });

    expect(response.status).toBe(404);
  });

  it('returns standardized error JSON', async () => {
    const error = new Error('Test error');
    const response = handleApiError(error, {
      userMessage: 'Something went wrong'
    });

    const body = await response.json();

    expect(body).toHaveProperty('error');
    expect(body).toHaveProperty('message');
    expect(body).toHaveProperty('statusCode');
    expect(body).toHaveProperty('timestamp');
    expect(body.message).toBe('Something went wrong');
  });

  it('includes request ID when provided', async () => {
    const error = new Error('Test error');
    const response = handleApiError(error, {
      requestId: 'req-123'
    });

    const body = await response.json();
    expect(body.requestId).toBe('req-123');
  });
});

describe('createApiResponse', () => {
  it('returns 200 status by default', () => {
    const response = createApiResponse({ test: 'data' });
    expect(response.status).toBe(200);
  });

  it('returns custom status code', () => {
    const response = createApiResponse({ created: true }, { status: 201 });
    expect(response.status).toBe(201);
  });

  it('returns standardized success JSON', async () => {
    const data = { test: 'data' };
    const response = createApiResponse(data);
    const body = await response.json();

    expect(body).toHaveProperty('success', true);
    expect(body).toHaveProperty('data');
    expect(body).toHaveProperty('timestamp');
    expect(body.data).toEqual(data);
  });
});
```

**Step 7: Run Tests and Check Coverage (30 min)**

```bash
# Run tests
npm test

# Run with UI
npm run test:ui

# Check coverage
npm run test:coverage
```

Review coverage report:
- Target: >50% coverage on tested files
- Focus on critical paths
- Document untested edge cases

#### Success Criteria
- [ ] Vitest configured and running
- [ ] Test scripts added to package.json
- [ ] `cn` utility fully tested (>90% coverage)
- [ ] `useMediaQuery` hook tested
- [ ] `admin-auth` utility tested (>80% coverage)
- [ ] `error-handler` utility tested (>80% coverage)
- [ ] All tests pass
- [ ] Coverage report generated
- [ ] CI/CD integration possible (config in place)

#### Validation

**Test 1: Run Test Suite**
```bash
npm test
# Expected: All tests pass
```

**Test 2: Coverage Check**
```bash
npm run test:coverage
# Expected:
# - cn utility: >90% coverage
# - useMediaQuery: >70% coverage
# - admin-auth: >80% coverage
# - error-handler: >80% coverage
```

**Test 3: Watch Mode**
```bash
npm test -- --watch
# Make a change to tested file
# Expected: Tests re-run automatically
```

**Acceptance**:
- Test suite configured
- Critical utilities tested
- >50% coverage on tested files
- Foundation for future tests

---

### 3.2: Refactor Large Files

**Priority**: LOW
**Effort**: 2 hours

#### Scope

**Primary Target**: `src/app/(public)/case-studies/[slug]/page.tsx` (427 lines)

**Reason**: This file has:
- 40+ inline styles
- Complex rendering logic
- Mixed concerns (data fetching, presentation, styling)
- No component extraction

#### Implementation Steps

**Step 1: Extract Hero Section (30 min)**

Create `src/components/case-studies/CaseStudyHero.tsx`:

```typescript
interface CaseStudyHeroProps {
  title: string;
  subtitle?: string;
  category?: string;
  heroImage?: string;
  technologies?: string[];
}

export function CaseStudyHero({
  title,
  subtitle,
  category,
  heroImage,
  technologies
}: CaseStudyHeroProps) {
  return (
    <section className="min-h-screen flex flex-col justify-center relative">
      {/* Blur orbs */}
      <div className="absolute top-[10%] left-[10%] w-[400px] h-[400px] rounded-full bg-purple-400/15 blur-[100px]" />
      <div className="absolute bottom-[20%] right-[10%] w-[500px] h-[500px] rounded-full bg-purple-300/15 blur-[100px]" />

      <div className="container mx-auto px-8 relative z-10">
        {/* Category badge */}
        {category && (
          <div className="inline-block px-6 py-2 mb-8 rounded-full bg-purple-500/10 dark:bg-purple-400/10 border border-purple-500/30 dark:border-purple-400/30 text-purple-300 dark:text-purple-200 text-xs font-semibold uppercase tracking-widest">
            {category}
          </div>
        )}

        {/* Title with gradient */}
        <h1 className="text-7xl font-bold mb-6 bg-gradient-to-br from-purple-300 dark:from-purple-200 to-white bg-clip-text text-transparent">
          {title}
        </h1>

        {/* Subtitle */}
        {subtitle && (
          <p className="text-2xl text-muted-foreground mb-12 max-w-3xl">
            {subtitle}
          </p>
        )}

        {/* Tech tags */}
        {technologies && technologies.length > 0 && (
          <div className="flex flex-wrap gap-3">
            {technologies.map((tech) => (
              <span
                key={tech}
                className="px-4 py-2 rounded-full bg-purple-500/10 dark:bg-purple-400/10 border border-purple-500/30 dark:border-purple-400/30 text-purple-300 dark:text-purple-200 text-sm"
              >
                {tech}
              </span>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
```

**Step 2: Extract Metrics Section (30 min)**

Create `src/components/case-studies/MetricsGrid.tsx`:

```typescript
interface Metric {
  label: string;
  value: string;
  description?: string;
}

interface MetricsGridProps {
  metrics: Metric[];
}

export function MetricsGrid({ metrics }: MetricsGridProps) {
  return (
    <section className="py-32 bg-purple-500/5 dark:bg-purple-400/5">
      <div className="container mx-auto px-8">
        <div className="mb-12">
          <span className="text-purple-300 dark:text-purple-200 text-xs font-semibold uppercase tracking-widest">
            Key Metrics
          </span>
          <div className="w-16 h-px mt-2 bg-gradient-to-r from-purple-300 dark:from-purple-200 to-transparent" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {metrics.map((metric, index) => (
            <div
              key={index}
              className="p-12 rounded-3xl bg-white/5 dark:bg-white/3 border border-white/10 dark:border-white/5"
            >
              <div className="text-5xl font-bold mb-4 bg-gradient-to-br from-purple-300 dark:from-purple-200 to-purple-100 bg-clip-text text-transparent">
                {metric.value}
              </div>
              <div className="text-sm font-semibold mb-2">
                {metric.label}
              </div>
              {metric.description && (
                <div className="text-xs text-muted-foreground">
                  {metric.description}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
```

**Step 3: Extract Achievements List (20 min)**

Create `src/components/case-studies/AchievementsList.tsx`:

```typescript
interface AchievementsListProps {
  achievements: string[];
}

export function AchievementsList({ achievements }: AchievementsListProps) {
  return (
    <section className="py-32">
      <div className="container mx-auto px-8">
        <div className="mb-12">
          <span className="text-purple-300 dark:text-purple-200 text-xs font-semibold uppercase tracking-widest">
            Achievements
          </span>
          <div className="w-16 h-px mt-2 bg-gradient-to-r from-purple-300 dark:from-purple-200 to-transparent" />
        </div>

        <ul className="space-y-6 max-w-3xl">
          {achievements.map((achievement, index) => (
            <li key={index} className="flex items-start gap-4">
              <span className="mt-2 w-2 h-2 rounded-full bg-purple-400 dark:bg-purple-300 flex-shrink-0" />
              <span className="text-lg text-foreground">
                {achievement}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
```

**Step 4: Update Main Page Component (40 min)**

Refactor `src/app/(public)/case-studies/[slug]/page.tsx`:

```typescript
import { CaseStudyHero } from '@/components/case-studies/CaseStudyHero';
import { MetricsGrid } from '@/components/case-studies/MetricsGrid';
import { AchievementsList } from '@/components/case-studies/AchievementsList';
import { CaseStudySection } from '@/components/CaseStudySection';

export default async function CaseStudyPage({ params }: Props) {
  const project = await fetchProject(params.slug);

  if (!project) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-background/95">
      <CaseStudyHero
        title={project.title}
        subtitle={project.subtitle}
        category={project.category}
        heroImage={project.heroImage}
        technologies={project.technologies}
      />

      {/* Overview section */}
      {project.overview && (
        <section className="py-32">
          <div className="container mx-auto px-8">
            <div className="grid md:grid-cols-3 gap-8 max-w-3xl">
              <div>
                <div className="text-sm font-semibold text-purple-300 dark:text-purple-200 mb-2">
                  Role
                </div>
                <div className="text-foreground">{project.overview.role}</div>
              </div>
              <div>
                <div className="text-sm font-semibold text-purple-300 dark:text-purple-200 mb-2">
                  Company
                </div>
                <div className="text-foreground">{project.overview.company}</div>
              </div>
              <div>
                <div className="text-sm font-semibold text-purple-300 dark:text-purple-200 mb-2">
                  Timeline
                </div>
                <div className="text-foreground">{project.overview.timeline}</div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Content sections */}
      {project.sections?.map((section, index) => (
        <CaseStudySection
          key={index}
          {...section}
          index={index}
        />
      ))}

      {/* Metrics */}
      {project.metrics && project.metrics.length > 0 && (
        <MetricsGrid metrics={project.metrics} />
      )}

      {/* Achievements */}
      {project.achievements && project.achievements.length > 0 && (
        <AchievementsList achievements={project.achievements} />
      )}

      {/* CTA */}
      <section className="py-32">
        <div className="container mx-auto px-8 text-center">
          <Link
            href="/case-studies"
            className="inline-block px-8 py-4 rounded-full bg-gradient-to-r from-purple-500 to-purple-400 dark:from-purple-400 dark:to-purple-300 text-white font-semibold hover:opacity-90 transition-opacity"
          >
            View More Case Studies
          </Link>
        </div>
      </section>
    </div>
  );
}
```

#### Success Criteria
- [ ] Hero component extracted and styled with Tailwind
- [ ] Metrics component extracted and styled with Tailwind
- [ ] Achievements component extracted and styled with Tailwind
- [ ] Main page simplified to <200 lines
- [ ] Zero inline styles remaining
- [ ] Dark mode variants added throughout
- [ ] All components have proper TypeScript types
- [ ] Page renders identically to before refactor
- [ ] Build succeeds

#### Validation

**Test 1: Visual Comparison**
```bash
npm run dev
# Compare before/after screenshots:
# - /case-studies/virgin-america (or any case study)
# - Check desktop, tablet, mobile
# - Check light and dark mode
```

**Test 2: Line Count**
```bash
wc -l src/app/(public)/case-studies/[slug]/page.tsx
# Expected: <200 lines (down from 427)
```

**Test 3: Inline Styles**
```bash
grep "style={{" src/app/(public)/case-studies/[slug]/page.tsx
# Expected: 0 results

grep "style={{" src/components/case-studies/*.tsx
# Expected: 0 results
```

**Acceptance**:
- Page refactored into reusable components
- Zero inline styles
- <200 lines in main page
- Visual parity maintained

---

### 3.3: Extract Magic Numbers to Constants

**Priority**: LOW
**Effort**: 30 minutes

#### Scope

Magic numbers found in:
- `src/lib/chatbot/hybrid-search.ts`
- `src/app/api/chat/route.ts`
- `src/hooks/use-toast.ts`

#### Implementation Steps

**Step 1: Create Constants File (15 min)**

Create `src/lib/constants.ts`:

```typescript
/**
 * Application-wide constants
 */

// Chatbot Configuration
export const CHATBOT_CONFIG = {
  /**
   * Maximum number of search results to return from hybrid search
   */
  SEARCH_RESULT_LIMIT: 30,

  /**
   * Minimum similarity score threshold (0-1 scale)
   * Results below this threshold are filtered out
   */
  SIMILARITY_THRESHOLD: 0.25,

  /**
   * Weights for hybrid search (semantic + keyword)
   */
  SEARCH_WEIGHTS: {
    semantic: 0.7,
    keyword: 0.3,
  },

  /**
   * Chat model temperature (0-1 scale)
   * Higher values (0.8) produce more creative responses
   * Lower values (0.2) produce more focused, deterministic responses
   */
  CHAT_TEMPERATURE: 0.8,

  /**
   * Maximum tokens in chat response
   */
  MAX_RESPONSE_TOKENS: 1000,
} as const;

// Toast Configuration
export const TOAST_CONFIG = {
  /**
   * Maximum number of toasts to display simultaneously
   */
  TOAST_LIMIT: 1,

  /**
   * Toast auto-dismiss delay in milliseconds
   * Default: 5000ms (5 seconds)
   * Note: Original value was 1000000ms which seems unintentional
   */
  TOAST_REMOVE_DELAY: 5000,
} as const;

// Breakpoints (matches Tailwind defaults)
export const BREAKPOINTS = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536,
} as const;
```

**Step 2: Update Hybrid Search (5 min)**

`src/lib/chatbot/hybrid-search.ts`:

```typescript
import { CHATBOT_CONFIG } from '@/lib/constants';

export async function hybridSearch(
  embedding: number[],
  query: string,
  keywords: string[],
  limit: number = CHATBOT_CONFIG.SEARCH_RESULT_LIMIT,
  threshold: number = CHATBOT_CONFIG.SIMILARITY_THRESHOLD
): Promise<SearchResult[]> {
  // ... implementation
}
```

**Step 3: Update Chat Route (5 min)**

`src/app/api/chat/route.ts`:

```typescript
import { CHATBOT_CONFIG } from '@/lib/constants';

// In chat configuration
const response = await openai.chat.completions.create({
  model: 'gpt-4',
  temperature: CHATBOT_CONFIG.CHAT_TEMPERATURE,
  max_tokens: CHATBOT_CONFIG.MAX_RESPONSE_TOKENS,
  messages,
});
```

**Step 4: Update Toast Hook (5 min)**

`src/hooks/use-toast.ts`:

```typescript
import { TOAST_CONFIG } from '@/lib/constants';

const TOAST_LIMIT = TOAST_CONFIG.TOAST_LIMIT;
const TOAST_REMOVE_DELAY = TOAST_CONFIG.TOAST_REMOVE_DELAY;
```

#### Success Criteria
- [ ] Constants file created with JSDoc documentation
- [ ] All magic numbers replaced with named constants
- [ ] Constants exported as `const` assertions
- [ ] Original values documented
- [ ] Build succeeds
- [ ] No behavior changes

#### Validation

**Test 1: Grep for Magic Numbers**
```bash
# Should find significantly fewer magic numbers
grep -rn "0.25" src/lib/chatbot/
grep -rn "0.8" src/app/api/chat/
grep -rn "1000000" src/hooks/

# Expected: No results (or only in comments/constants file)
```

**Test 2: Behavior Check**
```bash
npm run dev
# Test chatbot search functionality
# Test toast notifications
# Verify same behavior as before
```

**Acceptance**:
- Magic numbers eliminated
- Constants well-documented
- Easy to adjust configuration

---

## Phase 3 Completion Checklist

Before marking project complete, verify:

- [ ] Unit tests configured and running (3.1)
- [ ] Critical utilities have >50% test coverage (3.1)
- [ ] Case study page refactored into components (3.2)
- [ ] Inline styles eliminated from case studies (3.2)
- [ ] Magic numbers extracted to constants (3.3)
- [ ] All validation tests pass
- [ ] Full build succeeds
- [ ] Documentation updated

### Phase 3 Success Metrics
- ✅ Test suite configured with Vitest
- ✅ >50% coverage on tested files
- ✅ Case study page <200 lines (from 427)
- ✅ Zero inline styles in refactored components
- ✅ Constants documented and used
- ✅ Maintainability improved

**Estimated Completion Time**: 8 hours
**Actual Completion Time**: ________

---

## Project Completion & Acceptance

### Overall Success Criteria

**Phase 1: Critical (4 hours)**
- ✅ Zero security vulnerabilities (password logging, missing auth)
- ✅ Zero debug console logs in production
- ✅ ~2.5MB dependency reduction
- ✅ ~15-20KB bundle reduction

**Phase 2: Quality (6 hours)**
- ✅ Single source of truth for hooks (media query, toast)
- ✅ 80% reduction in `any` usage (24 → <5)
- ✅ Standardized error handling across API routes
- ✅ Request ID tracking

**Phase 3: Maintainability (8 hours)**
- ✅ Test suite configured and running
- ✅ >50% coverage on critical utilities
- ✅ Case study pages refactored (427 → <200 lines)
- ✅ Zero inline styles in refactored code
- ✅ Magic numbers documented as constants

### Final Validation

**Build & Type Check**
```bash
npm run build
npx tsc --noEmit
# Expected: Success with no errors
```

**Test Suite**
```bash
npm test
npm run test:coverage
# Expected: All tests pass, >50% coverage
```

**Security Audit**
```bash
# No password logging
git grep -n "ADMIN_PASSWORD" src/

# Admin routes authenticated
curl http://localhost:3000/api/admin/chat-logs
# Expected: 401 Unauthorized
```

**Bundle Size**
```bash
npm run build
# Check .next/static for bundle sizes
```

**Console Audit**
```bash
# Count console statements (excluding CLI)
grep -rn "console\." src/ \
  --include="*.ts" --include="*.tsx" \
  | grep -v "ingest-content.ts" \
  | grep -v "setup-database.ts" \
  | grep -v "logger.ts" \
  | wc -l

# Expected: <10 intentional statements
```

### Documentation Updates

After completion, update:

- [ ] `CLAUDE.md` - Add testing section
- [ ] `CLAUDE.md` - Update architecture notes
- [ ] Create `docs/testing-guide.md` with test examples
- [ ] Update `README.md` if needed
- [ ] Archive this implementation plan as complete

### Git Commit Strategy

**Recommended Commits** (atomic):

1. **Phase 1: Security Fixes**
```bash
git add src/app/(admin)/admin/chat-logs/layout.tsx
git commit -m "security: remove password debug logging

- Delete console.log statements exposing ADMIN_PASSWORD
- Addresses critical security vulnerability
- See: docs/implementation-plans/tech-debt-cleanup-plan-2025-11-01.md

🤖 Generated with [Claude Code](https://claude.com/claude-code)

Co-Authored-By: Claude <noreply@anthropic.com>"
```

2. **Phase 1: Add Authentication**
```bash
git add src/lib/auth/admin-auth.ts src/app/api/admin/
git commit -m "security: add authentication to admin API routes

- Create admin-auth utility with Bearer token verification
- Add auth checks to /api/admin/chat-logs and /api/admin/chatbot-sync
- Return 401 Unauthorized for invalid/missing tokens
- Add ADMIN_API_TOKEN to .env.example

🤖 Generated with [Claude Code](https://claude.com/claude-code)

Co-Authored-By: Claude <noreply@anthropic.com>"
```

3. **Phase 1: Remove Debug Logs**
```bash
git add src/app/api/ src/lib/chatbot/ src/components/
git commit -m "refactor: remove debug console.log statements

- Replace console statements with logger utility
- Remove debug blocks in API routes
- Keep intentional logging in CLI scripts
- Improve production console hygiene

🤖 Generated with [Claude Code](https://claude.com/claude-code)

Co-Authored-By: Claude <noreply@anthropic.com>"
```

4. **Phase 1: Cleanup Dependencies**
```bash
git add package.json package-lock.json
git commit -m "chore: remove unused dependencies and add missing ones

Remove unused (8 packages):
- @hookform/resolvers, @sanity/react-loader, date-fns, styled-components
- @eslint/eslintrc, autoprefixer, eslint-config-next, postcss

Add missing (2 packages):
- @portabletext/types, uuid

Bundle size reduction: ~2.5MB node_modules

🤖 Generated with [Claude Code](https://claude.com/claude-code)

Co-Authored-By: Claude <noreply@anthropic.com>"
```

5. **Phase 1: Remove Unused Components**
```bash
git add src/components/ui/
git commit -m "refactor: remove unused UI components

Delete 7 unused shadcn/ui components:
- breadcrumb, calendar, command, drawer, pagination, sidebar, textarea
- Total: ~1,400 lines removed
- Bundle reduction: ~15-20KB

🤖 Generated with [Claude Code](https://claude.com/claude-code)

Co-Authored-By: Claude <noreply@anthropic.com>"
```

6. **Phase 2: Consolidate Hooks**
```bash
git add src/hooks/
git commit -m "refactor: consolidate mobile detection to single hook

- Remove use-mobile.tsx (unused)
- Standardize on useMediaQuery
- Add JSDoc documentation
- Consistent breakpoint logic across app

🤖 Generated with [Claude Code](https://claude.com/claude-code)

Co-Authored-By: Claude <noreply@anthropic.com>"
```

7. **Phase 2: Add TypeScript Types**
```bash
git add src/types/ src/lib/
git commit -m "refactor: replace 'any' types with proper interfaces

- Create src/types/chatbot.ts with comprehensive types
- Fix logger.ts (5 instances)
- Fix hybrid-search.ts (3 instances)
- Fix logging.ts (6 instances)
- Reduce 'any' usage by 80% (24 → <5)

🤖 Generated with [Claude Code](https://claude.com/claude-code)

Co-Authored-By: Claude <noreply@anthropic.com>"
```

8. **Phase 2: Standardize Error Handling**
```bash
git add src/lib/error-handler.ts src/app/api/
git commit -m "refactor: standardize API error handling

- Create error-handler utility
- Add request ID tracking
- Consistent JSON error format
- Improve error logging

🤖 Generated with [Claude Code](https://claude.com/claude-code)

Co-Authored-By: Claude <noreply@anthropic.com>"
```

9. **Phase 3: Add Unit Tests**
```bash
git add vitest.config.ts vitest.setup.ts src/**/__tests__/ package.json
git commit -m "test: add unit test coverage for critical utilities

- Configure Vitest with React Testing Library
- Test utils, hooks, auth, error-handler
- Achieve >50% coverage on tested files
- Foundation for future test expansion

🤖 Generated with [Claude Code](https://claude.com/claude-code)

Co-Authored-By: Claude <noreply@anthropic.com>"
```

10. **Phase 3: Refactor Case Studies**
```bash
git add src/components/case-studies/ src/app/(public)/case-studies/
git commit -m "refactor: extract case study page into components

- Create CaseStudyHero, MetricsGrid, AchievementsList components
- Replace all inline styles with Tailwind classes
- Add dark mode variants throughout
- Reduce main page from 427 to <200 lines

🤖 Generated with [Claude Code](https://claude.com/claude-code)

Co-Authored-By: Claude <noreply@anthropic.com>"
```

11. **Phase 3: Extract Constants**
```bash
git add src/lib/constants.ts src/lib/chatbot/ src/app/api/ src/hooks/
git commit -m "refactor: extract magic numbers to named constants

- Create constants.ts with documented config values
- Document CHATBOT_CONFIG, TOAST_CONFIG, BREAKPOINTS
- Improve code maintainability

🤖 Generated with [Claude Code](https://claude.com/claude-code)

Co-Authored-By: Claude <noreply@anthropic.com>"
```

---

## Risk Assessment

### High-Risk Areas

**1. Authentication Changes**
- **Risk**: Breaking admin access
- **Mitigation**: Test thoroughly with valid/invalid tokens before deploying
- **Rollback**: Keep old code commented until verified

**2. Dependency Removal**
- **Risk**: Runtime errors from missing packages
- **Mitigation**: Comprehensive grep search before removal
- **Rollback**: `package-lock.json` tracks exact versions

**3. TypeScript Refactoring**
- **Risk**: Breaking existing functionality with type changes
- **Mitigation**: Incremental changes, test after each file
- **Rollback**: Git commits per file

### Medium-Risk Areas

**4. Case Study Refactoring**
- **Risk**: Visual regressions
- **Mitigation**: Before/after screenshots, use visual regression tests
- **Rollback**: Revert component extraction

**5. Error Handling Changes**
- **Risk**: Changed API response format breaks client code
- **Mitigation**: Check all API consumers, test client handling
- **Rollback**: Revert to old error format

### Low-Risk Areas

**6. Console Log Removal**
- **Risk**: Losing useful debug info
- **Mitigation**: Use logger instead of deleting entirely
- **Rollback**: Re-add specific logs if needed

**7. Constants Extraction**
- **Risk**: None (pure refactor)
- **Mitigation**: Values unchanged, just moved
- **Rollback**: Inline constants if needed

---

## Timeline & Effort Summary

### Phase 1: Critical Fixes (4 hours)
- 1.1: Remove password logging - **5 min**
- 1.2: Add authentication - **1 hour**
- 1.3: Remove console logs - **2 hours**
- 1.4: Remove unused deps - **30 min**
- 1.5: Delete unused components - **15 min**
- **Buffer**: 10 min

### Phase 2: Code Quality (6 hours)
- 2.1: Consolidate hooks - **20 min**
- 2.2: Remove toast duplication - **15 min**
- 2.3: Add TypeScript types - **3 hours**
- 2.4: Standardize error handling - **2 hours**
- **Buffer**: 25 min

### Phase 3: Maintainability (8 hours)
- 3.1: Add unit tests - **4 hours**
- 3.2: Refactor large files - **2 hours**
- 3.3: Extract constants - **30 min**
- **Buffer**: 1.5 hours

### Total Estimated Time: 18 hours
- Critical work: 4 hours
- Recommended work: 14 hours
- Can be spread across 1-2 weeks

---

## Conclusion

This implementation plan provides a comprehensive, step-by-step roadmap for addressing technical debt identified in the codebase audit. Each phase builds on the previous one, with clear success criteria and validation steps.

**Recommended Execution Order**:
1. Complete Phase 1 immediately (security critical)
2. Schedule Phase 2 within 2 weeks
3. Complete Phase 3 as time permits

**Key Benefits**:
- ✅ Eliminates security vulnerabilities
- ✅ Reduces bundle size and improves performance
- ✅ Improves type safety and developer experience
- ✅ Establishes testing foundation
- ✅ Makes codebase more maintainable

**Next Steps**:
1. Review and approve this plan
2. Begin Phase 1.1 (password logging - 5 minutes)
3. Schedule focused work sessions for remaining tasks
4. Track progress using the checklists
5. Commit incrementally using suggested commit messages

---

**Plan Status**: Ready for Implementation
**Owner**: TBD
**Start Date**: TBD
**Target Completion**: TBD
**Actual Completion**: TBD
