# Configure CORS for Sanity Project

## Quick Setup

Your Sanity project is configured and ready! Now you need to add CORS origins to allow your app to access the Sanity API.

## Project Details
- **Project ID**: `vc89ievx`
- **Dataset**: `production`
- **Project Name**: DOA

## Add CORS Origins

1. **Open Sanity Management Console**:

   Click this link to go directly to your project's API settings:
   👉 [https://www.sanity.io/manage/project/vc89ievx/api](https://www.sanity.io/manage/project/vc89ievx/api)

2. **Navigate to CORS Origins**:
   - In the API settings page
   - Find the "CORS origins" section
   - Click "Add CORS origin"

3. **Add Development URL**:
   - Origin: `http://localhost:5173`
   - Check "Allow credentials"
   - Click "Add origin"

4. **Add Production URL**:
   - Origin: `https://michael-evans-port.vercel.app`
   - Check "Allow credentials"
   - Click "Add origin"

5. **Add Sanity Studio URL** (for local studio):
   - Origin: `http://localhost:3333`
   - Check "Allow credentials"
   - Click "Add origin"

## Verify Setup

After adding CORS origins, test your setup:

```bash
# Start the development server
npm run dev
```

Then visit:
- Main site: [http://localhost:5173](http://localhost:5173)
- Sanity Studio: [http://localhost:5173/studio](http://localhost:5173/studio)

## Alternative: Using Sanity CLI

You can also add CORS origins using the CLI:

```bash
npx sanity cors add http://localhost:5173 --credentials
npx sanity cors add https://michael-evans-port.vercel.app --credentials
npx sanity cors add http://localhost:3333 --credentials
```

## Troubleshooting

If you see CORS errors:
1. Make sure you clicked "Allow credentials" for each origin
2. Clear your browser cache
3. Check that the URLs match exactly (no trailing slashes)
4. Wait a minute for changes to propagate

## Next Steps

Once CORS is configured:
1. Access Sanity Studio at `/studio`
2. Create your first content (Profile, Projects, Capabilities)
3. The content will automatically appear on your site!

---

✅ Your Sanity project is ready to use!