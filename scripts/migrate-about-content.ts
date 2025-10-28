import { createClient } from '@sanity/client'
import { config } from 'dotenv'
import { resolve } from 'path'

// Load environment variables from .env.local
config({ path: resolve(process.cwd(), '.env.local') })

const client = createClient({
  projectId: '5n331bys',
  dataset: 'production',
  apiVersion: '2024-01-01',
  token: process.env.SANITY_AUTH_TOKEN || process.env.SANITY_API_TOKEN,
  useCdn: false,
})

if (!client.config().token) {
  console.error('❌ No Sanity token found in environment variables')
  console.error('Please ensure SANITY_AUTH_TOKEN is set in .env.local')
  process.exit(1)
}

async function migrateAboutContent() {
  console.log('Starting about page content migration...')

  try {
    // Fetch existing profile to preserve existing data
    const existingProfile = await client.fetch(`*[_type == "profile"][0]`)

    if (!existingProfile) {
      console.error('No profile document found. Please create one first in Sanity Studio.')
      process.exit(1)
    }

    console.log('Found existing profile:', existingProfile.name)

    // Hero Section Data
    const heroData = {
      heroHeadline: 'Product Manager • UX Strategist • AI Builder',
      heroSubheadline: '20 years solving complex problems. Now building with AI.',
      heroIntro: "I'm a product manager based in Portland, Oregon, who specializes in taking products from 0 to 1. From leading Virgin America's award-winning website redesign to building AI-powered healthcare apps, I combine deep technical knowledge with big-picture business thinking—and now build software directly with Claude Code.",
    }

    // Quick Facts Data
    const quickFacts = [
      { label: 'Location', value: 'Portland, Oregon' },
      { label: 'Experience', value: '20 Years in Software' },
      { label: 'Approach', value: "0-to-1 'Army of One'" },
      { label: 'Current Focus', value: 'AI/ML-Powered Products' },
      { label: 'Work Style', value: 'Remote (love on-site too)' },
      { label: 'Availability', value: 'Open to Opportunities' },
    ]

    // Capabilities Data
    const capabilities = [
      { title: 'Strategy', description: 'Define what to build and why', isNew: false },
      { title: 'UX Design', description: 'Create the interface and experience', isNew: false },
      { title: 'Research', description: 'Understand users and validate ideas', isNew: false },
      { title: 'Analysis', description: 'Make sense of data and metrics', isNew: false },
      { title: 'Project Management', description: 'Ship things on time', isNew: false },
      { title: 'Prioritization', description: 'Backlogs, roadmaps, feature lists', isNew: false },
      { title: 'Development', description: 'Build and test with Claude Code', isNew: true },
    ]

    // Selected Projects Data
    const selectedProjects = [
      {
        title: 'Before Launcher',
        metric: '30-40% reduction in phone opens • Fast Company Best App 2019',
        description: 'Minimalist Android launcher that helped thousands focus. Founder, Before Labs.',
        order: 1,
      },
      {
        title: 'Casa Bonita',
        metric: '40,000-person queue • 25% increase in covers',
        description: 'Restaurant with immersive entertainment. Managed massive queues, consistently hit 100% capacity.',
        order: 2,
      },
      {
        title: 'Virgin America',
        metric: '20% conversion improvement • Multiple awards',
        description: 'First responsive airline website. Webbies, UX Awards, Cannes Lions. Pioneered decision-based booking flows.',
        order: 3,
      },
      {
        title: 'AI Research Presentation',
        metric: 'Insights from industry leaders • Evidence for my current focus',
        description: 'Qualitative first party research. Deep understanding of AI and its future.',
        order: 4,
      },
    ]

    // Sections Data (simplified - add more as needed)
    const sections = [
      {
        heading: 'At a Glance',
        slug: { _type: 'slug', current: 'at-a-glance' },
        content: [
          {
            _type: 'block',
            children: [
              {
                _type: 'span',
                text: "I'm a product manager who lives in Portland, Oregon. Technology enthusiast, AI enthusiast, father of two boys, lifelong learner, and kind of an \"army of one\" when it comes to capabilities across software.",
              },
            ],
            markDefs: [],
            style: 'normal',
          },
          {
            _type: 'block',
            children: [
              {
                _type: 'span',
                text: 'A generalist with many specialties:',
                marks: ['strong'],
              },
            ],
            markDefs: [],
            style: 'normal',
          },
          {
            _type: 'block',
            children: [
              {
                _type: 'span',
                text: 'I can go pretty deep across an array of capabilities: Strategy, UX Design, Research, Analysis, Project Management, Prioritization, and now Development with Claude Code.',
              },
            ],
            markDefs: [],
            style: 'normal',
          },
          {
            _type: 'block',
            children: [
              {
                _type: 'span',
                text: "That last one is new. Working with AI has transformed how I work—I can now take projects from strategy through to working code, all while maintaining the product thinking that's been at the core of my career for 20 years.",
              },
            ],
            markDefs: [],
            style: 'normal',
          },
        ],
        visible: true,
      },
      {
        heading: 'From Yurts to Gigahertz',
        slug: { _type: 'slug', current: 'from-yurts-to-gigahertz' },
        content: [
          {
            _type: 'block',
            children: [
              {
                _type: 'span',
                text: 'I was raised by hippies in a purple house in Eugene, Oregon. I fell in love with computers and software as a kid, learned to program a bit when I was 11, but I also love to read and write... So I studied English at the University of Colorado.',
              },
            ],
            markDefs: [],
            style: 'normal',
          },
        ],
        subsections: [
          {
            heading: '20 Years in Software',
            content: [
              {
                _type: 'block',
                children: [
                  {
                    _type: 'span',
                    text: 'I\'ve been doing product management for much of my career, even though sometimes my role was called "project manager" or "solutions architect" or "business analyst." The titles changed, but the work remained consistent: understand the problem, design the solution, ship the product, measure the results, iterate.',
                  },
                ],
                markDefs: [],
                style: 'normal',
              },
              {
                _type: 'block',
                children: [
                  {
                    _type: 'span',
                    text: 'Whether it was helping leisure travelers book airline tickets, helping people focus by filtering notifications, or managing 40,000 people in a queue for a restaurant, the work has always been about making complex things simple and delightful.',
                  },
                ],
                markDefs: [],
                style: 'normal',
              },
            ],
          },
        ],
        visible: true,
      },
      {
        heading: 'Three Things About Me',
        slug: { _type: 'slug', current: 'three-things' },
        subsections: [
          {
            heading: '1. Deep Technical Knowledge',
            content: [
              {
                _type: 'block',
                children: [
                  {
                    _type: 'span',
                    text: "I'm as technical as you can get without being much of a coder. I coded in middle school, know HTML and CSS, and understand how software applications are architected. I can go deep technically in any stripe of software—whether it's Salesforce, NetSuite, SaaS products, or complete custom builds.",
                  },
                ],
                markDefs: [],
                style: 'normal',
              },
            ],
          },
          {
            heading: '2. Big Picture Business View',
            content: [
              {
                _type: 'block',
                children: [
                  {
                    _type: 'span',
                    text: "I'm really good at seeing what's important for a business and their customers at the 50,000-foot level. I understand that technology exists to serve business goals, and business goals exist to serve customers.",
                  },
                ],
                markDefs: [],
                style: 'normal',
              },
            ],
          },
          {
            heading: '3. Range',
            content: [
              {
                _type: 'block',
                children: [
                  {
                    _type: 'span',
                    text: "I can go from true 50,000 feet all the way down to deep in the weeds—wherever is needed for the project. One day I'm defining product strategy with executives. The next I'm reviewing button padding with designers. Then I'm debugging API responses with engineers. This range is rare and valuable.",
                  },
                ],
                markDefs: [],
                style: 'normal',
              },
            ],
          },
        ],
        visible: true,
      },
    ]

    // CTA Data
    const ctaData = {
      availability: true,
      availabilityText: 'Am I available for consulting? Yes. Projects that help my clients and solve challenging problems.',
      ctaText: 'Am I available for consulting? Yes. Projects that help my clients and solve challenging problems.',
      ctaButtonText: "Let's Work Together",
    }

    // Merge with existing profile data
    const updatedProfile = {
      ...existingProfile,
      ...heroData,
      quickFacts,
      capabilities,
      selectedProjects,
      sections,
      ...ctaData,
    }

    // Update the profile document
    const result = await client
      .patch(existingProfile._id)
      .set(updatedProfile)
      .commit()

    console.log('✅ Migration completed successfully!')
    console.log('Updated profile:', result.name)
    console.log('\nNew fields added:')
    console.log('- Hero section (headline, subheadline, intro)')
    console.log('- Quick facts:', quickFacts.length, 'items')
    console.log('- Capabilities:', capabilities.length, 'items')
    console.log('- Selected projects:', selectedProjects.length, 'items')
    console.log('- Content sections:', sections.length, 'sections')
    console.log('- CTA data')

    console.log('\n🌐 View your about page at: http://localhost:3000/about')
    console.log('📝 Edit in Sanity Studio: http://localhost:3000/studio')
  } catch (error) {
    console.error('❌ Migration failed:', error)
    process.exit(1)
  }
}

// Run migration
migrateAboutContent()
