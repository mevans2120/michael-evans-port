/**
 * Migration Script: Import AI Projects to Sanity CMS
 *
 * This script imports AI project data from /src/data/aiProjects.ts into Sanity CMS.
 *
 * Usage:
 *   npm run migrate
 *
 * What it does:
 * 1. Reads hardcoded AI project data
 * 2. Converts images from external URLs to Sanity assets (optional)
 * 3. Creates/updates AI project documents in Sanity
 * 4. Provides summary of migration
 */

import { createClient } from '@sanity/client';
import { allAIProjects } from '../src/data/aiProjects';

// Sanity client for writing data
const client = createClient({
  projectId: '5n331bys',
  dataset: 'production',
  apiVersion: '2024-01-01',
  useCdn: false,
  token: process.env.SANITY_AUTH_TOKEN, // Required for write operations
});

/**
 * Upload an image URL to Sanity and return the asset reference
 */
async function uploadImageToSanity(imageUrl: string): Promise<any> {
  try {
    console.log(`  📸 Uploading image: ${imageUrl}`);

    const response = await fetch(imageUrl);
    if (!response.ok) {
      throw new Error(`Failed to fetch image: ${response.statusText}`);
    }

    const buffer = await response.arrayBuffer();
    const asset = await client.assets.upload('image', Buffer.from(buffer), {
      filename: imageUrl.split('/').pop() || 'image.jpg',
    });

    console.log(`  ✅ Image uploaded: ${asset._id}`);
    return {
      _type: 'image',
      asset: {
        _type: 'reference',
        _ref: asset._id,
      },
    };
  } catch (error) {
    console.error(`  ❌ Failed to upload image ${imageUrl}:`, error);
    return null;
  }
}

/**
 * Convert AIProjectData to Sanity document format
 */
async function convertToSanityDocument(project: typeof allAIProjects[0], uploadImages: boolean = false) {
  console.log(`\n📦 Converting ${project.title}...`);

  // Upload hero image
  let heroImage = null;
  if (uploadImages && project.heroImage) {
    heroImage = await uploadImageToSanity(project.heroImage);
  }

  // Upload project images
  const images = [];
  if (uploadImages && project.images && project.images.length > 0) {
    for (const img of project.images) {
      const uploadedImage = await uploadImageToSanity(img.url);
      if (uploadedImage) {
        images.push({
          _key: Math.random().toString(36).substring(7),
          image: uploadedImage,
          caption: img.caption,
          alt: img.caption, // Use caption as alt text
        });
      }
    }
  }

  return {
    _type: 'aiProject',
    _id: `aiProject-${project.slug}`, // Predictable ID for updates
    title: project.title,
    slug: {
      _type: 'slug',
      current: project.slug,
    },
    subtitle: project.subtitle,
    description: project.description,
    category: project.category,
    status: project.status,
    ...(heroImage && { heroImage }),
    liveUrl: project.links.live || undefined,
    githubUrl: project.links.github || undefined,
    overview: project.overview,
    metrics: project.metrics.map((m) => ({
      _key: Math.random().toString(36).substring(7),
      label: m.label,
      value: m.value,
    })),
    techStack: project.techStack,
    aiComponents: project.aiComponents.map((c) => ({
      _key: Math.random().toString(36).substring(7),
      name: c.name,
      description: c.description,
      technology: c.technology,
    })),
    developmentProcess: project.developmentProcess.map((p) => ({
      _key: Math.random().toString(36).substring(7),
      phase: p.phase,
      description: p.description,
      outcomes: p.outcomes,
    })),
    learnings: project.learnings,
    achievements: project.achievements,
    ...(images.length > 0 && { images }),
    featured: false,
    order: allAIProjects.indexOf(project),
    publishedAt: new Date().toISOString(),
  };
}

/**
 * Main migration function
 */
async function migrateAIProjects() {
  console.log('🚀 Starting AI Projects Migration to Sanity CMS\n');
  console.log(`📊 Found ${allAIProjects.length} AI projects to migrate\n`);

  // Check for auth token
  if (!process.env.SANITY_AUTH_TOKEN) {
    console.error('❌ ERROR: SANITY_AUTH_TOKEN environment variable is required');
    console.log('\n📝 To get your token:');
    console.log('  1. Visit https://www.sanity.io/manage/project/5n331bys/api/tokens');
    console.log('  2. Create a new token with "Editor" permissions');
    console.log('  3. Run: export SANITY_AUTH_TOKEN="your-token-here"');
    console.log('  4. Then run this script again\n');
    process.exit(1);
  }

  // Ask user if they want to upload images
  const uploadImages = process.argv.includes('--upload-images');
  if (uploadImages) {
    console.log('📸 Image upload mode enabled - this will take longer\n');
  } else {
    console.log('⚠️  Skipping image uploads (use --upload-images flag to enable)\n');
  }

  const results = {
    success: [] as string[],
    failed: [] as string[],
  };

  // Process each project
  for (const project of allAIProjects) {
    try {
      console.log(`\n🔄 Processing: ${project.title}`);

      const sanityDoc = await convertToSanityDocument(project, uploadImages);

      // Create or update document
      const result = await client.createOrReplace(sanityDoc);

      console.log(`✅ Successfully migrated: ${project.title}`);
      console.log(`   Document ID: ${result._id}`);
      results.success.push(project.title);
    } catch (error) {
      console.error(`❌ Failed to migrate ${project.title}:`, error);
      results.failed.push(project.title);
    }
  }

  // Print summary
  console.log('\n' + '='.repeat(60));
  console.log('📊 MIGRATION SUMMARY');
  console.log('='.repeat(60));
  console.log(`✅ Successful: ${results.success.length}`);
  results.success.forEach((name) => console.log(`   - ${name}`));

  if (results.failed.length > 0) {
    console.log(`\n❌ Failed: ${results.failed.length}`);
    results.failed.forEach((name) => console.log(`   - ${name}`));
  }

  console.log('\n' + '='.repeat(60));
  console.log('🎉 Migration complete!\n');
  console.log('Next steps:');
  console.log('  1. Visit http://localhost:3333/ to view your data');
  console.log('  2. Enable feature flags in /src/lib/featureFlags.ts');
  console.log('  3. Test the pages to verify everything works\n');
}

// Run migration
migrateAIProjects().catch((error) => {
  console.error('💥 Migration failed:', error);
  process.exit(1);
});
