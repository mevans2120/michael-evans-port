/**
 * Migration Script: Populate Hero Options
 *
 * This script migrates the hardcoded hero rotation options from HomeMinimal.tsx
 * to Sanity CMS heroOption documents.
 *
 * Usage:
 *   export SANITY_AUTH_TOKEN="your-token"
 *   npx tsx scripts/migrate-hero-options.ts
 */

import { createClient } from '@sanity/client';

const client = createClient({
  projectId: '5n331bys',
  dataset: 'production',
  apiVersion: '2024-01-01',
  useCdn: false,
  token: process.env.SANITY_AUTH_TOKEN,
});

const heroOptions = [
  {
    _id: 'hero-option-virgin-america',
    _type: 'heroOption',
    prefix: 'shipped the first responsive',
    dropdown: 'airline website',
    linkType: 'external',
    externalLink: '/case-studies/virgin-america',
    label: 'Virgin America',
    description: 'Revolutionized airline digital experience with the first fully responsive airline website',
    imageUrl: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=600&h=400&fit=crop',
    tags: ['UX Design', 'Responsive', 'Innovation'],
    colorGradient: 'from-red-500 to-pink-600',
    active: true,
    order: 1,
    publishedAt: new Date().toISOString(),
  },
  {
    _id: 'hero-option-casa-bonita',
    _type: 'heroOption',
    prefix: 'launched a restaurant with',
    dropdown: 'cliff diving',
    linkType: 'external',
    externalLink: '/case-studies/casa-bonita',
    label: 'Casa Bonita',
    description: 'Brought a legendary Colorado restaurant back to life with immersive entertainment',
    imageUrl: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=600&h=400&fit=crop',
    tags: ['Experience Design', 'Entertainment', 'Revival'],
    colorGradient: 'from-amber-500 to-orange-600',
    active: true,
    order: 2,
    publishedAt: new Date().toISOString(),
  },
  {
    _id: 'hero-option-ai-showcase',
    _type: 'heroOption',
    prefix: 'built production apps with',
    dropdown: 'AI',
    linkType: 'external',
    externalLink: '/ai-showcase',
    label: 'AI App Showcase',
    description: 'Collection of production-ready AI applications solving real-world problems',
    imageUrl: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=600&h=400&fit=crop',
    tags: ['AI/ML', 'Production Apps', 'Innovation'],
    colorGradient: 'from-blue-500 to-cyan-600',
    active: true,
    order: 3,
    publishedAt: new Date().toISOString(),
  },
  {
    _id: 'hero-option-before-launcher',
    _type: 'heroOption',
    prefix: 'helped thousands',
    dropdown: 'focus',
    linkType: 'external',
    externalLink: '/case-studies/before-launcher',
    label: 'Before Launcher',
    description: 'A minimalist Android launcher that helps users reduce phone addiction',
    imageUrl: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=600&h=400&fit=crop',
    tags: ['Mobile App', 'Productivity', 'Wellness'],
    colorGradient: 'from-green-500 to-emerald-600',
    active: true,
    order: 4,
    publishedAt: new Date().toISOString(),
  },
];

async function migrateHeroOptions() {
  console.log('🚀 Starting Hero Options Migration\\n');

  if (!process.env.SANITY_AUTH_TOKEN) {
    console.error('❌ ERROR: SANITY_AUTH_TOKEN environment variable is required');
    console.log('\\n📝 To get your token:');
    console.log('  1. Visit https://www.sanity.io/manage/project/5n331bys/api/tokens');
    console.log('  2. Create a new token with "Editor" permissions');
    console.log('  3. Run: export SANITY_AUTH_TOKEN="your-token-here"');
    console.log('  4. Then run this script again\\n');
    process.exit(1);
  }

  try {
    let successCount = 0;

    for (const option of heroOptions) {
      console.log(`📦 Migrating: ${option.label}...`);

      // First, upload the image to Sanity
      console.log(`  📷 Uploading image from ${option.imageUrl}...`);

      let imageAsset;
      try {
        const imageResponse = await fetch(option.imageUrl);
        const imageBuffer = Buffer.from(await imageResponse.arrayBuffer());

        imageAsset = await client.assets.upload('image', imageBuffer, {
          filename: `${option._id}.jpg`,
        });
        console.log(`  ✅ Image uploaded: ${imageAsset._id}`);
      } catch (err) {
        console.error(`  ❌ Failed to upload image:`, err);
        console.log(`  ⚠️  Skipping ${option.label} - please upload image manually`);
        continue;
      }

      // Create the hero option document
      const doc = {
        _type: 'heroOption',
        _id: option._id,
        prefix: option.prefix,
        dropdown: option.dropdown,
        linkType: option.linkType,
        externalLink: option.externalLink,
        label: option.label,
        description: option.description,
        image: {
          _type: 'image',
          asset: {
            _type: 'reference',
            _ref: imageAsset._id,
          },
        },
        tags: option.tags,
        colorGradient: option.colorGradient,
        active: option.active,
        order: option.order,
        publishedAt: option.publishedAt,
      };

      await client.createOrReplace(doc);
      console.log(`  ✅ ${option.label} migrated successfully\\n`);
      successCount++;
    }

    console.log('='.repeat(60));
    console.log('📊 MIGRATION SUMMARY');
    console.log('='.repeat(60));
    console.log(`✅ Successfully migrated: ${successCount}/${heroOptions.length} hero options`);
    console.log('\\n📝 Migrated Options:');
    heroOptions.forEach((opt, idx) => {
      console.log(`  ${idx + 1}. ${opt.label} (Order: ${opt.order})`);
    });
    console.log('\\n' + '='.repeat(60));
    console.log('🎉 Migration complete!\\n');
    console.log('Next steps:');
    console.log('  1. Visit http://localhost:3333/studio to view hero options');
    console.log('  2. Update linkType from "external" to "internal" and set internalLink references');
    console.log('  3. Test homepage at http://localhost:8080');
    console.log('  4. Verify rotation and modal functionality\\n');

  } catch (error) {
    console.error('💥 Migration failed:', error);
    process.exit(1);
  }
}

// Run migration
migrateHeroOptions();
