# Sanity Webhook Signature Verification Research

**Date:** December 16, 2025  
**Issue:** Intermittent 401 errors on webhook signature verification

## Executive Summary

The current implementation appears to follow the correct pattern, but there are several potential issues and better approaches available:

1. **Official Solution Exists:** Sanity provides `next-sanity/webhook` with `parseBody()` function specifically for Next.js
2. **Your Implementation:** Custom HMAC verification using crypto module
3. **Recommended Fix:** Switch to the official `parseBody()` from `next-sanity` (already installed)

## Current Implementation Analysis

### What Your Code Does

```typescript
// From: src/app/api/webhooks/sanity/route.ts

function verifySignature(body: string, signatureHeader: string | null, secret: string) {
  // Expects: "t=<timestamp>,v1=<signature>"
  // Creates signed payload: "<timestamp>.<body>"
  // Computes HMAC SHA256
  // Uses timingSafeEqual for comparison
}
```

### Potential Issues Identified

1. **Header Name Assumption**
   - Your code expects: `sanity-webhook-signature`
   - This is correct according to documentation ✅

2. **Signature Format**
   - Your code expects: `t=<timestamp>,v1=<signature>`
   - Research shows Sanity actually uses: `ts=<timestamp>,v1=<signature>` ⚠️
   - **THIS IS LIKELY THE BUG** - you're looking for "t=" but Sanity sends "ts="

3. **Timestamp Format**
   - Research indicates: timestamp is in **milliseconds** (not seconds)
   - Your code doesn't validate timestamp freshness (no replay attack protection)

4. **Raw Body Handling**
   - You correctly use `request.text()` to get raw body ✅
   - This is critical for signature verification

## Official Sanity Documentation Findings

### Recommended Approach: Use `next-sanity/webhook`

Sanity provides an official helper specifically for Next.js webhooks:

```typescript
import { parseBody } from 'next-sanity/webhook'

export async function POST(req: NextRequest) {
  const { isValidSignature, body } = await parseBody(
    req,
    process.env.SANITY_WEBHOOK_SECRET
  )

  if (!isValidSignature) {
    return new Response('Invalid signature', { status: 401 })
  }
  
  // Process webhook...
}
```

**Benefits:**
- Handles all signature verification internally
- Maintained by Sanity team
- Follows best practices
- Already installed in your project (`next-sanity@11.6.2`)

### Alternative: `@sanity/webhook` Package

If you want more control, use the standalone package:

```typescript
import { isValidSignature, SIGNATURE_HEADER_NAME } from '@sanity/webhook'

const signature = request.headers.get(SIGNATURE_HEADER_NAME)
const body = await request.text()

if (!(await isValidSignature(body, signature, secret))) {
  return new Response('Invalid signature', { status: 401 })
}
```

**Note:** This package is NOT currently installed in your project.

## Signature Verification Standard (Stripe-like)

Sanity models their webhook signatures on the **Stripe standard**:

### Header Format

```
sanity-webhook-signature: ts=1234567890123,v1=abc123signature
```

**Components:**
- `ts=` - Unix timestamp in **milliseconds**
- `v1=` - HMAC SHA256 signature (hex encoded)

### Signing Process

```typescript
const signedPayload = `${timestamp}.${rawBody}`
const signature = crypto
  .createHmac('sha256', secret)
  .update(signedPayload)
  .digest('hex')
```

### Verification Process

1. Extract timestamp and signature from header
2. Recreate signed payload: `timestamp + "." + rawBody`
3. Compute expected signature using HMAC SHA256
4. Compare using timing-safe comparison
5. Optional: Check timestamp freshness (replay protection)

## Root Cause Analysis

### Most Likely Issue: Header Parsing Bug

Your code looks for `t=` but Sanity sends `ts=`:

```typescript
// Your code:
const timestampPart = parts.find(p => p.startsWith('t='));  // ❌ WRONG

// Should be:
const timestampPart = parts.find(p => p.startsWith('ts='));  // ✅ CORRECT
```

This would cause:
- `timestampPart` to be undefined
- Function returns false (invalid signature)
- 401 error response

**Why it worked once:** Possible that during testing, you might have had a different header format or manual test that used `t=` instead of `ts=`.

## Recommendations

### Option 1: Use Official Helper (Recommended)

**Pros:**
- Simplest solution
- Already installed
- Maintained by Sanity
- No manual header parsing

**Implementation:**
```typescript
import { parseBody } from 'next-sanity/webhook'

const { isValidSignature, body } = await parseBody<SanityWebhookPayload>(
  request,
  process.env.SANITY_WEBHOOK_SECRET
)
```

### Option 2: Fix Current Implementation

**Pros:**
- Minimal code changes
- Keep existing logic

**Fix Required:**
```typescript
// Change line 37:
const timestampPart = parts.find(p => p.startsWith('ts='));  // Changed from 't='

// Change line 45:
const timestamp = timestampPart.slice(3);  // Changed from slice(2) to slice(3)
```

### Option 3: Install @sanity/webhook Package

**Pros:**
- More flexibility
- Works outside Next.js
- Uses official verification logic

**Cons:**
- Requires additional dependency
- More code than Option 1

## Implementation Comparison

### Current (Broken)
```typescript
const timestampPart = parts.find(p => p.startsWith('t='));  // ❌
const timestamp = timestampPart.slice(2);  // ❌
```

### Fixed Custom Implementation
```typescript
const timestampPart = parts.find(p => p.startsWith('ts='));  // ✅
const timestamp = timestampPart.slice(3);  // ✅
```

### Official Helper (Best)
```typescript
const { isValidSignature, body } = await parseBody(req, secret);  // ✅
```

## Additional Improvements

Regardless of which option you choose, consider:

1. **Timestamp Validation (Replay Protection)**
   ```typescript
   const TIMESTAMP_TOLERANCE_MS = 5 * 60 * 1000; // 5 minutes
   const now = Date.now();
   if (Math.abs(now - parseInt(timestamp)) > TIMESTAMP_TOLERANCE_MS) {
     return false; // Timestamp too old or from future
   }
   ```

2. **Better Error Logging**
   ```typescript
   logger.error('Signature verification failed:', {
     headerReceived: !!signatureHeader,
     timestampPart: !!timestampPart,
     signaturePart: !!signaturePart,
     // Don't log actual secrets/signatures
   });
   ```

3. **Graceful Degradation**
   - Consider allowing webhooks without signature in development
   - Require signature in production only

## Sources & References

### Official Documentation
- [Sanity Webhooks Documentation](https://www.sanity.io/docs/webhooks)
- [Sanity Webhook Best Practices](https://www.sanity.io/docs/content-lake/webhook-best-practices)
- [GitHub: webhook-toolkit](https://github.com/sanity-io/webhook-toolkit)
- [@sanity/webhook NPM Package](https://www.npmjs.com/package/@sanity/webhook)

### Implementation Examples
- [Build with Matija: Secure Sanity Webhooks](https://www.buildwithmatija.com/blog/secure-sanity-webhooks-nextjs-app-router)
- [Victor Eke: Sanity Webhooks and Next.js](https://victoreke.com/blog/sanity-webhooks-and-on-demand-revalidation-in-nextjs)
- [Sanity Blog: Next.js Toolkit](https://www.sanity.io/blog/sanity-nextjs-enhancements)

### Related Standards
- [Stripe Webhook Signature Format](https://docs.stripe.com/webhooks/signature)
- [GitHub: Implementing Secure Webhooks](https://github.com/frain-dev/convoy/wiki/Implementing-Secure-Webhooks-Signatures-like-Stripe)

### Next.js Raw Body Handling
- [Medium: Next.js App Router + Stripe](https://kitson-broadhurst.medium.com/next-js-app-router-stripe-webhook-signature-verification-ea9d59f3593f)
- [Max Karlsson: Verify Stripe in Next.js](https://maxkarlsson.dev/blog/verify-stripe-webhook-signature-in-next-js-api-routes)

## Next Steps

1. **Immediate Fix:** Update header parsing from `t=` to `ts=` (2 line change)
2. **Better Solution:** Switch to `parseBody()` from `next-sanity/webhook`
3. **Add Monitoring:** Log signature verification details for debugging
4. **Add Tests:** Create test suite for webhook signature verification
5. **Security Enhancement:** Add timestamp validation for replay protection

## Testing Recommendations

After implementing the fix:

1. **Test with Sanity Dashboard**
   - Configure webhook in Sanity project settings
   - Use "Test webhook" button
   - Verify logs show successful verification

2. **Local Testing**
   ```bash
   # Test webhook endpoint
   curl -X POST http://localhost:3000/api/webhooks/sanity \
     -H "Content-Type: application/json" \
     -H "sanity-webhook-signature: ts=1234567890123,v1=<computed-signature>" \
     -d '{"_id":"test","_type":"project"}'
   ```

3. **Monitor Production**
   - Check Vercel logs for 401 errors
   - Verify successful webhook processing
   - Monitor chatbot sync and cache revalidation

