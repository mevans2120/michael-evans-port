import { importClient, createOrUpdateDocument, createReference, createSlug } from './sanity-import-client'

// Workflow steps from PostPal architecture
const workflowSteps = [
  {
    _id: 'workflowStep-provider-upload',
    _type: 'workflowStep',
    stepNumber: 1,
    title: 'Provider Upload',
    description: 'Providers upload PDF discharge instructions and generate a QR code with pre-filled patient data. Patients scan the code to instantly access their personalized timeline.',
    icon: '📄',
  },
  {
    _id: 'workflowStep-ai-extraction',
    _type: 'workflowStep',
    stepNumber: 2,
    title: 'AI Content Extraction',
    description: 'Mistral AI handles OCR to pull text from PDFs, while Claude analyzes medical instructions for context, identifying medications, activity restrictions, and creating structured tasks.',
    icon: '🤖',
  },
  {
    _id: 'workflowStep-timeline-generation',
    _type: 'workflowStep',
    stepNumber: 3,
    title: 'Timeline Generation',
    description: 'AI creates a personalized recovery timeline organized by day, week, and month, with automatic scheduling relative to the procedure date and context-aware task generation.',
    icon: '📅',
  },
  {
    _id: 'workflowStep-patient-engagement',
    _type: 'workflowStep',
    stepNumber: 4,
    title: 'Patient Engagement',
    description: 'Mobile app delivers daily reminders, patients check off completed tasks, progress tracking provides visual feedback, and multi-channel notifications ensure critical reminders reach patients.',
    icon: '✅',
  },
]

// Main PostPal showcase document
const postpalShowcase = {
  _id: 'aiShowcase-postpal',
  _type: 'aiShowcase',
  title: 'PostPal: AI-Powered Recovery Guidance for Healthcare',
  slug: createSlug('postpal'),
  category: 'healthcare-ai',
  featured: true,
  order: 2,

  heroSection: {
    badge: 'Healthcare AI',
    title: 'PostPal: Transforming Post-Procedure Recovery with AI',
    subtitle: 'From paper pamphlets to intelligent timelines: How AI is solving healthcare\'s discharge instruction problem',
    summary: 'The problem is deceptively simple yet pervasive: after every medical procedure, patients receive critical care instructions on paper pamphlets that get lost, misunderstood, or forgotten. PostPal transforms this broken system into an intelligent, personalized recovery timeline that guides patients through every stage of healing while giving providers visibility into compliance.',
  },

  slides: [
    {
      _type: 'contentSlide',
      sectionLabel: 'Phase 01 — Problem',
      heading: 'Why Healthcare Discharge Instructions Are Broken',
      content: [
        {
          _type: 'block',
          children: [
            {
              _type: 'span',
              text: 'Walk into any medical facility and observe patients leaving after procedures. They\'re handed paper pamphlets containing complex, time-bound care instructions that are critical to their recovery. The instructions vary dramatically by procedure type, but the problems are universal.',
            },
          ],
        },
      ],
      comparisonBoxes: [
        {
          label: 'The Problem',
          title: 'Paper Pamphlets',
          text: 'Documents get lost, water-damaged, or misunderstood. Patients experience anxiety wondering "Can I shower yet?" Providers face endless repetitive phone calls.',
          stat: '$20K-$50K',
          icon: '📋',
        },
        {
          label: 'The Solution',
          title: 'AI-Powered Timelines',
          text: 'Intelligent, personalized recovery guidance that actively guides patients through healing with automatic reminders and clear, time-specific instructions.',
          stat: '30-50%',
          icon: '📱',
        },
      ],
    },
    {
      _type: 'contentSlide',
      sectionLabel: 'Phase 02 — Architecture',
      heading: 'How AI Transforms Medical Instructions',
      content: [
        {
          _type: 'block',
          children: [
            {
              _type: 'span',
              text: 'PostPal uses a two-platform solution bridging the provider-patient gap. Web application serves as both provider portal and patient dashboard. Mobile app provides biometric authentication, offline-first architecture, and real-time synchronization.',
            },
          ],
        },
      ],
      techPills: [
        'Next.js',
        'React Native',
        'PostgreSQL',
        'Prisma',
        'Claude AI',
        'Mistral AI',
        'TypeScript',
        'HIPAA Compliant',
      ],
    },
    {
      _type: 'contentSlide',
      sectionLabel: 'Phase 03 — Experience',
      heading: 'From Confusion to Confidence',
      content: [
        {
          _type: 'block',
          children: [
            {
              _type: 'span',
              text: 'For patients, PostPal transforms the post-procedure experience from anxious uncertainty to informed confidence. The intelligent recovery timeline presents daily, personalized care instructions that answer the fundamental question: "What can I do today?"',
            },
          ],
        },
      ],
    },
    {
      _type: 'contentSlide',
      sectionLabel: 'Phase 04 — Provider Portal',
      heading: 'Reducing Administrative Burden',
      content: [
        {
          _type: 'block',
          children: [
            {
              _type: 'span',
              text: 'From the provider perspective, PostPal addresses a persistent operational problem: the flood of repetitive patient questions that consume staff time without adding clinical value. QR code onboarding takes seconds.',
            },
          ],
        },
      ],
    },
  ],

  horizontalSectionLabel: 'Phase 02 — Workflow',
  horizontalSectionHeading: 'The AI-Powered Patient Onboarding Process',

  // Reference to workflow steps
  workflowSteps: workflowSteps.map(step => createReference(step._id, 'workflowStep')),

  metrics: [
    { value: '30-50%', label: 'Fewer Patient Calls', description: 'Post-procedure inquiries' },
    { value: '20-40%', label: 'Better Compliance', description: 'Care instruction adherence' },
    { value: '15-25%', label: 'Fewer Complications', description: 'Preventable readmissions' },
    { value: '< 2 Sec', label: 'Web Load Time', description: 'Performance metrics' },
    { value: '30+', label: 'Database Models', description: 'Prisma schema complexity' },
    { value: '90%+', label: 'Patient Satisfaction', description: 'Digital vs paper' },
  ],

  callToAction: {
    text: 'View More Projects',
    link: '/ai-projects',
  },
}

// Import function
async function importPostPal() {
  console.log('🚀 Starting PostPal showcase import...\n')

  try {
    // Import workflow steps first
    console.log('📝 Importing workflow steps...')
    for (const step of workflowSteps) {
      await createOrUpdateDocument(step)
      console.log(`  ✓ Created: Step ${step.stepNumber} - ${step.title}`)
    }
    console.log()

    // Import main showcase document
    console.log('📝 Importing PostPal showcase...')
    await createOrUpdateDocument(postpalShowcase)
    console.log(`  ✓ Created: ${postpalShowcase.title}`)
    console.log()

    console.log('✅ PostPal showcase import completed successfully!')
  } catch (error) {
    console.error('❌ Error importing PostPal showcase:', error)
    throw error
  }
}

// Run import
importPostPal()
  .then(() => {
    console.log('\n🎉 Import finished!')
    process.exit(0)
  })
  .catch((error) => {
    console.error('\n💥 Import failed:', error)
    process.exit(1)
  })
