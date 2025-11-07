#!/usr/bin/env node
// Script to delete legacy 'slides' data from migrated projects
import { createClient } from '@sanity/client';
import * as dotenv from 'dotenv';
import { resolve } from 'path';

// Load environment variables from .env.local
dotenv.config({ path: resolve(process.cwd(), '.env.local') });

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || '5n331bys',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2024-01-01',
  token: process.env.SANITY_WRITE_TOKEN, // Must use SANITY_WRITE_TOKEN (not SANITY_AUTH_TOKEN)
  useCdn: false,
});

const projectTitles = [
  'Before Launcher',
  'Casa Bonita',
  'Peddle',
  'Target',
  'Virgin America'
];

async function deleteSlidesData() {
  console.log('🧹 Deleting slides data from 5 projects...\n');

  for (const title of projectTitles) {
    try {
      // Find the project
      const project = await client.fetch(
        `*[_type == "project" && title == $title][0]{_id, title}`,
        { title }
      );

      if (!project) {
        console.log(`❌ Project not found: ${title}`);
        continue;
      }

      // Unset the slides field
      await client
        .patch(project._id)
        .unset(['slides'])
        .commit();

      console.log(`✅ Deleted slides from: ${title}`);
    } catch (error) {
      console.error(`❌ Error deleting slides from ${title}:`, error.message);
    }
  }

  console.log('\n✨ Cleanup complete!');
}

deleteSlidesData();
