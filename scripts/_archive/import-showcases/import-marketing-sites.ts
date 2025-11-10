import { importClient, createOrUpdateDocument, createReference, createSlug } from './sanity-import-client'

// Project cards for marketing sites
const projectCards = [
  {
    _id: 'projectCard-doa',
    _type: 'projectCard',
    projectName: 'Department of Art',
    projectType: 'Film & TV Set Construction · Portland',
    description: 'Professional portfolio site showcasing high-resolution set construction work with optimized image loading, filterable project showcase, and Sanity CMS for easy portfolio updates. Solved the challenge of displaying visual work beautifully while maintaining fast page performance.',
    technologies: ['Next.js', 'TypeScript', 'Sanity CMS', 'Tailwind', 'Jest', 'Playwright'],
    icon: '🎬',
    order: 1,
  },
  {
    _id: 'projectCard-opal-creek',
    _type: 'projectCard',
    projectName: 'Opal Creek',
    projectType: 'NetSuite ERP Consulting · Portland',
    description: 'Enterprise consulting site with comprehensive security (CSP, HSTS headers), professional B2B design, case study templates for thought leadership, and content management enabling independent publishing of resources and expertise.',
    technologies: ['Vite', 'React', 'TypeScript', 'Sanity CMS', 'shadcn/ui'],
    icon: '💼',
    order: 2,
  },
  {
    _id: 'projectCard-karuna-gatton',
    _type: 'projectCard',
    projectName: 'Karuna Gatton',
    projectType: 'Shamanic Healing · Eugene',
    description: 'Warm and authentic site for shamanic healing services featuring soft color palette, personal storytelling, clear service descriptions, testimonial showcases, and integrated booking system reducing conversion friction.',
    technologies: ['Next.js', 'TypeScript', 'Tailwind', 'Core Web Vitals'],
    icon: '✨',
    order: 3,
  },
]

// Main Marketing Sites showcase document
const marketingSitesShowcase = {
  _id: 'aiShowcase-marketing-sites',
  _type: 'aiShowcase',
  title: 'AI-Built Marketing Sites: Agency Quality at Startup Speed',
  slug: createSlug('marketing-sites'),
  category: 'marketing-sites',
  featured: true,
  order: 3,

  heroSection: {
    badge: 'Marketing Sites Showcase',
    title: 'AI-Built Marketing Sites: Proving the Concept',
    subtitle: 'Could AI-assisted development deliver high-quality marketing websites faster and more affordably than traditional agencies while maintaining professional standards?',
    summary: 'Small businesses face a harsh choice when building their web presence: cheap but generic DIY website builders, expensive agencies charging $20K-$50K with 3-6 month timelines, or variable-quality freelancers. Three diverse clients became test cases for a different approach: AI-powered development delivering agency-quality websites at freelancer prices with startup-level speed.',
  },

  slides: [
    {
      _type: 'contentSlide',
      sectionLabel: 'Phase 01 — Hypothesis',
      heading: 'Why These Three Projects Matter',
      content: [
        {
          _type: 'block',
          children: [
            {
              _type: 'span',
              text: 'The business reality for small businesses seeking professional websites hasn\'t changed much in decades. DIY builders offer affordability but deliver generic templates. Traditional agencies provide professional outcomes but require $20K-$50K budgets and 3-6 month timelines.',
            },
          ],
        },
      ],
      comparisonBoxes: [
        {
          label: 'DIY Builders',
          text: 'Cheap but generic templates. Limited customization. Often unprofessional results that undermine brand credibility.',
          stat: '$50-500',
          icon: '🛠️',
        },
        {
          label: 'Traditional Agencies',
          text: 'Professional outcomes. Excellent quality. Budgets of $20K-$50K with 3-6 month timelines most small businesses can\'t afford.',
          stat: '$20K-50K',
          icon: '🏢',
        },
        {
          label: 'AI-Assisted',
          text: 'Agency-quality websites at freelancer prices. Professional results in 2-4 weeks with client content management empowerment.',
          stat: '60-80% Savings',
          icon: '🚀',
        },
      ],
    },
    {
      _type: 'contentSlide',
      sectionLabel: 'Phase 02 — Process',
      heading: 'How AI Changes Marketing Site Development',
      content: [
        {
          _type: 'block',
          children: [
            {
              _type: 'span',
              text: 'React combined with Sanity CMS emerged as the optimal stack for AI-assisted marketing site development. This wasn\'t theoretical—it was validated through real projects. AI understands React\'s component architecture exceptionally well.',
            },
          ],
        },
      ],
      techPills: [
        'React',
        'Next.js',
        'Sanity CMS',
        'Tailwind CSS',
        'TypeScript',
        'Vercel',
        'shadcn/ui',
        'SEO Optimized',
      ],
    },
    {
      _type: 'contentSlide',
      sectionLabel: 'Phase 03 — Collaboration',
      heading: 'What AI Handles vs Human Expertise',
      content: [
        {
          _type: 'block',
          children: [
            {
              _type: 'span',
              text: 'AI excels at component scaffolding, Tailwind styling, TypeScript definitions, and SEO implementation. Human expertise remains irreplaceable for design decisions, brand alignment, content strategy, and visual hierarchy.',
            },
          ],
        },
      ],
      quoteBox: {
        quote: 'Getting the design right and the marketing right was the more challenging and fun thing to do. AI handles the technical implementation, freeing humans to solve the genuinely difficult problems.',
        attribution: '— On AI-assisted marketing site development',
      },
    },
    {
      _type: 'contentSlide',
      sectionLabel: 'Phase 04 — Results',
      heading: 'Impact and Lessons Learned',
      content: [
        {
          _type: 'block',
          children: [
            {
              _type: 'span',
              text: 'Development speed improvements represented order-of-magnitude changes: 3-6 month agency timelines compressed to 2-4 weeks. Page loads under 2 seconds met Core Web Vitals. Clients confidently managed their own content through Sanity CMS.',
            },
          ],
        },
      ],
    },
  ],

  horizontalSectionLabel: 'Phase 03 — Project Showcase',
  horizontalSectionHeading: 'Three Different Businesses, Three Different Solutions',

  // Reference to project cards
  projectCards: projectCards.map(card => createReference(card._id, 'projectCard')),

  metrics: [
    { value: '2-4 Weeks', label: 'Delivery Time', description: 'vs 3-6 months traditionally' },
    { value: '60-80%', label: 'Cost Reduction', description: 'From agency pricing' },
    { value: '< 2 Sec', label: 'Page Load Time', description: 'Core Web Vitals met' },
    { value: '3-6x', label: 'Speed Increase', description: 'Development velocity' },
    { value: '90+', label: 'Lighthouse Score', description: 'Performance & SEO' },
    { value: '3', label: 'Diverse Industries', description: 'Validated across types' },
  ],

  callToAction: {
    text: 'View All Projects',
    link: '/ai-projects',
  },
}

// Import function
async function importMarketingSites() {
  console.log('🚀 Starting Marketing Sites showcase import...\n')

  try {
    // Import project cards first
    console.log('📝 Importing project cards...')
    for (const card of projectCards) {
      await createOrUpdateDocument(card)
      console.log(`  ✓ Created: ${card.projectName} ${card.icon}`)
    }
    console.log()

    // Import main showcase document
    console.log('📝 Importing Marketing Sites showcase...')
    await createOrUpdateDocument(marketingSitesShowcase)
    console.log(`  ✓ Created: ${marketingSitesShowcase.title}`)
    console.log()

    console.log('✅ Marketing Sites showcase import completed successfully!')
  } catch (error) {
    console.error('❌ Error importing Marketing Sites showcase:', error)
    throw error
  }
}

// Run import
importMarketingSites()
  .then(() => {
    console.log('\n🎉 Import finished!')
    process.exit(0)
  })
  .catch((error) => {
    console.error('\n💥 Import failed:', error)
    process.exit(1)
  })
