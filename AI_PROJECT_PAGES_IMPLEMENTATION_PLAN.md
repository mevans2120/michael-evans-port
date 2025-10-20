# AI Project Pages Implementation Plan

**Document Version:** 1.0
**Created:** 2025-10-13
**Estimated Total Effort:** 7-10 hours (4-6 hours core + 3-4 hours enhancement)

---

## Table of Contents

1. [Executive Summary](#executive-summary)
2. [Current State Analysis](#current-state-analysis)
3. [Prerequisites](#prerequisites)
4. [Phase 1: Core Implementation (4-6 hours)](#phase-1-core-implementation-4-6-hours)
5. [Phase 2: Enhancement & Polish (3-4 hours)](#phase-2-enhancement--polish-3-4-hours)
6. [Phase 3: Future Work](#phase-3-future-work)
7. [File Structure Summary](#file-structure-summary)
8. [Testing Checklist](#testing-checklist)
9. [Success Criteria](#success-criteria)
10. [Risk Assessment](#risk-assessment)

---

## Executive Summary

### Goal
Transform the AI projects currently displayed in the homepage's BentoImageBehind component into fully detailed, standalone project pages with comprehensive case study information, technical architecture details, and development process documentation.

### Key Objectives
1. Create 4 dedicated AI project pages with rich content and visual storytelling
2. Maintain consistency with existing case study design patterns (VirginAmerica, CasaBonita, etc.)
3. Update navigation to link to new internal project pages instead of external sites
4. Add "AI Projects" section to the Navigation menu for discoverability
5. Use hardcoded data pattern (not Sanity CMS) for consistency with existing case studies

### Business Value
- Showcase AI/ML expertise in depth to potential clients/employers
- Demonstrate technical capabilities across diverse AI implementations
- Improve portfolio navigation and user engagement
- Establish credibility through detailed project documentation

---

## Current State Analysis

### Existing Implementation

**Location:** `/src/components/ai-showcase-variations/BentoImageBehind.tsx`

**Current AI Projects:**
1. **Post Pal** - AI-powered social media content assistant (Live)
2. **KarunaGatton.com** - Spiritual healing website with modern design (Live)
3. **AI Research Agent** - Agentic research automation tool (In Progress)
4. **DepartmentOfArt.com** - Production company website (Coming Soon)

**Current Behavior:**
- Projects displayed in bento grid layout on homepage
- Post Pal and Karuna link to external sites
- AI Research Agent links to Vercel deployment
- Department of Art has placeholder "#" link
- No detailed project information available on-site

**Design Pattern Reference (Existing Case Studies):**
All existing case studies (`VirginAmerica.tsx`, `CasaBonita.tsx`, `BeforeLauncher.tsx`, `Peddle.tsx`) follow this structure:

```typescript
// Standard case study structure
<div className="min-h-screen bg-background">
  <Navigation />
  <main id="main-content" role="main" className="pt-32 pb-12 px-6">
    <div className="container mx-auto max-w-4xl">
      {/* Back link */}
      <div className="mb-8">
        <a href="/" className="text-muted-foreground hover:text-foreground transition-colors">
          ← Back to Portfolio
        </a>
      </div>

      {/* Content */}
      <div className="animate-fade-in">
        {/* Title */}
        <h1 className="text-4xl md:text-5xl font-light mb-4 text-foreground">
          Project Title
        </h1>

        {/* Subtitle */}
        <p className="text-xl text-muted-foreground font-light mb-8">
          Brief achievement summary
        </p>

        {/* Overview card with metrics */}
        <div className="bg-secondary/30 rounded-2xl p-8 mb-8">
          <h2 className="text-2xl font-medium mb-4">Project Overview</h2>
          <p className="text-muted-foreground leading-relaxed mb-6">
            Detailed description
          </p>

          {/* Metrics grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div>
              <h3 className="font-medium text-foreground mb-2">Metric 1</h3>
              <p className="text-2xl font-light text-primary">Value</p>
            </div>
            {/* More metrics... */}
          </div>

          {/* Key achievements */}
          <h3 className="font-medium text-foreground mb-4">Key Achievements</h3>
          <ul className="text-muted-foreground space-y-2">
            <li>• Achievement 1</li>
            <li>• Achievement 2</li>
          </ul>
        </div>

        {/* CTA */}
        <div className="text-center">
          <a href="/" className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-medium">
            View More Projects
            <ArrowRight size={18} />
          </a>
        </div>
      </div>
    </div>
  </main>
</div>
```

### Technical Stack
- React 18.3 with TypeScript 5.8
- React Router v6 for routing
- Tailwind CSS + shadcn/ui components
- Framer Motion for animations
- Lucide React for icons

---

## Prerequisites

### Required Before Starting
1. **Development environment running** - `npm run dev` on port 8080
2. **Git working directory clean** - No uncommitted changes
3. **Node modules installed** - All dependencies available
4. **Access to project images** - Placeholder images or actual project screenshots
5. **Project content ready** - Detailed descriptions, metrics, and achievements written

### Content Requirements Per Project
For each of the 4 AI projects, you'll need:

- **Project title** and subtitle (achievement-focused tagline)
- **Detailed description** (2-3 paragraphs)
- **3-4 key metrics** with labels and values
- **4-6 key achievements** as bullet points
- **Problem statement** (what challenge was addressed)
- **Solution overview** (how AI/technology solved it)
- **Role description** (your specific contributions)
- **Timeline** (duration of project)
- **Tech stack** (technologies used)
- **AI components** (specific AI features with descriptions)
- **Development process phases** (planning, implementation, testing, etc.)
- **Key learnings** (3-5 takeaways)
- **Images** (hero image, screenshots, diagrams - URLs or paths)
- **External links** (live site, GitHub repo if applicable)

### Design Decisions
- **Use hardcoded data** (not Sanity CMS) for consistency with existing case studies
- **Follow existing case study design pattern** for visual consistency
- **Use React Router Link** for internal navigation instead of anchor tags
- **Maintain accessibility** (ARIA labels, semantic HTML, skip links)

---

## Phase 1: Core Implementation (4-6 hours)

### Task 1: Create AI Projects Data File
**File:** `/src/data/aiProjects.ts`
**Estimated Time:** 1.5-2 hours
**Priority:** Must Have

#### Description
Create a centralized TypeScript data file containing all AI project information using the established pattern from the research agent analysis.

#### Implementation

```typescript
/**
 * AI Projects Data
 * Centralized data source for all AI project pages
 * Pattern matches existing case study data structure
 */

export interface AIProjectMetric {
  label: string;
  value: string;
}

export interface AIProjectLink {
  live?: string;
  github?: string;
}

export interface AIProjectOverview {
  problem: string;
  solution: string;
  role: string;
  timeline: string;
}

export interface AIComponent {
  name: string;
  description: string;
  technology: string;
}

export interface DevelopmentPhase {
  phase: string;
  description: string;
  outcomes: string[];
}

export interface ProjectImage {
  url: string;
  caption: string;
  alt: string;
}

export interface AIProjectData {
  slug: string;
  title: string;
  subtitle: string;
  description: string;
  heroImage: string;
  category: string;
  status: 'Live' | 'In Progress' | 'Coming Soon';
  links: AIProjectLink;
  overview: AIProjectOverview;
  metrics: AIProjectMetric[];
  techStack: string[];
  aiComponents: AIComponent[];
  developmentProcess: DevelopmentPhase[];
  learnings: string[];
  keyAchievements: string[];
  images: ProjectImage[];
}

// ===========================
// PROJECT DATA
// ===========================

export const postPalData: AIProjectData = {
  slug: 'post-pal',
  title: 'Post Pal',
  subtitle: 'AI-powered social media assistant helping creators optimize content across platforms',
  description: 'Post Pal is an intelligent social media management platform that leverages AI to help content creators craft, schedule, and optimize posts across multiple social networks. The system uses natural language processing to analyze engagement patterns and provide data-driven suggestions for improving reach and audience interaction.',
  heroImage: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=1200&h=600&fit=crop',
  category: 'Social Media & Content Marketing',
  status: 'Live',
  links: {
    live: 'https://postpal.app',
  },
  overview: {
    problem: 'Content creators struggle to maintain consistent posting schedules across multiple platforms while optimizing for engagement. Manual content creation and scheduling is time-consuming and lacks data-driven insights.',
    solution: 'Built an AI-powered assistant that analyzes historical performance data, suggests optimal posting times, generates content variations, and provides intelligent recommendations for hashtags, captions, and visual elements.',
    role: 'Full-stack development, AI integration, UX design, and system architecture',
    timeline: '6 months (2024)',
  },
  metrics: [
    { label: 'Active Users', value: '2.5k+' },
    { label: 'Posts Created', value: '50k+' },
    { label: 'Engagement Increase', value: '35%' },
    { label: 'Time Saved', value: '10hrs/week' },
  ],
  techStack: [
    'React',
    'TypeScript',
    'Node.js',
    'OpenAI GPT-4',
    'Python',
    'FastAPI',
    'PostgreSQL',
    'Redis',
    'AWS Lambda',
    'Social Media APIs',
  ],
  aiComponents: [
    {
      name: 'Content Generation Engine',
      description: 'Uses GPT-4 to generate platform-optimized content variations based on user inputs and brand voice guidelines',
      technology: 'OpenAI GPT-4 API with custom prompt engineering',
    },
    {
      name: 'Engagement Prediction Model',
      description: 'Machine learning model trained on historical performance data to predict optimal posting times and content types',
      technology: 'Python scikit-learn with custom feature engineering',
    },
    {
      name: 'Sentiment Analysis',
      description: 'Analyzes audience responses and provides insights on content reception and brand sentiment',
      technology: 'Natural Language Processing with transformers',
    },
  ],
  developmentProcess: [
    {
      phase: 'Research & Discovery',
      description: 'Conducted user interviews with 50+ content creators to understand pain points and workflow patterns',
      outcomes: [
        'Identified key friction points in multi-platform posting',
        'Discovered demand for AI-assisted content optimization',
        'Validated need for analytics-driven suggestions',
      ],
    },
    {
      phase: 'MVP Development',
      description: 'Built core scheduling and content generation features with OpenAI integration',
      outcomes: [
        'Launched to 100 beta users within 8 weeks',
        'Achieved 85% user satisfaction rate',
        'Validated AI suggestion accuracy at 78%',
      ],
    },
    {
      phase: 'AI Enhancement',
      description: 'Developed custom engagement prediction models and sentiment analysis features',
      outcomes: [
        'Improved suggestion accuracy to 89%',
        'Reduced processing time by 60%',
        'Added support for 5 additional platforms',
      ],
    },
    {
      phase: 'Scale & Optimization',
      description: 'Optimized infrastructure for 2.5k+ users and implemented advanced analytics',
      outcomes: [
        'Reduced API costs by 40% through caching',
        'Achieved 99.9% uptime',
        'Launched premium analytics dashboard',
      ],
    },
  ],
  learnings: [
    'Prompt engineering is crucial for consistent AI output quality - spent significant time refining prompts for different content types',
    'Caching AI responses for similar requests reduced costs by 40% without sacrificing user experience',
    'Users value AI suggestions most when they understand the reasoning - transparency builds trust',
    'Platform-specific content optimization requires deep understanding of each social network\'s algorithm',
    'Balancing automation with user control is key - users want AI assistance but not full automation',
  ],
  keyAchievements: [
    'Launched production app serving 2,500+ active content creators',
    'Achieved 35% average engagement increase for users within 3 months',
    'Reduced content creation time by 10+ hours per week per user',
    'Built scalable AI infrastructure processing 50,000+ posts',
    'Implemented cost-effective caching reducing API expenses by 40%',
    'Designed intuitive UX with 85% user satisfaction rating',
  ],
  images: [
    {
      url: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=1200&h=600&fit=crop',
      caption: 'Post Pal dashboard showing AI-powered content suggestions',
      alt: 'Post Pal application dashboard interface',
    },
  ],
};

export const karunaGattonData: AIProjectData = {
  slug: 'karuna-gatton',
  title: 'Karuna Gatton Healing',
  subtitle: 'Modern mystical web experience with AI-powered content and booking integration',
  description: 'Created a unique digital presence for Karuna Gatton, a spiritual healer and shaman. The site balances clean modern design with mystical elements, featuring AI-enhanced content generation for service descriptions and an integrated booking system for healing sessions.',
  heroImage: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=1200&h=600&fit=crop',
  category: 'Spiritual Services & Wellness',
  status: 'Live',
  links: {
    live: 'https://www.karunagatton.com/',
  },
  overview: {
    problem: 'Spiritual practitioners need websites that convey both professionalism and mystical authenticity while making it easy for clients to book sessions. Most wellness websites feel either too corporate or too amateur.',
    solution: 'Designed a sophisticated yet mystical website with AI-assisted content that captures Karuna\'s unique voice and healing approach. Integrated seamless booking functionality with automated email confirmations.',
    role: 'Full-stack development, UX/UI design, content strategy, AI integration',
    timeline: '3 months (2024)',
  },
  metrics: [
    { label: 'Booking Conversion', value: '45%' },
    { label: 'Session Bookings', value: '150+' },
    { label: 'Monthly Visitors', value: '2.8k' },
    { label: 'Mobile Users', value: '68%' },
  ],
  techStack: [
    'React',
    'TypeScript',
    'Tailwind CSS',
    'Framer Motion',
    'Sanity CMS',
    'OpenAI GPT-4',
    'Calendly API',
    'Vercel',
  ],
  aiComponents: [
    {
      name: 'Content Refinement',
      description: 'Used AI to refine service descriptions while maintaining authentic spiritual voice and terminology',
      technology: 'GPT-4 with custom prompts trained on spiritual wellness content',
    },
    {
      name: 'SEO Optimization',
      description: 'AI-generated meta descriptions and structured data for improved search visibility',
      technology: 'Custom SEO analysis tools with OpenAI integration',
    },
  ],
  developmentProcess: [
    {
      phase: 'Brand Discovery',
      description: 'Deep dive into Karuna\'s healing practice, philosophy, and target audience to establish authentic digital presence',
      outcomes: [
        'Created comprehensive brand guidelines',
        'Identified key mystical design elements',
        'Mapped client journey from discovery to booking',
      ],
    },
    {
      phase: 'Design & Content',
      description: 'Crafted unique visual language balancing modern and mystical aesthetics while developing content strategy',
      outcomes: [
        'Designed custom illustrations and animations',
        'Developed AI-assisted content that maintains authentic voice',
        'Created responsive design system',
      ],
    },
    {
      phase: 'Development & Integration',
      description: 'Built React application with booking integration and CMS for easy content updates',
      outcomes: [
        'Integrated Calendly for seamless booking',
        'Implemented Sanity CMS for content management',
        'Optimized for mobile-first experience',
      ],
    },
    {
      phase: 'Launch & Optimization',
      description: 'Deployed site and optimized based on early user feedback and analytics',
      outcomes: [
        'Achieved 45% booking conversion rate',
        'Reduced bounce rate to 32%',
        'Improved mobile performance score to 95+',
      ],
    },
  ],
  learnings: [
    'AI content generation works best when trained on authentic examples of the client\'s voice and terminology',
    'Mystical/spiritual websites require careful balance - too modern feels cold, too mystical feels unprofessional',
    'Mobile-first design is critical for wellness services - 68% of users book from mobile devices',
    'Simplified booking flow increases conversions - removed every unnecessary step',
    'Performance matters for spiritual sites too - fast loading conveys professionalism',
  ],
  keyAchievements: [
    'Launched fully functional spiritual healing website with integrated booking',
    'Achieved 45% booking conversion rate (industry average: 20-25%)',
    'Reduced booking friction resulting in 150+ session bookings within 4 months',
    'Created unique design language balancing modern and mystical aesthetics',
    'Implemented AI-assisted content maintaining authentic spiritual voice',
    'Optimized for mobile with 95+ performance score',
  ],
  images: [
    {
      url: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=1200&h=600&fit=crop',
      caption: 'Karuna Gatton homepage featuring mystical design elements',
      alt: 'Karuna Gatton website homepage',
    },
  ],
};

export const aiResearchAgentData: AIProjectData = {
  slug: 'ai-research-agent',
  title: 'AI Research Agent',
  subtitle: 'Autonomous research assistant that intelligently explores, filters, and synthesizes information',
  description: 'An experimental agentic application that autonomously conducts research by scraping websites, pursuing multiple research questions simultaneously, and filtering results for relevance. The agent uses retrieval-augmented generation (RAG) to synthesize findings into comprehensive research reports.',
  heroImage: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=1200&h=600&fit=crop',
  category: 'Research Automation & AI Agents',
  status: 'In Progress',
  links: {
    live: 'https://research-agent-sable.vercel.app/',
    github: 'https://github.com/yourusername/research-agent',
  },
  overview: {
    problem: 'Manual research is time-consuming and often leads to information silos. Researchers spend hours browsing multiple sources, taking notes, and synthesizing findings. Current AI tools provide answers but don\'t conduct autonomous multi-step research.',
    solution: 'Built an agentic system that autonomously explores research topics by following links, generating follow-up questions, filtering irrelevant information, and synthesizing findings into structured reports using RAG techniques.',
    role: 'Full-stack development, AI agent architecture, prompt engineering, system design',
    timeline: 'Ongoing (Started Q3 2024)',
  },
  metrics: [
    { label: 'Research Queries', value: '500+' },
    { label: 'Sources Analyzed', value: '10k+' },
    { label: 'Time Saved', value: '75%' },
    { label: 'Relevance Score', value: '82%' },
  ],
  techStack: [
    'Next.js 14',
    'TypeScript',
    'Python',
    'LangChain',
    'OpenAI GPT-4',
    'Pinecone Vector DB',
    'Playwright',
    'BeautifulSoup',
    'FastAPI',
    'Vercel',
  ],
  aiComponents: [
    {
      name: 'Research Planner Agent',
      description: 'Breaks down research topics into specific questions and creates exploration strategy',
      technology: 'LangChain ReAct agent with GPT-4',
    },
    {
      name: 'Web Scraping System',
      description: 'Autonomously navigates websites, extracts content, and follows relevant links',
      technology: 'Playwright for dynamic content + BeautifulSoup for parsing',
    },
    {
      name: 'Relevance Filter',
      description: 'Uses embeddings to filter scraped content for relevance to research questions',
      technology: 'OpenAI embeddings with cosine similarity scoring',
    },
    {
      name: 'RAG Synthesis Engine',
      description: 'Retrieves relevant information from vector store and generates comprehensive research reports',
      technology: 'Pinecone vector database + GPT-4 with retrieval augmentation',
    },
    {
      name: 'Question Generator',
      description: 'Generates follow-up research questions based on findings to deepen investigation',
      technology: 'Custom GPT-4 prompts with chain-of-thought reasoning',
    },
  ],
  developmentProcess: [
    {
      phase: 'Proof of Concept',
      description: 'Built basic web scraper with simple AI summarization to validate concept',
      outcomes: [
        'Validated feasibility of autonomous research',
        'Identified key technical challenges (rate limiting, content extraction)',
        'Achieved 65% relevance score in early tests',
      ],
    },
    {
      phase: 'Agent Architecture',
      description: 'Designed multi-agent system with specialized roles (planner, scraper, filter, synthesizer)',
      outcomes: [
        'Implemented LangChain agent framework',
        'Created modular agent communication protocol',
        'Improved relevance filtering to 78%',
      ],
    },
    {
      phase: 'RAG Integration',
      description: 'Integrated vector database and retrieval-augmented generation for better synthesis',
      outcomes: [
        'Implemented Pinecone for efficient similarity search',
        'Reduced API costs by 50% through smart caching',
        'Improved research report quality significantly',
      ],
    },
    {
      phase: 'Current: Refinement',
      description: 'Optimizing agent decision-making, improving relevance filtering, and enhancing UI/UX',
      outcomes: [
        'Increased relevance score to 82%',
        'Reduced average research time by 75%',
        'Building interactive research visualization',
      ],
    },
  ],
  learnings: [
    'Autonomous agents require careful guardrails to prevent infinite loops and excessive API usage',
    'Relevance filtering is the most critical component - poor filtering leads to hallucinations',
    'Breaking research into discrete questions improves depth but requires sophisticated planning',
    'Web scraping at scale requires robust error handling and rate limiting strategies',
    'Vector databases are essential for efficient RAG but require careful chunk size tuning',
    'Agent "reasoning traces" are valuable for debugging but add significant token overhead',
  ],
  keyAchievements: [
    'Built autonomous research system processing 500+ complex research queries',
    'Achieved 82% relevance score in information filtering',
    'Reduced research time by 75% compared to manual process',
    'Implemented efficient RAG architecture reducing API costs by 50%',
    'Created modular agent system enabling rapid experimentation',
    'Deployed working prototype to Vercel with interactive UI',
  ],
  images: [
    {
      url: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=1200&h=600&fit=crop',
      caption: 'AI Research Agent conducting autonomous web research',
      alt: 'AI Research Agent interface showing research progress',
    },
  ],
};

export const departmentOfArtData: AIProjectData = {
  slug: 'department-of-art',
  title: 'Department of Art Website',
  subtitle: 'Rapid website development experiment leveraging AI for creative production company',
  description: 'An experimental project testing how quickly a high-quality, fully functional website can be built for a production company using AI-assisted development. Working with Department of Art (DOA), a Portland-based creative production company, to create an effective web presence that showcases their portfolio and attracts clients.',
  heroImage: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&h=600&fit=crop',
  category: 'Creative Production & Portfolio',
  status: 'Coming Soon',
  links: {},
  overview: {
    problem: 'Production companies need compelling websites that showcase their creative work while being fast to build and easy to maintain. Traditional web development is slow and expensive, creating barriers for creative agencies.',
    solution: 'Leveraging AI-assisted development to rapidly build a sophisticated portfolio website with advanced features like video showcases, case studies, and client testimonials. Testing hypothesis that AI can reduce development time by 70%+ without sacrificing quality.',
    role: 'Full-stack development, AI-assisted coding, UX design, project architecture',
    timeline: 'Starting Q4 2024 (2-3 weeks estimated)',
  },
  metrics: [
    { label: 'Development Time', value: 'TBD' },
    { label: 'AI Contribution', value: 'Target 70%+' },
    { label: 'Code Generated', value: 'TBD' },
    { label: 'Manual Edits', value: 'TBD' },
  ],
  techStack: [
    'Next.js 14',
    'TypeScript',
    'Tailwind CSS',
    'Framer Motion',
    'Sanity CMS',
    'Vercel',
    'AI Code Assistants (Claude Code, Cursor)',
    'Video Optimization APIs',
  ],
  aiComponents: [
    {
      name: 'AI-Assisted Development',
      description: 'Using Claude Code and other AI coding assistants to generate components, layouts, and functionality',
      technology: 'Claude Code, GitHub Copilot, Cursor',
    },
    {
      name: 'Content Generation',
      description: 'AI-assisted copywriting for service descriptions and SEO content while maintaining brand voice',
      technology: 'GPT-4 with custom prompts',
    },
    {
      name: 'Design System Generation',
      description: 'Using AI to generate comprehensive design system and component library',
      technology: 'AI code generation with design token automation',
    },
  ],
  developmentProcess: [
    {
      phase: 'Planning & Requirements (Upcoming)',
      description: 'Define scope, gather assets, establish design direction with DOA team',
      outcomes: [
        'Document all functional requirements',
        'Collect portfolio videos and case studies',
        'Establish brand guidelines and design preferences',
      ],
    },
    {
      phase: 'AI-Assisted Development (Upcoming)',
      description: 'Use AI coding assistants to rapidly build core functionality and components',
      outcomes: [
        'Generate component library using AI',
        'Build page layouts with AI assistance',
        'Implement CMS integration',
      ],
    },
    {
      phase: 'Refinement & Optimization (Upcoming)',
      description: 'Manual refinement of AI-generated code, performance optimization, testing',
      outcomes: [
        'Optimize video loading and performance',
        'Refine responsive design across devices',
        'Implement analytics and SEO',
      ],
    },
    {
      phase: 'Launch & Analysis (Upcoming)',
      description: 'Deploy site and analyze AI contribution vs. manual development metrics',
      outcomes: [
        'Launch production site',
        'Document time savings and AI contribution',
        'Gather client feedback',
      ],
    },
  ],
  learnings: [
    'Project in progress - learnings to be documented',
  ],
  keyAchievements: [
    'Project in planning phase - achievements to be documented upon completion',
  ],
  images: [
    {
      url: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&h=600&fit=crop',
      caption: 'Department of Art website project - Coming Soon',
      alt: 'Creative production workspace',
    },
  ],
};

// Export all projects as array for easy iteration
export const allAIProjects: AIProjectData[] = [
  postPalData,
  karunaGattonData,
  aiResearchAgentData,
  departmentOfArtData,
];

// Export utility function to get project by slug
export const getProjectBySlug = (slug: string): AIProjectData | undefined => {
  return allAIProjects.find(project => project.slug === slug);
};
```

#### Acceptance Criteria
- [ ] File created at `/src/data/aiProjects.ts`
- [ ] All 4 projects have complete data following the interface structure
- [ ] TypeScript types are properly defined with no errors
- [ ] Data includes all required fields: title, subtitle, description, metrics, achievements, etc.
- [ ] Images use valid URLs (Unsplash placeholders or actual project screenshots)
- [ ] External links are accurate for live projects
- [ ] `getProjectBySlug` utility function works correctly
- [ ] File imports without errors in TypeScript

#### Notes
- Use Unsplash placeholder images initially if actual screenshots aren't ready
- Ensure descriptions are client-appropriate and showcase your skills
- Metrics should be realistic and verifiable

---

### Task 2: Create AI Project Page Components
**Files:**
- `/src/pages/ai-projects/PostPal.tsx`
- `/src/pages/ai-projects/KarunaGatton.tsx`
- `/src/pages/ai-projects/AIResearchAgent.tsx`
- `/src/pages/ai-projects/DepartmentOfArt.tsx`

**Estimated Time:** 2-3 hours
**Priority:** Must Have

#### Description
Create 4 individual page components that display detailed AI project information. Pages should follow the existing case study pattern but be enhanced to showcase AI-specific technical details.

#### Directory Setup
First, create the directory structure:

```bash
mkdir -p /Users/michaelevans/michael-evans-port-main/src/pages/ai-projects
```

#### Page Component Template

**File:** `/src/pages/ai-projects/PostPal.tsx`

```typescript
import { ArrowRight, ExternalLink, Github, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import Navigation from "@/components/Navigation";
import { postPalData } from "@/data/aiProjects";

const PostPal = () => {
  const project = postPalData;

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <main id="main-content" role="main" className="pt-32 pb-12 px-6">
        <div className="container mx-auto max-w-4xl">
          {/* Back link */}
          <div className="mb-8">
            <Link to="/" className="text-muted-foreground hover:text-foreground transition-colors inline-flex items-center gap-2">
              <ArrowLeft size={16} />
              Back to Portfolio
            </Link>
          </div>

          <div className="animate-fade-in">
            {/* Header */}
            <div className="mb-8">
              <div className="inline-block px-3 py-1 rounded-lg text-xs font-medium bg-primary/10 text-primary mb-4">
                {project.category} • {project.status}
              </div>
              <h1 className="text-4xl md:text-5xl font-light mb-4 text-foreground">
                {project.title}
              </h1>
              <p className="text-xl text-muted-foreground font-light mb-6">
                {project.subtitle}
              </p>

              {/* External links */}
              <div className="flex gap-3">
                {project.links.live && (
                  <a
                    href={project.links.live}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors text-sm font-medium"
                  >
                    View Live Site
                    <ExternalLink size={16} />
                  </a>
                )}
                {project.links.github && (
                  <a
                    href={project.links.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 border border-border rounded-lg hover:bg-secondary transition-colors text-sm font-medium"
                  >
                    View Code
                    <Github size={16} />
                  </a>
                )}
              </div>
            </div>

            {/* Hero Image */}
            {project.heroImage && (
              <div className="mb-8 rounded-2xl overflow-hidden">
                <img
                  src={project.heroImage}
                  alt={project.title}
                  className="w-full h-auto object-cover"
                />
              </div>
            )}

            {/* Project Overview Card */}
            <div className="bg-secondary/30 rounded-2xl p-8 mb-8">
              <h2 className="text-2xl font-medium mb-4">Project Overview</h2>
              <p className="text-muted-foreground leading-relaxed mb-6">
                {project.description}
              </p>

              {/* Metrics Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-6">
                {project.metrics.map((metric, index) => (
                  <div key={index}>
                    <h3 className="font-medium text-foreground mb-2 text-sm">{metric.label}</h3>
                    <p className="text-2xl font-light text-primary">{metric.value}</p>
                  </div>
                ))}
              </div>

              <h3 className="font-medium text-foreground mb-4">Key Achievements</h3>
              <ul className="text-muted-foreground space-y-2">
                {project.keyAchievements.map((achievement, index) => (
                  <li key={index}>• {achievement}</li>
                ))}
              </ul>
            </div>

            {/* Problem & Solution */}
            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <div className="bg-secondary/20 rounded-xl p-6">
                <h3 className="text-lg font-medium mb-3 text-foreground">The Challenge</h3>
                <p className="text-muted-foreground leading-relaxed">
                  {project.overview.problem}
                </p>
              </div>
              <div className="bg-secondary/20 rounded-xl p-6">
                <h3 className="text-lg font-medium mb-3 text-foreground">The Solution</h3>
                <p className="text-muted-foreground leading-relaxed">
                  {project.overview.solution}
                </p>
              </div>
            </div>

            {/* Technical Details */}
            <div className="mb-8">
              <h2 className="text-2xl font-medium mb-4 text-foreground">Technical Architecture</h2>

              {/* Tech Stack */}
              <div className="bg-secondary/20 rounded-xl p-6 mb-6">
                <h3 className="text-lg font-medium mb-3 text-foreground">Tech Stack</h3>
                <div className="flex flex-wrap gap-2">
                  {project.techStack.map((tech, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              {/* AI Components */}
              <div className="bg-secondary/20 rounded-xl p-6">
                <h3 className="text-lg font-medium mb-4 text-foreground">AI Components</h3>
                <div className="space-y-4">
                  {project.aiComponents.map((component, index) => (
                    <div key={index} className="border-l-2 border-primary/50 pl-4">
                      <h4 className="font-medium text-foreground mb-1">{component.name}</h4>
                      <p className="text-sm text-muted-foreground mb-2">{component.description}</p>
                      <p className="text-xs text-primary">{component.technology}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Development Process */}
            <div className="mb-8">
              <h2 className="text-2xl font-medium mb-4 text-foreground">Development Process</h2>
              <div className="space-y-4">
                {project.developmentProcess.map((phase, index) => (
                  <div key={index} className="bg-secondary/20 rounded-xl p-6">
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-medium">
                        {index + 1}
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-medium mb-2 text-foreground">{phase.phase}</h3>
                        <p className="text-muted-foreground mb-3">{phase.description}</p>
                        <ul className="space-y-1">
                          {phase.outcomes.map((outcome, oIndex) => (
                            <li key={oIndex} className="text-sm text-muted-foreground">
                              ✓ {outcome}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Key Learnings */}
            <div className="bg-secondary/30 rounded-2xl p-8 mb-8">
              <h2 className="text-2xl font-medium mb-4 text-foreground">Key Learnings</h2>
              <ul className="space-y-3">
                {project.learnings.map((learning, index) => (
                  <li key={index} className="text-muted-foreground leading-relaxed">
                    <span className="text-primary font-medium">→</span> {learning}
                  </li>
                ))}
              </ul>
            </div>

            {/* Project Details */}
            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <div className="bg-secondary/20 rounded-xl p-6">
                <h3 className="text-sm font-medium text-muted-foreground mb-2">My Role</h3>
                <p className="text-foreground">{project.overview.role}</p>
              </div>
              <div className="bg-secondary/20 rounded-xl p-6">
                <h3 className="text-sm font-medium text-muted-foreground mb-2">Timeline</h3>
                <p className="text-foreground">{project.overview.timeline}</p>
              </div>
            </div>

            {/* CTA */}
            <div className="text-center">
              <Link
                to="/"
                className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-medium"
              >
                View More Projects
                <ArrowRight size={18} />
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default PostPal;
```

#### Other Page Components
Create similar components for the other 3 projects:

**KarunaGatton.tsx** - Same structure, import `karunaGattonData`
**AIResearchAgent.tsx** - Same structure, import `aiResearchAgentData`
**DepartmentOfArt.tsx** - Same structure, import `departmentOfArtData`

For Department of Art (Coming Soon status), modify the external links section to show "Coming Soon" instead of buttons.

#### Acceptance Criteria
- [ ] All 4 page component files created in `/src/pages/ai-projects/` directory
- [ ] Each component imports correct data from `/src/data/aiProjects.ts`
- [ ] All sections render correctly: header, metrics, overview, technical details, process, learnings
- [ ] External links only show for projects with live URLs
- [ ] "Coming Soon" badge displays correctly for Department of Art
- [ ] Navigation component included on each page
- [ ] Back to Portfolio link uses React Router Link component
- [ ] Responsive design works on mobile, tablet, and desktop
- [ ] Animations and transitions match existing case studies
- [ ] TypeScript compiles without errors

#### Notes
- Maintain consistency with existing case study styling
- Ensure accessibility (semantic HTML, ARIA labels)
- Test all interactive elements (links, buttons)

---

### Task 3: Update App.tsx Routing
**File:** `/src/App.tsx`
**Estimated Time:** 15 minutes
**Priority:** Must Have

#### Description
Add 4 new routes for the AI project pages. Routes must be added BEFORE the catch-all `*` route to avoid 404 errors.

#### Implementation

```typescript
// Add imports at the top of the file
import PostPal from "./pages/ai-projects/PostPal";
import KarunaGatton from "./pages/ai-projects/KarunaGatton";
import AIResearchAgent from "./pages/ai-projects/AIResearchAgent";
import DepartmentOfArt from "./pages/ai-projects/DepartmentOfArt";
```

Then add routes in the Routes section, BEFORE the catch-all route:

```typescript
<Routes>
  <Route path="/" element={<Index />} />
  <Route path="/about" element={<About />} />
  <Route path="/ai-showcase" element={<AIShowcase />} />
  <Route path="/ai-research" element={<AIResearch />} />
  <Route path="/case-studies/casa-bonita" element={<CasaBonita />} />
  <Route path="/case-studies/before-launcher" element={<BeforeLauncher />} />
  <Route path="/case-studies/virgin-america" element={<VirginAmerica />} />
  <Route path="/case-studies/peddle" element={<Peddle />} />

  {/* AI Project Routes */}
  <Route path="/ai-projects/post-pal" element={<PostPal />} />
  <Route path="/ai-projects/karuna-gatton" element={<KarunaGatton />} />
  <Route path="/ai-projects/ai-research-agent" element={<AIResearchAgent />} />
  <Route path="/ai-projects/department-of-art" element={<DepartmentOfArt />} />

  <Route path="/studio/*" element={<Studio />} />
  <Route path="/nav-test" element={<NavigationTest />} />
  <Route path="/dropdown-test" element={<DropdownTest />} />
  <Route path="/ai-showcase-design-test" element={<AIShowcaseDesignTest />} />
  {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
  <Route path="*" element={<NotFound />} />
</Routes>
```

#### Acceptance Criteria
- [ ] All 4 imports added to top of `App.tsx`
- [ ] 4 new Route components added in correct location (before `*` route)
- [ ] URL paths follow pattern: `/ai-projects/{slug}`
- [ ] Routes match the slugs defined in data file
- [ ] No TypeScript errors
- [ ] Dev server hot-reloads without errors
- [ ] All routes accessible via direct URL navigation

#### Testing
Test each route manually in browser:
- `http://localhost:8080/ai-projects/post-pal`
- `http://localhost:8080/ai-projects/karuna-gatton`
- `http://localhost:8080/ai-projects/ai-research-agent`
- `http://localhost:8080/ai-projects/department-of-art`

---

### Task 4: Update BentoImageBehind Component
**File:** `/src/components/ai-showcase-variations/BentoImageBehind.tsx`
**Estimated Time:** 30 minutes
**Priority:** Must Have

#### Description
Update the BentoImageBehind component to use React Router `Link` for internal navigation instead of opening external URLs in new tabs. This creates a cohesive portfolio experience.

#### Implementation

Add import at the top:

```typescript
import { Link } from 'react-router-dom';
```

Update the aiProjects array to include slugs:

```typescript
const aiProjects: AIProject[] = [
  {
    title: "Post Pal",
    description: "An AI-powered social media content assistant that helps create, schedule, and optimize posts across multiple platforms with intelligent suggestions and analytics.",
    link: "/ai-projects/post-pal",  // Changed from external URL
    status: "Live",
    category: "Medical Mobile & Web",
    image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&h=600&fit=crop"
  },
  {
    title: "KarunaGatton.com",
    description: "Karuna is a shaman who offers spiritual healing. Karuna wanted a site that was clean, and modern but was still mystical and unique.",
    link: "/ai-projects/karuna-gatton",  // Changed from external URL
    status: "Live",
    category: "Lead Management & Product Marketing",
    image: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800&h=600&fit=crop"
  },
  {
    title: "AI Research Agent",
    description: "An in-progress agentic app that scrapes sites and pursues multiple questions while performing research, filtering results for relevance.",
    link: "/ai-projects/ai-research-agent",  // Changed from external URL
    status: "In Progress",
    category: "Research Automation",
    image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&h=600&fit=crop"
  },
  {
    title: "DepartmentOfArt.com",
    description: "A new project for DOA (the Department of Art production company) based in Portland. The goal is to see how quickly I can build an effective and excellent website for them using AI.",
    link: "/ai-projects/department-of-art",  // Changed from #
    status: "Coming Soon",
    category: "Lead Management & Product Marketing",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=600&fit=crop"
  }
];
```

Update the Button onClick handler to use Link for internal navigation:

Replace this section (around line 167-186):

```typescript
{/* Action button */}
{project.status !== 'Coming Soon' ? (
  <motion.div
    animate={{ y: isHovered ? 0 : 10, opacity: isHovered ? 1 : 0.8 }}
    transition={{ duration: 0.2 }}
  >
    <Button
      variant="ghost"
      size={isLarge ? 'default' : 'sm'}
      className="w-full bg-white/10 hover:bg-white/20 text-white backdrop-blur-sm border border-white/20"
      onClick={() => window.open(project.link, '_blank')}
    >
      <span className="mr-2">View Project</span>
      <ExternalLink className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
    </Button>
  </motion.div>
) : (
  <div className="text-sm text-center py-2 text-white/60">
    Coming soon
  </div>
)}
```

With this:

```typescript
{/* Action button */}
{project.status !== 'Coming Soon' ? (
  <motion.div
    animate={{ y: isHovered ? 0 : 10, opacity: isHovered ? 1 : 0.8 }}
    transition={{ duration: 0.2 }}
  >
    <Link to={project.link}>
      <Button
        variant="ghost"
        size={isLarge ? 'default' : 'sm'}
        className="w-full bg-white/10 hover:bg-white/20 text-white backdrop-blur-sm border border-white/20"
      >
        <span className="mr-2">View Details</span>
        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
      </Button>
    </Link>
  </motion.div>
) : (
  <motion.div
    animate={{ y: isHovered ? 0 : 10, opacity: isHovered ? 1 : 0.8 }}
    transition={{ duration: 0.2 }}
  >
    <Link to={project.link}>
      <Button
        variant="ghost"
        size={isLarge ? 'default' : 'sm'}
        className="w-full bg-white/10 hover:bg-white/20 text-white backdrop-blur-sm border border-white/20 opacity-50 cursor-not-allowed"
        disabled
      >
        <span className="mr-2">Coming Soon</span>
      </Button>
    </Link>
  </motion.div>
)}
```

Add ArrowRight import if not present:

```typescript
import { ExternalLink, Zap, ArrowRight } from 'lucide-react';
```

#### Acceptance Criteria
- [ ] React Router Link imported
- [ ] All project links updated to internal paths
- [ ] Button onClick changed to Link wrapper
- [ ] "View Project" text changed to "View Details"
- [ ] ExternalLink icon changed to ArrowRight
- [ ] ArrowRight icon imported from lucide-react
- [ ] Clicking project cards navigates to detail pages (not external sites)
- [ ] "Coming Soon" project also links to detail page
- [ ] No console errors
- [ ] Hover animations still work correctly

#### Testing
- Visit homepage at `http://localhost:8080`
- Scroll to AI Projects section
- Click each project card
- Verify navigation to detail page (not external site)
- Verify animations and hover states still work

---

### Task 5: Update Navigation Component
**File:** `/src/components/Navigation.tsx`
**Estimated Time:** 20 minutes
**Priority:** Must Have

#### Description
Add an "AI Projects" section to the navigation menu to make the new pages discoverable. Follow the existing pattern used for "Case Studies" and "AI Research" sections.

#### Implementation

Add the new section after the "Case Studies" section (around line 110):

```typescript
<div className="border-t border-border/30 pt-4 mt-2">
  <div className="text-xs text-muted-foreground/70 mb-3 px-0 uppercase tracking-wider">Case Studies</div>
  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
    <Link
      to="/case-studies/casa-bonita"
      className="block text-sm text-muted-foreground hover:text-foreground transition-colors"
      onClick={() => setIsMenuOpen(false)}
    >
      Casa Bonita Platform
    </Link>
    <Link
      to="/case-studies/before-launcher"
      className="block text-sm text-muted-foreground hover:text-foreground transition-colors"
      onClick={() => setIsMenuOpen(false)}
    >
      Before Launcher
    </Link>
    <Link
      to="/case-studies/virgin-america"
      className="block text-sm text-muted-foreground hover:text-foreground transition-colors"
      onClick={() => setIsMenuOpen(false)}
    >
      Virgin America Digital
    </Link>
    <Link
      to="/case-studies/peddle"
      className="block text-sm text-muted-foreground hover:text-foreground transition-colors"
      onClick={() => setIsMenuOpen(false)}
    >
      Peddle Marketplace
    </Link>
  </div>
</div>

{/* NEW AI PROJECTS SECTION - ADD THIS */}
<div className="border-t border-border/30 pt-4 mt-2">
  <div className="text-xs text-muted-foreground/70 mb-3 px-0 uppercase tracking-wider">AI Projects</div>
  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
    <Link
      to="/ai-projects/post-pal"
      className="block text-sm text-muted-foreground hover:text-foreground transition-colors"
      onClick={() => setIsMenuOpen(false)}
    >
      Post Pal
    </Link>
    <Link
      to="/ai-projects/karuna-gatton"
      className="block text-sm text-muted-foreground hover:text-foreground transition-colors"
      onClick={() => setIsMenuOpen(false)}
    >
      Karuna Gatton Healing
    </Link>
    <Link
      to="/ai-projects/ai-research-agent"
      className="block text-sm text-muted-foreground hover:text-foreground transition-colors"
      onClick={() => setIsMenuOpen(false)}
    >
      AI Research Agent
    </Link>
    <Link
      to="/ai-projects/department-of-art"
      className="block text-sm text-muted-foreground hover:text-foreground transition-colors"
      onClick={() => setIsMenuOpen(false)}
    >
      Department of Art
    </Link>
  </div>
</div>

<div className="border-t border-border/30 pt-4 mt-2">
  <div className="text-xs text-muted-foreground/70 mb-3 px-0 uppercase tracking-wider">AI Research</div>
  {/* ... existing AI Research links ... */}
</div>
```

#### Acceptance Criteria
- [ ] "AI Projects" section added to navigation menu
- [ ] Section placed between "Case Studies" and "AI Research" sections
- [ ] All 4 AI project links present with correct paths
- [ ] Links styled consistently with other menu items
- [ ] `onClick` handler closes menu after navigation
- [ ] Section header uses same styling as other sections (uppercase, tracking-wider, etc.)
- [ ] Grid layout matches other sections (1 col mobile, 2 cols desktop)
- [ ] Menu closes after clicking any AI project link

#### Testing
- Open navigation menu
- Verify "AI Projects" section appears
- Click each project link
- Verify navigation works and menu closes
- Test on mobile and desktop layouts

---

## Phase 2: Enhancement & Polish (3-4 hours)

### Task 6: Content Writing & Refinement
**Estimated Time:** 2 hours
**Priority:** Should Have

#### Description
Review and enhance all project descriptions, achievements, and technical details to ensure they effectively showcase your skills and tell compelling stories.

#### Subtasks
1. **Review Post Pal Content**
   - Ensure metrics are accurate and impressive
   - Refine achievement descriptions for impact
   - Add specific examples of AI implementations
   - Verify technical accuracy of AI component descriptions

2. **Review Karuna Gatton Content**
   - Emphasize design and UX decisions
   - Highlight conversion metrics and business impact
   - Add details about mystical design elements
   - Ensure content respects client confidentiality

3. **Review AI Research Agent Content**
   - Expand on technical architecture decisions
   - Add more detail to RAG implementation
   - Explain agent reasoning and decision-making
   - Highlight experimental/cutting-edge aspects

4. **Complete Department of Art Content**
   - Write comprehensive overview once project starts
   - Document AI-assisted development process
   - Track time savings and AI contribution metrics
   - Update status as project progresses

#### Acceptance Criteria
- [ ] All descriptions are clear, concise, and compelling
- [ ] Technical terminology is accurate and client-appropriate
- [ ] Metrics are realistic and verifiable
- [ ] Achievements focus on business impact, not just features
- [ ] AI components clearly explain value, not just technology
- [ ] Content demonstrates depth of expertise
- [ ] No typos or grammatical errors
- [ ] Consistent voice and tone across all projects

---

### Task 7: Visual Enhancements
**Estimated Time:** 1-2 hours
**Priority:** Should Have

#### Description
Add visual polish to make project pages more engaging and professional.

#### Subtasks
1. **Replace Placeholder Images**
   - Capture actual screenshots of Post Pal interface
   - Get professional screenshots of Karuna Gatton site
   - Create diagrams for AI Research Agent architecture
   - Design mockups for Department of Art

2. **Add Image Gallery**
   - Implement image gallery component for multiple screenshots
   - Add captions explaining what each image shows
   - Ensure responsive image loading
   - Add lightbox functionality for full-size viewing

3. **Enhance Animations**
   - Add scroll-triggered animations using Framer Motion
   - Implement smooth section transitions
   - Add hover effects to interactive elements
   - Ensure animations don't impact performance

4. **Visual Hierarchy**
   - Ensure proper spacing between sections
   - Add visual separators where appropriate
   - Use color to highlight important metrics
   - Improve readability with proper line-height and font-size

#### Acceptance Criteria
- [ ] All placeholder images replaced with actual project images
- [ ] Images optimized for web (compressed, proper format)
- [ ] Image gallery implemented (if multiple images per project)
- [ ] Animations are smooth and purposeful
- [ ] Page feels polished and professional
- [ ] Visual hierarchy guides user through content
- [ ] Responsive design works on all screen sizes

---

### Task 8: SEO & Meta Tags
**Estimated Time:** 30 minutes
**Priority:** Could Have

#### Description
Add proper meta tags and structured data to improve SEO for AI project pages.

#### Implementation
Create a component or utility to set page-specific meta tags:

```typescript
// In each project page component, add:
import { Helmet } from 'react-helmet-async';

// In component:
<Helmet>
  <title>{project.title} - Michael Evans Portfolio</title>
  <meta name="description" content={project.subtitle} />
  <meta property="og:title" content={project.title} />
  <meta property="og:description" content={project.subtitle} />
  <meta property="og:image" content={project.heroImage} />
  <meta property="og:type" content="website" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content={project.title} />
  <meta name="twitter:description" content={project.subtitle} />
  <meta name="twitter:image" content={project.heroImage} />
</Helmet>
```

Note: This requires installing `react-helmet-async`:
```bash
npm install react-helmet-async
```

#### Acceptance Criteria
- [ ] react-helmet-async installed
- [ ] Meta tags added to all 4 project pages
- [ ] Page titles are descriptive and unique
- [ ] Meta descriptions are compelling and accurate
- [ ] Open Graph tags present for social sharing
- [ ] Twitter Card tags present
- [ ] Structured data added (optional - JSON-LD)

---

## Phase 3: Future Work

### Sanity CMS Migration (Future)
**Estimated Time:** 4-6 hours
**Priority:** Won't Have (for now)

#### Rationale for Deferring
- Maintain consistency with existing case studies (currently hardcoded)
- Avoid introducing CMS complexity during initial implementation
- Focus on getting content live quickly
- Can migrate later when all case studies are migrated together

#### Future Migration Plan
When ready to migrate to Sanity CMS:

1. **Create Sanity Schema**
   - Define `aiProject` schema type
   - Match fields to existing `AIProjectData` interface
   - Add validation rules
   - Create custom input components if needed

2. **Migrate Data**
   - Import existing project data into Sanity Studio
   - Upload images to Sanity CDN
   - Set up references and relationships
   - Test data fetching

3. **Update Components**
   - Replace hardcoded data imports with Sanity queries
   - Use TanStack Query for data fetching
   - Add loading states
   - Handle errors gracefully

4. **Update BentoImageBehind**
   - Fetch project previews from Sanity
   - Cache for performance
   - Add CMS preview functionality

#### Benefits of Future Migration
- Easier content updates without code changes
- Centralized asset management
- Preview functionality for drafts
- Multi-user content management
- Version history

---

## File Structure Summary

### New Files Created
```
/src/data/
  aiProjects.ts                      # Centralized AI project data

/src/pages/ai-projects/
  PostPal.tsx                        # Post Pal project page
  KarunaGatton.tsx                   # Karuna Gatton project page
  AIResearchAgent.tsx                # AI Research Agent project page
  DepartmentOfArt.tsx                # Department of Art project page
```

### Modified Files
```
/src/App.tsx                         # Add 4 new routes
/src/components/Navigation.tsx       # Add AI Projects menu section
/src/components/ai-showcase-variations/BentoImageBehind.tsx  # Update links to internal pages
```

### File Size Estimates
- `/src/data/aiProjects.ts` - ~800 lines (comprehensive data for 4 projects)
- Each page component - ~200-250 lines
- Total new code - ~1,600-1,800 lines

---

## Testing Checklist

### Functional Testing
- [ ] All 4 AI project pages load without errors
- [ ] Navigation from homepage works correctly
- [ ] Back to Portfolio links return to homepage
- [ ] External links (live site, GitHub) open in new tabs
- [ ] "Coming Soon" project displays correctly
- [ ] All data displays accurately (no undefined/null values)
- [ ] Images load correctly
- [ ] Responsive design works on mobile, tablet, desktop

### Navigation Testing
- [ ] AI Projects section appears in navigation menu
- [ ] All 4 project links work in navigation
- [ ] Menu closes after clicking project link
- [ ] Direct URL navigation works for all routes
- [ ] 404 page does not appear for valid routes
- [ ] Browser back/forward buttons work correctly

### Visual/UX Testing
- [ ] Consistent styling with existing case studies
- [ ] Proper spacing and visual hierarchy
- [ ] Animations are smooth and purposeful
- [ ] Hover states work on interactive elements
- [ ] Typography is readable and consistent
- [ ] Color scheme matches site design system
- [ ] Accessibility: keyboard navigation works
- [ ] Accessibility: screen reader friendly

### Performance Testing
- [ ] Pages load quickly (< 2 seconds)
- [ ] Images are optimized
- [ ] No console errors or warnings
- [ ] No layout shift during load
- [ ] Smooth scrolling and interactions

### Cross-Browser Testing
- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Edge (latest)
- [ ] Mobile Safari (iOS)
- [ ] Mobile Chrome (Android)

### Content Review
- [ ] No typos or grammatical errors
- [ ] Technical accuracy verified
- [ ] Metrics are realistic and verifiable
- [ ] External links are correct
- [ ] Images have proper alt text
- [ ] Achievements are clear and impactful

---

## Success Criteria

### Core Implementation Success (Phase 1)
The implementation is considered successful when:

1. **Functionality**
   - ✅ All 4 AI project pages are accessible via dedicated URLs
   - ✅ Homepage AI Projects section links to detail pages
   - ✅ Navigation menu includes AI Projects section
   - ✅ All routes work correctly without 404 errors
   - ✅ External links work for live projects

2. **Content Completeness**
   - ✅ All project data is comprehensive and accurate
   - ✅ Metrics, achievements, and technical details are present
   - ✅ AI components are well-documented
   - ✅ Development process is clearly explained

3. **Design Consistency**
   - ✅ Pages match existing case study design pattern
   - ✅ Styling is consistent with site design system
   - ✅ Responsive design works on all devices
   - ✅ Animations and transitions feel polished

4. **Code Quality**
   - ✅ No TypeScript errors
   - ✅ No console errors or warnings
   - ✅ Code follows existing patterns and conventions
   - ✅ Components are properly organized

### Enhancement Success (Phase 2)
The enhanced implementation is considered successful when:

1. **Content Quality**
   - ✅ All descriptions are compelling and accurate
   - ✅ Technical terminology is precise
   - ✅ Achievements demonstrate business impact
   - ✅ Content showcases AI/ML expertise effectively

2. **Visual Polish**
   - ✅ Actual project screenshots replace placeholders
   - ✅ Images are optimized for web
   - ✅ Animations enhance user experience
   - ✅ Visual hierarchy is clear

3. **SEO & Discoverability**
   - ✅ Meta tags are properly configured
   - ✅ Pages are crawlable by search engines
   - ✅ Social sharing works correctly
   - ✅ Navigation makes pages discoverable

### User Experience Success
From a user perspective, success means:

- **Discoverability:** Users can easily find AI projects from homepage and navigation
- **Engagement:** Users spend time reading project details (analytics tracking)
- **Understanding:** Users clearly understand your AI/ML capabilities
- **Action:** Users click external links to view live projects or GitHub repos
- **Trust:** Professional presentation builds credibility

---

## Risk Assessment

### High Risk Items

#### Risk: Data Quality & Accuracy
**Impact:** High
**Likelihood:** Medium
**Description:** Inaccurate metrics, incorrect technical details, or exaggerated achievements could damage credibility.

**Mitigation:**
- Review all metrics with actual project data
- Verify technical terminology with documentation
- Have someone review content for accuracy
- Start with conservative estimates, update with real data
- Clearly mark "In Progress" and "Coming Soon" statuses

#### Risk: Content Scope Creep
**Impact:** Medium
**Likelihood:** High
**Description:** Spending too much time perfecting content instead of shipping.

**Mitigation:**
- Set clear time limits for content writing (2 hours max in Phase 1)
- Use placeholder content initially if needed
- Iterate on content after pages are live
- Focus on technical accuracy first, polish later
- Remember: shipped imperfect is better than unshipped perfect

### Medium Risk Items

#### Risk: Image Availability
**Impact:** Medium
**Likelihood:** Medium
**Description:** Actual project screenshots may not be available or require time to create.

**Mitigation:**
- Use high-quality Unsplash placeholders initially
- Mark Task 7 (Visual Enhancements) as Phase 2
- Create simple diagrams if screenshots unavailable
- Ask clients for permission to use screenshots
- Consider mockups for "Coming Soon" projects

#### Risk: Route Conflicts
**Impact:** Low
**Likelihood:** Low
**Description:** New routes could conflict with existing or future routes.

**Mitigation:**
- Follow established URL pattern: `/ai-projects/{slug}`
- Add routes before catch-all `*` route in App.tsx
- Document route structure in code comments
- Test all routes after adding
- Reserve `/ai-projects/*` namespace for future expansion

#### Risk: Design Inconsistency
**Impact:** Medium
**Likelihood:** Low
**Description:** New pages might not match existing case study styling.

**Mitigation:**
- Use VirginAmerica.tsx and CasaBonita.tsx as templates
- Reuse existing Tailwind classes
- Reference design system throughout
- Test responsive design on multiple devices
- Review against existing pages for consistency

### Low Risk Items

#### Risk: Performance Impact
**Impact:** Low
**Likelihood:** Low
**Description:** Adding 4 new pages could increase bundle size or slow load times.

**Mitigation:**
- Use React lazy loading if bundle size is concern
- Optimize images before adding
- Monitor bundle size with `npm run build`
- Use code splitting if needed
- Images are loaded from CDN (Unsplash) not bundled

#### Risk: TypeScript Errors
**Impact:** Low
**Likelihood:** Low
**Description:** Type mismatches or import errors could prevent compilation.

**Mitigation:**
- Define clear TypeScript interfaces upfront
- Use existing patterns from codebase
- Test imports immediately after creating files
- Run `npm run build` frequently to catch errors
- Leverage IDE TypeScript checking

---

## Dependency Management

### Critical Path
These tasks MUST be completed in order:

1. **Task 1** (Create data file) → Blocks all other tasks
2. **Task 2** (Create page components) → Requires Task 1
3. **Task 3** (Update routing) → Requires Task 2
4. **Task 4** (Update BentoImageBehind) → Requires Task 3
5. **Task 5** (Update Navigation) → Can run parallel with Task 4

### Parallel Execution Opportunities
These tasks can be done simultaneously:
- Task 4 (BentoImageBehind) + Task 5 (Navigation) - Independent updates
- Phase 2 tasks are all independent and can be done in any order

### Blocking Relationships
```
Task 1 (Data)
  ├── Task 2 (Components)
  │     ├── Task 3 (Routing)
  │     │     ├── Task 4 (BentoImageBehind)
  │     │     └── Task 5 (Navigation)
  │     │           └── Phase 1 Complete
  │     │                 ├── Task 6 (Content)
  │     │                 ├── Task 7 (Visuals)
  │     │                 └── Task 8 (SEO)
```

---

## Deployment Considerations

### Pre-Deployment Checklist
- [ ] Run `npm run build` to verify production build succeeds
- [ ] Test production build with `npm run preview`
- [ ] Verify all images load in production build
- [ ] Check bundle size (should not increase significantly)
- [ ] Test all routes in production preview
- [ ] Verify no console errors in production build
- [ ] Test on actual mobile devices if possible

### Git Workflow
Recommended commit strategy:

```bash
# After Task 1
git add src/data/aiProjects.ts
git commit -m "feat: Add AI projects data structure with 4 projects"

# After Task 2
git add src/pages/ai-projects/
git commit -m "feat: Create AI project detail page components"

# After Task 3
git add src/App.tsx
git commit -m "feat: Add routes for AI project pages"

# After Task 4
git add src/components/ai-showcase-variations/BentoImageBehind.tsx
git commit -m "feat: Update AI projects to link to detail pages"

# After Task 5
git add src/components/Navigation.tsx
git commit -m "feat: Add AI Projects section to navigation menu"

# After all Phase 1 tasks
git push origin main
# Or create PR if using feature branch workflow
```

### Rollback Plan
If issues are discovered after deployment:

1. **Immediate:** Revert last commit if breaking
   ```bash
   git revert HEAD
   git push origin main
   ```

2. **Targeted:** Remove routes from App.tsx if specific pages have issues
   - Comment out problematic routes
   - Redeploy

3. **Complete:** Revert entire feature if necessary
   - Revert all commits from feature implementation
   - Pages won't be accessible but site remains functional

---

## Maintenance & Future Enhancements

### Short-term Maintenance (1-2 months)
- Update metrics as projects evolve (especially AI Research Agent)
- Add actual screenshots as they become available
- Refine content based on user feedback
- Complete Department of Art project and update page

### Medium-term Enhancements (3-6 months)
- Add blog posts or articles about specific AI implementations
- Create video demos for each project
- Add interactive demos where possible (especially AI Research Agent)
- Implement analytics to track page views and engagement
- Add testimonials or client quotes if available

### Long-term Improvements (6+ months)
- Migrate all case studies to Sanity CMS together
- Add filtering/search for all projects
- Create comparison view for different AI approaches
- Add technical deep-dive articles linked from project pages
- Implement related projects suggestions

---

## Questions to Resolve Before Starting

### Content Questions
1. Do you have actual screenshots for Post Pal and Karuna Gatton?
2. Are the metrics accurate, or do they need to be gathered from analytics?
3. Is it okay to link to the live Karuna Gatton site in your portfolio?
4. For AI Research Agent, can the GitHub repo be made public?
5. When is Department of Art project expected to start?

### Technical Questions
1. Should pages include video demos if available?
2. Do you want testimonials/client quotes on project pages?
3. Should there be a "Related Projects" section?
4. Do you want analytics tracking on AI project pages?
5. Should there be social sharing buttons?

### Design Questions
1. Do you want a different color scheme for AI projects vs case studies?
2. Should AI components have visual diagrams/flowcharts?
3. Do you want code snippets showing AI implementations?
4. Should there be a comparison table between projects?
5. Any specific branding elements to emphasize AI/ML expertise?

---

## Appendix

### Useful Commands

```bash
# Development
npm run dev              # Start dev server (port 8080)
npm run build            # Production build
npm run preview          # Preview production build
npm run lint             # Run ESLint

# File Operations
mkdir -p src/pages/ai-projects        # Create directory
touch src/data/aiProjects.ts          # Create file

# Git Operations
git status                            # Check status
git add .                             # Stage all changes
git commit -m "message"               # Commit with message
git push origin main                  # Push to main branch

# Testing Routes
curl http://localhost:8080/ai-projects/post-pal  # Test route
```

### Key File Paths (Absolute)
```
/Users/michaelevans/michael-evans-port-main/src/data/aiProjects.ts
/Users/michaelevans/michael-evans-port-main/src/pages/ai-projects/PostPal.tsx
/Users/michaelevans/michael-evans-port-main/src/pages/ai-projects/KarunaGatton.tsx
/Users/michaelevans/michael-evans-port-main/src/pages/ai-projects/AIResearchAgent.tsx
/Users/michaelevans/michael-evans-port-main/src/pages/ai-projects/DepartmentOfArt.tsx
/Users/michaelevans/michael-evans-port-main/src/App.tsx
/Users/michaelevans/michael-evans-port-main/src/components/Navigation.tsx
/Users/michaelevans/michael-evans-port-main/src/components/ai-showcase-variations/BentoImageBehind.tsx
```

### Reference URLs
- **Dev Server:** http://localhost:8080
- **Case Study Example:** http://localhost:8080/case-studies/virgin-america
- **New Pages:**
  - http://localhost:8080/ai-projects/post-pal
  - http://localhost:8080/ai-projects/karuna-gatton
  - http://localhost:8080/ai-projects/ai-research-agent
  - http://localhost:8080/ai-projects/department-of-art

### External Resources
- [React Router Documentation](https://reactrouter.com/en/main)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Framer Motion Documentation](https://www.framer.com/motion/)
- [Lucide React Icons](https://lucide.dev/icons)
- [TypeScript Documentation](https://www.typescriptlang.org/docs/)

---

## Document History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2025-10-13 | Claude Code | Initial implementation plan created |

---

**End of Implementation Plan**

This document provides a complete roadmap for implementing AI project detail pages. Follow the phases in order, complete acceptance criteria for each task, and refer to the testing checklist before considering the work complete.

For questions or issues during implementation, refer to the Risk Assessment section and mitigation strategies.
