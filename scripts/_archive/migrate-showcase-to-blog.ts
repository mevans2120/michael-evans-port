#!/usr/bin/env tsx
/**
 * Migration Script: AI Showcase to Blog Posts
 *
 * Transforms the 2 AI Showcase posts into blog format:
 * - marketing-sites → Blog post
 * - ai-workflow → Blog post
 */

import { createClient } from '@sanity/client';
import * as dotenv from 'dotenv';
import { resolve } from 'path';

// Load environment variables from .env.local
dotenv.config({ path: resolve(process.cwd(), '.env.local') });

// Create write-enabled client
const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || '5n331bys',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2024-01-01',
  token: process.env.SANITY_WRITE_TOKEN,
  useCdn: false,
});

// Helper: Calculate reading time (words per minute = 200)
function calculateReadingTime(content: any[]): number {
  let wordCount = 0;

  content.forEach((block) => {
    if (block._type === 'block' && block.children) {
      block.children.forEach((child: any) => {
        if (child.text) {
          wordCount += child.text.split(/\s+/).length;
        }
      });
    }
  });

  return Math.max(1, Math.ceil(wordCount / 200));
}

// Helper: Flatten slides into single content array
function flattenSlidesToContent(slides: any[]): any[] {
  const content: any[] = [];

  slides.forEach((slide, index) => {
    // Add section label as H2 if exists
    if (slide.sectionLabel) {
      content.push({
        _type: 'block',
        _key: `section-${index}`,
        style: 'h2',
        children: [{ _type: 'span', text: slide.sectionLabel, marks: [] }],
        markDefs: [],
      });
    }

    // Add heading as H3 if exists
    if (slide.heading) {
      content.push({
        _type: 'block',
        _key: `heading-${index}`,
        style: 'h3',
        children: [{ _type: 'span', text: slide.heading, marks: [] }],
        markDefs: [],
      });
    }

    // Add main content blocks
    if (slide.content && Array.isArray(slide.content)) {
      slide.content.forEach((block: any) => {
        content.push(block);
      });
    }

    // Add quote as blockquote if exists
    if (slide.quoteBox) {
      content.push({
        _type: 'block',
        _key: `quote-${index}`,
        style: 'blockquote',
        children: [{
          _type: 'span',
          text: slide.quoteBox.quote + (slide.quoteBox.attribution ? ` ${slide.quoteBox.attribution}` : ''),
          marks: []
        }],
        markDefs: [],
      });
    }

    // Add comparison boxes as list items or paragraphs
    if (slide.comparisonBoxes && slide.comparisonBoxes.length > 0) {
      slide.comparisonBoxes.forEach((box: any) => {
        content.push({
          _type: 'block',
          _key: `comparison-${box._key}`,
          style: 'normal',
          children: [
            {
              _type: 'span',
              text: `${box.icon || ''} ${box.label || ''}: ${box.text || ''}`,
              marks: ['strong'],
            }
          ],
          markDefs: [],
        });
      });
    }

    // Add tech stack as a paragraph
    if (slide.techPills && slide.techPills.length > 0) {
      content.push({
        _type: 'block',
        _key: `tech-${index}`,
        style: 'normal',
        children: [{
          _type: 'span',
          text: `Technologies: ${slide.techPills.join(', ')}`,
          marks: ['strong']
        }],
        markDefs: [],
      });
    }

    // Add spacer between slides
    content.push({
      _type: 'block',
      _key: `spacer-${index}`,
      style: 'normal',
      children: [{ _type: 'span', text: '', marks: [] }],
      markDefs: [],
    });
  });

  return content;
}

async function migrateShowcaseToBlog() {
  console.log('🚀 Starting AI Showcase to Blog migration...\n');

  // Fetch the 2 AI Showcase posts
  const showcases = await client.fetch(
    `*[_type == "aiShowcase" && category in ["ai-workflow", "marketing-sites"]] | order(category desc)`
  );

  console.log(`Found ${showcases.length} AI Showcase posts to migrate\n`);

  for (const showcase of showcases) {
    console.log(`📝 Migrating: ${showcase.title}`);

    // Transform to blog format
    const content = flattenSlidesToContent(showcase.slides || []);
    const readingTime = calculateReadingTime(content);

    const blogPost = {
      _type: 'blog',
      _id: `blog-${showcase.slug.current}`,
      title: showcase.title,
      slug: showcase.slug,
      excerpt: showcase.heroSection?.summary?.substring(0, 200) || '',

      heroSection: {
        badge: showcase.heroSection?.badge || '',
        title: showcase.heroSection?.title || showcase.title,
        subtitle: showcase.heroSection?.subtitle || '',
      },

      content,

      publishedAt: showcase._createdAt,
      updatedAt: showcase._updatedAt,
      author: 'Michael Evans',
      readingTime,

      featured: showcase.featured || false,
      order: showcase.order || 0,

      featuredImage: showcase.featuredImage || undefined,

      seo: showcase.seo || undefined,
    };

    try {
      // Create the blog post in Sanity
      const result = await client.createOrReplace(blogPost);
      console.log(`   ✅ Created blog post: ${result._id}`);
      console.log(`   📊 Reading time: ${readingTime} minutes`);
      console.log(`   📄 Content blocks: ${content.length}`);
      console.log('');
    } catch (error) {
      console.error(`   ❌ Error creating blog post:`, error);
      console.log('');
    }
  }

  console.log('✨ Migration complete!\n');
  console.log('Next steps:');
  console.log('1. Visit http://localhost:3000/studio to verify the blog posts');
  console.log('2. Visit http://localhost:3000/blog to see them on the site');
  console.log('3. Edit content as needed in Sanity Studio');
}

// Run the migration
migrateShowcaseToBlog().catch(console.error);
