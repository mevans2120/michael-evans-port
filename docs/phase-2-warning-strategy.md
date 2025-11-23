# Phase 2: Warning Resolution Strategy

**Date**: November 22, 2025
**Current State**: 497 warnings (0 errors)

## Warning Breakdown

| Rule | Count | Category | Priority |
|------|-------|----------|----------|
| `no-console` | 285 | Code Quality | 🔴 High |
| `@typescript-eslint/no-explicit-any` | 126 | Type Safety | 🟡 Medium |
| `@typescript-eslint/no-unused-vars` | 71 | Code Cleanup | 🟢 High (Easy) |
| `@next/next/no-img-element` | 5 | Performance | 🔴 High |
| `@typescript-eslint/no-non-null-assertion` | 4 | Type Safety | 🟡 Medium |
| `react-hooks/exhaustive-deps` | 3 | Correctness | 🔴 Critical |
| `@next/next/no-html-link-for-pages` | 2 | Performance | 🔴 High |
| `no-unused-vars` | 1 | Code Cleanup | 🟢 High (Easy) |

**Total**: 497 warnings

---

## Thoughtful Resolution Strategy

### 🎯 Guiding Principles

1. **Fix warnings that indicate bugs first** (React Hooks deps, type safety issues)
2. **Quick wins for morale** (unused variables - mostly auto-fixable)
3. **High-impact, low-effort** (img/link elements - clear replacements)
4. **Strategic decisions for console logs** (don't blindly remove - assess purpose)
5. **Type safety incrementally** (`any` types - requires understanding context)

---

## Phase 2A: Critical & Quick Wins (30-45 min)

### 1. React Hooks Dependencies (3 warnings) 🔴 **CRITICAL**
**Why First**: Can cause actual bugs (stale closures, missing re-renders)

**Approach**:
- Read each instance
- Understand what the effect does
- Add missing deps OR use suppressions with explanations if intentional

**Risk**: Medium (could change behavior if deps were intentionally omitted)

---

### 2. Unused Variables (72 warnings) 🟢 **QUICK WIN**
**Why Second**: Easy, high-impact (reduces noise by 14%)

**Strategy**:
- Prefix with `_` if intentionally unused: `const _unusedVar = ...`
- Remove completely if genuinely unused
- Check if variable was planned for future use (keep with `_` prefix)

**Auto-fix Available**: Partial (renaming only, not removal)

**Categories**:
- Unused imports → **Remove**
- Unused function params → **Prefix with `_`** (semantic meaning)
- Unused caught errors → **Rename to `_error`**
- Unused variables → **Assess case-by-case**

---

### 3. Next.js Image/Link Elements (7 warnings) 🔴 **HIGH IMPACT**
**Why Third**: Performance gains, SEO benefits

**Rules**:
- `@next/next/no-img-element` (5 instances)
- `@next/next/no-html-link-for-pages` (2 instances)

**Approach**:
```tsx
// ❌ Before
<img src="/logo.png" alt="Logo" />
<a href="/about">About</a>

// ✅ After
import Image from 'next/image';
import Link from 'next/link';

<Image src="/logo.png" alt="Logo" width={200} height={100} />
<Link href="/about">About</Link>
```

**Risk**: Low (straightforward replacements)

---

## Phase 2B: Console Statements (60-90 min)

### 4. Console Statements (285 warnings) 🔴 **STRATEGIC**

**Don't blindly remove!** Console logs serve different purposes.

#### Categories & Strategy:

**A. Debug Logs** (~200 instances) → **Remove or convert**
```tsx
// ❌ Remove these
console.log('Component rendered');
console.log('State:', state);

// ✅ Or use debug utility
import { debugLog } from '@/lib/debug';
debugLog('State:', state); // Only logs in dev
```

**B. Error/Warning Logs** (~60 instances) → **Keep as console.error/warn**
```tsx
// ✅ Already allowed by our rules
console.error('API failed:', error);
console.warn('Deprecated prop used');
```

**C. Production Telemetry** (~15 instances) → **Replace with proper logging**
```tsx
// ❌ Don't use console.log for this
console.log('User action:', action);

// ✅ Use proper telemetry (if needed)
analytics.track('User action', { action });
```

**D. Script/Tool Logs** (~10 instances in `/scripts`) → **Suppress warnings**
```tsx
// In scripts/, console.log is expected
// Already excluded via ESLint config
```

#### Phased Approach:

1. **Phase 2B.1**: Convert error handling logs to console.error/warn (15 min)
2. **Phase 2B.2**: Remove obvious debug logs in components (30 min)
3. **Phase 2B.3**: Assess API routes and server code (15 min)
4. **Phase 2B.4**: Clean up test files (10 min)

---

## Phase 2C: Type Safety (Future - Incremental)

### 5. Explicit `any` Types (126 warnings) 🟡 **INCREMENTAL**

**Don't rush this!** Type safety requires understanding.

**Strategy**: Fix incrementally over time, prioritize by area:

**Priority 1: API Routes** (~20 instances)
- High risk of runtime errors
- Clear request/response types

**Priority 2: CMS Integration** (~40 instances)
- Sanity schema types available
- Can use Sanity's type generation

**Priority 3: Components** (~50 instances)
- Less critical
- Many might be intentional (children, event handlers)

**Priority 4: Utilities** (~16 instances)
- Generic functions might need `any`
- Use `unknown` or generics where possible

**Approach**:
```tsx
// ❌ Before
const data: any = await fetch(...);

// ✅ After - Option 1: Specific type
interface ResponseData {
  id: string;
  name: string;
}
const data: ResponseData = await fetch(...);

// ✅ After - Option 2: Unknown (safer than any)
const data: unknown = await fetch(...);
if (isResponseData(data)) {
  // Type guard
}

// ✅ After - Option 3: Generics
function processData<T>(data: T): T { ... }
```

---

### 6. Non-null Assertions (4 warnings) 🟡 **CASE-BY-CASE**

**Rule**: `@typescript-eslint/no-non-null-assertion`

**Approach**:
- Read context to understand why `!` is used
- Replace with proper null checks if possible
- Keep with `// eslint-disable-next-line` + comment if necessary

```tsx
// ❌ Risky
const value = data.field!.nestedField;

// ✅ Better
const value = data.field?.nestedField ?? defaultValue;

// ✅ Or with guard
if (data.field) {
  const value = data.field.nestedField;
}
```

---

## Recommended Execution Order

### Today (Phase 2A):
1. ✅ Fix React Hooks deps (3 warnings) - 15 min
2. ✅ Fix unused variables (72 warnings) - 20 min
3. ✅ Replace img/link elements (7 warnings) - 15 min

**Result**: ~82 warnings fixed, 415 remaining

### Next Session (Phase 2B):
1. Console statement audit and cleanup (285 warnings) - 90 min

**Result**: ~240 warnings fixed, 175 remaining

### Future (Phase 2C - Incremental):
1. Type safety improvements (130 warnings) - As needed

---

## Success Metrics

**Immediate Goal** (Today):
- ✅ < 415 total warnings (from 497)
- ✅ 0 critical React Hooks issues
- ✅ All Next.js performance optimizations applied

**Medium-term** (Next week):
- ✅ < 200 total warnings
- ✅ No console.logs in production code
- ✅ Type-safe API routes

**Long-term** (One month):
- ✅ < 50 total warnings
- ✅ Type-safe CMS integration
- ✅ All `any` types documented or replaced

---

## Questions to Consider

Before we start, let's discuss:

1. **Console logs**: Do you have existing telemetry/logging infrastructure?
2. **Type safety**: Should we generate types from Sanity schemas?
3. **Images**: Are there any `<img>` tags that can't use `next/image`? (e.g., external CDNs)
4. **Scope**: Focus on Phase 2A only today, or tackle Phase 2B as well?

---

## Tools & Commands

```bash
# See specific warning type
npm run lint 2>&1 | grep "no-console" | head -20

# Fix auto-fixable warnings
npm run lint -- --fix

# Test build after changes
npm run build

# Check warning count
npm run lint 2>&1 | grep "✖"
```
