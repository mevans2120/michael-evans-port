import { createClient } from '@sanity/client'
import dotenv from 'dotenv'

// Load environment variables
dotenv.config({ path: '.env.local' })

const client = createClient({
  projectId: process.env.VITE_SANITY_PROJECT_ID || '5n331bys',
  dataset: process.env.VITE_SANITY_DATASET || 'production',
  useCdn: false,
  apiVersion: '2024-01-01',
  token: process.env.SANITY_AUTH_TOKEN, // You'll need to create this token
})

const profileData = {
  _type: 'profile',
  _id: 'michael-evans-profile',
  name: 'Michael Evans',
  title: 'Product Designer & Developer',
  tagline: 'Building innovative digital experiences with AI and modern web technologies',
  bio: [
    {
      _type: 'block',
      children: [
        {
          _type: 'span',
          text: 'Product designer and developer with extensive experience shipping award-winning digital products. Specializes in AI applications, product strategy, and creating delightful user experiences.',
        },
      ],
    },
  ],
  skills: [
    {
      _key: 'design',
      category: 'Design',
      skills: ['Product Design', 'UX Research', 'Wireframing', 'Prototyping', 'Design Systems', 'Figma'],
    },
    {
      _key: 'development',
      category: 'Development',
      skills: ['React', 'TypeScript', 'Next.js', 'Node.js', 'Python', 'AI/ML Integration'],
    },
    {
      _key: 'ai',
      category: 'AI & Data',
      skills: ['LLM Integration', 'Prompt Engineering', 'Data Analysis', 'Machine Learning', 'Computer Vision'],
    },
  ],
  social: {
    github: 'https://github.com/mevans2120',
    linkedin: 'https://www.linkedin.com/in/michaelevans',
    email: 'contact@michaelevans.dev',
  },
}

const projectsData = [
  {
    _type: 'project',
    _id: 'casa-bonita',
    title: 'Casa Bonita Platform',
    slug: {
      _type: 'slug',
      current: 'casa-bonita',
    },
    category: 'case-study',
    summary: 'Restaurant management, reservation, loyalty platform with 300k+ club members',
    description: 'Built and launched Casa Bonita\'s new restaurant management, reservation, loyalty, and marketing platform — now with 300k+ club members accounting for 80% of bookings, and an 85% reservation utilization rate.',
    metrics: [
      { _key: 'members', label: 'Club Members', value: '300k+' },
      { _key: 'bookings', label: 'Bookings Rate', value: '80%' },
      { _key: 'utilization', label: 'Utilization', value: '85%' },
    ],
    achievements: [
      'Designed The Founders Club achieving over 250k sign-ups within 6 hours',
      'Created comprehensive user research insights and wireframes for digital experiences',
      'Designed and tested a pager system enhancing guest experience',
      'Casa Bonita has consistently been fully booked since opening',
    ],
    technologies: ['React', 'TypeScript', 'Node.js', 'PostgreSQL', 'AWS', 'Stripe'],
    featured: true,
    order: 1,
    publishedAt: new Date('2023-06-01').toISOString(),
    content: [
      {
        _type: 'block',
        children: [
          {
            _type: 'span',
            text: 'Casa Bonita is more than a restaurant — it\'s a Denver institution. When new ownership took over, they needed a complete digital transformation to match their ambitious renovation plans.',
          },
        ],
      },
      {
        _type: 'block',
        children: [
          {
            _type: 'span',
            text: 'I led the design and development of a comprehensive platform that handles everything from reservations to loyalty programs, ensuring the restaurant could manage its overwhelming demand effectively.',
          },
        ],
      },
    ],
  },
  {
    _type: 'project',
    _id: 'virgin-america',
    title: 'Virgin America Digital',
    slug: {
      _type: 'slug',
      current: 'virgin-america',
    },
    category: 'case-study',
    summary: 'Award-winning website and mobile app achieving 15% conversion lift',
    description: 'Led strategy, design, and development for VirginAmerica.com, resulting in a 15% conversion lift over three years and influencing Alaska Airlines\' digital evolution.',
    metrics: [
      { _key: 'conversion', label: 'Conversion Lift', value: '15%' },
      { _key: 'period', label: 'Time Period', value: '3 Years' },
      { _key: 'awards', label: 'Awards Won', value: 'Multiple' },
    ],
    achievements: [
      'UX Awards, Cannes Lions, CES, Webbys, and more',
      'Designed and developed deals page A/B tests improving conversion by 5%',
      'Developed Virgin America\'s first mobile app using pioneering cross-platform framework',
      'Reduced maintenance requirements through innovative technical approach',
      'Influenced Alaska Airlines\' digital transformation strategy',
    ],
    technologies: ['React', 'Node.js', 'A/B Testing', 'Mobile Development', 'Analytics'],
    featured: true,
    order: 2,
    publishedAt: new Date('2020-01-01').toISOString(),
    content: [
      {
        _type: 'block',
        children: [
          {
            _type: 'span',
            text: 'Virgin America was known for innovation in the airline industry. I helped extend that innovation to their digital presence, creating the first truly responsive airline website.',
          },
        ],
      },
      {
        _type: 'block',
        children: [
          {
            _type: 'span',
            text: 'The project won numerous awards and set new standards for airline digital experiences, ultimately influencing the broader industry.',
          },
        ],
      },
    ],
  },
  {
    _type: 'project',
    _id: 'before-launcher',
    title: 'Before Launcher',
    slug: {
      _type: 'slug',
      current: 'before-launcher',
    },
    category: 'open-source',
    summary: 'Minimalist Android launcher helping hundreds of thousands focus',
    description: 'Created a minimalist Android launcher that helps users reduce phone addiction and improve focus. Open source project with active community.',
    metrics: [
      { _key: 'users', label: 'Active Users', value: '100k+' },
      { _key: 'rating', label: 'App Rating', value: '4.8/5' },
      { _key: 'downloads', label: 'Total Downloads', value: '500k+' },
    ],
    achievements: [
      'Featured in multiple tech publications',
      'Active open source community with contributors worldwide',
      'Helped thousands reduce screen time and phone addiction',
      'Maintained 4.8+ star rating across releases',
    ],
    technologies: ['Android', 'Kotlin', 'Material Design'],
    githubUrl: 'https://github.com/beforelauncher/before-launcher',
    featured: true,
    order: 3,
    publishedAt: new Date('2022-01-01').toISOString(),
  },
  {
    _type: 'project',
    _id: 'ai-prototypes',
    title: 'AI Application Showcase',
    slug: {
      _type: 'slug',
      current: 'ai-showcase',
    },
    category: 'ai-project',
    summary: 'Four production AI applications and numerous prototypes',
    description: 'Built multiple production AI applications leveraging LLMs, computer vision, and machine learning to solve real-world problems.',
    metrics: [
      { _key: 'production', label: 'Production Apps', value: '4' },
      { _key: 'prototypes', label: 'Prototypes', value: '15+' },
      { _key: 'models', label: 'Models Used', value: '10+' },
    ],
    achievements: [
      'Implemented RAG systems for enterprise knowledge management',
      'Built computer vision pipelines for quality control',
      'Created conversational AI interfaces for customer support',
      'Developed predictive analytics for business intelligence',
    ],
    technologies: ['Python', 'OpenAI', 'LangChain', 'PyTorch', 'Hugging Face', 'Vector DBs'],
    featured: true,
    order: 4,
    publishedAt: new Date('2024-01-01').toISOString(),
  },
]

const capabilitiesData = [
  {
    _type: 'capability',
    _id: 'product-design',
    title: 'Product Design',
    description: 'End-to-end product design from concept to launch',
    icon: 'design',
    services: [
      'User Research & Testing',
      'Information Architecture',
      'Wireframing & Prototyping',
      'Design Systems',
      'Interaction Design',
    ],
    order: 1,
  },
  {
    _type: 'capability',
    _id: 'development',
    title: 'Development',
    description: 'Full-stack development with modern technologies',
    icon: 'code',
    services: [
      'Frontend Development',
      'Backend Architecture',
      'API Design',
      'Database Design',
      'Performance Optimization',
    ],
    order: 2,
  },
  {
    _type: 'capability',
    _id: 'ai-integration',
    title: 'AI Integration',
    description: 'Leveraging AI to enhance products and workflows',
    icon: 'brain',
    services: [
      'LLM Integration',
      'RAG Systems',
      'Computer Vision',
      'Predictive Analytics',
      'Automation Workflows',
    ],
    order: 3,
  },
]

async function migrate() {
  console.log('Starting migration to Sanity...')

  try {
    // Migrate profile
    console.log('Migrating profile...')
    await client.createOrReplace(profileData)
    console.log('✓ Profile migrated')

    // Migrate projects
    console.log('Migrating projects...')
    for (const project of projectsData) {
      await client.createOrReplace(project)
      console.log(`✓ Project migrated: ${project.title}`)
    }

    // Migrate capabilities
    console.log('Migrating capabilities...')
    for (const capability of capabilitiesData) {
      await client.createOrReplace(capability)
      console.log(`✓ Capability migrated: ${capability.title}`)
    }

    console.log('\n✅ Migration completed successfully!')
    console.log('You can now view and edit your content at: http://localhost:8080/studio')
  } catch (error) {
    console.error('Migration failed:', error)
    process.exit(1)
  }
}

// Run migration
migrate()