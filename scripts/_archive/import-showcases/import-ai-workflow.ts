import { importClient, createOrUpdateDocument, createReference, createSlug } from './sanity-import-client'

// Timeline phases from content spec Section 2
const timelinePhases = [
  {
    _id: 'timelinePhase-experimentation',
    _type: 'timelinePhase',
    phase: 'Early 2024',
    title: 'Experimentation',
    description: 'After completing the Casa Bonita project, I finally had time to pay attention to AI beyond just following the news. I started with Replit for rapid prototyping—it was accessible and required minimal setup. The kitchen timer experiment proved AI could build functional software quickly, but Replit\'s limitations became apparent.',
    order: 1,
  },
  {
    _id: 'timelinePhase-tool-discovery',
    _type: 'timelinePhase',
    phase: 'Spring 2024',
    title: 'Tool Discovery',
    description: 'I moved to Cursor after hearing it was a significant step up from Replit. Cursor offered much more flexibility by working with local files, which made it faster and more straightforward to verify work quality. I explored various AI coding assistants, testing their strengths and limitations.',
    order: 2,
  },
  {
    _id: 'timelinePhase-production-ready',
    _type: 'timelinePhase',
    phase: 'Mid 2024',
    title: 'Production-Ready Development',
    description: 'The breakthrough came when I adopted Claude Code as my primary development environment. Unlike other tools, Claude Code runs in the terminal inside VS Code, giving it access to all files and CLI tools while maintaining the power and speed I needed.',
    order: 3,
  },
  {
    _id: 'timelinePhase-skills-ecosystem',
    _type: 'timelinePhase',
    phase: 'Summer 2024',
    title: 'Skills Ecosystem',
    description: 'I developed a comprehensive workflow built around Claude Code\'s skills system, creating three complete skill suites: Design, Project Management, and Development. These weren\'t just scripts or shortcuts—they were specialized AI agents that could handle complex, multi-step tasks autonomously.',
    order: 4,
  },
  {
    _id: 'timelinePhase-production-projects',
    _type: 'timelinePhase',
    phase: 'Fall 2024',
    title: 'Production Projects',
    description: 'Since March 2024, I\'ve generated over 1,000 GitHub commits across 30+ projects. The variety is remarkable: AI-powered specialized agents, autonomous analyzers, RAG-powered retrieval systems, full-stack applications, mobile apps, marketing websites, and developer tools.',
    order: 5,
  },
  {
    _id: 'timelinePhase-continuous-evolution',
    _type: 'timelinePhase',
    phase: 'Present',
    title: 'Continuous Evolution',
    description: 'The workflow continues to evolve with each project, incorporating new patterns and capabilities. I\'m now documenting these skills publicly and building specialized subagents that others can benefit from.',
    order: 6,
  },
]

// Main AI Workflow showcase document
const aiWorkflowShowcase = {
  _id: 'aiShowcase-ai-workflow',
  _type: 'aiShowcase',
  title: 'My AI Workflow: Building Production Software with Claude Code',
  slug: createSlug('ai-workflow'),
  category: 'ai-workflow',
  featured: true,
  order: 1,

  heroSection: {
    badge: 'AI Workflow Showcase',
    title: 'My AI Workflow: Building Production Software with Claude Code',
    subtitle: 'From product manager to full-stack developer: How AI-assisted development changed everything about building software',
    summary: 'The "oh shit" moment came while building a D&D tracker with my 11-year-old son—we created a functional app in under an hour. That breakthrough crystallized a fundamental shift: what once took a year to build could now be accomplished in days or weeks with AI assistance. This is the story of discovering, refining, and productionizing an AI-powered development workflow that\'s shipped 30+ projects and generated 1000+ commits since March 2024.',
  },

  slides: [
    // Section 1: The "Oh Shit" Moment
    {
      _type: 'contentSlide',
      heading: 'The "Oh Shit" Moment',
      content: [
        {
          _type: 'block',
          children: [{
            _type: 'span',
            text: 'Traditional software development timelines were fundamentally changing, and I almost missed it. For years, I\'d said it took about a year to build anything complex for clients—research, strategy, design, prototyping, and full development. That timeline felt immutable, grounded in reality from dozens of projects. But in early 2024, something shifted.'
          }]
        },
        {
          _type: 'block',
          children: [{
            _type: 'span',
            text: 'The catalyst was deceptively simple: I wanted to build a voice-activated kitchen timer that didn\'t connect to the internet. I built a prototype in Replit in about an hour. It wasn\'t quite usable—it needed more work—but it was surprisingly close to functional. That got my attention, but I didn\'t fully grasp the implications yet.'
          }]
        },
        {
          _type: 'block',
          children: [{
            _type: 'span',
            text: 'The real revelation came when working with my 11-year-old son, who loves Dungeons & Dragons. Within an hour, we had something genuinely useful—something I could actually use in our games. It\'s called Dungeon Tracker and is available on my GitHub.'
          }]
        },
      ],
      quoteBox: {
        quote: 'This was my "oh shit" moment. Seeing how fast AI could produce not just a prototype but actually usable software made me realize that the year-long timeline I\'d always quoted was about to change dramatically.',
        attribution: '— On building Dungeon Tracker',
      },
    },

    // Section 3: The Methodology
    {
      _type: 'contentSlide',
      heading: 'How AI-Assisted Development Actually Works',
      content: [
        {
          _type: 'block',
          style: 'h3',
          children: [{ _type: 'span', text: 'Tech Stack Optimization' }]
        },
        {
          _type: 'block',
          children: [{
            _type: 'span',
            text: 'The foundation of reliable AI-assisted development starts with technology choices. TypeScript has become essential—not optional, but fundamental. The forced typing prevents an entire category of AI-generated errors. When AI doesn\'t keep everything in memory, it might use incorrect variable names. Without types, these mistakes only surface when production builds fail.'
          }]
        },
        {
          _type: 'block',
          children: [{
            _type: 'span',
            text: 'Single-page applications work better for AI development because they\'re easier for AI to maintain context. Next.js and React have proven ideal—they\'re modern, well-documented frameworks that AI understands deeply because they\'re widely used in training data.'
          }]
        },
      ],
      comparisonBoxes: [
        {
          label: 'Traditional Development',
          text: 'Complex projects: 1 year timeline. Multiple developers required. Manual implementation of every feature. Weeks to months for testing and QA.',
          stat: '1 Year',
          icon: '🐌',
        },
        {
          label: 'AI-Assisted Development',
          text: 'Complex projects: 6 weeks timeline. Single developer with AI assistance. Automated implementation with human oversight. Continuous testing integrated.',
          stat: '6 Weeks',
          icon: '🚀',
        },
      ],
    },

    // Section 4: The Tools
    {
      _type: 'contentSlide',
      heading: 'Claude Code and the Skills Ecosystem',
      content: [
        {
          _type: 'block',
          children: [{
            _type: 'span',
            text: 'Claude Code emerged as the most powerful, fastest, and most reliable AI coding assistant after extensive testing. It runs in the terminal, providing access to all files and CLI tools, which proves faster than VS Code plugins and more flexible than browser-based solutions.'
          }]
        },
        {
          _type: 'block',
          children: [{
            _type: 'span',
            text: 'What sets Claude Code apart isn\'t just raw capability—it\'s autonomous reliability. Claude Code makes fewer mistakes than alternatives and works best when given complex, multi-step tasks to complete independently.'
          }]
        },
        {
          _type: 'block',
          style: 'h3',
          children: [{ _type: 'span', text: 'Custom Skills Built' }]
        },
        {
          _type: 'block',
          children: [{
            _type: 'span',
            text: 'Over months of development, I\'ve built comprehensive skill suites: Project Analyzer (scans TODOs with 90%+ confidence), Project Manager (GitHub integration with screenshots), Project Planner (discovers features from code), plus complete Design and Development suites.'
          }]
        },
      ],
      techPills: [
        'Claude Code',
        'TypeScript',
        'Next.js',
        'React',
        'Git',
        'Playwright',
        'VS Code',
        'Terminal',
        'Custom Skills',
        'Memory Bank',
      ],
    },

    // Section 5: Quantifiable Impact
    {
      _type: 'contentSlide',
      heading: 'The Numbers Behind the Transformation',
      content: [
        {
          _type: 'block',
          style: 'h3',
          children: [{ _type: 'span', text: 'Development Speed' }]
        },
        {
          _type: 'block',
          children: [{
            _type: 'span',
            text: 'The speed improvements are difficult to overstate. Implementing Sanity CMS—a task that previously took a month with multiple developers—now takes less than a week. A reasonable prototype of a functional app now takes less than an hour. Full production applications still take weeks, but what took a year now takes six weeks.'
          }]
        },
        {
          _type: 'block',
          style: 'h3',
          children: [{ _type: 'span', text: 'Productivity Metrics' }]
        },
        {
          _type: 'block',
          children: [{
            _type: 'span',
            text: 'Since March 2024, I\'ve generated over 1,000 GitHub commits across 30+ projects. The variety is remarkable: AI-powered specialized agents, autonomous analyzers, RAG-powered retrieval systems, full-stack applications, mobile apps, marketing websites, and developer tools.'
          }]
        },
      ],
    },

    // Section 6: The Philosophy
    {
      _type: 'contentSlide',
      heading: 'Principles That Guide the Work',
      content: [
        {
          _type: 'block',
          style: 'h3',
          children: [{ _type: 'span', text: 'AI-First Design' }]
        },
        {
          _type: 'block',
          children: [{
            _type: 'span',
            text: 'Every software project should leverage AI to enhance capabilities—not as an afterthought, but as a core architectural decision from day one. This means choosing TypeScript for better AI error detection, favoring single-page applications for easier AI context management, and building skills that encode best practices.'
          }]
        },
        {
          _type: 'block',
          style: 'h3',
          children: [{ _type: 'span', text: 'Verification is Essential' }]
        },
        {
          _type: 'block',
          children: [{
            _type: 'span',
            text: 'AI can work autonomously for extended periods, but human verification remains absolutely necessary. I read every significant change AI makes, scrolling through code to understand what it did and catch mistakes before they compound. This verification isn\'t busywork—it\'s where human judgment adds irreplaceable value.'
          }]
        },
        {
          _type: 'block',
          style: 'h3',
          children: [{ _type: 'span', text: 'The English Major Advantage' }]
        },
        {
          _type: 'block',
          children: [{
            _type: 'span',
            text: 'Surprisingly, my English degree pays dividends in AI-assisted development. Specificity in language matters enormously—the ability to choose precise words, understand context, and communicate clearly makes AI dramatically more effective. Technical knowledge is learnable; clarity of communication is harder to develop but more valuable when working with AI.'
          }]
        },
      ],
    },
  ],

  horizontalSectionLabel: 'Phase 02 — Evolution',
  horizontalSectionHeading: 'The Journey from Experimentation to Production',

  // Reference to timeline phases
  timelinePhases: timelinePhases.map(phase => createReference(phase._id, 'timelinePhase')),

  metrics: [
    { value: '1000+', label: 'GitHub Commits', description: 'Since March 2024' },
    { value: '30+', label: 'Projects Shipped', description: 'AI-powered applications' },
    { value: '< 1 Week', label: 'Sanity CMS Setup', description: 'Previously 1 month' },
    { value: '< 1 Hour', label: 'Functional Prototype', description: 'Dungeon Tracker example' },
    { value: '3-6x', label: 'Speed Increase', description: 'vs traditional development' },
    { value: '90%+', label: 'Confidence Score', description: 'Project Analyzer accuracy' },
  ],

  callToAction: {
    text: 'View More AI Projects',
    link: '/ai-projects',
  },
}

// Import function
async function importAIWorkflow() {
  console.log('🚀 Starting AI Workflow showcase import...\n')

  try {
    // Import timeline phases first
    console.log('📝 Importing timeline phases...')
    for (const phase of timelinePhases) {
      await createOrUpdateDocument(phase)
      console.log(`  ✓ Created: ${phase.title} (${phase.phase})`)
    }
    console.log()

    // Import main showcase document
    console.log('📝 Importing AI Workflow showcase...')
    await createOrUpdateDocument(aiWorkflowShowcase)
    console.log(`  ✓ Created: ${aiWorkflowShowcase.title}`)
    console.log()

    console.log('✅ AI Workflow showcase import completed successfully!')
  } catch (error) {
    console.error('❌ Error importing AI Workflow showcase:', error)
    throw error
  }
}

// Run import
importAIWorkflow()
  .then(() => {
    console.log('\n🎉 Import finished!')
    process.exit(0)
  })
  .catch((error) => {
    console.error('\n💥 Import failed:', error)
    process.exit(1)
  })
