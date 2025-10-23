# Sanity CMS Implementation Plan

## 📋 Executive Summary

This document outlines the implementation plan for integrating Sanity CMS with the Michael Evans Portfolio site. Sanity will provide a flexible, real-time content management system for portfolio projects, case studies, blog posts, and site content.

## 🎯 Implementation Goals

1. **Content Management**: Enable easy updates to portfolio items, case studies, and about content
2. **Blog Integration**: Add blog functionality with rich text editing
3. **Media Management**: Centralized asset management for images and videos
4. **Real-time Preview**: Live content preview while editing
5. **SEO Optimization**: Dynamic meta tags and structured data
6. **Scalability**: Future-proof architecture for content growth

## 💰 Cost Analysis

### Recommended Plan: Free Plan
- **Cost**: $0/month
- **Includes**:
  - Unlimited free projects
  - 1M API CDN requests/month (more than sufficient for portfolio)
  - 100GB bandwidth/month
  - 3 users
  - Visual Editing
  - Content Source Maps
  - 30-day trial of Growth features

### Why Free Plan is Sufficient:
- Portfolio sites typically have < 10k monthly visitors
- Content updates are infrequent (weekly/monthly)
- 100GB bandwidth supports ~100k page views with images
- Can upgrade to Growth ($15/month) if needed

## 🏗️ Architecture Overview

```
┌─────────────────┐     ┌──────────────┐     ┌─────────────────┐
│   Sanity Studio │────▶│  Sanity API  │◀────│  React/Vite App │
│   (Admin Panel) │     │   (Backend)   │     │   (Frontend)    │
└─────────────────┘     └──────────────┘     └─────────────────┘
         │                      │                      │
         │                      ▼                      │
         │              ┌──────────────┐              │
         └─────────────▶│  CDN/Assets  │◀─────────────┘
                        └──────────────┘
```

## 📦 Required Dependencies

```json
{
  "dependencies": {
    "@sanity/client": "^6.x",           // Sanity client for data fetching
    "@sanity/image-url": "^1.x",        // Image URL builder
    "@sanity/react-loader": "^1.x",     // React data loader
    "@portabletext/react": "^3.x",      // Rich text renderer
    "groq": "^3.x"                      // GROQ query language
  },
  "devDependencies": {
    "sanity": "^3.x",                    // Sanity Studio
    "@sanity/vision": "^3.x"            // GROQ playground
  }
}
```

## 🗂️ Content Schema Design

### 1. Project/Case Study Schema
```typescript
// schemas/project.ts
export default {
  name: 'project',
  title: 'Projects',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: Rule => Rule.required()
    },
    {
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: { source: 'title' },
      validation: Rule => Rule.required()
    },
    {
      name: 'category',
      title: 'Category',
      type: 'string',
      options: {
        list: [
          { title: 'Case Study', value: 'case-study' },
          { title: 'AI Project', value: 'ai-project' },
          { title: 'Research', value: 'research' },
          { title: 'Open Source', value: 'open-source' }
        ]
      }
    },
    {
      name: 'heroImage',
      title: 'Hero Image',
      type: 'image',
      options: { hotspot: true }
    },
    {
      name: 'summary',
      title: 'Summary',
      type: 'text',
      rows: 3
    },
    {
      name: 'metrics',
      title: 'Key Metrics',
      type: 'array',
      of: [{
        type: 'object',
        fields: [
          { name: 'label', type: 'string', title: 'Label' },
          { name: 'value', type: 'string', title: 'Value' }
        ]
      }]
    },
    {
      name: 'content',
      title: 'Content',
      type: 'array',
      of: [
        { type: 'block' },
        { type: 'image', options: { hotspot: true } },
        { type: 'code' }
      ]
    },
    {
      name: 'technologies',
      title: 'Technologies Used',
      type: 'array',
      of: [{ type: 'string' }],
      options: { layout: 'tags' }
    },
    {
      name: 'liveUrl',
      title: 'Live URL',
      type: 'url'
    },
    {
      name: 'githubUrl',
      title: 'GitHub URL',
      type: 'url'
    },
    {
      name: 'publishedAt',
      title: 'Published At',
      type: 'datetime'
    },
    {
      name: 'featured',
      title: 'Featured Project',
      type: 'boolean',
      initialValue: false
    }
  ]
}
```

### 2. Blog Post Schema
```typescript
// schemas/blogPost.ts
export default {
  name: 'blogPost',
  title: 'Blog Posts',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: Rule => Rule.required()
    },
    {
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: { source: 'title' }
    },
    {
      name: 'author',
      title: 'Author',
      type: 'reference',
      to: [{ type: 'author' }]
    },
    {
      name: 'categories',
      title: 'Categories',
      type: 'array',
      of: [{ type: 'reference', to: { type: 'category' } }]
    },
    {
      name: 'publishedAt',
      title: 'Published at',
      type: 'datetime'
    },
    {
      name: 'mainImage',
      title: 'Main image',
      type: 'image',
      options: { hotspot: true }
    },
    {
      name: 'excerpt',
      title: 'Excerpt',
      type: 'text',
      rows: 4
    },
    {
      name: 'body',
      title: 'Body',
      type: 'blockContent' // Rich text with code blocks, images
    },
    {
      name: 'seo',
      title: 'SEO',
      type: 'object',
      fields: [
        { name: 'metaTitle', type: 'string', title: 'Meta Title' },
        { name: 'metaDescription', type: 'text', title: 'Meta Description' },
        { name: 'keywords', type: 'array', of: [{ type: 'string' }] }
      ]
    }
  ]
}
```

### 3. About/Profile Schema
```typescript
// schemas/profile.ts
export default {
  name: 'profile',
  title: 'Profile',
  type: 'document',
  fields: [
    {
      name: 'name',
      title: 'Name',
      type: 'string'
    },
    {
      name: 'title',
      title: 'Professional Title',
      type: 'string'
    },
    {
      name: 'bio',
      title: 'Bio',
      type: 'array',
      of: [{ type: 'block' }]
    },
    {
      name: 'skills',
      title: 'Skills',
      type: 'array',
      of: [{
        type: 'object',
        fields: [
          { name: 'category', type: 'string', title: 'Category' },
          { name: 'skills', type: 'array', of: [{ type: 'string' }] }
        ]
      }]
    },
    {
      name: 'experience',
      title: 'Experience',
      type: 'array',
      of: [{
        type: 'object',
        fields: [
          { name: 'company', type: 'string' },
          { name: 'role', type: 'string' },
          { name: 'startDate', type: 'date' },
          { name: 'endDate', type: 'date' },
          { name: 'description', type: 'text' }
        ]
      }]
    },
    {
      name: 'social',
      title: 'Social Links',
      type: 'object',
      fields: [
        { name: 'github', type: 'url' },
        { name: 'linkedin', type: 'url' },
        { name: 'twitter', type: 'url' },
        { name: 'email', type: 'email' }
      ]
    }
  ]
}
```

## 📁 Project Structure

```
michael-evans-port-main/
├── sanity/                      # Sanity Studio
│   ├── schemas/                 # Content schemas
│   │   ├── index.ts            # Schema exports
│   │   ├── project.ts          # Project schema
│   │   ├── blogPost.ts         # Blog post schema
│   │   ├── author.ts           # Author schema
│   │   ├── category.ts         # Category schema
│   │   ├── profile.ts          # Profile schema
│   │   └── blockContent.ts     # Rich text schema
│   ├── lib/                    # Sanity utilities
│   │   ├── client.ts           # Sanity client config
│   │   ├── image.ts            # Image URL builder
│   │   └── queries.ts          # GROQ queries
│   ├── sanity.config.ts        # Studio configuration
│   ├── sanity.cli.ts           # CLI configuration
│   └── package.json            # Studio dependencies
├── src/
│   ├── lib/
│   │   └── sanity/
│   │       ├── client.ts       # Frontend Sanity client
│   │       ├── queries.ts      # GROQ queries
│   │       └── types.ts        # TypeScript types
│   ├── hooks/
│   │   ├── useSanityData.ts   # Data fetching hook
│   │   └── useLivePreview.ts  # Preview hook
│   └── components/
│       └── PortableText.tsx    # Rich text renderer
```

## 🔧 Implementation Steps

### Phase 1: Setup & Configuration (Week 1)

1. **Initialize Sanity Studio**
   ```bash
   npm create sanity@latest -- --project portfolio-studio --dataset production
   cd portfolio-studio
   npm install
   ```

2. **Configure Sanity Client in React**
   ```typescript
   // src/lib/sanity/client.ts
   import { createClient } from '@sanity/client'

   export const client = createClient({
     projectId: process.env.VITE_SANITY_PROJECT_ID,
     dataset: process.env.VITE_SANITY_DATASET,
     apiVersion: '2024-01-01',
     useCdn: true,
     perspective: 'published',
   })
   ```

3. **Set up Environment Variables**
   ```env
   VITE_SANITY_PROJECT_ID=your_project_id
   VITE_SANITY_DATASET=production
   VITE_SANITY_API_TOKEN=your_token (optional for private datasets)
   ```

### Phase 2: Schema Development (Week 1-2)

1. Create content schemas (project, blog, profile)
2. Set up validation rules
3. Configure preview components
4. Test in Sanity Studio

### Phase 3: Data Migration (Week 2)

1. **Extract Current Content**
   - Map existing case studies to project schema
   - Convert static content to structured data
   - Prepare image assets for upload

2. **Import to Sanity**
   ```bash
   # Use Sanity CLI or migration scripts
   sanity dataset import ./data/portfolio-content.ndjson production
   ```

### Phase 4: Frontend Integration (Week 2-3)

1. **Create Data Fetching Hooks**
   ```typescript
   // src/hooks/useSanityData.ts
   import { useEffect, useState } from 'react'
   import { client } from '@/lib/sanity/client'

   export function useSanityData(query: string) {
     const [data, setData] = useState(null)
     const [loading, setLoading] = useState(true)

     useEffect(() => {
       client.fetch(query)
         .then(setData)
         .finally(() => setLoading(false))
     }, [query])

     return { data, loading }
   }
   ```

2. **Update Page Components**
   ```typescript
   // src/pages/CaseStudies.tsx
   import { useSanityData } from '@/hooks/useSanityData'
   import { projectsQuery } from '@/lib/sanity/queries'

   const CaseStudies = () => {
     const { data: projects, loading } = useSanityData(projectsQuery)

     if (loading) return <LoadingSpinner />

     return (
       <div>
         {projects?.map(project => (
           <ProjectCard key={project._id} {...project} />
         ))}
       </div>
     )
   }
   ```

3. **Implement Rich Text Rendering**
   ```typescript
   // src/components/PortableText.tsx
   import { PortableText as PT } from '@portabletext/react'

   const components = {
     block: {
       h1: ({children}) => <h1 className="text-4xl">{children}</h1>,
       normal: ({children}) => <p className="mb-4">{children}</p>,
     },
     marks: {
       link: ({children, value}) => (
         <a href={value.href} className="text-primary hover:underline">
           {children}
         </a>
       ),
     },
   }

   export const PortableText = ({ value }) => (
     <PT value={value} components={components} />
   )
   ```

### Phase 5: Preview & Testing (Week 3)

1. **Set up Live Preview**
   ```typescript
   // Enable preview mode for authenticated users
   import { definePreview } from '@sanity/preview-kit'

   const { useLiveQuery } = definePreview({
     projectId,
     dataset,
   })
   ```

2. **Testing Checklist**
   - [ ] Content CRUD operations
   - [ ] Image optimization and CDN delivery
   - [ ] SEO meta tags generation
   - [ ] Performance benchmarks
   - [ ] Mobile responsiveness
   - [ ] Error handling

### Phase 6: Deployment (Week 4)

1. **Deploy Sanity Studio**
   ```bash
   sanity deploy
   # Studio will be available at https://[project-name].sanity.studio
   ```

2. **Update Frontend Build**
   - Add Sanity environment variables to deployment platform
   - Configure build hooks for content updates
   - Set up webhook for cache invalidation

3. **Configure CDN & Caching**
   - Enable Sanity CDN for production
   - Set appropriate cache headers
   - Configure ISR if using Next.js in future

## 🎨 UI/UX Considerations

### Admin Experience
- Custom dashboard in Sanity Studio
- Workflow for content approval
- Media library organization
- Content scheduling (if upgraded to Team plan)

### Frontend Performance
- Lazy load images with Sanity Image Pipeline
- Implement pagination for blog/projects
- Use React Query for caching
- Progressive enhancement

## 🔍 SEO Implementation

```typescript
// src/components/SEO.tsx
import { Helmet } from 'react-helmet'

export const SEO = ({ title, description, image, article }) => {
  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:type" content={article ? 'article' : 'website'} />
      <script type="application/ld+json">
        {JSON.stringify(generateStructuredData())}
      </script>
    </Helmet>
  )
}
```

## 📊 GROQ Queries Examples

```groq
// Get all projects
*[_type == "project"] | order(publishedAt desc) {
  _id,
  title,
  slug,
  summary,
  heroImage,
  technologies,
  "imageUrl": heroImage.asset->url
}

// Get single project with full content
*[_type == "project" && slug.current == $slug][0] {
  ...,
  "imageUrl": heroImage.asset->url,
  content[] {
    ...,
    _type == "image" => {
      "url": asset->url,
      "dimensions": asset->metadata.dimensions
    }
  }
}

// Get featured projects for homepage
*[_type == "project" && featured == true] | order(publishedAt desc)[0...3]

// Get blog posts with author
*[_type == "blogPost"] {
  ...,
  author->,
  categories[]->
} | order(publishedAt desc)
```

## 🚀 Performance Optimizations

1. **Image Optimization**
   ```typescript
   import imageUrlBuilder from '@sanity/image-url'

   const builder = imageUrlBuilder(client)

   export function urlFor(source) {
     return builder
       .image(source)
       .auto('format')
       .fit('max')
       .url()
   }
   ```

2. **Query Optimization**
   - Use projections to limit data transfer
   - Implement pagination for large datasets
   - Cache queries with React Query
   - Use CDN for static assets

3. **Bundle Size**
   - Lazy load Sanity components
   - Tree-shake unused schemas
   - Optimize portable text components

## 🔒 Security Considerations

1. **API Security**
   - Use read-only tokens for frontend
   - Implement CORS policies
   - Rate limiting on API requests
   - Validate and sanitize user inputs

2. **Content Security**
   - Review content before publishing
   - Implement user roles and permissions
   - Regular backups of content
   - Audit log for content changes

## 📈 Monitoring & Analytics

1. **Content Analytics**
   - Track popular content
   - Monitor API usage
   - Analyze user engagement
   - A/B testing for content

2. **Performance Monitoring**
   - Core Web Vitals tracking
   - API response times
   - CDN hit rates
   - Error tracking with Sentry

## 🎯 Success Metrics

- **Content Management**: 80% reduction in content update time
- **Performance**: < 2s page load time with images
- **SEO**: 30% improvement in organic traffic
- **Developer Experience**: Single source of truth for content
- **Scalability**: Support for 100+ projects/posts

## 📅 Timeline

| Week | Phase | Deliverables |
|------|-------|-------------|
| 1 | Setup & Config | Sanity Studio running, schemas designed |
| 2 | Data Migration | Content migrated, frontend hooks ready |
| 3 | Integration | Pages using Sanity data, preview working |
| 4 | Testing & Deploy | Production deployment, documentation |

## 💡 Future Enhancements

1. **Phase 2 Features**
   - Newsletter integration
   - Comments system
   - Search functionality
   - Multi-language support

2. **Advanced Features**
   - AI-powered content suggestions
   - Automated social media posting
   - Analytics dashboard
   - A/B testing framework

## 🔗 Resources

- [Sanity Documentation](https://www.sanity.io/docs)
- [GROQ Cheat Sheet](https://www.sanity.io/docs/groq)
- [React Integration Guide](https://www.sanity.io/guides/react)
- [Image Pipeline Docs](https://www.sanity.io/docs/image-url)
- [Portable Text Guide](https://github.com/portabletext/react-portabletext)

---

*This implementation plan provides a comprehensive roadmap for integrating Sanity CMS with the portfolio site. The Free plan is sufficient for initial needs, with easy upgrade path as the site grows.*

*Estimated Implementation Time: 3-4 weeks*
*Estimated Cost: $0/month (Free plan)*