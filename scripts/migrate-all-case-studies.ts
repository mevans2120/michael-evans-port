import { createClient } from '@sanity/client'

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || '5n331bys',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2024-01-01',
  useCdn: false,
  token: process.env.SANITY_AUTH_TOKEN,
})

// Helper to create portable text blocks
const createTextBlock = (text: string, marks: string[] = []): any => ({
  _type: 'block',
  _key: `block-${Math.random().toString(36).substr(2, 9)}`,
  style: 'normal',
  children: [{ _type: 'span', text, marks }],
})

const createBulletItem = (text: string): any => ({
  _type: 'block',
  _key: `block-${Math.random().toString(36).substr(2, 9)}`,
  listItem: 'bullet',
  style: 'normal',
  children: [{ _type: 'span', text }],
})

// TARGET CASE STUDY
const targetData = {
  _type: 'project',
  _id: 'target',
  title: 'Target - Enterprise E-commerce Transformation',
  slug: { _type: 'slug', current: 'target' },
  category: 'case-study',
  summary: "Served as project and program manager for Target's massive e-commerce transformation at Huge, managing 20+ concurrent work streams as they transitioned from Amazon's platform to their own proprietary system.",
  description: "Leading 20+ work streams for Target's transition from Amazon to proprietary e-commerce",
  featured: true,
  order: 4,
  publishedAt: '2013-01-01T00:00:00Z',
  metrics: [
    { _key: 'metric-1', label: 'Work Streams Managed', value: '20+' },
    { _key: 'metric-2', label: 'Project Scale', value: "Huge's Largest Client" },
    { _key: 'metric-3', label: 'Strategic Impact', value: 'Amazon → Proprietary' },
    { _key: 'metric-4', label: 'Travel Commitment', value: 'Weekly to Minneapolis' },
  ],
  achievements: [
    "Managed 20+ concurrent work streams for Target's largest client at Huge",
    "Led design work for Target's proprietary e-commerce platform",
    "Defined forward-thinking strategy: empower employees, not replace them",
    "Conceptual retail work that predicted QR codes and smart inventory tools",
    "Created inspirational strategy framework around being 'the place people love'",
    "Led data modernization: conversion dashboards, drop-off metrics, analytics",
  ],
  technologies: [
    'Proprietary E-commerce Engine',
    'Conversion Analytics',
    'Data Dashboards',
    'QR Code Integration',
    'Inventory Management Systems',
    'Team Member Tools',
  ],
  overview: {
    role: 'Project Manager & Program Manager',
    company: 'Huge',
    timeline: '~2 years (multiple work streams)',
  },
  sections: [
    {
      _type: 'object',
      _key: 'section-1',
      sectionLabel: 'The Context',
      heading: "Huge's Biggest Client",
      content: [
        createTextBlock("Target was one of Huge's biggest clients, generating the most revenue that year. The scale of the engagement was massive—I traveled to Minneapolis every week, working on approximately 20 different concurrent projects."),
        createTextBlock('My role encompassed both tactical and strategic work:'),
        createBulletItem('Project Manager for individual work streams'),
        createBulletItem('Program Manager coordinating across all Target projects'),
        createBulletItem('Strategic Partner helping define the future of retail'),
      ],
      screenshots: [],
    },
    {
      _type: 'object',
      _key: 'section-2',
      sectionLabel: 'The Challenge',
      heading: 'Breaking Up with Amazon',
      content: [
        createTextBlock('When e-commerce first became mainstream, Target made what seemed like a pragmatic decision: partner with Amazon to sell all their products online.'),
        createTextBlock('The Problem:', ['strong']),
        createTextBlock('Target quickly realized this wasn\'t sustainable. They were giving Amazon valuable customer data, unable to control the experience, and building Amazon\'s business more than their own.'),
        createTextBlock('Our Role at Huge:', ['strong']),
        createTextBlock('We did the design work for the new e-commerce engine while Sapient Nitro handled development. This division of labor required close coordination and clear communication.'),
      ],
      screenshots: [],
    },
    {
      _type: 'object',
      _key: 'section-3',
      sectionLabel: 'Strategy',
      heading: 'The Power of Inspirational Strategy',
      content: [
        createTextBlock('One of the biggest learnings from Target was the value of having a strategy that inspires people.'),
        createTextBlock("Target's strategy: Being the place that people love and selling products people love."),
        createTextBlock('This inspirational strategy didn\'t just guide decisions—it energized teams, aligned stakeholders, and created better outcomes.'),
      ],
      screenshots: [],
    },
    {
      _type: 'object',
      _key: 'section-4',
      sectionLabel: 'Innovation',
      heading: 'The Future of Retail',
      content: [
        createTextBlock('Beyond the immediate e-commerce work, we did forward-thinking conceptual work on the future of retail.'),
        createTextBlock('The Big Strategic Insight:', ['strong']),
        createTextBlock('What DOESN\'T Work: Putting kiosks inside retail stores. People don\'t really love using kiosks.'),
        createTextBlock('What DOES Work: Building tools to make team members smarter. Give employees technology to know more about inventory, understand flows, and provide better service.'),
        createTextBlock('Technology should empower employees, not replace them.'),
      ],
      screenshots: [],
    },
    {
      _type: 'object',
      _key: 'section-5',
      sectionLabel: 'Program Management',
      heading: '20 Projects, One Program',
      content: [
        createTextBlock('Managing 20+ concurrent work streams taught me invaluable lessons about program management and strategic coordination.'),
        createTextBlock('What Worked:', ['strong']),
        createBulletItem('Clear Strategy: Target\'s "place people love" gave us a decision-making framework'),
        createBulletItem('Regular Cadence: Weekly in-person meetings maintained alignment'),
        createBulletItem('Distributed Ownership: Individual project managers for each work stream'),
        createBulletItem('Program-Level Oversight: Coordinating across all projects'),
      ],
      screenshots: [],
    },
    {
      _type: 'object',
      _key: 'section-6',
      sectionLabel: 'Data',
      heading: 'Modern Analytics for Modern E-commerce',
      content: [
        createTextBlock('I led significant work modernizing how Target thought about data.'),
        createTextBlock('Created dashboards that showed meaningful conversion metrics, drop-off points, return customer behavior, and a much more modern way to think about their business with data.'),
        createTextBlock('At enterprise scale, data infrastructure and analytics are as important as the customer-facing experience.'),
      ],
      screenshots: [],
    },
  ],
}

// PEDAL CASE STUDY
const pedalData = {
  _type: 'project',
  _id: 'pedal',
  title: 'Pedal - Fitness Platform for Peloton Competitors',
  slug: { _type: 'slug', current: 'pedal' },
  category: 'case-study',
  summary: "Product managed the creation of Pedal, a fitness platform connecting smaller studios with at-home audiences. Built a competitive product to Peloton with limited resources, securing significant investment and building a loyal community of instructors and riders.",
  description: "Competing with Peloton by connecting boutique fitness studios to at-home audiences",
  featured: true,
  order: 2,
  publishedAt: '2020-01-01T00:00:00Z',
  metrics: [
    { _key: 'metric-1', label: 'Investment Secured', value: '$10M+' },
    { _key: 'metric-2', label: 'Platform Scale', value: 'Multi-Studio Network' },
    { _key: 'metric-3', label: 'Market Position', value: 'Peloton Competitor' },
    { _key: 'metric-4', label: 'Community', value: 'Loyal Instructor Base' },
  ],
  achievements: [
    "Built Peloton competitor with significantly smaller budget",
    "Secured $10M+ in investment",
    "Created platform connecting multiple fitness studios to at-home audiences",
    "Developed strong instructor and rider community",
    "Delivered complex product with lean team and tight resources",
    "Pioneered boutique studio streaming model",
  ],
  technologies: [
    'Video Streaming',
    'Real-time Metrics',
    'Multi-platform Apps',
    'Studio Integration',
    'Community Features',
    'Analytics Dashboard',
  ],
  overview: {
    role: 'Product Manager',
    company: 'Pedal',
    timeline: '~2 years',
  },
  sections: [
    {
      _type: 'object',
      _key: 'section-1',
      sectionLabel: 'The Vision',
      heading: 'Competing with Peloton',
      content: [
        createTextBlock('Pedal set out to compete with Peloton by connecting boutique fitness studios with at-home audiences. Instead of building our own studio, we partnered with existing studios to stream their classes.'),
        createTextBlock('This model had advantages: diversity of instructors, different studio vibes, and lower capital requirements. But it also had challenges: coordinating multiple studios, varying quality, and competing with Peloton\'s massive marketing budget.'),
      ],
      screenshots: [],
    },
    {
      _type: 'object',
      _key: 'section-2',
      sectionLabel: 'The Challenge',
      heading: 'Building More with Less',
      content: [
        createTextBlock('The core challenge was building a competitive product with significantly fewer resources than Peloton.'),
        createTextBlock('We had to:'),
        createBulletItem('Create high-quality streaming experiences across devices'),
        createBulletItem('Build real-time metrics and leaderboards'),
        createBulletItem('Integrate with multiple fitness studios'),
        createBulletItem('Develop community features to drive retention'),
        createBulletItem('Compete on content quality with limited production budget'),
      ],
      screenshots: [],
    },
    {
      _type: 'object',
      _key: 'section-3',
      sectionLabel: 'The Product',
      heading: 'Multi-Studio Streaming Platform',
      content: [
        createTextBlock('We built a platform that connected riders at home with live and on-demand classes from multiple boutique studios.'),
        createTextBlock('Key features included real-time metrics, instructor interaction, community leaderboards, and personalized recommendations. The goal was to create the energy of an in-studio class from home.'),
      ],
      screenshots: [],
    },
    {
      _type: 'object',
      _key: 'section-4',
      sectionLabel: 'Impact',
      heading: 'Investment and Community',
      content: [
        createTextBlock('Pedal secured over $10M in investment, validating the model and allowing us to scale the platform.'),
        createTextBlock('We built a loyal community of instructors and riders who loved the boutique studio experience. The platform proved you could compete with Peloton by focusing on quality, community, and the unique value of boutique fitness.'),
      ],
      screenshots: [],
    },
  ],
}

// CASA BONITA CASE STUDY
const casaBonitaData = {
  _type: 'project',
  _id: 'casa-bonita',
  title: 'Casa Bonita - Trey Parker & Matt Stone\'s Restaurant Revival',
  slug: { _type: 'slug', current: 'casa-bonita' },
  category: 'case-study',
  summary: "Product managed the digital transformation of Casa Bonita, the legendary Colorado restaurant purchased by South Park creators Trey Parker and Matt Stone. Led the migration from a problematic legacy system to a modern reservation and operations platform.",
  description: "Modernizing reservations and operations for Trey Parker & Matt Stone's legendary restaurant",
  featured: true,
  order: 3,
  publishedAt: '2023-01-01T00:00:00Z',
  metrics: [
    { _key: 'metric-1', label: 'Legacy System', value: 'Successfully Migrated' },
    { _key: 'metric-2', label: 'Platform', value: 'Modern Reservation System' },
    { _key: 'metric-3', label: 'Client', value: 'Trey Parker & Matt Stone' },
    { _key: 'metric-4', label: 'Impact', value: 'Operational Excellence' },
  ],
  achievements: [
    "Migrated Casa Bonita from problematic legacy reservation system",
    "Built modern reservation and operations platform",
    "Worked directly with Trey Parker and Matt Stone",
    "Improved operational efficiency and customer experience",
    "Delivered on time despite legacy system challenges",
    "Created scalable system for legendary restaurant revival",
  ],
  technologies: [
    'Reservation System',
    'Operations Platform',
    'Customer Management',
    'Modern Web Stack',
    'Integration APIs',
    'Admin Tools',
  ],
  overview: {
    role: 'Product Manager',
    company: 'Independent',
    timeline: '~1 year',
  },
  sections: [
    {
      _type: 'object',
      _key: 'section-1',
      sectionLabel: 'The Story',
      heading: 'A Colorado Icon',
      content: [
        createTextBlock('Casa Bonita is a legendary Colorado restaurant—a massive, theatrical Mexican restaurant complete with cliff divers, arcades, and puppet shows. It\'s famous enough that South Park dedicated an entire episode to it.'),
        createTextBlock('When Casa Bonita faced closure, South Park creators Trey Parker and Matt Stone purchased it to preserve this cultural landmark. They invested millions in renovations and wanted to modernize operations while maintaining its quirky charm.'),
      ],
      screenshots: [],
    },
    {
      _type: 'object',
      _key: 'section-2',
      sectionLabel: 'The Challenge',
      heading: 'Legacy System Nightmare',
      content: [
        createTextBlock('Casa Bonita was using a problematic legacy reservation system that was:'),
        createBulletItem('Difficult to use for staff and customers'),
        createBulletItem('Unreliable and prone to failures'),
        createBulletItem('Impossible to extend or customize'),
        createBulletItem('Creating operational headaches'),
        createTextBlock('We needed to migrate to a modern system while the restaurant was preparing to reopen after extensive renovations. The timeline was tight and the stakes were high.'),
      ],
      screenshots: [],
    },
    {
      _type: 'object',
      _key: 'section-3',
      sectionLabel: 'The Solution',
      heading: 'Modern Reservation Platform',
      content: [
        createTextBlock('We built a modern reservation and operations platform that:'),
        createBulletItem('Made it easy for customers to book tables'),
        createBulletItem('Gave staff powerful tools to manage reservations and operations'),
        createBulletItem('Integrated with their existing systems'),
        createBulletItem('Could scale with the restaurant\'s needs'),
        createTextBlock('The platform had to be bulletproof—Casa Bonita\'s reopening was national news, and any reservation system failures would be very public.'),
      ],
      screenshots: [],
    },
    {
      _type: 'object',
      _key: 'section-4',
      sectionLabel: 'Impact',
      heading: 'Successful Launch',
      content: [
        createTextBlock('The new reservation system launched successfully alongside Casa Bonita\'s grand reopening. Staff were trained, customers could easily book, and the system handled the massive demand.'),
        createTextBlock('Working with Trey Parker and Matt Stone on this project was a highlight—helping preserve a Colorado cultural icon while modernizing its operations for the future.'),
      ],
      screenshots: [],
    },
  ],
}

// BEFORE LAUNCHER CASE STUDY
const beforeLauncherData = {
  _type: 'project',
  _id: 'before-launcher',
  title: 'Before Launcher - AI-First Mobile Experience',
  slug: { _type: 'slug', current: 'before-launcher' },
  category: 'ai-project',
  summary: "Product managed Before Launcher, an AI-first Android launcher that predicts what users want before they ask. Explored the future of mobile UX with context-aware AI, leading to Microsoft's acquisition of the technology.",
  description: "Exploring context-aware AI and predictive mobile interfaces",
  featured: true,
  order: 5,
  publishedAt: '2017-01-01T00:00:00Z',
  metrics: [
    { _key: 'metric-1', label: 'Outcome', value: 'Acquired by Microsoft' },
    { _key: 'metric-2', label: 'Innovation', value: 'AI-First Mobile UX' },
    { _key: 'metric-3', label: 'Platform', value: 'Android Launcher' },
    { _key: 'metric-4', label: 'AI Type', value: 'Context-Aware Prediction' },
  ],
  achievements: [
    "Built AI-first Android launcher with predictive capabilities",
    "Explored future of context-aware mobile interfaces",
    "Technology acquired by Microsoft",
    "Pioneered 'anticipatory computing' UX patterns",
    "Demonstrated practical AI applications before chatbot era",
    "Created novel interaction paradigm for mobile",
  ],
  technologies: [
    'Machine Learning',
    'Context-Aware AI',
    'Android Development',
    'Predictive UX',
    'Usage Analytics',
    'Mobile Optimization',
  ],
  overview: {
    role: 'Product Manager',
    company: 'Before',
    timeline: '~2 years',
  },
  sections: [
    {
      _type: 'object',
      _key: 'section-1',
      sectionLabel: 'The Vision',
      heading: 'AI Before Chatbots',
      content: [
        createTextBlock('Before Launcher was built years before ChatGPT made AI mainstream. We were exploring what AI-first interfaces could look like in a world where most people hadn\'t used an AI assistant.'),
        createTextBlock('The core idea: What if your phone anticipated what you needed before you asked? Instead of searching for apps or information, your phone could predict and surface exactly what you needed based on context—time of day, location, usage patterns, and more.'),
      ],
      screenshots: [],
    },
    {
      _type: 'object',
      _key: 'section-2',
      sectionLabel: 'The Product',
      heading: 'Anticipatory Computing',
      content: [
        createTextBlock('Before Launcher replaced Android\'s home screen with an AI-driven interface that learned your patterns:'),
        createBulletItem('In the morning at home: news, weather, calendar'),
        createBulletItem('Commuting: maps, podcasts, messages'),
        createBulletItem('At work: productivity apps, email, work contacts'),
        createBulletItem('Evening: entertainment, social apps, nearby restaurants'),
        createTextBlock('The launcher got smarter over time, learning individual patterns and adapting to changes in routine.'),
      ],
      screenshots: [],
    },
    {
      _type: 'object',
      _key: 'section-3',
      sectionLabel: 'Challenges',
      heading: 'Teaching Users New Patterns',
      content: [
        createTextBlock('The biggest challenge wasn\'t the technology—it was teaching users to trust prediction over search.'),
        createTextBlock('People were used to finding things (search, folders, app drawers). Before Launcher asked them to wait for things to appear. This required significant behavior change and trust in the AI.'),
        createTextBlock('We learned that AI interfaces need to be:'),
        createBulletItem('Transparent about why they\'re showing something'),
        createBulletItem('Easily overrideable when predictions are wrong'),
        createBulletItem('Faster than the alternative (search)'),
        createBulletItem('Consistent enough to build user trust'),
      ],
      screenshots: [],
    },
    {
      _type: 'object',
      _key: 'section-4',
      sectionLabel: 'Impact',
      heading: 'Microsoft Acquisition',
      content: [
        createTextBlock('Microsoft acquired Before\'s technology, recognizing the potential of context-aware AI for mobile interfaces.'),
        createTextBlock('The project demonstrated that useful AI doesn\'t need to be conversational—predictive, context-aware interfaces can provide value without chatbot interactions.'),
        createTextBlock('Years later, as AI becomes mainstream, the anticipatory computing patterns we explored are more relevant than ever. The future of AI interfaces might not be asking questions—it might be getting answers before you ask.'),
      ],
      screenshots: [],
    },
  ],
}

async function migrateAllCaseStudies() {
  const caseStudies = [
    { name: 'Target', data: targetData },
    { name: 'Pedal', data: pedalData },
    { name: 'Casa Bonita', data: casaBonitaData },
    { name: 'Before Launcher', data: beforeLauncherData },
  ]

  console.log(`🚀 Starting migration of ${caseStudies.length} case studies...\n`)

  for (const study of caseStudies) {
    try {
      console.log(`📝 Migrating ${study.name}...`)
      const result = await client.createOrReplace(study.data)
      console.log(`✅ Successfully migrated ${study.name}`)
      console.log(`   Document ID: ${result._id}`)
      console.log(`   URL: http://localhost:3000/case-studies/${result._id}\n`)
    } catch (error) {
      console.error(`❌ Failed to migrate ${study.name}:`, error)
    }
  }

  console.log('🎉 Migration complete!')
}

migrateAllCaseStudies()
