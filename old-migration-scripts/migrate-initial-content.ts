/**
 * Migration Script: Populate Contact, Hero, and SiteSettings
 *
 * This script creates initial content for the new CMS schemas.
 *
 * Usage:
 *   export SANITY_AUTH_TOKEN="your-token"
 *   npx tsx scripts/migrate-initial-content.ts
 */

import { createClient } from '@sanity/client';

const client = createClient({
  projectId: '5n331bys',
  dataset: 'production',
  apiVersion: '2024-01-01',
  useCdn: false,
  token: process.env.SANITY_AUTH_TOKEN,
});

async function migrateInitialContent() {
  console.log('🚀 Starting Initial Content Migration\n');

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
    // ============================================================
    // 1. Create Contact Information
    // ============================================================
    console.log('📧 Creating Contact Information...');

    const contactDoc = {
      _type: 'contact',
      _id: 'contact-singleton',
      email: 'hello@mevans212.com',
      phone: '', // Optional - can be added later
      location: 'Portland, OR',
      availability: 'open',
      socialLinks: {
        linkedin: 'https://www.linkedin.com/in/michaelevans/',
        github: 'https://github.com/michael-evans',
        twitter: '',
        website: '',
      },
      cta: {
        heading: "Let's Work Together",
        description: "Have a project in mind? Get in touch and let's discuss how I can help bring your ideas to life.",
        buttonText: 'Get in Touch',
      },
    };

    await client.createOrReplace(contactDoc);
    console.log('✅ Contact information created\n');

    // ============================================================
    // 2. Create Hero Section
    // ============================================================
    console.log('🎨 Creating Hero Section...');

    const heroDoc = {
      _type: 'hero',
      _id: 'hero-main',
      heading: 'Michael Evans',
      subheading: 'Product Strategist & Creative Technologist',
      description: 'I help companies design and build products that blend strategic thinking with technical execution. With two decades of experience across product strategy, UX design, and full-stack development, I specialize in translating complex challenges into elegant, AI-powered solutions.',
      cta: {
        primaryText: 'View Work',
        primaryLink: '#work',
        secondaryText: 'Get in Touch',
        secondaryLink: '#contact',
      },
      active: true,
      order: 1,
    };

    await client.createOrReplace(heroDoc);
    console.log('✅ Hero section created\n');

    // ============================================================
    // 3. Create Site Settings
    // ============================================================
    console.log('⚙️  Creating Site Settings...');

    const siteSettingsDoc = {
      _type: 'siteSettings',
      _id: 'site-settings-singleton',
      siteTitle: 'Michael Evans - Product Strategist & Creative Technologist',
      siteDescription: 'Portfolio of Michael Evans: Product strategist, UX designer, and full-stack developer specializing in AI-powered solutions. 20 years of experience building innovative products.',
      siteKeywords: [
        'Product Strategy',
        'UX Design',
        'Full-Stack Development',
        'AI/ML',
        'Creative Technology',
        'Portland',
        'Product Designer',
        'Web Development',
      ],
      featuredWork: {
        heading: 'Selected Work',
        description: 'Case studies and product launches',
        projects: [], // Can be populated later by referencing project IDs
      },
      navigation: {
        logo: 'MEvans',
        showContact: true,
        ctaText: 'Get in Touch',
        ctaLink: 'mailto:hello@mevans212.com',
      },
      footer: {
        copyrightText: '© 2024 Michael Evans. All rights reserved.',
        showSocialLinks: true,
      },
      analytics: {
        googleAnalyticsId: '',
        enableTracking: false,
      },
    };

    await client.createOrReplace(siteSettingsDoc);
    console.log('✅ Site settings created\n');

    // ============================================================
    // Summary
    // ============================================================
    console.log('=' .repeat(60));
    console.log('📊 MIGRATION SUMMARY');
    console.log('='.repeat(60));
    console.log('✅ Contact Information: Created');
    console.log('✅ Hero Section: Created');
    console.log('✅ Site Settings: Created');
    console.log('\n' + '='.repeat(60));
    console.log('🎉 Migration complete!\n');
    console.log('Next steps:');
    console.log('  1. Visit http://localhost:3333/ to view your content');
    console.log('  2. Edit any fields as needed');
    console.log('  3. Add OG images and favicons if available');
    console.log('  4. Configure Google Analytics if desired\n');

  } catch (error) {
    console.error('💥 Migration failed:', error);
    process.exit(1);
  }
}

// Run migration
migrateInitialContent();
