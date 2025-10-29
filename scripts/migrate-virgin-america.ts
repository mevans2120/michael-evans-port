import { createClient } from '@sanity/client'

// Load env file
import dotenv from 'dotenv'
dotenv.config({ path: '.env.local' })

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || '5n331bys',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2024-01-01',
  useCdn: false,
  token: process.env.SANITY_AUTH_TOKEN || 'skcJf38Eo8KBxDUqBh7B7M1QJHLNpBBqLAVfpEmiSVsTrZvonnudlIRxrWzYoawixXe4IUz5cKKBEXTL0',
})

const virginAmericaData = {
  _type: 'project',
  _id: 'virgin-america', // Explicit ID for predictable updates
  title: 'Virgin America - First Responsive Airline Website',
  slug: {
    _type: 'slug',
    current: 'virgin-america',
  },
  category: 'case-study',
  summary: "Led the product strategy and client relationship for Virgin America's groundbreaking responsive website redesign. By rethinking the booking flow around individual decisions rather than minimizing clicks, we created the first responsive airline website that improved conversion by 15-20% and won multiple industry awards including Webbies, UX Awards, and Cannes Lions.",
  description: "Reimagining airline booking by focusing on decisions, not clicks — achieving 15-20% conversion improvement",
  featured: true,
  order: 1,
  publishedAt: '2015-06-01T00:00:00Z',

  // Key Metrics
  metrics: [
    {
      _key: 'metric-1',
      label: 'Conversion Improvement',
      value: '15-20%',
    },
    {
      _key: 'metric-2',
      label: 'Industry First',
      value: 'Responsive Airline Website',
    },
    {
      _key: 'metric-3',
      label: 'Awards Won',
      value: '3+',
    },
    {
      _key: 'metric-4',
      label: 'Tech Stack',
      value: 'Angular',
    },
  ],

  // Key Achievements
  achievements: [
    "Created the first responsive airline website",
    "Improved conversion rates by 15-20%",
    "Won Webbies, UX Awards, and Cannes Lions",
    "Pioneered the step-by-step, decision-by-decision e-commerce pattern",
    "Built the largest Angular project at the time",
    "Addressed complex data science issues with modern dashboards",
  ],

  // Technologies
  technologies: [
    'Angular',
    'Sabre API',
    'Responsive Design',
    'Single-Page Application (SPA)',
    'RESTful APIs',
    'Data Visualization',
  ],

  // Overview
  overview: {
    role: 'Lead Product Manager & Client Lead',
    company: 'Work & Co',
    timeline: '~1 year (2014-2015)',
  },

  // Content Sections
  sections: [
    {
      _type: 'object',
      _key: 'section-1',
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
              text: 'But leisure travelers, who book 2-3 times per year, were struggling. An airline ticket is one of the most complex consumer products to purchase:',
            },
          ],
        },
        {
          _type: 'block',
          _key: 'block-3',
          listItem: 'bullet',
          style: 'normal',
          children: [{ _type: 'span', text: 'Choose travelers' }],
        },
        {
          _type: 'block',
          _key: 'block-4',
          listItem: 'bullet',
          style: 'normal',
          children: [{ _type: 'span', text: 'Select dates and times' }],
        },
        {
          _type: 'block',
          _key: 'block-5',
          listItem: 'bullet',
          style: 'normal',
          children: [{ _type: 'span', text: 'Pick flights and seats' }],
        },
        {
          _type: 'block',
          _key: 'block-6',
          listItem: 'bullet',
          style: 'normal',
          children: [{ _type: 'span', text: 'Align with hotel and car reservations' }],
        },
        {
          _type: 'block',
          _key: 'block-7',
          listItem: 'bullet',
          style: 'normal',
          children: [{ _type: 'span', text: 'Enter payment and traveler information' }],
        },
        {
          _type: 'block',
          _key: 'block-8',
          listItem: 'bullet',
          style: 'normal',
          children: [{ _type: 'span', text: 'Choose fare types and ancillaries' }],
        },
        {
          _type: 'block',
          _key: 'block-9',
          style: 'normal',
          children: [
            {
              _type: 'span',
              text: 'Leisure travelers were failing to convert at alarming rates. ',
            },
            {
              _type: 'span',
              marks: ['strong'],
              text: 'The brief: make it simpler for leisure travelers without compromising the experience for business travelers.',
            },
          ],
        },
      ],
      screenshots: [],
    },
    {
      _type: 'object',
      _key: 'section-2',
      sectionLabel: 'Research Insights',
      heading: 'Clicks vs. Decisions - The Key Insight',
      content: [
        {
          _type: 'block',
          _key: 'block-1',
          style: 'normal',
          children: [
            {
              _type: 'span',
              text: 'In 2014-2015, the industry was obsessed with reducing clicks to improve conversion. We discovered something more fundamental: ',
            },
            {
              _type: 'span',
              marks: ['strong'],
              text: "it's not about the number of clicks—it's about the number of decisions.",
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
              text: 'Combining multiple decisions into one screen to reduce clicks actually makes the experience more complicated and overwhelming. Each decision needs space to breathe.',
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
              marks: ['strong'],
              text: 'Our insight:',
            },
            {
              _type: 'span',
              text: ' Separate every major decision into its own step. Give users cognitive breathing room.',
            },
          ],
        },
      ],
      screenshots: [],
    },
    {
      _type: 'object',
      _key: 'section-3',
      sectionLabel: 'The Solution',
      heading: 'A Step-by-Step Booking Flow',
      content: [
        {
          _type: 'block',
          _key: 'block-1',
          style: 'normal',
          children: [
            {
              _type: 'span',
              text: 'We redesigned the entire booking flow around individual decisions:',
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
              marks: ['strong'],
              text: "Who's going",
            },
            {
              _type: 'span',
              text: ' - Clear passenger selection',
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
              marks: ['strong'],
              text: 'Dates and times',
            },
            {
              _type: 'span',
              text: ' - Focused date picker without distractions',
            },
          ],
        },
        {
          _type: 'block',
          _key: 'block-4',
          style: 'normal',
          children: [
            {
              _type: 'span',
              marks: ['strong'],
              text: 'Flights',
            },
            {
              _type: 'span',
              text: ' - Present options with clear differentiation',
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
              marks: ['strong'],
              text: 'Seats',
            },
            {
              _type: 'span',
              text: ' - Visual seat selection',
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
              marks: ['strong'],
              text: 'Traveler information',
            },
            {
              _type: 'span',
              text: ' - Simplified form entry',
            },
          ],
        },
        {
          _type: 'block',
          _key: 'block-7',
          style: 'normal',
          children: [
            {
              _type: 'span',
              marks: ['strong'],
              text: 'Confirmation',
            },
            {
              _type: 'span',
              text: ' - Clear summary and payment',
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
              text: 'Each step was optimized independently, with clear progress indicators and the ability to easily return and modify earlier decisions.',
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
              text: 'This pattern became widely adopted in e-commerce and is now considered standard practice for complex purchase flows.',
            },
          ],
        },
      ],
      screenshots: [],
    },
    {
      _type: 'object',
      _key: 'section-4',
      sectionLabel: 'Technical Implementation',
      heading: 'Building on Legacy Systems',
      content: [
        {
          _type: 'block',
          _key: 'block-1',
          style: 'normal',
          children: [
            {
              _type: 'span',
              text: 'The technical implementation presented unique challenges:',
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
              marks: ['strong'],
              text: 'Legacy Integration:',
            },
            {
              _type: 'span',
              text: " Virgin America's booking system ran on Sabre, an IBM mainframe system from the 1970s. We were integrating bleeding-edge Angular with one of the oldest enterprise systems still in production.",
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
              marks: ['strong'],
              text: 'API Design:',
            },
            {
              _type: 'span',
              text: " We insisted that business logic stay in the API rather than the front-end. This meant extensive collaboration with Virgin America's API team to design stateless endpoints that could handle complex booking flows.",
            },
          ],
        },
        {
          _type: 'block',
          _key: 'block-4',
          style: 'normal',
          children: [
            {
              _type: 'span',
              marks: ['strong'],
              text: 'Scale:',
            },
            {
              _type: 'span',
              text: ' This became the largest Angular project at the time by a significant margin. We were pushing the boundaries of what single-page applications could handle in production.',
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
              marks: ['strong'],
              text: 'No Chained Requests:',
            },
            {
              _type: 'span',
              text: ' To maintain performance, we ensured each API call contained everything needed for that step—no waterfall of dependent requests.',
            },
          ],
        },
      ],
      screenshots: [],
    },
    {
      _type: 'object',
      _key: 'section-5',
      sectionLabel: 'Testing & Optimization',
      heading: 'Data-Driven Design Decisions',
      content: [
        {
          _type: 'block',
          _key: 'block-1',
          style: 'normal',
          children: [
            {
              _type: 'span',
              text: 'We conducted extensive A/B testing on the deals pages (weekly flight specials):',
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
              marks: ['strong'],
              text: 'Three Versions Tested:',
            },
          ],
        },
        {
          _type: 'block',
          _key: 'block-3',
          listItem: 'number',
          style: 'normal',
          children: [{ _type: 'span', text: "Illustrations (Virgin's brand style)" }],
        },
        {
          _type: 'block',
          _key: 'block-4',
          listItem: 'number',
          style: 'normal',
          children: [{ _type: 'span', text: 'Photography' }],
        },
        {
          _type: 'block',
          _key: 'block-5',
          listItem: 'number',
          style: 'normal',
          children: [{ _type: 'span', text: 'Google-style plain list' }],
        },
        {
          _type: 'block',
          _key: 'block-6',
          style: 'normal',
          children: [
            {
              _type: 'span',
              marks: ['strong'],
              text: 'Hypothesis:',
            },
            {
              _type: 'span',
              text: ' I expected the Google-style list to win—simpler is better, right?',
            },
          ],
        },
        {
          _type: 'block',
          _key: 'block-7',
          style: 'normal',
          children: [
            {
              _type: 'span',
              marks: ['strong'],
              text: 'Result:',
            },
            {
              _type: 'span',
              text: ' Imagery won decisively, then illustrations, with the plain list finishing last.',
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
              marks: ['strong'],
              text: 'Learning:',
            },
            {
              _type: 'span',
              text: " For deals and emotionally-driven purchases, you need to spark emotion. Pure efficiency doesn't convert when people are deciding whether to take a trip.",
            },
          ],
        },
      ],
      screenshots: [],
    },
    {
      _type: 'object',
      _key: 'section-6',
      sectionLabel: 'Impact',
      heading: 'Industry-Defining Success',
      content: [
        {
          _type: 'block',
          _key: 'block-1',
          style: 'normal',
          children: [
            {
              _type: 'span',
              marks: ['strong'],
              text: 'Quantifiable Results:',
            },
          ],
        },
        {
          _type: 'block',
          _key: 'block-2',
          listItem: 'bullet',
          style: 'normal',
          children: [
            {
              _type: 'span',
              marks: ['strong'],
              text: '15-20% improvement in conversion rates',
            },
          ],
        },
        {
          _type: 'block',
          _key: 'block-3',
          listItem: 'bullet',
          style: 'normal',
          children: [
            {
              _type: 'span',
              text: 'Became the template for modern e-commerce booking flows',
            },
          ],
        },
        {
          _type: 'block',
          _key: 'block-4',
          listItem: 'bullet',
          style: 'normal',
          children: [
            {
              _type: 'span',
              text: 'Addressed data science gaps with modern conversion dashboards',
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
              marks: ['strong'],
              text: 'Industry Recognition:',
            },
          ],
        },
        {
          _type: 'block',
          _key: 'block-6',
          listItem: 'bullet',
          style: 'normal',
          children: [{ _type: 'span', text: 'Webbies' }],
        },
        {
          _type: 'block',
          _key: 'block-7',
          listItem: 'bullet',
          style: 'normal',
          children: [{ _type: 'span', text: 'UX Awards' }],
        },
        {
          _type: 'block',
          _key: 'block-8',
          listItem: 'bullet',
          style: 'normal',
          children: [{ _type: 'span', text: 'Cannes Lions' }],
        },
        {
          _type: 'block',
          _key: 'block-9',
          listItem: 'bullet',
          style: 'normal',
          children: [
            {
              _type: 'span',
              text: 'Featured heavily on design Twitter the day after launch',
            },
          ],
        },
        {
          _type: 'block',
          _key: 'block-10',
          listItem: 'bullet',
          style: 'normal',
          children: [
            {
              _type: 'span',
              text: '"First responsive airline website" became a portfolio staple',
            },
          ],
        },
        {
          _type: 'block',
          _key: 'block-11',
          style: 'normal',
          children: [
            {
              _type: 'span',
              marks: ['strong'],
              text: 'Legacy:',
            },
          ],
        },
        {
          _type: 'block',
          _key: 'block-12',
          style: 'normal',
          children: [
            {
              _type: 'span',
              text: 'The step-by-step, decision-by-decision pattern we pioneered is now standard in e-commerce. You can see its influence in booking flows across industries—from travel to insurance to financial services.',
            },
          ],
        },
      ],
      screenshots: [],
    },
    {
      _type: 'object',
      _key: 'section-7',
      sectionLabel: 'Evolution',
      heading: 'Extending the Vision',
      content: [
        {
          _type: 'block',
          _key: 'block-1',
          style: 'normal',
          children: [
            {
              _type: 'span',
              text: "Following the website's success, we built Virgin America's mobile app with similar principles. This was before React Native—we built native iOS and Android apps while trying to avoid duplicating business logic.",
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
              marks: ['strong'],
              text: "What I'd Do Differently:",
            },
            {
              _type: 'span',
              text: ' We built our own framework ahead of React. Building a framework AND an app simultaneously was ambitious to a fault. It slowed us down significantly and we delivered late. Lesson learned: use established tools when possible.',
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
              marks: ['strong'],
              text: 'Alaska Airlines Acquisition:',
            },
          ],
        },
        {
          _type: 'block',
          _key: 'block-4',
          style: 'normal',
          children: [
            {
              _type: 'span',
              text: 'When Alaska Airlines acquired Virgin America, they engaged us to design conceptual website experiences based on our approach. Those designs are just now being implemented (2023-2025), showing how forward-thinking the work was.',
            },
          ],
        },
      ],
      screenshots: [],
    },
    {
      _type: 'object',
      _key: 'section-8',
      sectionLabel: 'Reflections',
      heading: 'Key Takeaways',
      content: [
        {
          _type: 'block',
          _key: 'block-1',
          style: 'normal',
          children: [
            {
              _type: 'span',
              marks: ['strong'],
              text: 'Team Quality Matters:',
            },
            {
              _type: 'span',
              text: ' We kept adding people to the project as it grew, and kept "hitting the jackpot" with talent. Having exceptional people makes everything possible.',
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
              marks: ['strong'],
              text: 'Respect Your Engineers:',
            },
            {
              _type: 'span',
              text: ' On Broadway.com (my previous project at Huge), we ignored engineer concerns about technical architecture. The site crashed after 3 minutes in production. On Virgin America, we listened. That made all the difference.',
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
              marks: ['strong'],
              text: 'Business Logic Placement:',
            },
            {
              _type: 'span',
              text: " We fought to keep business logic in APIs, not the front-end. At the time, this was considered essential. Now, with modern frameworks, having business logic in the front-end isn't universally considered bad—context matters.",
            },
          ],
        },
        {
          _type: 'block',
          _key: 'block-4',
          style: 'normal',
          children: [
            {
              _type: 'span',
              marks: ['strong'],
              text: 'Industry Insights:',
            },
            {
              _type: 'span',
              text: ' Airlines are brutal businesses. You need to run perfectly AND need low gas prices AND high demand. You control only one of those factors.',
            },
          ],
        },
      ],
      screenshots: [],
    },
  ],
}

async function migrateVirginAmerica() {
  try {
    console.log('🚀 Starting Virgin America migration...')

    // Create or replace the document
    const result = await client.createOrReplace(virginAmericaData)

    console.log('✅ Successfully migrated Virgin America case study')
    console.log(`   Document ID: ${result._id}`)
    console.log(`   Document Rev: ${result._rev}`)
    console.log(`   URL: http://localhost:3000/case-studies/virgin-america`)
  } catch (error) {
    console.error('❌ Migration failed:', error)
    process.exit(1)
  }
}

migrateVirginAmerica()
