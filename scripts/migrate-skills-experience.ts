#!/usr/bin/env tsx
import { createClient } from '@sanity/client'
import * as dotenv from 'dotenv'
import { resolve } from 'path'

// Load environment variables
dotenv.config({ path: resolve(process.cwd(), '.env.local') })

// Verify token loaded
console.log('Token loaded:', !!process.env.SANITY_WRITE_TOKEN)

// Create write-enabled client
const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || '5n331bys',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2024-01-01',
  token: process.env.SANITY_WRITE_TOKEN,
  useCdn: false,
})

// Skills data (for knowsAbout in Person schema)
const skillsData = [
  {
    _key: 'product-strategy',
    category: 'Product & Strategy',
    skills: [
      'Product Management',
      'Product Strategy',
      'UX Strategy',
      'Client Leadership',
      '0-to-1 Product Development',
      'Agile/Scrum',
    ],
  },
  {
    _key: 'design',
    category: 'Design',
    skills: [
      'UX Design',
      'User Research',
      'Interaction Design',
      'Responsive Design',
      'Mobile App Design',
      'Design Systems',
    ],
  },
  {
    _key: 'technical',
    category: 'Technical',
    skills: [
      'Technical Architecture',
      'Single-Page Applications',
      'API Design',
      'SQL & Databases',
      'Front-end Development',
    ],
  },
  {
    _key: 'technologies',
    category: 'Technologies',
    skills: [
      'React / Next.js',
      'TypeScript',
      'Angular',
      'React Native',
      'Node.js',
      'PostgreSQL / Supabase',
      'Vercel',
    ],
  },
  {
    _key: 'ai-ml',
    category: 'AI/ML',
    skills: [
      'AI-Assisted Development',
      'Prompt Engineering',
      'Claude / LLMs',
      'AI Product Integration',
    ],
  },
  {
    _key: 'industries',
    category: 'Industries',
    skills: [
      'E-commerce',
      'Travel & Aviation',
      'Streaming Media',
      'Hospitality',
      'Healthcare / MedTech',
    ],
  },
]

// Experience data (for worksFor in Person schema - only current matters for structured data)
const experienceData = [
  {
    _key: 'mevans-llc',
    company: 'MEvans LLC',
    role: 'Founder, AI Builder & Consultant',
    startDate: '2024-01-01',
    current: true,
    description: 'Independent consulting and AI product development. Building with Claude Code and modern AI tools.',
  },
  {
    _key: 'raw-materials',
    company: 'Raw Materials',
    role: 'Product Lead, UX Strategist',
    startDate: '2022-01-01',
    endDate: '2024-03-01',
    current: false,
    description: 'Led product strategy for Peacock TV apps, Casa Bonita reservations system, and Peddle data analytics.',
  },
  {
    _key: 'before-labs',
    company: 'Before Labs',
    role: 'Founder',
    startDate: '2017-01-01',
    endDate: '2020-12-01',
    current: false,
    description: 'Created Before Launcher for Android - Fast Company Best App of 2019. Acquired by Microsoft.',
  },
  {
    _key: 'work-and-co',
    company: 'Work & Co',
    role: 'Product Lead (Founding Employee)',
    startDate: '2014-01-01',
    endDate: '2018-01-01',
    current: false,
    description: 'One of the first employees. Opened Portland office. Led Virgin America (award-winning), Aesop, Lyft.',
  },
  {
    _key: 'huge',
    company: 'Huge',
    role: 'Program Manager',
    startDate: '2008-01-01',
    endDate: '2013-12-01',
    current: false,
    description: 'Target retail innovation, HBO Go (Astral), HouseLogic (NAR), Broadway.com.',
  },
  {
    _key: 'symantec',
    company: 'Symantec',
    role: 'Business Analyst',
    startDate: '2001-06-01',
    endDate: '2003-12-01',
    current: false,
    description: 'First tech job. Learned SQL, databases, and business analysis fundamentals.',
  },
]

async function migrate() {
  console.log('Starting skills and experience migration...')

  // Fetch profile document
  const profile = await client.fetch(`*[_type == "profile"][0]{ _id, name }`)

  if (!profile) {
    console.error('No profile document found. Create one in Sanity Studio first.')
    return
  }

  console.log(`Found profile: ${profile.name} (${profile._id})`)

  // Update with skills and experience
  try {
    await client
      .patch(profile._id)
      .set({
        skills: skillsData,
        experience: experienceData,
      })
      .commit()

    console.log('')
    console.log('✅ Migration complete!')
    console.log('')
    console.log('Added:')
    console.log(`  - ${skillsData.length} skill categories`)
    console.log(`  - ${skillsData.reduce((acc, cat) => acc + cat.skills.length, 0)} total skills`)
    console.log(`  - ${experienceData.length} experience entries`)
    console.log('')
    console.log('Current employer for structured data: MEvans LLC')
  } catch (error) {
    console.error('Migration failed:', error)
  }
}

migrate()
