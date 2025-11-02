# Testing Plan: Tech Debt Phase 1 & 2

**Date**: November 2, 2025
**Phases Tested**: Phase 1 (Security & Cleanup) + Phase 2 (Code Quality)

## Summary of Changes

### Phase 1: Security & Cleanup
- ✅ Removed password debug logging
- ✅ Added Bearer token authentication to admin API routes
- ✅ Removed debug console.log statements
- ✅ Removed unused dependencies
- ✅ Deleted unused UI components (1,431 lines)

### Phase 2: Code Quality & Consistency
- ✅ Consolidated mobile detection hooks
- ✅ Removed toast hook duplication
- ✅ Improved TypeScript types (replaced critical `any` usages)
- ✅ Standardized error handling (20+ console.error → logger.error)

---

## Testing Strategy

### 1. Build Verification ✅ PASSED

**Status**: Already verified during implementation

```bash
npm run build
```

**Expected**: Production build succeeds with no errors
**Result**: ✅ All 24 routes compiled successfully

---

### 2. Automated E2E Tests

Run the existing Playwright test suite to verify no regressions:

#### 2.1 Run All E2E Tests

```bash
# Run all end-to-end tests
npm run test:e2e
```

**Expected**: All tests pass
- ✅ Welcome message displays
- ✅ Suggested prompts work
- ✅ Message sending/receiving works
- ✅ Error handling displays correctly
- ✅ Loading states work
- ✅ Auto-scroll functions

#### 2.2 Run Visual Regression Tests

```bash
# Verify no visual changes from refactoring
npm run test:visual
```

**Expected**: No visual regressions
**Tests**: 24 screenshot comparisons across viewports

#### 2.3 Run Computed Styles Tests

```bash
# Verify CSS properties unchanged
npm run test:styles
```

**Expected**: All CSS properties match baseline

---

### 3. Phase 1 Security Testing

#### 3.1 Admin API Authentication

**Test 1: Admin Chat Logs API (Unauthenticated)**

```bash
# Should FAIL with 401
curl http://localhost:3000/api/admin/chat-logs
```

**Expected Response**:
```json
{
  "error": "Unauthorized",
  "message": "Valid authentication required"
}
```

**Test 2: Admin Chat Logs API (Authenticated)**

```bash
# Should SUCCEED with valid token
curl -H "Authorization: Bearer YOUR_ADMIN_API_TOKEN" \
  http://localhost:3000/api/admin/chat-logs
```

**Expected**: Status 200 with chat logs data

**Test 3: Admin Chatbot Sync (GET - Unauthenticated)**

```bash
# Should FAIL with 401
curl http://localhost:3000/api/admin/chatbot-sync
```

**Expected**: 401 Unauthorized

**Test 4: Admin Chatbot Sync (POST - Authenticated)**

```bash
# Should SUCCEED - triggers sync
curl -X POST \
  -H "Authorization: Bearer YOUR_ADMIN_API_TOKEN" \
  http://localhost:3000/api/admin/chatbot-sync
```

**Expected**: Status 200 with sync results

#### 3.2 Password Logging Verification

**Action**: Start dev server and check logs

```bash
npm run dev
```

**Expected**:
- ❌ NO password debug logging in console
- ❌ NO "Environment variable loaded" messages
- ❌ NO "Password length" or character substring logs

---

### 4. Phase 1 Functionality Testing

#### 4.1 Admin Dashboard (Manual Test)

**Steps**:
1. Navigate to `http://localhost:3000/admin/chat-logs`
2. Enter admin password
3. Verify dashboard loads
4. Check that chat logs display correctly

**Expected**:
- ✅ Admin authentication works with Bearer token
- ✅ Dashboard displays chat logs
- ✅ No console errors

#### 4.2 Admin Chatbot Content (Manual Test)

**Steps**:
1. Navigate to `http://localhost:3000/admin/chatbot-content`
2. Authenticate
3. Click "Get Status" button
4. Click "Sync Now" button

**Expected**:
- ✅ Status loads correctly
- ✅ Sync triggers successfully
- ✅ No authentication errors

#### 4.3 Deleted Components Verification

**Action**: Search for any imports of deleted components

```bash
# Should return NO results
grep -r "from.*breadcrumb" src/
grep -r "from.*calendar" src/
grep -r "from.*command" src/
grep -r "from.*drawer" src/
grep -r "from.*pagination" src/
grep -r "from.*sidebar" src/
grep -r "from.*textarea" src/
```

**Expected**: No imports of deleted components

---

### 5. Phase 2 Testing

#### 5.1 Media Query Hook Consolidation

**Test Desktop Breakpoint**:
```bash
# Open browser dev tools
# Navigate to http://localhost:3000
# Resize window above/below 768px
# Open React DevTools and inspect NavigationPanel component
```

**Expected**:
- ✅ `useIsDesktop()` returns `true` when width >= 768px
- ✅ `useIsDesktop()` returns `false` when width < 768px
- ✅ Navigation panel responds to viewport changes

#### 5.2 TypeScript Type Safety

**Action**: Build already verifies TypeScript compilation

```bash
npm run build
```

**Expected**:
- ✅ No TypeScript errors
- ✅ All `any` → `PortableTextBlock[]` or `unknown` conversions work
- ✅ ReactMarkdown components properly typed

#### 5.3 Error Logging Verification

**Test Logger Usage**:

```bash
# Start dev server
npm run dev

# Trigger an error (e.g., API failure)
# Check console output
```

**Expected**:
- ✅ Errors use `logger.error()` format
- ✅ No raw `console.error()` in critical files
- ✅ Stack traces display correctly

**Verify logger in key files**:
```bash
# Should show logger.error usage
grep "logger.error" src/lib/chatbot/embeddings.ts
grep "logger.error" src/lib/chatbot/supabase.ts
```

**Expected**: Multiple matches in each file

---

## 6. Integration Testing

### 6.1 Full User Flow Test

**Scenario**: New user visits site and uses chatbot

**Steps**:
1. Navigate to `http://localhost:3000`
2. Click on navigation panel border (or wait for auto-expand)
3. Click "AI Assistant" header to expand chat
4. Send message: "Tell me about Virgin America"
5. Wait for response
6. Click a suggested follow-up question
7. Verify response appears

**Expected**:
- ✅ Navigation expands/collapses correctly
- ✅ Chat works without authentication (public API)
- ✅ Messages send and receive
- ✅ No console errors
- ✅ Suggested prompts work
- ✅ Error handling works if API fails

### 6.2 Admin Flow Test

**Scenario**: Admin checks chat logs and syncs content

**Steps**:
1. Navigate to `http://localhost:3000/admin/chat-logs`
2. Authenticate with admin password
3. Verify chat logs display
4. Navigate to `http://localhost:3000/admin/chatbot-content`
5. Click "Get Status"
6. Click "Sync Now"

**Expected**:
- ✅ Authentication works
- ✅ API calls include Bearer token
- ✅ Sync completes successfully
- ✅ Status updates correctly

---

## 7. Performance & Bundle Size

### 7.1 Bundle Size Check

**Action**: Check First Load JS size

```bash
npm run build | grep "First Load JS"
```

**Expected**: ~102 kB (should be similar or smaller after removing unused components)

### 7.2 Dependency Audit

**Action**: Verify removed dependencies are gone

```bash
# Should NOT be in node_modules
ls node_modules/@hookform/resolvers 2>/dev/null && echo "FAIL: Still installed" || echo "PASS: Removed"
ls node_modules/styled-components 2>/dev/null && echo "FAIL: Still installed" || echo "PASS: Removed"
```

**Expected**: All removed dependencies should be gone

---

## 8. Regression Testing Checklist

### Critical Functionality
- [ ] Homepage loads without errors
- [ ] Navigation panel expands/collapses
- [ ] Chat interface works
- [ ] API routes respond correctly
- [ ] Admin dashboard accessible
- [ ] Sanity Studio works (`/studio`)
- [ ] Case study pages load
- [ ] AI showcase pages load
- [ ] About page loads

### Security
- [ ] Admin API routes require authentication
- [ ] Public routes work without authentication
- [ ] No password logging in console
- [ ] No sensitive data in error messages

### Code Quality
- [ ] Build passes with no TypeScript errors
- [ ] No console.error in production code
- [ ] Logger utility used consistently
- [ ] No unused imports

---

## Quick Test Script

Run all automated tests in sequence:

```bash
#!/bin/bash

echo "🧪 Testing Tech Debt Phase 1 & 2"
echo "================================"

# 1. Build verification
echo "✅ Running build..."
npm run build || exit 1

# 2. Run E2E tests
echo "✅ Running E2E tests..."
npm run test:e2e || echo "⚠️  Some E2E tests failed"

# 3. Run visual regression tests
echo "✅ Running visual regression tests..."
npm run test:visual || echo "⚠️  Visual changes detected"

# 4. Run computed styles tests
echo "✅ Running computed styles tests..."
npm run test:styles || echo "⚠️  Style changes detected"

# 5. Security check - admin API
echo "✅ Testing admin API authentication..."
RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/api/admin/chat-logs)
if [ "$RESPONSE" = "401" ]; then
  echo "✅ Admin API correctly requires authentication"
else
  echo "❌ Admin API authentication check failed (got $RESPONSE)"
fi

echo ""
echo "🎉 Automated tests complete!"
echo "📋 Don't forget to run manual tests from the plan"
```

---

## Test Results Template

Use this template to track test results:

```markdown
## Test Results - Phase 1 & 2

**Date**: _____________________
**Tester**: ___________________

### Automated Tests
- [ ] Build: PASS / FAIL
- [ ] E2E Tests: PASS / FAIL (X/Y passing)
- [ ] Visual Regression: PASS / FAIL
- [ ] Computed Styles: PASS / FAIL

### Security Tests
- [ ] Admin API Auth (unauthenticated): PASS / FAIL
- [ ] Admin API Auth (authenticated): PASS / FAIL
- [ ] No password logging: PASS / FAIL

### Manual Tests
- [ ] Admin dashboard: PASS / FAIL
- [ ] Chatbot functionality: PASS / FAIL
- [ ] Navigation panel: PASS / FAIL
- [ ] Media query responsiveness: PASS / FAIL

### Notes
_______________________________________
_______________________________________
_______________________________________
```

---

## Success Criteria

**All tests must pass for Phase 1 & 2 to be considered complete**:

1. ✅ Build passes with no errors
2. ✅ All E2E tests pass
3. ✅ Visual regression tests pass
4. ✅ Admin API requires authentication (401 when unauthenticated)
5. ✅ Admin API works with Bearer token
6. ✅ No password logging in console
7. ✅ No console.error in application code
8. ✅ Media query hooks work correctly
9. ✅ TypeScript compilation succeeds
10. ✅ All critical user flows work

---

## Next Steps After Testing

1. If all tests pass → Ready for Phase 3 (Long-term Maintainability)
2. If tests fail → Fix issues and re-test
3. Update CLAUDE.md with test results
4. Commit Phase 1 & 2 changes (if not already done)

---

## Environment Variables Required

Before testing, ensure these are set in `.env.local`:

```bash
# Admin API Authentication
ADMIN_API_TOKEN=your-secure-admin-api-token
NEXT_PUBLIC_ADMIN_API_TOKEN=your-secure-admin-api-token  # Must match

# Supabase (for chatbot tests)
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# AI SDK (for chatbot tests)
GOOGLE_GENERATIVE_AI_API_KEY=your-google-api-key
```
