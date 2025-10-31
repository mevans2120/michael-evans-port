/**
 * Update Featured Fields Script
 *
 * Populates featuredCategory, featuredMetric, and featuredDescription
 * for featured case studies on the homepage.
 */

import { createClient } from '@sanity/client';
import * as dotenv from 'dotenv';
import { resolve } from 'path';

// Load environment variables from .env.local
dotenv.config({ path: resolve(process.cwd(), '.env.local') });

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || '5n331bys',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  useCdn: false,
  token: process.env.SANITY_WRITE_TOKEN,
  apiVersion: '2024-01-01',
});

const featuredUpdates = [
  {
    _id: 'virgin-america',
    featuredCategory: 'UX Design',
    featuredMetric: '15% conversion lift',
    featuredDescription: 'Created the first responsive airline website, reimagining booking flows by focusing on decisions rather than clicks — achieving industry recognition and measurable business impact.',
  },
  {
    _id: 'casa-bonita',
    featuredCategory: 'Experience Design',
    featuredMetric: 'Cultural icon revival',
    featuredDescription: 'Revived a beloved Colorado landmark by reimagining the customer experience, balancing nostalgia with modern hospitality design — from reservation flows to in-venue wayfinding.',
  },
  {
    _id: 'before-launcher',
    featuredCategory: 'Mobile Product',
    featuredMetric: '100K+ users',
    featuredDescription: 'Built a minimalist Android launcher focused on intentionality over distraction, reducing phone time through thoughtful UX and becoming a finalist for App of the Year.',
  },
  {
    _id: 'aesop',
    featuredCategory: 'Digital Commerce',
    featuredMetric: 'Global brand consistency',
    featuredDescription: 'Crafted a premium e-commerce experience that elevated the brand\'s minimalist aesthetic while maintaining accessibility and usability across global markets.',
  },
];

async function updateFeaturedFields() {
  console.log('🚀 Starting featured fields update...\n');

  for (const update of featuredUpdates) {
    try {
      console.log(`Updating: ${update._id}`);

      await client
        .patch(update._id)
        .set({
          featuredCategory: update.featuredCategory,
          featuredMetric: update.featuredMetric,
          featuredDescription: update.featuredDescription,
        })
        .commit();

      console.log(`✅ Updated ${update._id}`);
      console.log(`   Category: ${update.featuredCategory}`);
      console.log(`   Metric: ${update.featuredMetric}`);
      console.log(`   Description: ${update.featuredDescription.substring(0, 60)}...\n`);
    } catch (error) {
      console.error(`❌ Error updating ${update._id}:`, error);
    }
  }

  console.log('✨ Featured fields update complete!');
  console.log('\nVerifying updates...\n');

  // Verify the updates
  const featuredProjects = await client.fetch(
    `*[_type == "project" && featured == true] | order(order asc) {
      _id,
      title,
      featuredCategory,
      featuredMetric,
      featuredDescription
    }`
  );

  console.log('📊 Current featured projects:');
  featuredProjects.forEach((project: any) => {
    console.log(`\n${project.title}`);
    console.log(`  Category: ${project.featuredCategory || '❌ Missing'}`);
    console.log(`  Metric: ${project.featuredMetric || '❌ Missing'}`);
    console.log(`  Description: ${project.featuredDescription ? '✅ Set' : '❌ Missing'}`);
  });
}

updateFeaturedFields().catch(console.error);
