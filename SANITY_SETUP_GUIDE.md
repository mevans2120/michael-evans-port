# Sanity CMS Setup Guide

## 📋 Overview

Your portfolio site is now configured to use Sanity CMS. This guide will walk you through the final setup steps to connect to your Sanity project.

## 🚀 Quick Start

### 1. Create a Sanity Project

If you don't already have a Sanity account:

1. Go to [sanity.io](https://www.sanity.io) and sign up for a free account
2. Create a new project in the Sanity dashboard
3. Note your **Project ID** and **Dataset name** (usually "production")

OR use the CLI:

```bash
npx sanity@latest init --bare
```

This will:
- Log you into Sanity (or create an account)
- Create a new project
- Display your project ID

### 2. Configure Environment Variables

Update the `.env.local` file with your Sanity project details:

```env
VITE_SANITY_PROJECT_ID=your-actual-project-id
VITE_SANITY_DATASET=production
```

Replace `your-actual-project-id` with the Project ID from step 1.

### 3. Configure CORS Settings

In your Sanity project dashboard:

1. Go to **API** → **CORS Origins**
2. Add your development and production URLs:
   - `http://localhost:5173` (development)
   - `https://michael-evans-port.vercel.app` (production)
   - `http://localhost:3333` (Sanity Studio)
3. Enable credentials for each origin

### 4. Start Development

Run both the React app and Sanity Studio:

```bash
# Terminal 1: Start the React app
npm run dev

# Terminal 2: Start Sanity Studio (optional)
npm run sanity
```

Your site will be available at:
- Main site: `http://localhost:5173`
- Embedded Studio: `http://localhost:5173/studio`
- Standalone Studio: `http://localhost:3333`

## 📁 Project Structure

```
├── sanity/                  # Sanity configuration
│   ├── schemas/            # Content schemas
│   │   ├── project.ts      # Projects/case studies schema
│   │   ├── profile.ts      # Profile/about schema
│   │   ├── capability.ts   # Capabilities/skills schema
│   │   └── index.ts        # Schema exports
│   ├── sanity.config.ts    # Studio configuration
│   └── sanity.cli.ts       # CLI configuration
├── src/
│   ├── lib/sanity/         # Sanity client and utilities
│   │   ├── client.ts       # Configured Sanity client
│   │   ├── queries.ts      # GROQ queries
│   │   └── types.ts        # TypeScript types
│   ├── hooks/
│   │   └── useSanityData.ts # Data fetching hook
│   └── components/
│       └── PortableText.tsx # Rich text renderer
```

## 📝 Content Schemas

### Project Schema
- Title, slug, category
- Hero image
- Summary and description
- Key metrics (label/value pairs)
- Achievements (bullet points)
- Rich content with images and code blocks
- Technologies used
- Live URL and GitHub URL
- Featured flag

### Profile Schema
- Name, title, tagline
- Bio (rich text)
- Profile image
- Skills by category
- Experience timeline
- Social links

### Capability Schema
- Title and category
- Icon name (Lucide icons)
- Description
- Related skills
- Display order

## 🔧 Usage Examples

### Fetching Projects in a Component

```typescript
import { useSanityData } from '@/hooks/useSanityData'
import { projectsQuery } from '@/lib/sanity/queries'
import { SanityProject } from '@/lib/sanity/types'

function ProjectsList() {
  const { data: projects, loading, error } = useSanityData<SanityProject[]>(projectsQuery)

  if (loading) return <div>Loading...</div>
  if (error) return <div>Error loading projects</div>

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {projects?.map((project) => (
        <div key={project._id}>
          <h2>{project.title}</h2>
          <p>{project.summary}</p>
        </div>
      ))}
    </div>
  )
}
```

### Rendering Portable Text

```typescript
import PortableText from '@/components/PortableText'

function ProjectContent({ content }) {
  return <PortableText value={content} />
}
```

### Using Images

```typescript
import { urlFor } from '@/lib/sanity/client'

function ProjectImage({ image, alt }) {
  return (
    <img
      src={urlFor(image).width(800).height(600).url()}
      alt={alt}
      loading="lazy"
    />
  )
}
```

## 📊 Available GROQ Queries

- `projectsQuery` - Get all projects
- `featuredProjectsQuery` - Get featured projects
- `projectQuery` - Get single project by slug
- `projectsByCategoryQuery` - Get projects by category
- `profileQuery` - Get profile information
- `capabilitiesQuery` - Get all capabilities
- `capabilitiesByCategoryQuery` - Get capabilities by category

## 🎨 Sanity Studio

Access the Sanity Studio to manage content:

### Embedded Studio
Navigate to `/studio` in your app to access the embedded studio.

### Standalone Studio
Run `npm run sanity` to start the studio on `http://localhost:3333`

### Deploy Studio
Deploy your studio to Sanity's hosting:

```bash
cd sanity
npx sanity deploy
```

Your studio will be available at `https://[project-name].sanity.studio`

## 🚢 Deployment

### Environment Variables on Vercel

1. Go to your Vercel project settings
2. Navigate to **Environment Variables**
3. Add:
   - `VITE_SANITY_PROJECT_ID` = your-project-id
   - `VITE_SANITY_DATASET` = production
4. Redeploy your site

## 🔐 Security Notes

- Never commit `.env.local` to version control
- Use read-only tokens for production if your dataset is private
- Configure CORS origins restrictively
- Enable API rate limiting in Sanity dashboard if needed

## 🎯 Next Steps

1. **Add Initial Content**
   - Open Sanity Studio
   - Create your profile/about content
   - Add projects/case studies
   - Define capabilities

2. **Update Components**
   - Replace static content with Sanity data
   - Implement dynamic routing for projects
   - Add loading states and error handling

3. **Optimize Performance**
   - Implement caching with React Query
   - Use image optimization
   - Add pagination for large datasets

## 📚 Resources

- [Sanity Documentation](https://www.sanity.io/docs)
- [GROQ Cheat Sheet](https://www.sanity.io/docs/groq)
- [Portable Text Guide](https://github.com/portabletext/react-portabletext)
- [Image URL Builder](https://www.sanity.io/docs/image-url)

## 🆘 Troubleshooting

### "Failed to fetch data"
- Check that your Project ID and Dataset are correct in `.env.local`
- Verify CORS origins are configured
- Ensure your dataset is public or you have an API token

### Images not loading
- Check that images are published in Sanity
- Verify the image URL builder is configured correctly
- Check browser console for CORS errors

### Studio not loading
- Ensure all dependencies are installed: `npm install`
- Check that environment variables are set
- Try clearing browser cache and localStorage

---

*Your Sanity CMS integration is ready! Follow the steps above to complete the setup.*