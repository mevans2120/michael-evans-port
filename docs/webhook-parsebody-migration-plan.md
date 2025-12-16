# Webhook Migration: Use Official `parseBody()` from next-sanity

## Problem

The current webhook signature verification has a bug:
- Code looks for `t=` but Sanity sends `ts=`
- This causes intermittent 401 errors

## Solution

Replace custom signature verification with the official `parseBody()` function from `next-sanity/webhook`. This is already installed in the project.

---

## Implementation Steps

### Step 1: Update Imports

**File:** `src/app/api/webhooks/sanity/route.ts`

Remove:
```typescript
import crypto from 'crypto';
```

Add:
```typescript
import { parseBody } from 'next-sanity/webhook';
```

---

### Step 2: Remove Custom `verifySignature` Function

Delete the entire `verifySignature` function (lines 24-66):

```typescript
// DELETE THIS ENTIRE FUNCTION
function verifySignature(
  body: string,
  signatureHeader: string | null,
  secret: string
): boolean {
  // ... all of this
}
```

---

### Step 3: Update POST Handler

Replace the current signature verification logic in the POST handler.

**Current code (lines 230-243):**
```typescript
// Step 2: Read and parse request body
const body = await request.text();
const signature = request.headers.get('sanity-webhook-signature');

// Step 3: Verify signature
if (!verifySignature(body, signature, webhookSecret)) {
  logger.error('Invalid webhook signature');
  return NextResponse.json(
    { error: 'Invalid signature' },
    { status: 401 }
  );
}

const payload: SanityWebhookPayload = JSON.parse(body);
```

**New code:**
```typescript
// Step 2: Parse body and verify signature using official next-sanity helper
const { isValidSignature, body: payload } = await parseBody<SanityWebhookPayload>(
  request,
  webhookSecret
);

// Step 3: Verify signature
if (!isValidSignature) {
  logger.error('Invalid webhook signature');
  return NextResponse.json(
    { error: 'Invalid signature' },
    { status: 401 }
  );
}
```

---

### Step 4: Update Variable References

The `parseBody()` function returns the parsed body directly, so update references:

- `payload` is already parsed (no need for `JSON.parse(body)`)
- Remove any references to the raw `body` string variable

---

## Complete Changed Section

Here's the full POST handler with changes applied:

```typescript
export async function POST(request: NextRequest) {
  try {
    // Step 1: Verify webhook secret exists
    const webhookSecret = process.env.SANITY_WEBHOOK_SECRET;

    if (!webhookSecret) {
      logger.error('SANITY_WEBHOOK_SECRET not configured');
      return NextResponse.json(
        { error: 'Webhook not configured' },
        { status: 500 }
      );
    }

    // Step 2: Parse body and verify signature using official next-sanity helper
    const { isValidSignature, body: payload } = await parseBody<SanityWebhookPayload>(
      request,
      webhookSecret
    );

    // Step 3: Verify signature
    if (!isValidSignature) {
      logger.error('Invalid webhook signature');
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 401 }
      );
    }

    logger.log(`\n📨 Webhook received for: ${payload._type} (${payload._id})`);
    // ... rest of handler unchanged
```

---

## Files to Modify

| File | Changes |
|------|---------|
| `src/app/api/webhooks/sanity/route.ts` | Replace custom verification with `parseBody()` |

---

## Benefits of This Approach

1. **Official & Maintained** - Uses Sanity's own verification logic
2. **Always Up-to-Date** - If Sanity changes signature format, `next-sanity` will be updated
3. **Less Code** - Removes ~40 lines of custom verification
4. **Type-Safe** - Generic `parseBody<T>()` returns typed payload
5. **Battle-Tested** - Used by thousands of Sanity + Next.js projects

---

## Testing

After implementation:
1. Deploy to Vercel
2. Make a change in Sanity Studio
3. Publish the change
4. Check Vercel logs for 200 response (not 401)
5. Verify page content updated

---

## Rollback Plan

If issues occur, the fix is simple - just change `ts=` to `t=` and `slice(3)` to `slice(2)` in the original code. But the official `parseBody()` approach is more reliable.

---

## Estimated Scope

- **Lines removed:** ~45 (custom verifySignature function)
- **Lines added:** ~5 (parseBody import and usage)
- **Risk:** Low (using official library)
- **Testing:** Manual verification via Sanity publish
