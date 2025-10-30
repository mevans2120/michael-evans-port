import { createClient } from '@sanity/client'

/**
 * Migration script to add Virgin America case study with narrative scroll layout
 *
 * This content is extracted from the static demo page and structured for Sanity CMS.
 *
 * REQUIRES: Sanity write token with create permissions
 *
 * Setup:
 * 1. Get a write token from: https://www.sanity.io/manage/project/5n331bys/api
 * 2. Set environment variable: export SANITY_WRITE_TOKEN="your-token-here"
 * 3. Run with: npx tsx src/scripts/migrate-virgin-america-narrative.ts
 *
 * OR create the content manually in Sanity Studio at: http://localhost:3000/studio
 */

const client = createClient({
  projectId: '5n331bys',
  dataset: 'production',
  apiVersion: '2024-01-01',
  useCdn: false,
  token: process.env.SANITY_WRITE_TOKEN, // Requires write token
})

async function migrateVirginAmericaCaseStudy() {
  console.log('🚀 Starting Virgin America case study migration...')

  const virginAmericaProject = {
    _type: 'project',
    title: 'Virgin America: First Responsive Airline Website',
    slug: {
      _type: 'slug',
      current: 'virgin-america-responsive-booking',
    },
    summary: 'Reimagining airline booking by focusing on decisions, not clicks — achieving 15-20% conversion improvement',
    description: 'Pioneered the first responsive airline website and the step-by-step booking pattern that became an industry standard. By separating each decision into its own step, we improved conversion rates by 15-20% and won multiple international awards.',
    category: 'Case Study',
    featured: true,
    technologies: [
      'Angular',
      'Sabre API',
      'Responsive Design',
      'Single-Page Application',
    ],
    overview: {
      role: 'Lead Product Designer & Front-end Architect',
      company: 'Work & Co for Virgin America',
      timeline: '2014-2015',
    },
    metrics: [
      {
        _key: 'metric-1',
        label: 'Conversion Improvement',
        value: '15-20%',
      },
      {
        _key: 'metric-2',
        label: 'Responsive Airline Website',
        value: 'Industry First',
      },
      {
        _key: 'metric-3',
        label: 'Major Awards Won',
        value: '3',
        description: 'Webbies, UX Awards, Cannes Lions',
      },
      {
        _key: 'metric-4',
        label: 'Angular Project',
        value: 'Largest',
        description: 'At the time of launch',
      },
    ],
    achievements: [
      'Created the first responsive airline website',
      'Improved conversion rates by 15-20%',
      'Won Webbies, UX Awards, and Cannes Lions',
      'Pioneered the step-by-step, decision-by-decision e-commerce pattern',
      'Built the largest Angular project at the time',
      'Addressed complex data science issues with modern dashboards',
    ],
    sections: [
      {
        _key: 'section-1',
        _type: 'object',
        sectionLabel: 'The Challenge',
        heading: 'Understanding the Real Problem',
        content: [
          {
            _type: 'block',
            _key: 'block-1',
            style: 'normal',
            children: [
              {
                _type: 'span',
                _key: 'span-1',
                text: "Most of Virgin America's revenue came from business travelers—frequent flyers who pay premium prices and book last-minute. They'll figure out how to use any booking system.",
              },
            ],
          },
          {
            _type: 'block',
            _key: 'block-2',
            style: 'normal',
            children: [
              {
                _type: 'span',
                _key: 'span-2',
                text: 'But leisure travelers, who book 2-3 times per year, were struggling. An airline ticket is one of the most complex consumer products to purchase. Leisure travelers were failing to convert at alarming rates.',
              },
            ],
          },
          {
            _type: 'block',
            _key: 'block-3',
            style: 'normal',
            children: [
              {
                _type: 'span',
                _key: 'span-3',
                marks: ['strong'],
                text: 'The brief: make it simpler for leisure travelers without compromising the experience for business travelers.',
              },
            ],
          },
        ],
        screenshots: [],
      },
      {
        _key: 'section-2',
        _type: 'object',
        sectionLabel: 'Research Insights',
        heading: 'Clicks vs. Decisions: The Key Insight',
        content: [
          {
            _type: 'block',
            _key: 'block-4',
            style: 'normal',
            children: [
              {
                _type: 'span',
                _key: 'span-4',
                text: "In 2014-2015, the industry was obsessed with reducing clicks to improve conversion. We discovered something more fundamental: it's not about the number of clicks—it's about the number of decisions.",
              },
            ],
          },
          {
            _type: 'block',
            _key: 'block-5',
            style: 'normal',
            children: [
              {
                _type: 'span',
                _key: 'span-5',
                text: 'Combining multiple decisions into one screen to reduce clicks actually makes the experience more complicated and overwhelming. Each decision needs space to breathe.',
              },
            ],
          },
          {
            _type: 'block',
            _key: 'block-6',
            style: 'normal',
            children: [
              {
                _type: 'span',
                _key: 'span-6',
                marks: ['strong'],
                text: 'Our insight: Separate every major decision into its own step. Give users cognitive breathing room.',
              },
            ],
          },
        ],
        annotation: {
          title: 'Design Decision',
          content: 'This long-form scrolling approach mirrors the insight itself—giving each section space to breathe. Instead of cramming information into slides, we let the narrative unfold naturally as users scroll. The parallax blur orbs create depth and atmosphere without overwhelming the content.',
        },
        screenshots: [
          {
            _key: 'screenshot-1',
            _type: 'object',
            layout: 'large',
            caption: "Before: Complex booking screens combined multiple decisions, overwhelming leisure travelers",
            // Note: Image will need to be uploaded to Sanity separately
            image: {
              _type: 'image',
              // Placeholder - add actual image reference after upload
            },
          },
        ],
      },
      {
        _key: 'section-3',
        _type: 'object',
        sectionLabel: 'The Solution',
        heading: 'A Step-by-Step Booking Flow',
        content: [
          {
            _type: 'block',
            _key: 'block-7',
            style: 'normal',
            children: [
              {
                _type: 'span',
                _key: 'span-7',
                text: 'We redesigned the entire booking flow around individual decisions, with each step optimized independently and clear progress indicators.',
              },
            ],
          },
          {
            _type: 'block',
            _key: 'block-8',
            style: 'normal',
            children: [
              {
                _type: 'span',
                _key: 'span-8a',
                text: 'The new flow began with a simple question: ',
              },
              {
                _type: 'span',
                _key: 'span-8b',
                marks: ['strong'],
                text: "who's going?",
              },
              {
                _type: 'span',
                _key: 'span-8c',
                text: ' Clear passenger selection without distractions. Once that decision was made, users moved to ',
              },
              {
                _type: 'span',
                _key: 'span-8d',
                marks: ['strong'],
                text: 'dates and times',
              },
              {
                _type: 'span',
                _key: 'span-8e',
                text: "—a focused date picker that didn't compete for attention with flight options or pricing.",
              },
            ],
          },
          {
            _type: 'block',
            _key: 'block-9',
            style: 'normal',
            children: [
              {
                _type: 'span',
                _key: 'span-9a',
                text: 'Only after those foundational decisions were locked in did we present ',
              },
              {
                _type: 'span',
                _key: 'span-9b',
                marks: ['strong'],
                text: 'flight options',
              },
              {
                _type: 'span',
                _key: 'span-9c',
                text: ', with clear differentiation between choices. Then came ',
              },
              {
                _type: 'span',
                _key: 'span-9d',
                marks: ['strong'],
                text: 'seat selection',
              },
              {
                _type: 'span',
                _key: 'span-9e',
                text: '—a visual, interactive seat map that made the decision tangible. ',
              },
              {
                _type: 'span',
                _key: 'span-9f',
                marks: ['strong'],
                text: 'Traveler information',
              },
              {
                _type: 'span',
                _key: 'span-9g',
                text: ' was simplified into digestible form fields. Finally, a clear ',
              },
              {
                _type: 'span',
                _key: 'span-9h',
                marks: ['strong'],
                text: 'confirmation',
              },
              {
                _type: 'span',
                _key: 'span-9i',
                text: ' screen summarized everything before payment.',
              },
            ],
          },
          {
            _type: 'block',
            _key: 'block-10',
            style: 'normal',
            children: [
              {
                _type: 'span',
                _key: 'span-10',
                marks: ['em'],
                text: 'This pattern became widely adopted in e-commerce and is now considered standard practice for complex purchase flows.',
              },
            ],
          },
        ],
        screenshots: [
          {
            _key: 'screenshot-2',
            _type: 'object',
            layout: 'grid',
            caption: 'Passenger selection with clear, focused UI',
            image: {
              _type: 'image',
              // Placeholder - Step 1: Who's going?
            },
          },
          {
            _key: 'screenshot-3',
            _type: 'object',
            layout: 'grid',
            caption: 'Date picker without distractions',
            image: {
              _type: 'image',
              // Placeholder - Step 2: Dates & times
            },
          },
          {
            _key: 'screenshot-4',
            _type: 'object',
            layout: 'grid',
            caption: 'Clear differentiation between flight options',
            image: {
              _type: 'image',
              // Placeholder - Step 3: Flight selection
            },
          },
          {
            _key: 'screenshot-5',
            _type: 'object',
            layout: 'grid',
            caption: 'Visual, interactive seat map',
            image: {
              _type: 'image',
              // Placeholder - Step 4: Seat selection
            },
          },
        ],
      },
    ],
  }

  try {
    const result = await client.create(virginAmericaProject)
    console.log('✅ Virgin America case study created successfully!')
    console.log(`📄 Document ID: ${result._id}`)
    console.log(`🔗 View at: http://localhost:3000/case-studies/${virginAmericaProject.slug.current}`)
    console.log('\n📸 Next steps:')
    console.log('1. Upload screenshots to Sanity Studio')
    console.log('2. Add image references to the sections')
    console.log('3. Verify visual match with static demo at: http://localhost:3000/case-studies/virgin-america-demo')
  } catch (error) {
    console.error('❌ Error creating Virgin America case study:', error)
    throw error
  }
}

// Run the migration
migrateVirginAmericaCaseStudy()
  .then(() => {
    console.log('\n🎉 Migration complete!')
    process.exit(0)
  })
  .catch((error) => {
    console.error('\n💥 Migration failed:', error)
    process.exit(1)
  })
