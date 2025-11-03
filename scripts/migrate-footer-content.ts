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

// Footer data
const footerData = {
  services: [
    { title: 'Research', url: '#', order: 1 },
    { title: 'Strategy', url: '#', order: 2 },
    { title: 'UX & Design', url: '#', order: 3 },
    { title: 'Delivery', url: '#', order: 4 },
    { title: 'Development', url: '#', order: 5 },
  ],
  linkedinUrl: 'https://www.linkedin.com/in/your-profile', // TODO: Update with real LinkedIn URL
  contactLinkType: 'internal',
  contactInternalLink: '/contact',
  weatherEnabled: true,
  weatherLocation: 'Portland, OR',
};

async function migrateFooter() {
  console.log('🚀 Starting migration of Footer content...\n');

  try {
    // Check if a footer document exists
    const existingFooter = await client.fetch(`*[_type == "footer"][0]`);

    if (existingFooter) {
      console.log(`✅ Found existing footer: ${existingFooter._id}\n`);
      console.log('📝 Updating footer content...\n');

      await client
        .patch(existingFooter._id)
        .set(footerData)
        .commit();

      console.log('✨ Successfully updated footer!\n');
    } else {
      console.log('⚠️  No existing footer found. Creating new footer...\n');

      await client.create({
        _type: 'footer',
        ...footerData,
      });

      console.log('✨ Successfully created new footer!\n');
    }

    console.log('📊 Migration Summary:');
    console.log(`   - Services: ${footerData.services.length} items`);
    console.log(`   - LinkedIn URL: ${footerData.linkedinUrl}`);
    console.log(`   - Contact Link: ${footerData.contactInternalLink}`);
    console.log(`   - Weather: ${footerData.weatherEnabled ? 'Enabled' : 'Disabled'}`);
    console.log(`   - Location: ${footerData.weatherLocation}\n`);

    console.log('⚠️  NOTE: Please update the LinkedIn URL in Sanity Studio with your actual profile URL.\n');
    console.log('✅ Migration complete! Check Sanity Studio to review the content.\n');
  } catch (error) {
    console.error('❌ Migration failed:', error);
    throw error;
  }
}

// Run the migration
migrateFooter();
