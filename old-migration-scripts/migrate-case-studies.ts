/**
 * Migration Script: Populate Case Studies
 *
 * This script migrates case study data from hardcoded pages to Sanity CMS.
 *
 * Usage:
 *   export SANITY_AUTH_TOKEN="your-token"
 *   npx tsx scripts/migrate-case-studies.ts
 */

import { createClient } from '@sanity/client';

const client = createClient({
  projectId: '5n331bys',
  dataset: 'production',
  apiVersion: '2024-01-01',
  useCdn: false,
  token: process.env.SANITY_AUTH_TOKEN,
});

const caseStudies = [
  {
    _id: 'project-virgin-america',
    title: 'Virgin America Digital',
    slug: 'virgin-america',
    subtitle: 'Award-winning website and mobile app achieving 15% conversion lift',
    description: "Led strategy, design, and development for VirginAmerica.com, resulting in a 15% conversion lift over three years and influencing Alaska Airlines' digital evolution.",
    category: 'Digital Transformation',
    metrics: [
      { label: 'Conversion Lift', value: '15%' },
      { label: 'Time Period', value: '3 Years' },
      { label: 'Awards Won', value: 'Multiple' },
    ],
    achievements: [
      'UX Awards, Cannes Lions, CES, Webbys, and more',
      'Designed and developed deals page A/B tests improving conversion by 5%',
      "Developed Virgin America's first mobile app using pioneering cross-platform framework",
      'Reduced maintenance requirements through innovative technical approach',
      "Influenced Alaska Airlines' digital transformation strategy",
    ],
    order: 1,
  },
  {
    _id: 'project-casa-bonita',
    title: 'Casa Bonita Platform',
    slug: 'casa-bonita',
    subtitle: 'Restaurant management, reservation, loyalty platform with 300k+ club members',
    description: "Built and launched Casa Bonita's new restaurant management, reservation, loyalty, and marketing platform — now with 300k+ club members accounting for 80% of bookings, and an 85% reservation utilization rate.",
    category: 'Platform Development',
    metrics: [
      { label: 'Club Members', value: '300k+' },
      { label: 'Bookings Rate', value: '80%' },
      { label: 'Utilization', value: '85%' },
    ],
    achievements: [
      'Designed The Founders Club achieving over 250k sign-ups within 6 hours',
      'Created comprehensive user research insights and wireframes for digital experiences',
      'Designed and tested a pager system enhancing guest experience',
      'Casa Bonita has consistently been fully booked since opening',
    ],
    order: 2,
  },
  {
    _id: 'project-before-launcher',
    title: 'Before Launcher',
    slug: 'before-launcher',
    subtitle: 'Award-winning Android launcher that decreased daily phone usage by 40%',
    description: 'Founded a company that shipped an award-winning, wellness focused attention-reducing Android launcher. Grew to 500k+ organic installs through ASO, with sustained high user ratings.',
    category: 'Mobile Product',
    metrics: [
      { label: 'Organic Installs', value: '500k+' },
      { label: 'User Rating', value: '4.7/5' },
      { label: 'Usage Reduction', value: '40%' },
    ],
    achievements: [
      'Fast Company "Best Apps of 2019" recognition',
      'Novel notification prioritization system to reduce distractions',
      'Comprehensive beta testing and onboarding process development',
      'Strategic SEM campaign targeting winnable search terms',
      'Successfully sold to private development team for continued development',
    ],
    order: 3,
  },
  {
    _id: 'project-peddle',
    title: 'Peddle Marketplace',
    slug: 'peddle',
    subtitle: 'Platform redesign resulting in 10%+ post-launch conversion increase',
    description: 'Directed the product strategy for the redesign and re-platforming of Peddle.com, resulting in a post-launch conversion rate increase of over 10%.',
    category: 'Marketplace',
    metrics: [
      { label: 'Conversion Increase', value: '10%+' },
      { label: 'A/B Test Improvement', value: '5%' },
      { label: 'Data Integration', value: 'Complete' },
    ],
    achievements: [
      'Led Raw Materials Data and Insights team transition from GA3 to holistic Snowplow, Snowflake & GA4',
      'Designed and developed A/B Tests improving top-of-funnel conversion by 5%',
      'Post-launch dashboards provided data insights across marketplace and operations',
      'Comprehensive platform redesign and re-platforming strategy',
      'Cross-functional team leadership and stakeholder management',
    ],
    order: 4,
  },
];

async function migrateCaseStudies() {
  console.log('🚀 Starting Case Studies Migration\n');

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
    let successCount = 0;

    for (const study of caseStudies) {
      console.log(`📦 Migrating: ${study.title}...`);

      const doc = {
        _type: 'project',
        _id: study._id,
        title: study.title,
        slug: {
          _type: 'slug',
          current: study.slug,
        },
        subtitle: study.subtitle,
        description: study.description,
        category: study.category,
        metrics: study.metrics.map((m, idx) => ({
          _type: 'metric',
          _key: `metric-${idx}`,
          label: m.label,
          value: m.value,
        })),
        achievements: study.achievements,
        featured: true,
        order: study.order,
        publishedAt: new Date().toISOString(),
      };

      await client.createOrReplace(doc);
      console.log(`  ✅ ${study.title} migrated successfully`);
      successCount++;
    }

    console.log('\n' + '='.repeat(60));
    console.log('📊 MIGRATION SUMMARY');
    console.log('='.repeat(60));
    console.log(`✅ Successfully migrated: ${successCount}/${caseStudies.length} case studies`);
    console.log('\n📝 Migrated Projects:');
    caseStudies.forEach((s) => {
      console.log(`  • ${s.title} (${s.slug})`);
    });
    console.log('\n' + '='.repeat(60));
    console.log('🎉 Migration complete!\n');
    console.log('Next steps:');
    console.log('  1. Visit http://localhost:3333/ to view case studies');
    console.log('  2. Create generic CaseStudy component');
    console.log('  3. Update routes to use new component');
    console.log('  4. Test all case study pages\n');

  } catch (error) {
    console.error('💥 Migration failed:', error);
    process.exit(1);
  }
}

// Run migration
migrateCaseStudies();
