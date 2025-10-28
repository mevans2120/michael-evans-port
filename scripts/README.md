# Migration Scripts

## About Page Content Migration

This script populates the Sanity CMS with content for the about page based on the content spec at `/docs/content-specs/profile-about-content-spec.md`.

### Prerequisites

1. **Sanity API Token**: You need a Sanity API token with write permissions.

   **How to get your token:**
   - Go to https://www.sanity.io/manage
   - Select your project (michael-evans-port)
   - Go to "API" → "Tokens"
   - Click "Add API token"
   - Name it "Migration Script"
   - Set permissions to "Editor"
   - Copy the token

2. **Add token to your environment:**
   ```bash
   # Add this line to your .env.local file
   SANITY_API_TOKEN=your_token_here
   ```

### Running the Migration

```bash
npm run migrate:about
```

### What the Script Does

The migration script will:

1. ✅ Connect to your Sanity project
2. ✅ Fetch the existing profile document
3. ✅ Add/update these fields:
   - Hero section (headline, subheadline, intro)
   - Quick facts (6 items)
   - Capabilities (7 items including "Development" with "new" badge)
   - Selected projects (4 projects with metrics)
   - Content sections (3 main sections with subsections)
   - CTA data (availability, text, button text)
4. ✅ Preserve all existing profile data (name, image, social links, etc.)

### After Migration

- **View your about page:** http://localhost:3000/about
- **Edit in Sanity Studio:** http://localhost:3000/studio

### Troubleshooting

**"No profile document found"**
- Go to http://localhost:3000/studio
- Create a Profile document first
- Make sure Name and Profile Image are filled in
- Then run the migration

**"Authentication error"**
- Check that `SANITY_API_TOKEN` is set in `.env.local`
- Make sure the token has Editor permissions
- Restart your dev server after adding the token

**"Module not found" errors**
- The script uses the same Sanity client as the main app
- Make sure all dependencies are installed: `npm install`

### Customizing the Content

To modify the content before migrating, edit the data structures in:
`scripts/migrate-about-content.ts`

The script is structured to make it easy to:
- Add/remove quick facts
- Update capabilities
- Reorder projects
- Add more content sections

### Manual Editing After Migration

After running the migration, you can:
- Edit any field in Sanity Studio at http://localhost:3000/studio
- Add more sections, projects, or capabilities
- Toggle section visibility
- Update copy and metrics
- Add rich text formatting

The migration is a starting point - feel free to refine the content in Sanity Studio!
