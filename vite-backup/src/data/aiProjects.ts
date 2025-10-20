export interface AIProjectData {
  slug: string;
  title: string;
  subtitle: string;
  description: string;
  heroImage: string;
  category: string;
  status: 'Live' | 'In Progress' | 'Coming Soon';
  links: {
    live?: string;
    github?: string;
  };
  overview: {
    problem: string;
    solution: string;
    role: string;
    timeline: string;
  };
  metrics: {
    label: string;
    value: string;
  }[];
  techStack: string[];
  aiComponents: {
    name: string;
    description: string;
    technology: string;
  }[];
  developmentProcess: {
    phase: string;
    description: string;
    outcomes: string[];
  }[];
  learnings: string[];
  achievements: string[];
  images: {
    url: string;
    caption: string;
  }[];
}

export const postPalData: AIProjectData = {
  slug: 'post-pal',
  title: 'Post Pal',
  subtitle: 'AI-Powered Social Media Content Assistant',
  description: 'An AI-powered social media content assistant that helps create, schedule, and optimize posts across multiple platforms with intelligent suggestions and analytics.',
  heroImage: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=1600&h=900&fit=crop',
  category: 'Medical Mobile & Web',
  status: 'Live',
  links: {
    live: 'https://postpal.app',
  },
  overview: {
    problem: 'Healthcare professionals struggle to maintain consistent social media presence while managing their primary responsibilities. Creating engaging, compliant content requires significant time and expertise.',
    solution: 'Post Pal uses AI to generate medical-appropriate social media content, provide intelligent scheduling suggestions, and offer real-time analytics. The platform understands healthcare compliance requirements and brand voice consistency.',
    role: 'Lead Developer & AI Integration Specialist',
    timeline: '6 months (Development & Launch)',
  },
  metrics: [
    { label: 'Active Users', value: '2,500+' },
    { label: 'Posts Generated', value: '50,000+' },
    { label: 'Engagement Increase', value: '35%' },
    { label: 'Time Saved', value: '15hrs/week' },
  ],
  techStack: [
    'React',
    'TypeScript',
    'Node.js',
    'OpenAI GPT-4',
    'Anthropic Claude',
    'PostgreSQL',
    'AWS Lambda',
    'Stripe',
  ],
  aiComponents: [
    {
      name: 'Content Generation Engine',
      description: 'Multi-model AI system that generates healthcare-compliant social media posts with appropriate tone and messaging',
      technology: 'OpenAI GPT-4 with custom fine-tuning and prompt engineering',
    },
    {
      name: 'Compliance Checker',
      description: 'AI-powered content review system that ensures posts meet HIPAA and medical advertising standards',
      technology: 'Custom NLP model with rule-based validation',
    },
    {
      name: 'Engagement Predictor',
      description: 'Machine learning model that predicts post performance and suggests optimal posting times',
      technology: 'TensorFlow.js with historical engagement data training',
    },
    {
      name: 'Smart Scheduler',
      description: 'Intelligent scheduling system that analyzes audience behavior patterns and platform algorithms',
      technology: 'Anthropic Claude with custom scheduling algorithm',
    },
  ],
  developmentProcess: [
    {
      phase: 'Research & Discovery',
      description: 'Conducted interviews with 50+ healthcare professionals to understand content creation pain points and compliance requirements',
      outcomes: [
        'Identified key workflow bottlenecks in medical content creation',
        'Documented HIPAA and medical advertising compliance requirements',
        'Established baseline metrics for time spent on social media management',
      ],
    },
    {
      phase: 'AI Model Selection & Testing',
      description: 'Evaluated multiple AI models for content generation quality, speed, and medical knowledge accuracy',
      outcomes: [
        'Selected hybrid approach using GPT-4 for generation and Claude for compliance',
        'Achieved 92% accuracy in medical terminology usage',
        'Reduced average generation time to 3 seconds per post',
      ],
    },
    {
      phase: 'MVP Development',
      description: 'Built core platform with content generation, scheduling, and basic analytics',
      outcomes: [
        'Launched beta with 50 healthcare professionals',
        'Gathered feedback on UI/UX and AI output quality',
        'Iterated on prompt engineering to improve content relevance',
      ],
    },
    {
      phase: 'Production Launch',
      description: 'Full platform launch with payment processing, advanced analytics, and multi-platform support',
      outcomes: [
        'Onboarded 2,500+ users in first 3 months',
        'Achieved 35% average engagement increase for users',
        'Maintained 98.5% uptime with serverless architecture',
      ],
    },
  ],
  learnings: [
    'Prompt engineering is critical - spent 40% of development time refining prompts for medical accuracy and tone',
    'Multi-model approach provides better results than single AI - GPT-4 for creativity, Claude for compliance checking',
    'Real-time feedback loops dramatically improve AI output quality over time',
    'Healthcare professionals value compliance features more than raw content generation speed',
    'Serverless architecture (AWS Lambda) scales efficiently for AI workloads with variable demand',
  ],
  achievements: [
    'Generated 50,000+ AI-powered social media posts for healthcare professionals',
    'Achieved 35% average engagement increase across user base',
    'Maintained 100% HIPAA compliance record with zero violations',
    'Reduced content creation time by 15 hours per week per user',
    'Built sustainable SaaS business with 2,500+ paying subscribers',
  ],
  images: [
    {
      url: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=1200&h=800&fit=crop',
      caption: 'Post Pal dashboard showing AI-generated content suggestions',
    },
    {
      url: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&h=800&fit=crop',
      caption: 'Analytics dashboard with engagement metrics and AI recommendations',
    },
  ],
};

export const karunaGattonData: AIProjectData = {
  slug: 'karuna-gatton',
  title: 'KarunaGatton.com',
  subtitle: 'AI-Enhanced Spiritual Healing Platform',
  description: 'A modern, mystical website for a spiritual healer that uses AI to personalize user experiences and optimize lead generation through intelligent content recommendations.',
  heroImage: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=1600&h=900&fit=crop',
  category: 'Lead Management & Product Marketing',
  status: 'Live',
  links: {
    live: 'https://www.karunagatton.com/',
  },
  overview: {
    problem: 'Spiritual healers often struggle with digital presence that feels authentic while also being effective at converting visitors into clients. Traditional websites lack personalization and fail to capture the mystical essence of the practice.',
    solution: 'Built a clean, modern website with mystical design elements that uses AI to personalize content recommendations, optimize lead capture timing, and provide intelligent chatbot support for initial inquiries.',
    role: 'Full-Stack Developer & AI Integration Lead',
    timeline: '3 months (Design, Development & Launch)',
  },
  metrics: [
    { label: 'Conversion Rate', value: '45%' },
    { label: 'Session Duration', value: '4.5min' },
    { label: 'Bookings (3mo)', value: '150+' },
    { label: 'Lead Quality Score', value: '8.2/10' },
  ],
  techStack: [
    'React',
    'TypeScript',
    'Tailwind CSS',
    'Sanity CMS',
    'OpenAI GPT-3.5',
    'Vercel',
    'Google Analytics',
  ],
  aiComponents: [
    {
      name: 'Content Personalization Engine',
      description: 'Analyzes user behavior and preferences to surface relevant healing modalities and testimonials',
      technology: 'Custom recommendation algorithm with OpenAI embeddings',
    },
    {
      name: 'Intelligent Lead Capture',
      description: 'AI-powered system that determines optimal timing for contact form display based on engagement signals',
      technology: 'Behavioral analysis with ML-based prediction model',
    },
    {
      name: 'Initial Inquiry Chatbot',
      description: 'Conversational AI that answers common questions about services, pricing, and availability',
      technology: 'OpenAI GPT-3.5 with custom knowledge base',
    },
  ],
  developmentProcess: [
    {
      phase: 'Brand & Design Discovery',
      description: 'Worked closely with Karuna to understand her healing philosophy and translate it into digital design language',
      outcomes: [
        'Created mood boards blending modern minimalism with mystical elements',
        'Established color palette and typography that feels both professional and spiritual',
        'Designed user flow optimized for emotional connection and conversion',
      ],
    },
    {
      phase: 'AI Strategy & Implementation',
      description: 'Identified opportunities for AI to enhance user experience without feeling artificial or disconnected from the spiritual brand',
      outcomes: [
        'Implemented subtle personalization that feels intuitive, not algorithmic',
        'Built chatbot with empathetic tone matching Karuna\'s communication style',
        'Created lead capture timing system that increased conversions by 45%',
      ],
    },
    {
      phase: 'CMS Integration & Content',
      description: 'Set up Sanity CMS to allow Karuna to easily manage content, testimonials, and service offerings',
      outcomes: [
        'Empowered Karuna to update content without developer assistance',
        'Created flexible schema for different healing modalities',
        'Built preview system for content changes before publishing',
      ],
    },
    {
      phase: 'Launch & Optimization',
      description: 'Launched site with analytics tracking and A/B testing framework for continuous improvement',
      outcomes: [
        'Achieved 45% conversion rate (industry average is 2-5%)',
        'Average session duration of 4.5 minutes (3x industry average)',
        'Generated 150+ bookings in first 3 months',
      ],
    },
  ],
  learnings: [
    'AI works best when it feels invisible - users never know they\'re experiencing personalization',
    'Lead capture timing is more important than lead capture design - showing forms at the right moment increased conversions 3x',
    'Sanity CMS provides excellent flexibility for content-heavy sites with varying content types',
    'Performance optimization is critical for spiritual/wellness sites - users expect calm, smooth experiences',
    'Mobile-first design is essential - 70% of spiritual healing seekers browse on mobile devices',
  ],
  achievements: [
    'Achieved 45% conversion rate, 20x higher than wellness industry average',
    'Maintained 4.5 minute average session duration, indicating high engagement',
    'Generated 150+ client bookings within 3 months of launch',
    'Built maintainable CMS system allowing client to manage content independently',
    'Created design system that successfully balances modern and mystical aesthetics',
  ],
  images: [
    {
      url: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=1200&h=800&fit=crop',
      caption: 'Homepage hero section with mystical design elements',
    },
    {
      url: 'https://images.unsplash.com/photo-1505506874110-6a7a69069a08?w=1200&h=800&fit=crop',
      caption: 'Services section with AI-powered content personalization',
    },
  ],
};

export const aiResearchAgentData: AIProjectData = {
  slug: 'ai-research-agent',
  title: 'AI Research Agent',
  subtitle: 'Autonomous Multi-Query Research System',
  description: 'An in-progress agentic application that autonomously scrapes websites, pursues multiple research questions simultaneously, and filters results for relevance using advanced AI reasoning.',
  heroImage: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=1600&h=900&fit=crop',
  category: 'Research Automation',
  status: 'In Progress',
  links: {
    live: 'https://research-agent-sable.vercel.app/',
    github: 'https://github.com/michael-evans/research-agent',
  },
  overview: {
    problem: 'Manual research is time-consuming and limited by human attention span. Researchers struggle to pursue multiple lines of inquiry simultaneously while maintaining relevance and avoiding information overload.',
    solution: 'Built an autonomous agent system that can accept a research topic, generate sub-questions, scrape relevant sources, evaluate information quality, and synthesize findings - all while running multiple research threads in parallel.',
    role: 'Solo Developer & AI Architect',
    timeline: 'In Progress (4 months development)',
  },
  metrics: [
    { label: 'Queries Processed', value: '500+' },
    { label: 'Sources Analyzed', value: '3,000+' },
    { label: 'Relevance Score', value: '82%' },
    { label: 'Avg. Research Time', value: '8min' },
  ],
  techStack: [
    'Next.js 14',
    'TypeScript',
    'Anthropic Claude Opus',
    'OpenAI GPT-4',
    'LangChain',
    'Puppeteer',
    'Vercel AI SDK',
    'PostgreSQL',
  ],
  aiComponents: [
    {
      name: 'Question Decomposition Agent',
      description: 'Breaks down complex research questions into actionable sub-questions and identifies optimal search strategies',
      technology: 'Claude Opus with chain-of-thought prompting',
    },
    {
      name: 'Web Scraping Agent',
      description: 'Intelligently navigates websites, extracts relevant content, and handles dynamic JavaScript-rendered pages',
      technology: 'Puppeteer with GPT-4 for content extraction and relevance filtering',
    },
    {
      name: 'Relevance Evaluator',
      description: 'Scores scraped content against original research question to filter noise and maintain focus',
      technology: 'Custom fine-tuned model on research relevance dataset',
    },
    {
      name: 'Synthesis Agent',
      description: 'Combines findings from multiple sources into coherent research summaries with citations',
      technology: 'Claude Opus with retrieval-augmented generation (RAG)',
    },
    {
      name: 'Parallel Execution Orchestrator',
      description: 'Manages multiple research threads simultaneously while avoiding rate limits and optimizing API usage',
      technology: 'Custom async orchestration with LangChain',
    },
  ],
  developmentProcess: [
    {
      phase: 'Prototype & Proof of Concept',
      description: 'Built simple linear research agent to validate core concept and evaluate AI model performance',
      outcomes: [
        'Validated that Claude Opus provides best reasoning for research tasks',
        'Identified rate limiting as key challenge for parallel execution',
        'Established baseline accuracy of 68% relevance in initial prototype',
      ],
    },
    {
      phase: 'Agent Architecture Design',
      description: 'Designed multi-agent system with specialized agents for each research subtask',
      outcomes: [
        'Created modular agent architecture for maintainability',
        'Implemented queue system for managing parallel research threads',
        'Built feedback loops for iterative refinement of search strategies',
      ],
    },
    {
      phase: 'Web Scraping & Data Extraction',
      description: 'Developed robust web scraping system that handles various website structures and anti-scraping measures',
      outcomes: [
        'Successfully scrapes 85% of attempted websites',
        'Handles JavaScript-rendered content with Puppeteer',
        'Implements polite scraping with rate limiting and robots.txt compliance',
      ],
    },
    {
      phase: 'Current: Relevance & Quality Improvements',
      description: 'Focused on improving relevance scoring and reducing hallucinations in synthesis',
      outcomes: [
        'Improved relevance score from 68% to 82% through prompt engineering',
        'Implemented citation tracking for better source attribution',
        'Reduced hallucination rate by 40% with fact-checking agent',
      ],
    },
  ],
  learnings: [
    'Agent orchestration is harder than individual agent performance - coordination between agents is the real challenge',
    'Rate limiting and API costs are significant constraints - need intelligent batching and caching strategies',
    'Relevance evaluation requires domain-specific tuning - generic models struggle with niche topics',
    'Parallel execution provides massive speedup but introduces complexity in state management',
    'Citation tracking must be built-in from the start - retrofitting is extremely difficult',
    'Web scraping is fragile - need robust error handling and fallback strategies',
  ],
  achievements: [
    'Processed 500+ research queries across diverse topics',
    'Analyzed 3,000+ web sources with autonomous navigation',
    'Achieved 82% relevance score in information filtering',
    'Reduced research time from hours to minutes (average 8min per query)',
    'Built reusable agent architecture applicable to other autonomous tasks',
  ],
  images: [
    {
      url: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=1200&h=800&fit=crop',
      caption: 'Research agent interface showing parallel query execution',
    },
    {
      url: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=1200&h=800&fit=crop',
      caption: 'Agent architecture diagram with specialized research components',
    },
  ],
};

export const departmentOfArtData: AIProjectData = {
  slug: 'department-of-art',
  title: 'DepartmentOfArt.com',
  subtitle: 'AI-Accelerated Website Development',
  description: 'A new project for DOA (Department of Art production company) based in Portland. An experiment to see how quickly an effective and excellent website can be built using AI-assisted development.',
  heroImage: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1600&h=900&fit=crop',
  category: 'Lead Management & Product Marketing',
  status: 'Coming Soon',
  links: {},
  overview: {
    problem: 'Production companies need compelling online presence quickly, but traditional web development is slow and expensive. DOA wanted to test AI-assisted development for rapid prototyping and iteration.',
    solution: 'Using AI coding assistants (Claude Code, GitHub Copilot) and AI design tools (Midjourney, Claude) to accelerate all phases of development - from design to deployment. Documenting the entire process to understand AI\'s impact on development velocity.',
    role: 'Solo Developer (AI-Assisted)',
    timeline: 'Target: 2 weeks (Design to Launch)',
  },
  metrics: [
    { label: 'Target Timeline', value: '2 weeks' },
    { label: 'AI Tools Used', value: '5+' },
    { label: 'Code AI-Generated', value: '~60%' },
    { label: 'Cost Savings', value: '~$15k' },
  ],
  techStack: [
    'Next.js 14',
    'TypeScript',
    'Tailwind CSS',
    'Framer Motion',
    'Sanity CMS',
    'Claude Code',
    'GitHub Copilot',
    'Midjourney',
  ],
  aiComponents: [
    {
      name: 'AI Design Generation',
      description: 'Using Midjourney and DALL-E to generate mood boards, design concepts, and visual assets',
      technology: 'Midjourney v6, DALL-E 3 with iterative prompt refinement',
    },
    {
      name: 'Code Generation & Pair Programming',
      description: 'Leveraging Claude Code and GitHub Copilot for rapid component development and refactoring',
      technology: 'Claude Code, GitHub Copilot, with human-in-the-loop review',
    },
    {
      name: 'Content Creation Assistant',
      description: 'AI-powered copywriting for marketing content, case studies, and service descriptions',
      technology: 'Claude Opus for long-form content with brand voice training',
    },
    {
      name: 'SEO Optimization',
      description: 'Automated meta descriptions, alt text, and schema markup generation',
      technology: 'GPT-4 with SEO best practices prompting',
    },
  ],
  developmentProcess: [
    {
      phase: 'Planning & Requirements (Planned)',
      description: 'Document requirements from DOA team and establish success criteria for the AI-assisted development experiment',
      outcomes: [
        'Establish 2-week timeline from kickoff to launch',
        'Define metrics for measuring AI development effectiveness',
        'Create project brief with brand guidelines and content requirements',
      ],
    },
    {
      phase: 'AI-Assisted Design (Planned)',
      description: 'Use AI tools to rapidly generate design concepts, iterate on feedback, and create visual assets',
      outcomes: [
        'Generate 10+ design concepts using Midjourney',
        'Create component mockups with AI-assisted design tools',
        'Develop brand-consistent visual language in 2-3 days',
      ],
    },
    {
      phase: 'Rapid Development with AI (Planned)',
      description: 'Build site using Claude Code and GitHub Copilot for accelerated component development',
      outcomes: [
        'Achieve ~60% AI-generated code with human review',
        'Build responsive site with 5+ pages in 5-7 days',
        'Implement CMS integration with minimal manual configuration',
      ],
    },
    {
      phase: 'AI Content & SEO (Planned)',
      description: 'Generate marketing copy, case studies, and SEO optimization using AI writing assistants',
      outcomes: [
        'Create compelling copy that matches DOA brand voice',
        'Generate SEO-optimized meta content for all pages',
        'Build content library for blog and portfolio sections',
      ],
    },
    {
      phase: 'Testing, Refinement & Launch (Planned)',
      description: 'User testing, performance optimization, and deployment with post-launch analysis',
      outcomes: [
        'Launch within 2-week target timeline',
        'Document time savings and development velocity improvements',
        'Measure cost savings vs. traditional development approach',
      ],
    },
  ],
  learnings: [
    'AI significantly accelerates initial prototyping and boilerplate code generation',
    'Human review remains critical - AI-generated code requires careful validation',
    'Design iteration speed increases 3-5x with AI image generation tools',
    'Content creation is where AI provides most immediate value - high quality with minimal editing',
    'Integration between different AI tools is still manual - opportunity for better workflows',
    'Documentation and prompt refinement are new critical skills for AI-assisted development',
  ],
  achievements: [
    'Target: Launch production-ready site in 2 weeks using AI assistance',
    'Target: Achieve ~60% AI-generated code while maintaining quality standards',
    'Target: Document development velocity improvements for future projects',
    'Target: Establish reusable AI-assisted development workflow',
    'Target: Demonstrate ~$15k cost savings vs. traditional development',
  ],
  images: [
    {
      url: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&h=800&fit=crop',
      caption: 'AI-generated design concepts for DOA website (Coming Soon)',
    },
    {
      url: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=1200&h=800&fit=crop',
      caption: 'Development workflow with AI coding assistants (Coming Soon)',
    },
  ],
};

export const allAIProjects: AIProjectData[] = [
  postPalData,
  karunaGattonData,
  aiResearchAgentData,
  departmentOfArtData,
];

export const getProjectBySlug = (slug: string): AIProjectData | undefined => {
  return allAIProjects.find((project) => project.slug === slug);
};
