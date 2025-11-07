#!/usr/bin/env tsx

/**
 * Migration Script: PostPal AI Showcase → Case Study
 *
 * Migrates the PostPal project from the aiShowcase collection to the project collection,
 * transforming it into a full case study with proper structure.
 *
 * Transformation Details:
 * - Flattens slide-based structure into linear article content (PortableText)
 * - Converts quoteBox to statBlockQuote inline stat block
 * - Converts comparisonBoxes to structured text content
 * - Extracts techPills as technologies array
 * - Adds project overview metadata (role, company, timeline)
 * - Creates featured metric and description for homepage
 * - Preserves all metrics, hero section, and SEO data
 *
 * Usage:
 *   npm run migrate:postpal
 *   or
 *   tsx scripts/migrate-postpal-to-project.ts
 */

import { createClient } from '@sanity/client';
import * as dotenv from 'dotenv';
import { resolve } from 'path';

// Load environment variables from .env.local
dotenv.config({ path: resolve(process.cwd(), '.env.local') });

// Initialize Sanity client with write permissions
const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || '5n331bys',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2024-01-01',
  token: process.env.SANITY_WRITE_TOKEN,
  useCdn: false,
});

/**
 * Flattens slide-based content into linear article format
 * Converts slides to PortableText blocks with proper headings and structure
 */
function flattenSlidesToArticle(slides: any[]): any[] {
  const article: any[] = [];

  slides.forEach((slide, slideIndex) => {
    // Add section label as H2 (if present)
    if (slide.sectionLabel) {
      article.push({
        _type: 'block',
        _key: `section-${slideIndex}`,
        style: 'h2',
        children: [
          {
            _type: 'span',
            _key: `section-span-${slideIndex}`,
            text: slide.sectionLabel,
            marks: [],
          },
        ],
        markDefs: [],
      });
    }

    // Add slide heading as H3 (if present)
    if (slide.heading) {
      article.push({
        _type: 'block',
        _key: `heading-${slideIndex}`,
        style: 'h3',
        children: [
          {
            _type: 'span',
            _key: `heading-span-${slideIndex}`,
            text: slide.heading,
            marks: [],
          },
        ],
        markDefs: [],
      });
    }

    // Add main content blocks (preserve as-is)
    if (slide.content && Array.isArray(slide.content)) {
      slide.content.forEach((block: any) => {
        article.push(block);
      });
    }

    // Convert quoteBox to statBlockQuote
    if (slide.quoteBox?.quote) {
      article.push({
        _type: 'statBlockQuote',
        _key: `quote-${slideIndex}`,
        quote: slide.quoteBox.quote,
        attribution: slide.quoteBox.attribution || '',
      });
    }

    // Convert comparisonBoxes to structured content
    if (slide.comparisonBoxes && Array.isArray(slide.comparisonBoxes)) {
      slide.comparisonBoxes.forEach((box: any, boxIndex: number) => {
        // Add box label as H4
        if (box.label) {
          article.push({
            _type: 'block',
            _key: `box-label-${slideIndex}-${boxIndex}`,
            style: 'h4',
            children: [
              {
                _type: 'span',
                _key: `box-label-span-${slideIndex}-${boxIndex}`,
                text: box.label,
                marks: [],
              },
            ],
            markDefs: [],
          });
        }

        // Add box title as H5
        if (box.title) {
          article.push({
            _type: 'block',
            _key: `box-title-${slideIndex}-${boxIndex}`,
            style: 'h5',
            children: [
              {
                _type: 'span',
                _key: `box-title-span-${slideIndex}-${boxIndex}`,
                text: `${box.icon ? box.icon + ' ' : ''}${box.title}`,
                marks: [],
              },
            ],
            markDefs: [],
          });
        }

        // Add box stat as inline stat block if present
        if (box.stat) {
          article.push({
            _type: 'statBlockNumber',
            _key: `box-stat-${slideIndex}-${boxIndex}`,
            number: box.stat,
            label: box.title || box.label || 'Key Metric',
          });
        }

        // Add box text as paragraph
        if (box.text) {
          article.push({
            _type: 'block',
            _key: `box-text-${slideIndex}-${boxIndex}`,
            style: 'normal',
            children: [
              {
                _type: 'span',
                _key: `box-text-span-${slideIndex}-${boxIndex}`,
                text: box.text,
                marks: [],
              },
            ],
            markDefs: [],
          });
        }
      });
    }

    // Add spacing between sections (empty paragraph)
    if (slideIndex < slides.length - 1) {
      article.push({
        _type: 'block',
        _key: `spacer-${slideIndex}`,
        style: 'normal',
        children: [
          {
            _type: 'span',
            _key: `spacer-span-${slideIndex}`,
            text: '',
            marks: [],
          },
        ],
        markDefs: [],
      });
    }
  });

  return article;
}

/**
 * Extract technologies from techPills in first slide
 */
function extractTechnologies(slides: any[]): string[] {
  const firstSlide = slides[0];
  if (firstSlide?.techPills && Array.isArray(firstSlide.techPills)) {
    return firstSlide.techPills;
  }
  return [];
}

/**
 * Main migration function
 */
async function migratePostPal() {
  console.log('🚀 Starting PostPal migration: AI Showcase → Case Study');
  console.log('================================================\n');

  try {
    // Step 1: Fetch PostPal from aiShowcase
    console.log('📥 Fetching PostPal from aiShowcase collection...');
    const postpal = await client.fetch(
      `*[_type == "aiShowcase" && slug.current == "post-pal"][0]`
    );

    if (!postpal) {
      throw new Error('PostPal not found in aiShowcase collection');
    }

    console.log('✅ Found PostPal:', postpal.title);
    console.log(`   - ${postpal.slides?.length || 0} slides`);
    console.log(`   - ${postpal.metrics?.length || 0} metrics`);
    console.log(`   - Category: ${postpal.category}\n`);

    // Step 2: Transform content
    console.log('🔄 Transforming content structure...');

    const article = flattenSlidesToArticle(postpal.slides || []);
    const technologies = extractTechnologies(postpal.slides || []);

    console.log(`✅ Flattened ${postpal.slides?.length || 0} slides into ${article.length} content blocks`);
    console.log(`✅ Extracted ${technologies.length} technologies\n`);

    // Step 3: Create project document
    console.log('📝 Creating project document...');

    const projectDoc = {
      _type: 'project',
      _id: 'project-postpal', // Explicit ID for consistency
      title: 'PostPal',
      slug: {
        _type: 'slug',
        current: 'postpal', // Remove hyphen for case study URL
      },
      category: 'Healthcare AI',

      // Hero Section (preserve from aiShowcase)
      heroSection: {
        badge: postpal.heroSection?.badge || 'Healthcare AI',
        title: postpal.heroSection?.title || postpal.title,
        subtitle: postpal.heroSection?.subtitle || '',
        summary: postpal.heroSection?.summary || '',
      },

      // Project Overview (new for case study)
      overview: {
        role: 'Product Manager & Technical Lead',
        company: 'PostPal (Startup)',
        timeline: '2024 - Present',
      },

      // Metrics (preserve from aiShowcase)
      metrics: postpal.metrics || [],

      // Technologies
      technologies,

      // Article Content (flattened from slides)
      article,

      // Featured Image (preserve)
      featuredImage: postpal.featuredImage,

      // SEO (preserve)
      seo: postpal.seo,

      // Homepage Featured Fields
      featured: false, // Start as not featured
      featuredMetric: 'AI-powered care tracking',
      featuredDescription: 'Healthcare AI product that transforms paper discharge instructions into intelligent recovery timelines, reducing patient calls by 30-50% and improving care compliance by up to 40%.',

      // Published date
      publishedAt: new Date().toISOString(),
    };

    console.log('📤 Uploading to Sanity...');
    const result = await client.createOrReplace(projectDoc);

    console.log('✅ Successfully created project:', result._id);
    console.log(`   - View at: /case-studies/postpal\n`);

    // Step 4: Summary
    console.log('📊 Migration Summary:');
    console.log('   ✅ Article blocks created:', article.length);
    console.log('   ✅ Metrics preserved:', postpal.metrics?.length || 0);
    console.log('   ✅ Technologies extracted:', technologies.length);
    console.log('   ✅ Hero section: Complete');
    console.log('   ✅ Project overview: Added');
    console.log('   ✅ SEO metadata: Preserved');
    console.log('   ✅ Featured image: Preserved\n');

    console.log('🎉 Migration complete!');
    console.log('');
    console.log('Next steps:');
    console.log('1. Visit http://localhost:3000/case-studies/postpal to preview');
    console.log('2. Review content in Sanity Studio');
    console.log('3. Delete old aiShowcase document (slug: post-pal)');
    console.log('4. Optionally set featured=true to show on homepage');

  } catch (error) {
    console.error('❌ Migration failed:', error);
    throw error;
  }
}

// Run migration
migratePostPal()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('Fatal error:', error);
    process.exit(1);
  });
