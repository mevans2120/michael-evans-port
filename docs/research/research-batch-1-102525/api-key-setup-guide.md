# API Key Setup Guide for AI Chatbot

This guide will walk you through getting the free API keys needed for your portfolio chatbot.

## Total Time: ~10-15 minutes
## Total Cost: $0 (all free tiers)

---

## Step 1: Google AI API Key (5 minutes)

### What it's for:
- Powers the AI responses using Google's Gemini 1.5 Pro model
- Generates embeddings for your content
- **Free tier**: 15 requests per minute, 1,500 requests per day

### How to get it:

1. **Go to Google AI Studio:**
   - Visit: https://aistudio.google.com/app/apikey
   - Sign in with your Google account

2. **Create API Key:**
   - Click "Create API Key" button
   - Select "Create API key in new project" (or choose existing project)
   - Copy the API key that appears

3. **Add to .env.local:**
   - Open `/Users/michaelevans/michael-evans-port-main/.env.local`
   - Replace `your_google_ai_api_key_here` with your actual key
   - Example: `GOOGLE_GENERATIVE_AI_API_KEY=AIzaSyA...`

### Security Notes:
- Never commit this key to git (already in .gitignore)
- Don't share it publicly
- If compromised, you can regenerate it from AI Studio

---

## Step 2: Supabase Project Setup (10 minutes)

### What it's for:
- Stores vector embeddings of your portfolio content
- Provides semantic search capabilities
- **Free tier**: 500MB database, 2GB bandwidth/month

### How to set it up:

1. **Create Supabase Account:**
   - Visit: https://supabase.com/dashboard
   - Sign up with GitHub (recommended) or email
   - Verify your email if needed

2. **Create New Project:**
   - Click "New Project"
   - Choose your organization (or create one)
   - **Project Name:** `michael-evans-portfolio` (or whatever you prefer)
   - **Database Password:** Choose a strong password and save it
   - **Region:** Choose closest to your users (e.g., `us-east-1` for East Coast)
   - Click "Create new project"
   - Wait 2-3 minutes for project to initialize

3. **Enable pgvector Extension:**
   - Once project is ready, go to "Database" → "Extensions" in sidebar
   - Search for "vector"
   - Click "Enable" on the `vector` extension
   - This allows storing and searching vector embeddings

4. **Get API Keys:**
   - Go to "Settings" → "API" in the sidebar
   - You'll see three important values:

   **Project URL:**
   - Copy the URL under "Project URL"
   - Example: `https://abcdefghijklmnop.supabase.co`
   - Add to .env.local as `NEXT_PUBLIC_SUPABASE_URL`

   **Anon/Public Key:**
   - Copy the key under "Project API keys" → "anon public"
   - This is safe to expose in frontend code
   - Add to .env.local as `NEXT_PUBLIC_SUPABASE_ANON_KEY`

   **Service Role Key:**
   - Click to reveal "service_role secret"
   - **IMPORTANT:** This key has full database access - keep it secret!
   - Add to .env.local as `SUPABASE_SERVICE_ROLE_KEY`

---

## Step 3: Verify Environment Variables

Your `.env.local` file should now look like this:

```bash
# Sanity Configuration (Next.js uses NEXT_PUBLIC_ prefix)
NEXT_PUBLIC_SANITY_PROJECT_ID=5n331bys
NEXT_PUBLIC_SANITY_DATASET=production
NEXT_PUBLIC_SANITY_API_VERSION=2024-01-01

# Migration token - from Sanity CLI login
SANITY_AUTH_TOKEN=skcJf38Eo8KBxDUqBh7B7M1QJHLNpBBqLAVfpEmiSVsTrZvonnudlIRxrWzYoawixXe4IUz5cKKBEXTL0

# AI Chatbot Configuration
GOOGLE_GENERATIVE_AI_API_KEY=AIzaSyA_your_actual_key_here

# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://yourproject.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

---

## Step 4: Restart Development Server

After adding the environment variables:

1. **Stop the current dev server** (if running)
   - Press `Ctrl+C` in the terminal

2. **Restart it:**
   ```bash
   npm run dev
   ```

3. **Verify keys are loaded:**
   - The server should start without errors
   - Environment variables are now available to the app

---

## Troubleshooting

### Google AI API Key Issues:

**Error: "API key not valid"**
- Make sure you copied the entire key (usually starts with `AIza`)
- Check for extra spaces or line breaks
- Verify the key is enabled in Google AI Studio

**Error: "Quota exceeded"**
- Free tier: 15 requests/minute, 1,500/day
- Wait a minute and try again
- Consider upgrading if you need higher limits (unlikely for portfolio)

### Supabase Issues:

**Error: "Invalid project URL"**
- URL should be `https://[project-id].supabase.co`
- No trailing slash
- Must include `https://`

**Error: "Invalid API key"**
- Make sure you're using the right key for the right variable:
  - `anon public` → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
  - `service_role` → `SUPABASE_SERVICE_ROLE_KEY`
- Keys are very long (hundreds of characters)
- Should start with `eyJhbGc...`

**Error: "Extension not enabled"**
- Go back to Supabase Dashboard
- Database → Extensions
- Enable the `vector` extension
- Wait 30 seconds and try again

---

## Free Tier Limits

### Google Gemini API:
- **Requests:** 15 per minute, 1,500 per day
- **Context:** 2 million tokens per minute
- **For your chatbot:** Should handle 100-200 conversations/day easily

### Supabase:
- **Database Size:** 500 MB (plenty for embeddings)
- **Bandwidth:** 2 GB/month
- **Database:** Unlimited queries
- **For your chatbot:** Should handle thousands of conversations/month

### When You Might Need to Upgrade:

**Google AI (very unlikely):**
- Getting 1,500+ chatbot conversations per day
- Rate limit errors during normal traffic
- **Cost if upgraded:** ~$1-5/month

**Supabase (very unlikely):**
- Database exceeds 500MB (would need 100,000+ content chunks)
- Bandwidth exceeds 2GB/month (would need 10,000+ conversations)
- **Cost if upgraded:** $25/month for Pro tier

---

## Security Best Practices

### DO:
✅ Keep API keys in `.env.local` (already in .gitignore)
✅ Use different keys for development vs. production
✅ Rotate keys if you suspect compromise
✅ Monitor usage in respective dashboards

### DON'T:
❌ Commit `.env.local` to git
❌ Share keys in screenshots or demos
❌ Use production keys in development
❌ Hardcode keys in source files

---

## Next Steps

Once your API keys are set up:

1. ✅ Verify `.env.local` has all keys
2. ✅ Restart development server
3. ✅ Continue with chatbot implementation
4. 🎯 Wait for database schema setup (next step in implementation)

---

## Questions?

If you run into issues:

1. Check the troubleshooting section above
2. Verify all keys are copied correctly (no spaces, complete)
3. Confirm extensions are enabled in Supabase
4. Make sure dev server was restarted after adding keys

The next step is setting up the database schema in Supabase, which I'll handle once you have these keys configured!
