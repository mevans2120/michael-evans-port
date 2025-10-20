/**
 * Migration Script: Populate Profile Data
 *
 * This script creates profile data from the hardcoded About page content.
 *
 * Usage:
 *   export SANITY_AUTH_TOKEN="your-token"
 *   npx tsx scripts/migrate-profile.ts
 */

import { createClient } from '@sanity/client';

const client = createClient({
  projectId: '5n331bys',
  dataset: 'production',
  apiVersion: '2024-01-01',
  useCdn: false,
  token: process.env.SANITY_AUTH_TOKEN,
});

async function migrateProfile() {
  console.log('🚀 Starting Profile Migration\n');

  if (!process.env.SANITY_AUTH_TOKEN) {
    console.error('❌ ERROR: SANITY_AUTH_TOKEN environment variable is required');
    console.log('\n📝 To get your token:');
    console.log('  1. Visit https://www.sanity.io/manage/project/5n331bys/api/tokens');
    console.log('  2. Create a new token with "Editor" permissions');
    console.log('  3. Run: export SANITY_AUTH_TOKEN="your-token-here"');
    console.log('  4. Then run this script again\n');
    process.exit(1);
  }

  try {
    console.log('📝 Creating profile document...');

    const profileDoc = {
      _type: 'profile',
      _id: 'profile-main',
      name: 'Michael Evans',
      title: 'Product Strategist & Creative Technologist',
      tagline: 'Building products at the intersection of user empathy, technical possibility, and business value',
      bio: [
        {
          _type: 'block',
          _key: 'bio-1',
          style: 'normal',
          children: [
            {
              _type: 'span',
              _key: 'span-1',
              text: "I'm a product strategist, designer, and developer with nearly 20 years of experience leading customer-centric teams and driving innovation across multiple industries.",
              marks: [],
            },
          ],
          markDefs: [],
        },
        {
          _type: 'block',
          _key: 'bio-2',
          style: 'normal',
          children: [
            {
              _type: 'span',
              _key: 'span-2',
              text: "My journey began in a purple house—a childhood lesson that standing out isn't just acceptable, it's essential. That philosophy has shaped every product decision I've made since, always asking: \"How can this be unexpectedly delightful?\"",
              marks: [],
            },
          ],
          markDefs: [],
        },
        {
          _type: 'block',
          _key: 'bio-3',
          style: 'normal',
          children: [
            {
              _type: 'span',
              _key: 'span-3',
              text: "Over the past two decades, I've built digital products and led teams across B2C, Health & Wellness, Retail, Commerce, Hospitality, Marketplaces, Technology, Media, and AI industries. My approach combines deep user research, strategic thinking, and hands-on development to create products that truly serve customer needs while driving business growth.",
              marks: [],
            },
          ],
          markDefs: [],
        },
        {
          _type: 'block',
          _key: 'bio-4',
          style: 'normal',
          children: [
            {
              _type: 'span',
              _key: 'span-4',
              text: "I believe great products are born from the intersection of user empathy, technical possibility, and business value. My role is to orchestrate these elements into experiences that feel both innovative and inevitable.",
              marks: [],
            },
          ],
          markDefs: [],
        },
        {
          _type: 'block',
          _key: 'bio-5',
          style: 'normal',
          children: [
            {
              _type: 'span',
              _key: 'span-5',
              text: "In the age of AI, I'm particularly interested in how we can use these powerful tools to augment human creativity rather than replace it—building products that make people more capable, not more dependent.",
              marks: [],
            },
          ],
          markDefs: [],
        },
        {
          _type: 'block',
          _key: 'bio-6',
          style: 'normal',
          children: [
            {
              _type: 'span',
              _key: 'span-6',
              text: "When I'm not building products, you might find me farming, cooking, or exploring the intersection of technology and human creativity.",
              marks: [],
            },
          ],
          markDefs: [],
        },
      ],
      social: {
        email: 'hello@mevans212.com',
        linkedin: 'https://www.linkedin.com/in/michaelevans/',
        github: 'https://github.com/michael-evans',
        twitter: '',
      },
      skills: [
        {
          _key: 'skill-1',
          category: 'Product & Strategy',
          skills: [
            'Product Strategy',
            'User Research',
            'UX Design',
            'Product Management',
            'Team Leadership',
          ],
        },
        {
          _key: 'skill-2',
          category: 'Development',
          skills: [
            'React',
            'TypeScript',
            'Node.js',
            'Next.js',
            'Full-Stack Development',
          ],
        },
        {
          _key: 'skill-3',
          category: 'AI & Innovation',
          skills: [
            'AI Integration',
            'Machine Learning',
            'Prompt Engineering',
            'AI Product Development',
          ],
        },
      ],
    };

    await client.createOrReplace(profileDoc);
    console.log('  ✅ Profile created successfully\n');

    console.log('='.repeat(60));
    console.log('📊 MIGRATION SUMMARY');
    console.log('='.repeat(60));
    console.log('✅ Profile document created');
    console.log('   Document ID: profile-main');
    console.log('   Name: Michael Evans');
    console.log('   Title: Product Strategist & Creative Technologist');
    console.log('\n' + '='.repeat(60));
    console.log('🎉 Migration complete!\n');
    console.log('Next steps:');
    console.log('  1. Visit http://localhost:3333/ to view the profile');
    console.log('  2. Update About page to fetch from Sanity');
    console.log('  3. Test the About page\n');

  } catch (error) {
    console.error('💥 Migration failed:', error);
    process.exit(1);
  }
}

// Run migration
migrateProfile();
